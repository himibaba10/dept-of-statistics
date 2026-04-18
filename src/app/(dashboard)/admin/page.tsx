'use client';

import { ManageCourses } from '@/components/dashboard/ManageCourses';
import { StudentReports } from '@/components/dashboard/StudentReports';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'courses' | 'students'
  >('overview');

  return (
    <div className='space-y-8'>
      {/* Header section */}
      <div>
        <h1 className='text-3xl font-bold text-[#1E3A8A]'>Admin Dashboard</h1>
        <p className='text-slate-600'>
          Welcome to the administrative portal. Only teachers with admin access
          can view this page.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className='flex w-fit overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-sm'>
        <Button
          variant={activeTab === 'overview' ? 'default' : 'ghost'}
          className={`h-9 rounded-md text-sm ${activeTab === 'overview' ? 'bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]' : 'text-slate-600'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === 'courses' ? 'default' : 'ghost'}
          className={`h-9 rounded-md text-sm ${activeTab === 'courses' ? 'bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]' : 'text-slate-600'}`}
          onClick={() => setActiveTab('courses')}
        >
          Manage Courses
        </Button>
        <Button
          variant={activeTab === 'students' ? 'default' : 'ghost'}
          className={`h-9 rounded-md text-sm ${activeTab === 'students' ? 'bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]' : 'text-slate-600'}`}
          onClick={() => setActiveTab('students')}
        >
          Student Reports
        </Button>
      </div>

      {/* Content Area */}
      <div className='pt-2'>
        {activeTab === 'overview' && (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            <div className='flex flex-col items-start justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
              <div>
                <h3 className='mb-2 text-lg font-semibold text-[#1E3A8A]'>
                  Manage Courses
                </h3>
                <p className='mb-6 text-sm text-slate-500'>
                  Assign instructors, update syllabus, and manage course
                  offerings.
                </p>
              </div>
              <Button
                onClick={() => setActiveTab('courses')}
                className='w-full border border-blue-200 bg-[#DBEAFE] text-[#1E3A8A] hover:bg-[#DBEAFE]/80'
              >
                Access Module →
              </Button>
            </div>
            <div className='flex flex-col items-start justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
              <div>
                <h3 className='mb-2 text-lg font-semibold text-[#1E3A8A]'>
                  Student Reports
                </h3>
                <p className='mb-6 text-sm text-slate-500'>
                  View academic performance and session-wise analytics.
                </p>
              </div>
              <Button
                onClick={() => setActiveTab('students')}
                className='w-full border border-blue-200 bg-[#DBEAFE] text-[#1E3A8A] hover:bg-[#DBEAFE]/80'
              >
                Access Module →
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'courses' && <ManageCourses />}
        {activeTab === 'students' && <StudentReports />}
      </div>
    </div>
  );
}
