/**
 * SignUpScreen.jsx
 * Smart Finance — Sign Up screen with animated entrance, validation & violet theme.
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
import PasswordStrength from "../components/PasswordStrength";

function useEntranceAnim(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(28)).current;
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
        speed: 13,
        bounciness: 5,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  return { opacity, transform: [{ translateY }] };
}


function AnimatedButton({ onPress, children, loading }) {
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
    <Animated.View style={{ transform: [{ scale }] }}>
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
          style={{
            color: C.white,
            fontSize: 16,
            fontWeight: "700",
            letterSpacing: 0.3,
          }}
        >
          {loading ? "Creating account…" : "Sign Up"}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}



export default function SignUpScreen({ navigation }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Staggered entrance
  const heading = useEntranceAnim(0);
  const fields1 = useEntranceAnim(80);
  const fields2 = useEntranceAnim(160);
  const fields3 = useEntranceAnim(240);
  const cta = useEntranceAnim(310);

  const update = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.phone.trim()) e.phone = "Mobile number is required";
    else if (!/^\+?[\d\s-]{8,}$/.test(form.phone))
      e.phone = "Enter a valid phone number";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm password";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    if (!agreed) e.terms = "Please accept the terms to continue";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignUp = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // navigation.replace("Main");
    }, 1600);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Decorative blobs */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: -60,
          left: -100,
          width: 220,
          height: 220,
          borderRadius: 110,
          backgroundColor: "#8b5cf6",
          opacity: 0.55,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: -40,
          right: -60,
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: "#8b5cf6",
          opacity: 0.4,
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: Platform.OS === "android" ? 24 : 12,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginTop: 35 }}>
            {/* Heading */}
            <Animated.View style={[{ marginBottom: 28 }, heading]}>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "800",
                  color: C.dark,
                  letterSpacing: -0.8,
                  marginBottom: 6,
                  textAlign: "center",
                }}
              >
                Create Account ✨
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: C.muted,
                  fontWeight: "400",
                  lineHeight: 22,
                  textAlign: "center",
                }}
              >
                Start managing your finances today
              </Text>
            </Animated.View>

            {/* Row 1 — Name & Phone */}
            <Animated.View style={fields1}>
              <InputField
                type="text"
                label="Full Name"
                value={form.fullName}
                onChangeText={(v) => update("fullName", v)}
                error={errors.fullName}
                returnKeyType="next"
              />
              <InputField
                type="phone"
                label="Mobile Number"
                value={form.phone}
                onChangeText={(v) => update("phone", v)}
                error={errors.phone}
                returnKeyType="next"
              />
            </Animated.View>

            {/* Row 2 — Email */}
            <Animated.View style={fields2}>
              <InputField
                type="email"
                label="Email Address"
                value={form.email}
                onChangeText={(v) => update("email", v)}
                error={errors.email}
                returnKeyType="next"
              />
            </Animated.View>

            {/* Row 3 — Passwords */}
            <Animated.View style={fields3}>
              <InputField
                type="password"
                label="Password"
                value={form.password}
                onChangeText={(v) => update("password", v)}
                error={errors.password}
                returnKeyType="next"
              />
              <PasswordStrength password={form.password} />
            </Animated.View>

            {/* Terms */}
            <Animated.View style={[cta]}>
              {errors.terms ? (
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: C.red,
                    marginLeft: 4,
                    marginBottom: 14,
                  }}
                >
                  ⚠ {errors.terms}
                </Text>
              ) : null}

              {/* CTA */}
              <AnimatedButton onPress={handleSignUp} loading={loading} />

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

              {/* Google */}
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
                  Sign up with Google
                </Text>
              </TouchableOpacity>

              {/* Footer link */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 28,
                }}
              >
                <Text
                  style={{ fontSize: 14, color: C.muted, fontWeight: "400" }}
                >
                  Already have an account?{" "}
                </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: C.primary,
                    }}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
