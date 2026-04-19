import mongoose, { Document, Schema } from 'mongoose';

export interface HeroSlide {
  src: string;
  headline: string;
  sub: string;
  body: string;
}

export interface ISiteSettings extends Document {
  heroSlides: HeroSlide[];
}

const HeroSlideSchema = new Schema<HeroSlide>(
  {
    src: { type: String, required: true },
    headline: { type: String, required: true },
    sub: { type: String, required: true },
    body: { type: String, required: true }
  },
  { _id: false }
);

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    heroSlides: { type: [HeroSlideSchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
