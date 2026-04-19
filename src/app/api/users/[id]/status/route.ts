import { connectDB } from '@/lib/db';
import { errorResponse, successResponse } from '@/lib/apiResponse';
import { verifyAccessToken } from '@/lib/jwt';
import User from '@/models/User';
import { NextRequest } from 'next/server';

// PATCH /api/users/[id]/status — CR approves own-session students, admin approves anyone
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

    const requester = await User.findById(payload.userId);
    if (!requester) return errorResponse('User not found', 404);

    const isCR = requester.role === 'student' && requester.isCR;
    const isAdmin = requester.isAdmin;

    if (!isCR && !isAdmin) {
      return errorResponse('Forbidden', 403);
    }

    const { id } = await params;
    const target = await User.findById(id);
    if (!target) return errorResponse('Target user not found', 404);

    const { status } = await req.json();
    if (!['active', 'blocked', 'pending'].includes(status)) {
      return errorResponse('Invalid status value', 400);
    }

    // CR can only approve students in their own session
    if (isCR && !isAdmin) {
      if (target.role !== 'student') {
        return errorResponse('CR can only approve students', 403);
      }
      if (target.session !== requester.session) {
        return errorResponse(
          'CR can only approve students from their own session',
          403
        );
      }
      // CR can only activate (not block)
      if (status !== 'active') {
        return errorResponse('CR can only activate students', 403);
      }
    }

    target.status = status;
    await target.save();

    return successResponse({
      _id: target._id,
      name: target.name,
      status: target.status
    });
  } catch (err) {
    console.error('[USER_STATUS_PATCH]', err);
    return errorResponse('Internal server error', 500);
  }
}
