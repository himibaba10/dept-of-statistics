import { connectDB } from '@/lib/db';
import { errorResponse, successResponse } from '@/lib/apiResponse';
import { verifyAccessToken } from '@/lib/jwt';
import User from '@/models/User';
import { NextRequest } from 'next/server';

// PATCH /api/users/me — update own profile fields
export async function PATCH(req: NextRequest) {
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

    const body = await req.json();

    // Whitelist — only these fields can be self-updated
    const allowed = [
      'name',
      'email',
      'phone',
      'address',
      'bloodGroup',
      'imageUrl'
    ];

    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    if (Object.keys(updates).length === 0) {
      return errorResponse('No valid fields to update', 400);
    }

    const user = await User.findByIdAndUpdate(
      payload.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) return errorResponse('User not found', 404);

    return successResponse(user);
  } catch (err) {
    console.error('[USERS_ME_PATCH]', err);
    return errorResponse('Internal server error', 500);
  }
}
