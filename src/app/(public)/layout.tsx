// src/app/(public)/layout.tsx

import { ReactNode } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Script from "next/script";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Script 
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />

      <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800 antialiased">
        <Header />

        <main className="flex-1 max-w-6xl mx-auto px-4 py-10 space-y-16">
          {children}
        </main>

        <Footer />
      </div>
    </>
  );
}
