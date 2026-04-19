import mongoose, { Document, Model, Schema } from 'mongoose';

export type NoticeType = 'notice' | 'event' | 'exam' | 'circular' | 'other';

export interface INotice extends Document {
  title: string;
  body: string;
  type: NoticeType;
  attachmentUrl?: string;
  publishedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const noticeSchema = new Schema<INotice>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    body: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['notice', 'event', 'exam', 'circular', 'other'],
      default: 'notice'
    },
    attachmentUrl: {
      type: String,
      trim: true
    },
    publishedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models?.Notice;
}

const Notice: Model<INotice> =
  mongoose.models.Notice ?? mongoose.model<INotice>('Notice', noticeSchema);

export default Notice;
