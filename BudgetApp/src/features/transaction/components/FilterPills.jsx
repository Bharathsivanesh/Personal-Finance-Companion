import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import C from "../../../constants/colors";
// ─── Type Filter Pills ────────────────────────────────────────────────────────
const PILL_META = {
  All: { icon: "apps-outline", color: C.primary },
  Income: { icon: "trending-up", color: C.green },
  Expense: { icon: "trending-down", color: C.red },
  Transfer: { icon: "swap-horizontal", color: C.blue },
};

export default function FilterPills({ options, selected, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        gap: 8,
        marginBottom: 10,
      }}
    >
      {options.map((opt) => {
        const active = selected === opt;
        const meta = PILL_META[opt] ?? { icon: "ellipse", color: C.primary };
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onSelect(opt)}
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: active ? meta.color : C.white,
              borderWidth: 1,
              borderColor: active ? meta.color : C.border,
              shadowColor: active ? meta.color : "transparent",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: active ? 0.28 : 0,
              shadowRadius: 6,
              elevation: active ? 4 : 0,
            }}
          >
            <Ionicons
              name={meta.icon}
              size={12}
              color={active ? "#fff" : C.muted}
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: active ? "#fff" : C.muted,
              }}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
