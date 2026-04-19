import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  code: string;
  description?: string;
  thumbnailUrl: string;
  syllabus: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    thumbnailUrl: { type: String, required: true },
    syllabus: { type: [String], default: [] }
  },
  { timestamps: true }
);

const Course: Model<ICourse> =
  mongoose.models.Course ?? mongoose.model<ICourse>('Course', CourseSchema);

export default Course;
