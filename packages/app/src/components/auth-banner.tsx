'use client';

import { Alert, AlertText } from '@app-template/ui';

type AuthBannerTone = 'error' | 'info';

type AuthBannerProps = {
  tone: AuthBannerTone;
  message: string;
  className?: string;
};

export function AuthBanner({ tone, message, className }: AuthBannerProps) {
  return (
    <Alert action={tone === 'error' ? 'error' : 'info'} className={className ?? 'mb-4'}>
      <AlertText>{message}</AlertText>
    </Alert>
  );
}
