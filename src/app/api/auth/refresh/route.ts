import { errorResponse, successResponse } from '@/lib/apiResponse';
import { signAccessToken, verifyRefreshToken } from '@/lib/jwt';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return errorResponse('Refresh token required', 400);
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return errorResponse('Invalid or expired refresh token', 401);
    }

    const newAccessToken = signAccessToken({
      userId: payload.userId,
      role: payload.role,
      isAdmin: payload.isAdmin
    });

    return successResponse({ accessToken: newAccessToken });
  } catch (err) {
    console.error('[AUTH_REFRESH]', err);
    return errorResponse('Internal server error', 500);
  }
}
