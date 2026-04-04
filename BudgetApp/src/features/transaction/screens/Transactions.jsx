import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  groupByDate,
  isInDateRange,
  TRANSACTIONS,
  TYPE_FILTERS,
} from "../utils/helpers";
import C from "../../../constants/colors";
import SummaryCard from "../components/SummaryCard";
import SearchBar from "../components/SearchBar";
import FilterPills from "../components/FilterPills";
import DateChips from "../components/DateChips";
import DateGroup from "../components/DateGroup";
import EmptyState from "../components/EmptyState";

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");

  const filtered = useMemo(() => {
    return TRANSACTIONS.filter((t) => {
      const q = search.toLowerCase();
      const matchSearch =
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q);
      const matchType =
        typeFilter === "All"
          ? true
          : typeFilter === "Income"
            ? t.type === "income"
            : typeFilter === "Expense"
              ? t.type === "expense"
              : typeFilter === "Transfer"
                ? t.type === "transfer"
                : true;
      const matchDate = isInDateRange(t.date, dateFilter);
      return matchSearch && matchType && matchDate;
    });
  }, [search, typeFilter, dateFilter]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: insets.top + 14,
          paddingBottom: insets.bottom + 90,
        }}
      >
        {/* ── Header ── */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            marginBottom: 18,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: C.dark,
                letterSpacing: -0.5,
              }}
            >
              Transactions
            </Text>
            <Text style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>
              Managing your ethereal financial flow.
            </Text>
          </View>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: C.white,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: C.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <Ionicons name="options-outline" size={20} color={C.primary} />
          </TouchableOpacity>
        </View>

        {/* ── Summary Card ── */}
        <SummaryCard transactions={filtered} />

        {/* ── Search ── */}
        <SearchBar value={search} onChange={setSearch} />

        {/* ── Type Pills ── */}
        <FilterPills
          options={TYPE_FILTERS}
          selected={typeFilter}
          onSelect={setTypeFilter}
        />

        {/* ── Date Chips ── */}
        <DateChips selected={dateFilter} onSelect={setDateFilter} />

        {/* ── Results count ── */}
        {filtered.length > 0 && (
          <Text
            style={{
              marginHorizontal: 16,
              marginBottom: 10,
              fontSize: 11,
              color: C.faint,
              fontWeight: "500",
            }}
          >
            Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </Text>
        )}

        {/* ── Grouped List ── */}
        {grouped.length === 0 ? (
          <EmptyState typeFilter={typeFilter} />
        ) : (
          grouped.map(([dateStr, items]) => (
            <DateGroup key={dateStr} dateStr={dateStr} items={items} />
          ))
        )}
      </ScrollView>
    </View>
  );
}
