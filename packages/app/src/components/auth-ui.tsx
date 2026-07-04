'use client';

import { ReactNode } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import {
  Box,
  Button,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  Input,
  InputField,
  Text,
} from '@app-template/ui';

export const BRUTAL_COLORS = {
  error: '#EF4444',
};

type BrutalInputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  keyboardType?: 'default' | 'email-address' | 'number-pad';
  autoComplete?: string;
  textContentType?: string;
  maxLength?: number;
  error?: string | null;
  helper?: string;
  inputStyle?: Record<string, unknown>;
};

export function BrutalInput({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  secureTextEntry,
  autoCapitalize,
  autoCorrect,
  keyboardType,
  autoComplete,
  textContentType,
  maxLength,
  error,
  helper,
  inputStyle,
}: BrutalInputProps) {
  return (
    <FormControl isInvalid={Boolean(error)}>
      {label ? (
        <FormControlLabel>
          <FormControlLabelText>{label}</FormControlLabelText>
        </FormControlLabel>
      ) : null}
      <Input variant="outline" size="md">
        <InputField
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          keyboardType={keyboardType}
          autoComplete={autoComplete as never}
          textContentType={textContentType as never}
          maxLength={maxLength}
          style={inputStyle as never}
        />
      </Input>
      {helper && !error ? (
        <FormControlHelper>
          <FormControlHelperText>{helper}</FormControlHelperText>
        </FormControlHelper>
      ) : null}
      {error ? (
        <FormControlError>
          <FormControlErrorText>{error}</FormControlErrorText>
        </FormControlError>
      ) : null}
    </FormControl>
  );
}

type BrutalButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function BrutalButton({ label, onPress, disabled, loading }: BrutalButtonProps) {
  return (
    <Button
      action="primary"
      size="lg"
      isDisabled={disabled || loading}
      onPress={onPress}
      className="w-full"
    >
      <ButtonText>{loading ? 'Please wait...' : label}</ButtonText>
    </Button>
  );
}

type BrutalTextProps = {
  children: ReactNode;
  className?: string;
  size?: number;
  weight?: string;
  tracking?: string;
};

export function BrutalBody({ children, className }: BrutalTextProps) {
  return <Text className={`text-typography-600 ${className ?? ''}`}>{children}</Text>;
}

export function BrutalMono({ children, className }: BrutalTextProps) {
  return (
    <Text className={`text-xs uppercase tracking-wider text-typography-500 ${className ?? ''}`}>
      {children}
    </Text>
  );
}

export function BrutalSectionLabel({ children }: { children: ReactNode }) {
  return (
    <Text className="text-xs uppercase tracking-wider text-primary-600 font-semibold">
      {children}
    </Text>
  );
}

export function BrutalDisplay({
  children,
  className,
  size = 32,
}: {
  children: ReactNode;
  className?: string;
  size?: number;
}) {
  return (
    <Heading size="2xl" className={className} style={{ fontSize: size, lineHeight: size * 1.1 }}>
      {children}
    </Heading>
  );
}

export function BrutalActionLabel({
  label,
  className,
}: {
  label: string;
  className?: string;
  tracking?: string;
}) {
  return (
    <Text className={`text-sm font-semibold text-primary-600 ${className ?? ''}`}>{label}</Text>
  );
}

export { Box, View, Pressable, TextInput };
