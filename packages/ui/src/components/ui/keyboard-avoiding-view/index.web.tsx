'use client';

import React from 'react';
import { flattenWebStyle } from '../../../utils/flatten-web-style';

type KeyboardAvoidingViewProps = React.ComponentPropsWithoutRef<'div'> & {
  behavior?: 'height' | 'position' | 'padding';
  keyboardVerticalOffset?: number;
  contentContainerStyle?: React.CSSProperties;
};

const KeyboardAvoidingView = React.forwardRef<
  HTMLDivElement,
  KeyboardAvoidingViewProps
>(function KeyboardAvoidingView(
  {
    children,
    behavior: _behavior,
    keyboardVerticalOffset: _keyboardVerticalOffset,
    contentContainerStyle: _contentContainerStyle,
    style,
    ...props
  },
  ref
) {
  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        ...flattenWebStyle(style),
      }}
      {...props}
    >
      {children}
    </div>
  );
});

KeyboardAvoidingView.displayName = 'KeyboardAvoidingView';

export { KeyboardAvoidingView };
