import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar.jsx';
import { useQuery } from '@tanstack/react-query';
import {
  fetchContactsAdmin,
  markContactReadAdmin,
  markContactRepliedAdmin
} from '../services/contact.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Button from '../components/ui/Button.jsx';
import DropdownMenu from '../components/ui/DropdownMenu.jsx';
import { Check, MailOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const Contacts = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'contacts', page],
    queryFn: () => fetchContactsAdmin({ page, limit: 20 })
  });

  const handleMarkRead = async (id) => {
    await markContactReadAdmin(id);
    toast.success('Marked as read');
    refetch();
  };

  const handleMarkReplied = async (id) => {
    await markContactRepliedAdmin(id, 'Replied from dashboard');
    toast.success('Marked as replied');
    refetch();
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-6 text-sm">
        <h1 className="mb-2 text-xl font-semibold text-slate-50">Contact messages</h1>
        {isLoading ? (
          <LoadingSpinner fullScreen />
        ) : (
          <>
            <div className="space-y-3">
              {data?.items?.map((c) => (
                <div
                  key={c._id}
                  className="flex items-start justify-between rounded-lg border border-slate-800 bg-slate-900 p-3"
                >
                  <div>
                    <p className="text-xs text-slate-400">
                      {c.name} • {c.email}
                    </p>
                    <p className="text-sm font-medium text-slate-100">{c.subject}</p>
                    <p className="mt-1 text-xs text-slate-300">{c.message}</p>
                  </div>
                  <DropdownMenu
                    items={[
                      {
                        label: 'Mark as read',
                        icon: MailOpen,
                        onClick: () => handleMarkRead(c._id)
                      },
                      {
                        label: 'Mark as replied',
                        icon: Check,
                        onClick: () => handleMarkReplied(c._id)
                      }
                    ]}
                  />
                </div>
              ))}
            </div>
            {data?.pagination && (
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <p>
                  Page {data.pagination.page} of {data.pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={data.pagination.page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={data.pagination.page >= data.pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Contacts;
