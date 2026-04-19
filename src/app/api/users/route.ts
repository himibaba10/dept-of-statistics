import { connectDB } from '@/lib/db';
import { errorResponse, successResponse } from '@/lib/apiResponse';
import User from '@/models/User';
import { NextRequest } from 'next/server';

// GET /api/users — public list, filter by role/status/session
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const session = searchParams.get('session');

    const filter: Record<string, unknown> = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (session) filter.session = session;

    const users = await User.find(filter)
      .select('-password -refreshToken')
      .lean();

    return successResponse(users);
  } catch (err) {
    console.error('[USERS_GET]', err);
    return errorResponse('Internal server error', 500);
  }
}
