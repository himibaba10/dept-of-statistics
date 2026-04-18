'use client';

import { ManageGallery } from '@/components/dashboard/ManageGallery';
import { ManageNotices } from '@/components/dashboard/ManageNotices';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function OfficialDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'notices' | 'gallery'
  >('overview');

  return (
    <div className='space-y-8'>
      {/* Header section */}
      <div>
        <h1 className='text-3xl font-bold text-[#1E3A8A]'>
          Official Dashboard
        </h1>
        <p className='text-slate-600'>
          Welcome to the departmental office portal. Here you can manage
          structural content on the portal.
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
          variant={activeTab === 'notices' ? 'default' : 'ghost'}
          className={`h-9 rounded-md text-sm ${activeTab === 'notices' ? 'bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]' : 'text-slate-600'}`}
          onClick={() => setActiveTab('notices')}
        >
          Manage Notices
        </Button>
        <Button
          variant={activeTab === 'gallery' ? 'default' : 'ghost'}
          className={`h-9 rounded-md text-sm ${activeTab === 'gallery' ? 'bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]' : 'text-slate-600'}`}
          onClick={() => setActiveTab('gallery')}
        >
          Gallery Management
        </Button>
      </div>

      {/* Content Area */}
      <div className='pt-2'>
        {activeTab === 'overview' && (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            <div className='flex flex-col items-start justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
              <div>
                <h3 className='mb-2 text-lg font-semibold text-[#1E3A8A]'>
                  Publish Notice
                </h3>
                <p className='mb-6 text-sm text-slate-500'>
                  Create, edit, or remove notices from the public notice board.
                </p>
              </div>
              <Button
                onClick={() => setActiveTab('notices')}
                className='w-full border border-blue-200 bg-[#DBEAFE] text-[#1E3A8A] hover:bg-[#DBEAFE]/80'
              >
                Go to Notices →
              </Button>
            </div>
            <div className='flex flex-col items-start justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
              <div>
                <h3 className='mb-2 text-lg font-semibold text-[#1E3A8A]'>
                  Gallery Management
                </h3>
                <p className='mb-6 text-sm text-slate-500'>
                  Upload and organize images for faculty and department events.
                </p>
              </div>
              <Button
                onClick={() => setActiveTab('gallery')}
                className='w-full border border-blue-200 bg-[#DBEAFE] text-[#1E3A8A] hover:bg-[#DBEAFE]/80'
              >
                Go to Gallery →
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'notices' && <ManageNotices />}
        {activeTab === 'gallery' && <ManageGallery />}
      </div>
    </div>
  );
}
