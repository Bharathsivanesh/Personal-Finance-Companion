import { Text, View } from "react-native";
import C from "../../../constants/colors";
export default function AvatarInitials({ name, size = 80 }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: C.primaryMid,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: C.white,
      }}
    >
      <Text
        style={{
          fontSize: size * 0.34,
          fontWeight: "800",
          color: C.primary,
          letterSpacing: -0.5,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}
