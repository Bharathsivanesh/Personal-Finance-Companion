import React, { useEffect, useState } from "react";
import { View, ScrollView, StatusBar } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import StreakBanner from "../components/StreakBanner";
import Header from "../components/Header";
import BalanceCard from "../components/BalanceCard";
import RecentTransactions from "../components/RecentTransactions";
import AIFloatingButton from "../../../components/ui/AiButton";
import { useRouter } from "expo-router";
import { getHomeDataservice } from "../services/homeService";
import { useToast } from "@/src/components/ui/Toast";
import Loader from "@/src/components/ui/Loader";
import { useTransactionRefresh } from "@/src/context/TransactionContext";
import Toast from "react-native-toast-message";
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { refreshKey } = useTransactionRefresh();
  const { showToast } = useToast();
  useEffect(() => {
    loadData();
  }, [refreshKey]);
  const loadData = async () => {
    try {
      setLoading(true);

      const res = await getHomeDataservice();

      setUserData(res.user);
      setTransactions(res.transactions);

    } catch (e) {
      console.log(e);
      Toast.show({ type: "error", text1: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f3ff" }}>
      <Loader visible={loading} message="Loading data…" />
      <StatusBar barStyle="dark-content" backgroundColor="#f5f3ff" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 10,
          paddingBottom: 20,
        }}
      >
        <StreakBanner />
        <Header userData={userData} />
        <BalanceCard data={userData} />
        <RecentTransactions data={transactions} />
      </ScrollView>
      <AIFloatingButton onPress={() => router.push("/ai")} />
    </View>
  );
}
