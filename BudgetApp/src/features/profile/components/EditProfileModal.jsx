// src/features/profile/components/EditProfileModal.jsx
import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, Pressable } from "react-native";
import C from "@/src/constants/colors";
import InputField from "@/src/components/common/Inputfield";

// ✅ same centralized validators used in login & signup
import {
  validateFullName,
  validatePhone,
  hasErrors,
} from "@/src/utils/validators";

export default function EditProfileModal({ visible, onClose, user, onSave }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});

  // Seed form when user data arrives
  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setPhone(user.phone || "");
      setErrors({});
    }
  }, [user, visible]);

  const handleSubmit = () => {
    // ✅ same validator functions as signup
    const validationErrors = {};
    const nameErr = validateFullName(name);
    const phoneErr = validatePhone(phone);
    if (nameErr) validationErrors.name = nameErr;
    if (phoneErr) validationErrors.phone = phoneErr;

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    onSave({ fullName: name, phone });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <Pressable onPress={() => {}}>
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              paddingBottom: 36,
            }}
          >
            {/* Drag handle */}
            <View
              style={{
                width: 38,
                height: 4,
                borderRadius: 2,
                backgroundColor: "#e5e7eb",
                alignSelf: "center",
                marginBottom: 18,
              }}
            />

            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: C.dark,
                marginBottom: 20,
              }}
            >
              Edit Profile
            </Text>

            {/* Name — same InputField as login/signup, same error UX */}
            <InputField
              type="text"
              label="Full Name"
              value={name}
              onChangeText={(v) => {
                setName(v);
                if (errors.name) setErrors((e) => ({ ...e, name: null }));
              }}
              error={errors.name}
              returnKeyType="next"
            />

            {/* Phone — maxLength=10 enforced at input level too */}
            <InputField
              type="phone"
              label="Mobile Number"
              value={phone}
              onChangeText={(v) => {
                setPhone(v);
                if (errors.phone) setErrors((e) => ({ ...e, phone: null }));
              }}
              error={errors.phone}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              maxLength={10}
            />

            {/* Save */}
            <TouchableOpacity
              onPress={handleSubmit}
              style={{
                backgroundColor: C.primary,
                padding: 16,
                borderRadius: 14,
                alignItems: "center",
                marginTop: 4,
                shadowColor: C.primary,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 6,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
                Save Changes
              </Text>
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              onPress={onClose}
              style={{ marginTop: 14, alignItems: "center" }}
            >
              <Text style={{ color: C.muted, fontSize: 14 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
