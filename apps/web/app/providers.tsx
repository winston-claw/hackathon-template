'use client';

import { ConvexProvider } from 'convex/react';
import { useRouter } from 'next/navigation';
import { convex } from '../lib/convex-client';
import { AuthProvider } from '../lib/auth';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <ConvexProvider client={convex}>
      <AuthProvider
        onLogin={() => router.push('/dashboard')}
        onLogout={() => router.push('/')}
      >
        {children}
      </AuthProvider>
    </ConvexProvider>
  );
}
