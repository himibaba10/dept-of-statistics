import { errorResponse, successResponse } from '@/lib/apiResponse';
import { connectDB } from '@/lib/db';
import { isSeniorTeacher } from '@/lib/authHelpers';
import { verifyAccessToken } from '@/lib/jwt';
import Course from '@/models/Course';
import User from '@/models/User';
import { NextRequest } from 'next/server';

// GET /api/courses/[id] — public
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const course = await Course.findById(id).lean();
    if (!course) return errorResponse('Course not found', 404);
    return successResponse(course);
  } catch (err) {
    console.error('[GET_COURSE]', err);
    return errorResponse('Internal server error', 500);
  }
}

// PATCH /api/courses/[id] — senior teacher or admin only
export async function PATCH(
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

    const user = await User.findById(payload.userId).lean();
    if (!user) return errorResponse('User not found', 404);
    if (!user.isAdmin && !isSeniorTeacher(user as never)) {
      return errorResponse('Forbidden', 403);
    }

    const { id } = await params;
    const body = await req.json();

    // Check code uniqueness if changing code
    if (body.code) {
      const existing = await Course.findOne({
        code: body.code.trim(),
        _id: { $ne: id }
      });
      if (existing) return errorResponse('Course code already exists', 409);
      body.code = body.code.trim();
    }
    if (body.title) body.title = body.title.trim();
    if (body.description) body.description = body.description.trim();

    const course = await Course.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    }).lean();
    if (!course) return errorResponse('Course not found', 404);

    return successResponse(course);
  } catch (err) {
    console.error('[PATCH_COURSE]', err);
    return errorResponse('Internal server error', 500);
  }
}

// DELETE /api/courses/[id] — senior teacher or admin only
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

    const user = await User.findById(payload.userId).lean();
    if (!user) return errorResponse('User not found', 404);
    if (!user.isAdmin && !isSeniorTeacher(user as never)) {
      return errorResponse('Forbidden', 403);
    }

    const { id } = await params;
    const course = await Course.findByIdAndDelete(id);
    if (!course) return errorResponse('Course not found', 404);

    return successResponse({ message: 'Course deleted' });
  } catch (err) {
    console.error('[DELETE_COURSE]', err);
    return errorResponse('Internal server error', 500);
  }
}
