import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

export default function Header({ userData }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginBottom: 14,
      }}
    >
      {/* Logo + greeting */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <LinearGradient
          colors={["#9b72f2", "#7c4de8"]}
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="wallet" size={18} color="#fff" />
        </LinearGradient>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#1a1035" }}>
          Hi, {userData?.fullName || "User"} 👋👋
        </Text>
      </View>

      {/* Right pills */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {/* Leaf icon */}
      </View>
    </View>
  );
}
