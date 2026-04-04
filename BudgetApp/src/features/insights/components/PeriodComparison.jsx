import { Text, View } from "react-native";
import C from "../../../constants/colors";

export default function PeriodComparison({ data, type }) {
  const isPositive = data.diff > 0;

  const diffColor =
    type === "Expense"
      ? isPositive
        ? C.red
        : C.green
      : isPositive
        ? C.green
        : C.red;

  return (
    <View
      style={{
        backgroundColor: C.white,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: C.primary,
        shadowOpacity: 0.07,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
      }}
    >
      <Text style={{ fontSize: 15, fontWeight: "700", color: C.dark }}>
        Period Comparison
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 14,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 11, color: C.muted, fontWeight: "500" }}>
            {data.lastLabel}
          </Text>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: C.dark,
              letterSpacing: -0.5,
              marginTop: 3,
            }}
          >
            {data.lastAmt}
          </Text>

          <Text style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>
            {data.lastTx} txns
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 14,
            alignItems: "center",
            backgroundColor: diffColor + "18",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "800", color: diffColor }}>
            {isPositive ? "▲" : "▼"} {Math.abs(data.diff)}%
          </Text>
        </View>

        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Text style={{ fontSize: 11, color: C.muted, fontWeight: "500" }}>
            {data.thisLabel}
          </Text>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              letterSpacing: -0.5,
              marginTop: 3,
              color: diffColor,
            }}
          >
            {data.thisAmt}
          </Text>

          <Text style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>
            {data.thisTx} txns
          </Text>
        </View>
      </View>
    </View>
  );
}
