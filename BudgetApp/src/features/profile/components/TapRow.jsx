import { useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import C from "../../../constants/colors";

export default function TapRow({ icon, label, value, onPress, accent }) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPressIn={() =>
          Animated.spring(scale, {
            toValue: 0.97,
            useNativeDriver: true,
            speed: 30,
          }).start()
        }
        onPressOut={() =>
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 30,
          }).start()
        }
        onPress={onPress}
        style={{
          backgroundColor: C.white,
          borderRadius: 14,
          paddingHorizontal: 16,
          paddingVertical: 15,
          marginBottom: 10,
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: C.border,
          shadowColor: C.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
          elevation: 1,
        }}
      >
        <Text style={{ fontSize: 18, marginRight: 14 }}>{icon}</Text>
        <Text
          style={{
            flex: 1,
            fontSize: 15,
            fontWeight: "600",
            color: C.dark,
          }}
        >
          {label}
        </Text>
        {value ? (
          <View
            style={{
              backgroundColor: accent || C.primaryMid,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: accent ? C.white : C.primary,
              }}
            >
              {value}
            </Text>
          </View>
        ) : (
          <Text style={{ fontSize: 16, color: C.faint }}>›</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
