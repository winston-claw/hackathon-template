"use client";

import { useEffect } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "solito/router";
import { useAuth } from "../auth";
import { colors } from "@project-template/ui";

const STATS = [
  { label: "Total Users", value: "1,234", change: "+12%" },
  { label: "Revenue", value: "$12,345", change: "+8%" },
  { label: "Active Sessions", value: "567", change: "+23%" },
  { label: "Conversion", value: "3.2%", change: "+5%" },
];

export function DashboardScreen() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.brandIcon}>
            <Text style={styles.brandIconText}>Y</Text>
          </View>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.email}>{user.email}</Text>
          <Pressable style={styles.logoutButton} onPress={() => logout()}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.main}>
        <View style={styles.welcomeBlock}>
          <Text style={styles.welcomeTitle}>
            Welcome back{user.name ? `, ${user.name}` : ""}
          </Text>
          <Text style={styles.welcomeSubtitle}>
            This is your authenticated dashboard. Only logged-in users can see
            this page.
          </Text>
        </View>

        <View style={styles.statsGrid}>
          {STATS.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <View style={styles.statRow}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statChange}>{stat.change}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <Pressable style={styles.actionPrimary}>
              <Text style={styles.actionPrimaryText}>Create New Project</Text>
            </Pressable>
            <Pressable style={styles.actionSecondary}>
              <Text style={styles.actionSecondaryText}>View Analytics</Text>
            </Pressable>
            <Pressable style={styles.actionSecondary}>
              <Text style={styles.actionSecondaryText}>Invite Team Member</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    color: "#1a1a1a",
    fontSize: 16,
  },
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd8d0",
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2d2d2d",
    justifyContent: "center",
    alignItems: "center",
  },
  brandIconText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 18,
    color: "#1a1a1a",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  email: {
    fontSize: 14,
    color: "#888",
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ddd8d0",
    borderRadius: 999,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  main: {
    padding: 24,
    maxWidth: 1120,
    width: "100%",
    alignSelf: "center",
  },
  welcomeBlock: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  welcomeSubtitle: {
    color: "#888",
    fontSize: 16,
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd8d0",
    minWidth: 200,
    flexGrow: 1,
    flexBasis: "45%",
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  statChange: {
    fontSize: 14,
    color: "#2d8a6e",
    fontWeight: "600",
  },
  actionsCard: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd8d0",
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionPrimary: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#2d2d2d",
    borderRadius: 999,
  },
  actionPrimaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  actionSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd8d0",
    borderRadius: 999,
  },
  actionSecondaryText: {
    color: "#1a1a1a",
    fontWeight: "600",
    fontSize: 14,
  },
});
