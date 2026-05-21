'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'solito/navigation';
import { Box, Spinner } from '@app-template/ui';
import { useAuth } from '../auth';

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Box className="flex-1 flex-col items-center justify-center bg-background-50">
        <Spinner size="large" />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
