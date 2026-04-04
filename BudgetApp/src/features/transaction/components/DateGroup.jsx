import { Text, View } from "react-native";
import TransactionRow from "./TransactionRow";
import { formatGroupDate } from "../utils/helpers";
import C from "../../../constants/colors";
export default function DateGroup({ dateStr, items }) {
  const label = formatGroupDate(dateStr);
  const netDay = items.reduce((s, t) => {
    if (t.type === "income") return s + parseFloat(t.amount);
    if (t.type === "expense") return s - parseFloat(t.amount);
    return s;
  }, 0);

  return (
    <View style={{ marginHorizontal: 16, marginBottom: 14 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: C.primaryLight,
            }}
          />
          <Text style={{ fontSize: 13, fontWeight: "700", color: C.dark }}>
            {label}
          </Text>
          <View
            style={{
              backgroundColor: C.primaryPale,
              borderRadius: 8,
              paddingHorizontal: 7,
              paddingVertical: 2,
            }}
          >
            <Text style={{ fontSize: 10, color: C.primary, fontWeight: "600" }}>
              {items.length}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: netDay >= 0 ? C.green : C.red,
          }}
        >
          {netDay >= 0 ? "+" : ""}
          {netDay === 0
            ? "₹0.00"
            : "₹" +
              Math.abs(netDay).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
        </Text>
      </View>

      {/* Card */}
      <View
        style={{
          backgroundColor: C.white,
          borderRadius: 18,
          shadowColor: C.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.07,
          shadowRadius: 10,
          elevation: 3,
          overflow: "hidden",
        }}
      >
        {items.map((item, idx) => (
          <TransactionRow
            key={item.id}
            item={item}
            isLast={idx === items.length - 1}
          />
        ))}
      </View>
    </View>
  );
}
