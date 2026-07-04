"use client";

import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "solito/navigation";
import { Link, TextLink } from "solito/link";
import {
  Heading,
  Text,
} from "@app-template/ui";
import { AuthScreen } from "../components/auth-screen";
import { LoadingView } from "../components/loading-spinner";
import {
  ClerkSignIn,
  type ClerkSignInStep,
} from "../components/clerk-sign-in";
import { useRedirectIfSignedIn } from "../auth/clerk/use-redirect-if-signed-in";

export function LoginScreen() {
  const router = useRouter();
  const { waiting } = useRedirectIfSignedIn();
  const [signInStep, setSignInStep] = useState<ClerkSignInStep>("credentials");

  if (waiting || signInStep === "completing") {
    return (
      <AuthScreen>
        <LoadingView containerClassName="flex-1 py-20" />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen>
      <View className="mb-6">
        <Heading size="2xl" className="mb-2">
          Welcome back
        </Heading>
        <Text className="text-typography-500">Sign in to your account</Text>
      </View>

      <ClerkSignIn onStepChange={setSignInStep} />

      <View className="mt-6 flex-row justify-center gap-1">
        <Text className="text-typography-500">No account?</Text>
        <TextLink href="/signup">
          <Text className="text-primary-600 font-semibold">Sign up</Text>
        </TextLink>
      </View>

      <View className="mt-4">
        <TextLink href="/">
          <Text className="text-typography-500 text-center">Back to home</Text>
        </TextLink>
      </View>
    </AuthScreen>
  );
}
