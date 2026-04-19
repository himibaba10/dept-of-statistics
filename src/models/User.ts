import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export type UserRole = 'teacher' | 'student' | 'official';
export type UserStatus = 'pending' | 'active' | 'blocked';

export interface IUser extends Document {
  name: string;
  email?: string;
  phone: string;
  address: IAddress;
  bloodGroup?: string;
  gender?: 'male' | 'female';
  imageUrl?: string;
  role: UserRole;
  status: UserStatus;
  isAdmin: boolean;
  password: string;
  refreshToken?: string;

  // Student-only (optional)
  studentId?: string;
  session?: string;
  isCR?: boolean;

  // Teacher-only (optional)
  designation?: string;
  galleryUrls?: string[];

  // Official-only (optional)
  departmentRole?: string;

  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true, default: 'Bangladesh' }
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true
    },
    address: {
      type: addressSchema,
      required: [
        function (this: IUser) {
          return this.role === 'student' || this.role === 'official';
        },
        'Address is required for students and officials'
      ]
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    gender: {
      type: String,
      enum: ['male', 'female']
    },
    imageUrl: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: ['teacher', 'student', 'official'],
      required: [true, 'Role is required']
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'blocked'],
      default: 'pending'
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    refreshToken: {
      type: String,
      select: false
    },

    // Student fields
    studentId: {
      type: String,
      trim: true,
      required: [
        function (this) {
          return this.role === 'student';
        },
        'Student ID is required for students'
      ]
    },
    session: {
      type: String,
      trim: true,
      required: [
        function (this) {
          return this.role === 'student';
        },
        'Session is required for students'
      ]
    },
    isCR: {
      type: Boolean,
      default: false
    },

    // Teacher fields
    designation: {
      type: String,
      trim: true
    },
    galleryUrls: {
      type: [String],
      default: undefined
    },

    // Official fields
    departmentRole: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models?.User;
}

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
