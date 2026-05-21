"use client";

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Link, TextLink } from "solito/link";
import { ONBOARDING_SLIDES } from "../constants";
import { colors } from "@project-template/ui";

const FEATURES = [
  {
    title: "Feature one",
    desc: "Describe the first key feature of your product and the problem it solves for users.",
  },
  {
    title: "Feature two",
    desc: "Describe the second key feature and why it matters to your target audience.",
  },
  {
    title: "Feature three",
    desc: "Describe the third key feature and how it differentiates you from alternatives.",
  },
  {
    title: "Feature four",
    desc: "Describe another feature that adds value and keeps users coming back.",
  },
  {
    title: "Feature five",
    desc: "Describe a feature related to trust, security, or reliability that users care about.",
  },
  {
    title: "Feature six",
    desc: "Describe a final feature that rounds out your product offering.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    label: "Forever free",
    features: ["Core features", "Up to 3 projects", "Community support"],
    featured: false,
  },
  {
    name: "Pro",
    price: "$12",
    label: "Per user / month",
    features: [
      "Unlimited projects",
      "Advanced features",
      "Integrations",
      "Priority support",
    ],
    featured: true,
  },
  {
    name: "Teams",
    price: "$49",
    label: "Per team / month",
    features: [
      "Everything in Pro",
      "Admin dashboard",
      "Team management",
      "Dedicated support",
    ],
    featured: false,
  },
];

function BrandMark() {
  return (
    <View style={styles.brandRow}>
      <View style={styles.brandIcon}>
        <Text style={styles.brandIconText}>Y</Text>
      </View>
      <Text style={styles.brandName}>YourApp</Text>
    </View>
  );
}

