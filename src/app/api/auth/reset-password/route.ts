import { errorResponse, successResponse } from '@/lib/apiResponse';
import { connectDB } from '@/lib/db';
import { verifyAccessToken } from '@/lib/jwt';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

export async function PUT(req: NextRequest) {
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

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return errorResponse('Old and new passwords are required', 400);
    }

    if (newPassword.length < 6) {
      return errorResponse('New password must be at least 6 characters', 400);
    }

    const user = await User.findById(payload.userId).select('+password');
    if (!user) {
      return errorResponse('User not found', 404);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return errorResponse('Incorrect old password', 400);
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return successResponse({ message: 'Password updated successfully' }, 200);
  } catch (err) {
    console.error('[RESET_PASSWORD]', err);
    return errorResponse('Internal server error', 500);
  }
}
