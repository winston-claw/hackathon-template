"use client";

import { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { TextLink } from "solito/link";
import { useRouter } from "solito/router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ONBOARDING_SLIDES } from "../constants";
import { colors } from "@project-template/ui";

const { width } = Dimensions.get("window");
const CIRCLE_SIZE = Math.min(width * 0.44, 200);

export function OnboardingHomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / width);
      setActiveIndex(index);
    },
    []
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <View style={styles.carouselArea}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
        >
          {ONBOARDING_SLIDES.map((slide, i) => (
            <View key={i} style={styles.slide}>
              <View style={styles.circleImage}>
                <Text style={styles.circleIcon}>{slide.icon}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeIcon}>{slide.badge}</Text>
                </View>
              </View>
              <Text style={styles.title}>{slide.title}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.middle}>
        <Text style={styles.subtitle}>SWIPE TO DISCOVER MORE</Text>
        <View style={styles.dots}>
          {ONBOARDING_SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </Pressable>

        <Text style={styles.footerText}>
          Already have an account?{" "}
          <TextLink href="/login" style={styles.link}>
            Log In
          </TextLink>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  carouselArea: {
    flex: 1,
  },
  slide: {
    width,
    paddingHorizontal: 28,
    paddingTop: 20,
    justifyContent: "center",
  },
  circleImage: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "#e8e5df",
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  circleIcon: {
    fontSize: 48,
    color: "#aaa69e",
  },
  badge: {
    position: "absolute",
    bottom: 6,
    right: -4,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  badgeIcon: {
    fontSize: 16,
  },
  title: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  middle: {
    alignItems: "center",
    gap: 14,
    paddingVertical: 24,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#999",
    letterSpacing: 2,
    textAlign: "center",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d4d4d0",
  },
  dotActive: {
    backgroundColor: "#1a1a1a",
  },
  footer: {
    gap: 16,
    paddingHorizontal: 28,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#2d2d2d",
    borderRadius: 30,
    paddingVertical: 17,
    alignItems: "center",
    width: "100%",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  footerText: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
  },
  link: {
    color: "#1a1a1a",
    fontWeight: "700",
  },
});
