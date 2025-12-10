import React from 'react';
import ProfileForm from '../components/forms/ProfileForm.jsx';
import { useAuth } from '../hooks/useAuth.js';

const Profile = () => {
  const { user } = useAuth();

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 text-sm">
      <h1 className="mb-2 text-xl font-semibold text-slate-50">Profile</h1>
      <p className="mb-6 text-slate-300">
        Manage your profile details and social links.
      </p>
      {user && <ProfileForm />}
    </section>
  );
};

export default Profile;