export function MarketingHomeScreen() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim()) setSubscribed(true);
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <BrandMark />
          <View style={styles.nav}>
            <Text style={styles.navLink}>Features</Text>
            <Text style={styles.navLink}>Pricing</Text>
            <TextLink href="/login" style={styles.navLink}>
              Log In
            </TextLink>
            <Link href="/signup">
              <View style={styles.navCta}>
                <Text style={styles.navCtaText}>Get Started</Text>
              </View>
            </Link>
          </View>
        </View>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroGrid}>
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>Swipe to discover more</Text>
            <Text style={styles.heroTitle}>Built for what matters to you.</Text>
            <Text style={styles.heroBody}>
              Sign up to get started with your journey. Discover something new,
              track your progress, and see results from day one.
            </Text>
            <View style={styles.heroActions}>
              <Link href="/signup">
                <View style={styles.heroPrimary}>
                  <Text style={styles.heroPrimaryText}>Get Started</Text>
                </View>
              </Link>
              <View style={styles.heroSecondary}>
                <Text style={styles.heroSecondaryText}>Learn more</Text>
              </View>
            </View>
            <View style={styles.heroStats}>
              <Text style={styles.heroStat}>
                <Text style={styles.heroStatStrong}>4.9/5</Text> average rating
              </Text>
              <Text style={styles.heroStat}>
                <Text style={styles.heroStatStrong}>10K+</Text> active users
              </Text>
              <Text style={styles.heroStat}>
                <Text style={styles.heroStatStrong}>99%</Text> uptime
              </Text>
            </View>
          </View>

          <View style={styles.phoneMockup}>
            <View style={styles.mockCircle}>
              <Text style={styles.mockCircleIcon}>
                {ONBOARDING_SLIDES[activeSlide].icon}
              </Text>
              <View style={styles.mockBadge}>
                <Text>{ONBOARDING_SLIDES[activeSlide].badge}</Text>
              </View>
            </View>
            <Text style={styles.mockTitle}>
              {ONBOARDING_SLIDES[activeSlide].title}
            </Text>
            <View style={styles.mockDots}>
              {ONBOARDING_SLIDES.map((_, i) => (
                <Pressable key={i} onPress={() => setActiveSlide(i)}>
                  <View
                    style={[
                      styles.mockDot,
                      i === activeSlide && styles.mockDotActive,
                    ]}
                  />
                </Pressable>
              ))}
            </View>
            <Link href="/signup">
              <View style={styles.mockCta}>
                <Text style={styles.mockCtaText}>Get Started</Text>
              </View>
            </Link>
            <Text style={styles.mockFooter}>
              Already have an account?{" "}
              <TextLink href="/login" style={styles.mockFooterLink}>
                Log In
              </TextLink>
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.eyebrow}>Why YourApp</Text>
        <Text style={styles.sectionTitle}>Everything you need in one place.</Text>
        <View style={styles.featureGrid}>
          {FEATURES.map((feature) => (
            <View key={feature.title} style={styles.featureCard}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.pricingSection}>
        <View style={styles.section}>
          <Text style={styles.eyebrow}>Pricing</Text>
          <Text style={styles.sectionTitle}>Simple, transparent pricing.</Text>
          <View style={styles.pricingGrid}>
            {PLANS.map((plan) => (
              <View
                key={plan.name}
                style={[
                  styles.planCard,
                  plan.featured && styles.planCardFeatured,
                ]}
              >
                {plan.featured ? (
                  <Text style={styles.planBadge}>Most popular</Text>
                ) : null}
                <Text
                  style={[
                    styles.planName,
                    plan.featured && styles.planTextFeatured,
                  ]}
                >
                  {plan.name}
                </Text>
                <Text
                  style={[
                    styles.planPrice,
                    plan.featured && styles.planTextFeatured,
                  ]}
                >
                  {plan.price}
                </Text>
                <Text
                  style={[
                    styles.planLabel,
                    plan.featured && styles.planLabelFeatured,
                  ]}
                >
                  {plan.label}
                </Text>
                {plan.features.map((feature) => (
                  <Text
                    key={feature}
                    style={[
                      styles.planFeature,
                      plan.featured && styles.planFeatureFeatured,
                    ]}
                  >
                    <Text style={styles.planCheck}>✓ </Text>
                    {feature}
                  </Text>
                ))}
                <Link href="/signup">
                  <View
                    style={[
                      styles.planCta,
                      plan.featured && styles.planCtaFeatured,
                    ]}
                  >
                    <Text
                      style={[
                        styles.planCtaText,
                        plan.featured && styles.planCtaTextFeatured,
                      ]}
                    >
                      Get Started
                    </Text>
                  </View>
                </Link>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.ctaCard}>
          <Text style={styles.eyebrow}>Ready to get started?</Text>
          <Text style={styles.ctaTitle}>
            Sign up to get started with your journey.
          </Text>
          <Text style={styles.ctaBody}>
            No credit card required. Cancel anytime.
          </Text>
          {subscribed ? (
            <Text style={styles.ctaSuccess}>Thanks! You are on the list.</Text>
          ) : (
            <View style={styles.ctaForm}>
              <TextInput
                style={styles.ctaInput}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#888"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Pressable style={styles.ctaButton} onPress={handleSubscribe}>
                <Text style={styles.ctaButtonText}>Get Started</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <BrandMark />
        <Text style={styles.footerTagline}>Built for what matters to you.</Text>
        <Text style={styles.footerCopy}>
          © {new Date().getFullYear()} YourApp. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pageContent: {
    flexGrow: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd8d0",
    backgroundColor: "rgba(245, 245, 240, 0.95)",
  },
  headerInner: {
    maxWidth: 1120,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2d2d2d",
    justifyContent: "center",
    alignItems: "center",
  },
  brandIconText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  brandName: {
    fontWeight: "700",
    fontSize: 18,
    color: "#1a1a1a",
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
  },
  navLink: {
    color: "#888",
    fontWeight: "500",
    fontSize: 15,
  },
  navCta: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#2d2d2d",
    borderRadius: 999,
  },
  navCtaText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  hero: {
    maxWidth: 1120,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  heroGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 32,
    alignItems: "center",
  },
  heroCopy: {
    flex: 1,
    minWidth: 280,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#888",
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  heroBody: {
    color: "#888",
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 24,
    maxWidth: 520,
  },
  heroActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  heroPrimary: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#2d2d2d",
    borderRadius: 999,
  },
  heroPrimaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  heroSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "#ddd8d0",
    borderRadius: 999,
  },
  heroSecondaryText: {
    color: "#1a1a1a",
    fontWeight: "600",
    fontSize: 15,
  },
  heroStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  heroStat: {
    color: "#888",
    fontSize: 14,
  },
  heroStatStrong: {
    color: "#1a1a1a",
    fontWeight: "700",
  },
  phoneMockup: {
    flex: 1,
    minWidth: 280,
    maxWidth: 360,
    borderWidth: 1,
    borderColor: "#ddd8d0",
    borderRadius: 24,
    backgroundColor: "#fff",
    padding: 24,
    alignSelf: "center",
  },
  mockCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eae8e3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  mockCircleIcon: {
    fontSize: 40,
    color: "#aaa69e",
  },
  mockBadge: {
    position: "absolute",
    bottom: 0,
    right: -6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd8d0",
    justifyContent: "center",
    alignItems: "center",
  },
  mockTitle: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  mockDots: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 16,
  },
  mockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d4d4d0",
  },
  mockDotActive: {
    backgroundColor: "#1a1a1a",
  },
  mockCta: {
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: "#2d2d2d",
    alignItems: "center",
    marginBottom: 10,
  },
  mockCtaText: {
    color: "#fff",
    fontWeight: "600",
  },
  mockFooter: {
    textAlign: "center",
    color: "#888",
    fontSize: 13,
  },
  mockFooterLink: {
    color: "#1a1a1a",
    fontWeight: "700",
  },
  section: {
    maxWidth: 1120,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: -0.3,
    marginBottom: 32,
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  featureCard: {
    flexGrow: 1,
    flexBasis: "45%",
    minWidth: 260,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ddd8d0",
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  featureDesc: {
    color: "#888",
    lineHeight: 22,
  },
  pricingSection: {
    backgroundColor: "#fafaf6",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd8d0",
  },
  pricingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  planCard: {
    flexGrow: 1,
    flexBasis: "30%",
    minWidth: 260,
    padding: 22,
    borderWidth: 1,
    borderColor: "#ddd8d0",
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  planCardFeatured: {
    backgroundColor: "#1a1a1a",
    borderColor: "#1a1a1a",
  },
  planBadge: {
    alignSelf: "flex-start",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 12,
    overflow: "hidden",
  },
  planName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  planTextFeatured: {
    color: "#fff",
  },
  planPrice: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1a1a1a",
    marginTop: 8,
  },
  planLabel: {
    color: "#888",
    fontSize: 14,
    marginBottom: 12,
  },
  planLabelFeatured: {
    color: "#d4d4d0",
  },
  planFeature: {
    color: "#888",
    marginBottom: 8,
  },
  planFeatureFeatured: {
    color: "#d4d4d0",
  },
  planCheck: {
    color: "#2d8a6e",
  },
  planCta: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#2d2d2d",
    alignItems: "center",
  },
  planCtaFeatured: {
    backgroundColor: "#fff",
  },
  planCtaText: {
    color: "#fff",
    fontWeight: "600",
  },
  planCtaTextFeatured: {
    color: "#1a1a1a",
  },
  ctaCard: {
    borderWidth: 1,
    borderColor: "#ddd8d0",
    borderRadius: 20,
    backgroundColor: "#eae8e3",
    padding: 32,
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  ctaBody: {
    color: "#888",
    marginBottom: 20,
  },
  ctaSuccess: {
    color: "#2d8a6e",
    fontWeight: "500",
  },
  ctaForm: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  ctaInput: {
    flexGrow: 1,
    minWidth: 220,
    minHeight: 44,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ddd8d0",
    backgroundColor: "#fff",
    color: "#1a1a1a",
    paddingHorizontal: 16,
    fontSize: 16,
  },
  ctaButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: "#2d2d2d",
  },
  ctaButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#ddd8d0",
    backgroundColor: "#fafaf6",
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 8,
  },
  footerTagline: {
    color: "#888",
    fontSize: 15,
  },
  footerCopy: {
    color: "#888",
    fontSize: 14,
    marginTop: 8,
  },
});
