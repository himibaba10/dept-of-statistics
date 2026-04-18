import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export type UserRole = 'teacher' | 'student' | 'official';

export interface IUser extends Document {
  name: string;
  email?: string;
  phone: string;
  address: IAddress;
  bloodGroup?: string;
  role: UserRole;
  isAdmin: boolean;
  password: string;
  refreshToken?: string;
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
      sparse: true, // allows multiple null values
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true
    },
    address: {
      type: addressSchema,
      default: {}
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    role: {
      type: String,
      enum: ['teacher', 'student', 'official'],
      required: [true, 'Role is required']
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // never returned in queries by default
    },
    refreshToken: {
      type: String,
      select: false
    }
  },
  {
    timestamps: true
  }
);

// Prevent model re-registration in dev hot-reloads
const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>('User', userSchema);

export default User;
