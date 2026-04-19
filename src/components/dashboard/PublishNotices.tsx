'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Calendar, Edit, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const NOTICE_TYPES = ['notice', 'event', 'exam', 'circular', 'other'] as const;
type NoticeType = (typeof NOTICE_TYPES)[number];

interface Notice {
  _id: string;
  title: string;
  body: string;
  type: NoticeType;
  date: string;
  attachmentUrl?: string;
  publishedBy?: { name: string };
  createdAt: string;
}

interface NoticeForm {
  title: string;
  body: string;
  type: NoticeType;
  date: string;
  attachmentUrl: string;
}

const emptyForm: NoticeForm = {
  title: '',
  body: '',
  type: 'notice',
  date: new Date().toISOString().slice(0, 10),
  attachmentUrl: ''
};

function getAccessToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('accessToken') ?? '';
}

export function PublishNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NoticeForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchNotices = () => {
    setLoading(true);
    fetch('/api/notices')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setNotices(d.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch('/api/notices')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setNotices(d.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (notice: Notice) => {
    setEditingId(notice._id);
    setForm({
      title: notice.title,
      body: notice.body,
      type: notice.type,
      date: notice.date.slice(0, 10),
      attachmentUrl: notice.attachmentUrl ?? ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.body || !form.date) {
      setError('Title, body, and date are required.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = getAccessToken();
      const url = editingId ? `/api/notices/${editingId}` : '/api/notices';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          attachmentUrl: form.attachmentUrl || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? 'Failed to save notice.');
        return;
      }

      setShowForm(false);
      setEditingId(null);
      fetchNotices();
    } catch {
      setError('Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this notice?')) return;
    try {
      const token = getAccessToken();
      await fetch(`/api/notices/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotices((prev) => prev.filter((n) => n._id !== id));
    } catch {
      // silent
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h2 className='text-2xl font-bold text-[#1E3A8A]'>
            Notice Board Management
          </h2>
          <p className='text-sm text-slate-600'>
            Create, edit, or remove notices from the public notice board.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className='bg-[#1E3A8A] hover:bg-[#1E3A8A]/90'
        >
          <Plus className='mr-2 h-4 w-4' /> New Notice
        </Button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
          <div className='w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl'>
            <div className='flex items-center justify-between border-b border-slate-100 px-6 py-4'>
              <h3 className='font-bold text-[#1E3A8A]'>
                {editingId ? 'Edit Notice' : 'New Notice'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className='rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600'
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4 p-6'>
              {error && (
                <div className='rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700'>
                  {error}
                </div>
              )}

              <div className='grid grid-cols-2 gap-4'>
                <div className='col-span-2 flex flex-col gap-1.5'>
                  <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                    Title <span className='text-red-400'>*</span>
                  </label>
                  <input
                    name='title'
                    value={form.title}
                    onChange={handleChange}
                    placeholder='Notice title...'
                    className='focus:border-navy w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#1E3A8A]/10'
                  />
                </div>

                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                    Type
                  </label>
                  <select
                    name='type'
                    value={form.type}
                    onChange={handleChange}
                    className='w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1E3A8A]/10'
                  >
                    {NOTICE_TYPES.map((t) => (
                      <option key={t} value={t} className='capitalize'>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                    Date <span className='text-red-400'>*</span>
                  </label>
                  <input
                    name='date'
                    type='date'
                    value={form.date}
                    onChange={handleChange}
                    className='w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1E3A8A]/10'
                  />
                </div>

                <div className='col-span-2 flex flex-col gap-1.5'>
                  <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                    Body <span className='text-red-400'>*</span>
                  </label>
                  <textarea
                    name='body'
                    value={form.body}
                    onChange={handleChange}
                    rows={4}
                    placeholder='Notice content...'
                    className='w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1E3A8A]/10'
                  />
                </div>

                <div className='col-span-2 flex flex-col gap-1.5'>
                  <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                    Attachment URL{' '}
                    <span className='font-normal text-slate-400 normal-case'>
                      (optional)
                    </span>
                  </label>
                  <input
                    name='attachmentUrl'
                    value={form.attachmentUrl}
                    onChange={handleChange}
                    placeholder='https://...'
                    className='w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1E3A8A]/10'
                  />
                </div>
              </div>

              <div className='flex justify-end gap-2 pt-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={submitting}
                  className='bg-[#1E3A8A] hover:bg-[#1E3A8A]/90'
                >
                  {submitting ? (
                    <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white' />
                  ) : editingId ? (
                    'Save Changes'
                  ) : (
                    'Publish Notice'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notices list */}
      <Card className='border-slate-200 shadow-sm'>
        <CardHeader className='rounded-t-xl border-b border-slate-100 bg-slate-50 pb-4'>
          <CardTitle className='text-lg'>Published Notices</CardTitle>
          <CardDescription>
            All notices visible on the public notice board.
          </CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <span className='h-6 w-6 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E3A8A]' />
            </div>
          ) : notices.length === 0 ? (
            <div className='py-12 text-center text-slate-400'>
              No notices yet. Publish your first one.
            </div>
          ) : (
            <div className='divide-y divide-slate-100'>
              {notices.map((notice) => (
                <div
                  key={notice._id}
                  className='flex flex-col items-start justify-between gap-3 p-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:p-5'
                >
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <span className='rounded-full bg-[#DBEAFE] px-2 py-0.5 text-xs font-semibold text-[#1E3A8A] capitalize'>
                        {notice.type}
                      </span>
                      <h4 className='font-semibold text-slate-800'>
                        {notice.title}
                      </h4>
                    </div>
                    <div className='flex items-center gap-1.5 text-xs text-slate-400'>
                      <Calendar size={11} />
                      {new Date(notice.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>

                  <div className='flex shrink-0 items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-8 shadow-sm'
                      onClick={() => openEdit(notice)}
                    >
                      <Edit className='mr-1.5 h-3.5 w-3.5' /> Edit
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-8 border-red-200 text-red-600 shadow-sm hover:bg-red-50 hover:text-red-700'
                      onClick={() => handleDelete(notice._id)}
                    >
                      <Trash2 className='h-3.5 w-3.5' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
