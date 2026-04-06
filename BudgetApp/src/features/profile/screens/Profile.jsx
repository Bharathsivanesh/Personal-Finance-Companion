/**
 * ProfileScreen.jsx
 * Smart Finance — Modern profile screen with animated header,
 * editable fields, and an "About App" bottom sheet modal.
 *
 * Dependencies: react-native, react-native-safe-area-context
 * Adjust C import path to match your project.
 */
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Modal,
  Linking,
  Platform,
  Dimensions,
  Image,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import C from "@/src/constants/colors";
import AboutAppModal from "../components/AboutAppModal";
import TapRow from "../components/TapRow";
import InfoRow from "../components/InfoRow";
import AvatarInitials from "../components/AvatarInitials";
import EditProfileModal from "../components/EditProfileModal";
import {
  getUserProfile,
  logoutService,
  updateUserProfile,
} from "../services/userService";
import { useToast } from "@/src/components/ui/Toast";
import Loader from "@/src/components/ui/Loader";
import { useTransactionRefresh } from "@/src/context/TransactionContext";
import Toast from "react-native-toast-message";

function useEntrance(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(20)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 480,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(ty, {
        toValue: 0,
        speed: 14,
        bounciness: 4,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  return { opacity, transform: [{ translateY: ty }] };
}

export default function ProfileScreen() {
  const [aboutVisible, setAboutVisible] = useState(false);

  const headerAnim = useEntrance(0);
  const section1 = useEntrance(80);
  const section2 = useEntrance(160);
  const section3 = useEntrance(240);
  const [userData, setUserData] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const { triggerRefresh } = useTransactionRefresh();
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const data = await getUserProfile();

      if (data) {
        setUserData(data);
      } else {
        Toast.show({ type: "info", text1: "No profile data found" });
      }
    } catch (error) {
      console.log(error);

      Toast.show({ type: "error", text1: "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const USER = {
    name: userData?.fullName || "User",
    email: userData?.email || "",
    phone: userData?.phone || "",
    plan: "Trial",
  };

  const handleSave = async (updatedData) => {
    try {
      setLoading(true);

      const success = await updateUserProfile(updatedData);

      if (success) {
        Toast.show({ type: "success", text1: "Profile updated successfully" });

        setEditVisible(false);

        await loadProfile(); // refresh latest data
        triggerRefresh();
      } else {
        Toast.show({ type: "error", text1: "Failed to update profile" });
      }
    } catch (error) {
      console.log(error);

      Toast.show({ type: "error", text1: "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    try {
      await logoutService();

      router.replace("/(auth)/login"); // 🔥 reset navigation
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: C.bg }}
    >
      <Loader visible={loading} />
      {/* ── Violet gradient header ── */}
      <Animated.View style={headerAnim}>
        <View
          style={{
            backgroundColor: C.primary,
            paddingTop: 20,
            paddingBottom: 52,
            paddingHorizontal: 24,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 160,
              height: 160,
              borderRadius: 80,
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          />
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              bottom: -20,
              left: -30,
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: "800",
                color: C.white,
                letterSpacing: -0.4,
              }}
            >
              Profile
            </Text>
            {/* Log out */}
            <TouchableOpacity
              onPress={handleLogout}
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 7,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: C.white }}>
                Log Out
              </Text>
            </TouchableOpacity>
          </View>

          {/* Avatar + name row */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.25,
                shadowRadius: 14,
                elevation: 10,
              }}
            >
              <AvatarInitials name={USER.name} size={72} />
            </View>
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "800",
                  color: C.white,
                  letterSpacing: -0.4,
                  marginBottom: 3,
                }}
              >
                {USER.name}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.75)",
                  marginBottom: 8,
                }}
              >
                {USER.email}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        style={{ flex: 1, marginTop: -24 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── About Me ── */}
        <Animated.View style={section1}>
          <View
            style={{
              backgroundColor: C.white,
              borderRadius: 20,
              padding: 18,
              marginBottom: 16,
              shadowColor: C.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 14,
              elevation: 3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: C.primaryPale,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <Text style={{ fontSize: 16 }}>👤</Text>
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: C.dark,
                  letterSpacing: -0.3,
                }}
              >
                About Me
              </Text>
            </View>

            <InfoRow icon="✏️" label="Full Name" value={USER.name} />
            <InfoRow icon="✉️" label="Email Address" value={USER.email} />
            <InfoRow icon="📱" label="Phone Number" value={USER.phone} />

            {/* Edit profile button */}
            <TouchableOpacity
              onPress={() => setEditVisible(true)}
              style={{
                marginTop: 4,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: C.primary,
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: C.primary,
                  fontWeight: "700",
                  fontSize: 14,
                }}
              >
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ── About App ── */}
        <Animated.View style={section3}>
          <View
            style={{
              backgroundColor: C.white,
              borderRadius: 20,
              padding: 18,
              marginBottom: 16,
              shadowColor: C.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 14,
              elevation: 3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: C.primaryPale,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <Text style={{ fontSize: 16 }}>ℹ️</Text>
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: C.dark,
                  letterSpacing: -0.3,
                }}
              >
                About App
              </Text>
            </View>

            {/* Tap to open modal */}
            <TapRow
              icon="💜"
              label="About Smart Finance"
              onPress={() => setAboutVisible(true)}
            />
            <TapRow icon="🔖" label="App Version" value="1.0.0" />
          </View>
        </Animated.View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* About App bottom sheet */}
      <AboutAppModal
        visible={aboutVisible}
        onClose={() => setAboutVisible(false)}
      />

      <EditProfileModal
        visible={editVisible}
        user={userData}
        onClose={() => setEditVisible(false)}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}
