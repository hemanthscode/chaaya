// src/pages/admin/SeriesAdmin.jsx
import React, { useState, useCallback } from 'react';
import Sidebar from '../components/layout/Sidebar.jsx';
import {
  useSeriesList,
  useCreateSeriesAdmin,
  useUpdateSeriesAdmin,
  useDeleteSeriesAdmin
} from '../hooks/useSeries.js';
import { useUploadMultipleImages } from '../hooks/useUpload.js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCategories } from '../services/categories.js';
import { fetchImages } from '../services/images.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import Input from '../components/ui/Input.jsx';
import Badge from '../components/ui/Badge.jsx';
import { 
  Trash2, Edit2, Plus, Eye, Star, Image as ImageIcon, 
  Search, MoreVertical, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';

const SeriesAdmin = () => {
  const queryClient = useQueryClient();
  const [page] = useState(1);
  const { data, isLoading } = useSeriesList({ page, limit: 50 });
  const createMutation = useCreateSeriesAdmin();
  const updateMutation = useUpdateSeriesAdmin();
  const deleteMutation = useDeleteSeriesAdmin();

  const [editing, setEditing] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSave = async (values) => {
    try {
      if (editing?.mode === 'create') {
        await createMutation.mutateAsync(values);
        toast.success('Series created');
      } else if (editing?.mode === 'edit') {
        await updateMutation.mutateAsync({ id: editing.series._id, payload: values });
        toast.success('Series updated');
      }
      
      queryClient.invalidateQueries({ queryKey: ['series'] });
      queryClient.invalidateQueries({ queryKey: ['images'] });
      
      setEditing(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this series? Images will remain but be unlinked.')) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Deleted');
      
      queryClient.invalidateQueries({ queryKey: ['series'] });
      queryClient.invalidateQueries({ queryKey: ['images'] });
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const filteredSeries = data?.items?.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.slug.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-50">Series</h1>
            <p className="text-xs text-slate-500">Curate image collections</p>
          </div>
          <Button size="sm" onClick={() => setEditing({ mode: 'create' })}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New Series
          </Button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search series..."
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : filteredSeries.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 py-16">
            <ImageIcon className="mb-3 h-10 w-10 text-slate-600" />
            <p className="text-sm text-slate-400">
              {searchQuery ? 'No matching series' : 'No series yet'}
            </p>
            {!searchQuery && (
              <Button size="sm" onClick={() => setEditing({ mode: 'create' })} className="mt-4">
                Create First Series
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredSeries.map((s) => (
              <SeriesCard
                key={s._id}
                series={s}
                onEdit={() => setEditing({ mode: 'edit', series: s })}
                onDelete={() => handleDelete(s._id)}
              />
            ))}
          </div>
        )}

        {editing && (
          <SeriesEditorModal
            mode={editing.mode}
            initial={editing.series}
            onClose={() => setEditing(null)}
            onSave={handleSave}
          />
        )}
      </main>
    </div>
  );
};

const SeriesCard = ({ series, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-colors hover:border-slate-700">
      <div className="relative aspect-video overflow-hidden bg-slate-950">
        {series.coverImage?.thumbnailUrl || series.coverImage?.cloudinaryUrl ? (
          <img
            src={series.coverImage.thumbnailUrl || series.coverImage.cloudinaryUrl}
            alt={series.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="h-12 w-12 text-slate-700" />
          </div>
        )}
        
        <div className="absolute left-2 top-2 flex gap-2">
          {series.featured && (
            <div className="rounded-full bg-amber-500/90 p-1.5">
              <Star className="h-3 w-3 fill-white text-white" />
            </div>
          )}
          <Badge variant={series.status === 'published' ? 'success' : 'warning'}>
            {series.status}
          </Badge>
        </div>

        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-slate-950/80 px-2 py-1 text-xs text-slate-300 backdrop-blur-sm">
          <ImageIcon className="h-3 w-3" />
          {series.images?.length || 0}
        </div>
      </div>

      <div className="p-4">
        <h3 className="mb-1 font-medium text-slate-100">{series.title}</h3>
        <p className="mb-2 text-xs text-slate-500">/{series.slug}</p>
        
        {series.description && (
          <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-slate-400">
            {series.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            {series.category?.name && <span>{series.category.name}</span>}
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {series.views || 0}
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded p-1 hover:bg-slate-800"
            >
              <MoreVertical className="h-4 w-4 text-slate-400" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute bottom-full right-0 z-20 mb-1 w-32 rounded-lg border border-slate-800 bg-slate-900 py-1 shadow-xl">
                  <button
                    onClick={() => {
                      onEdit();
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete();
                      setMenuOpen(false);
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
        </div>
      </div>
    </div>
  );
};

const SeriesEditorModal = ({ mode, initial, onClose, onSave }) => {
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState(initial?.title || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [coverImage, setCoverImage] = useState(initial?.coverImage?._id || '');
  const [selectedImages, setSelectedImages] = useState(
    initial?.images?.map((img) => (typeof img === 'string' ? img : img._id)) || []
  );
  const [category, setCategory] = useState(initial?.category?._id || '');
  const [order, setOrder] = useState(initial?.order || 0);
  const [featured, setFeatured] = useState(initial?.featured || false);
  const [status, setStatus] = useState(initial?.status || 'draft');
  
  const [activeTab, setActiveTab] = useState('select');
  const [imageSearch, setImageSearch] = useState('');
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadMultiple = useUploadMultipleImages();

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const { data: imagesData } = useQuery({
    queryKey: ['images', { limit: 500 }],
    queryFn: () => fetchImages({ limit: 500 })
  });

  const categories = categoriesData || [];
  const allImages = imagesData?.items || [];

  const handleTitleChange = (value) => {
    setTitle(value);
    if (mode === 'create' && !slug) {
      setSlug(
        value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
      );
    }
  };

  const toggleImageSelection = (imageId) => {
    setSelectedImages((prev) => {
      const newSelection = prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId];
      return newSelection;
    });
  };

  const onDrop = useCallback((acceptedFiles) => {
    setUploadFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true
  });

  const removeUploadFile = (index) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (selectedImages.length === 0 && uploadFiles.length === 0) {
      return toast.error('Select or upload at least one image');
    }

    setUploading(true);

    try {
      let finalImageIds = [...selectedImages];

      // Upload new files if any
      if (uploadFiles.length > 0) {
        const uploadResult = await uploadMultiple.mutateAsync({ 
          files: uploadFiles, 
          onProgress: setUploadProgress,
          metadata: { status: 'published' } // ✅ Set to published
        });
        
        const uploadedIds = uploadResult.images?.map(img => img._id) || [];
        finalImageIds = [...finalImageIds, ...uploadedIds];

        // Set first uploaded as cover if no cover selected
        if (!coverImage && uploadedIds.length > 0) {
          setCoverImage(uploadedIds[0]);
        }

        // Invalidate images cache to refresh the list
        queryClient.invalidateQueries({ queryKey: ['images'] });
      }

      // Prepare series payload
      const payload = {
        title,
        slug,
        description,
        coverImage: coverImage || finalImageIds[0] || null,
        images: finalImageIds,
        category: category || null,
        order: Number(order),
        featured,
        status
      };
      
      // Save series
      await onSave(payload);
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const filteredImages = allImages.filter(img =>
    img.title.toLowerCase().includes(imageSearch.toLowerCase())
  );

  const coverImageData = allImages.find(img => img._id === coverImage);

  return (
    <Modal
      title={mode === 'create' ? 'Create Series' : 'Edit Series'}
      onClose={onClose}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="flex h-[75vh] gap-4">
        <div className="flex w-1/2 flex-col gap-3 overflow-y-auto pr-2">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Title <span className="text-red-400">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Wedding Portraits"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Slug <span className="text-red-400">*</span>
              </label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="wedding-portraits"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description..."
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
              >
                <option value="">None</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Cover Image
            </label>
            <select
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
            >
              <option value="">Auto (first image)</option>
              {selectedImages.map(imgId => {
                const img = allImages.find(i => i._id === imgId);
                return img ? (
                  <option key={img._id} value={img._id}>
                    {img.title}
                  </option>
                ) : null;
              })}
            </select>
          </div>

          {coverImageData && (
            <div className="overflow-hidden rounded-lg border border-slate-800">
              <img
                src={coverImageData.thumbnailUrl || coverImageData.cloudinaryUrl}
                alt="Cover"
                className="h-32 w-full object-cover"
              />
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Order
              </label>
              <Input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                min="0"
              />
            </div>
            <div className="flex items-end">
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
        </div>

        <div className="flex w-1/2 flex-col gap-3 overflow-hidden rounded-lg border border-slate-800 bg-slate-900 p-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300">
              Images ({selectedImages.length + uploadFiles.length})
            </label>
            {(selectedImages.length > 0 || uploadFiles.length > 0) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedImages([]);
                  setUploadFiles([]);
                }}
                className="text-xs text-slate-500 hover:text-red-400"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('select')}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'select'
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Select
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'upload'
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Upload {uploadFiles.length > 0 && `(${uploadFiles.length})`}
            </button>
          </div>

          {activeTab === 'select' && (
            <>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-500" />
                <Input
                  value={imageSearch}
                  onChange={(e) => setImageSearch(e.target.value)}
                  placeholder="Search images..."
                  className="pl-7 text-xs"
                />
              </div>

              <div className="flex-1 space-y-1.5 overflow-y-auto">
                {filteredImages.length === 0 ? (
                  <p className="text-center text-xs text-slate-500">No images found</p>
                ) : (
                  filteredImages.map((img) => (
                    <label
                      key={img._id}
                      className={`flex cursor-pointer items-center gap-2 rounded p-1.5 transition-colors ${
                        selectedImages.includes(img._id) ? 'bg-brand-500/10' : 'hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(img._id)}
                        onChange={() => toggleImageSelection(img._id)}
                        className="h-3.5 w-3.5 shrink-0 rounded border-slate-700"
                      />
                      <div className="h-10 w-14 shrink-0 overflow-hidden rounded border border-slate-800">
                        <img
                          src={img.thumbnailUrl || img.cloudinaryUrl}
                          alt={img.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="flex-1 truncate text-xs text-slate-300">
                        {img.title}
                      </span>
                      {selectedImages.includes(img._id) && (
                        <span className="text-[10px] text-slate-500">
                          #{selectedImages.indexOf(img._id) + 1}
                        </span>
                      )}
                    </label>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'upload' && (
            <>
              <div
                {...getRootProps()}
                className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                  isDragActive
                    ? 'border-brand-500 bg-brand-500/10'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <input {...getInputProps()} />
                <ImageIcon className="mx-auto mb-2 h-8 w-8 text-slate-500" />
                <p className="text-xs text-slate-400">
                  {isDragActive ? 'Drop images here' : 'Drag images or click to browse'}
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Images will be published automatically
                </p>
              </div>

              {uploadFiles.length > 0 && (
                <div className="flex-1 space-y-1.5 overflow-y-auto">
                  {uploadFiles.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded border border-slate-800 bg-slate-950 p-1.5"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt=""
                        className="h-8 w-8 rounded object-cover"
                      />
                      <span className="flex-1 truncate text-xs text-slate-300">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeUploadFile(i)}
                        className="text-slate-500 hover:text-red-400"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </form>

      {uploading && uploadFiles.length > 0 && (
        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-brand-500 transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="mt-1 text-center text-xs text-slate-400">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2 border-t border-slate-800 pt-3">
        <Button type="button" variant="ghost" onClick={onClose} disabled={uploading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={uploading || (selectedImages.length === 0 && uploadFiles.length === 0)}
        >
          {uploading 
            ? 'Uploading...' 
            : mode === 'create' 
            ? 'Create Series' 
            : 'Update Series'}
        </Button>
      </div>
    </Modal>
  );
};

export default SeriesAdmin;
