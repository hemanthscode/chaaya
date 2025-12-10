// src/pages/UploadAdmin.jsx
import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar.jsx';
import Button from '../components/ui/Button.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Input from '../components/ui/Input.jsx';
import { useCategories } from '../hooks/useCategories.js';
import api from '../services/api.js';
import toast from 'react-hot-toast';

const UploadAdmin = () => {
  const [file, setFile] = useState(null);
  const [bulkFiles, setBulkFiles] = useState([]);
  const [uploadingSingle, setUploadingSingle] = useState(false);
  const [uploadingBulk, setUploadingBulk] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState('published');
  const [tags, setTags] = useState('');

  const { data: categories } = useCategories();

  const handleSingleUpload = async () => {
    if (!file) {
      toast.error('Please choose an image');
      return;
    }

    try {
      setUploadingSingle(true);

      const formData = new FormData();
      formData.append('image', file);

      if (title) formData.append('title', title);
      if (description) formData.append('description', description);
      if (categoryId) formData.append('category', categoryId);
      formData.append('featured', featured ? 'true' : 'false');
      formData.append('status', status);
      if (tags) formData.append('tags', tags);

      await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Image uploaded and published');
      // reset fields
      setFile(null);
      setTitle('');
      setDescription('');
      setCategoryId('');
      setFeatured(false);
      setStatus('published');
      setTags('');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Upload failed');
    } finally {
      setUploadingSingle(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFiles.length) {
      toast.error('Please choose one or more images');
      return;
    }

    try {
      setUploadingBulk(true);
      const formData = new FormData();
      bulkFiles.forEach((f) => formData.append('images', f));

      await api.post('/upload/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Bulk upload complete (draft images created)');
      setBulkFiles([]);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Bulk upload failed');
    } finally {
      setUploadingBulk(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-6 text-sm">
        <h1 className="text-xl font-semibold text-slate-50">Upload images</h1>
        <p className="text-xs text-slate-400">
          Use curated upload to publish a single image with full details, or bulk upload to
          quickly add draft images.
        </p>

        {/* Curated single upload */}
        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="text-sm font-semibold text-slate-100">Curated upload (single)</h2>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-slate-300">Image file</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="text-xs text-slate-200"
              />
              {file && (
                <p className="mt-1 text-[11px] text-slate-400">
                  Selected: {file.name} ({Math.round(file.size / 1024)} KB)
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-300">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Optional – defaults to filename"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-300">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
                placeholder="Optional story or context"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-slate-300">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">None</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-300">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  id="featured"
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-3 w-3 rounded border-slate-700 bg-slate-950 text-brand-500 focus:ring-brand-500"
                />
                <label htmlFor="featured" className="text-xs text-slate-300">
                  Mark as featured
                </label>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-300">Tags</label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Comma-separated tags (portrait, wedding, outdoor)"
              />
            </div>

            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handleSingleUpload}
                disabled={!file || uploadingSingle}
              >
                {uploadingSingle ? 'Uploading...' : 'Upload & publish'}
              </Button>
            </div>

            {uploadingSingle && <LoadingSpinner />}
          </div>
        </section>

        {/* Bulk draft upload */}
        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="text-sm font-semibold text-slate-100">Bulk upload (draft)</h2>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-slate-300">Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setBulkFiles(Array.from(e.target.files || []))}
                className="text-xs text-slate-200"
              />
              {bulkFiles.length > 0 && (
                <p className="mt-1 text-[11px] text-slate-400">
                  Selected {bulkFiles.length} file(s)
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkUpload}
                disabled={!bulkFiles.length || uploadingBulk}
              >
                {uploadingBulk ? 'Uploading...' : 'Bulk upload (draft)'}
              </Button>
            </div>

            {uploadingBulk && <LoadingSpinner />}
          </div>
        </section>
      </main>
    </div>
  );
};

export default UploadAdmin;
