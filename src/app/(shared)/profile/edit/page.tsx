'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { User } from '@/types';
import { Camera, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const DIVISIONS = [
  'Barishal',
  'Chattogram',
  'Dhaka',
  'Khulna',
  'Mymensingh',
  'Rajshahi',
  'Rangpur',
  'Sylhet'
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export default function ProfileEditPage() {
  const { user, isLoading, updateUser } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    bloodGroup: '',
    address: { street: '', city: '', state: '', postalCode: '' }
  });

  // Image state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
      return;
    }
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        bloodGroup: user.bloodGroup ?? '',
        address: {
          street: user.address?.street ?? '',
          city: user.address?.city ?? '',
          state: user.address?.state ?? '',
          postalCode: user.address?.postalCode ?? ''
        }
      });
      setImagePreview(user.imageUrl ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  if (isLoading || !user) {
    return (
      <div className='flex min-h-[40vh] items-center justify-center'>
        <Loader2 className='h-6 w-6 animate-spin text-slate-400' />
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1] as keyof FormData['address'];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setError('Only JPEG, PNG, WebP or GIF images are allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB.');
      return;
    }

    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setSaving(true);

      // 1. Upload image first if a new one was picked
      let imageUrl = user.imageUrl;
      if (imageFile) {
        setUploading(true);
        const fd = new FormData();
        fd.append('file', imageFile);

        const uploadRes = await fetchWithAuth('/api/upload/image', {
          method: 'POST',
          body: fd
        });

        const uploadData = await uploadRes.json();
        setUploading(false);

        if (!uploadRes.ok) {
          setError(uploadData.message ?? 'Image upload failed.');
          return;
        }
        imageUrl = uploadData.data.url as string;
      }

      // 2. Save profile fields + imageUrl
      const payload: Record<string, unknown> = {
        name: formData.name,
        phone: formData.phone,
        bloodGroup: formData.bloodGroup || undefined,
        address: formData.address,
        ...(formData.email ? { email: formData.email } : {}),
        ...(imageUrl ? { imageUrl } : {})
      };

      const res = await fetchWithAuth('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? 'Failed to save profile.');
        return;
      }

      // 3. Sync updated user into auth context + localStorage
      updateUser(data.data as User);
      setImageFile(null);
      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const avatarSrc =
    imagePreview ??
    (user.gender === 'female'
      ? '/images/female-placeholder.webp'
      : '/images/male-placeholder.webp');

  return (
    <div className='mx-auto max-w-2xl space-y-8 px-4 py-8'>
      <div>
        <h1 className='mb-1 text-3xl font-bold text-[#1E3A8A]'>Edit Profile</h1>
        <p className='text-slate-500'>
          Update your {user.role} information. Changes reflect across the
          portal.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='space-y-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm'
      >
        {/* Avatar upload */}
        <div className='flex flex-col items-center gap-3'>
          <div className='relative'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc}
              alt='Profile'
              className='h-24 w-24 rounded-full border-4 border-slate-100 object-cover shadow-sm'
            />
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#1E3A8A] text-white shadow transition-opacity hover:opacity-90'
            >
              <Camera size={14} />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/jpeg,image/png,image/webp,image/gif'
            className='hidden'
            onChange={handleImageChange}
          />
          {imageFile && (
            <p className='text-xs text-slate-500'>
              {imageFile.name} — will be uploaded on save
            </p>
          )}
        </div>

        {/* Fields */}
        <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
          <div className='space-y-1.5'>
            <label className='text-sm font-medium text-slate-700'>
              Full Name
            </label>
            <Input
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className='space-y-1.5'>
            <label className='text-sm font-medium text-slate-700'>Email</label>
            <Input
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className='space-y-1.5'>
            <label className='text-sm font-medium text-slate-700'>Phone</label>
            <Input
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className='space-y-1.5'>
            <label className='text-sm font-medium text-slate-700'>
              Blood Group
            </label>
            <select
              name='bloodGroup'
              value={formData.bloodGroup}
              onChange={handleChange}
              className='border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 h-8 w-full min-w-0 flex-1 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
            >
              <option value=''>Select Blood Group</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div className='space-y-1.5 md:col-span-2'>
            <label className='text-sm font-medium text-slate-700'>
              Street Address
            </label>
            <Input
              name='address.street'
              value={formData.address.street}
              onChange={handleChange}
            />
          </div>

          <div className='space-y-1.5'>
            <label className='text-sm font-medium text-slate-700'>City</label>
            <Input
              name='address.city'
              value={formData.address.city}
              onChange={handleChange}
            />
          </div>

          <div className='space-y-1.5'>
            <label className='text-sm font-medium text-slate-700'>
              State / Division
            </label>
            <select
              name='address.state'
              value={formData.address.state}
              onChange={handleChange}
              className='border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 h-8 w-full min-w-0 flex-1 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
            >
              <option value=''>Select Division</option>
              {DIVISIONS.map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </select>
          </div>

          <div className='space-y-1.5'>
            <label className='text-sm font-medium text-slate-700'>
              Postal Code
            </label>
            <Input
              name='address.postalCode'
              value={formData.address.postalCode}
              onChange={handleChange}
            />
          </div>

          {/* Read-only role fields */}
          {user.role === 'student' && (
            <>
              <div className='space-y-1.5'>
                <label className='text-sm font-medium text-slate-700'>
                  Student ID (read-only)
                </label>
                <Input
                  value={(user as { studentId?: string }).studentId ?? ''}
                  disabled
                  className='bg-slate-50'
                />
              </div>
              <div className='space-y-1.5'>
                <label className='text-sm font-medium text-slate-700'>
                  Session (read-only)
                </label>
                <Input
                  value={(user as { session?: string }).session ?? ''}
                  disabled
                  className='bg-slate-50'
                />
              </div>
            </>
          )}

          {user.role === 'teacher' && (
            <div className='space-y-1.5 md:col-span-2'>
              <label className='text-sm font-medium text-slate-700'>
                Designation (read-only)
              </label>
              <Input
                value={(user as { designation?: string }).designation ?? ''}
                disabled
                className='bg-slate-50'
              />
            </div>
          )}

          {user.role === 'official' && (
            <div className='space-y-1.5 md:col-span-2'>
              <label className='text-sm font-medium text-slate-700'>
                Department Role (read-only)
              </label>
              <Input
                value={
                  (user as { departmentRole?: string }).departmentRole ?? ''
                }
                disabled
                className='bg-slate-50'
              />
            </div>
          )}
        </div>

        {/* Feedback */}
        {error && (
          <p className='rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600'>
            {error}
          </p>
        )}
        {success && (
          <p className='rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-700'>
            Profile saved successfully!
          </p>
        )}

        <div className='flex justify-end gap-3 border-t border-slate-100 pt-4'>
          <Button type='button' variant='outline' onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={saving}
            className='min-w-30 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90'
          >
            {saving ? (
              <span className='flex items-center gap-2'>
                <Loader2 size={15} className='animate-spin' />
                {uploading ? 'Uploading...' : 'Saving...'}
              </span>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
