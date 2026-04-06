import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import C from "../../../constants/colors";
export default function MessageBubble({ message }) {
  const isAI = message.role === "ai";
  const scale = useRef(new Animated.Value(0.88)).current;
  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  function renderText(text) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith("**") && p.endsWith("**") ? (
        <Text
          key={i}
          style={{ fontWeight: "800", color: isAI ? C.dark : "#fff" }}
        >
          {p.slice(2, -2)}
        </Text>
      ) : (
        <Text key={i}>{p}</Text>
      ),
    );
  }

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        alignItems: isAI ? "flex-start" : "flex-end",
        marginBottom: 12,
        paddingHorizontal: 16,
      }}
    >
      {isAI && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginBottom: 5,
          }}
        >
          <LinearGradient
            colors={["#a78bfa", "#7c3aed"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="sparkles" size={12} color="#fff" />
          </LinearGradient>
          <Text style={{ fontSize: 11, fontWeight: "700", color: C.muted }}>
            AI · AI Assistant
          </Text>
        </View>
      )}
      <View
        style={{
          maxWidth: "82%",
          borderRadius: 20,
          borderTopLeftRadius: isAI ? 4 : 20,
          borderBottomRightRadius: isAI ? 20 : 4,
          overflow: "hidden",
          shadowColor: C.primary,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: isAI ? 0.06 : 0.22,
          shadowRadius: 8,
          elevation: isAI ? 1 : 5,
        }}
      >
        {isAI ? (
          <View style={{ backgroundColor: C.white, padding: 14 }}>
            <Text style={{ fontSize: 14, lineHeight: 22, color: C.dark }}>
              {renderText(message.text)}
            </Text>
          </View>
        ) : (
          <LinearGradient
            colors={["#a78bfa", "#7c3aed", "#6d28d9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 14 }}
          >
            <Text
              style={{
                fontSize: 14,
                lineHeight: 22,
                color: "#fff",
                fontWeight: "500",
              }}
            >
              {message.text}
            </Text>
          </LinearGradient>
        )}
      </View>
      <Text
        style={{
          fontSize: 10,
          color: C.faint,
          marginTop: 4,
          marginHorizontal: 4,
        }}
      >
        {message.time}
      </Text>
    </Animated.View>
  );
}
