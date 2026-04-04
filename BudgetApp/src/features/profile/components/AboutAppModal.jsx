import { useEffect, useRef } from "react";
import { Animated, Dimensions, Modal, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import C from "../../../constants/colors";
export default function AboutAppModal({ visible, onClose }) {
    const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get("window");
  const slideAnim = useRef(new Animated.Value(SCREEN_H)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          speed: 16,
          bounciness: 4,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_H,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const features = [
    {
      icon: "📊",
      title: "Smart Insights",
      desc: "AI-powered spending analysis across weekly, monthly & yearly periods",
    },
    {
      icon: "💸",
      title: "Transaction Tracking",
      desc: "Log income and expenses with categories, tags and notes",
    },
    {
      icon: "🎯",
      title: "Goal Setting",
      desc: "Set savings goals and track your progress visually in real time",
    },
    {
      icon: "🔔",
      title: "Budget Alerts",
      desc: "Get notified when you approach your spending limits",
    },
    {
      icon: "🔒",
      title: "Bank-level Security",
      desc: "All data encrypted at rest and in transit. Your privacy is paramount",
    },
  ];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Animated.View
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(20,10,50,0.55)",
          opacity: backdropAnim,
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          transform: [{ translateY: slideAnim }],
          backgroundColor: C.bg,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingTop: 12,
          paddingBottom: Platform.OS === "ios" ? 40 : 28,
          maxHeight: SCREEN_H * 0.88,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.18,
          shadowRadius: 24,
          elevation: 20,
        }}
      >
        {/* Drag handle */}
        <View
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: C.faint,
            alignSelf: "center",
            marginBottom: 20,
          }}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
        >
          {/* App brand */}
          <View style={{ alignItems: "center", marginBottom: 28 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                backgroundColor: C.primary,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: C.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 18,
                elevation: 10,
                marginBottom: 14,
              }}
            >
              <Text style={{ fontSize: 34 }}>💜</Text>
            </View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: C.dark,
                letterSpacing: -0.6,
              }}
            >
              Smart Finance
            </Text>
            <Text style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
              Version 2.4.0 · Your intelligent money companion
            </Text>
          </View>

          {/* Tagline card */}
          <View
            style={{
              backgroundColor: C.primaryMid,
              borderRadius: 16,
              padding: 16,
              marginBottom: 24,
              borderLeftWidth: 4,
              borderLeftColor: C.primary,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: C.dark,
                fontWeight: "500",
                lineHeight: 22,
              }}
            >
              Your intelligent companion for{" "}
              <Text style={{ color: C.primary, fontWeight: "700" }}>
                wealth building
              </Text>{" "}
              and mindful spending. Engineered for financial clarity.
            </Text>
          </View>

          {/* Features */}
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: C.muted,
              letterSpacing: 1.4,
              marginBottom: 12,
            }}
          >
            WHAT WE DO
          </Text>
          {features.map((f, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                backgroundColor: C.white,
                borderRadius: 14,
                padding: 14,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: C.primaryPale,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Text style={{ fontSize: 20 }}>{f.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: C.dark,
                    marginBottom: 3,
                  }}
                >
                  {f.title}
                </Text>
                <Text style={{ fontSize: 13, color: C.muted, lineHeight: 19 }}>
                  {f.desc}
                </Text>
              </View>
            </View>
          ))}

          <Text
            style={{
              textAlign: "center",
              fontSize: 12,
              color: C.faint,
              marginTop: 22,
            }}
          >
            Made with 💜 · © 2026 Smart Finance
          </Text>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}
