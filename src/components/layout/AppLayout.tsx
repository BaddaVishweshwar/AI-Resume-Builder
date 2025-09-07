'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    if (status === 'loading') return;
    
    // Redirect to login if not authenticated and not on an auth page
    if (!session && !isAuthPage) {
      router.push('/login');
    }
  }, [session, status, isAuthPage, router]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
