import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/forms/LoginForm.jsx';
import { useAuth } from '../hooks/useAuth.js';

const Login = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;

  return (
    <section className="mx-auto max-w-md px-4 py-10 text-sm">
      <h1 className="mb-2 text-xl font-semibold text-slate-50">Login</h1>
      <p className="mb-6 text-slate-300">
        Access your Chaaya account to manage favorites and admin tools.
      </p>
      <LoginForm />
    </section>
  );
};

export default Login;
