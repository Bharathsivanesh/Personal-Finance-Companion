// src/features/transaction/components/DeleteConfirmModal.jsx
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";


export default function DeleteConfirmModal({ visible, item, onCancel, onConfirm, loading }) {
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 70, friction: 10 }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      scale.setValue(0.85);
      opacity.setValue(0);
    }
  }, [visible]);

  return (
    <Modal transparent animationType="none" visible={visible} statusBarTranslucent>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "center",
          alignItems: "center",
          opacity,
        }}
      >
        <Animated.View
          style={{
            width: "85%",
            backgroundColor: "#fff",
            borderRadius: 24,
            padding: 24,
            alignItems: "center",
            transform: [{ scale }],
            shadowColor: "#7c3aed",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.18,
            shadowRadius: 24,
            elevation: 16,
          }}
        >
          {/* Purple top accent */}
          <View
            style={{
              position: "absolute",
              top: 0, left: 28, right: 28,
              height: 3, borderRadius: 2,
              backgroundColor: "#ef4444",
            }}
          />

          {/* Icon */}
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: "#fff1f2",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8,
              marginBottom: 16,
            }}
          >
            <Ionicons name="trash-outline" size={30} color="#ef4444" />
          </View>

          {/* Title */}
          <Text style={{ fontSize: 18, fontWeight: "800", color: "#111827", marginBottom: 8 }}>
            Delete Transaction?
          </Text>

          {/* Description */}
          <Text style={{ fontSize: 13, color: "#6b7280", textAlign: "center", lineHeight: 20, marginBottom: 6 }}>
            This will permanently remove
          </Text>

          {/* Transaction name */}
          {item ? (
            <View
              style={{
                backgroundColor: "#f5f3ff",
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 8,
                marginBottom: 6,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#7c3aed" }}>
                {item.title}  •  ₹{parseFloat(item.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </Text>
            </View>
          ) : null}

          <Text style={{ fontSize: 12, color: "#9ca3af", marginBottom: 24 }}>
            This action cannot be undone.
          </Text>

          {/* Buttons */}
          <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
            {/* Cancel */}
            <TouchableOpacity
              onPress={onCancel}
              disabled={loading}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: "#e5e7eb",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#6b7280" }}>
                Cancel
              </Text>
            </TouchableOpacity>

            {/* Delete */}
            <TouchableOpacity
              onPress={onConfirm}
              disabled={loading}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 14,
                backgroundColor: loading ? "#fca5a5" : "#ef4444",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#ef4444",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>
                {loading ? "Deleting…" : "Delete"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}