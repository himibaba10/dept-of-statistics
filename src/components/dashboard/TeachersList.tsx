'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { Teacher } from '@/types';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult
} from '@hello-pangea/dnd';
import {
  Droplets,
  GripVertical,
  Mail,
  MapPin,
  Phone,
  Search,
  Users
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

const DESIGNATIONS = [
  'professor',
  'associate-professor',
  'assistant-professor',
  'lecturer',
  'senior-lecturer',
  'adjunct-faculty',
  'chairman'
];

export function TeachersList() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [designation, setDesignation] = useState('');
  const [savingOrder, setSavingOrder] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
    fetchWithAuth('/api/users?role=teacher&status=active')
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((d) => {
        if (d?.success) setTeachers(d.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return teachers.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchesDesignation = !designation || t.designation === designation;
      return matchesSearch && matchesDesignation;
    });
  }, [teachers, search, designation]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    if (sourceIndex === destIndex) return;

    const newTeachers = Array.from(filtered);
    const [moved] = newTeachers.splice(sourceIndex, 1);
    newTeachers.splice(destIndex, 0, moved);

    setTeachers(newTeachers);
    setSavingOrder(true);

    try {
      const res = await fetchWithAuth('/api/users/teachers/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ teacherIds: newTeachers.map((t) => t._id) })
      });

      if (!res.ok) {
        throw new Error('Failed to save order');
      }
      toast.success('Display sequence updated');
    } catch {
      toast.error('Failed to permanently save new order');
    } finally {
      setSavingOrder(false);
    }
  };

  const isFiltering = search.length > 0 || designation.length > 0;
  const canReorder = user?.isAdmin || user?.role === 'official';

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-[#1E3A8A]'>Teachers</h2>
        <p className='text-sm text-slate-600'>
          All active faculty members.{' '}
          {canReorder && 'Drag and drop to set their general display order.'}
        </p>
      </div>

      {/* Filters */}
      <div className='flex flex-col gap-3 sm:flex-row'>
        <div className='relative flex-1'>
          <Search
            size={15}
            className='absolute top-1/2 left-3 -translate-y-1/2 text-slate-400'
          />
          <input
            type='text'
            placeholder='Search by name...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-4 pl-9 text-sm text-slate-800 transition outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10'
          />
        </div>
        <select
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className='rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 transition outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10'
        >
          <option value=''>All Designations</option>
          {DESIGNATIONS.map((d) => (
            <option key={d} value={d}>
              {d
                .split('-')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ')}
            </option>
          ))}
        </select>
      </div>

      <Card className='border-slate-200 shadow-sm'>
        <CardHeader className='rounded-t-xl border-b border-slate-100 bg-slate-50 pb-4'>
          <div className='flex flex-col justify-between sm:flex-row sm:items-center'>
            <CardTitle className='flex items-center gap-2 text-lg'>
              {loading
                ? 'Loading...'
                : `${filtered.length} teacher${filtered.length !== 1 ? 's' : ''}`}
              {savingOrder && (
                <span className='animate-pulse text-xs text-slate-400'>
                  (Saving order...)
                </span>
              )}
            </CardTitle>
            <div className='flex items-center gap-3'>
              {canReorder && isFiltering && (
                <span className='rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-600'>
                  Clear filters to enable dragging
                </span>
              )}
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-50'>
                <Users size={18} className='text-[#1E3A8A]' />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className='p-0'>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <span className='h-6 w-6 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E3A8A]' />
            </div>
          ) : filtered.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16'>
              <Users size={36} className='mb-3 text-slate-300' />
              <p className='font-semibold text-slate-500'>No teachers found</p>
            </div>
          ) : (
            <div className='divide-y divide-slate-100'>
              {isClient && !isFiltering && canReorder ? (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId='teachers-list'>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {filtered.map((teacher, index) => {
                          const addressParts = [
                            teacher.address?.city,
                            teacher.address?.state
                          ].filter(Boolean);

                          return (
                            <Draggable
                              key={teacher._id}
                              draggableId={teacher._id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`relative flex items-center gap-4 px-5 py-4 hover:bg-slate-50 ${
                                    snapshot.isDragging
                                      ? 'z-50 rounded-xl bg-white shadow-xl ring-1 ring-slate-200'
                                      : ''
                                  }`}
                                  style={provided.draggableProps.style}
                                >
                                  <div
                                    {...provided.dragHandleProps}
                                    className='cursor-grab rounded-md p-1.5 text-slate-300 transition-colors hover:text-slate-500 active:cursor-grabbing'
                                  >
                                    <GripVertical size={18} />
                                  </div>

                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={
                                      teacher.imageUrl ??
                                      (teacher.gender === 'female'
                                        ? '/images/female-placeholder.webp'
                                        : '/images/male-placeholder.webp')
                                    }
                                    alt={teacher.name}
                                    className='h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-slate-100'
                                  />
                                  <div className='min-w-0 flex-1'>
                                    <p className='font-semibold text-slate-800'>
                                      {teacher.name}
                                    </p>
                                    {teacher.designation && (
                                      <p className='text-xs text-[#1E3A8A] capitalize'>
                                        {teacher.designation.replace(/-/g, ' ')}
                                      </p>
                                    )}
                                    <div className='mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500'>
                                      {teacher.phone && (
                                        <span className='flex items-center gap-1'>
                                          <Phone size={11} />
                                          {teacher.phone}
                                        </span>
                                      )}
                                      {teacher.email && (
                                        <span className='flex items-center gap-1'>
                                          <Mail size={11} />
                                          {teacher.email}
                                        </span>
                                      )}
                                      {teacher.bloodGroup && (
                                        <span className='flex items-center gap-1'>
                                          <Droplets size={11} />
                                          {teacher.bloodGroup}
                                        </span>
                                      )}
                                      {addressParts.length > 0 && (
                                        <span className='flex items-center gap-1'>
                                          <MapPin size={11} />
                                          {addressParts.join(', ')}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                filtered.map((teacher) => {
                  const addressParts = [
                    teacher.address?.city,
                    teacher.address?.state
                  ].filter(Boolean);

                  return (
                    <div
                      key={teacher._id}
                      className='flex items-center gap-4 px-5 py-4 hover:bg-slate-50'
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          teacher.imageUrl ??
                          (teacher.gender === 'female'
                            ? '/images/female-placeholder.webp'
                            : '/images/male-placeholder.webp')
                        }
                        alt={teacher.name}
                        className='h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-slate-100'
                      />
                      <div className='min-w-0 flex-1'>
                        <p className='font-semibold text-slate-800'>
                          {teacher.name}
                        </p>
                        {teacher.designation && (
                          <p className='text-xs text-[#1E3A8A] capitalize'>
                            {teacher.designation.replace(/-/g, ' ')}
                          </p>
                        )}
                        <div className='mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500'>
                          {teacher.phone && (
                            <span className='flex items-center gap-1'>
                              <Phone size={11} />
                              {teacher.phone}
                            </span>
                          )}
                          {teacher.email && (
                            <span className='flex items-center gap-1'>
                              <Mail size={11} />
                              {teacher.email}
                            </span>
                          )}
                          {teacher.bloodGroup && (
                            <span className='flex items-center gap-1'>
                              <Droplets size={11} />
                              {teacher.bloodGroup}
                            </span>
                          )}
                          {addressParts.length > 0 && (
                            <span className='flex items-center gap-1'>
                              <MapPin size={11} />
                              {addressParts.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
