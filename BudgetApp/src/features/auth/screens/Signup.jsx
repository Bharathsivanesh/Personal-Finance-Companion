// src/features/auth/screens/SignUpScreen.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import C from "@/src/constants/colors";
import InputField from "@/src/components/common/Inputfield";
import { router } from "expo-router";
import PasswordStrength from "../components/PasswordStrength";
import { signupservice } from "@/src/services/firebase/authService";
import { useToast } from "@/src/components/ui/Toast";
import Loader from "@/src/components/ui/Loader";
import Toast from "react-native-toast-message";

// ✅ Fast entrance — content visible almost immediately
function useEntranceAnim(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current; // reduced from 28

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280, // reduced from 520
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        speed: 22, // faster
        bounciness: 2, // less bounce
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return { opacity, transform: [{ translateY }] };
}

function AnimatedButton({ onPress, loading }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.97,
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
        disabled={loading}
        style={{
          backgroundColor: loading ? "#a78bfa" : C.primary,
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
  const { showToast } = useToast();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Tighter delays — all content visible within 150ms
  const heading = useEntranceAnim(0);
  const fields1 = useEntranceAnim(50);
  const fields2 = useEntranceAnim(100);
  const fields3 = useEntranceAnim(150);

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
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      await signupservice(form);

      Toast.show({ type: "success", text1: "Account created successfully!" });
      setTimeout(() => router.replace("/(tabs)"), 400);
    } catch (error) {
      console.log(error);
      const errorMessages = {
        "auth/email-already-in-use": {
          message: "Email already in use",
          description: "Try logging in instead",
        },
        "auth/invalid-email": {
          message: "Invalid email",
          description: "Please enter a valid email",
        },
        "auth/weak-password": {
          message: "Weak password",
          description: "Use at least 6 characters",
        },
      };
      const mapped = errorMessages[error.code] ?? {
        message: "Something went wrong",
        description: "",
      };
      Toast.show({
        type: "error",
        text1: mapped.message || "Failed to sign up",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <Loader visible={loading} message="Creating account…" />

      {/* Blobs */}
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
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingTop: Platform.OS === "android" ? 24 : 12,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginTop: 24 }}>
            {/* Heading */}
            <Animated.View style={[{ marginBottom: 24 }, heading]}>
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

            {/* Name + Phone */}
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

            {/* Email */}
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

            {/* Password */}
            <Animated.View style={fields3}>
              <InputField
                type="password"
                label="Password"
                value={form.password}
                onChangeText={(v) => update("password", v)}
                error={errors.password}
                returnKeyType="done"
                onSubmitEditing={handleSignUp}
              />
              <PasswordStrength password={form.password} />

              {/* CTA */}
              <View style={{ marginTop: 8 }}>
                <AnimatedButton onPress={handleSignUp} loading={loading} />
              </View>

              {/* Footer */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 24,
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
