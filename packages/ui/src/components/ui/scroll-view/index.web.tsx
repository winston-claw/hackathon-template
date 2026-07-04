'use client';

import React from 'react';
import { flattenWebStyle } from '../../../utils/flatten-web-style';

type ScrollViewProps = Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'contentContainerStyle'
> & {
  className?: string;
  contentContainerStyle?: React.CSSProperties;
  horizontal?: boolean;
  pagingEnabled?: boolean;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  keyboardDismissMode?: 'none' | 'on-drag' | 'interactive';
  refreshControl?: React.ReactNode;
  onMomentumScrollEnd?: (event: unknown) => void;
  onScroll?: (event: unknown) => void;
  scrollEventThrottle?: number;
  scrollEnabled?: boolean;
  stickyHeaderIndices?: number[];
  centerContent?: boolean;
};

const ScrollView = React.forwardRef<HTMLDivElement, ScrollViewProps>(
  function ScrollView(props, ref) {
    const {
      className,
      contentContainerStyle,
      children,
      horizontal: _horizontal,
      pagingEnabled: _pagingEnabled,
      keyboardShouldPersistTaps: _keyboardShouldPersistTaps,
      showsVerticalScrollIndicator: _showsVerticalScrollIndicator,
      showsHorizontalScrollIndicator: _showsHorizontalScrollIndicator,
      keyboardDismissMode: _keyboardDismissMode,
      refreshControl: _refreshControl,
      onMomentumScrollEnd: _onMomentumScrollEnd,
      onScroll: _onScroll,
      scrollEventThrottle: _scrollEventThrottle,
      scrollEnabled: _scrollEnabled,
      stickyHeaderIndices: _stickyHeaderIndices,
      centerContent: _centerContent,
      style,
      ...domProps
    } = props;

    return (
      <div
        ref={ref}
        className={className}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          width: '100%',
          overflowY: _horizontal ? 'hidden' : 'auto',
          overflowX: _horizontal ? 'auto' : 'hidden',
          flex: 1,
          minHeight: 0,
          boxSizing: 'border-box',
          ...flattenWebStyle(style),
        }}
        {...domProps}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            width: '100%',
            ...flattenWebStyle(contentContainerStyle),
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);

ScrollView.displayName = 'ScrollView';

export { ScrollView };
