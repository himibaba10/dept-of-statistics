import { User } from '@/types';

export const SENIOR_TEACHER_DESIGNATIONS = ['professor', 'chairman'] as const;

export function isSeniorTeacher(user: User): boolean {
  if (user.role !== 'teacher') return false;
  return SENIOR_TEACHER_DESIGNATIONS.includes(
    (user as { designation?: string }).designation?.toLowerCase() as never
  );
}

export function canManageGallery(user: User | null): boolean {
  if (!user) return false;
  if (user.isAdmin) return true;
  if (user.role === 'official') return true;
  if (user.role === 'student' && (user as { isCR?: boolean }).isCR) return true;
  if (isSeniorTeacher(user)) return true;
  return false;
}

export function canAccessDashboard(user: User | null): boolean {
  if (!user) return false;
  if (user.isAdmin) return true;
  if (user.role === 'official') return true;
  if (user.role === 'student' && (user as { isCR?: boolean }).isCR) return true;
  if (isSeniorTeacher(user)) return true;
  return false;
}
