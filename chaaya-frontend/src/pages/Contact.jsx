import React from 'react';
import ContactForm from '../components/forms/ContactForm.jsx';

const Contact = () => {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10 text-sm">
      <h1 className="mb-2 text-xl font-semibold text-slate-50">Contact</h1>
      <p className="mb-6 text-slate-300">
        For bookings, collaborations, or inquiries, share a few details and you&apos;ll
        receive a response shortly.
      </p>
      <ContactForm />
    </section>
  );
};

export default Contact;