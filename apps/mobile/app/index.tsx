import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Project Template</Text>
      <Text style={styles.subtitle}>Next.js + Convex + Expo</Text>
      <View style={styles.buttons}>
        <Link href="/signup" asChild>
          <Pressable style={[styles.button, styles.primary]}>
            <Text style={styles.primaryText}>Get Started</Text>
          </Pressable>
        </Link>
        <Link href="/login" asChild>
          <Pressable style={[styles.button, styles.secondary]}>
            <Text style={styles.secondaryText}>Log In</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 32,
  },
  buttons: {
    gap: 12,
    width: "100%",
    maxWidth: 280,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  primary: {
    backgroundColor: "#2563eb",
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2563eb",
  },
  secondaryText: {
    color: "#2563eb",
    fontSize: 16,
    fontWeight: "600",
  },
});
