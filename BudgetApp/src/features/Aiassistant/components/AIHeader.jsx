import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";
export default function AIHeader({ onBack }) {
  const rotate = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1.08,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 1,
          duration: 1200,
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
    <LinearGradient
      colors={["#8b5cf6", "#7c3aed", "#6d28d9"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ paddingHorizontal: 16, paddingBottom: 20, overflow: "hidden" }}
    >
      <View
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 140,
          height: 140,
          borderRadius: 70,
          backgroundColor: "rgba(255,255,255,0.07)",
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: -30,
          left: -20,
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: "rgba(255,255,255,0.05)",
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "rgba(255,255,255,0.15)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="arrow-back" size={18} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 36 }} />
        )}

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View
            style={{
              width: 7,
              height: 7,
              borderRadius: 4,
              backgroundColor: "#86efac",
            }}
          />
          <Text
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 12,
              fontWeight: "600",
            }}
          >
            Online
          </Text>
        </View>

        <TouchableOpacity
          style={{
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
          }}
        ></TouchableOpacity>
      </View>

      <View style={{ alignItems: "center" }}>
        <View style={{ marginBottom: 12 }}>
          <Animated.View
            style={{
              position: "absolute",
              top: -6,
              left: -6,
              width: 72,
              height: 72,
              borderRadius: 36,
              borderWidth: 1.5,
              borderColor: "transparent",
              borderTopColor: "rgba(196,181,253,0.7)",
              borderRightColor: "rgba(196,181,253,0.3)",
              transform: [{ rotate: spin }],
            }}
          />
          <Animated.View style={{ transform: [{ scale: breathe }] }}>
            <LinearGradient
              colors={["#c4b5fd", "#a78bfa", "#7c3aed"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center",
                elevation: 8,
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: 8,
                  right: 9,
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "rgba(255,255,255,0.4)",
                }}
              />
              <Ionicons name="sparkles" size={28} color="#fff" />
            </LinearGradient>
          </Animated.View>
        </View>
        <Text
          style={{
            color: "#fff",
            fontSize: 20,
            fontWeight: "800",
            letterSpacing: -0.3,
          }}
        >
          AI
        </Text>
        <Text
          style={{
            color: "#c4b5fd",
            fontSize: 12,
            marginTop: 3,
            textAlign: "center",
            paddingHorizontal: 30,
          }}
        >
          Your AI-powered financial assistant
        </Text>
      </View>
    </LinearGradient>
  );
}
