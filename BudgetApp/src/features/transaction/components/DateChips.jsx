import { ScrollView, Text, TouchableOpacity } from "react-native";
import C from "../../../constants/colors";
import { DATE_FILTERS } from "../utils/helpers";

export default function DateChips({ selected, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        gap: 8,
        marginBottom: 14,
      }}
    >
      {DATE_FILTERS.map((opt) => {
        const active = selected === opt;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onSelect(opt)}
            activeOpacity={0.8}
            style={{
              paddingHorizontal: 13,
              paddingVertical: 5,
              borderRadius: 10,
              backgroundColor: active ? C.primaryMid : C.white,
              borderWidth: 1,
              borderColor: active ? C.primaryLight : C.border,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: active ? C.primary : C.faint,
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
