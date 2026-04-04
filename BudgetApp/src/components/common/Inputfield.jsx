/**
 * InputField.jsx
 * Reusable animated input — supports type: "text" | "email" | "phone" | "password"
 * Replace emoji icons with lucide-react-native or @expo/vector-icons if available.
 */
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import C from "../../constants/colors";

// ── Swap these with your icon library ─────────────────────────────────────────
function Icon({ name, color, size = 18 }) {
  const map = {
    user: "👤",
    email: "✉️",
    phone: "📱",
    lock: "🔒",
    eye: "👁",
    eyeOff: "🙈",
  };
  return (
    <Text style={{ fontSize: size, color, lineHeight: size + 4 }}>
      {map[name] ?? "•"}
    </Text>
  );
}

// ── Config per type ────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  text: {
    icon: "user",
    keyboardType: "default",
    autoCapitalize: "words",
    autoCorrect: false,
    secureTextEntry: false,
  },
  email: {
    icon: "email",
    keyboardType: "email-address",
    autoCapitalize: "none",
    autoCorrect: false,
    secureTextEntry: false,
  },
  phone: {
    icon: "phone",
    keyboardType: "phone-pad",
    autoCapitalize: "none",
    autoCorrect: false,
    secureTextEntry: false,
  },
  password: {
    icon: "lock",
    keyboardType: "default",
    autoCapitalize: "none",
    autoCorrect: false,
    secureTextEntry: true, // toggled internally
  },
};

/**
 * Props:
 *   type         "text" | "email" | "phone" | "password"
 *   label        string  — floating label
 *   value        string
 *   onChangeText fn
 *   error        string  — red border + message + shake
 *   containerStyle object
 *   ...rest      forwarded to TextInput
 */
export default function InputField({
  type = "text",
  label = "",
  value = "",
  onChangeText,
  error,
  containerStyle,
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(true); // for password type

  const focusAnim = useRef(new Animated.Value(0)).current;
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.text;

  // ── Focus / Blur ─────────────────────────────────────────────────────────────
  const onFocus = () => {
    setFocused(true);
    Animated.parallel([
      Animated.spring(focusAnim, {
        toValue: 1,
        useNativeDriver: false,
        speed: 20,
        bounciness: 4,
      }),
      Animated.spring(labelAnim, {
        toValue: 1,
        useNativeDriver: false,
        speed: 20,
        bounciness: 4,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.01,
        useNativeDriver: true,
        speed: 20,
      }),
    ]).start();
  };

  const onBlur = () => {
    setFocused(false);
    Animated.parallel([
      Animated.spring(focusAnim, {
        toValue: 0,
        useNativeDriver: false,
        speed: 20,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
      }),
      ...(value
        ? []
        : [
            Animated.spring(labelAnim, {
              toValue: 0,
              useNativeDriver: false,
              speed: 20,
            }),
          ]),
    ]).start();
  };

  // ── Shake on error ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!error) return;
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 9,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -9,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 7,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -7,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 55,
        useNativeDriver: true,
      }),
    ]).start();
  }, [error]);

  // ── Interpolations ───────────────────────────────────────────────────────────
  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? C.red : C.border, error ? C.red : C.primary],
  });
  const bgColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [C.primaryPale, C.white],
  });
  const shadowOpacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.16],
  });
  const iconColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [C.faint, error ? C.red : C.primary],
  });

  // Floating label
  const labelTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [17, -9],
  });
  const labelSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [14.5, 11],
  });
  const labelColor = focused
    ? error
      ? C.red
      : C.primary
    : value
      ? C.muted
      : C.faint;

  return (
    <Animated.View
      style={[
        {
          marginBottom: 18,
          transform: [{ translateX: shakeAnim }, { scale: scaleAnim }],
        },
        containerStyle,
      ]}
    >
      <Animated.View
        style={{
          borderRadius: 16,
          borderWidth: 1.5,
          borderColor,
          backgroundColor: bgColor,
          shadowColor: C.primary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity,
          shadowRadius: 14,
          elevation: focused ? 5 : 0,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            minHeight: 58,
          }}
        >
          {/* Icon */}
          <Animated.View style={{ marginRight: 12, marginTop: label ? 6 : 0 }}>
            <Icon
              name={cfg.icon}
              color={iconColor.__getValue ? C.faint : iconColor}
              size={17}
            />
          </Animated.View>

          {/* Floating label */}
          {label ? (
            <Animated.Text
              pointerEvents="none"
              style={{
                position: "absolute",
                left: 48,
                top: labelTop,
                fontSize: labelSize,
                color: labelColor,
                fontWeight: "600",
                letterSpacing: 0.2,
                backgroundColor: focused || value ? C.white : "transparent",
                paddingHorizontal: focused || value ? 5 : 0,
                borderRadius: 4,
                zIndex: 2,
              }}
            >
              {label}
            </Animated.Text>
          ) : null}

          {/* Input */}
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            keyboardType={cfg.keyboardType}
            autoCapitalize={cfg.autoCapitalize}
            autoCorrect={cfg.autoCorrect}
            secureTextEntry={type === "password" ? secure : false}
            style={{
              flex: 1,
              fontSize: 15,
              fontWeight: "500",
              color: C.dark,
              paddingVertical: Platform.OS === "ios" ? 16 : 12,
              paddingTop: label ? 22 : Platform.OS === "ios" ? 16 : 12,
            }}
            {...rest}
          />

          {/* Password toggle */}
          {type === "password" && (
            <TouchableOpacity
              onPress={() => setSecure((s) => !s)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ padding: 2 }}
            >
              <Icon
                name={secure ? "eyeOff" : "eye"}
                color={C.muted}
                size={17}
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Error text */}
      {error ? (
        <Text
          style={{
            marginTop: 6,
            marginLeft: 16,
            fontSize: 12,
            fontWeight: "600",
            color: C.red,
            letterSpacing: 0.2,
          }}
        >
          ⚠ {error}
        </Text>
      ) : null}
    </Animated.View>
  );
}
