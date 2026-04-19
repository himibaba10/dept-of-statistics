import { connectDB } from '@/lib/db';
import { errorResponse, successResponse } from '@/lib/apiResponse';
import { verifyAccessToken } from '@/lib/jwt';
import GalleryPhoto from '@/models/GalleryPhoto';
import User from '@/models/User';
import { NextRequest } from 'next/server';

const SENIOR_DESIGNATIONS = ['professor', 'chairman'];

function canManageGallery(user: {
  role: string;
  isAdmin: boolean;
  isCR?: boolean;
  designation?: string;
}): boolean {
  if (user.isAdmin) return true;
  if (user.role === 'official') return true;
  if (user.role === 'student' && user.isCR) return true;
  if (
    user.role === 'teacher' &&
    SENIOR_DESIGNATIONS.includes(user.designation?.toLowerCase() ?? '')
  )
    return true;
  return false;
}

// GET /api/gallery — public
export async function GET() {
  try {
    await connectDB();
    const photos = await GalleryPhoto.find()
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name role')
      .lean();
    return successResponse(photos);
  } catch (err) {
    console.error('[GALLERY_GET]', err);
    return errorResponse('Internal server error', 500);
  }
}

// POST /api/gallery — authorized roles only
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer '))
      return errorResponse('Unauthorized', 401);

    let payload;
    try {
      payload = verifyAccessToken(authHeader.slice(7));
    } catch {
      return errorResponse('Invalid or expired token', 401);
    }

    const user = await User.findById(payload.userId);
    if (!user) return errorResponse('User not found', 404);
    if (!canManageGallery(user)) return errorResponse('Forbidden', 403);

    const { url, caption } = await req.json();
    if (!url) return errorResponse('url is required', 400);

    const photo = await GalleryPhoto.create({
      url,
      caption: caption || undefined,
      uploadedBy: user._id
    });

    return successResponse(photo, 201);
  } catch (err) {
    console.error('[GALLERY_POST]', err);
    return errorResponse('Internal server error', 500);
  }
}
