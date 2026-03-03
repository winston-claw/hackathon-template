import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../lib/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupScreen() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [oauthNotice, setOauthNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });

  const nameIsValid = name.trim().length >= 2;
  const emailIsValid = EMAIL_REGEX.test(email.trim());
  const passwordIsValid = password.length >= 6;
  const canSubmit = nameIsValid && emailIsValid && passwordIsValid && !loading;

  const handleSubmit = async () => {
    setError("");
    setOauthNotice("");
    setTouched({
      name: true,
      email: true,
      password: true,
    });

    if (!nameIsValid) {
      setError("Enter your full name (at least 2 characters).");
      return;
    }
    if (!emailIsValid) {
      setError("Enter a valid email address.");
      return;
    }
    if (!passwordIsValid) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await signup(name.trim(), email.trim(), password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOauthPress = (provider: "Google" | "Apple") => {
    setError("");
    setOauthNotice(
      `${provider} sign-up is coming soon. Continue with email for now.`
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>

        <Text style={styles.title}>Create{"\n"}account</Text>
        <Text style={styles.subtitle}>
          Sign up to get started with your journey.
        </Text>

        {error ? (
          <View style={styles.messageBoxError}>
            <Text style={styles.messageTextError}>{error}</Text>
          </View>
        ) : null}

        {oauthNotice ? (
          <View style={styles.messageBoxInfo}>
            <Text style={styles.messageTextInfo}>{oauthNotice}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={[
            styles.input,
            touched.name && !nameIsValid && styles.inputError,
          ]}
          placeholder="Alex Johnson"
          placeholderTextColor="#b5b5b0"
          value={name}
          onChangeText={setName}
          onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
          autoComplete="name"
          textContentType="name"
        />
        {touched.name && !nameIsValid ? (
          <Text style={styles.helperError}>
            Name should be at least 2 characters.
          </Text>
        ) : null}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[
            styles.input,
            touched.email && !emailIsValid && styles.inputError,
          ]}
          placeholder="you@example.com"
          placeholderTextColor="#b5b5b0"
          value={email}
          onChangeText={(value) => setEmail(value.trimStart())}
          onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
        />
        {touched.email && !emailIsValid ? (
          <Text style={styles.helperError}>Use a valid email format.</Text>
        ) : null}

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[
            styles.input,
            touched.password && !passwordIsValid && styles.inputError,
          ]}
          placeholder="••••••••"
          placeholderTextColor="#b5b5b0"
          value={password}
          onChangeText={setPassword}
          onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
          secureTextEntry
          autoComplete="password-new"
          textContentType="newPassword"
        />
        <Text style={styles.helper}>Minimum 6 characters.</Text>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            !canSubmit && styles.primaryButtonDisabled,
            pressed && canSubmit && styles.buttonPressed,
          ]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? "Creating account..." : "Create Account"}
          </Text>
        </Pressable>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.oauthButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => handleOauthPress("Google")}
        >
          <Text style={styles.oauthButtonText}>Sign up with Google</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.oauthButton,
            styles.oauthButtonDark,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => handleOauthPress("Apple")}
        >
          <Text style={styles.oauthButtonDarkText}>Sign up with Apple</Text>
        </Pressable>

        <Text style={styles.footer}>
          Already have an account?{" "}
          <Link href="/login" style={styles.link}>
            Sign in
          </Link>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f0",
  },
  content: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 28,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eae8e3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  backArrow: {
    fontSize: 20,
    color: "#1a1a1a",
    marginTop: -2,
  },
  title: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#888",
    marginBottom: 28,
  },
  messageBoxError: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    marginBottom: 14,
  },
  messageTextError: {
    fontSize: 14,
    color: "#b91c1c",
  },
  messageBoxInfo: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#f0f0eb",
    borderWidth: 1,
    borderColor: "#ddd8d0",
    marginBottom: 16,
  },
  messageTextInfo: {
    fontSize: 14,
    color: "#555",
  },
  label: {
    color: "#1a1a1a",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd8d0",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    color: "#1a1a1a",
    fontSize: 16,
  },
  inputError: {
    borderColor: "#e57373",
  },
  helper: {
    color: "#999",
    fontSize: 12,
    marginTop: 6,
  },
  helperError: {
    color: "#b91c1c",
    fontSize: 12,
    marginTop: 6,
  },
  primaryButton: {
    backgroundColor: "#2d2d2d",
    borderRadius: 30,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 24,
  },
  primaryButtonDisabled: {
    backgroundColor: "#b5b5b0",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerRow: {
    marginTop: 22,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd8d0",
  },
  dividerText: {
    color: "#999",
    fontSize: 12,
    fontWeight: "500",
  },
  oauthButton: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ddd8d0",
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 10,
  },
  oauthButtonDark: {
    backgroundColor: "#1a1a1a",
    borderColor: "#1a1a1a",
  },
  oauthButtonText: {
    color: "#1a1a1a",
    fontSize: 16,
    fontWeight: "600",
  },
  oauthButtonDarkText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  footer: {
    marginTop: 28,
    color: "#888",
    fontSize: 14,
    textAlign: "center",
  },
  link: {
    color: "#1a1a1a",
    fontWeight: "700",
  },
});
