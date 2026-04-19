import { connectDB } from '@/lib/db';
import { errorResponse, successResponse } from '@/lib/apiResponse';
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
      address,
      studentId,
      session
    } = body;

    if (!name || !phone || !password) {
      return errorResponse('name, phone, and password are required', 400);
    }

    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return errorResponse('An account with this email already exists', 409);
      }
    }

    const existingPhone = await User.findOne({ phone, role: 'student' });
    if (existingPhone) {
      return errorResponse(
        'A student account with this phone already exists',
        409
      );
    }

    if (studentId) {
      const existingStudentId = await User.findOne({
        studentId,
        role: 'student'
      });
      if (existingStudentId) {
        return errorResponse(
          'A student with this student ID already exists',
          409
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: email || undefined,
      phone,
      address: address ?? {},
      bloodGroup: bloodGroup || undefined,
      role: 'student',
      status: 'pending', // awaiting CR approval
      isAdmin: false,
      password: hashedPassword,
      studentId: studentId || undefined,
      session: session || undefined
    });

    return successResponse(
      {
        message: 'Registration successful.',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
          studentId: user.studentId,
          session: user.session,
          createdAt: user.createdAt
        }
      },
      201
    );
  } catch (err) {
    console.error('[STUDENT_REGISTER]', err);
    return errorResponse('Internal server error', 500);
  }
}
