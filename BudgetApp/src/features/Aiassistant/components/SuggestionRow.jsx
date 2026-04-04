import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import QUICK_PROMPTS from "../constants/Quickprompt";
import { Ionicons } from "@expo/vector-icons";
import C from "../../../constants/colors";

export default function SuggestionRow({ onPress }) {
  return (
    <View style={{ marginTop: 8, marginBottom: 4 }}>
      <Text
        style={{
          marginHorizontal: 16,
          marginBottom: 8,
          fontSize: 11,
          fontWeight: "700",
          color: C.faint,
          letterSpacing: 0.4,
        }}
      >
        SUGGESTIONS
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {QUICK_PROMPTS.slice(0, 4).map((c) => (
          <TouchableOpacity
            key={c.label}
            onPress={() => onPress(c.label)}
            activeOpacity={0.78}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: c.bg,
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 9,
              borderWidth: 1,
              borderColor: `${c.color}30`,
            }}
          >
            <Ionicons name={c.icon} size={13} color={c.color} />
            <Text style={{ fontSize: 12, fontWeight: "600", color: c.color }}>
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}