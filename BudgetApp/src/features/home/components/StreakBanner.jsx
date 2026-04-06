import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
export default function StreakBanner() {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1.2,
        borderColor: "#e0d7f8",
        borderRadius: 30,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginBottom: 14,
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: "600", color: "#4b3fa0" }}>
        🔥 1 Days of Empowering Financial Growth
      </Text>
    </View>
  );
}
