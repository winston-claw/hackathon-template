'use client';

import { ConvexProvider } from 'convex/react';
import { useRouter } from 'next/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { convex } from '../lib/convex-client';
import { AuthProvider } from '../lib/auth';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <ConvexProvider client={convex}>
          <AuthProvider
            onLogin={() => router.push('/dashboard')}
            onLogout={() => router.push('/')}
          >
            {children}
          </AuthProvider>
        </ConvexProvider>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: '100%',
  },
});
