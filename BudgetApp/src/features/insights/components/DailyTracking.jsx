import { Text, View } from "react-native";
import CustomHeatmap from "./CustomHeatmap";
import C from "../../../constants/colors";

const generateHeatmap = () => {
  const vals = [];
  const today = new Date();
  for (let i = 90; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    vals.push({
      date: d.toISOString().split("T")[0],
      count: Math.random() > 0.35 ? Math.floor(Math.random() * 5) + 1 : 0,
    });
  }
  return vals;
};

const HEATMAP_VALUES = generateHeatmap();
const STREAK_COUNT = 14;

export default function DailyTracking() {
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
            Daily Activity
          </Text>
          <Text style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
            Transaction frequency · last 90 days
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
            backgroundColor: C.primary,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: "700", color: C.white }}>
            🔥 {STREAK_COUNT} day streak
          </Text>
        </View>
      </View>

      <CustomHeatmap values={HEATMAP_VALUES} />
    </View>
  );
}
