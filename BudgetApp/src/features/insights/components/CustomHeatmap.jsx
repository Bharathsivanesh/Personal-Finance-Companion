import { Text, View } from "react-native";
import C from "../../../constants/colors";

export default function CustomHeatmap({ values }) {
  const getColor = (count) => {
    if (!count) return C.primaryMid;
    if (count === 1) return "#c4b5fd";
    if (count === 2) return C.primaryLight;
    if (count === 3) return C.primary;
    return "#4c1d95";
  };

  const cols = [];
  for (let c = 0; c < 13; c++) {
    cols.push(values.slice(c * 7, c * 7 + 7));
  }

  return (
    <View>
      <View style={{ flexDirection: "row", gap: 3 }}>
        {cols.map((col, ci) => (
          <View key={ci} style={{ flexDirection: "column", gap: 3 }}>
            {col.map((item, ri) => (
              <View
                key={ri}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  backgroundColor: getColor(item.count),
                }}
              />
            ))}
          </View>
        ))}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 4,
          marginTop: 10,
        }}
      >
        <Text
          style={{
            fontSize: 10,
            color: C.muted,
            fontWeight: "500",
            marginHorizontal: 2,
          }}
        >
          Less
        </Text>

        {[C.primaryMid, "#c4b5fd", C.primaryLight, C.primary, "#4c1d95"].map(
          (c, i) => (
            <View
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: c,
              }}
            />
          ),
        )}

        <Text
          style={{
            fontSize: 10,
            color: C.muted,
            fontWeight: "500",
            marginHorizontal: 2,
          }}
        >
          More
        </Text>
      </View>
    </View>
  );
}
