export type Role = 'student' | 'teacher' | 'official';
export type UserStatus = 'pending' | 'active' | 'blocked';

export interface UserBase {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  bloodGroup?: string;
  gender?: 'male' | 'female';
  imageUrl?: string;
  role: Role;
  status: UserStatus;
  isAdmin: boolean;
}

export interface Student extends UserBase {
  role: 'student';
  studentId?: string;
  session?: string;
  isCR?: boolean;
}

export interface Teacher extends UserBase {
  role: 'teacher';
  designation?: string;
  galleryUrls?: string[];
}

export interface Official extends UserBase {
  role: 'official';
}

export type User = Student | Teacher | Official;

export interface Course {
  _id: string;
  code: string;
  title: string;
  description?: string;
  syllabus: string[];
  createdAt?: string;
  updatedAt?: string;
}
