'use client';

import { ConvexProvider } from 'convex/react';
import { useRouter } from 'next/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UIProvider } from '@app-template/ui';
import { AppErrorBoundary } from '@app-template/app';
import { convex } from '../lib/convex-client';
import { AuthProvider } from '../lib/auth';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <UIProvider>
      <SafeAreaProvider style={{ flex: 1, minHeight: '100%' }}>
        <AppErrorBoundary>
          <ConvexProvider client={convex}>
            <AuthProvider
              onLogin={() => router.push('/dashboard')}
              onLogout={() => router.push('/')}
            >
              {children}
            </AuthProvider>
          </ConvexProvider>
        </AppErrorBoundary>
      </SafeAreaProvider>
    </UIProvider>
  );
}
