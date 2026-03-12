import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Qala - AI Empowering Artisans',
  description: 'A platform to connect Indian artisans directly with buyers, beautifully.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-karigar-bg text-stone-900 font-sans`}>
        <AuthProvider>
          <main className="w-full min-h-screen flex flex-col relative">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
