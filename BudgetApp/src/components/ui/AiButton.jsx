
import React, { useEffect, useRef } from "react";
import { Animated, TouchableOpacity, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AIFloatingButton({ onPress }) {
  const insets = useSafeAreaInsets();

  // Pulse ring 1
  const ring1Scale = useRef(new Animated.Value(1)).current;
  const ring1Opacity = useRef(new Animated.Value(0.5)).current;
  // Pulse ring 2
  const ring2Scale = useRef(new Animated.Value(1)).current;
  const ring2Opacity = useRef(new Animated.Value(0.35)).current;
  // Icon breathe
  const breathe = useRef(new Animated.Value(1)).current;
  // Shimmer rotate
  const rotate = useRef(new Animated.Value(0)).current;
  // Float up-down
  const floatY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Ring 1 pulse — slow expand + fade
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ring1Scale, {
            toValue: 1.9,
            duration: 1600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(ring1Opacity, {
            toValue: 0,
            duration: 1600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ring1Scale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(ring1Opacity, {
            toValue: 0.5,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();

    // Ring 2 pulse — delayed
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(ring2Scale, {
              toValue: 2.4,
              duration: 2000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(ring2Opacity, {
              toValue: 0,
              duration: 2000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(ring2Scale, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(ring2Opacity, {
              toValue: 0.35,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ).start();
    }, 600);

    // Icon breathe — FIX: Easing.sine → Easing.sin
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1.12,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Shimmer ring rotate
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Float — FIX: Easing.sine → Easing.sin
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: -6,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        right: 20,
        bottom: insets.bottom + 80, // above tab bar
        alignItems: "center",
        justifyContent: "center",
        transform: [{ translateY: floatY }],
      }}
    >
      {/* Outer pulse ring 2 */}
      <Animated.View
        style={{
          position: "absolute",
          width: 40,
          height: 40,
          borderRadius: 28,
          backgroundColor: "#8b5cf6",
          opacity: ring2Opacity,
          transform: [{ scale: ring2Scale }],
        }}
      />
      {/* Outer pulse ring 1 */}
      <Animated.View
        style={{
          position: "absolute",
          width: 36,
          height: 36,
          borderRadius: 28,
          backgroundColor: "#7c3aed",
          opacity: ring1Opacity,
          transform: [{ scale: ring1Scale }],
        }}
      />

      {/* Spinning shimmer arc */}
      <Animated.View
        style={{
          position: "absolute",
          width: 46,
          height: 46,
          borderRadius: 33,
          borderWidth: 1.5,
          borderColor: "transparent",
          borderTopColor: "rgba(196,181,253,0.6)",
          borderRightColor: "rgba(196,181,253,0.2)",
          transform: [{ rotate: spin }],
        }}
      />

      {/* Main button */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <Animated.View style={{ transform: [{ scale: breathe }] }}>
          <LinearGradient
            colors={["#a78bfa", "#7c3aed", "#6d28d9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 28,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#7c3aed",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.5,
              shadowRadius: 14,
              elevation: 12,
            }}
          >
            {/* Inner glow dot */}
            
            <Ionicons name="sparkles" size={24} color="#fff" />
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>

  
    </Animated.View>
  );
}
