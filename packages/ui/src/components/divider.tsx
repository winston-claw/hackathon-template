import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

type DividerProps = {
  label?: string;
};

export function Divider({ label }: DividerProps) {
  if (!label) {
    return <View style={styles.line} />;
  }

  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: 22,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  label: {
    color: colors.mutedLight,
    fontSize: 12,
    fontWeight: "500",
  },
});
