import { LineChart } from "react-native-chart-kit";
import C from "../../../constants/colors";
import { Dimensions, Text, View } from "react-native";

export default function TrendChart({ data, type, period }) {
  const accent = type === "Income" ? C.green : C.red;

  const periodLabel =
    period === "Week" ? "Daily" : period === "Month" ? "Weekly" : "Monthly";

  const chartData = {
    labels: data.labels,
    datasets: [{ data: data.values, color: () => accent, strokeWidth: 2.5 }],
  };

  const { width: SCREEN_W } = Dimensions.get("window");
  const CHART_W = SCREEN_W - 48;

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

        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
            backgroundColor: accent + "18",
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: "700", color: accent }}>
            {type === "Income" ? "+12%" : "-8%"} vs last
          </Text>
        </View>
      </View>

      <LineChart
        data={chartData}
        width={CHART_W}
        height={150}
        chartConfig={{
          backgroundGradientFrom: C.white,
          backgroundGradientTo: C.white,
          decimalPlaces: 0,
          color: () => accent,
          labelColor: () => C.muted,
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: C.white,
            fill: accent,
          },
          propsForBackgroundLines: {
            stroke: C.border,
            strokeDasharray: "4",
          },
          fillShadowGradientFrom: accent,
          fillShadowGradientTo: C.white,
          fillShadowGradientOpacity: 0.12,
        }}
        bezier
        withInnerLines
        withOuterLines={false}
        withShadow
        style={{ borderRadius: 12, marginLeft: -16 }}
        formatYLabel={(v) => {
          const n = Number(v);
          return n >= 100000
            ? `₹${(n / 100000).toFixed(1)}L`
            : `₹${(n / 1000).toFixed(0)}k`;
        }}
      />
    </View>
  );
}
