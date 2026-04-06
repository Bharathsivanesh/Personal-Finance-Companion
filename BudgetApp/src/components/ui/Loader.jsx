// src/components/ui/Loader.jsx
import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, Text } from "react-native";

/**
 * Loader — position:absolute overlay, never unmounts.
 * Animations run continuously so they're always mid-cycle when shown.
 *
 * Props (same as before):
 *   visible  – boolean
 *   message  – string | undefined
 *   overlay  – boolean (default true)
 */
const Loader = ({ visible, message, overlay = true }) => {
  const fadeAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const bar1 = useRef(new Animated.Value(0.4)).current;
  const bar2 = useRef(new Animated.Value(0.7)).current;
  const bar3 = useRef(new Animated.Value(0.5)).current;

  // ── animations start ONCE on mount, loop forever ─────────────────────────
  useEffect(() => {
    // Coin flip
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Bars
    const makeBar = (anim, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 420,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 420,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );

    makeBar(bar1, 0).start();
    makeBar(bar2, 140).start();
    makeBar(bar3, 280).start();
  }, []); // ← empty deps: starts once, never resets

  // ── fade overlay in/out on visible change ─────────────────────────────────
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  // ── derived styles ─────────────────────────────────────────────────────────
  const coinScaleX = spin.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [1, 0.1, 1, 0.1, 1],
  });

  const BAR_MAX = 22;
  const makeBarStyle = (anim, color) => ({
    width: 7,
    height: BAR_MAX,
    borderRadius: 4,
    backgroundColor: color,
    transform: [
      {
        scaleY: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
      },
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [BAR_MAX * 0.35, 0],
        }),
      },
    ],
  });

  const card = (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingVertical: 28,
        paddingHorizontal: 36,
        alignItems: "center",
        shadowColor: "#7c3aed",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 12,
      }}
    >
      {/* Purple top accent */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 28,
          right: 28,
          height: 3,
          borderRadius: 2,
          backgroundColor: "#8b5cf6",
        }}
      />

      {/* Flipping ₹ coin */}
      <Animated.View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: "#7c3aed",
          justifyContent: "center",
          alignItems: "center",
          transform: [{ scaleX: coinScaleX }],
          shadowColor: "#7c3aed",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>
          ₹
        </Text>
      </Animated.View>

      {/* Animated bars */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 5,
          height: BAR_MAX,
          marginTop: 14,
        }}
      >
        <Animated.View style={makeBarStyle(bar1, "#c4b5fd")} />
        <Animated.View style={makeBarStyle(bar2, "#7c3aed")} />
        <Animated.View style={makeBarStyle(bar3, "#c4b5fd")} />
      </View>

      {message ? (
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: "#6b7280",
            letterSpacing: 0.3,
            marginTop: 14,
          }}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );

  // ── non-overlay mode ──────────────────────────────────────────────────────
  if (!overlay) return visible ? card : null;

  // ── overlay mode — always in the tree, shown/hidden via opacity + pointerEvents
  return (
    <Animated.View
      pointerEvents={visible ? "box-only" : "none"} // blocks taps only when visible
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.38)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
        opacity: fadeAnim, // fade in/out — never unmounts
      }}
    >
      {card}
    </Animated.View>
  );
};

export default Loader;
