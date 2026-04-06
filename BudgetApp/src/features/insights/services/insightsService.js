// src/features/insights/services/insightsService.js
import { auth, db } from "@/src/services/firebase/Config";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

// ─── helpers ──────────────────────────────────────────────────────────────────

const getDateRange = (period) => {
  const now = new Date();
  let start = null;
  if (period === "Week") {
    start = new Date();
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
  }
  if (period === "Month") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  if (period === "Year") {
    start = new Date(now.getFullYear(), 0, 1);
  }
  return start;
};

const formatINR = (amount) => {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000)   return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${Math.round(amount)}`;
};

const buildChartLabels = (period) => {
  if (period === "Week")
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  if (period === "Month") return ["W1", "W2", "W3", "W4"];
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
};

const getBucket = (dateObj, period) => {
  if (period === "Week") {
    const day = dateObj.getDay();
    return day === 0 ? 6 : day - 1;
  }
  if (period === "Month") {
    const date = dateObj.getDate();
    if (date <= 7)  return 0;
    if (date <= 14) return 1;
    if (date <= 21) return 2;
    return 3;
  }
  return dateObj.getMonth();
};

const getPrevDateRange = (period) => {
  const now = new Date();
  let start = null;
  let end   = null;
  if (period === "Week") {
    end = new Date();
    end.setDate(now.getDate() - 7);
    end.setHours(23, 59, 59, 999);
    start = new Date(end);
    start.setDate(end.getDate() - 6);
    start.setHours(0, 0, 0, 0);
  }
  if (period === "Month") {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    end   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  }
  if (period === "Year") {
    start = new Date(now.getFullYear() - 1, 0, 1);
    end   = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
  }
  return { start, end };
};

// Colours used for breakdown segments — index 0 = highest category = primary purple
const CATEGORY_COLORS = [
  "#7c3aed", // primary
  "#a78bfa", // primaryLight
  "#94a3b8", // muted
  "#cbd5e1", // faint
  "#6d28d9",
  "#c4b5fd",
];

// ─── main insights service ────────────────────────────────────────────────────
// Returns: { summary, chart, breakdown, comparison }
// Goal section has been REMOVED.

export const getInsightsService = async ({ userId, period, txType }) => {
  try {
    const type  = txType.toLowerCase(); // "income" | "expense"
    const start = getDateRange(period);

    // ── 1. Current period transactions ────────────────────────────────────
    const q = query(
      collection(db, "transactions"),
      where("userId",    "==", userId),
      where("type",      "==", type),
      where("createdAt", ">=", start),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    const txs  = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      dateObj: d.data().createdAt?.toDate?.() ?? new Date(),
    }));

    // ── 2. Previous period (for comparison) ───────────────────────────────
    const { start: prevStart, end: prevEnd } = getPrevDateRange(period);
    const prevQ = query(
      collection(db, "transactions"),
      where("userId",    "==", userId),
      where("type",      "==", type),
      where("createdAt", ">=", prevStart),
      where("createdAt", "<=", prevEnd),
      orderBy("createdAt", "desc")
    );
    const prevSnap = await getDocs(prevQ);
    const prevTxs  = prevSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // ── 3. Summary ────────────────────────────────────────────────────────
    const total      = txs.reduce((s, t) => s + Number(t.amount), 0);
    const avgTxn     = txs.length ? total / txs.length : 0;
    const divisors   = { Week: 7, Month: 4, Year: 12 };
    const subLabels  = { Week: "Avg/day", Month: "Avg/week", Year: "Avg/month" };
    const subAmt     = total / divisors[period];

    const summary = {
      total:    formatINR(total),
      sub:      formatINR(Math.round(subAmt)),
      subLabel: subLabels[period],
      avg:      formatINR(Math.round(avgTxn)),
      avgLabel: period === "Year" ? "Avg/day" : "Avg txn",
    };

    // ── 4. Chart values — rounded integers so Y-axis stays clean ─────────
    const labels = buildChartLabels(period);
    const values = new Array(labels.length).fill(0);
    txs.forEach((t) => {
      const bucket = getBucket(t.dateObj, period);
      if (bucket >= 0 && bucket < values.length) {
        values[bucket] += Number(t.amount);
      }
    });
    const chart = { labels, values: values.map((v) => Math.round(v)) };

    // ── 5. Category breakdown ─────────────────────────────────────────────
    const catMap = {};
    txs.forEach((t) => {
      const cat = t.category || "Other";
      catMap[cat] = (catMap[cat] || 0) + Number(t.amount);
    });
    const sortedCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
    const breakdown  = sortedCats.map(([label, amt], i) => ({
      label,
      pct:   total > 0 ? Math.round((amt / total) * 100) : 0,
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
    }));

    // ── 6. Period comparison ──────────────────────────────────────────────
    const prevTotal = prevTxs.reduce((s, t) => s + Number(t.amount), 0);
    const diff =
      prevTotal > 0
        ? Math.round(((total - prevTotal) / prevTotal) * 100)
        : 0;

    const now = new Date();
    const periodLabelMap = {
      Week: { last: "Last Week", this: "This Week" },
      Month: {
        last: new Date(now.getFullYear(), now.getMonth() - 1, 1).toLocaleString(
          "default", { month: "long", year: "numeric" }
        ),
        this: now.toLocaleString("default", { month: "long", year: "numeric" }),
      },
      Year: {
        last: `${now.getFullYear() - 1}`,
        this: `${now.getFullYear()}`,
      },
    };

    const comparison = {
      lastLabel: periodLabelMap[period].last,
      lastAmt:   formatINR(prevTotal),
      lastTx:    prevTxs.length,
      thisLabel: periodLabelMap[period].this,
      thisAmt:   formatINR(total),
      thisTx:    txs.length,
      diff,
    };

    // Goal section removed ✅
    return { summary, chart, breakdown, comparison };
  } catch (error) {
    console.log("GET INSIGHTS ERROR:", error);
    throw error;
  }
};

// ─── daily activity service ───────────────────────────────────────────────────
// Independent of the period/type filter.
// Returns every day from the user's FIRST ever transaction → today,
// with a count of how many transactions were added on each day.

export const getDailyActivityService = async ({ userId }) => {
  try {
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", userId),
      orderBy("createdAt", "asc")  // oldest first so first doc = start date
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      return { activityMap: {}, startDate: null, endDate: null };
    }

    // Build map: "YYYY-MM-DD" → number of transactions on that day
    const activityMap = {};
    snap.docs.forEach((d) => {
      const dateObj = d.data().createdAt?.toDate?.();
      if (!dateObj) return;
      const key = dateObj.toISOString().split("T")[0];
      activityMap[key] = (activityMap[key] || 0) + 1;
    });

    // startDate = user's very first transaction date
    const firstDoc  = snap.docs[0].data();
    const startDate = firstDoc.createdAt?.toDate?.()?.toISOString().split("T")[0] ?? null;

    // endDate = today
    const endDate = new Date().toISOString().split("T")[0];

    return { activityMap, startDate, endDate };
  } catch (error) {
    console.log("GET DAILY ACTIVITY ERROR:", error);
    throw error;
  }
};