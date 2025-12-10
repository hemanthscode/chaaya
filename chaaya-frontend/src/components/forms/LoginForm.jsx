import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required')
});

const LoginForm = () => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: 'admin@chaaya.com', password: 'Admin123!' }
  });

  const onSubmit = async (values) => {
    await login(values.email, values.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-sm">
      <div>
        <label className="mb-1 block text-xs text-slate-300">Email</label>
        <Input type="email" autoComplete="email" {...register('email')} />
        {errors.email && (
          <p className="mt-1 text-[11px] text-red-400">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-xs text-slate-300">Password</label>
        <Input type="password" autoComplete="current-password" {...register('password')} />
        {errors.password && (
          <p className="mt-1 text-[11px] text-red-400">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

export default LoginForm;
