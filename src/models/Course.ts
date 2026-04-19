import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  code: string;
  credit: number;
  description?: string;
  syllabus: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    credit: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    syllabus: { type: [String], default: [] }
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models?.Course;
}

const Course: Model<ICourse> =
  mongoose.models.Course ?? mongoose.model<ICourse>('Course', CourseSchema);

export default Course;
