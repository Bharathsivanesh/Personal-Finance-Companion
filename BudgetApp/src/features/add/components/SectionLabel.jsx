import { Text, View } from "react-native";

export default function SectionLabel({ text, optional }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
        marginLeft: 2,
        gap: 6,
      }}
    >
      <Text
        style={{
          fontSize: 10,
          fontWeight: "700",
          color: "#9ca3af",
          textTransform: "uppercase",
          letterSpacing: 1.5,
        }}
      >
        {text}
      </Text>
      {optional && (
        <Text style={{ fontSize: 10, color: "#c4b5c8", fontWeight: "500" }}>
          (optional)
        </Text>
      )}
    </View>
  );
}
