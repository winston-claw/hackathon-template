"use client";

import { Pressable, View } from "react-native";
import {
  BrutalActionLabel,
  BrutalBody,
  BrutalButton,
  BrutalDisplay,
  BrutalInput,
  BrutalMono,
  BrutalSectionLabel,
} from "./auth-ui";
import { AuthBanner } from "./auth-banner";

type EmailVerificationFlow = "sign-in" | "sign-up" | "forgot-password";

type EmailVerificationStepProps = {
  flow?: EmailVerificationFlow;
  email: string;
  code: string;
  onCodeChange: (code: string) => void;
  onVerify: () => void;
  onResend: () => void;
  onChangeEmail: () => void;
  loading: boolean;
  resending: boolean;
  error: string;
  info: string;
  resendCooldownSeconds: number;
};

const COPY: Record<
  EmailVerificationFlow,
  {
    sectionLabel: string;
    title: string;
    bodyPrefix: string;
    bodySuffix: string;
    verifyLabel: string;
    verifyingLabel: string;
    changeEmailLabel: string;
  }
> = {
  "sign-in": {
    sectionLabel: "ALMOST THERE",
    title: "CHECK YOUR\nEMAIL",
    bodyPrefix: "Enter the 6-digit code we sent to",
    bodySuffix: "to confirm this device.",
    verifyLabel: "Continue",
    verifyingLabel: "Verifying...",
    changeEmailLabel: "BACK TO SIGN IN",
  },
  "sign-up": {
    sectionLabel: "ONE MORE STEP",
    title: "VERIFY YOUR\nEMAIL",
    bodyPrefix: "Enter the 6-digit code we sent to",
    bodySuffix: "to finish creating your account.",
    verifyLabel: "Verify email",
    verifyingLabel: "Verifying...",
    changeEmailLabel: "USE A DIFFERENT EMAIL",
  },
  "forgot-password": {
    sectionLabel: "CHECK YOUR EMAIL",
    title: "ENTER RESET\nCODE",
    bodyPrefix: "Enter the 6-digit code we sent to",
    bodySuffix: "to reset your password.",
    verifyLabel: "Verify code",
    verifyingLabel: "Verifying...",
    changeEmailLabel: "USE A DIFFERENT EMAIL",
  },
};

export function EmailVerificationStep({
  flow = "sign-up",
  email,
  code,
  onCodeChange,
  onVerify,
  onResend,
  onChangeEmail,
  loading,
  resending,
  error,
  info,
  resendCooldownSeconds,
}: EmailVerificationStepProps) {
  const copy = COPY[flow];
  const codeIsValid = /^\d{6}$/.test(code);
  const canVerify = codeIsValid && !loading;
  const canResend = resendCooldownSeconds === 0 && !resending && !loading;

  return (
    <View className="flex-col gap-5">
      <View>
        <BrutalSectionLabel>{copy.sectionLabel}</BrutalSectionLabel>
        <BrutalDisplay className="mt-3" size={36}>
          {copy.title}
        </BrutalDisplay>
        <BrutalBody className="mt-3 text-brutal-fg-dim" size={14}>
          {copy.bodyPrefix}{" "}
          <BrutalBody size={14} weight="700">
            {email}
          </BrutalBody>{" "}
          {copy.bodySuffix}
        </BrutalBody>
      </View>

      {info ? <AuthBanner tone="info" message={info} /> : null}
      {error ? <AuthBanner tone="error" message={error} /> : null}

      <BrutalInput
        label="VERIFICATION CODE"
        placeholder="000000"
        value={code}
        onChangeText={(value) =>
          onCodeChange(value.replace(/\D/g, "").slice(0, 6))
        }
        keyboardType="number-pad"
        maxLength={6}
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        inputStyle={{
          textAlign: "center",
          fontSize: 18,
          letterSpacing: 6,
        }}
      />

      <BrutalButton
        label={loading ? copy.verifyingLabel : copy.verifyLabel}
        onPress={onVerify}
        disabled={!canVerify}
        loading={loading}
      />

      <Pressable
        onPress={onResend}
        disabled={!canResend}
        accessibilityRole="button"
        accessibilityLabel="Resend code"
        accessibilityState={{ disabled: !canResend }}
        className="mt-2 self-center"
      >
        {resending ? (
          <BrutalMono className="text-brutal-fg-mute" tracking="wide">
            SENDING...
          </BrutalMono>
        ) : resendCooldownSeconds > 0 ? (
          <BrutalMono className="text-brutal-fg-mute" tracking="wide">
            {`RESEND CODE IN ${resendCooldownSeconds}S`}
          </BrutalMono>
        ) : (
          <BrutalActionLabel
            label="RESEND CODE"
            className={canResend ? "text-brutal-accent-text" : "text-brutal-fg-mute"}
            tracking="wide"
          />
        )}
      </Pressable>

      <Pressable
        onPress={onChangeEmail}
        accessibilityRole="button"
        accessibilityLabel="Use a different email"
        className="self-center"
      >
        <BrutalMono className="text-brutal-fg-dim" tracking="wide">
          {copy.changeEmailLabel}
        </BrutalMono>
      </Pressable>
    </View>
  );
}
