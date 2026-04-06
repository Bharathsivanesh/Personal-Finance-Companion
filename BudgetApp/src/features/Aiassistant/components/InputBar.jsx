import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import C from "../../../constants/colors";
export default function InputBar({
  input,
  setInput,
  isLoading,
  onSend,
  tabBarTotalHeight,
}) {
  return (
    <View
      style={{
        marginBottom: tabBarTotalHeight,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: C.white,
        borderTopWidth: 1,
        borderTopColor: C.border,
        // No elevation/shadow on Android to avoid black artefact
        ...Platform.select({
          ios: {
            shadowColor: C.primary,
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.06,
            shadowRadius: 10,
          },
          android: {
            elevation: 0,
          },
        }),
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 10 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: C.bg,
            borderRadius: 22,
            borderWidth: 1.5,
            borderColor: input.length > 0 ? C.primaryLight : C.border,
            paddingHorizontal: 16,
            paddingVertical: Platform.OS === "ios" ? 10 : 8,
            minHeight: 46,
            justifyContent: "center",
          }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about your finances…"
            placeholderTextColor={C.faint}
            multiline
            maxLength={400}
            style={{
              fontSize: 14,
              color: C.dark,
              maxHeight: 100,
              padding: 0,
              margin: 0,
            }}
            returnKeyType="send"
            onSubmitEditing={() => onSend()}
            blurOnSubmit={false}
            underlineColorAndroid="transparent"
          />
        </View>

        <TouchableOpacity
          onPress={() => onSend()}
          disabled={!input.trim() || isLoading}
          activeOpacity={0.82}
        >
          <LinearGradient
            colors={
              !input.trim() || isLoading
                ? ["#d8d4f0", "#c4bef0"]
                : ["#a78bfa", "#7c3aed"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 46,
              height: 46,
              borderRadius: 23,
              alignItems: "center",
              justifyContent: "center",
              ...Platform.select({
                ios: {
                  shadowColor: C.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: !input.trim() || isLoading ? 0 : 0.35,
                  shadowRadius: 8,
                },
                android: { elevation: !input.trim() || isLoading ? 0 : 4 },
              }),
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={18} color="#fff" />
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontSize: 10,
          color: C.faint,
          textAlign: "center",
          marginTop: 8,
        }}
      >
        AI uses your transaction data · Responses are AI-generated
      </Text>
    </View>
  );
}
