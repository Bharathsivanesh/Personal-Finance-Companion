
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SelectPicker({
  label,
  value,
  options = [],
  onChange,
  placeholder = "Select…",
  accentColor = "#7c3aed",
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View style={{ marginBottom: 14 }}>
      {label ? (
        <Text style={{
          fontSize: 10, fontWeight: "700", color: "#9ca3af",
          textTransform: "uppercase", letterSpacing: 1.5,
          marginBottom: 6, marginLeft: 2,
        }}>
          {label}
        </Text>
      ) : null}

      {/* Trigger */}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.75}
        style={{
          flexDirection: "row", alignItems: "center", justifyContent: "space-between",
          backgroundColor: "#f9fafb",
          borderWidth: 1.2, borderColor: "#e5e7eb",
          borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {selected?.icon ? (
            <View style={{
              width: 30, height: 30, borderRadius: 9,
              backgroundColor: "#ede9fe", alignItems: "center", justifyContent: "center",
            }}>
              <Ionicons name={selected.icon} size={16} color={accentColor} />
            </View>
          ) : null}
          <Text style={{ fontSize: 15, fontWeight: "600", color: selected ? "#111827" : "#c4b5c8" }}>
            {selected ? selected.label : placeholder}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={16} color="#9ca3af" />
      </TouchableOpacity>

      {/* Bottom sheet */}
      <Modal
        visible={open}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          onPress={() => setOpen(false)}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" }}
        >
          <Pressable onPress={() => {}}>
            <SafeAreaView style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 26, borderTopRightRadius: 26,
              maxHeight: 480,
            }}>
              {/* Handle */}
              <View style={{
                width: 38, height: 4, borderRadius: 2,
                backgroundColor: "#e5e7eb", alignSelf: "center",
                marginTop: 10, marginBottom: 14,
              }} />

              <Text style={{
                fontSize: 16, fontWeight: "700", color: "#111827",
                paddingHorizontal: 18, marginBottom: 10,
              }}>
                {label || "Select"}
              </Text>

              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isActive = item.value === value;
                  return (
                    <TouchableOpacity
                      onPress={() => { onChange(item.value); setOpen(false); }}
                      activeOpacity={0.7}
                      style={{
                        flexDirection: "row", alignItems: "center", gap: 12,
                        paddingHorizontal: 10, paddingVertical: 11,
                        borderRadius: 12, marginBottom: 2,
                        backgroundColor: isActive ? "#f5f3ff" : "transparent",
                      }}
                    >
                      {item.icon ? (
                        <View style={{
                          width: 38, height: 38, borderRadius: 11,
                          backgroundColor: isActive ? "#ddd6fe" : "#f3f4f6",
                          alignItems: "center", justifyContent: "center",
                        }}>
                          <Ionicons name={item.icon} size={18} color={isActive ? accentColor : "#6b7280"} />
                        </View>
                      ) : null}
                      <Text style={{
                        flex: 1, fontSize: 15, fontWeight: "600",
                        color: isActive ? "#6d28d9" : "#374151",
                      }}>
                        {item.label}
                      </Text>
                      {isActive && <Ionicons name="checkmark-circle" size={20} color={accentColor} />}
                    </TouchableOpacity>
                  );
                }}
              />
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}