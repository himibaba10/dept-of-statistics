import { errorResponse, successResponse } from '@/lib/apiResponse';
import { verifyAccessToken } from '@/lib/jwt';
import sharp from 'sharp';
import { NextRequest } from 'next/server';

const CLOUD_NAME = 'dgzjxbkez';
const UPLOAD_PRESET = 'dept of statistics';

const FOLDER_MAP: Record<string, string> = {
  student: 'Dept of Statistics/students',
  teacher: 'Dept of Statistics/teachers',
  official: 'Dept of Statistics/officials'
};

// POST /api/upload/image — compress + upload to Cloudinary, return secure_url
export async function POST(req: NextRequest) {
  try {
    // Auth check
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

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) return errorResponse('No file provided', 400);

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

    // Compress with sharp — resize to max 800x800, convert to webp, quality 80
    const buffer = Buffer.from(await file.arrayBuffer());
    const compressed = await sharp(buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    // Upload to Cloudinary via unsigned upload
    const folder = FOLDER_MAP[payload.role] ?? 'Dept of Statistics';
    const cloudForm = new FormData();
    cloudForm.append(
      'file',
      new Blob([compressed.buffer as ArrayBuffer], { type: 'image/webp' })
    );
    cloudForm.append('upload_preset', UPLOAD_PRESET);
    cloudForm.append('folder', folder);

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
