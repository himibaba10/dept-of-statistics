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

    if (!identifier || !password) {
      return errorResponse(
        'identifier (email, phone, or student ID) and password are required',
        400
      );
    }

    const user = await User.findOne({
      role: 'student',
      $or: [
        { email: identifier.toLowerCase() },
        { phone: identifier },
        { studentId: identifier }
      ]
    }).select('+password +refreshToken');

    if (!user) {
      return errorResponse('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse('Invalid credentials', 401);
    }

    if (user.status === 'pending') {
      return errorResponse(
        'Your account is pending approval from your class representative.',
        403
      );
    }
    if (user.status === 'blocked') {
      return errorResponse(
        'Your account has been blocked. Contact the administrator.',
        403
      );
    }

    const payload = {
      userId: user._id.toString(),
      role: user.role,
      isAdmin: user.isAdmin
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

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
        imageUrl: user.imageUrl,
        role: user.role,
        status: user.status,
        isAdmin: user.isAdmin,
        studentId: user.studentId,
        session: user.session,
        isCR: user.isCR,
        createdAt: user.createdAt
      },
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error('[STUDENT_LOGIN]', err);
    return errorResponse('Internal server error', 500);
  }
}
