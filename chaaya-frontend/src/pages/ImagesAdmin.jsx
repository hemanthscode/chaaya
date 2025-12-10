// src/pages/admin/ImagesAdmin.jsx
import React, { useState, useCallback } from 'react';
import Sidebar from '../components/layout/Sidebar.jsx';
import { useImages, useDeleteImageAdmin, useUpdateImageAdmin, useBulkDeleteImages } from '../hooks/useImages.js';
import { useUploadSingleImage, useUploadMultipleImages } from '../hooks/useUpload.js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCategories } from '../services/categories.js';
import { fetchSeries } from '../services/series.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import Input from '../components/ui/Input.jsx';
import Badge from '../components/ui/Badge.jsx';
import { Trash2, Edit2, Eye, Star, Upload, X, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';

const ImagesAdmin = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useImages({ page, limit: 20 });
  const deleteMutation = useDeleteImageAdmin();
  const bulkDeleteMutation = useBulkDeleteImages();

  const [editing, setEditing] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selected, setSelected] = useState(new Set());

  const images = data?.items || [];
  const pagination = data?.pagination;

  const handleDelete = async (id) => {
    if (!confirm('Delete permanently?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Deleted');
      
      // Invalidate both caches
      queryClient.invalidateQueries({ queryKey: ['images'] });
      queryClient.invalidateQueries({ queryKey: ['series'] });
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} images?`)) return;
    try {
      await bulkDeleteMutation.mutateAsync(Array.from(selected));
      toast.success('Deleted');
      setSelected(new Set());
      
      // Invalidate both caches
      queryClient.invalidateQueries({ queryKey: ['images'] });
      queryClient.invalidateQueries({ queryKey: ['series'] });
    } catch (err) {
      toast.error('Failed');
    }
  };

  const toggleSelect = (id) => {
    const newSet = new Set(selected);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelected(newSet);
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-50">Images</h1>
            <p className="text-xs text-slate-500">Manage your portfolio</p>
          </div>
          <div className="flex gap-2">
            {selected.size > 0 && (
              <Button size="sm" variant="outline" onClick={handleBulkDelete}>
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Delete ({selected.size})
              </Button>
            )}
            <Button size="sm" onClick={() => setUploadOpen(true)}>
              <Upload className="mr-1.5 h-3.5 w-3.5" />
              Upload
            </Button>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 py-16">
            <Upload className="mb-3 h-10 w-10 text-slate-600" />
            <p className="text-sm text-slate-400">No images yet</p>
            <Button size="sm" onClick={() => setUploadOpen(true)} className="mt-4">
              Upload First Image
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-lg border border-slate-800">
              <table className="w-full text-xs">
                <thead className="bg-slate-900 text-slate-400">
                  <tr>
                    <th className="w-8 px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selected.size === images.length}
                        onChange={() =>
                          setSelected(
                            selected.size === images.length
                              ? new Set()
                              : new Set(images.map((i) => i._id))
                          )
                        }
                        className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900"
                      />
                    </th>
                    <th className="px-3 py-2 text-left">Image</th>
                    <th className="px-3 py-2 text-left">Title</th>
                    <th className="px-3 py-2 text-left">Category</th>
                    <th className="px-3 py-2 text-left">Series</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-center">Views</th>
                    <th className="w-16 px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950">
                  {images.map((img) => (
                    <tr
                      key={img._id}
                      className={`transition-colors hover:bg-slate-900/40 ${
                        selected.has(img._id) ? 'bg-brand-500/5' : ''
                      }`}
                    >
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selected.has(img._id)}
                          onChange={() => toggleSelect(img._id)}
                          className="h-3.5 w-3.5 rounded border-slate-700"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div className="relative h-10 w-14 overflow-hidden rounded border border-slate-800">
                          <img
                            src={img.thumbnailUrl || img.cloudinaryUrl}
                            alt={img.title}
                            className="h-full w-full object-cover"
                          />
                          {img.featured && (
                            <Star className="absolute right-0.5 top-0.5 h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                          )}
                        </div>
                      </td>
                      <td className="max-w-xs px-3 py-2">
                        <p className="truncate font-medium text-slate-100">{img.title}</p>
                        {img.tags?.length > 0 && (
                          <p className="mt-0.5 truncate text-[10px] text-slate-500">
                            {img.tags.slice(0, 2).join(', ')}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-300">{img.category?.name || '—'}</td>
                      <td className="px-3 py-2 text-slate-300">{img.series?.title || '—'}</td>
                      <td className="px-3 py-2">
                        <Badge variant={img.status === 'published' ? 'success' : 'warning'}>
                          {img.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-center text-slate-400">{img.views || 0}</td>
                      <td className="px-3 py-2">
                        <ActionMenu
                          onEdit={() => setEditing(img)}
                          onDelete={() => handleDelete(img._id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination?.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pagination.page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {uploadOpen && (
          <UploadModal
            onClose={() => setUploadOpen(false)}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['images'] });
              setUploadOpen(false);
            }}
          />
        )}
        {editing && (
          <EditModal
            image={editing}
            onClose={() => setEditing(null)}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['images'] });
              queryClient.invalidateQueries({ queryKey: ['series'] });
              setEditing(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

const ActionMenu = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded p-1 hover:bg-slate-800"
      >
        <MoreVertical className="h-4 w-4 text-slate-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-6 z-20 w-32 rounded-lg border border-slate-800 bg-slate-900 py-1 shadow-xl">
            <button
              onClick={() => {
                onEdit();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
            >
              <Edit2 className="h-3 w-3" />
              Edit
            </button>
            <button
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-slate-800"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const UploadModal = ({ onClose, onSuccess }) => {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState('single');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [series, setSeries] = useState('');
  const [tags, setTags] = useState('');
  const [featured, setFeatured] = useState(false);

  const uploadSingle = useUploadSingleImage();
  const uploadMultiple = useUploadMultipleImages();

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const { data: seriesData } = useQuery({
    queryKey: ['series'],
    queryFn: () => fetchSeries({ limit: 100 })
  });

  const onDrop = useCallback(
    (accepted) => {
      setFiles(mode === 'single' ? [accepted[0]] : [...files, ...accepted]);
    },
    [mode, files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: mode === 'bulk'
  });

  const handleUpload = async () => {
    if (!files.length) return toast.error('Select images');
    setUploading(true);

    try {
      if (mode === 'single') {
        await uploadSingle.mutateAsync({
          file: files[0],
          metadata: { 
            title, 
            category: category || null, 
            series: series || null, 
            tags, 
            featured, 
            status: 'published' 
          }
        });
        toast.success('Uploaded');
      } else {
        await uploadMultiple.mutateAsync({ files, onProgress: setProgress });
        toast.success(`${files.length} uploaded`);
      }
      
      // Invalidate both caches
      queryClient.invalidateQueries({ queryKey: ['images'] });
      queryClient.invalidateQueries({ queryKey: ['series'] });
      
      onSuccess();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal title="Upload Images" onClose={onClose} size="xl">
      <div className="flex h-[70vh] gap-4">
        <div className="flex w-2/5 flex-col gap-3">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={mode === 'single' ? 'default' : 'outline'}
              onClick={() => {
                setMode('single');
                setFiles([]);
              }}
            >
              Single
            </Button>
            <Button
              size="sm"
              variant={mode === 'bulk' ? 'default' : 'outline'}
              onClick={() => {
                setMode('bulk');
                setFiles([]);
              }}
            >
              Bulk
            </Button>
          </div>

          <div
            {...getRootProps()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
              isDragActive
                ? 'border-brand-500 bg-brand-500/10'
                : 'border-slate-700 bg-slate-900 hover:border-slate-600'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mb-2 h-8 w-8 text-slate-500" />
            <p className="text-xs text-slate-400">
              {isDragActive ? 'Drop here' : 'Drag or click'}
            </p>
          </div>

          {files.length > 0 && (
            <div className="flex-1 space-y-1.5 overflow-y-auto rounded-lg border border-slate-800 bg-slate-900 p-2">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded border border-slate-800 bg-slate-950 p-1.5"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="h-8 w-8 rounded object-cover"
                  />
                  <span className="flex-1 truncate text-xs text-slate-300">{file.name}</span>
                  <button
                    onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                    className="text-slate-500 hover:text-red-400"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex w-3/5 flex-col gap-3 overflow-y-auto rounded-lg border border-slate-800 bg-slate-900 p-4">
          {mode === 'single' && files.length > 0 ? (
            <>
              <h3 className="text-sm font-medium text-slate-300">Image Details</h3>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100"
                >
                  <option value="">Category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100"
                >
                  <option value="">Series</option>
                  {seriesData?.items?.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags (comma-separated)"
              />

              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-700"
                />
                Featured
              </label>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-xs text-slate-500">
              {mode === 'bulk' ? 'Bulk upload mode' : 'Select an image to add details'}
            </div>
          )}
        </div>
      </div>

      {uploading && mode === 'bulk' && (
        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2 border-t border-slate-800 pt-3">
        <Button variant="ghost" onClick={onClose} disabled={uploading}>
          Cancel
        </Button>
        <Button onClick={handleUpload} disabled={uploading || !files.length}>
          {uploading ? 'Uploading...' : `Upload ${files.length ? `(${files.length})` : ''}`}
        </Button>
      </div>
    </Modal>
  );
};

const EditModal = ({ image, onClose, onSuccess }) => {
  const [title, setTitle] = useState(image.title || '');
  const [description, setDescription] = useState(image.description || '');
  const [category, setCategory] = useState(image.category?._id || '');
  const [series, setSeries] = useState(image.series?._id || '');
  const [tags, setTags] = useState((image.tags || []).join(', '));
  const [status, setStatus] = useState(image.status || 'draft');
  const [featured, setFeatured] = useState(image.featured || false);

  const updateMutation = useUpdateImageAdmin();
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const { data: seriesData } = useQuery({
    queryKey: ['series'],
    queryFn: () => fetchSeries({ limit: 100 })
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        id: image._id,
        payload: {
          title,
          description,
          category: category || null,
          series: series || null,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          status,
          featured
        }
      });
      toast.success('Updated');
      onSuccess();
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <Modal title="Edit Image" onClose={onClose} size="xl">
      <form onSubmit={handleSubmit} className="flex h-[70vh] gap-4">
        <div className="flex w-2/5 items-center justify-center rounded-lg border border-slate-800 bg-slate-900">
          <img
            src={image.thumbnailUrl || image.cloudinaryUrl}
            alt={image.title}
            className="max-h-full max-w-full rounded object-contain"
          />
        </div>

        <div className="flex w-3/5 flex-col gap-3 overflow-y-auto">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />

          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
          />

          <div className="grid grid-cols-2 gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
            >
              <option value="">Category</option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
            >
              <option value="">Series</option>
              {seriesData?.items?.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags" />

          <div className="flex items-center gap-4">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>

            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-700"
              />
              Featured
            </label>
          </div>
        </div>
      </form>

      <div className="mt-4 flex justify-end gap-2 border-t border-slate-800 pt-3">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Save</Button>
      </div>
    </Modal>
  );
};

export default ImagesAdmin;
