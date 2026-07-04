"use client";

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
import { ADMIN_TOOLS } from "../components/admin/admin-tools";

export function AdminScreen() {
  return (
    <AdminGuard>
      <AdminContent />
    </AdminGuard>
  );
}

function AdminContent() {
  const router = useRouter();

  return (
    <Screen className="flex-1 flex-col bg-background-50">
      <Box className="bg-background-0 border-b border-outline-200 px-6 py-4">
        <Heading size="lg">Admin tools</Heading>
        <Text className="text-typography-500 mt-1">
          Internal tools for testing integrations.
        </Text>
      </Box>

      <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
        {ADMIN_TOOLS.map((tool) => (
          <Box
            key={tool.key}
            className="bg-background-0 border border-outline-200 rounded-2xl p-4 gap-2"
          >
            <Text className="text-base font-semibold text-typography-900">
              {tool.label}
            </Text>
            <Text className="text-typography-500">{tool.description}</Text>
            <Button
              action="primary"
              variant="outline"
              size="sm"
              className="self-start mt-2"
              onPress={() => router.push(tool.href)}
            >
              <ButtonText>Open</ButtonText>
            </Button>
          </Box>
        ))}
      </ScrollView>
    </Screen>
  );
}
