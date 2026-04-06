import C from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function TransactionItem({
  icon,
  type,
  iconBg,
  iconColor,
  title,
  subtitle,
  date,
  amount,
  isIncome,
}) {
  const amountColor =
    type === "income" ? "#22c55e" : type === "expense" ? "#ef4444" : C.blue; // transfer (purple)
  const amountPrefix = type === "income" ? "+" : type === "expense" ? "-" : ""; // transfer
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
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        {type === "transfer" && (
          <Ionicons name="swap-horizontal" size={14} color={C.blue} />
        )}

        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: amountColor,
          }}
        >
          {amountPrefix}₹{amount}
        </Text>
      </View>
    </View>
  );
}
