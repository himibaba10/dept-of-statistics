import { errorResponse, successResponse } from '@/lib/apiResponse';
import { connectDB } from '@/lib/db';
import { verifyAccessToken } from '@/lib/jwt';
import User from '@/models/User';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return errorResponse('Unauthorized', 401);
    }

    let payload: { userId: string };
    try {
      payload = verifyAccessToken(authHeader.slice(7)) as { userId: string };
    } catch {
      return errorResponse('Invalid or expired token', 401);
    }

    const user = await User.findById(payload.userId);
    if (!user) return errorResponse('User not found', 404);

    // Only Admin or Officials can reorder teachers (or Senior designated teachers if desired)
    if (!user.isAdmin && user.role !== 'official') {
      return errorResponse('Valid authorization required', 403);
    }

    const body = await req.json();
    const { teacherIds } = body;

    if (!Array.isArray(teacherIds)) {
      return errorResponse(
        'Invalid payload format. Expected an array of teacherIds.',
        400
      );
    }

    // Update the sortOrder for each provided teacher _id sequentially
    const bulkOps = teacherIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, role: 'teacher' },
        update: { $set: { sortOrder: index } }
      }
    }));

    if (bulkOps.length > 0) {
      await User.bulkWrite(bulkOps);
    }

    return successResponse({ message: 'Teachers reordered successfully' });
  } catch (err) {
    console.error('[TEACHERS_REORDER]', err);
    return errorResponse('Internal server error', 500);
  }
}
