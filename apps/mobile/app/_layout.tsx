import { Stack, useRouter } from "expo-router";
import { ConvexProvider } from "convex/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { convex } from "../lib/convex";
import { AuthProvider } from "../lib/auth";

function AuthLayout() {
  const router = useRouter();
  return (
    <AuthProvider
      onLogin={() => router.replace("/dashboard")}
      onLogout={() => router.replace("/")}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="dashboard" />
      </Stack>
    </AuthProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ConvexProvider client={convex}>
        <AuthLayout />
      </ConvexProvider>
    </SafeAreaProvider>
  );
}
