import { Text, StyleSheet, type TextProps } from "react-native";
import { colors } from "../theme/colors";

type FooterTextProps = TextProps;

export function FooterText({ children, style, ...props }: FooterTextProps) {
  return (
    <Text style={[styles.footer, style]} {...props}>
      {children}
    </Text>
  );
}

export const footerLinkStyle = StyleSheet.create({
  link: {
    color: colors.foreground,
    fontWeight: "700",
  },
}).link;

const styles = StyleSheet.create({
  footer: {
    marginTop: 28,
    color: colors.muted,
    fontSize: 14,
    textAlign: "center",
  },
});
