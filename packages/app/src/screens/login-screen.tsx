"use client";

import { useState } from "react";
import { View, Platform } from "react-native";
import { Link, TextLink } from "solito/link";
import { useRouter } from "solito/navigation";
import {
  Alert,
  AlertText,
  Box,
  Button,
  ButtonText,
  Divider,
  FormControl,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  Input,
  InputField,
  Pressable,
  Text,
} from "@app-template/ui";
import { AuthScreen } from "../components/auth-screen";
import { authSubmitButtonClassName, footerLinkStyle } from "../auth/auth-styles";
import { useAuth, useOAuthActions, getUserFacingErrorMessage } from "../auth";
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
  const { runGoogle, runApple } = useOAuthActions({
    setError,
    setOauthNotice,
    setLoading,
  });

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
      setError(getUserFacingErrorMessage(err, "Login failed. Check your email and password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen>
      <Pressable
        onPress={() => router.back()}
        className="mb-5 h-10 w-10 items-center justify-center self-start rounded-full bg-[#e8e6e1]"
      >
        <Text className="text-lg text-typography-900">←</Text>
      </Pressable>

      <Heading
        size="3xl"
        className="mb-2 text-[32px] font-bold leading-9 tracking-tight text-typography-900"
      >
        Welcome{"\n"}back
      </Heading>
      <Text className="mb-8 text-[15px] leading-[22px] text-typography-500">
        Sign in to continue where you left off.
      </Text>

      {error ? (
        <Alert action="error" variant="outline" className="mb-4">
          <AlertText>{error}</AlertText>
        </Alert>
      ) : null}
      {oauthNotice ? (
        <Alert action="info" variant="outline" className="mb-4">
          <AlertText>{oauthNotice}</AlertText>
        </Alert>
      ) : null}

      <FormControl
        isInvalid={touched.email && !emailIsValid}
        className="mb-0"
      >
        <FormControlLabel className="mb-2">
          <FormControlLabelText className="text-[13px] font-bold text-typography-900">
            Email
          </FormControlLabelText>
        </FormControlLabel>
        <Input
          variant="outline"
          size="md"
          isInvalid={touched.email && !emailIsValid}
          className="h-12 rounded-xl border-outline-200 bg-white"
        >
          <InputField
            placeholder="you@example.com"
            value={email}
            onChangeText={(value) => setEmail(value.trimStart())}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            placeholderTextColor="#888888"
            className="px-4 text-base text-typography-900"
          />
        </Input>
        {touched.email && !emailIsValid ? (
          <FormControlHelper className="mt-1.5">
            <FormControlHelperText className="text-xs text-error-500">
              Use a valid email format.
            </FormControlHelperText>
          </FormControlHelper>
        ) : null}
      </FormControl>

      <FormControl
        isInvalid={touched.password && !passwordIsValid}
        className="mt-6"
      >
        <FormControlLabel className="mb-2">
          <FormControlLabelText className="text-[13px] font-bold text-typography-900">
            Password
          </FormControlLabelText>
        </FormControlLabel>
        <Input
          variant="outline"
          size="md"
          isInvalid={touched.password && !passwordIsValid}
          className="h-12 rounded-xl border-outline-200 bg-white"
        >
          <InputField
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            placeholderTextColor="#888888"
            className="px-4 text-base text-typography-900"
          />
        </Input>
        <FormControlHelper className="mt-1.5">
          <FormControlHelperText className="text-xs text-typography-500">
            Minimum 6 characters.
          </FormControlHelperText>
        </FormControlHelper>
      </FormControl>

      <Button
        action="primary"
        size="lg"
        isDisabled={!canSubmit}
        onPress={handleSubmit}
        className={authSubmitButtonClassName}
      >
        <ButtonText className="font-semibold text-white">
          {loading ? "Signing in..." : "Sign In"}
        </ButtonText>
      </Button>

      <Box className="mb-3.5 mt-7 flex-row items-center gap-3">
        <Divider className="flex-1 bg-outline-200" />
        <Text className="text-[13px] text-typography-500">or continue with</Text>
        <Divider className="flex-1 bg-outline-200" />
      </Box>

      {Platform.OS === "web" ? (
        <>
          <Link href="/auth/google">
            <View>
              <Button
                action="primary"
                variant="outline"
                size="lg"
                className="mt-2.5 h-12 w-full rounded-full border-outline-200 bg-white"
              >
                <ButtonText className="font-semibold text-typography-900">
                  Sign in with Google
                </ButtonText>
              </Button>
            </View>
          </Link>
          <Link href="/auth/apple">
            <View>
              <Button
                action="primary"
                size="lg"
                className="mt-2.5 h-12 w-full rounded-full border-typography-900 bg-typography-900"
              >
                <ButtonText className="font-semibold text-white">
                  Sign in with Apple
                </ButtonText>
              </Button>
            </View>
          </Link>
        </>
      ) : (
        <>
          <Button
            action="primary"
            variant="outline"
            size="lg"
            isDisabled={loading}
            onPress={() => void runGoogle()}
            className="mt-2.5 h-12 w-full rounded-full border-outline-200 bg-white"
          >
            <ButtonText className="font-semibold text-typography-900">
              Sign in with Google
            </ButtonText>
          </Button>
          {Platform.OS === "ios" ? (
            <Button
              action="primary"
              size="lg"
              isDisabled={loading}
              onPress={() => void runApple()}
              className="mt-2.5 h-12 w-full rounded-full border-typography-900 bg-typography-900"
            >
              <ButtonText className="font-semibold text-white">
                Sign in with Apple
              </ButtonText>
            </Button>
          ) : null}
        </>
      )}

      <Text className="mt-7 text-center text-[13px] leading-[18px] text-typography-500">
        Don&apos;t have an account?{" "}
        <TextLink href="/signup" style={footerLinkStyle}>
          Sign up
        </TextLink>
      </Text>
    </AuthScreen>
  );
}
