// src/features/add/screens/AddTransactionModal.jsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  Alert,
  Dimensions,
} from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import SelectPicker from "../../../components/common/SelectPicker";
import SectionLabel from "../components/SectionLabel";
import AttachmentSection from "../components/AttachmentSection";
import {
  TABS,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  TRANSFER_CATEGORIES,
  PAYMENT_MODES,
  SAVE_GRADIENTS,
} from "../../../constants/transactionConstants";
import {
  addTransactionservice,
  updateTransactionservice,
} from "../../transaction/services/transactionService";
import { useToast } from "@/src/components/ui/Toast";
import Loader from "@/src/components/ui/Loader";
import { uploadFile } from "../components/uploadFile";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const EMPTY_FORM = {
  amount: "",
  category: "",
  paymentMode: "",
  notes: "",
  attachment: null,
};

const TypeTab = React.memo(function TypeTab({ tab, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={() => onPress(tab.key)}
      activeOpacity={0.8}
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        paddingVertical: 9,
        borderRadius: 12,
        backgroundColor: active ? "#ffffff" : "transparent",
        shadowColor: active ? tab.color : "transparent",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: active ? 0.18 : 0,
        shadowRadius: 4,
        elevation: active ? 3 : 0,
      }}
    >
      <Ionicons
        name={tab.icon}
        size={13}
        color={active ? tab.color : "#9ca3af"}
      />
      <Text
        style={{
          fontSize: 13,
          fontWeight: "700",
          color: active ? tab.color : "#9ca3af",
        }}
      >
        {tab.label}
      </Text>
    </TouchableOpacity>
  );
});

