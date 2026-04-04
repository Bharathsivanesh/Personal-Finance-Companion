import { Text, View } from "react-native";
import DonutChart from "./DonutChart";
import C from "../../../constants/colors";

export default function SpendingBreakdown({ data, total, type }) {
  const topItem = data.reduce((a, b) => (a.pct > b.pct ? a : b));

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
        <Text style={{ fontSize: 15, fontWeight: "700", color: C.dark }}>
          {type === "Income" ? "Income Breakdown" : "Spending Breakdown"}
        </Text>

        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
            backgroundColor: C.primaryPale,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: "700", color: C.primary }}>
            {topItem.label} highest
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          marginBottom: 14,
        }}
      >
        <DonutChart data={data} total={total} />

        <View style={{ flex: 1, gap: 10 }}>
          {data.map((item) => (
            <View
              key={item.label}
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: item.color,
                }}
              />

              <Text
                style={{
                  flex: 1,
                  fontSize: 13,
                  color: C.dark,
                  fontWeight: "500",
                }}
              >
                {item.label}
              </Text>

              <Text
                style={{ fontSize: 14, fontWeight: "700", color: item.color }}
              >
                {item.pct}%
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          height: 8,
          borderRadius: 6,
          overflow: "hidden",
          gap: 2,
        }}
      >
        {data.map((item) => (
          <View
            key={item.label}
            style={{
              flex: item.pct,
              borderRadius: 6,
              height: "100%",
              backgroundColor: item.color,
            }}
          />
        ))}
      </View>
    </View>
  );
}
