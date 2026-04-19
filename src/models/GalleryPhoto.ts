import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IGalleryPhoto extends Document {
  url: string;
  caption?: string;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const galleryPhotoSchema = new Schema<IGalleryPhoto>(
  {
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true
    },
    caption: {
      type: String,
      trim: true
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const GalleryPhoto: Model<IGalleryPhoto> =
  mongoose.models.GalleryPhoto ??
  mongoose.model<IGalleryPhoto>('GalleryPhoto', galleryPhotoSchema);

export default GalleryPhoto;
