import { TextInput, StyleSheet, type TextInputProps } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";

type InputProps = TextInputProps & {
  error?: boolean;
};

export function Input({ error, style, placeholderTextColor, ...props }: InputProps) {
  return (
    <TextInput
      style={[styles.input, error && styles.inputError, style]}
      placeholderTextColor={placeholderTextColor ?? colors.placeholder}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    color: colors.foreground,
    fontSize: 16,
  },
  inputError: {
    borderColor: colors.errorBorder,
  },
});
