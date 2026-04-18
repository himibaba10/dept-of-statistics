'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfileEditPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    } else if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({ ...user });
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !formData) {
    return (
      <div className='p-8 text-center text-slate-500'>Loading profile...</div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would typically submit to Mongoose
    alert('Profile modifications mock-saved successfully!');
    console.log('Saved data:', formData);
  };

  return (
    <div className='mx-auto max-w-2xl space-y-8'>
      <div>
        <h1 className='mb-2 text-3xl font-bold text-[#1E3A8A]'>Edit Profile</h1>
        <p className='text-slate-600'>
          Update your {user.role} information. Changes will reflect across the
          portal.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='space-y-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm'
      >
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-slate-700'>
              Full Name
            </label>
            <Input
              name='name'
              value={formData.name || ''}
              onChange={handleChange}
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-slate-700'>Email</label>
            <Input
              name='email'
              type='email'
              value={formData.email || ''}
              onChange={handleChange}
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-slate-700'>Phone</label>
            <Input
              name='phone'
              value={formData.phone || ''}
              onChange={handleChange}
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-slate-700'>
              Blood Group
            </label>
            <Input
              name='bloodGroup'
              value={formData.bloodGroup || ''}
              onChange={handleChange}
            />
          </div>

          <div className='space-y-2 md:col-span-2'>
            <label className='text-sm font-medium text-slate-700'>
              Address
            </label>
            <Input
              name='address'
              value={formData.address || ''}
              onChange={handleChange}
            />
          </div>

          {/* Role specific static fields (Read Only for demonstration) */}
          {user.role === 'student' && (
            <>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-slate-700'>
                  Student ID (Read-only)
                </label>
                <Input
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  value={(user as any).studentId}
                  disabled
                  className='bg-slate-50'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-slate-700'>
                  Session (Read-only)
                </label>
                <Input
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  value={(user as any).session}
                  disabled
                  className='bg-slate-50'
                />
              </div>
            </>
          )}

          {user.role === 'teacher' && (
            <div className='space-y-2 md:col-span-2'>
              <label className='text-sm font-medium text-slate-700'>
                Designation (Read-only)
              </label>
              <Input
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value={(user as any).designation}
                disabled
                className='bg-slate-50'
              />
            </div>
          )}

          {user.role === 'official' && (
            <div className='space-y-2 md:col-span-2'>
              <label className='text-sm font-medium text-slate-700'>
                Department Role (Read-only)
              </label>
              <Input
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value={(user as any).departmentRole}
                disabled
                className='bg-slate-50'
              />
            </div>
          )}
        </div>

        <div className='flex justify-end gap-4 border-t border-slate-100 pt-4'>
          <Button type='button' variant='outline' onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type='submit' className='bg-[#1E3A8A] hover:bg-[#1E3A8A]/90'>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
