/**
 * LoginScreen.jsx
 * Smart Finance — Login screen with animated entrance & violet theme.
 * Adjust import paths to match your project structure.
 */
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import C from "@/src/constants/colors";
import InputField from "@/src/components/common/Inputfield";
import { router } from "expo-router";


function useEntranceAnim(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 520,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        speed: 14,
        bounciness: 5,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  return { opacity, transform: [{ translateY }] };
}

// ── Button with press animation ───────────────────────────────────────────────
function AnimatedButton({ onPress, children, style, textStyle }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
    }).start();
  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
    }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={pressIn}
        onPressOut={pressOut}
        onPress={onPress}
        style={{
          backgroundColor: C.primary,
          borderRadius: 16,
          paddingVertical: 17,
          alignItems: "center",
          shadowColor: C.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <Text
          style={[
            {
              color: C.white,
              fontSize: 16,
              fontWeight: "700",
              letterSpacing: 0.3,
            },
            textStyle,
          ]}
        >
          {children}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Staggered entrance
  const logo = useEntranceAnim(0);
  const heading = useEntranceAnim(80);
  const form = useEntranceAnim(160);
  const footer = useEntranceAnim(240);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email or phone is required";
    else if (!/\S+@\S+\.\S+/.test(email) && !/^\+?[\d\s-]{8,}$/.test(email))
      e.email = "Enter a valid email or phone";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "At least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = () => {
    // if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/(tabs)"); // uncomment when wired up
    }, 1500);
  };

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={{ flex: 1, backgroundColor: C.bg }}
    >
      {/* Decorative background blob */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 260,
          height: 260,
          borderRadius: 130,
          backgroundColor: "#8b5cf6",
          opacity: 0.6,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: 40,
          left: -60,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: "#8b5cf6",
          opacity: 0.6,
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center", // ✅ THIS centers vertically
            paddingHorizontal: 24,
            paddingTop: Platform.OS === "android" ? 24 : 12,

            paddingVertical: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Heading */}
          <View style={{ marginTop: 120 }}>
            <Animated.View style={[{ marginBottom: 32 }, heading]}>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "800",
                  color: C.dark,
                  letterSpacing: -0.8,
                  marginBottom: 6,
                }}
              >
                Welcome Back 👋
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: C.muted,
                  fontWeight: "400",
                  lineHeight: 22,
                }}
              >
                Sign in to manage your financial assets
              </Text>
            </Animated.View>

            {/* Form */}
            <Animated.View style={form}>
              <InputField
                type="email"
                label="Email or Phone Number"
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  if (errors.email) setErrors((e) => ({ ...e, email: null }));
                }}
                error={errors.email}
                returnKeyType="next"
              />

              <InputField
                type="password"
                label="Password"
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  if (errors.password)
                    setErrors((e) => ({ ...e, password: null }));
                }}
                error={errors.password}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />

              {/* Forgot password */}
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  marginTop: -6,
                  marginBottom: 24,
                }}
                onPress={() => navigation?.navigate("ForgotPassword")}
              >
                <Text
                  style={{ color: C.primary, fontSize: 13, fontWeight: "600" }}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Login CTA */}
              <AnimatedButton onPress={handleLogin}>
                {loading ? "Signing in…" : "Login  →"}
              </AnimatedButton>

              {/* Divider */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 22,
                }}
              >
                <View
                  style={{ flex: 1, height: 1, backgroundColor: C.border }}
                />
                <Text
                  style={{
                    marginHorizontal: 14,
                    fontSize: 13,
                    color: C.faint,
                    fontWeight: "500",
                  }}
                >
                  or
                </Text>
                <View
                  style={{ flex: 1, height: 1, backgroundColor: C.border }}
                />
              </View>

              {/* Google button */}
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 16,
                  borderWidth: 1.5,
                  borderColor: C.border,
                  paddingVertical: 15,
                  backgroundColor: C.white,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <Image
                  source={require("@/assets/images/googleicon.png")}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: C.dark,
                    letterSpacing: 0.2,
                  }}
                >
                  Continue with Google
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Footer */}
            <Animated.View
              style={[
                {
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 32,
                },
                footer,
              ]}
            >
              <Text style={{ fontSize: 14, color: C.muted, fontWeight: "400" }}>
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: C.primary,
                  }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
