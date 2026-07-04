'use client';

import type { ReactNode } from 'react';
import { Platform } from 'react-native';
import {
  KeyboardAvoidingView,
  ScrollView,
} from '@app-template/ui';
import { Screen } from './screen';

type AuthScreenProps = {
  children: ReactNode;
};

export function AuthScreen({ children }: AuthScreenProps) {
  return (
    <Screen className="flex-1 bg-[#f7f7f5]" padding={{ top: 12, bottom: 24 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, width: '100%' }}
      >
        <ScrollView
          {...(Platform.OS === 'web'
            ? {}
            : {
                keyboardShouldPersistTaps: 'handled' as const,
                showsVerticalScrollIndicator: false,
              })}
          contentContainerStyle={{
            flexDirection: 'column',
            alignItems: 'stretch',
            paddingHorizontal: 24,
            width: '100%',
            maxWidth: 420,
            alignSelf: 'center',
          }}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
