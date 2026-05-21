import { Text, StyleSheet, type TextProps } from "react-native";
import { colors } from "../theme/colors";

type LabelProps = TextProps & {
  children: string;
};

export function Label({ children, style, ...props }: LabelProps) {
  return (
    <Text style={[styles.label, style]} {...props}>
      {children}
    </Text>
  );
}

export function HelperText({
  children,
  error,
  style,
  ...props
}: LabelProps & { error?: boolean }) {
  return (
    <Text
      style={[styles.helper, error && styles.helperError, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.foreground,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 14,
  },
  helper: {
    color: colors.mutedLight,
    fontSize: 12,
    marginTop: 6,
  },
  helperError: {
    color: colors.error,
  },
});
