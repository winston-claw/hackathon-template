import { Pressable, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";

type BackButtonProps = {
  onPress: () => void;
};

export function BackButton({ onPress }: BackButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.arrow}>←</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.backgroundAccent,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  arrow: {
    fontSize: 20,
    color: colors.foreground,
    marginTop: -2,
  },
});
