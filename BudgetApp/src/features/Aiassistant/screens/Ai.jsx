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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AIHeader from "../components/AIHeader";
import WelcomeState from "../components/WelcomeState";
import MessageBubble from "../components/MessageBubble";
import TypingDots from "../components/TypingDots";
import SuggestionRow from "../components/SuggestionRow";
import InputBar from "../components/InputBar";
import C from "../../../constants/colors";

export default function AIAssistantScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);
  const TAB_BAR_HEIGHT = 65;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const tabBarTotalHeight = TAB_BAR_HEIGHT + insets.bottom;

  const nowTime = () =>
    new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  async function fetchAIResponse(userMessage) {
    await new Promise((r) => setTimeout(r, 1400));
    const msg = userMessage.toLowerCase();
    if (msg.includes("expense") || msg.includes("spend"))
      return "Based on your transactions this month, your **top expense category is Food & Dining** at ₹1,425 (34% of total spending). Consider reducing dining out by 20% to save an extra ₹285/month. 🍽️";
    if (
      msg.includes("income") ||
      msg.includes("salary") ||
      msg.includes("earn")
    )
      return "Your total income this month is **₹62,000** — ₹50,000 from salary and ₹12,000 from freelance work. That's 18% higher than last month! 💪";
    if (msg.includes("save") || msg.includes("saving"))
      return "Here are 3 quick wins:\n\n1. **Cancel unused subscriptions**\n2. **Cook at home 2 more days/week** — saves ~₹800/month\n3. **Set a ₹5,000 auto-transfer** to savings 🎯";
    if (msg.includes("budget") || msg.includes("over"))
      return "You're **within budget** on most categories! Only Food is slightly over (8%). Overall spending is 21% below your total budget — great discipline! ✅";
    if (msg.includes("summary") || msg.includes("month"))
      return "**April 2026 Summary:**\n\n💰 Income: ₹62,000\n💸 Expenses: ₹5,748\n📊 Net: +₹56,252\n\nSavings rate: 90.7% — excellent! 🚀";
    if (msg.includes("transfer"))
      return "You've made **2 transfers** totalling ₹7,000 this month. Transfers are excluded from expense calculations. ↕️";
    return "Great question! Based on your spending patterns, you're on a solid track this month. Would you like me to break down a specific category or give personalised saving tips? 💡";
  }
  const sendMessage = useCallback(
    async (text) => {
      const msg = (text ?? input).trim();
      if (!msg || isLoading) return;
      setInput("");
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + "u", role: "user", text: msg, time: nowTime() },
      ]);
      setIsLoading(true);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
      try {
        const reply = await fetchAIResponse(msg);
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + "a", role: "ai", text: reply, time: nowTime() },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + "err",
            role: "ai",
            text: "Sorry, I couldn't process that right now. Please try again.",
            time: nowTime(),
          },
        ]);
      } finally {
        setIsLoading(false);
        setTimeout(
          () => scrollRef.current?.scrollToEnd({ animated: true }),
          150,
        );
      }
    },
    [input, isLoading],
  );

  return (

    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      {/* Header */}
      <View style={{ paddingTop: insets.top }}>
        <AIHeader onBack={navigation?.goBack} />
      </View>

      {/* Scrollable messages — KeyboardAwareScrollView handles keyboard push */}
      <KeyboardAwareScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={tabBarTotalHeight + 20}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <WelcomeState onChipPress={sendMessage} />
        ) : (
          messages.map((m) => <MessageBubble key={m.id} message={m} />)
        )}

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
                Aria is thinking…
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

        {messages.length > 0 && !isLoading && (
          <SuggestionRow onPress={sendMessage} />
        )}
      </KeyboardAwareScrollView>

      {/* Input bar — always above tab bar */}
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
