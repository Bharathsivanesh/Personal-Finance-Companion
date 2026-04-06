// src/features/Aiassistant/screens/AIAssistantScreen.jsx
import React, { useState, useRef, useCallback } from "react";
import { View, Text, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AIHeader from "../components/AIHeader";
import WelcomeState from "../components/WelcomeState";
import MessageBubble from "../components/MessageBubble";
import TypingDots from "../components/TypingDots";
import SuggestionRow from "../components/SuggestionRow";
import InputBar from "../components/InputBar";
import { sendToGeminiService } from "../services/Aiservice";
import { useAuth } from "@/src/context/AuthContext";
import C from "../../../constants/colors";

const nowTime = () =>
  new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function AIAssistantScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);
  const { user } = useAuth();
  const TAB_BAR_HEIGHT = 65;
  const tabBarTotalHeight = TAB_BAR_HEIGHT + insets.bottom;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = (delay = 100) => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), delay);
  };

  const sendMessage = useCallback(
    async (text) => {
      const msg = (text ?? input).trim();
      if (!msg || isLoading) return;

      setInput("");

      // Add user message immediately
      const userMsg = {
        id: Date.now() + "u",
        role: "user",
        text: msg,
        time: nowTime(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      scrollToBottom(100);

      try {
        // Pass conversation history for multi-turn context
        // We pass messages BEFORE this new one (prev state)
        const history = messages; // captured at call time

        const reply = await sendToGeminiService({
          userMessage: msg,
          userId: user?.uid,
          conversationHistory: history,
        });

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + "a",
            role: "ai",
            text: reply,
            time: nowTime(),
          },
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + "err",
            role: "ai",
            text: "Sorry, I couldn't connect right now. Please check your internet and try again. 🙏",
            time: nowTime(),
          },
        ]);
      } finally {
        setIsLoading(false);
        scrollToBottom(150);
      }
    },
    [input, isLoading, messages, user?.uid],
  );

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      {/* Header */}
      <View style={{ paddingTop: insets.top }}>
        <AIHeader onBack={navigation?.goBack} />
      </View>

      {/* Scrollable messages */}
      <KeyboardAwareScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={tabBarTotalHeight + 20}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <WelcomeState onChipPress={sendMessage} />
        ) : (
          messages.map((m) => <MessageBubble key={m.id} message={m} />)
        )}

        {/* Typing indicator */}
        {isLoading && (
          <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginBottom: 5,
              }}
            >
              <LinearGradient
                colors={["#a78bfa", "#7c3aed"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="sparkles" size={12} color="#fff" />
              </LinearGradient>
              <Text style={{ fontSize: 11, fontWeight: "700", color: C.muted }}>
                AI is thinking…
              </Text>
            </View>
            <View
              style={{
                backgroundColor: C.white,
                borderRadius: 20,
                borderTopLeftRadius: 4,
                paddingHorizontal: 16,
                paddingVertical: 10,
                alignSelf: "flex-start",
              }}
            >
              <TypingDots />
            </View>
          </View>
        )}

        {/* Suggestion chips — shown after first reply */}
        {messages.length > 0 && !isLoading && (
          <SuggestionRow onPress={sendMessage} />
        )}
      </KeyboardAwareScrollView>

      {/* Input bar */}
      <InputBar
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        onSend={sendMessage}
        tabBarTotalHeight={tabBarTotalHeight}
      />
    </View>
  );
}
