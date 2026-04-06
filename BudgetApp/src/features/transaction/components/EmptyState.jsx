import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import C from "../../../constants/colors";
export default function EmptyState({ typeFilter="" }) {
  const msgs = {
    Income: ["No income found", "Try a different date range or search term."],
    Expense: [
      "No expenses found",
      "Try a different date range or search term.",
    ],
    Transfer: ["No transfers found", "Add a transfer to see it here."],
    All: ["No transactions found", "Try adjusting your search or filters."],
  };
  const [title, sub] = msgs[typeFilter] ?? msgs.All;
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 5,
        paddingBottom: 60,
      }}
    >
      <View
        style={{
          width: 76,
          height: 76,
          borderRadius: 38,
          backgroundColor: C.primaryPale,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
        }}
      >
        <Ionicons name="receipt-outline" size={36} color={C.primaryLight} />
      </View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: C.dark,
          marginBottom: 6,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: C.faint,
          textAlign: "center",
          paddingHorizontal: 40,
        }}
      >
        {sub}
      </Text>
    </View>
  );
}
