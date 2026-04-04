import { Animated, Text, TouchableOpacity, View } from "react-native";
import { amountColor, amountSign, badgeStyle } from "../utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import C from "../../../constants/colors";

export default function TransactionRow({ item, isLast }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, []);
  const badge = badgeStyle(item.type);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        activeOpacity={0.72}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 13,
          paddingHorizontal: 14,
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: C.border,
        }}
      >
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            backgroundColor: item.iconBg,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Ionicons name={item.icon} size={21} color={item.iconColor} />
        </View>

        <View style={{ flex: 1, marginRight: 8 }}>
          <Text
            style={{ fontSize: 14, fontWeight: "600", color: C.dark }}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
            {item.subtitle}
          </Text>
          <Text style={{ fontSize: 10, color: C.faint, marginTop: 1 }}>
            {item.time}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: amountColor(item.type),
            }}
          >
            {amountSign(item.type)}₹
            {parseFloat(item.amount).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </Text>
          <View
            style={{
              marginTop: 5,
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 8,
              backgroundColor: badge.bg,
            }}
          >
            <Text
              style={{ fontSize: 9, fontWeight: "700", color: badge.color }}
            >
              {badge.label}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
