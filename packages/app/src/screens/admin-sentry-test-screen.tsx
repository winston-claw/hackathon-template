"use client";

import { useState } from "react";
import { ScrollView } from "@app-template/ui";
import { useRouter } from "solito/navigation";
import {
  Box,
  Button,
  ButtonText,
  Heading,
  Text,
} from "@app-template/ui";
import { AdminGuard } from "../components/admin-guard";
import { Screen } from "../components/screen";
import {
  captureAdminSentryTestException,
  captureAdminSentryTestMessage,
  isAdminSentryConfigured,
} from "../observability/capture-admin-sentry-test";

export function AdminSentryTestScreen() {
  return (
    <AdminGuard>
      <AdminSentryTestContent />
    </AdminGuard>
  );
}

function AdminSentryTestContent() {
  const router = useRouter();
  const [result, setResult] = useState("");
  const configured = isAdminSentryConfigured();

  return (
    <Screen className="flex-1 flex-col bg-background-50">
      <Box className="bg-background-0 border-b border-outline-200 px-6 py-4 flex-row justify-between items-center">
        <Heading size="md">Test Sentry</Heading>
        <Button action="primary" variant="outline" size="sm" onPress={() => router.back()}>
          <ButtonText>Back</ButtonText>
        </Button>
      </Box>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
        <Text className="text-typography-500">
          {configured
            ? "Sentry DSN is configured for this build."
            : "Sentry DSN is not configured — events will not be sent."}
        </Text>
        <Button
          action="primary"
          variant="outline"
          onPress={() => {
            captureAdminSentryTestMessage();
            setResult("Sent test message to Sentry.");
          }}
        >
          <ButtonText>Send test message</ButtonText>
        </Button>
        <Button
          action="primary"
          onPress={() => {
            captureAdminSentryTestException();
            setResult("Sent test exception to Sentry.");
          }}
        >
          <ButtonText>Send test exception</ButtonText>
        </Button>
        {result ? <Text>{result}</Text> : null}
      </ScrollView>
    </Screen>
  );
}
