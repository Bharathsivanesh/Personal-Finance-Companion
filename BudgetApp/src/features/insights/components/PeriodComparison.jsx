import { Text, View } from "react-native";
import C from "../../../constants/colors";

/**
 * Colour + arrow logic:
 *
 * EXPENSE  — spending MORE than last period is BAD  → red   ▲
 *          — spending LESS than last period is GOOD → green ▼
 *
 * INCOME   — earning MORE than last period is GOOD  → green ▲
 *          — earning LESS than last period is BAD   → red   ▼
 *
 * diff > 0  = this period > last period (went up)
 * diff < 0  = this period < last period (went down)
 * diff === 0 = no change → neutral grey, no arrow
 */
export default function PeriodComparison({ data, type }) {
  const isExpense = type === "Expense";
  const isPositive = data.diff > 0;
  const isNeutral = data.diff === 0;

  // For expense: up = bad (red), down = good (green)
  // For income:  up = good (green), down = bad (red)
  let diffColor;
  if (isNeutral) {
    diffColor = C.muted;
  } else if (isExpense) {
    diffColor = isPositive ? C.red : C.green;
  } else {
    diffColor = isPositive ? C.green : C.red;
  }

  // Arrow direction — always matches the actual movement
  // ▲ = went up, ▼ = went down
  const arrow = isNeutral ? "–" : isPositive ? "▲" : "▼";

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
        {/* Last period */}
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

        {/* Diff badge */}
        <View
          style={{
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 14,
            alignItems: "center",
            backgroundColor: isNeutral ? C.border : diffColor + "18",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "800", color: diffColor }}>
            {isNeutral ? "–" : `${arrow} ${Math.abs(data.diff)}%`}
          </Text>
        </View>

        {/* This period */}
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
