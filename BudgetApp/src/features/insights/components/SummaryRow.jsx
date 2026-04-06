import { Text, View } from "react-native";
import C from "../../../constants/colors";

export default function SummaryRow({ data, type }) {
  const accent = type === "Income" ? C.green : C.red;

  const cardBase = {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 14,
    justifyContent: "center",
    shadowColor: C.primary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  };

  return (
    <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
      <View
        style={{
          ...cardBase,
          flex: 1.4,
          borderLeftWidth: 3,
          borderLeftColor: accent,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            color: C.muted,
            fontWeight: "500",
            marginTop: 3,
          }}
        >
          Total
        </Text>

        <Text
          style={{
            fontSize: 26,
            fontWeight: "800",
            letterSpacing: -1,
            marginTop: 2,
            color: accent,
          }}
        >
          {data.total}
        </Text>
      </View>

      <View style={{ ...cardBase, flex: 1 }}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "800",
            letterSpacing: -0.5,
            color: C.primary,
          }}
        >
          {data.sub}
        </Text>

        <Text
          style={{
            fontSize: 11,
            color: C.muted,
            fontWeight: "500",
            marginTop: 3,
          }}
        >
          {data.subLabel}
        </Text>
      </View>

      {/* <View style={{ ...cardBase, flex: 1 }}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "800",
            letterSpacing: -0.5,
            color: C.primary,
          }}
        >
          {data.avg}
        </Text>

        <Text
          style={{
            fontSize: 11,
            color: C.muted,
            fontWeight: "500",
            marginTop: 3,
          }}
        >
          {data.avgLabel}
        </Text>
      </View> */}
    </View>
  );
}
