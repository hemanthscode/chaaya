/**
 * ContactForm Component
 * Contact form with validation
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoPerson, IoMail, IoCall, IoPaperPlane } from 'react-icons/io5';
import * as contactService from '@services/contactService';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import { useToast } from '@hooks/useToast';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@utils/constants';
import { isValidEmail, isValidPhone } from '@utils/validators';

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await contactService.submit(data);
      toast.success(SUCCESS_MESSAGES.CONTACT_SUBMITTED);
      reset();
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.SERVER_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Send us a message
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <Input
          label="Name"
          leftIcon={<IoPerson />}
          placeholder="Your name"
          error={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
            maxLength: {
              value: 50,
              message: 'Name cannot exceed 50 characters',
            },
          })}
        />

        {/* Email */}
        <Input
          type="email"
          label="Email"
          leftIcon={<IoMail />}
          placeholder="your@email.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            validate: (value) => isValidEmail(value) || 'Invalid email address',
          })}
        />

        {/* Phone (optional) */}
        <Input
          type="tel"
          label="Phone (Optional)"
          leftIcon={<IoCall />}
          placeholder="+1 (234) 567-890"
          error={errors.phone?.message}
          {...register('phone', {
            validate: (value) =>
              !value || isValidPhone(value) || 'Invalid phone number',
          })}
        />

        {/* Subject */}
        <Input
          label="Subject"
          placeholder="What is this regarding?"
          error={errors.subject?.message}
          {...register('subject', {
            required: 'Subject is required',
            minLength: {
              value: 5,
              message: 'Subject must be at least 5 characters',
            },
            maxLength: {
              value: 100,
              message: 'Subject cannot exceed 100 characters',
            },
          })}
        />

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={6}
            placeholder="Tell us more about your inquiry..."
            className="input resize-none"
            {...register('message', {
              required: 'Message is required',
              minLength: {
                value: 20,
                message: 'Message must be at least 20 characters',
              },
              maxLength: {
                value: 1000,
                message: 'Message cannot exceed 1000 characters',
              },
            })}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          leftIcon={<IoPaperPlane />}
        >
          Send Message
        </Button>
      </form>
    </Card>
  );
};

export default ContactForm;
