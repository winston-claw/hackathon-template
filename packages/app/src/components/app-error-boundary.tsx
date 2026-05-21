'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Button, ButtonText, Text } from '@app-template/ui';
import { getUserFacingErrorMessage } from '../auth/errors';

type Props = {
  children: ReactNode;
};

type State = {
  error: Error | null;
};

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('AppErrorBoundary caught an error:', error, info);
  }

  handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <Box className="flex-1 flex-col items-center justify-center bg-background-50 p-6">
          <Text className="text-xl font-bold text-typography-900 mb-2">
            Something went wrong
          </Text>
          <Text className="text-typography-500 mb-6 text-center">
            {getUserFacingErrorMessage(this.state.error)}
          </Text>
          <Button action="primary" size="md" onPress={this.handleRetry}>
            <ButtonText>Try again</ButtonText>
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
