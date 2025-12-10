import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';
import { submitContact } from '../../services/contact.js';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = async (values) => {
    await submitContact(values);
    toast.success('Message sent successfully');
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-slate-300">Name</label>
          <Input {...register('name')} />
          {errors.name && (
            <p className="mt-1 text-[11px] text-red-400">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-300">Email</label>
          <Input type="email" {...register('email')} />
          {errors.email && (
            <p className="mt-1 text-[11px] text-red-400">{errors.email.message}</p>
          )}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-slate-300">Subject</label>
        <Input {...register('subject')} />
        {errors.subject && (
          <p className="mt-1 text-[11px] text-red-400">{errors.subject.message}</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-xs text-slate-300">Message</label>
        <textarea
          rows={5}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-offset-slate-950 placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
          {...register('message')}
        />
        {errors.message && (
          <p className="mt-1 text-[11px] text-red-400">{errors.message.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send message'}
      </Button>
    </form>
  );
};

export default ContactForm;
