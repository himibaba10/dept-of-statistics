import { Course } from '@/types';

// Mock courses — no user mocks needed, all auth is real JWT now
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
