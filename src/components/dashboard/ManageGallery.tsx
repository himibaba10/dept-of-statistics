'use client';

import { Button } from '@/components/ui/button';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { ImageIcon, Loader2, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface GalleryPhoto {
  _id: string;
  url: string;
  caption?: string;
  uploadedBy?: { name: string; role: string };
  createdAt: string;
}

export function ManageGallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setPhotos(d.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setError('Only JPEG, PNG, WebP or GIF images allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB.');
      return;
    }
    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setCaption('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Please select an image.');
      return;
    }
    setError('');
    setSaving(true);

    try {
      // 1. Upload to Cloudinary
      setUploading(true);
      const fd = new FormData();
      fd.append('file', imageFile);
      fd.append('folderKey', 'gallery');

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

      const url = uploadData.data.url as string;

      // 2. Save to DB
      const res = await fetchWithAuth('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, caption: caption || undefined })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? 'Failed to save photo.');
        return;
      }

      setPhotos((prev) => [data.data, ...prev]);
      resetForm();
      setShowForm(false);
    } catch {
      setError('Something went wrong.');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this photo from the gallery?')) return;
    setDeleting(id);
    try {
      const res = await fetchWithAuth(`/api/gallery/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) setPhotos((prev) => prev.filter((p) => p._id !== id));
    } catch {
      // silent
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h2 className='text-2xl font-bold text-[#1E3A8A]'>Campus Gallery</h2>
          <p className='text-sm text-slate-600'>
            Upload photos that appear in the homepage gallery.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className='bg-[#1E3A8A] hover:bg-[#1E3A8A]/90'
        >
          <Plus className='mr-2 h-4 w-4' /> Add Photo
        </Button>
      </div>

      {/* Upload modal */}
      {showForm && (
        <div className='fixed inset-0 z-50 m-0 flex items-center justify-center bg-black/40 p-4'>
          <div className='w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl'>
            <div className='flex items-center justify-between border-b border-slate-100 px-6 py-4'>
              <h3 className='font-bold text-[#1E3A8A]'>Add Gallery Photo</h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className='rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600'
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpload} className='flex flex-col gap-4 p-6'>
              {error && (
                <div className='rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700'>
                  {error}
                </div>
              )}

              {/* Image picker */}
              <div className='flex flex-col gap-1.5'>
                <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                  Photo <span className='text-red-400'>*</span>
                </label>
                {imagePreview ? (
                  <div className='relative overflow-hidden rounded-lg border border-slate-200'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt='Preview'
                      className='max-h-56 w-full object-cover'
                    />
                    <button
                      type='button'
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = '';
                      }}
                      className='absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70'
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    type='button'
                    onClick={() => fileInputRef.current?.click()}
                    className='flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 py-8 text-sm text-slate-400 transition-colors hover:border-[#1E3A8A]/30 hover:bg-slate-50 hover:text-slate-600'
                  >
                    <ImageIcon size={18} />
                    Click to select an image
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/jpeg,image/png,image/webp,image/gif'
                  className='hidden'
                  onChange={handleImageChange}
                />
              </div>

              {/* Caption */}
              <div className='flex flex-col gap-1.5'>
                <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                  Caption{' '}
                  <span className='font-normal text-slate-400 normal-case'>
                    (optional)
                  </span>
                </label>
                <input
                  type='text'
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder='e.g. Annual Sports Day 2024'
                  className='w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1E3A8A]/10'
                />
              </div>

              <div className='flex justify-end gap-2 pt-1'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={saving}
                  className='min-w-30 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90'
                >
                  {saving ? (
                    <span className='flex items-center gap-2'>
                      <Loader2 size={14} className='animate-spin' />
                      {uploading ? 'Uploading...' : 'Saving...'}
                    </span>
                  ) : (
                    'Add Photo'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photos grid */}
      {loading ? (
        <div className='flex items-center justify-center py-20'>
          <span className='h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E3A8A]' />
        </div>
      ) : photos.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20'>
          <ImageIcon size={36} className='mb-3 text-slate-300' />
          <p className='font-semibold text-slate-500'>No photos yet</p>
          <p className='mt-1 text-sm text-slate-400'>
            Add the first photo to the gallery.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4'>
          {photos.map((photo) => (
            <div
              key={photo._id}
              className='group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50'
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.caption ?? 'Gallery photo'}
                className='aspect-square w-full object-cover'
              />
              {/* Overlay on hover */}
              <div className='absolute inset-0 flex flex-col items-start justify-end bg-black/0 p-3 transition-all duration-200 group-hover:bg-black/40'>
                {photo.caption && (
                  <p className='line-clamp-2 text-xs font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                    {photo.caption}
                  </p>
                )}
                <p className='text-[10px] text-white/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                  by {photo.uploadedBy?.name ?? 'Unknown'}
                </p>
              </div>
              {/* Delete button */}
              <button
                onClick={() => handleDelete(photo._id)}
                disabled={deleting === photo._id}
                className='absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white opacity-0 shadow transition-opacity duration-200 group-hover:opacity-100 hover:bg-red-700 disabled:opacity-60'
              >
                {deleting === photo._id ? (
                  <Loader2 size={13} className='animate-spin' />
                ) : (
                  <Trash2 size={13} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
