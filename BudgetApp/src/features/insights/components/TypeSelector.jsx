import { Text, TouchableOpacity, View } from "react-native";
import C from "../../../constants/colors";

export default function TypeSelector({ active, onChange }) {
  return (
    <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
      {[
        { type: "Income", color: C.green, bg: C.greenBg, icon: "↑" },
        { type: "Expense", color: C.red, bg: C.redBg, icon: "↓" },
      ].map(({ type, color, bg, icon }) => (
        <TouchableOpacity
          key={type}
          onPress={() => onChange(type)}
          activeOpacity={0.8}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 14,
            alignItems: "center",
            backgroundColor: active === type ? color : bg,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: active === type ? C.white : color,
            }}
          >
            {icon} {type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
