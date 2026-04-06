import { Text, TouchableOpacity, View } from "react-native";
import TransactionItem from "../../../components/common/TransactionItemCard";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import C from "@/src/constants/colors";
export default function RecentTransactions({ data }) {
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
          onPress={() => router.replace("/(tabs)/transactions")}
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
        }}
      >
        {data.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 32 }}>
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
              <Ionicons
                name="receipt-outline"
                size={36}
                color={C.primaryLight}
              />
            </View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: C.dark,
                marginBottom: 4,
              }}
            >
              No Transactions Found
            </Text>
            <Text style={{ fontSize: 12, color: "#9ca3af" }}>
              Add your first transaction to get started
            </Text>
          </View>
        ) : (
          data.map((item) => {
            const date = item.createdAt?.toDate();

            return (
              <TransactionItem
                key={item.id}
                icon={item.type === "income" ? "cash" : "card"}
                iconBg={item.type === "income" ? "#e8fdf0" : "#fef3e2"}
                iconColor={item.type === "income" ? "#22c55e" : "#f59e0b"}
                title={item.category || item.type}
                subtitle={item.paymentMode || "Money Transfer"}
                date={date?.toLocaleString()}
                amount={item.amount}
                isIncome={item.type === "income"}
                type={item.type}
              />
            );
          })
        )}
      </View>
    </View>
  );
}
