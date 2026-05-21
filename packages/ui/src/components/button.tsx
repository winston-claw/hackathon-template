import { Pressable, Text, StyleSheet, type PressableProps } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";

type ButtonProps = PressableProps & {
  children: string;
  variant?: "primary" | "outline";
};

export function Button({
  children,
  variant = "primary",
  disabled,
  style,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        variant === "primary" ? styles.primary : styles.outline,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
      disabled={disabled}
      {...props}
    >
      <Text
        style={[
          styles.text,
          variant === "primary" ? styles.primaryText : styles.outlineText,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 24,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 10,
    paddingVertical: 15,
  },
  disabled: {
    backgroundColor: colors.primaryDisabled,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: "#fff",
  },
  outlineText: {
    color: colors.foreground,
  },
});
