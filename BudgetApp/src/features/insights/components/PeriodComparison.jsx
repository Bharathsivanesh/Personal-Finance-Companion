// src/features/insights/components/PeriodComparison.jsx
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import C from "../../../constants/colors";

/**
 * LOGIC:
 *
 * diff > 0  → this period is HIGHER than last  (spent/earned MORE)
 * diff < 0  → this period is LOWER  than last  (spent/earned LESS)
 * diff = 0  → exactly the same
 * diff = null → no data in either period
 *
 * EXPENSE:
 *   spent MORE (diff > 0) → BAD  → red   ↑
 *   spent LESS (diff < 0) → GOOD → green ↓
 *
 * INCOME:
 *   earned MORE (diff > 0) → GOOD → green ↑
 *   earned LESS (diff < 0) → BAD  → red   ↓
 */
export default function PeriodComparison({ data, type }) {
  const isExpense = type === "Expense";
  const diff = data.diff; // number | null

  const noData = diff === null;
  const neutral = diff === 0;
  const wentUp = diff > 0;
  const wentDown = diff < 0;

  // ── colour ────────────────────────────────────────────────────────────────
  let diffColor = C.muted; // default neutral
  if (!noData && !neutral) {
    if (isExpense) {
      diffColor = wentUp ? "#ef4444" : "#16a34a"; // up=bad red, down=good green
    } else {
      diffColor = wentUp ? "#16a34a" : "#ef4444"; // up=good green, down=bad red
    }
  }

  // ── icon ──────────────────────────────────────────────────────────────────
  // Ionicons arrow names
  let arrowIcon = null;
  if (!noData && !neutral) {
    arrowIcon = wentUp ? "arrow-up" : "arrow-down";
  }

  // ── badge text ────────────────────────────────────────────────────────────
  let badgeText = "–";
  if (!noData && !neutral) {
    badgeText = `${Math.abs(diff)}%`;
  }
  if (noData) badgeText = "No data";

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
      {/* Title row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "700", color: C.dark }}>
          Period Comparison
        </Text>
        {/* Overall trend badge */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 20,
            backgroundColor: noData || neutral ? C.border : diffColor + "18",
          }}
        >
          {arrowIcon && (
            <Ionicons name={arrowIcon} size={12} color={diffColor} />
          )}
          <Text style={{ fontSize: 13, fontWeight: "800", color: diffColor }}>
            {badgeText}
          </Text>
        </View>
      </View>

      {/* Last ←→ This */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* ── Last period (left) ── */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 10,
              color: C.muted,
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {data.lastLabel}
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: C.dark,
              letterSpacing: -0.5,
              marginTop: 4,
            }}
          >
            {data.lastAmt}
          </Text>
          {/* <Text style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>
            {data.lastTx} txns
          </Text> */}
        </View>

        {/* ── Arrow in the middle ── */}
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: noData || neutral ? C.border : diffColor + "18",
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 8,
          }}
        >
          <Ionicons
            name={
              noData || neutral
                ? "remove-outline"
                : wentUp
                  ? "arrow-forward" // → right-arrow: this period is higher
                  : "arrow-back" // ← left-arrow:  this period is lower
            }
            size={16}
            color={noData || neutral ? C.muted : diffColor}
          />
        </View>

        {/* ── This period (right) ── */}
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Text
            style={{
              fontSize: 10,
              color: C.muted,
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {data.thisLabel}
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              letterSpacing: -0.5,
              marginTop: 4,
              // ✅ right side coloured to show good/bad
              color: noData || neutral ? C.dark : diffColor,
            }}
          >
            {data.thisAmt}
          </Text>
          {/* <Text style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>
            {data.thisTx} txns
          </Text> */}
        </View>
      </View>

      {/* ── Context message ── */}
      {!noData && !neutral && (
        <View
          style={{
            marginTop: 12,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: C.border,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Ionicons
            name={
              wentUp ? "arrow-up-circle-outline" : "arrow-down-circle-outline"
            }
            size={14}
            color={diffColor}
          />
          <Text style={{ fontSize: 11, color: diffColor, fontWeight: "600" }}>
            {isExpense
              ? wentUp
                ? `Spent ${Math.abs(diff)}% more than ${data.lastLabel.toLowerCase()}`
                : `Spent ${Math.abs(diff)}% less than ${data.lastLabel.toLowerCase()} — great saving!`
              : wentUp
                ? `Earned ${Math.abs(diff)}% more than ${data.lastLabel.toLowerCase()} — keep it up!`
                : `Earned ${Math.abs(diff)}% less than ${data.lastLabel.toLowerCase()}`}
          </Text>
        </View>
      )}
    </View>
  );
}
