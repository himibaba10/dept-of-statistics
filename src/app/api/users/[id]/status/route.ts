import { errorResponse, successResponse } from '@/lib/apiResponse';
import { connectDB } from '@/lib/db';
import { verifyAccessToken } from '@/lib/jwt';
import User from '@/models/User';
import { NextRequest } from 'next/server';

const SENIOR_DESIGNATIONS = ['professor', 'chairman'];

// PATCH /api/users/[id]/status — CR approves own-session students, senior teachers approve teachers, admin approves anyone
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
      payload = verifyAccessToken(authHeader.split(' ')[1]);
    } catch {
      return errorResponse('Invalid or expired token', 401);
    }

    const requester = await User.findById(payload.userId);
    if (!requester) return errorResponse('User not found', 404);

    const isCR = requester.role === 'student' && requester.isCR;
    const isAdmin = requester.isAdmin;
    const isSeniorTeacher =
      requester.role === 'teacher' &&
      SENIOR_DESIGNATIONS.includes(requester.designation?.toLowerCase() ?? '');

    if (!isCR && !isAdmin && !isSeniorTeacher) {
      return errorResponse('Forbidden', 403);
    }

    const { id } = await params;
    const target = await User.findById(id);
    if (!target) return errorResponse('Target user not found', 404);

    const { status } = await req.json();
    if (!['active', 'blocked', 'pending'].includes(status)) {
      return errorResponse('Invalid status value', 400);
    }

    // CR can only activate students in their own session
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
      if (status !== 'active') {
        return errorResponse('CR can only activate students', 403);
      }
    }

    // Senior teachers can only activate pending teachers
    if (isSeniorTeacher && !isAdmin) {
      if (target.role !== 'teacher') {
        return errorResponse('Can only approve teachers', 403);
      }
      if (status !== 'active') {
        return errorResponse('Senior teachers can only activate teachers', 403);
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
