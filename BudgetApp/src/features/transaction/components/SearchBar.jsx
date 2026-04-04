import { Ionicons } from "@expo/vector-icons";
import { TextInput, TouchableOpacity, View } from "react-native";
import C from "../../../constants/colors";
// ─── Search Bar ───────────────────────────────────────────────────────────────
export default function SearchBar({ value, onChange }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: C.white,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 11,
        shadowColor: C.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Ionicons
        name="search"
        size={17}
        color={C.muted}
        style={{ marginRight: 8 }}
      />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search transactions…"
        placeholderTextColor={C.faint}
        style={{ flex: 1, fontSize: 14, color: C.dark }}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChange("")}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close-circle" size={17} color={C.faint} />
        </TouchableOpacity>
      )}
    </View>
  );
}
