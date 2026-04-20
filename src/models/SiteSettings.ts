import mongoose, { Document, Schema } from 'mongoose';

export interface HeroSlide {
  src: string;
  headline: string;
  sub: string;
  body: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface ISiteSettings extends Document {
  heroSlides: HeroSlide[];
  contact: ContactInfo;
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

const ContactInfoSchema = new Schema<ContactInfo>(
  {
    email: { type: String, default: 'statistics@cu.ac.bd' },
    phone: { type: String, default: '+880-31-726-310' },
    address: {
      type: String,
      default: 'Dept. of Statistics, University of Chittagong, Chattogram 4331'
    }
  },
  { _id: false }
);

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    heroSlides: { type: [HeroSlideSchema], default: [] },
    contact: { type: ContactInfoSchema, default: () => ({}) }
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
