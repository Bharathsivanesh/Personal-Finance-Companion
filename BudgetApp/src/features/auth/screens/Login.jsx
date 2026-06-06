// src/features/auth/screens/LoginScreen.jsx

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

// ─── Firebase ────────────────────────────────────────────────────────────────
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/src/services/firebase/Config";

// ─── Google Sign-In (Native) ─────────────────────────────────────────────────
// Install: npx expo install @react-native-google-signin/google-signin
// Requires rebuild after install
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import Loader from "@/src/components/ui/Loader";

// Configure Google Sign-In — call once at module level
// webClientId = Web OAuth client ID from GCD (not Android client ID);
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  offlineAccess: false,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const FIREBASE_ERRORS = {
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
  "auth/invalid-credential": "Invalid email or password.",
  "auth/network-request-failed": "Network error. Check your connection.",
};

async function saveNewGoogleUser(user) {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      fullName: user.displayName || "User",
      email: user.email,
      photo: user.photoURL || null,
      phone: user.phoneNumber || "",
      provider: "google",
      createdAt: serverTimestamp(),
    });
  }
}

// ─── Entrance animation hook ──────────────────────────────────────────────────
function useEntranceAnim(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        speed: 18,
        bounciness: 4,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return { opacity, transform: [{ translateY }] };
}

// ─── Animated primary button ──────────────────────────────────────────────────
function PrimaryButton({ onPress, disabled, loading, label }) {
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
        style={[styles.primaryBtn, disabled && styles.primaryBtnDisabled]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryBtnText}>{label}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Input field ──────────────────────────────────────────────────────────────
function InputField({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType,
  returnKeyType,
  onSubmitEditing,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType || "default"}
        returnKeyType={returnKeyType || "done"}
        onSubmitEditing={onSubmitEditing}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor="#aaa"
        style={[
          styles.input,
          focused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// ─── Main Login Screen ────────────────────────────────────────────────────────
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const heading = useEntranceAnim(0);
  const form = useEntranceAnim(80);
  const footer = useEntranceAnim(160);

  // ── Google Sign-In handler ────────────────────────────────────────────────────
  // Uses @react-native-google-signin/google-signin — no redirect URI needed!
  // webClientId in GoogleSignin.configure() is all that's required in GCD.
  async function handleGoogleSignIn() {
    try {
      setGoogleLoading(true);

      // Check Google Play Services available (Android only)
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Open Google account picker
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { idToken } = response.data;

        if (!idToken) {
          Alert.alert("Error", "Failed to get Google token. Please try again.");
          return;
        }

        // Exchange Google token for Firebase credential
        const credential = GoogleAuthProvider.credential(idToken);
        const userCred = await signInWithCredential(auth, credential);

        // Save to Firestore if first-time user
        await saveNewGoogleUser(userCred.user);

        // Navigate to app
        router.replace("/(tabs)");
      } else {
        // User cancelled — do nothing
        console.log("Google sign-in cancelled by user");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // user cancelled — do nothing
            break;
          case statusCodes.IN_PROGRESS:
            Alert.alert("Please wait", "Sign-in already in progress.");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert(
              "Error",
              "Google Play Services not available. Please update and try again.",
            );
            break;
          default:
            Alert.alert(
              "Sign-In Failed",
              "Google sign-in failed. Please try again.",
            );
        }
      } else {
        const message =
          FIREBASE_ERRORS[error.code] ||
          "Google sign-in failed. Please try again.";
        Alert.alert("Sign-In Failed", message);
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  // ── Email login handler ───────────────────────────────────────────────────────
  async function handleEmailLogin() {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Email login error:", error);
      const message =
        FIREBASE_ERRORS[error.code] || error.message || "Login failed.";
      Alert.alert("Login Failed", message);
    } finally {
      setLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      <Loader
        visible={googleLoading}
        message={"Authenticating with Google..."}
      />

      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.safe}>
        {/* Background blobs */}
        <View pointerEvents="none" style={styles.blobTop} />
        <View pointerEvents="none" style={styles.blobBottom} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inner}>
              {/* Heading */}
              <Animated.View style={[styles.headingBlock, heading]}>
                <Text style={styles.title}>Welcome Back 👋</Text>
                <Text style={styles.subtitle}>
                  Sign in to manage your financial assets
                </Text>
              </Animated.View>

              {/* Form */}
              <Animated.View style={form}>
                <InputField
                  label="Email"
                  value={email}
                  keyboardType="email-address"
                  returnKeyType="next"
                  onChangeText={(v) => {
                    setEmail(v);
                    if (errors.email) setErrors((e) => ({ ...e, email: null }));
                  }}
                  error={errors.email}
                />

                <InputField
                  label="Password"
                  value={password}
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={handleEmailLogin}
                  onChangeText={(v) => {
                    setPassword(v);
                    if (errors.password)
                      setErrors((e) => ({ ...e, password: null }));
                  }}
                  error={errors.password}
                />

                <PrimaryButton
                  label="Login  →"
                  onPress={handleEmailLogin}
                  disabled={loading || googleLoading}
                  loading={loading}
                />

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Google Button */}
                <TouchableOpacity
                  onPress={handleGoogleSignIn}
                  disabled={loading || googleLoading}
                  style={[
                    styles.googleBtn,
                    (loading || googleLoading) && { opacity: 0.6 },
                  ]}
                >
                  <Image
                    source={require("@/assets/images/googleicon.png")}
                    style={styles.googleIcon}
                  />
                  <Text style={styles.googleBtnText}>
                  {googleLoading ? "Signing in…" : "Continue with Google"}
                </Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Footer */}
              <Animated.View style={[styles.footerRow, footer]}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                  <Text style={styles.footerLink}>Sign Up</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const PRIMARY = "#7c3aed";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f5f3ff",
  },
  blobTop: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#8b5cf6",
    opacity: 0.55,
  },
  blobBottom: {
    position: "absolute",
    bottom: 40,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#8b5cf6",
    opacity: 0.45,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingTop: Platform.OS === "android" ? 32 : 16,
  },
  inner: {
    marginTop: 60,
  },
  headingBlock: {
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1a1a2e",
    letterSpacing: -0.8,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    lineHeight: 22,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111827",
  },
  inputFocused: {
    borderColor: PRIMARY,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
  },
  primaryBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 4,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  primaryBtnDisabled: {
    opacity: 0.65,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    marginHorizontal: 14,
    fontSize: 13,
    color: "#9ca3af",
    fontWeight: "500",
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    paddingVertical: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleIconFallback: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4285F4",
    marginRight: 10,
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    letterSpacing: 0.2,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },
  footerText: {
    fontSize: 14,
    color: "#6b7280",
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "700",
    color: PRIMARY,
  },
});
