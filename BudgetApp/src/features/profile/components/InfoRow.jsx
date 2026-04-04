
import {  Text, View } from "react-native";
import C from "../../../constants/colors";
export default function InfoRow({ icon, label, value }) {
  return (
    <View
      style={{
        backgroundColor: C.white,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: C.border,
        shadowColor: C.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
      }}
    >
      <Text
        style={{
          fontSize: 10,
          fontWeight: "700",
          color: C.faint,
          letterSpacing: 1.1,
          marginBottom: 4,
        }}
      >
        {label.toUpperCase()}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 15, marginRight: 8 }}>{icon}</Text>
        <Text
          style={{ fontSize: 15, fontWeight: "600", color: C.dark, flex: 1 }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
