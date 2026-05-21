import { Text, StyleSheet, type TextProps } from "react-native";
import { colors } from "../theme/colors";

type HeadingProps = TextProps;

export function Heading({ children, style, ...props }: HeadingProps) {
  return (
    <Text style={[styles.title, style]} {...props}>
      {children}
    </Text>
  );
}

export function Subheading({ children, style, ...props }: HeadingProps) {
  return (
    <Text style={[styles.subtitle, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "700",
    color: colors.foreground,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    marginBottom: 28,
  },
});
