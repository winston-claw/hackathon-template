import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "../../lib/auth";

const AUTH_TOKEN_KEY = "auth_token";

export default function AuthCallbackScreen() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleUrl = async (url: string | null) => {
      if (!url) return;
      const parsed = Linking.parse(url);
      const fragment = (url.split("#")[1] || "").replace(/^#/, "");
      const params = new URLSearchParams(fragment || parsed.queryParams?.toString() || "");
      const idToken = params.get("id_token") || (parsed.queryParams?.id_token as string);
      const token = params.get("token") || (parsed.queryParams?.token as string);
      const provider = params.get("provider") || (parsed.queryParams?.provider as string);

      if (token && provider === "apple") {
        await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
        router.replace("/dashboard");
        return;
      }

      if (idToken && loginWithGoogle) {
        try {
          await loginWithGoogle(idToken);
          router.replace("/dashboard");
        } catch (e) {
          setError(e instanceof Error ? e.message : "Sign-in failed");
        }
        return;
      }

      if (!idToken && !token) setError("No token received.");
    };

    Linking.getInitialURL().then(handleUrl);
    const sub = Linking.addEventListener("url", (e) => handleUrl(e.url));
    return () => sub.remove();
  }, [router, loginWithGoogle]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <Text style={styles.link} onPress={() => router.replace("/login")}>
          Back to login
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>Completing sign-in…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  text: { marginTop: 16, fontSize: 16, color: "#64748b" },
  error: { color: "#dc2626", marginBottom: 12, textAlign: "center" },
  link: { color: "#2563eb" },
});
