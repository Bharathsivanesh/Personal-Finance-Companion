// src/features/insights/components/TrendChart.jsx
import { LineChart } from "react-native-chart-kit";
import C from "../../../constants/colors";
import { Dimensions, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const makeYFormatter = () => {
  const seen = new Set();
  return (v) => {
    const n = Number(v);
    let label;
    if (n === 0) label = "₹0";
    else if (n >= 100000) label = `₹${(n / 100000).toFixed(1)}L`;
    else if (n >= 1000) label = `₹${(n / 1000).toFixed(1)}k`;
    else label = `₹${Math.round(n)}`;
    if (seen.has(label)) return "";
    seen.add(label);
    return label;
  };
};

export default function TrendChart({ data, type, period }) {
  const accent = type === "Income" ? C.green : C.red;
  const periodLabel =
    period === "Week" ? "Daily" : period === "Month" ? "Weekly" : "Monthly";

  const { width: SCREEN_W } = Dimensions.get("window");
  const CHART_W = SCREEN_W - 32;
  const X_LABEL_HEIGHT = 28;

  // ✅ check if all values are zero (no data)
  const hasData = data?.values?.some((v) => v > 0);

  const chartData = {
    labels: data?.labels ?? [],
    datasets: [
      {
        // ✅ if no data show flat zero line so chart doesn't crash
        data: data?.values?.length ? data.values : [0],
        color: () => accent,
        strokeWidth: 2.5,
      },
    ],
  };

  const formatYLabel = makeYFormatter();

  return (
    <View
      style={{
        backgroundColor: C.white,
        borderRadius: 20,
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: X_LABEL_HEIGHT,
        marginBottom: 16,
        shadowColor: C.primary,
        shadowOpacity: 0.07,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
        overflow: "visible",
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <View>
          <Text style={{ fontSize: 15, fontWeight: "700", color: C.dark }}>
            {type} Trend
          </Text>
          <Text style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
            {periodLabel} breakdown
          </Text>
        </View>
      </View>

      {/* ✅ Empty state overlay — shown on top of flat chart */}
      {!hasData && (
        <View
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            right: 0,
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: C.primaryPale,
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderRadius: 20,
            }}
          >
            <Ionicons name="analytics-outline" size={14} color={C.primary} />
            <Text style={{ fontSize: 12, fontWeight: "600", color: C.primary }}>
              No {type.toLowerCase()} data for this period
            </Text>
          </View>
        </View>
      )}

      {/* Chart — always renders to avoid crashes */}
      <View style={{ overflow: "visible" }}>
        <LineChart
          data={chartData}
          width={CHART_W}
          height={160}
          chartConfig={{
            backgroundGradientFrom: C.white,
            backgroundGradientTo: C.white,
            decimalPlaces: 0,
            color: () => (hasData ? accent : C.border),
            labelColor: () => C.muted,
            propsForDots: {
              r: hasData ? "4" : "0",
              strokeWidth: "2",
              stroke: C.white,
              fill: accent,
            },
            propsForBackgroundLines: {
              stroke: C.border,
              strokeDasharray: "4",
            },
            fillShadowGradientFrom: hasData ? accent : C.border,
            fillShadowGradientTo: C.white,
            fillShadowGradientOpacity: hasData ? 0.12 : 0,
            paddingRight: 16,
          }}
          bezier
          withInnerLines
          withOuterLines={false}
          withShadow={hasData}
          style={{ borderRadius: 12, marginLeft: -16, overflow: "visible" }}
          formatYLabel={formatYLabel}
        />
      </View>
    </View>
  );
}
