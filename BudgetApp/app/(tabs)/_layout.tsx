
import { useState } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddTransactionModal from "@/src/features/add/screens/AddTransactionModal";

function AddButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="self-center -top-[22px]"
      style={{ elevation: 12 }}
    >
      <View className="w-[60px] h-[60px] rounded-full bg-white items-center justify-center">
        <LinearGradient
          colors={["#a78bfa", "#7c3aed"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-[50px] h-[50px] items-center justify-center"
          style={{ borderRadius: 999 }}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

function TabIcon({ name, outlineName, focused }: any) {
  return (
    <Ionicons name={focused ? name : outlineName} size={22} color="#ffffff" />
  );
}

function TabBarBackground() {
  return (
    <View
      style={{
        flex: 1,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: "hidden",
      }}
    >
      <LinearGradient
        colors={["#8b5cf6", "#7c3aed", "#6d28d9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      />
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            marginTop: 2,
            color: "#ffffff",
          },
          tabBarStyle: {
            position: "absolute",
            height: 65 + insets.bottom,
            paddingBottom: insets.bottom + 6,
            paddingTop: 10,
            borderTopWidth: 0,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            elevation: 10,
            backgroundColor: "transparent",
          },
          tabBarBackground: () => <TabBarBackground />,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name="home"
                outlineName="home-outline"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: "History",
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name="wallet"
                outlineName="wallet-outline"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: "",
            tabBarIcon: () => null,
            tabBarButton: () => (
              <AddButton onPress={() => setModalVisible(true)} />
            ),
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: "Insights",
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name="document-text"
                outlineName="document-text-outline"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Account",
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name="person"
                outlineName="person-outline"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen name="ai" options={{ href: null }} />
      </Tabs>

      <AddTransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}
