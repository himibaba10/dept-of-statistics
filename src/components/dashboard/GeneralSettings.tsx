'use client';

import { fetchWithAuth } from '@/lib/fetchWithAuth';
import {
  GripVertical,
  ImagePlus,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Trash2,
  UploadCloud,
  X
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// ── types ──────────────────────────────────────────────────────────────────────

interface HeroSlide {
  src: string;
  headline: string;
  sub: string;
  body: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop',
    headline: 'Department of Statistics',
    sub: 'University of Chittagong',
    body: 'Advancing knowledge through rigorous analytical thinking, statistical research, and academic excellence.'
  },
  {
    src: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1600&auto=format&fit=crop',
    headline: 'Research & Innovation',
    sub: 'University of Chittagong',
    body: 'Our faculty and students are pushing the boundaries of statistical science and applied data research.'
  },
  {
    src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop',
    headline: 'Shaping Future Analysts',
    sub: 'University of Chittagong',
    body: 'A vibrant community of learners, researchers, and professionals dedicated to the science of data.'
  }
];

const DEFAULT_CONTACT: ContactInfo = {
  email: 'statistics@cu.ac.bd',
  phone: '+880-31-726-310',
  address: 'Dept. of Statistics, University of Chittagong, Chattogram 4331'
};

const EMPTY_SLIDE: HeroSlide = {
  src: '',
  headline: '',
  sub: 'University of Chittagong',
  body: ''
};

// ── upload helper ──────────────────────────────────────────────────────────────

async function uploadHeroImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  form.append('folderKey', 'hero');
  const res = await fetchWithAuth('/api/upload/image', {
    method: 'POST',
    body: form
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message ?? 'Upload failed');
  return data.data.url as string;
}

// ── component ──────────────────────────────────────────────────────────────────

