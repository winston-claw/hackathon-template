"use client";

import { useState } from "react";
import { ScrollView } from "@app-template/ui";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "solito/navigation";
import {
  Box,
  Button,
  ButtonText,
  Heading,
  Input,
  InputField,
  Text,
} from "@app-template/ui";
import { AdminGuard } from "../components/admin-guard";
import { Screen } from "../components/screen";
import { api } from "../db/api";

export function AdminEmailTestScreen() {
  return (
    <AdminGuard>
      <AdminEmailTestContent />
    </AdminGuard>
  );
}

function AdminEmailTestContent() {
  const router = useRouter();
  const page = useQuery(api.adminEmails.getEmailTestPage);
  const sendTestEmail = useMutation(api.adminEmails.sendTestEmail);
  const [targetEmail, setTargetEmail] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setResult("");
    try {
      const delivery = await sendTestEmail({
        templateId: "welcome",
        targetEmail: targetEmail.trim() || undefined,
      });
      setResult(`Queued delivery ${delivery.deliveryId}`);
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Send failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen className="flex-1 flex-col bg-background-50">
      <Box className="bg-background-0 border-b border-outline-200 px-6 py-4 flex-row justify-between items-center">
        <Heading size="md">Test email</Heading>
        <Button action="primary" variant="outline" size="sm" onPress={() => router.back()}>
          <ButtonText>Back</ButtonText>
        </Button>
      </Box>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
        {!page ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <Text className="text-typography-500">
              Send the welcome template via the notification outbox.
            </Text>
            <Input variant="outline" size="md">
              <InputField
                placeholder={`Target email (default: ${page.email})`}
                value={targetEmail}
                onChangeText={setTargetEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </Input>
            <Button action="primary" isDisabled={loading} onPress={handleSend}>
              <ButtonText>{loading ? "Sending..." : "Send welcome email"}</ButtonText>
            </Button>
            {result ? <Text>{result}</Text> : null}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
