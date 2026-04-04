

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import C from "../../../constants/colors";
import PeriodTabs from "../components/PeriodTabs";
import TypeSelector from "../components/TypeSelector";
import SummaryRow from "../components/SummaryRow";
import TrendChart from "../components/TrendChart";
import SpendingBreakdown from "../components/SpendingBreakdown";
import PeriodComparison from "../components/PeriodComparison";
import GoalCard from "../components/GoalCard";
import DailyTracking from "../components/DailyTracking";
const DATA = {
  Week: {
    Income: {
      summary: {
        total: "₹14.2K",
        sub: "₹2.0K",
        subLabel: "Avg/day",
        avg: "₹466",
        avgLabel: "Avg txn",
      },
      chart: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        values: [1800, 2400, 1200, 3000, 2100, 2200, 1500],
      },
      breakdown: [
        { label: "Salary", pct: 55, color: C.primary },
        { label: "Freelance", pct: 28, color: C.primaryLight },
        { label: "Dividends", pct: 12, color: C.muted },
        { label: "Other", pct: 5, color: C.faint },
      ],
      comparison: {
        lastLabel: "Last Week",
        lastAmt: "₹12,400",
        lastTx: 6,
        thisLabel: "This Week",
        thisAmt: "₹14,200",
        thisTx: 7,
        diff: 15,
      },
      goal: { saved: 3200, goal: 5000, label: "Weekly income goal" },
    },
    Expense: {
      summary: {
        total: "₹8.6K",
        sub: "₹1.2K",
        subLabel: "Avg/day",
        avg: "₹286",
        avgLabel: "Avg txn",
      },
      chart: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        values: [900, 1400, 800, 1600, 1200, 1500, 1200],
      },
      breakdown: [
        { label: "Food & Dining", pct: 40, color: C.primary },
        { label: "Lifestyle", pct: 28, color: C.primaryLight },
        { label: "Utilities", pct: 19, color: C.muted },
        { label: "Transport", pct: 13, color: C.faint },
      ],
      comparison: {
        lastLabel: "Last Week",
        lastAmt: "₹9,800",
        lastTx: 12,
        thisLabel: "This Week",
        thisAmt: "₹8,600",
        thisTx: 10,
        diff: -12,
      },
      goal: { saved: 3200, goal: 5000, label: "Weekly budget goal" },
    },
  },
  Month: {
    Income: {
      summary: {
        total: "₹62K",
        sub: "₹5.7K",
        subLabel: "Avg/week",
        avg: "₹466",
        avgLabel: "Avg/day",
      },
      chart: {
        labels: ["W1", "W2", "W3", "W4"],
        values: [14000, 16500, 18000, 13500],
      },
      breakdown: [
        { label: "Salary", pct: 60, color: C.primary },
        { label: "Freelance", pct: 25, color: C.primaryLight },
        { label: "Dividends", pct: 10, color: C.muted },
        { label: "Other", pct: 5, color: C.faint },
      ],
      comparison: {
        lastLabel: "March 2026",
        lastAmt: "₹58,400",
        lastTx: 14,
        thisLabel: "April 2026",
        thisAmt: "₹62,000",
        thisTx: 11,
        diff: 6,
      },
      goal: { saved: 15600, goal: 20000, label: "Monthly income goal" },
    },
    Expense: {
      summary: {
        total: "₹28K",
        sub: "₹5.7K",
        subLabel: "Spent",
        avg: "₹466",
        avgLabel: "Avg/day",
      },
      chart: {
        labels: ["W1", "W2", "W3", "W4"],
        values: [6800, 7200, 8100, 5900],
      },
      breakdown: [
        { label: "Food & Dining", pct: 40, color: C.primary },
        { label: "Lifestyle", pct: 28, color: C.primaryLight },
        { label: "Utilities", pct: 19, color: C.muted },
        { label: "Transport", pct: 13, color: C.faint },
      ],
      comparison: {
        lastLabel: "March 2026",
        lastAmt: "₹7,240",
        lastTx: 16,
        thisLabel: "April 2026",
        thisAmt: "₹5,748",
        thisTx: 11,
        diff: -21,
      },
      goal: { saved: 15600, goal: 20000, label: "Monthly savings goal" },
    },
  },
  Year: {
    Income: {
      summary: {
        total: "₹7.4L",
        sub: "₹61.6K",
        subLabel: "Avg/month",
        avg: "₹2,027",
        avgLabel: "Avg/day",
      },
      chart: {
        labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
        values: [52000, 58000, 65000, 72000, 68000, 74000],
      },
      breakdown: [
        { label: "Salary", pct: 62, color: C.primary },
        { label: "Freelance", pct: 22, color: C.primaryLight },
        { label: "Dividends", pct: 11, color: C.muted },
        { label: "Other", pct: 5, color: C.faint },
      ],
      comparison: {
        lastLabel: "Last Year",
        lastAmt: "₹6.8L",
        lastTx: 148,
        thisLabel: "This Year",
        thisAmt: "₹7.4L",
        thisTx: 132,
        diff: 9,
      },
      goal: { saved: 186000, goal: 240000, label: "Yearly income goal" },
    },
    Expense: {
      summary: {
        total: "₹3.2L",
        sub: "₹26.6K",
        subLabel: "Avg/month",
        avg: "₹876",
        avgLabel: "Avg/day",
      },
      chart: {
        labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
        values: [24000, 28000, 31000, 27000, 29000, 26000],
      },
      breakdown: [
        { label: "Food & Dining", pct: 38, color: C.primary },
        { label: "Lifestyle", pct: 30, color: C.primaryLight },
        { label: "Utilities", pct: 20, color: C.muted },
        { label: "Transport", pct: 12, color: C.faint },
      ],
      comparison: {
        lastLabel: "Last Year",
        lastAmt: "₹3.6L",
        lastTx: 182,
        thisLabel: "This Year",
        thisAmt: "₹3.2L",
        thisTx: 164,
        diff: -11,
      },
      goal: { saved: 186000, goal: 240000, label: "Yearly budget goal" },
    },
  },
};
export default function InsightsScreen() {
  const [period, setPeriod] = useState("Month");
  const [txType, setTxType] = useState("Income");
  const d = useMemo(() => DATA[period][txType], [period, txType]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
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

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <TypeSelector active={txType} onChange={setTxType} />

        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: C.muted,
            letterSpacing: 1.4,
            marginBottom: 8,
            marginTop: 6,
          }}
        >
          SUMMARY
        </Text>
        <SummaryRow data={d.summary} type={txType} />

        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: C.muted,
            letterSpacing: 1.4,
            marginBottom: 8,
            marginTop: 6,
          }}
        >
          TREND
        </Text>
        <TrendChart data={d.chart} type={txType} period={period} />

        <SpendingBreakdown
          data={d.breakdown}
          total={d.summary.total}
          type={txType}
        />

        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: C.muted,
            letterSpacing: 1.4,
            marginBottom: 8,
            marginTop: 6,
          }}
        >
          COMPARISON
        </Text>
        <PeriodComparison data={d.comparison} type={txType} />

        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: C.muted,
            letterSpacing: 1.4,
            marginBottom: 8,
            marginTop: 6,
          }}
        >
          GOAL
        </Text>
        <GoalCard data={d.goal} type={txType} />

        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: C.muted,
            letterSpacing: 1.4,
            marginBottom: 8,
            marginTop: 6,
          }}
        >
          DAILY ACTIVITY
        </Text>
        <DailyTracking />

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
