import C from "../../../constants/colors";
export function formatGroupDate(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const diff = (today - d) / 86400000;
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function groupByDate(list) {
  const map = {};
  list.forEach((t) => {
    if (!map[t.date]) map[t.date] = [];
    map[t.date].push(t);
  });
  return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
}

export function isInDateRange(dateStr, range) {
  const d = new Date(dateStr);
  const now = new Date();
  if (range === "Today") return d.toDateString() === now.toDateString();
  if (range === "This Week") {
    const s = new Date(now);
    s.setDate(now.getDate() - now.getDay());
    s.setHours(0, 0, 0, 0);
    return d >= s;
  }
  if (range === "This Month")
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  return true;
}

export function badgeStyle(type) {
  if (type === "income")
    return { bg: C.greenBg, color: C.green, label: "CREDIT" };
  if (type === "transfer")
    return { bg: C.blueBg, color: C.blue, label: "TRANSFER" };
  return { bg: C.redBg, color: C.red, label: "DEBIT" };
}
export function amountColor(type) {
  if (type === "income") return C.green;
  if (type === "transfer") return C.blue;
  return C.red;
}
export function amountSign(type) {
  if (type === "income") return "+";
  if (type === "transfer") return "↕";
  return "-";
}

export const TRANSACTIONS = [
  {
    id: "1",
    icon: "cash",
    iconBg: C.greenBg,
    iconColor: C.green,
    title: "Salary",
    subtitle: "Monthly Income",
    date: "2026-04-03",
    time: "01:26 AM",
    amount: "50000.00",
    type: "income",
  },
  {
    id: "2",
    icon: "gift",
    iconBg: "#fef3e2",
    iconColor: "#f59e0b",
    title: "Fun & Holiday Expenses",
    subtitle: "Hotel Rent/Food",
    date: "2026-04-03",
    time: "01:25 AM",
    amount: "1000.00",
    type: "expense",
  },
  {
    id: "3",
    icon: "restaurant",
    iconBg: "#fce7f3",
    iconColor: "#ec4899",
    title: "Artisan Kitchen",
    subtitle: "Dining & Drinks",
    date: "2026-04-03",
    time: "12:30 PM",
    amount: "425.00",
    type: "expense",
  },
  {
    id: "4",
    icon: "swap-horizontal",
    iconBg: C.blueBg,
    iconColor: C.blue,
    title: "Transfer to Savings",
    subtitle: "HDFC → SBI",
    date: "2026-04-03",
    time: "08:00 AM",
    amount: "5000.00",
    type: "transfer",
  },
  {
    id: "5",
    icon: "car",
    iconBg: "#fef3e2",
    iconColor: "#f59e0b",
    title: "Petrol",
    subtitle: "Transport",
    date: "2026-04-02",
    time: "09:10 AM",
    amount: "184.00",
    type: "expense",
  },
  {
    id: "6",
    icon: "trending-up",
    iconBg: C.greenBg,
    iconColor: C.green,
    title: "Freelance Payment",
    subtitle: "Web Project",
    date: "2026-04-02",
    time: "03:45 PM",
    amount: "12000.00",
    type: "income",
  },
  {
    id: "7",
    icon: "cart",
    iconBg: "#ede9fe",
    iconColor: C.primary,
    title: "Minimalist Store",
    subtitle: "Lifestyle",
    date: "2026-04-02",
    time: "06:20 PM",
    amount: "1280.00",
    type: "expense",
  },
  {
    id: "8",
    icon: "swap-horizontal",
    iconBg: C.blueBg,
    iconColor: C.blue,
    title: "Self Transfer",
    subtitle: "Wallet → Bank",
    date: "2026-04-02",
    time: "02:00 PM",
    amount: "2000.00",
    type: "transfer",
  },
  {
    id: "9",
    icon: "flash",
    iconBg: "#fef3e2",
    iconColor: "#f59e0b",
    title: "Electricity Bill",
    subtitle: "Utilities",
    date: "2026-04-01",
    time: "10:00 AM",
    amount: "540.00",
    type: "expense",
  },
  {
    id: "10",
    icon: "medkit",
    iconBg: "#fce7f3",
    iconColor: "#ec4899",
    title: "Pharmacy",
    subtitle: "Healthcare",
    date: "2026-03-31",
    time: "02:15 PM",
    amount: "320.00",
    type: "expense",
  },
  {
    id: "11",
    icon: "school",
    iconBg: "#ede9fe",
    iconColor: C.primary,
    title: "Course Subscription",
    subtitle: "Education",
    date: "2026-03-31",
    time: "08:00 AM",
    amount: "999.00",
    type: "expense",
  },
];

export const TYPE_FILTERS = ["All", "Income", "Expense", "Transfer"];
export const DATE_FILTERS = ["All Time", "Today", "This Week", "This Month"];
