// src/app/(admin)/admin/layout.tsx

import type { ReactNode } from 'react';
import AdminNav from './components/AdminNav';
import Protected from './components/Protected';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Protected>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex">
        <AdminNav />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </Protected>
  );
}
