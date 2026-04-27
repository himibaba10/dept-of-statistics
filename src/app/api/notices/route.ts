import { errorResponse, successResponse } from '@/lib/apiResponse';
import { connectDB } from '@/lib/db';
import { verifyAccessToken } from '@/lib/jwt';
import Notice from '@/models/Notice';
import User from '@/models/User';
import { NextRequest } from 'next/server';

const SENIOR_DESIGNATIONS = ['professor', 'chairman'];

// GET /api/notices — public, returns all notices sorted by date desc
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') ?? '50');

    const filter: Record<string, unknown> = {};
    if (type) filter.type = type;

    const notices = await Notice.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('publishedBy', 'name role')
      .lean();

    return successResponse(notices);
  } catch (err) {
    console.error('[NOTICES_GET]', err);
    return errorResponse('Internal server error', 500);
  }
}

// POST /api/notices — official or admin only
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

    const isSeniorTeacher =
      user.role === 'teacher' &&
      SENIOR_DESIGNATIONS.includes(user.designation?.toLowerCase() ?? '');

    if (user.role !== 'official' && !user.isAdmin && !isSeniorTeacher) {
      return errorResponse('Forbidden', 403);
    }

    const body = await req.json();
    const { title, body: noticeBody, type, attachmentUrl } = body;

    if (!title || !noticeBody) {
      return errorResponse('title and body are required', 400);
    }

    const notice = await Notice.create({
      title,
      body: noticeBody,
      type: type ?? 'notice',
      attachmentUrl: attachmentUrl || undefined,
      publishedBy: user._id
    });

    return successResponse(notice, 201);
  } catch (err) {
    console.error('[NOTICES_POST]', err);
    return errorResponse('Internal server error', 500);
  }
}
