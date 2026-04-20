import { errorResponse, successResponse } from '@/lib/apiResponse';
import { connectDB } from '@/lib/db';
import { verifyAccessToken } from '@/lib/jwt';
import SiteSettings from '@/models/SiteSettings';
import User from '@/models/User';
import { NextRequest } from 'next/server';

// GET /api/settings — public
export async function GET() {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne().lean();
    return successResponse(settings ?? { heroSlides: [] });
  } catch (err) {
    console.error('[GET_SETTINGS]', err);
    return errorResponse('Internal server error', 500);
  }
}

// PATCH /api/settings — admin only
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer '))
      return errorResponse('Unauthorized', 401);

    let payload;
    try {
      payload = verifyAccessToken(authHeader.slice(7));
    } catch {
      return errorResponse('Invalid or expired token', 401);
    }

    const user = await User.findById(payload.userId).lean();
    if (!user) return errorResponse('User not found', 404);
    if (!user.isAdmin) return errorResponse('Forbidden', 403);

    const body = await req.json();
    const { heroSlides, contact } = body;

    const update: Record<string, unknown> = {};

    if (heroSlides !== undefined) {
      if (!Array.isArray(heroSlides)) {
        return errorResponse('heroSlides must be an array', 400);
      }
      for (const slide of heroSlides) {
        if (!slide.src || !slide.headline || !slide.sub || !slide.body) {
          return errorResponse(
            'Each slide requires src, headline, sub, and body',
            400
          );
        }
      }
      update.heroSlides = heroSlides;
    }

    if (contact !== undefined) {
      if (!contact.email || !contact.phone || !contact.address) {
        return errorResponse('contact requires email, phone, and address', 400);
      }
      update.contact = contact;
    }

    const settings = await SiteSettings.findOneAndUpdate(
      {},
      { $set: update },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    return successResponse(settings);
  } catch (err) {
    console.error('[PATCH_SETTINGS]', err);
    return errorResponse('Internal server error', 500);
  }
}