export default function AddTransactionModal({
  visible,
  onClose,
  onSuccess,
  editItem,
}) {
  // ─── mode ─────────────────────────────────────────────────────────────────
  const isEditMode = !!editItem;

  // ─── form state ───────────────────────────────────────────────────────────
  const [type, setType] = useState("expense");
  const [expenseForm, setExpenseForm] = useState({ ...EMPTY_FORM });
  const [incomeForm, setIncomeForm] = useState({ ...EMPTY_FORM });
  const [transferForm, setTransferForm] = useState({ ...EMPTY_FORM });

  const scrollRef = useRef(null);

  // ─── seed form when switching to edit mode ────────────────────────────────
  useEffect(() => {
    if (isEditMode && visible) {
      const t = editItem.type ?? "expense";
      setType(t);

      const seeded = {
        amount: editItem.amount ? String(editItem.amount) : "",
        category: editItem.category ?? "",
        paymentMode: editItem.paymentMode ?? "",
        notes: editItem.notes ?? "",
        attachment: editItem.attachmentUrl
          ? { type: "image", uri: editItem.attachmentUrl, name: "attachment" }
          : null,
      };

      if (t === "expense") setExpenseForm(seeded);
      else if (t === "income") setIncomeForm(seeded);
      else setTransferForm(seeded);
    }
  }, [isEditMode, visible, editItem]);

  // ─── active form for current type ─────────────────────────────────────────
  const { form, setForm } = {
    expense: { form: expenseForm, setForm: setExpenseForm },
    income: { form: incomeForm, setForm: setIncomeForm },
    transfer: { form: transferForm, setForm: setTransferForm },
  }[type];

  const activeColor = TABS.find((t) => t.key === type)?.color ?? "#ef4444";

  const categories =
    type === "expense"
      ? EXPENSE_CATEGORIES
      : type === "income"
        ? INCOME_CATEGORIES
        : TRANSFER_CATEGORIES;

  const setField = useCallback(
    (field, value) => setForm((prev) => ({ ...prev, [field]: value })),
    [setForm],
  );

  const handleTypeChange = useCallback((key) => {
    setType(key);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  // ─── attachment pickers ───────────────────────────────────────────────────
  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Allow access to photos to attach an image.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      setField("attachment", {
        type: "image",
        uri: asset.uri,
        name: asset.fileName ?? asset.uri.split("/").pop() ?? "image.jpg",
      });
    }
  }

  async function handlePickDocument() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.length > 0) {
        const asset = result.assets[0];
        setField("attachment", {
          type: "document",
          uri: asset.uri,
          name: asset.name,
        });
      }
    } catch {
      Alert.alert("Error", "Could not open document picker.");
    }
  }

  // ─── save / update ────────────────────────────────────────────────────────
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    // Validation
    if (!form.amount || parseFloat(form.amount) <= 0) {
      Toast.show({ type: "info", text1: "Invalid amount" });
      return;
    }
    if (type !== "transfer" && !form.category) {
      Toast.show({ type: "info", text1: "Category required" });
      return;
    }

    try {
      setLoading(true);

      // Attachment upload — skip if it's the existing remote URL unchanged
      let attachmentUrl = editItem?.attachmentUrl ?? "";
      if (form.attachment && form.attachment.uri !== editItem?.attachmentUrl) {
        attachmentUrl = await uploadFile(form.attachment);
      } else if (!form.attachment) {
        attachmentUrl = ""; // user removed it
      }

      const payload = {
        type,
        amount: form.amount,
        category: form.category,
        paymentMode: form.paymentMode,
        fromAccount: form.fromAccount,
        toAccount: form.toAccount,
        notes: form.notes,
        attachmentUrl,
      };

      if (isEditMode) {
        await updateTransactionservice(editItem.id, payload);
        Toast.show({
          type: "success",
          text1: "Transaction updated successfully",
        });
      } else {
        await addTransactionservice(payload);
        Toast.show({
          type: "success",
          text1: "Transaction added successfully",
        });
      }

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: isEditMode
          ? "Failed to update transaction"
          : "Failed to save transaction",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    // Reset all forms on close
    setExpenseForm({ ...EMPTY_FORM });
    setIncomeForm({ ...EMPTY_FORM });
    setTransferForm({ ...EMPTY_FORM });
    setType("expense");
    onClose();
  }

  // ─── render ───────────────────────────────────────────────────────────────
  return (
    <>
      <Loader
        visible={loading}
        message={isEditMode ? "Updating transaction…" : "Saving transaction…"}
      />

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={handleClose}
      >
        <Pressable
          onPress={handleClose}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: "#ffffff",
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              maxHeight: SCREEN_HEIGHT * 0.88,
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
                marginTop: 12,
                marginBottom: 6,
              }}
            />

            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#f3f4f6",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                {/* Edit mode shows a purple accent bar */}
                {isEditMode && (
                  <View
                    style={{
                      width: 4,
                      height: 22,
                      borderRadius: 2,
                      backgroundColor: "#7c3aed",
                    }}
                  />
                )}
                <Text
                  style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}
                >
                  {isEditMode ? "Edit Transaction" : "Add Transaction"}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: "#f3f4f6",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="close" size={16} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Type Tabs */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#f3f4f6",
                borderRadius: 14,
                padding: 4,
                marginHorizontal: 20,
                marginTop: 16,
                marginBottom: 4,
              }}
            >
              {TABS.map((tab) => (
                <TypeTab
                  key={tab.key}
                  tab={tab}
                  active={type === tab.key}
                  onPress={handleTypeChange}
                />
              ))}
            </View>

            {/* Scrollable body */}
            <ScrollView
              ref={scrollRef}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 16,
                paddingBottom: 24,
              }}
            >
              {/* Amount */}
              <SectionLabel text="Amount" />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#f9fafb",
                  borderWidth: 1.5,
                  borderColor: form.amount ? activeColor : "#e5e7eb",
                  borderRadius: 14,
                  paddingHorizontal: 14,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "700",
                    color: activeColor,
                    marginRight: 4,
                  }}
                >
                  ₹
                </Text>
                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 32,
                    fontWeight: "700",
                    color: "#111827",
                    paddingVertical: 12,
                  }}
                  placeholder="0.00"
                  placeholderTextColor="#d1d5db"
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  value={form.amount}
                  onChangeText={(v) => setField("amount", v)}
                />
              </View>

              {/* Category */}
              {type !== "transfer" && (
                <SelectPicker
                  label="Category"
                  value={form.category}
                  options={categories}
                  onChange={(v) => setField("category", v)}
                  placeholder="Select category"
                  accentColor={activeColor}
                />
              )}

              {/* Payment Mode */}
              {type !== "transfer" && (
                <SelectPicker
                  label="Payment Mode"
                  value={form.paymentMode}
                  options={PAYMENT_MODES}
                  onChange={(v) => setField("paymentMode", v)}
                  placeholder="Select payment mode"
                  accentColor={activeColor}
                />
              )}

              {/* Transfer accounts */}
              {type === "transfer" && (
                <>
                  <SelectPicker
                    label="From Account"
                    value={form.fromAccount}
                    options={PAYMENT_MODES}
                    onChange={(v) => setField("fromAccount", v)}
                    placeholder="Select source"
                    accentColor={activeColor}
                  />
                  <SelectPicker
                    label="To Account"
                    value={form.toAccount}
                    options={PAYMENT_MODES}
                    onChange={(v) => setField("toAccount", v)}
                    placeholder="Select destination"
                    accentColor={activeColor}
                  />
                </>
              )}

              {/* Notes */}
              <SectionLabel text="Notes" optional />
              <TextInput
                style={{
                  backgroundColor: "#f9fafb",
                  borderWidth: 1.2,
                  borderColor: "#e5e7eb",
                  borderRadius: 14,
                  paddingHorizontal: 14,
                  paddingTop: 12,
                  paddingBottom: 12,
                  fontSize: 14,
                  color: "#374151",
                  minHeight: 90,
                  marginBottom: 16,
                  textAlignVertical: "top",
                }}
                placeholder="What was this for?"
                placeholderTextColor="#d1d5db"
                multiline
                value={form.notes}
                onChangeText={(v) => setField("notes", v)}
                blurOnSubmit
                returnKeyType="done"
              />

              <AttachmentSection
                attachment={form.attachment}
                accentColor={activeColor}
                onPickImage={handlePickImage}
                onPickDocument={handlePickDocument}
                onRemove={() => setField("attachment", null)}
              />

              {/* Save / Update Button */}
              <TouchableOpacity
                onPress={handleSave}
                activeOpacity={0.85}
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  shadowColor: activeColor,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.35,
                  shadowRadius: 10,
                  elevation: 8,
                  marginTop: 4,
                }}
              >
                <LinearGradient
                  colors={SAVE_GRADIENTS[type]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    paddingVertical: 16,
                    borderRadius: 16,
                  }}
                >
                  <Ionicons
                    name={isEditMode ? "create-outline" : "checkmark-circle"}
                    size={20}
                    color="#fff"
                  />
                  <Text
                    style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}
                  >
                    {isEditMode ? "Update Transaction" : "Save Transaction"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
