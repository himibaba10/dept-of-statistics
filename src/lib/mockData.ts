import { Course, Official, Student, Teacher } from '@/types';

export const mockOfficials: Official[] = [
  {
    _id: 'o1',
    name: 'Mr. Robert Admin',
    email: 'robert@university.edu',
    phone: '999-888-7777',
    address: 'Admin Block, West Wing',
    bloodGroup: 'B+',
    imageUrl: 'https://i.pravatar.cc/150?u=o1',
    role: 'official',
    departmentRole: 'Section Officer',
    status: 'active' as const,
    isAdmin: false
  }
];

export const mockStudents: Student[] = [
  {
    _id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '123-456-7890',
    address: '123 Univ St.',
    bloodGroup: 'A+',
    imageUrl: 'https://i.pravatar.cc/150?u=1',
    role: 'student',
    studentId: '1901',
    session: '2019-2020',
    isCR: true
  },
  {
    _id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    phone: '123-456-7891',
    address: '456 Univ St.',
    bloodGroup: 'O+',
    imageUrl: 'https://i.pravatar.cc/150?u=2',
    role: 'student',
    studentId: '1902',
    session: '2019-2020',
    isCR: false
  },
  {
    _id: '3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    phone: '123-456-7892',
    address: '789 Univ St.',
    bloodGroup: 'B-',
    imageUrl: 'https://i.pravatar.cc/150?u=3',
    role: 'student',
    studentId: '2001',
    session: '2020-2021',
    isCR: true
  },
  {
    _id: '4',
    name: 'Diana Prince',
    email: 'diana@example.com',
    phone: '123-456-7893',
    address: '101 Univ St.',
    bloodGroup: 'AB+',
    imageUrl: 'https://i.pravatar.cc/150?u=4',
    role: 'student',
    studentId: '2002',
    session: '2020-2021',
    isCR: false
  }
];

export const mockTeachers: Teacher[] = [
  {
    _id: 't1',
    name: 'Dr. John Doe',
    email: 'john.doe@university.edu',
    phone: '111-222-3333',
    address: 'Faculty Block A',
    bloodGroup: 'O+',
    imageUrl: 'https://i.pravatar.cc/150?u=t1',
    role: 'teacher',
    designation: 'Professor',
    galleryUrls: [
      'https://picsum.photos/id/10/200',
      'https://picsum.photos/id/11/200'
    ],
    hasAdminAccess: true
  },
  {
    _id: 't2',
    name: 'Dr. Jane Smith',
    email: 'jane.smith@university.edu',
    phone: '444-555-6666',
    address: 'Faculty Block B',
    bloodGroup: 'A-',
    imageUrl: 'https://i.pravatar.cc/150?u=t2',
    role: 'teacher',
    designation: 'Associate Professor',
    galleryUrls: ['https://picsum.photos/id/20/200'],
    hasAdminAccess: false
  }
];

export const mockCourses: Course[] = [
  {
    _id: 'c1',
    code: 'STAT-101',
    title: 'Introduction to Probability',
    syllabusImageUrl: 'https://picsum.photos/id/30/200/300',
    instructorId: 't1'
  },
  {
    _id: 'c2',
    code: 'STAT-201',
    title: 'Statistical Inference',
    syllabusImageUrl: 'https://picsum.photos/id/31/200/300',
    instructorId: 't2'
  }
];
