// src/features/auth/screens/LoginScreen.jsx
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
import { loginservice } from "@/src/services/firebase/authService";
import Loader from "@/src/components/ui/Loader";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/src/services/firebase/Config";
import { createUserModel } from "@/src/models/userModel";
import Toast from "react-native-toast-message";

// ✅ Centralized validators
import { validateLoginForm, hasErrors } from "@/src/utils/validators";

WebBrowser.maybeCompleteAuthSession();

function useEntranceAnim(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        speed: 20,
        bounciness: 3,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  return { opacity, transform: [{ translateY }] };
}

function AnimatedButton({ onPress, children, disabled }) {
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
        disabled={disabled}
        style={{
          backgroundColor: disabled ? "#a78bfa" : C.primary,
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
          {children}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const heading = useEntranceAnim(0);
  const form = useEntranceAnim(60);
  const footer = useEntranceAnim(120);

  // ── Google auth ─────────────────────────────────────────────────────────────
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "",
  });

  useEffect(() => {
    if (response?.type === "success") handleGoogleResponse(response);
  }, [response]);

  const handleGoogleResponse = async (response) => {
    try {
      setLoading(true);
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      const userCred = await signInWithCredential(auth, credential);
      const user = userCred.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(
          userRef,
          createUserModel({
            fullName: user.displayName || "User",
            email: user.email,
            phone: user.phoneNumber || "",
            provider: "google",
          }),
        );
      }
      Toast.show({ type: "success", text1: "Signed in with Google" });
      router.replace("/(tabs)");
    } catch (error) {
      console.log(error);
      Toast.show({ type: "error", text1: "Google login failed" });
    } finally {
      setLoading(false);
    }
  };

  // ── Email login ─────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    // ✅ Use centralized validator
    const validationErrors = validateLoginForm({ email, password });
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await loginservice(email, password);
      Toast.show({ type: "success", text1: "Logged in successfully" });
      setTimeout(() => router.replace("/(tabs)"), 400);
    } catch (error) {
      console.log(error);
      // Map Firebase error codes to friendly messages
      const firebaseErrors = {
        "auth/user-not-found": "No account found with this email",
        "auth/wrong-password": "Incorrect password",
        "auth/invalid-email": "Invalid email address",
        "auth/too-many-requests": "Too many attempts. Try again later",
        "auth/invalid-credential": "Invalid email or password",
      };
      Toast.show({
        type: "error",
        text1:
          firebaseErrors[error.code] ?? error.message ?? "Failed to log in",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={{ flex: 1, backgroundColor: C.bg }}
    >
      <Loader visible={loading} message="Signing in…" />

      {/* Blobs */}
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
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: 24,
            paddingTop: Platform.OS === "android" ? 24 : 12,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginTop: 80 }}>
            {/* Heading */}
            <Animated.View style={[{ marginBottom: 28 }, heading]}>
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
                label="Email"
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

              <AnimatedButton onPress={handleLogin} disabled={loading}>
                {loading ? "Signing in…" : "Login  →"}
              </AnimatedButton>

              {/* Divider */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 20,
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
                onPress={() => promptAsync({ useProxy: true })}
                disabled={!request || loading}
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
                  opacity: !request || loading ? 0.6 : 1,
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
                  marginTop: 28,
                },
                footer,
              ]}
            >
              <Text style={{ fontSize: 14, color: C.muted, fontWeight: "400" }}>
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                <Text
                  style={{ fontSize: 14, fontWeight: "700", color: C.primary }}
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
