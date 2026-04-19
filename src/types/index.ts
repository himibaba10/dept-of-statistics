export type Role = 'student' | 'teacher' | 'official';

export interface UserBase {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  bloodGroup: string;
  imageUrl: string;
  role: Role;
}

export interface Student extends UserBase {
  role: 'student';
  studentId: string;
  session: string;
  isCR: boolean;
}

export interface Teacher extends UserBase {
  role: 'teacher';
  designation: string;
  galleryUrls: string[];
  hasAdminAccess: boolean;
}

export type UserStatus = 'pending' | 'active' | 'blocked';

export interface Official extends UserBase {
  role: 'official';
  departmentRole: string;
  status: UserStatus;
  isAdmin: boolean;
}

export type User = Student | Teacher | Official;

export interface Course {
  _id: string;
  code: string;
  title: string;
  syllabusImageUrl: string;
  instructorId: string;
}
