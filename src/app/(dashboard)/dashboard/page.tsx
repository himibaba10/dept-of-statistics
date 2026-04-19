'use client';

import { ManageCourses } from '@/components/dashboard/ManageCourses';
import { PublishNotices } from '@/components/dashboard/PublishNotices';
import { StudentApprovals } from '@/components/dashboard/StudentApprovals';
import { StudentReports } from '@/components/dashboard/StudentReports';
import { useAuth } from '@/components/providers/AuthProvider';
import { User } from '@/types';
import { useState } from 'react';

// ── helpers ──────────────────────────────────────────────────────────────────

function canAccessDashboard(user: User): boolean {
  if (user.isAdmin) return true;
  if (user.role === 'official') return true;
  if (user.role === 'student' && user.isCR) return true;
  return false;
}

type TabId = 'overview' | 'notices' | 'approvals' | 'courses' | 'students';

interface Tab {
  id: TabId;
  label: string;
}

function getTabs(user: User): Tab[] {
  const tabs: Tab[] = [];

  if (user.role === 'official' || user.isAdmin) {
    tabs.push({ id: 'notices', label: 'Publish Notices' });
  }

  if ((user.role === 'student' && user.isCR) || user.isAdmin) {
    tabs.push({ id: 'approvals', label: 'Student Approvals' });
  }

  if (user.isAdmin) {
    tabs.push({ id: 'courses', label: 'Manage Courses' });
    tabs.push({ id: 'students', label: 'Student Reports' });
  }

  return tabs;
}

const TAB_DESCRIPTIONS: Record<string, string> = {
  notices: 'Create, edit, or remove notices on the public notice board.',
  approvals: 'Review and approve pending student registrations.',
  courses: 'Assign instructors, update syllabus, and manage course offerings.',
  students: 'View academic records and session-wise analytics.'
};

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  if (!user || !canAccessDashboard(user)) return null;

  const tabs = getTabs(user);

  const roleLabel = user.isAdmin
    ? 'Administrator'
    : user.role === 'official'
      ? 'Official'
      : user.role === 'student' && user.isCR
        ? 'Class Representative'
        : '';

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <p className='text-gold mb-1 text-xs font-bold tracking-widest uppercase'>
          {roleLabel}
        </p>
        <h1 className='text-navy font-serif text-3xl font-bold'>Dashboard</h1>
        <p className='mt-1 text-slate-500'>
          Welcome back, {user.name.split(' ')[0]}.
        </p>
      </div>

      {/* Tab bar */}
      <div className='flex w-fit flex-wrap gap-1 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-sm'>
        <button
          onClick={() => setActiveTab('overview')}
          className={`h-9 rounded-md px-4 text-sm font-semibold transition-colors ${
            activeTab === 'overview'
              ? 'bg-[#1E3A8A] text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Overview
        </button>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`h-9 rounded-md px-4 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-[#1E3A8A] text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className='pt-2'>
        {activeTab === 'overview' && (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className='flex flex-col items-start justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm'
              >
                <div>
                  <h3 className='mb-2 text-lg font-semibold text-[#1E3A8A]'>
                    {tab.label}
                  </h3>
                  <p className='mb-6 text-sm text-slate-500'>
                    {TAB_DESCRIPTIONS[tab.id]}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className='w-full rounded-lg border border-blue-200 bg-[#DBEAFE] px-4 py-2 text-sm font-semibold text-[#1E3A8A] transition-colors hover:bg-[#DBEAFE]/80'
                >
                  Open →
                </button>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'notices' && <PublishNotices />}
        {activeTab === 'approvals' && <StudentApprovals currentUser={user} />}
        {activeTab === 'courses' && <ManageCourses />}
        {activeTab === 'students' && <StudentReports />}
      </div>
    </div>
  );
}
