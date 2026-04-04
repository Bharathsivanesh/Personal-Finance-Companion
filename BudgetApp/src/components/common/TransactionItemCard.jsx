import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function TransactionItem({ icon, iconBg, iconColor, title, subtitle, date, amount, isIncome }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f0fc",
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          backgroundColor: iconBg,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: "600", color: "#1a1035" }}>
          {title}
        </Text>
        <Text style={{ fontSize: 11, color: "#9588c8", marginTop: 1 }}>
          {subtitle}
        </Text>
        <Text style={{ fontSize: 10, color: "#b0a8d4", marginTop: 1 }}>
          {date}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "700",
          color: isIncome ? "#22c55e" : "#ef4444",
        }}
      >
        {isIncome ? "+" : "-"}₹{amount}
      </Text>
    </View>
  );
}