// import { View, Text } from "react-native";
// import "../../global.css";
// export default function HomeScreen() {
//   return (
//     <View className="flex-1 items-center justify-center bg-white">
//       <Text className="text-2xl font-bold text-black ">Hello NativeWind!</Text>
//     </View>
//   );
// }
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StreakBanner from "../components/StreakBanner";
import Header from "../components/Header";
import BalanceCard from "../components/BalanceCard";
import RecentTransactions from "../components/RecentTransactions";
export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f3ff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f3ff" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: 20 }}
      >
        <StreakBanner />
        <Header />
        <BalanceCard />
        <RecentTransactions />
      </ScrollView>
    </View>
  );
}