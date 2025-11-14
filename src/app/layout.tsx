import './globals.css';
import { ReactNode } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

// Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Script Next.js
import Script from "next/script";

export const metadata = {
  title: 'Studio DR',
  description: 'Studio de développement web fullstack',
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="fr">
      <head>
        {/* Turnstile CAPTCHA */}
        <Script 
          src="https://challenges.cloudflare.com/turnstile/v0/api.js" 
          strategy="afterInteractive"
        />
      </head>

      <body className="flex flex-col min-h-screen bg-gray-100 text-gray-800 antialiased">

        <Header />

        <main className="flex-1 max-w-6xl mx-auto px-4 py-10 space-y-16">
          {children}
        </main>

        <Footer />

        {/* Toast system (global notifications) */}
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
