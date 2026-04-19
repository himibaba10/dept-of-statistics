import { errorResponse, successResponse } from '@/lib/apiResponse';
import { connectDB } from '@/lib/db';
import { verifyAccessToken } from '@/lib/jwt';
import User from '@/models/User';
import crypto from 'crypto';
import { NextRequest } from 'next/server';
import sharp from 'sharp';

const CLOUD_NAME = 'dgzjxbkez';
const API_KEY = process.env.CLOUDINARY_API_KEY!;
const API_SECRET = process.env.CLOUDINARY_API_SECRET!;

const FOLDER_MAP: Record<string, string> = {
  student: 'Dept of Statistics/students',
  teacher: 'Dept of Statistics/teachers',
  official: 'Dept of Statistics/officials',
  notice: 'Dept of Statistics/notices',
  gallery: 'Dept of Statistics/gallery',
  course: 'Dept of Statistics/courses/thumbnails',
  syllabus: 'Dept of Statistics/courses/syllabus',
  hero: 'Dept of Statistics/hero'
};

function signRequest(params: Record<string, string>, secret: string): string {
  // Alphabetical order, joined as key=value&..., then SHA-1 with secret appended
  const str =
    Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join('&') + secret;
  return crypto.createHash('sha1').update(str).digest('hex');
}

// POST /api/upload/image — compress + signed upload to Cloudinary
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return errorResponse('Unauthorized', 401);
    }

    let payload;
    try {
      payload = verifyAccessToken(authHeader.slice(7));
    } catch {
      return errorResponse('Invalid or expired token', 401);
    }

    const user = await User.findById(payload.userId);
    if (!user) return errorResponse('User not found', 404);

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return errorResponse('No file provided', 400);

    // Optional explicit folder key (e.g. 'notice'), falls back to role
    const folderKey =
      (formData.get('folderKey') as string | null) ?? payload.role;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return errorResponse(
        'Only JPEG, PNG, WebP, or GIF images are allowed',
        400
      );
    }
    if (file.size > 10 * 1024 * 1024) {
      return errorResponse('File too large (max 10MB)', 400);
    }

    // Compress — max 800x800, WebP, quality 80
    const buffer = Buffer.from(await file.arrayBuffer());
    const compressed = await sharp(buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const folder =
      FOLDER_MAP[folderKey] ?? FOLDER_MAP[payload.role] ?? 'Dept of Statistics';
    const timestamp = String(Math.floor(Date.now() / 1000));

    const firstName = user.name
      .split(' ')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    const idPart = (user.studentId || user._id.toString().slice(-6))
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const publicId = `${firstName}-${idPart}-${timestamp}`;

    const paramsToSign: Record<string, string> = {
      folder,
      public_id: publicId,
      overwrite: 'true',
      invalidate: 'true',
      timestamp
    };
    const signature = signRequest(paramsToSign, API_SECRET);

    const cloudForm = new FormData();
    cloudForm.append(
      'file',
      new Blob([compressed.buffer as ArrayBuffer], { type: 'image/webp' })
    );
    cloudForm.append('folder', folder);
    cloudForm.append('public_id', publicId);
    cloudForm.append('overwrite', 'true');
    cloudForm.append('invalidate', 'true');
    cloudForm.append('timestamp', timestamp);
    cloudForm.append('api_key', API_KEY);
    cloudForm.append('signature', signature);

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: cloudForm }
    );

    if (!cloudRes.ok) {
      const err = await cloudRes.text();
      console.error('[CLOUDINARY_UPLOAD]', err);
      return errorResponse('Cloudinary upload failed', 502);
    }

    const cloudData = await cloudRes.json();
    return successResponse({ url: cloudData.secure_url as string });
  } catch (err) {
    console.error('[UPLOAD_IMAGE]', err);
    return errorResponse('Internal server error', 500);
  }
}
