import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { useAuth } from "../../lib/auth";
import { getUserFacingErrorMessage } from "@app-template/app";

export default function AuthCallbackScreen() {
  const router = useRouter();
  const { loginWithGoogle, loginWithApple } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleUrl = async (url: string | null) => {
      if (!url) return;
      const parsed = Linking.parse(url);
      const fragment = (url.split("#")[1] || "").replace(/^#/, "");
      const params = new URLSearchParams(
        fragment || parsed.queryParams?.toString() || ""
      );
      const idToken =
        params.get("id_token") || (parsed.queryParams?.id_token as string);

      if (idToken && loginWithGoogle) {
        try {
          await loginWithGoogle(idToken);
          router.replace("/dashboard");
        } catch (e) {
          setError(getUserFacingErrorMessage(e, "Sign-in failed."));
        }
        return;
      }

      if (!idToken) {
        setError("No token received from provider.");
      }
    };

    void Linking.getInitialURL().then(handleUrl);
    const sub = Linking.addEventListener("url", (e) => void handleUrl(e.url));
    return () => sub.remove();
  }, [router, loginWithGoogle, loginWithApple]);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background-50 p-6">
        <Text className="mb-3 text-center text-error-600">{error}</Text>
        <Text
          className="font-semibold text-typography-900"
          onPress={() => router.replace("/login")}
        >
          Back to login
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-background-50 p-6">
      <ActivityIndicator size="large" />
      <Text className="mt-4 text-base text-typography-500">
        Completing sign-in…
      </Text>
    </View>
  );
}
