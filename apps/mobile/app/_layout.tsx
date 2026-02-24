import { Stack, useRouter } from "expo-router";
import { ConvexProvider } from "convex/react";
import { convex } from "../lib/convex";
import { AuthProvider } from "../lib/auth";

function AuthLayout() {
  const router = useRouter();
  return (
    <AuthProvider
      onLogin={() => router.replace("/dashboard")}
      onLogout={() => router.replace("/")}
    >
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="login" options={{ title: "Sign In" }} />
        <Stack.Screen name="signup" options={{ title: "Create Account" }} />
        <Stack.Screen name="dashboard" options={{ title: "Dashboard" }} />
      </Stack>
    </AuthProvider>
  );
}

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <AuthLayout />
    </ConvexProvider>
  );
}
