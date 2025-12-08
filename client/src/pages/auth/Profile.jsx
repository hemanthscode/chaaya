/**
 * Profile Page
 * User profile management
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoCamera, IoPerson, IoMail, IoLockClosed, IoSave } from 'react-icons/io5';
import { useAuth } from '@hooks/useAuth';
import Container from '@components/layout/Container';
import Card from '@components/common/Card';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import Modal from '@components/common/Modal';
import { isValidEmail } from '@utils/validators';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm();

  const newPassword = watch('newPassword');

  const onProfileSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await updateProfile(data);
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setShowPasswordModal(false);
      resetPasswordForm();
    } catch (error) {
      console.error('Password change error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8">
      <Container size="default">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account information
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Picture */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Profile Picture
              </h2>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center text-white text-3xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-dark-800 rounded-full shadow-lg border-2 border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700">
                    <IoCamera size={16} />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user?.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Member since {new Date(user?.createdAt).getFullYear()}
                  </p>
                </div>
              </div>
            </Card>

            {/* Profile Information */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Profile Information
              </h2>
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                <Input
                  label="Full Name"
                  leftIcon={<IoPerson />}
                  error={profileErrors.name?.message}
                  {...registerProfile('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                />

                <Input
                  type="email"
                  label="Email Address"
                  leftIcon={<IoMail />}
                  error={profileErrors.email?.message}
                  {...registerProfile('email', {
                    required: 'Email is required',
                    validate: (value) => isValidEmail(value) || 'Invalid email address',
                  })}
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    leftIcon={<IoSave />}
                    loading={isSubmitting}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>

            {/* Security */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Security
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Keep your account secure by using a strong password
                  </p>
                  <Button
                    variant="outline"
                    leftIcon={<IoLockClosed />}
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </Card>

            {/* Account Type */}
            {user?.role === 'admin' && (
              <Card className="border-2 border-primary-200 dark:border-primary-900">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Admin Account
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You have administrator privileges
                    </p>
                  </div>
                  <span className="badge bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 px-4 py-2">
                    Admin
                  </span>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Change Password Modal */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => {
            setShowPasswordModal(false);
            resetPasswordForm();
          }}
          title="Change Password"
        >
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <Input
              type="password"
              label="Current Password"
              leftIcon={<IoLockClosed />}
              placeholder="Enter current password"
              error={passwordErrors.currentPassword?.message}
              {...registerPassword('currentPassword', {
                required: 'Current password is required',
              })}
            />

            <Input
              type="password"
              label="New Password"
              leftIcon={<IoLockClosed />}
              placeholder="Enter new password"
              error={passwordErrors.newPassword?.message}
              {...registerPassword('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />

            <Input
              type="password"
              label="Confirm New Password"
              leftIcon={<IoLockClosed />}
              placeholder="Confirm new password"
              error={passwordErrors.confirmPassword?.message}
              {...registerPassword('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === newPassword || 'Passwords do not match',
              })}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPasswordModal(false);
                  resetPasswordForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={isSubmitting}>
                Update Password
              </Button>
            </div>
          </form>
        </Modal>
      </Container>
    </div>
  );
};

export default Profile;
