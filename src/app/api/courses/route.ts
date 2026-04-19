import { errorResponse, successResponse } from '@/lib/apiResponse';
import { isSeniorTeacher } from '@/lib/authHelpers';
import { connectDB } from '@/lib/db';
import { verifyAccessToken } from '@/lib/jwt';
import Course from '@/models/Course';
import User from '@/models/User';
import { NextRequest } from 'next/server';

// GET /api/courses — public
export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find().sort({ code: 1 }).lean();
    return successResponse(courses);
  } catch (err) {
    console.error('[GET_COURSES]', err);
    return errorResponse('Internal server error', 500);
  }
}

// POST /api/courses — senior teacher or admin only
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

    const user = await User.findById(payload.userId).lean();
    if (!user) return errorResponse('User not found', 404);

    if (!user.isAdmin && !isSeniorTeacher(user as never)) {
      return errorResponse('Forbidden', 403);
    }

    const body = await req.json();
    const { title, code, credit, description, syllabus } = body;

    if (!title || !code || credit === undefined) {
      return errorResponse('title, code, and credit are required', 400);
    }

    const existing = await Course.findOne({ code: code.trim() });
    if (existing) return errorResponse('Course code already exists', 409);

    const course = await Course.create({
      title: title.trim(),
      code: code.trim(),
      credit: Number(credit),
      description: description?.trim(),
      syllabus: Array.isArray(syllabus) ? syllabus : []
    });

    return successResponse(course, 201);
  } catch (err) {
    console.error('[POST_COURSE]', err);
    return errorResponse('Internal server error', 500);
  }
}
