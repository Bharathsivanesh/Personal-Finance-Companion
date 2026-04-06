import { View, Text } from "react-native";
import C from "@/src/constants/colors";
export default function PasswordStrength({ password }) {
  const score = !password
    ? 0
    : [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) =>
        r.test(password),
      ).length;

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = [C.faint, C.red, "#f59e0b", C.primaryLight, C.green];

  if (!password) return null;

  return (
    <View style={{ marginTop: -10, marginBottom: 14, paddingHorizontal: 2 }}>
      <View style={{ flexDirection: "row", gap: 5, marginBottom: 5 }}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 4,
              backgroundColor: i <= score ? colors[score] : C.border,
            }}
          />
        ))}
      </View>
      <Text
        style={{
          fontSize: 11,
          fontWeight: "600",
          color: colors[score],
          textAlign: "right",
        }}
      >
        {labels[score]}
      </Text>
    </View>
  );
}
