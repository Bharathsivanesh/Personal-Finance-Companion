import { Text, View, ActivityIndicator } from "react-native";
import CustomHeatmap from "./CustomHeatmap";
import C from "../../../constants/colors";

export default function DailyTracking({
  activityMap = {},
  startDate,
  endDate,
  loading,
}) {
  // Build the values array that CustomHeatmap expects:
  // [{ date: "YYYY-MM-DD", count: number }, ...]
  // Spans from startDate (user's first ever transaction) → today (endDate)
  const buildValues = () => {
    if (!startDate || !endDate) return [];

    const values = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      const key = current.toISOString().split("T")[0];
      values.push({ date: key, count: activityMap[key] ?? 0 });
      current.setDate(current.getDate() + 1);
    }
    return values;
  };

  const values = buildValues();

  // Stats
  const totalTx = Object.values(activityMap).reduce((s, v) => s + v, 0);
  const activeDays = Object.values(activityMap).filter((v) => v > 0).length;

  // Streak — count consecutive days ending today that have at least 1 tx
  const calcStreak = () => {
    let streak = 0;
    const today = new Date();
    const d = new Date(today);
    while (true) {
      const key = d.toISOString().split("T")[0];
      if ((activityMap[key] ?? 0) > 0) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };
  const streak = calcStreak();

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
            Transaction frequency · all time
          </Text>
        </View>

        {streak > 0 && (
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 20,
              backgroundColor: C.primary,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: "700", color: C.white }}>
              🔥 {streak} day streak
            </Text>
          </View>
        )}
      </View>

      {loading ? (
        <View
          style={{ height: 80, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="small" color={C.primary} />
        </View>
      ) : values.length === 0 ? (
        <View
          style={{ height: 60, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 13, color: C.muted }}>No activity yet</Text>
        </View>
      ) : (
        <>
          <CustomHeatmap values={values} />

          {/* Stats row */}
          <View
            style={{
              flexDirection: "row",
              gap: 20,
              marginTop: 12,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: C.border,
            }}
          >
            <View>
              <Text style={{ fontSize: 18, fontWeight: "800", color: C.dark }}>
                {totalTx}
              </Text>
              <Text style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>
                Total transactions
              </Text>
            </View>
            <View>
              <Text
                style={{ fontSize: 18, fontWeight: "800", color: C.primary }}
              >
                {activeDays}
              </Text>
              <Text style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>
                Active days
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
