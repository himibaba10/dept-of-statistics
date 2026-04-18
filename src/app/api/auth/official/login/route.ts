import { connectDB } from '@/lib/db';
import { errorResponse, successResponse } from '@/lib/apiResponse';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { identifier, password } = body;
    // identifier = email or phone

    if (!identifier || !password) {
      return errorResponse(
        'identifier (email or phone) and password are required',
        400
      );
    }

    // Find official by email or phone, include password
    const user = await User.findOne({
      role: 'official',
      $or: [{ email: identifier.toLowerCase() }, { phone: identifier }]
    }).select('+password +refreshToken');

    if (!user) {
      return errorResponse('Invalid credentials', 401);
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse('Invalid credentials', 401);
    }

    // Issue tokens
    const payload = {
      userId: user._id.toString(),
      role: user.role,
      isAdmin: user.isAdmin
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Rotate refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    return successResponse({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        bloodGroup: user.bloodGroup,
        role: user.role,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      },
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error('[OFFICIAL_LOGIN]', err);
    return errorResponse('Internal server error', 500);
  }
}
