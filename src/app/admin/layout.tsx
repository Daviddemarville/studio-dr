import { ReactNode } from 'react'
import AdminNav from '../components/AdminNav'
import Protected from '../components/Protected'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      <AdminNav />

      <Protected>
        <main className="flex-1 p-6">
          {children}
        </main>
      </Protected>
    </div>
  )
}
