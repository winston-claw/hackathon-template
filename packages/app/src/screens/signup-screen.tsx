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

export function SignupScreen() {
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
    setTouched({ name: true, email: true, password: true });

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
    <AuthScreen>
      <BackButton onPress={() => router.back()} />

      <Heading>Create{"\n"}account</Heading>
      <Subheading>Sign up to get started with your journey.</Subheading>

      {error ? <MessageBox variant="error">{error}</MessageBox> : null}
      {oauthNotice ? <MessageBox variant="info">{oauthNotice}</MessageBox> : null}

      <Label style={{ marginTop: 0 }}>Full Name</Label>
      <Input
        error={touched.name && !nameIsValid}
        placeholder="Alex Johnson"
        value={name}
        onChangeText={setName}
        onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
        autoComplete="name"
        textContentType="name"
      />
      {touched.name && !nameIsValid ? (
        <HelperText error>Name should be at least 2 characters.</HelperText>
      ) : null}

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
        autoComplete="password-new"
        textContentType="newPassword"
      />
      <HelperText>Minimum 6 characters.</HelperText>

      <Button onPress={handleSubmit} disabled={!canSubmit}>
        {loading ? "Creating account..." : "Create Account"}
      </Button>

      <Divider label="or continue with" />

      {Platform.OS === "web" ? (
        <>
          <Link href="/auth/google">
            <View>
              <OAuthButton>Sign up with Google</OAuthButton>
            </View>
          </Link>
          <Link href="/auth/apple">
            <View>
              <OAuthButton variant="dark">Sign up with Apple</OAuthButton>
            </View>
          </Link>
        </>
      ) : (
        <>
          <OAuthButton onPress={() => handleOauthPress("Google")}>
            Sign up with Google
          </OAuthButton>
          <OAuthButton variant="dark" onPress={() => handleOauthPress("Apple")}>
            Sign up with Apple
          </OAuthButton>
        </>
      )}

      <FooterText>
        Already have an account?{" "}
        <TextLink href="/login" style={footerLinkStyle}>
          Sign in
        </TextLink>
      </FooterText>
    </AuthScreen>
  );
}
