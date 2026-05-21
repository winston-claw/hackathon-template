import "@app-template/ui/global.css";
import { Stack, useRouter } from "expo-router";
import { LogBox, View } from "react-native";
import { ConvexProvider } from "convex/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UIProvider } from "@app-template/ui";
import { AppErrorBoundary } from "@app-template/app";
import { convex } from "../lib/convex";
import { AuthProvider } from "../lib/auth";
import { MobileOAuthProvider } from "../lib/oauth";

LogBox.ignoreLogs([/\[CONVEX [MA]\(auth:/, /\[CONVEX M\(auth:/]);

function AuthLayout() {
  const router = useRouter();
  return (
    <AuthProvider
      onLogin={() => router.replace("/dashboard")}
      onLogout={() => router.replace("/")}
    >
      <MobileOAuthProvider>
        <View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { flex: 1, backgroundColor: "#f5f5f0" },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="tasks" />
            <Stack.Screen name="auth/callback" />
          </Stack>
        </View>
      </MobileOAuthProvider>
    </AuthProvider>
  );
}

export default function RootLayout() {
  return (
    <UIProvider>
      <SafeAreaProvider>
        <AppErrorBoundary>
          <ConvexProvider client={convex}>
            <AuthLayout />
          </ConvexProvider>
        </AppErrorBoundary>
      </SafeAreaProvider>
    </UIProvider>
  );
}
