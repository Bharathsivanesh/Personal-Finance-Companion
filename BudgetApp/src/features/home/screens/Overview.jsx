import React from "react";
import {
  View,
  ScrollView,
  StatusBar,

} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import StreakBanner from "../components/StreakBanner";
import Header from "../components/Header";
import BalanceCard from "../components/BalanceCard";
import RecentTransactions from "../components/RecentTransactions";
import AIFloatingButton from "../../../components/ui/AiButton";
import { useRouter } from "expo-router";
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f3ff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f3ff" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 10,
          paddingBottom: 20,
        }}
      >
        <StreakBanner />
        <Header />
        <BalanceCard />
        <RecentTransactions />
      </ScrollView>
      <AIFloatingButton onPress={() => router.push("/ai")} />
    </View>
  );
}
