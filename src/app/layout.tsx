// src/app/layout.tsx

import './globals.css';
import { ReactNode } from 'react';

// Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'Studio DR',
  description: 'Studio de développement web fullstack',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}

        {/* Global toaster (visible partout : public + admin) */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </body>
    </html>
  );
}
