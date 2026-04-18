import { connectDB } from '@/lib/db';
import { errorResponse, successResponse } from '@/lib/apiResponse';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, phone, address, bloodGroup, password } = body;

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

    // Check duplicate phone among officials
    const existingPhone = await User.findOne({ phone, role: 'official' });
    if (existingPhone) {
      return errorResponse(
        'An official account with this phone already exists',
        409
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: email || undefined,
      phone,
      address: address ?? {},
      bloodGroup: bloodGroup || undefined,
      role: 'official',
      status: 'pending', // awaiting admin approval
      isAdmin: false,
      password: hashedPassword
    });

    return successResponse(
      {
        message:
          'Registration successful. Your account is pending admin approval.',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt
        }
      },
      201
    );
  } catch (err) {
    console.error('[OFFICIAL_REGISTER]', err);
    return errorResponse('Internal server error', 500);
  }
}
