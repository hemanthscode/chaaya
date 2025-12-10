import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain 1 uppercase')
      .regex(/[a-z]/, 'Must contain 1 lowercase')
      .regex(/\d/, 'Must contain 1 number'),
    confirmPassword: z.string().min(1, 'Please confirm password')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

const RegisterForm = () => {
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (values) => {
    await registerUser({
      name: values.name,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword
    });
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
        <label className="mb-1 block text-xs text-slate-300">Email</label>
        <Input type="email" autoComplete="email" {...register('email')} />
        {errors.email && (
          <p className="mt-1 text-[11px] text-red-400">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-xs text-slate-300">Password</label>
        <Input type="password" autoComplete="new-password" {...register('password')} />
        {errors.password && (
          <p className="mt-1 text-[11px] text-red-400">{errors.password.message}</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-xs text-slate-300">Confirm Password</label>
        <Input
          type="password"
          autoComplete="new-password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-[11px] text-red-400">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
};

export default RegisterForm;
