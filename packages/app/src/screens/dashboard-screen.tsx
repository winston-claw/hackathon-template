"use client";

import { ScrollView } from "@app-template/ui";
import { useRouter } from "solito/navigation";
import {
  Box,
  Button,
  ButtonText,
  Text,
} from "@app-template/ui";
import { AuthGuard } from "../components/auth-guard";
import { Screen } from "../components/screen";
import { useAuth } from "../auth";

const STATS = [
  { label: "Total Users", value: "1,234", change: "+12%" },
  { label: "Revenue", value: "$12,345", change: "+8%" },
  { label: "Active Sessions", value: "567", change: "+23%" },
  { label: "Conversion", value: "3.2%", change: "+5%" },
];

export function DashboardScreen() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Screen className="flex-1 flex-col bg-background-50">
      <Box className="bg-background-0 border-b border-outline-200 px-6 py-4 flex-row flex-wrap items-center justify-between gap-3">
        <Box className="flex-row items-center gap-2">
          <Box className="w-7 h-7 rounded-full bg-primary-500 items-center justify-center">
            <Text className="text-typography-0 text-xs font-bold">Y</Text>
          </Box>
          <Text className="font-bold text-lg text-typography-900">Dashboard</Text>
        </Box>
        <Box className="flex-row items-center gap-4">
          <Text className="text-sm text-typography-500">{user.email}</Text>
          <Button action="primary" variant="outline" size="md" onPress={() => logout()}>
            <ButtonText>Sign Out</ButtonText>
          </Button>
        </Box>
      </Box>

      <ScrollView contentContainerStyle={{ padding: 24, maxWidth: 1120, width: "100%", alignSelf: "center" }}>
        <Box className="mb-8 flex-col">
          <Text className="text-2xl font-bold text-typography-900 mb-2">
            Welcome back{user.name ? `, ${user.name}` : ""}
          </Text>
          <Text className="text-base text-typography-500 leading-6">
            This is your authenticated dashboard. Only logged-in users can see
            this page.
          </Text>
        </Box>

        <Box className="flex-row flex-wrap gap-4 mb-8">
          {STATS.map((stat) => (
            <Box
              key={stat.label}
              className="flex-col bg-background-0 p-5 rounded-2xl border border-outline-200 min-w-[200px] grow basis-[45%]"
            >
              <Text className="text-sm text-typography-500 mb-2">{stat.label}</Text>
              <Box className="flex-row items-baseline gap-2">
                <Text className="text-3xl font-bold text-typography-900">{stat.value}</Text>
                <Text className="text-sm text-success-600 font-semibold">{stat.change}</Text>
              </Box>
            </Box>
          ))}
        </Box>

        <Box className="flex-col bg-background-0 p-6 rounded-2xl border border-outline-200">
          <Text className="text-lg font-semibold text-typography-900 mb-4">Quick Actions</Text>
          <Box className="flex-row flex-wrap gap-3">
            <Button action="primary" variant="outline" size="md" onPress={() => router.push("/tasks")}>
              <ButtonText>View Tasks</ButtonText>
            </Button>
            {user.isAdmin ? (
              <Button action="primary" variant="outline" size="md" onPress={() => router.push("/admin")}>
                <ButtonText>Admin</ButtonText>
              </Button>
            ) : null}
          </Box>
        </Box>
      </ScrollView>
    </Screen>
  );
}
