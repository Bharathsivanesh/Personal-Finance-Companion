import { Text, View } from "react-native";
import C from "../../../constants/colors";

export default function GoalCard({ data, type }) {
  const pct = Math.min((data.saved / data.goal) * 100, 100);
  const accent = type === "Income" ? C.green : C.primary;

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
            {data.label}
          </Text>
          <Text style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
            ₹{data.saved.toLocaleString("en-IN")} of ₹
            {data.goal.toLocaleString("en-IN")}
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
            {Math.round(pct)}%
          </Text>
        </View>
      </View>

      <View
        style={{
          height: 10,
          backgroundColor: C.primaryMid,
          borderRadius: 8,
          marginTop: 4,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            borderRadius: 8,
            backgroundColor: accent,
            width: `${pct}%`,
          }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 6,
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: "700", color: accent }}>
          ₹{data.saved.toLocaleString("en-IN")} saved
        </Text>
        <Text style={{ fontSize: 12, color: C.muted, fontWeight: "500" }}>
          Goal ₹{data.goal.toLocaleString("en-IN")}
        </Text>
      </View>
    </View>
  );
}
