'use client';

import { Course } from '@/types';
import {
  BookOpen,
  Edit2,
  Loader2,
  Plus,
  Trash2,
  UploadCloud,
  X
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// ── helpers ────────────────────────────────────────────────────────────────────

async function uploadImage(
  file: File,
  folderKey: string,
  token: string
): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  form.append('folderKey', folderKey);
  const res = await fetch('/api/upload/image', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message ?? 'Upload failed');
  return data.data.url as string;
}

// ── types ──────────────────────────────────────────────────────────────────────

interface CourseForm {
  title: string;
  code: string;
  description: string;
  syllabusFiles: File[];
  syllabusPreviews: string[];
  // existing URLs (when editing)
  existingSyllabus: string[];
}

const EMPTY_FORM: CourseForm = {
  title: '',
  code: '',
  description: '',
  syllabusFiles: [],
  syllabusPreviews: [],
  existingSyllabus: []
};

// ── component ──────────────────────────────────────────────────────────────────

export function ManageCourses() {
  const getToken = () =>
    typeof window !== 'undefined'
      ? (localStorage.getItem('accessToken') ?? '')
      : '';
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CourseForm>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const syllabusInputRef = useRef<HTMLInputElement>(null);

  // ── fetch ──────────────────────────────────────────────────────────────────

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      if (data.success) setCourses(data.data ?? []);
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  // ── open modal ─────────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (course: Course) => {
    setEditingId(course._id);
    setForm({
      title: course.title,
      code: course.code,
      description: course.description ?? '',
      syllabusFiles: [],
      syllabusPreviews: [],
      existingSyllabus: course.syllabus ?? []
    });
    setError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
  };

  // ── file pickers ───────────────────────────────────────────────────────────

  const onSyllabusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const previews = files.map((f) => URL.createObjectURL(f));
    setForm((f) => ({
      ...f,
      syllabusFiles: [...f.syllabusFiles, ...files],
      syllabusPreviews: [...f.syllabusPreviews, ...previews]
    }));
    // reset input so same file can be re-selected
    e.target.value = '';
  };

  const removeNewSyllabus = (index: number) => {
    setForm((f) => ({
      ...f,
      syllabusFiles: f.syllabusFiles.filter((_, i) => i !== index),
      syllabusPreviews: f.syllabusPreviews.filter((_, i) => i !== index)
    }));
  };

  const removeExistingSyllabus = (index: number) => {
    setForm((f) => ({
      ...f,
      existingSyllabus: f.existingSyllabus.filter((_, i) => i !== index)
    }));
  };

  // ── submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setError('');
    const finalCode = form.code.trim() === 'STAT-' ? '' : form.code.trim();
    if (!form.title.trim() || !finalCode) {
      setError('Title and code are required.');
      return;
    }

    setSubmitting(true);
    try {
      // Upload new syllabus files
      const newSyllabusUrls: string[] = [];
      for (const file of form.syllabusFiles) {
        const url = await uploadImage(file, 'syllabus', getToken());
        newSyllabusUrls.push(url);
      }

      const syllabus = [...form.existingSyllabus, ...newSyllabusUrls];

      const body = {
        title: form.title.trim(),
        code: finalCode,
        description: form.description.trim() || undefined,
        syllabus
      };

      const url = editingId ? `/api/courses/${editingId}` : '/api/courses';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message ?? 'Something went wrong.');
        return;
      }

      closeModal();
      fetchCourses();
    } catch (err) {
      setError((err as Error).message ?? 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) {
        setCourses((prev) => prev.filter((c) => c._id !== id));
      }
    } catch {
      /* noop */
    } finally {
      setDeleteId(null);
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-navy font-serif text-2xl font-bold'>
            Manage Courses
          </h2>
          <p className='mt-1 text-sm text-slate-500'>
            {courses.length} course{courses.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={openCreate}
          className='bg-navy hover:bg-navy/90 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors'
        >
          <Plus size={16} />
          Add Course
        </button>
      </div>

      {/* Table / list */}
      {loading ? (
        <div className='flex items-center justify-center py-20'>
          <span className='h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E3A8A]' />
        </div>
      ) : courses.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20'>
          <BookOpen size={40} className='mb-4 text-slate-300' />
          <p className='font-semibold text-slate-500'>No courses yet</p>
          <p className='mt-1 text-sm text-slate-400'>
            Click &ldquo;Add Course&rdquo; to get started
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {courses.map((course) => (
            <div
              key={course._id}
              className='overflow-hidden rounded-2xl border border-slate-200 bg-white'
            >
              {/* Body */}
              <div className='p-4'>
                <div className='mb-2 flex items-center gap-2'>
                  <span className='bg-navy rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider text-white'>
                    {course.code}
                  </span>
                </div>
                <h3 className='text-navy mb-1 font-serif text-base leading-snug font-bold'>
                  {course.title}
                </h3>
                {course.description && (
                  <p className='line-clamp-2 text-sm text-slate-500'>
                    {course.description}
                  </p>
                )}
                <p className='mt-2 text-xs text-slate-400'>
                  {course.syllabus?.length ?? 0} syllabus page
                  {(course.syllabus?.length ?? 0) !== 1 ? 's' : ''}
                </p>
                {/* Actions */}
                <div className='mt-4 flex gap-2 border-t border-slate-100 pt-4'>
                  <button
                    onClick={() => openEdit(course)}
                    className='flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50'
                  >
                    <Edit2 size={12} />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(course._id)}
                    className='flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-100 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50'
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      {modalOpen && (
        <div className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-16'>
          <div className='w-full max-w-xl rounded-2xl bg-white shadow-2xl'>
            {/* Modal header */}
            <div className='flex items-center justify-between border-b border-slate-100 px-6 py-4'>
              <h3 className='text-navy font-serif text-lg font-bold'>
                {editingId ? 'Edit Course' : 'Add Course'}
              </h3>
              <button
                onClick={closeModal}
                className='rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <div className='space-y-5 p-6'>
              {error && (
                <div className='rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600'>
                  {error}
                </div>
              )}

              {/* Title */}
              <div>
                <label className='mb-1.5 block text-[11px] font-bold tracking-widest text-slate-500 uppercase'>
                  Course Title *
                </label>
                <input
                  type='text'
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder='e.g. Introduction to Probability'
                  className='focus:border-navy w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 transition-colors outline-none'
                />
              </div>

              {/* Code */}
              <div>
                <label className='mb-1.5 block text-[11px] font-bold tracking-widest text-slate-500 uppercase'>
                  Course Code *
                </label>
                <div className='focus-within:border-navy flex overflow-hidden rounded-lg border border-slate-200 transition-colors'>
                  <span className='flex items-center border-r border-slate-200 bg-slate-50 px-3 font-mono text-sm font-semibold text-slate-500'>
                    STAT-
                  </span>
                  <input
                    type='text'
                    value={form.code.replace(/^STAT-/, '')}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        code: `STAT-${e.target.value.toUpperCase().replace(/^STAT-/, '')}`
                      }))
                    }
                    placeholder='101'
                    className='w-full px-3 py-2.5 font-mono text-sm text-slate-800 outline-none'
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className='mb-1.5 block text-[11px] font-bold tracking-widest text-slate-500 uppercase'>
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={3}
                  placeholder='Brief overview of the course...'
                  className='focus:border-navy w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 transition-colors outline-none'
                />
              </div>

              {/* Syllabus */}
              <div>
                <label className='mb-1.5 block text-[11px] font-bold tracking-widest text-slate-500 uppercase'>
                  Syllabus Pages
                </label>

                {/* Existing syllabus images */}
                {form.existingSyllabus.length > 0 && (
                  <div className='mb-3'>
                    <p className='mb-2 text-xs font-semibold text-slate-500'>
                      Current pages
                    </p>
                    <div className='grid grid-cols-3 gap-2'>
                      {form.existingSyllabus.map((url, i) => (
                        <div key={i} className='relative'>
                          <div className='relative h-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-50'>
                            <Image
                              src={url}
                              alt={`Syllabus page ${i + 1}`}
                              fill
                              className='object-contain p-1'
                            />
                          </div>
                          <button
                            onClick={() => removeExistingSyllabus(i)}
                            className='absolute -top-1 -right-1 rounded-full bg-red-500 p-0.5 text-white shadow'
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New syllabus previews */}
                {form.syllabusPreviews.length > 0 && (
                  <div className='mb-3'>
                    <p className='mb-2 text-xs font-semibold text-slate-500'>
                      New pages to upload
                    </p>
                    <div className='grid grid-cols-3 gap-2'>
                      {form.syllabusPreviews.map((url, i) => (
                        <div key={i} className='relative'>
                          <div className='relative h-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-50'>
                            <Image
                              src={url}
                              alt={`New page ${i + 1}`}
                              fill
                              className='object-contain p-1'
                            />
                          </div>
                          <button
                            onClick={() => removeNewSyllabus(i)}
                            className='absolute -top-1 -right-1 rounded-full bg-red-500 p-0.5 text-white shadow'
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <input
                  ref={syllabusInputRef}
                  type='file'
                  accept='image/*'
                  multiple
                  className='hidden'
                  onChange={onSyllabusChange}
                />
                <button
                  onClick={() => syllabusInputRef.current?.click()}
                  className='flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500 transition-colors hover:border-[#1E3A8A]/40 hover:bg-indigo-50/50'
                >
                  <UploadCloud size={18} className='text-slate-400' />
                  <span className='font-semibold'>
                    Add syllabus pages (images)
                  </span>
                </button>
              </div>
            </div>

            {/* Modal footer */}
            <div className='flex justify-end gap-3 border-t border-slate-100 px-6 py-4'>
              <button
                onClick={closeModal}
                disabled={submitting}
                className='rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50'
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className='bg-navy hover:bg-navy/90 flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60'
              >
                {submitting && <Loader2 size={14} className='animate-spin' />}
                {editingId ? 'Save Changes' : 'Create Course'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl'>
            <h3 className='text-navy mb-2 font-serif text-lg font-bold'>
              Delete Course?
            </h3>
            <p className='mb-6 text-sm text-slate-500'>
              This will permanently remove the course and cannot be undone.
            </p>
            <div className='flex gap-3'>
              <button
                onClick={() => setDeleteId(null)}
                className='flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50'
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className='flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
