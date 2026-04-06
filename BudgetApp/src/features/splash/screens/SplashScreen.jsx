import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

// ── Animated sparkle dot ──────────────────────────────────────────────────────
function Sparkle({ style }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 700,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 700,
            easing: Easing.out(Easing.back(1.5)),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 700,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.4,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(400),
      ]),
    ).start();
  }, []);

  return <Animated.View style={[{ opacity, transform: [{ scale }] }, style]} />;
}


export default function SplashScreen() {
  // Entry animations
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleY = useRef(new Animated.Value(14)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const badgeY = useRef(new Animated.Value(10)).current;
  const dividerWidth = useRef(new Animated.Value(10)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  // Floating logo bob
  const bobY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance
    Animated.sequence([
      // Logo pop-in
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(80),
      // Divider slide
      Animated.timing(dividerWidth, {
        toValue: 70,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false, // width cannot use native driver
      }),
      // Title slide up
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.timing(titleY, {
          toValue: 0,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(40),
      // Subtitle
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleY, {
          toValue: 0,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(120),
      // Badge
      Animated.parallel([
        Animated.timing(badgeOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(badgeY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(80),
      // Footer
      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Gentle floating bob after entrance
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bobY, {
            toValue: -8,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(bobY, {
            toValue: 0,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }, 1200);
  }, []);

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Full-screen lavender gradient background */}
      <LinearGradient
        colors={["#ede9f6", "#ddd5f3", "#cec4f0", "#e8e3f5"]}
        locations={[0, 0.35, 0.65, 1]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >

        <View
          style={{
            position: "absolute",
            top: height * 0.08,
            left: -60,
            width: 220,
            height: 220,
            borderRadius: 110,
            backgroundColor: "rgba(167,139,250,0.18)",
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: height * 0.1,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: "rgba(139,111,246,0.13)",
          }}
        />

        {/* ── Centre content ── */}
        <View style={{ alignItems: "center", paddingHorizontal: 32 }}>
          {/* Logo card */}
          <Animated.View
            style={{
              opacity: logoOpacity,
              transform: [{ scale: logoScale }, { translateY: bobY }],
              marginBottom: 28,
            }}
          >
            <LinearGradient
              colors={["#9b72f2", "#7c4de8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#7c4de8",
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.45,
                shadowRadius: 20,
                elevation: 14,
              }}
            >
              {/* Coin icon */}
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                {/* Main: wallet = money */}
                <Ionicons name="wallet" size={32} color="#fff" />

                <Ionicons
                  name="sparkles"
                  size={14}
                  color="#ffffffdd"
                  style={{ position: "absolute", top: -7, right: -9 }}
                />
              </View>

           
              <Sparkle
                style={{
                  position: "absolute",
                  top: 8,
                  left: 10,
                  width: 7,
                  height: 7,
                  borderRadius: 3.5,
                  backgroundColor: "#fff",
                }}
              />
              <Sparkle
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,  
                  width: 5,
                  height: 5,
                  borderRadius: 2.5,
                  backgroundColor: "#fff",
                }}
              />
            </LinearGradient>
          </Animated.View>

          {/* Title */}
          <Animated.Text
            style={{
              opacity: titleOpacity,
              transform: [{ translateY: titleY }],
              fontSize: 28,
              fontWeight: "800",
              color: "#1a1035",
              letterSpacing: -0.5,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Smart Finance
          </Animated.Text>

          {/* Subtitle */}
          <Animated.Text
            style={{
              opacity: subtitleOpacity,
              transform: [{ translateY: subtitleY }],
              fontSize: 14.5,
              fontWeight: "400",
              color: "#6b5ea8",
              letterSpacing: 0.1,
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            Track smarter, save better
          </Animated.Text>

          {/* Animated divider */}
          <Animated.View
            style={{
              width: dividerWidth,
              height: 3,
              borderRadius: 2,
              backgroundColor: "#8b6cf6",
              marginBottom: 28,
            }}
          />

          {/* Secure badge */}
          <Animated.View
            style={{
              opacity: badgeOpacity,
              transform: [{ translateY: badgeY }],
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
              borderWidth: 1.2,
              borderColor: "rgba(139,108,246,0.3)",
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 9,
              backgroundColor: "rgba(255,255,255,0.55)",
            }}
          >
            <Ionicons name="shield-checkmark" size={15} color="#7c4de8" />
            <Text
              style={{
                fontSize: 11.5,
                fontWeight: "700",
                color: "#5b3abf",
                letterSpacing: 1.6,
                textTransform: "uppercase",
              }}
            >
              Secure Architecture
            </Text>
          </Animated.View>
        </View>

        {/* Footer */}
        <Animated.View
          style={{
            position: "absolute",
            bottom: 38,
            opacity: footerOpacity,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: "#9585c8",
              letterSpacing: 2.4,
              textTransform: "uppercase",
            }}
          >
            The AI Smart Edition
          </Text>
        </Animated.View>
      </LinearGradient>
    </>
  );
}
