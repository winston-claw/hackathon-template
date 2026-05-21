"use client";

import { useState } from "react";
import { View, Platform } from "react-native";
import { Link, TextLink } from "solito/link";
import { useRouter } from "solito/router";
import {
  AuthScreen,
  BackButton,
  Heading,
  Subheading,
  MessageBox,
  Label,
  Input,
  HelperText,
  Button,
  Divider,
  OAuthButton,
  FooterText,
  footerLinkStyle,
} from "@project-template/ui";
import { useAuth } from "../auth";
import { EMAIL_REGEX } from "../constants";

export function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [oauthNotice, setOauthNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailIsValid = EMAIL_REGEX.test(email.trim());
  const passwordIsValid = password.length >= 6;
  const canSubmit = emailIsValid && passwordIsValid && !loading;

  const handleSubmit = async () => {
    setError("");
    setOauthNotice("");
    setTouched({ email: true, password: true });

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
      await login(email.trim(), password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOauthPress = (provider: "Google" | "Apple") => {
    setError("");
    setOauthNotice(
      `${provider} sign-in is coming soon. Continue with email for now.`
    );
  };

  return (
    <AuthScreen>
      <BackButton onPress={() => router.back()} />

      <Heading>Welcome{"\n"}back</Heading>
      <Subheading>Sign in to continue where you left off.</Subheading>

      {error ? <MessageBox variant="error">{error}</MessageBox> : null}
      {oauthNotice ? <MessageBox variant="info">{oauthNotice}</MessageBox> : null}

      <Label>Email</Label>
      <Input
        error={touched.email && !emailIsValid}
        placeholder="you@example.com"
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
        <HelperText error>Use a valid email format.</HelperText>
      ) : null}

      <Label>Password</Label>
      <Input
        error={touched.password && !passwordIsValid}
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
        secureTextEntry
        autoComplete="password"
        textContentType="password"
      />
      <HelperText>Minimum 6 characters.</HelperText>

      <Button onPress={handleSubmit} disabled={!canSubmit}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      <Divider label="or continue with" />

      {Platform.OS === "web" ? (
        <>
          <Link href="/auth/google">
            <View>
              <OAuthButton>Sign in with Google</OAuthButton>
            </View>
          </Link>
          <Link href="/auth/apple">
            <View>
              <OAuthButton variant="dark">Sign in with Apple</OAuthButton>
            </View>
          </Link>
        </>
      ) : (
        <>
          <OAuthButton onPress={() => handleOauthPress("Google")}>
            Sign in with Google
          </OAuthButton>
          <OAuthButton variant="dark" onPress={() => handleOauthPress("Apple")}>
            Sign in with Apple
          </OAuthButton>
        </>
      )}

      <FooterText>
        Don&apos;t have an account?{" "}
        <TextLink href="/signup" style={footerLinkStyle}>
          Sign up
        </TextLink>
      </FooterText>
    </AuthScreen>
  );
}
