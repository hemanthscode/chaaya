import React from 'react';
import { Navigate } from 'react-router-dom';
import RegisterForm from '../components/forms/RegisterForm.jsx';
import { useAuth } from '../hooks/useAuth.js';

const Register = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;

  return (
    <section className="mx-auto max-w-md px-4 py-10 text-sm">
      <h1 className="mb-2 text-xl font-semibold text-slate-50">Create account</h1>
      <p className="mb-6 text-slate-300">
        Sign up to save favorites and access personalized features.
      </p>
      <RegisterForm />
    </section>
  );
};

export default Register;
