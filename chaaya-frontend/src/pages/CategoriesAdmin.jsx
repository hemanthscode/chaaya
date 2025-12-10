import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar.jsx';
import {
  useCategories,
  useCreateCategoryAdmin,
  useUpdateCategoryAdmin,
  useDeleteCategoryAdmin
} from '../hooks/useCategories.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import Input from '../components/ui/Input.jsx';
import DropdownMenu from '../components/ui/DropdownMenu.jsx';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CategoriesAdmin = () => {
  const { data, isLoading, refetch } = useCategories();
  const createMutation = useCreateCategoryAdmin();
  const updateMutation = useUpdateCategoryAdmin();
  const deleteMutation = useDeleteCategoryAdmin();
  const [editing, setEditing] = useState(null);

  const handleSave = async (values) => {
    if (editing?.mode === 'create') {
      await createMutation.mutateAsync(values);
      toast.success('Category created');
    } else if (editing?.mode === 'edit') {
      await updateMutation.mutateAsync({ id: editing.category._id, payload: values });
      toast.success('Category updated');
    }
    setEditing(null);
    refetch();
  };

  const handleDelete = async (id) => {
    await deleteMutation.mutateAsync(id);
    toast.success('Category deleted');
    refetch();
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-6 text-sm">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-50">Categories</h1>
          <Button
            size="sm"
            onClick={() => setEditing({ mode: 'create', category: null })}
          >
            <Plus className="mr-1 h-4 w-4" />
            New category
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner fullScreen />
        ) : (
          <div className="space-y-2">
            {data?.map((c) => (
              <div
                key={c._id}
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-100">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.slug}</p>
                </div>
                <DropdownMenu
                  items={[
                    {
                      label: 'Edit',
                      icon: Edit2,
                      onClick: () => setEditing({ mode: 'edit', category: c })
                    },
                    {
                      label: 'Delete',
                      icon: Trash2,
                      onClick: () => handleDelete(c._id)
                    }
                  ]}
                />
              </div>
            ))}
          </div>
        )}

        {editing && (
          <CategoryEditorModal
            mode={editing.mode}
            initial={editing.category}
            onClose={() => setEditing(null)}
            onSave={handleSave}
          />
        )}
      </main>
    </div>
  );
};

const CategoryEditorModal = ({ mode, initial, onClose, onSave }) => {
  const [name, setName] = useState(initial?.name || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [description, setDescription] = useState(initial?.description || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, slug, description });
  };

  return (
    <Modal
      title={mode === 'create' ? 'Create category' : 'Edit category'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <div>
          <label className="mb-1 block text-xs text-slate-300">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-300">Slug</label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-300">Description</label>
          <textarea
            rows={3}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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

export default CategoriesAdmin;
