"use client";

import { useState } from "react";
import { View } from "react-native";
import { TextLink } from "solito/link";
import {
  Heading,
  Text,
} from "@app-template/ui";
import { AuthScreen } from "../components/auth-screen";
import { LoadingView } from "../components/loading-spinner";
import { ClerkSignUp } from "../components/clerk-sign-up";
import { useRedirectIfSignedIn } from "../auth/clerk/use-redirect-if-signed-in";

export function SignupScreen() {
  const { waiting } = useRedirectIfSignedIn();
  const [finalizing, setFinalizing] = useState(false);

  if (waiting || finalizing) {
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
          Create account
        </Heading>
        <Text className="text-typography-500">Get started in a few steps</Text>
      </View>

      <ClerkSignUp
        onFinalizingChange={setFinalizing}
        header={null}
      />

      <View className="mt-6 flex-row justify-center gap-1">
        <Text className="text-typography-500">Already have an account?</Text>
        <TextLink href="/login">
          <Text className="text-primary-600 font-semibold">Sign in</Text>
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
