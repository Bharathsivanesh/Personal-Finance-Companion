// src/features/transaction/screens/TransactionsScreen.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { groupByDate, isInDateRange, TYPE_FILTERS } from "../utils/helpers";
import { formatTransaction } from "../components/formatTransaction";

import C from "../../../constants/colors";
import SummaryCard from "../components/SummaryCard";
import SearchBar from "../components/SearchBar";
import FilterPills from "../components/FilterPills";
import DateChips from "../components/DateChips";
import DateGroup from "../components/DateGroup";
import EmptyState from "../components/EmptyState";

import { useToast } from "@/src/components/ui/Toast";
import { useAuth } from "../../../context/AuthContext";
import { useTransactionRefresh } from "@/src/context/TransactionContext";
import Loader from "@/src/components/ui/Loader";
import Toast from "react-native-toast-message";
import {
  getTransactionsservice,
  deleteTransactionservice,
} from "../services/transactionService";
import DeleteConfirmModal from "../components/Deleteconfirmmodal";

// ✅ Single modal used for both add AND edit
import AddTransactionModal from "../../add/screens/AddTransactionModal";

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { refreshKey, triggerRefresh } = useTransactionRefresh();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── delete state ──────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── modal state (shared for add + edit) ───────────────────────────────────
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null); // null = add mode

  const safe = (v) => (v || "").toLowerCase();

  // ── fetch ─────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!user?.uid) return;
    try {
      setLoading(true);
      const data = await getTransactionsservice({ userId: user.uid });
      setTransactions(data.map(formatTransaction));
    } catch (error) {
      console.log(error);
      // Toast.show({ type: "error", text1: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  // ── delete handlers ───────────────────────────────────────────────────────
  const handleDeletePress = (item) => setDeleteTarget(item);

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await deleteTransactionservice(deleteTarget.id);
      Toast.show({
        type: "success",
        text1: "Transaction deleted successfully",
      });
      setDeleteTarget(null);
      triggerRefresh();
    } catch (err) {
      console.log(err);
      Toast.show({ type: "error", text1: "Failed to delete transaction" });
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── open modal helpers ────────────────────────────────────────────────────
  const handleAddPress = () => {
    setEditItem(null); // add mode
    setModalVisible(true);
  };

  const handleEditPress = (item) => {
    setEditItem(item); // edit mode — passes item to modal
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditItem(null);
  };
  const handleModalSuccess = () => triggerRefresh();

  // ── filters ───────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const q = safe(search);
      const matchSearch =
        safe(t.title).includes(q) || safe(t.subtitle).includes(q);
      const matchType =
        typeFilter === "All" ? true : safe(t.type) === safe(typeFilter);
      const matchDate = isInDateRange(t.date, dateFilter);
      return matchSearch && matchType && matchDate;
    });
  }, [transactions, search, typeFilter, dateFilter]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Loader visible={loading} message="Loading data…" />
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: insets.top + 14,
          paddingBottom: insets.bottom + 90,
        }}
      >
        {/* HEADER */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            marginBottom: 18,
          }}
        >
          <View>
            <Text style={{ fontSize: 24, fontWeight: "800", color: C.dark }}>
              Transactions
            </Text>
            <Text style={{ fontSize: 12, color: C.muted }}>
              Managing your financial flow
            </Text>
          </View>
        </View>

        <SummaryCard transactions={filtered} />
        <SearchBar value={search} onChange={setSearch} />
        <FilterPills
          options={TYPE_FILTERS}
          selected={typeFilter}
          onSelect={setTypeFilter}
        />
        <DateChips selected={dateFilter} onSelect={setDateFilter} />

        {filtered.length > 0 && (
          <Text style={{ marginHorizontal: 16, fontSize: 11, color: C.faint }}>
            Showing {filtered.length} results
          </Text>
        )}

        {grouped.length === 0 ? (
          <EmptyState typeFilter={typeFilter} />
        ) : (
          grouped.map(([dateStr, items]) => (
            <DateGroup
              key={dateStr}
              dateStr={dateStr}
              items={items}
              onEdit={handleEditPress}
              onDelete={handleDeletePress}
            />
          ))
        )}
      </ScrollView>

      {/* ── Delete confirm modal ── */}
      <DeleteConfirmModal
        visible={!!deleteTarget}
        item={deleteTarget}
        loading={deleteLoading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* ── Add / Edit modal — one component, two modes ── */}
      <AddTransactionModal
        visible={modalVisible}
        editItem={editItem} // null → add mode | item object → edit mode
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </View>
  );
}
