export function formatTransaction(item) {
  const isIncome = item.type === "income";
  const isExpense = item.type === "expense";
  const isTransfer = item.type === "transfer";

  return {
    ...item,

    // ✅ TITLE
    title: isTransfer ? "Transfer" : item.category || "Other",

    // ✅ SUBTITLE
    subtitle: isTransfer
      ? `${item.fromAccount} → ${item.toAccount}`
      : item.paymentMode || item.notes || "",

    // ✅ ICON
    icon: isIncome ? "cash" : isExpense ? "card" : "swap-horizontal",

    // ✅ ICON COLOR
    iconColor: isIncome ? "#22c55e" : isExpense ? "#f59e0b" : "#7c3aed",

    // ✅ ICON BACKGROUND
    iconBg: isIncome ? "#e8fdf0" : isExpense ? "#fef3e2" : "#f3e8ff",
  };
}
