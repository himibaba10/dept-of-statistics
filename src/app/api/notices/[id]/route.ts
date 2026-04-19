import { connectDB } from '@/lib/db';
import { errorResponse, successResponse } from '@/lib/apiResponse';
import { verifyAccessToken } from '@/lib/jwt';
import Notice from '@/models/Notice';
import User from '@/models/User';
import { NextRequest } from 'next/server';

// DELETE /api/notices/[id] — official (own) or admin
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    if (user.role !== 'official' && !user.isAdmin) {
      return errorResponse('Forbidden', 403);
    }

    const { id } = await params;
    const notice = await Notice.findById(id);
    if (!notice) return errorResponse('Notice not found', 404);

    // Non-admin officials can only delete their own notices
    if (
      !user.isAdmin &&
      notice.publishedBy.toString() !== user._id.toString()
    ) {
      return errorResponse('Forbidden', 403);
    }

    await notice.deleteOne();
    return successResponse({ message: 'Notice deleted' });
  } catch (err) {
    console.error('[NOTICES_DELETE]', err);
    return errorResponse('Internal server error', 500);
  }
}

// PATCH /api/notices/[id] — edit notice
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    if (user.role !== 'official' && !user.isAdmin) {
      return errorResponse('Forbidden', 403);
    }

    const { id } = await params;
    const notice = await Notice.findById(id);
    if (!notice) return errorResponse('Notice not found', 404);

    if (
      !user.isAdmin &&
      notice.publishedBy.toString() !== user._id.toString()
    ) {
      return errorResponse('Forbidden', 403);
    }

    const body = await req.json();
    const { title, body: noticeBody, type, date, attachmentUrl } = body;

    if (title) notice.title = title;
    if (noticeBody) notice.body = noticeBody;
    if (type) notice.type = type;
    if (date) notice.date = new Date(date);
    if (attachmentUrl !== undefined) notice.attachmentUrl = attachmentUrl;

    await notice.save();
    return successResponse(notice);
  } catch (err) {
    console.error('[NOTICES_PATCH]', err);
    return errorResponse('Internal server error', 500);
  }
}
