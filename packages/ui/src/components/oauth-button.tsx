import {
  Pressable,
  Text,
  View,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";

type OAuthButtonProps = Omit<PressableProps, "children"> & {
  children: string;
  variant?: "light" | "dark";
  style?: StyleProp<ViewStyle>;
};

export function OAuthButton({
  children,
  variant = "light",
  style,
  onPress,
  ...props
}: OAuthButtonProps) {
  const content = (
    <Text style={[styles.text, variant === "dark" && styles.darkText]}>
      {children}
    </Text>
  );

  if (!onPress) {
    return (
      <View style={[styles.base, variant === "dark" && styles.dark, style]}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        variant === "dark" && styles.dark,
        pressed && styles.pressed,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
      onPress={onPress}
      {...props}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 10,
  },
  dark: {
    backgroundColor: colors.foreground,
    borderColor: colors.foreground,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    color: colors.foreground,
    fontSize: 16,
    fontWeight: "600",
  },
  darkText: {
    color: "#ffffff",
  },
});
