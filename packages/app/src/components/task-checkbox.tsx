'use client';

import { CheckIcon, Pressable } from '@app-template/ui';

type TaskCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  accessibilityLabel?: string;
};

export function TaskCheckbox({
  checked,
  onChange,
  accessibilityLabel,
}: TaskCheckboxProps) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
      className={`h-6 w-6 items-center justify-center rounded border ${
        checked
          ? 'border-primary-500 bg-primary-500'
          : 'border-outline-300 bg-background-0'
      }`}
    >
      {checked ? (
        <CheckIcon height={14} width={14} color="#ffffff" />
      ) : null}
    </Pressable>
  );
}
