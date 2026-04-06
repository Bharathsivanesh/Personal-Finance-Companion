import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View, Animated } from "react-native";
import React, { useRef, useEffect } from "react";
export default function BalanceCard({ data }) {
  const scaleAnim = useRef(new Animated.Value(0.96)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        marginHorizontal: 16,
        marginBottom: 14,
        borderRadius: 22,
        overflow: "hidden",
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }],
        shadowColor: "#7c4de8",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 18,
        elevation: 10,
      }}
    >
      <LinearGradient
        colors={["#8b5cf6", "#7c3aed", "#6d28d9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 20 }}
      >
        {/* Decorative circle */}
        <View
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 130,
            height: 130,
            borderRadius: 65,
            backgroundColor: "rgba(255,255,255,0.07)",
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: -20,
            left: -20,
            width: 90,
            height: 90,
            borderRadius: 45,
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        />

        {/* Month row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="calendar-outline" size={16} color="#e9d5ff" />
            <Text style={{ color: "#e9d5ff", fontSize: 14, fontWeight: "600" }}>
              {new Date().toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>

        {/* Balances row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <View>
            <Text style={{ color: "#c4b5fd", fontSize: 11, marginBottom: 2 }}>
              Current Balance
            </Text>
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800" }}>
              ₹{data?.balance || 0}
            </Text>
          </View>
        </View>

        {/* Income / Expense pills */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          {/* Income */}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: "rgba(255,255,255,0.14)",
              borderRadius: 14,
              padding: 12,
            }}
          >
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="trending-up" size={15} color="#86efac" />
            </View>
            <View>
              <Text style={{ color: "#c4b5fd", fontSize: 10 }}>Income</Text>
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>
                ₹{data?.totalIncome || 0}
              </Text>
            </View>
          </View>

          {/* Expense */}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: "rgba(255,255,255,0.14)",
              borderRadius: 14,
              padding: 12,
            }}
          >
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="trending-down" size={15} color="#fca5a5" />
            </View>
            <View>
              <Text style={{ color: "#c4b5fd", fontSize: 10 }}>Expenses</Text>
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>
                ₹{data?.totalExpense || 0}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}
