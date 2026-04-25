import { errorResponse, successResponse } from '@/lib/apiResponse';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      name,
      email,
      phone,
      password,
      bloodGroup,
      gender,
      address,
      designation
    } = body;

    if (!name || !email || !password || !designation) {
      return errorResponse(
        'name, email, designation, and password are required',
        400
      );
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return errorResponse('An account with this email already exists', 409);
    }

    if (phone) {
      const existingPhone = await User.findOne({ phone, role: 'teacher' });
      if (existingPhone) {
        return errorResponse(
          'A teacher account with this phone already exists',
          409
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      phone: phone || undefined,
      address: address ?? {},
      bloodGroup: bloodGroup || undefined,
      gender: gender || undefined,
      role: 'teacher',
      status: 'pending', // teachers need admin approval
      isAdmin: false,
      password: hashedPassword,
      designation: designation || undefined
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
          designation: user.designation,
          createdAt: user.createdAt
        }
      },
      201
    );
  } catch (err: unknown) {
    console.error('[TEACHER_REGISTER]', err);
    if (
      err &&
      typeof err === 'object' &&
      'name' in err &&
      (err as Error).name === 'ValidationError'
    ) {
      const mongooseErr = err as unknown as {
        errors: Record<string, { message: string }>;
      };
      const messages = Object.values(mongooseErr.errors).map(
        (val) => val.message
      );
      return errorResponse(messages.join(', '), 400);
    }
    return errorResponse('Internal server error', 500);
  }
}
