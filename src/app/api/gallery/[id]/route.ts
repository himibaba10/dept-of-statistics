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

// DELETE /api/gallery/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const photo = await GalleryPhoto.findById(id);
    if (!photo) return errorResponse('Photo not found', 404);

    // Non-admins can only delete their own uploads
    if (!user.isAdmin && photo.uploadedBy.toString() !== user._id.toString()) {
      return errorResponse('Forbidden', 403);
    }

    await photo.deleteOne();
    return successResponse({ message: 'Photo deleted' });
  } catch (err) {
    console.error('[GALLERY_DELETE]', err);
    return errorResponse('Internal server error', 500);
  }
}
