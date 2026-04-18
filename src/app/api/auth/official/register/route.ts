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
    const { name, email, phone, address, bloodGroup, password, isAdmin } = body;

    // Validation
    if (!name || !phone || !password) {
      return errorResponse('name, phone, and password are required', 400);
    }

    // Check duplicate email (if provided)
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return errorResponse('An account with this email already exists', 409);
      }
    }

    // Check duplicate phone
    const existingPhone = await User.findOne({ phone, role: 'official' });
    if (existingPhone) {
      return errorResponse(
        'An official account with this phone already exists',
        409
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email: email || undefined,
      phone,
      address: address ?? {},
      bloodGroup: bloodGroup || undefined,
      role: 'official',
      isAdmin: isAdmin ?? false,
      password: hashedPassword
    });

    // Issue tokens
    const payload = {
      userId: user._id.toString(),
      role: user.role,
      isAdmin: user.isAdmin
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Save refresh token to DB
    user.refreshToken = refreshToken;
    await user.save();

    return successResponse(
      {
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
      },
      201
    );
  } catch (err) {
    console.error('[OFFICIAL_REGISTER]', err);
    return errorResponse('Internal server error', 500);
  }
}
