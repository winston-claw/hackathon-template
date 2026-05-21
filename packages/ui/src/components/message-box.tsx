import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";

type MessageBoxProps = {
  variant: "error" | "info";
  children: string;
};

export function MessageBox({ variant, children }: MessageBoxProps) {
  return (
    <View
      style={[
        styles.box,
        variant === "error" ? styles.error : styles.info,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === "error" ? styles.errorText : styles.infoText,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 14,
    borderRadius: radius.sm,
    borderWidth: 1,
    marginBottom: 14,
  },
  error: {
    backgroundColor: colors.errorBackground,
    borderColor: colors.errorBorderLight,
  },
  info: {
    backgroundColor: colors.infoBackground,
    borderColor: colors.border,
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
  },
  errorText: {
    color: colors.error,
  },
  infoText: {
    color: colors.infoText,
  },
});
