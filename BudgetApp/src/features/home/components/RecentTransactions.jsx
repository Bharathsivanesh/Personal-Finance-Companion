import { Text, TouchableOpacity, View } from "react-native";
import TransactionItem from "../../../components/common/TransactionItemCard";
import { Ionicons } from "@expo/vector-icons";

export default function RecentTransactions() {
  return (
    <View style={{ marginHorizontal: 16, marginBottom: 18 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#1a1035" }}>
            Recent Transactions
          </Text>
        </View>
        <TouchableOpacity
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: "#f3eeff",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="arrow-forward" size={14} color="#7c4de8" />
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 18,
          paddingHorizontal: 14,
          shadowColor: "#7c4de8",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.07,
          shadowRadius: 10,
          elevation: 3,
        }}
      >
        <TransactionItem
          icon="cash"
          iconBg="#e8fdf0"
          iconColor="#22c55e"
          title="Salary"
          subtitle="Salary"
          date="03 Apr 26  1:26 AM"
          amount="50.00"
          isIncome={true}
        />
        <TransactionItem
          icon="gift"
          iconBg="#fef3e2"
          iconColor="#f59e0b"
          title="Fun & Holiday Expenses"
          subtitle="Hotel Rent/Food"
          date="03 Apr 26  1:25 AM"
          amount="100.00"
          isIncome={false}
        />
      </View>
    </View>
  );
}