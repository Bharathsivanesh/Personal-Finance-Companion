import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import C from "../../../constants/colors";
export default function SummaryCard({ transactions }) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + parseFloat(t.amount), 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + parseFloat(t.amount), 0);
  const transfer = transactions
    .filter((t) => t.type === "transfer")
    .reduce((s, t) => s + parseFloat(t.amount), 0);
  const net = income - expense;
  const fmt = (n) =>
    "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2 });

  return (
    <LinearGradient
      colors={["#8b5cf6", "#7c3aed", "#6d28d9"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        marginHorizontal: 16,
        borderRadius: 22,
        padding: 18,
        marginBottom: 16,
        shadowColor: C.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.28,
        shadowRadius: 18,
        elevation: 10,
        overflow: "hidden",
      }}
    >
      {/* Blobs */}
      <View
        style={{
          position: "absolute",
          top: -35,
          right: -35,
          width: 130,
          height: 130,
          borderRadius: 65,
          backgroundColor: "rgba(255,255,255,0.07)",
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: -25,
          left: -25,
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: "rgba(255,255,255,0.05)",
        }}
      />

      {/* Top row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <Text style={{ color: "#c4b5fd", fontSize: 12, fontWeight: "600" }}>
          Summary · {transactions.length} transaction
          {transactions.length !== 1 ? "s" : ""}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: "rgba(255,255,255,0.14)",
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <Ionicons name="stats-chart" size={11} color="#e9d5ff" />
          <Text style={{ color: "#e9d5ff", fontSize: 11, fontWeight: "600" }}>
            Overview
          </Text>
        </View>
      </View>

      {/* Net balance */}
      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.14)",
          borderRadius: 16,
          padding: 14,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: "#c4b5fd", fontSize: 11, marginBottom: 4 }}>
          Net Balance
        </Text>
        <Text
          style={{
            color: "#fff",
            fontSize: 26,
            fontWeight: "800",
            letterSpacing: -0.5,
          }}
        >
          {net >= 0 ? "+" : ""}
          {fmt(Math.abs(net))}
        </Text>
      </View>

      {/* Three stat pills */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(255,255,255,0.10)",
            borderRadius: 14,
            padding: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              marginBottom: 6,
            }}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: "rgba(134,239,172,0.25)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="trending-up" size={10} color="#86efac" />
            </View>
            <Text style={{ color: "#86efac", fontSize: 9, fontWeight: "700" }}>
              INCOME
            </Text>
          </View>
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>
            {fmt(income)}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(255,255,255,0.10)",
            borderRadius: 14,
            padding: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              marginBottom: 6,
            }}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: "rgba(252,165,165,0.25)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="trending-down" size={10} color="#fca5a5" />
            </View>
            <Text style={{ color: "#fca5a5", fontSize: 9, fontWeight: "700" }}>
              EXPENSE
            </Text>
          </View>
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>
            {fmt(expense)}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(255,255,255,0.10)",
            borderRadius: 14,
            padding: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              marginBottom: 6,
            }}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: "rgba(147,197,253,0.25)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="swap-horizontal" size={10} color="#93c5fd" />
            </View>
            <Text style={{ color: "#93c5fd", fontSize: 9, fontWeight: "700" }}>
              TRANSFER
            </Text>
          </View>
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>
            {fmt(transfer)}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
