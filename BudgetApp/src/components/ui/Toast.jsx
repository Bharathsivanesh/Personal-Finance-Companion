// src/components/common/Toast.jsx
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { View, Text, Animated, TouchableOpacity, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext({ showToast: () => {} });

// ─── Hook (use this in any screen) ───────────────────────────────────────────
export const useToast = () => useContext(ToastContext);

// ─── Toast type config ────────────────────────────────────────────────────────
const CONFIG = {
  success: {
    bg: "#f0fdf4",
    border: "#22c55e",
    iconBg: "#22c55e",
    icon: "✓",
    label: "Success",
    labelColor: "#16a34a",
  },
  error: {
    bg: "#fff1f2",
    border: "#ef4444",
    iconBg: "#ef4444",
    icon: "✕",
    label: "Error",
    labelColor: "#dc2626",
  },
  warning: {
    bg: "#fffbeb",
    border: "#f59e0b",
    iconBg: "#f59e0b",
    icon: "⚠",
    label: "Warning",
    labelColor: "#d97706",
  },
  info: {
    bg: "#eff6ff",
    border: "#8b5cf6",
    iconBg: "#8b5cf6",
    icon: "i",
    label: "Info",
    labelColor: "#7c3aed",
  },
};

// ─── Single Toast Item ────────────────────────────────────────────────────────
const ToastItem = ({
  id,
  message,
  description,
  type = "info",
  duration = 3500,
  onHide,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-140)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  const progress = useRef(new Animated.Value(1)).current;

  const cfg = CONFIG[type] ?? CONFIG.info;

  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -140,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start(() => onHide(id));
  }, [id, onHide]);

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 70,
        friction: 10,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 70,
        friction: 10,
      }),
    ]).start();

    // Progress bar drain
    Animated.timing(progress, {
      toValue: 0,
      duration,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: 14,
        right: 14,
        top: insets.top + (Platform.OS === "android" ? 14 : 10),
        zIndex: 9999,
        backgroundColor: cfg.bg,
        borderRadius: 18,
        borderLeftWidth: 4,
        borderLeftColor: cfg.border,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 13,
        paddingRight: 12,
        paddingLeft: 12,
        shadowColor: cfg.border,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 14,
        elevation: 10,
        gap: 10,
        transform: [{ translateY }, { scale }],
        opacity,
        overflow: "hidden",
      }}
    >
      {/* Decorative blob — consistent with your app style */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: cfg.border,
          opacity: 0.07,
        }}
      />

      {/* Icon badge */}
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 11,
          backgroundColor: cfg.iconBg,
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
          shadowColor: cfg.iconBg,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.35,
          shadowRadius: 6,
          elevation: 4,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: type === "info" ? 13 : 14,
            fontWeight: "800",
          }}
        >
          {cfg.icon}
        </Text>
      </View>

      {/* Text content */}
      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: cfg.labelColor,
            letterSpacing: 0.6,
            textTransform: "uppercase",
          }}
        >
          {cfg.label}
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: "#111827",
            lineHeight: 18,
          }}
          numberOfLines={2}
        >
          {message}
        </Text>
        {description ? (
          <Text
            style={{
              fontSize: 12,
              color: "#6b7280",
              marginTop: 1,
              lineHeight: 16,
            }}
            numberOfLines={2}
          >
            {description}
          </Text>
        ) : null}
      </View>

      {/* Close button */}
      <TouchableOpacity
        onPress={dismiss}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={{
          width: 24,
          height: 24,
          borderRadius: 8,
          backgroundColor: "rgba(0,0,0,0.06)",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Text style={{ fontSize: 11, color: "#9ca3af", fontWeight: "700" }}>
          ✕
        </Text>
      </TouchableOpacity>

      {/* Progress bar at bottom */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: "rgba(0,0,0,0.06)",
          borderBottomLeftRadius: 18,
          borderBottomRightRadius: 18,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{
            height: "100%",
            width: progressWidth,
            backgroundColor: cfg.border,
            opacity: 0.6,
          }}
        />
      </View>
    </Animated.View>
  );
};

// ─── Provider — wrap once in _layout.jsx ─────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((opts) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev.slice(-2), { ...opts, id }]); // max 3 toasts
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} onHide={removeToast} />
      ))}
    </ToastContext.Provider>
  );
};
