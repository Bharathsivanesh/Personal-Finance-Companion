import React, { useState, useEffect } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity } from "react-native";
import C from "@/src/constants/colors";

// ✅ validators
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone);
};

export default function EditProfileModal({ visible, onClose, user, onSave }) {
  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");

      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSubmit = () => {
    let newErrors = {};

    // ✅ Name validation
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    // ✅ Phone validation
    if (!phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Enter valid 10-digit number";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({
        fullName: name,
        phone,
      });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
            Edit Profile
          </Text>

          {/* NAME */}
          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setErrors((prev) => ({ ...prev, name: null }));
            }}
            style={{
              borderWidth: 1,
              borderColor: errors.name ? "red" : "#ddd",
              borderRadius: 10,
              padding: 12,
              marginBottom: 4,
            }}
          />
          {errors.name && (
            <Text style={{ color: "red", marginBottom: 8 }}>{errors.name}</Text>
          )}

          {/* PHONE */}
          <TextInput
            placeholder="Phone (10 digits)"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              setErrors((prev) => ({ ...prev, phone: null }));
            }}
            keyboardType="number-pad"
            maxLength={10}
            style={{
              borderWidth: 1,
              borderColor: errors.phone ? "red" : "#ddd",
              borderRadius: 10,
              padding: 12,
              marginBottom: 4,
            }}
          />
          {errors.phone && (
            <Text style={{ color: "red", marginBottom: 12 }}>
              {errors.phone}
            </Text>
          )}

          {/* SAVE */}
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: C.primary,
              padding: 14,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              Save Changes
            </Text>
          </TouchableOpacity>

          {/* CANCEL */}
          <TouchableOpacity onPress={onClose} style={{ marginTop: 10 }}>
            <Text style={{ textAlign: "center", color: "gray" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
