'use client';

import React from 'react';

type ScrollViewProps = React.ComponentPropsWithoutRef<'div'> & {
  className?: string;
  contentContainerStyle?: React.CSSProperties;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  showsVerticalScrollIndicator?: boolean;
};

const ScrollView = React.forwardRef<HTMLDivElement, ScrollViewProps>(
  function ScrollView(
    { className, contentContainerStyle, children, ...props },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={className}
        style={{ overflowY: 'auto', flex: 1, minHeight: 0, ...contentContainerStyle }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScrollView.displayName = 'ScrollView';

export { ScrollView };
