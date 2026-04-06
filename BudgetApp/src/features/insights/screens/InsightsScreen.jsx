// src/features/insights/screens/InsightsScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import C from "../../../constants/colors";
import PeriodTabs from "../components/PeriodTabs";
import TypeSelector from "../components/TypeSelector";
import SummaryRow from "../components/SummaryRow";
import TrendChart from "../components/TrendChart";
import SpendingBreakdown from "../components/SpendingBreakdown";
import PeriodComparison from "../components/PeriodComparison";
import DailyTracking from "../components/DailyTracking";
import { useInsights } from "../components/useInsights";
import { useDailyActivity } from "../components/useDailyActivity";
import Loader from "@/src/components/ui/Loader";

// ── helpers ───────────────────────────────────────────────────────────────────

const SectionLabel = ({ text }) => (
  <Text
    style={{
      fontSize: 11,
      fontWeight: "700",
      color: C.muted,
      letterSpacing: 1.4,
      marginBottom: 8,
      marginTop: 16,
    }}
  >
    {text}
  </Text>
);

const LoadingState = () => (
  <View
    style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 80,
    }}
  >
    <ActivityIndicator size="large" color={C.primary} />
    <Text style={{ marginTop: 12, fontSize: 13, color: C.muted }}>
      Loading insights…
    </Text>
  </View>
);

const ErrorState = ({ message, onRetry }) => (
  <View
    style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 80,
      paddingHorizontal: 32,
    }}
  >
    <Text
      style={{
        fontSize: 15,
        fontWeight: "700",
        color: C.dark,
        textAlign: "center",
      }}
    >
      Something went wrong
    </Text>
    <Text
      style={{
        fontSize: 13,
        color: C.muted,
        marginTop: 6,
        textAlign: "center",
      }}
    >
      {message}
    </Text>
    <TouchableOpacity
      onPress={onRetry}
      style={{
        marginTop: 16,
        backgroundColor: C.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: "700", color: "#fff" }}>
        Retry
      </Text>
    </TouchableOpacity>
  </View>
);

// ── screen ────────────────────────────────────────────────────────────────────

export default function InsightsScreen() {
  const [period, setPeriod] = useState("Week");
  const [txType, setTxType] = useState("Income");

  // Main insights — changes with period + type filter
  const { data, loading, error, refetch } = useInsights(period, txType);

  // Daily activity — independent of filter, fetched once
  const dailyActivity = useDailyActivity();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ flex: 1 }}>
        {/* Top Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: Platform.OS === "android" ? 16 : 4,
            paddingBottom: 12,
            backgroundColor: C.bg,
            borderBottomWidth: 1,
            borderBottomColor: C.border,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "800",
              color: C.dark,
              letterSpacing: -0.5,
            }}
          >
            Insights
          </Text>
          <PeriodTabs active={period} onChange={setPeriod} />
        </View>

        {!loading && error && <ErrorState message={error} onRetry={refetch} />}

        {!loading && !error && data && (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: 32, // enough room above bottom nav bar
            }}
            showsVerticalScrollIndicator={false}
          >
            <TypeSelector active={txType} onChange={setTxType} />

            <SectionLabel text="SUMMARY" />
            <SummaryRow data={data.summary} type={txType} />

            {/* Breakdown — colour fix handled inside SpendingBreakdown */}
            <SpendingBreakdown
              data={data.breakdown}
              total={data.summary.total}
              type={txType}
            />

            <SectionLabel text="COMPARISON" />
            <PeriodComparison data={data.comparison} type={txType} />
            <SectionLabel text="TREND" />
            {/* TrendChart handles its own height — no extra wrapper needed */}
            <TrendChart data={data.chart} type={txType} period={period} />

            {/* GOAL section removed ✅ */}

            <SectionLabel text="DAILY ACTIVITY" />
            {/* Pass real data — DailyTracking renders from startDate → today */}
            <DailyTracking
              activityMap={dailyActivity.activityMap}
              startDate={dailyActivity.startDate}
              endDate={dailyActivity.endDate}
              loading={dailyActivity.loading}
            />

            <View style={{ height: 24 }} />
          </ScrollView>
        )}
        <Loader visible={loading} message="Loading data…" />
      </View>
    </SafeAreaView>
  );
}
