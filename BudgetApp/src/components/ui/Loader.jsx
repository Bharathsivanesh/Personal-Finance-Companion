// src/components/ui/Loader.jsx
import React, { useEffect, useRef } from "react";
import { View, Modal, Animated, Easing, Text } from "react-native";

const Loader = ({ visible, message, overlay = true }) => {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const bar1 = useRef(new Animated.Value(0.4)).current;
  const bar2 = useRef(new Animated.Value(0.7)).current;
  const bar3 = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // ✅ coin flip — native driver
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true, // ✅
      }),
    ).start();

    // ✅ bars use scaleY (transform) → native driver works
    const makeBar = (anim, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 420,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true, // ✅ native now
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 420,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true, // ✅
          }),
        ]),
      );

    makeBar(bar1, 0).start();
    makeBar(bar2, 140).start();
    makeBar(bar3, 280).start();
  }, []);

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const coinScaleX = spin.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [1, 0.1, 1, 0.1, 1],
  });

  // ✅ bars: fixed height container, animate scaleY + translateY to anchor bottom
  const BAR_MAX = 22;

  const makeBarStyle = (anim, color) => {
    const scaleY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1], // scaleY 0.3 → 1
    });
    // translateY to keep bar anchored at bottom
    const translateY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [BAR_MAX * 0.35, 0],
    });
    return {
      width: 7,
      height: BAR_MAX,
      borderRadius: 4,
      backgroundColor: color,
      transform: [{ scaleY }, { translateY }],
    };
  };

  const Content = (
    <View style={{ alignItems: "center", gap: 14 }}>
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

      {/* Bar chart — fixed height container */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 5,
          height: BAR_MAX,
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
          }}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );

  if (!overlay) return visible ? Content : null;

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
      statusBarTranslucent
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.38)",
          justifyContent: "center",
          alignItems: "center",
          opacity: fadeIn,
        }}
      >
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
          {Content}
        </View>
      </Animated.View>
    </Modal>
  );
};

export default Loader;
