import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { updateProfileRequest } from '../../services/auth.js';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional()
});

const ProfileForm = () => {
  const { user, refreshProfile } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    values: {
      name: user?.name || '',
      bio: user?.bio || '',
      website: user?.website || '',
      instagram: user?.social?.instagram || '',
      twitter: user?.social?.twitter || '',
      facebook: user?.social?.facebook || '',
      linkedin: user?.social?.linkedin || ''
    }
  });

  const onSubmit = async (values) => {
    const payload = {
      name: values.name,
      bio: values.bio || '',
      website: values.website || null,
      social: {
        instagram: values.instagram || '',
        twitter: values.twitter || '',
        facebook: values.facebook || '',
        linkedin: values.linkedin || ''
      }
    };
    await updateProfileRequest(payload);
    await refreshProfile();
    toast.success('Profile updated');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-sm">
      <div>
        <label className="mb-1 block text-xs text-slate-300">Name</label>
        <Input {...register('name')} />
        {errors.name && (
          <p className="mt-1 text-[11px] text-red-400">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-xs text-slate-300">Bio</label>
        <textarea
          rows={4}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-offset-slate-950 placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
          {...register('bio')}
        />
        {errors.bio && (
          <p className="mt-1 text-[11px] text-red-400">{errors.bio.message}</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-xs text-slate-300">Website</label>
        <Input placeholder="https://example.com" {...register('website')} />
        {errors.website && (
          <p className="mt-1 text-[11px] text-red-400">{errors.website.message}</p>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-slate-300">Instagram</label>
          <Input placeholder="@username" {...register('instagram')} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-300">Twitter</label>
          <Input placeholder="@username" {...register('twitter')} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-300">Facebook</label>
          <Input {...register('facebook')} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-300">LinkedIn</label>
          <Input {...register('linkedin')} />
        </div>
      </div>
      <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  );
};

export default ProfileForm;
