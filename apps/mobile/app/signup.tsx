import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Platform } from "react-native";
import { Link, useRouter } from "expo-router";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import * as AppleAuthentication from "expo-apple-authentication";
import { useAuth } from "../lib/auth";

export default function SignupScreen() {
  const router = useRouter();
  const { signup, loginWithGoogle, loginWithApple } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      await signup(name, email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    if (!clientId) {
      setError("Google sign-in not configured (EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID)");
      return;
    }
    const redirectUri = Linking.createURL("/auth/callback");
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "id_token",
      scope: "openid email profile",
      nonce: "mobile-nonce",
    });
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
    if (result.type === "success" && result.url) {
      const fragment = result.url.split("#")[1] || "";
      const idToken = new URLSearchParams(fragment).get("id_token");
      if (idToken && loginWithGoogle) {
        setError("");
        try {
          await loginWithGoogle(idToken);
          router.replace("/dashboard");
        } catch (e) {
          setError(e instanceof Error ? e.message : "Google sign-up failed");
        }
      }
    }
  };

  const handleAppleSignIn = async () => {
    if (!loginWithApple) return;
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const { identityToken, email: appleEmail, fullName } = credential;
      if (!identityToken) {
        setError("Apple sign-in did not return a token");
        return;
      }
      const displayName = fullName?.givenName && fullName?.familyName
        ? `${fullName.givenName} ${fullName.familyName}`.trim()
        : undefined;
      await loginWithApple({ identityToken, email: appleEmail ?? undefined, name: displayName });
      router.replace("/dashboard");
    } catch (e: unknown) {
      if ((e as { code?: string }).code === "ERR_REQUEST_CANCELED") return;
      setError(e instanceof Error ? e.message : "Apple sign-up failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password (min 6 characters)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating account..." : "Create Account"}
        </Text>
      </Pressable>

      <Pressable style={styles.oauthButton} onPress={handleGoogleSignIn}>
        <Text style={styles.oauthButtonText}>Sign up with Google</Text>
      </Pressable>
      {Platform.OS === "ios" && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={8}
          style={styles.appleButton}
          onPress={handleAppleSignIn}
        />
      )}

      <Text style={styles.footer}>
        Already have an account?{" "}
        <Link href="/login" style={styles.link}>
          Sign in
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  errorBox: {
    padding: 12,
    backgroundColor: "#fee2e2",
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    marginTop: 24,
    textAlign: "center",
    color: "#64748b",
    fontSize: 14,
  },
  link: {
    color: "#2563eb",
  },
  oauthButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  oauthButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  appleButton: {
    marginTop: 12,
    height: 44,
    width: "100%",
  },
});
