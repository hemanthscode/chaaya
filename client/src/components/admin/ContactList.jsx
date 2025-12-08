/**
 * ContactList Component
 * Manage contact submissions
 */

import React, { useState, useEffect } from 'react';
import { IoMail, IoMailOpen, IoCheckmark, IoTrash } from 'react-icons/io5';
import * as contactService from '@services/contactService';
import Button from '@components/common/Button';
import Modal from '@components/common/Modal';
import { useToast } from '@hooks/useToast';
import { formatDate, formatRelativeTime } from '@utils/formatters';
import { SUCCESS_MESSAGES } from '@utils/constants';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactService.getAll();
      setContacts(response.contacts || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleView = async (contact) => {
    setSelectedContact(contact);
    setShowModal(true);

    if (!contact.isRead) {
      try {
        await contactService.markAsRead(contact._id);
        fetchContacts();
      } catch (error) {
        console.error('Mark as read error:', error);
      }
    }
  };

  const handleMarkReplied = async (id) => {
    try {
      await contactService.markAsReplied(id);
      toast.success(SUCCESS_MESSAGES.CONTACT_MARKED_REPLIED);
      fetchContacts();
      setShowModal(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      await contactService.deleteContact(id);
      toast.success(SUCCESS_MESSAGES.CONTACT_DELETED);
      fetchContacts();
      setShowModal(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Contact Submissions
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {contacts.filter(c => !c.isRead).length} unread messages
        </p>
      </div>

      {/* List */}
      <div className="space-y-3">
        {contacts.map((contact) => (
          <div
            key={contact._id}
            onClick={() => handleView(contact)}
            className={`card p-4 cursor-pointer transition-colors ${
              !contact.isRead
                ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-600'
                : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="mt-1">
                  {contact.isRead ? (
                    <IoMailOpen className="text-gray-400" size={20} />
                  ) : (
                    <IoMail className="text-blue-600" size={20} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {contact.name}
                    </h3>
                    {contact.hasReplied && (
                      <span className="badge badge-success">Replied</span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {contact.email}
                    {contact.phone && ` • ${contact.phone}`}
                  </p>

                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {contact.subject}
                  </p>

                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {contact.message}
                  </p>
                </div>
              </div>

              <div className="text-right ml-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatRelativeTime(contact.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {contacts.length === 0 && (
          <div className="text-center py-12">
            <IoMail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No contact submissions yet
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Contact Details"
        size="lg"
      >
        {selectedContact && (
          <div className="space-y-6">
            {/* Contact info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Name
                  </dt>
                  <dd className="text-base text-gray-900 dark:text-white">
                    {selectedContact.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </dt>
                  <dd className="text-base text-gray-900 dark:text-white">
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="text-primary-600 hover:underline"
                    >
                      {selectedContact.email}
                    </a>
                  </dd>
                </div>
                {selectedContact.phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Phone
                    </dt>
                    <dd className="text-base text-gray-900 dark:text-white">
                      <a
                        href={`tel:${selectedContact.phone}`}
                        className="text-primary-600 hover:underline"
                      >
                        {selectedContact.phone}
                      </a>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Received
                  </dt>
                  <dd className="text-base text-gray-900 dark:text-white">
                    {formatDate(selectedContact.createdAt, 'PPpp')}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Subject & Message */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {selectedContact.subject}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {selectedContact.message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-dark-700">
              {!selectedContact.hasReplied && (
                <Button
                  variant="primary"
                  leftIcon={<IoCheckmark />}
                  onClick={() => handleMarkReplied(selectedContact._id)}
                >
                  Mark as Replied
                </Button>
              )}
              <Button
                variant="danger"
                leftIcon={<IoTrash />}
                onClick={() => handleDelete(selectedContact._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContactList;