export function GeneralSettings() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [contact, setContact] = useState<ContactInfo>(DEFAULT_CONTACT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── fetch ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchWithAuth('/api/settings');
        if (!res.ok) {
          setSlides(DEFAULT_SLIDES);
          return;
        }
        const data = await res.json();
        const fetched: HeroSlide[] = data?.data?.heroSlides ?? [];
        setSlides(fetched.length > 0 ? fetched : DEFAULT_SLIDES);
        const fetchedContact: ContactInfo = data?.data?.contact;
        if (fetchedContact?.email) setContact(fetchedContact);
      } catch {
        setSlides(DEFAULT_SLIDES);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── slide helpers ──────────────────────────────────────────────────────────

  const updateSlide = (idx: number, field: keyof HeroSlide, value: string) => {
    setSlides((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );
  };

  const handleFileChange = async (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setUploadingIdx(idx);
    setError('');
    try {
      const url = await uploadHeroImage(file);
      updateSlide(idx, 'src', url);
    } catch (err) {
      setError((err as Error).message ?? 'Image upload failed');
    } finally {
      setUploadingIdx(null);
    }
  };

  const addSlide = () => setSlides((prev) => [...prev, { ...EMPTY_SLIDE }]);
  const removeSlide = (idx: number) =>
    setSlides((prev) => prev.filter((_, i) => i !== idx));

  // ── drag-to-reorder ────────────────────────────────────────────────────────

  const onDragStart = (idx: number) => setDragIdx(idx);
  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };
  const onDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setDragOverIdx(null);
      return;
    }
    const next = [...slides];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(idx, 0, moved);
    setSlides(next);
    setDragIdx(null);
    setDragOverIdx(null);
  };
  const onDragEnd = () => {
    setDragIdx(null);
    setDragOverIdx(null);
  };

  // ── save ───────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    setError('');

    for (let i = 0; i < slides.length; i++) {
      const s = slides[i];
      if (
        !s.src.trim() ||
        !s.headline.trim() ||
        !s.sub.trim() ||
        !s.body.trim()
      ) {
        setError(`Slide ${i + 1}: all fields are required.`);
        return;
      }
    }

    if (
      !contact.email.trim() ||
      !contact.phone.trim() ||
      !contact.address.trim()
    ) {
      setError('Contact email, phone, and address are all required.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetchWithAuth('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroSlides: slides, contact })
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message ?? 'Failed to save settings.');
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className='flex items-center justify-center py-24'>
        <span className='h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E3A8A]' />
      </div>
    );
  }

  return (
    <div className='space-y-10'>
      {/* Header */}
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h2 className='text-navy font-serif text-2xl font-bold'>
            General Settings
          </h2>
          <p className='mt-1 text-sm text-slate-500'>
            Manage site-wide settings — contact info and homepage hero slider.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className='bg-navy hover:bg-navy/90 flex shrink-0 items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60'
        >
          {saving ? (
            <Loader2 size={14} className='animate-spin' />
          ) : (
            <Save size={14} />
          )}
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className='rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600'>
          {error}
        </div>
      )}

      {saved && !error && (
        <div className='rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700'>
          Settings saved — changes are now live on the site.
        </div>
      )}

      {/* ── Section: Contact Info ── */}
      <section className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
        <h3 className='text-navy mb-1 font-serif text-lg font-bold'>
          Contact Information
        </h3>
        <p className='mb-6 text-xs text-slate-400'>
          Shown in the site footer. Changes reflect immediately after saving.
        </p>

        <div className='space-y-4'>
          {/* Email */}
          <div>
            <label className='mb-1.5 flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-slate-500 uppercase'>
              <Mail size={11} />
              Email Address *
            </label>
            <input
              type='email'
              value={contact.email}
              onChange={(e) =>
                setContact((c) => ({ ...c, email: e.target.value }))
              }
              placeholder='statistics@cu.ac.bd'
              className='focus:border-navy w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 transition-colors outline-none'
            />
          </div>

          {/* Phone */}
          <div>
            <label className='mb-1.5 flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-slate-500 uppercase'>
              <Phone size={11} />
              Phone Number *
            </label>
            <input
              type='text'
              value={contact.phone}
              onChange={(e) =>
                setContact((c) => ({ ...c, phone: e.target.value }))
              }
              placeholder='+880-31-726-310'
              className='focus:border-navy w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 transition-colors outline-none'
            />
          </div>

          {/* Address */}
          <div>
            <label className='mb-1.5 flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-slate-500 uppercase'>
              <MapPin size={11} />
              Address *
            </label>
            <textarea
              value={contact.address}
              onChange={(e) =>
                setContact((c) => ({ ...c, address: e.target.value }))
              }
              rows={2}
              placeholder='Dept. of Statistics, University of Chittagong...'
              className='focus:border-navy w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 transition-colors outline-none'
            />
          </div>
        </div>
      </section>

      {/* ── Section: Hero Slides ── */}
      <section>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <ImagePlus size={18} className='text-navy' />
            <h3 className='text-navy font-serif text-lg font-bold'>
              Hero Slider
            </h3>
            <span className='rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500'>
              {slides.length} slide{slides.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            onClick={addSlide}
            className='flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50'
          >
            <Plus size={13} />
            Add Slide
          </button>
        </div>

        <p className='mb-5 text-xs text-slate-400'>
          Drag the grip handle to reorder slides. Changes are not live until you
          click &ldquo;Save Changes&rdquo;.
        </p>

        <div className='space-y-4'>
          {slides.map((slide, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragOver={(e) => onDragOver(e, idx)}
              onDrop={() => onDrop(idx)}
              onDragEnd={onDragEnd}
              className={`rounded-2xl border bg-white shadow-sm transition-all ${
                dragOverIdx === idx && dragIdx !== idx
                  ? 'border-[#1E3A8A] ring-2 ring-[#1E3A8A]/20'
                  : 'border-slate-200'
              } ${dragIdx === idx ? 'opacity-50' : 'opacity-100'}`}
            >
              {/* Slide header */}
              <div className='flex items-center justify-between border-b border-slate-100 px-4 py-3'>
                <div className='flex items-center gap-2'>
                  <GripVertical
                    size={16}
                    className='cursor-grab text-slate-300 active:cursor-grabbing'
                  />
                  <span className='text-xs font-bold tracking-widest text-slate-400 uppercase'>
                    Slide {idx + 1}
                  </span>
                </div>
                <button
                  onClick={() => removeSlide(idx)}
                  disabled={slides.length <= 1}
                  className='rounded-md p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30'
                  title='Remove slide'
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Slide body */}
              <div className='flex gap-5 p-5'>
                {/* Image */}
                <div className='flex w-44 shrink-0 flex-col gap-2'>
                  <div className='relative h-28 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100'>
                    {slide.src ? (
                      <Image
                        src={slide.src}
                        alt={`Slide ${idx + 1}`}
                        fill
                        className='object-cover'
                        sizes='176px'
                      />
                    ) : (
                      <div className='flex h-full items-center justify-center'>
                        <ImagePlus size={24} className='text-slate-300' />
                      </div>
                    )}
                    {uploadingIdx === idx && (
                      <div className='absolute inset-0 flex items-center justify-center bg-black/40'>
                        <Loader2
                          size={20}
                          className='animate-spin text-white'
                        />
                      </div>
                    )}
                  </div>

                  <input
                    ref={(el) => {
                      fileInputRefs.current[idx] = el;
                    }}
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={(e) => handleFileChange(idx, e)}
                  />

                  <button
                    onClick={() => fileInputRefs.current[idx]?.click()}
                    disabled={uploadingIdx !== null}
                    className='flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 bg-slate-50 py-2 text-xs font-semibold text-slate-500 transition-colors hover:border-[#1E3A8A]/40 hover:bg-indigo-50/40 disabled:opacity-50'
                  >
                    <UploadCloud size={13} />
                    Upload Image
                  </button>

                  <div className='relative'>
                    <input
                      type='text'
                      value={slide.src}
                      onChange={(e) => updateSlide(idx, 'src', e.target.value)}
                      placeholder='…or paste URL'
                      className='focus:border-navy w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] text-slate-700 transition-colors outline-none placeholder:text-slate-300'
                    />
                    {slide.src && (
                      <button
                        onClick={() => updateSlide(idx, 'src', '')}
                        className='absolute top-1/2 right-2 -translate-y-1/2 text-slate-300 hover:text-slate-500'
                      >
                        <X size={11} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Text fields */}
                <div className='flex flex-1 flex-col gap-3'>
                  <div>
                    <label className='mb-1 block text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                      Headline *
                    </label>
                    <input
                      type='text'
                      value={slide.headline}
                      onChange={(e) =>
                        updateSlide(idx, 'headline', e.target.value)
                      }
                      placeholder='e.g. Department of Statistics'
                      className='focus:border-navy w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 transition-colors outline-none'
                    />
                  </div>
                  <div>
                    <label className='mb-1 block text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                      Sub-label *
                    </label>
                    <input
                      type='text'
                      value={slide.sub}
                      onChange={(e) => updateSlide(idx, 'sub', e.target.value)}
                      placeholder='e.g. University of Chittagong'
                      className='focus:border-navy w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 transition-colors outline-none'
                    />
                  </div>
                  <div>
                    <label className='mb-1 block text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                      Body Text *
                    </label>
                    <textarea
                      value={slide.body}
                      onChange={(e) => updateSlide(idx, 'body', e.target.value)}
                      rows={3}
                      placeholder='Brief description shown on the slide…'
                      className='focus:border-navy w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 transition-colors outline-none'
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {slides.length === 0 && (
          <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16'>
            <ImagePlus size={36} className='mb-3 text-slate-300' />
            <p className='font-semibold text-slate-500'>No slides yet</p>
            <p className='mt-1 text-sm text-slate-400'>
              Click &ldquo;Add Slide&rdquo; to create your first hero slide.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
