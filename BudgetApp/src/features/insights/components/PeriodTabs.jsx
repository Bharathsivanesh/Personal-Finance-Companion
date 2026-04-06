import { Text, TouchableOpacity, View } from "react-native";
import C from "../../../constants/colors";

export default function PeriodTabs({ active, onChange }) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: C.primaryMid,
        borderRadius: 20,
        padding: 3,
      }}
    >
      {["Week", "Month", "Year"].map((t) => (
        <TouchableOpacity
          key={t}
          onPress={() => onChange(t)}
          activeOpacity={0.8}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 16,
            backgroundColor: active === t ? C.primary : "transparent",
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: active === t ? C.white : C.muted,
            }}
          >
            {t}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
