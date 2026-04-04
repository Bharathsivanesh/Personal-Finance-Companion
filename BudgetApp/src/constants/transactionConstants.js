// Tabs
export const TABS = Object.freeze([
  { key: "expense",  label: "Expense",  color: "#ef4444", icon: "trending-down" },
  { key: "income",   label: "Income",   color: "#22c55e", icon: "trending-up" },
  { key: "transfer", label: "Transfer", color: "#7c3aed", icon: "swap-horizontal" },
]);

// Expense Categories
export const EXPENSE_CATEGORIES = Object.freeze([
  { label: "Dining & Food", value: "dining", icon: "restaurant" },
  { label: "Shopping", value: "shopping", icon: "bag-handle" },
  { label: "Transport", value: "transport", icon: "car" },
  { label: "Entertainment", value: "entertainment", icon: "film" },
  { label: "Health", value: "health", icon: "medkit" },
  { label: "Education", value: "education", icon: "book" },
  { label: "Rent / Housing", value: "rent", icon: "home" },
  { label: "Utilities", value: "utilities", icon: "flash" },
  { label: "Travel", value: "travel", icon: "airplane" },
  { label: "Other", value: "other", icon: "ellipsis-horizontal" },
]);

// Income Categories
export const INCOME_CATEGORIES = Object.freeze([
  { label: "Salary", value: "salary", icon: "cash" },
  { label: "Freelance", value: "freelance", icon: "laptop" },
  { label: "Investment", value: "investment", icon: "trending-up" },
  { label: "Gift", value: "gift", icon: "gift" },
  { label: "Other", value: "other", icon: "ellipsis-horizontal" },
]);

// Transfer Categories
export const TRANSFER_CATEGORIES = Object.freeze([
  { label: "Bank Transfer", value: "bank", icon: "business" },
  { label: "Wallet Transfer", value: "wallet", icon: "wallet" },
  { label: "Other", value: "other", icon: "ellipsis-horizontal" },
]);

// Payment Modes
export const PAYMENT_MODES = Object.freeze([
  { label: "Cash", value: "cash", icon: "cash-outline" },
  { label: "UPI / Online", value: "upi", icon: "phone-portrait" },
  { label: "Credit Card", value: "credit_card", icon: "card" },
  { label: "Debit Card", value: "debit_card", icon: "card-outline" },
  { label: "Net Banking", value: "net_banking", icon: "globe" },
  { label: "Apple Pay", value: "apple_pay", icon: "logo-apple" },
  { label: "Google Pay", value: "google_pay", icon: "logo-google" },
]);

// Save Button Gradients
export const SAVE_GRADIENTS = Object.freeze({
  expense: ["#f87171", "#ef4444"],
  income: ["#4ade80", "#22c55e"],
  transfer: ["#a78bfa", "#7c3aed"],
});