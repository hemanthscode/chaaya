import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar.jsx';
import { useQuery } from '@tanstack/react-query';
import {
  fetchTestimonials,
  createTestimonialAdmin,
  updateTestimonialAdmin,
  deleteTestimonialAdmin
} from '../services/testimonials.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Button from '../components/ui/Button.jsx';
import DropdownMenu from '../components/ui/DropdownMenu.jsx';
import Modal from '../components/ui/Modal.jsx';
import Input from '../components/ui/Input.jsx';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const TestimonialsAdmin = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'testimonials'],
    queryFn: () => fetchTestimonials(50)
  });

  const [editing, setEditing] = useState(null);

  const handleSave = async (values) => {
    if (editing?.mode === 'create') {
      await createTestimonialAdmin(values);
      toast.success('Testimonial created');
    } else if (editing?.mode === 'edit') {
      await updateTestimonialAdmin(editing.item._id, values);
      toast.success('Testimonial updated');
    }
    setEditing(null);
    refetch();
  };

  const handleDelete = async (id) => {
    await deleteTestimonialAdmin(id);
    toast.success('Testimonial deleted');
    refetch();
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-6 text-sm">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-50">Testimonials</h1>
          <Button
            size="sm"
            onClick={() => setEditing({ mode: 'create', item: null })}
          >
            <Plus className="mr-1 h-4 w-4" />
            New testimonial
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner fullScreen />
        ) : (
          <div className="space-y-3">
            {data?.map((t) => (
              <div
                key={t._id}
                className="flex items-start justify-between rounded-lg border border-slate-800 bg-slate-900 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-100">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                  <p className="mt-1 text-xs text-slate-300">{t.content}</p>
                </div>
                <DropdownMenu
                  items={[
                    {
                      label: 'Edit',
                      icon: Edit2,
                      onClick: () => setEditing({ mode: 'edit', item: t })
                    },
                    {
                      label: 'Delete',
                      icon: Trash2,
                      onClick: () => handleDelete(t._id)
                    }
                  ]}
                />
              </div>
            ))}
          </div>
        )}

        {editing && (
          <TestimonialEditorModal
            mode={editing.mode}
            initial={editing.item}
            onClose={() => setEditing(null)}
            onSave={handleSave}
          />
        )}
      </main>
    </div>
  );
};

const TestimonialEditorModal = ({ mode, initial, onClose, onSave }) => {
  const [name, setName] = useState(initial?.name || '');
  const [role, setRole] = useState(initial?.role || '');
  const [content, setContent] = useState(initial?.content || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, role, content });
  };

  return (
    <Modal
      title={mode === 'create' ? 'Create testimonial' : 'Edit testimonial'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <div>
          <label className="mb-1 block text-xs text-slate-300">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-300">Role</label>
          <Input value={role} onChange={(e) => setRole(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-300">Content</label>
          <textarea
            rows={3}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
};

export default TestimonialsAdmin;
