// src/features/Aiassistant/services/aiService.js
import { getTransactionsservice } from "@/src/features/transaction/services/transactionService";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY; // 🔑 replace with your key
const GEMINI_ENDPOINT = process.env.EXPO_PUBLIC_GEMINI_ENDPOINT;

// ── Build a rich financial context string from the user's transactions ────────
const buildFinancialContext = (transactions) => {
  if (!transactions?.length) {
    return "The user has no transactions recorded yet.";
  }

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  // Filter this month's transactions
  const thisMonth = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const income = thisMonth.filter((t) => t.type === "income");
  const expenses = thisMonth.filter((t) => t.type === "expense");
  const transfers = thisMonth.filter((t) => t.type === "transfer");

  const totalIncome = income.reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = expenses.reduce((s, t) => s + Number(t.amount), 0);
  const netSavings = totalIncome - totalExpense;
  const savingsRate =
    totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : "0";

  // Category breakdown for expenses
  const catMap = {};
  expenses.forEach((t) => {
    const cat = t.category || "Uncategorized";
    catMap[cat] = (catMap[cat] || 0) + Number(t.amount);
  });
  const categoryBreakdown = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => `  - ${cat}: ₹${amt.toLocaleString("en-IN")}`)
    .join("\n");

  // Recent 10 transactions for context
  const recent = transactions
    .slice(0, 10)
    .map(
      (t) =>
        `  [${t.date}] ${t.type.toUpperCase()} | ${t.category || "N/A"} | ₹${Number(t.amount).toLocaleString("en-IN")} | ${t.notes || t.paymentMode || ""}`,
    )
    .join("\n");

  // All-time totals
  const allTimeIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);
  const allTimeExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);

  return `
=== USER FINANCIAL DATA ===

📅 Current Month (${now.toLocaleString("default", { month: "long", year: "numeric" })}):
  Total Income:    ₹${totalIncome.toLocaleString("en-IN")}
  Total Expenses:  ₹${totalExpense.toLocaleString("en-IN")}
  Net Savings:     ₹${netSavings.toLocaleString("en-IN")}
  Savings Rate:    ${savingsRate}%
  Transactions:    ${thisMonth.length} (${income.length} income, ${expenses.length} expense, ${transfers.length} transfer)

📊 Expense Category Breakdown (this month):
${categoryBreakdown || "  No expenses this month"}

📈 All-Time Overview:
  Total Income:    ₹${allTimeIncome.toLocaleString("en-IN")}
  Total Expenses:  ₹${allTimeExpense.toLocaleString("en-IN")}
  Net Balance:     ₹${(allTimeIncome - allTimeExpense).toLocaleString("en-IN")}

🕐 Recent 10 Transactions:
${recent}
`.trim();
};

// ── System prompt — defines AI's personality and behaviour ──────────────────
const SYSTEM_PROMPT = `You are AI, a friendly and smart personal finance AI assistant built into a budget tracking app called BudgetApp.

Your job is to help users understand their spending habits, income patterns, and give actionable financial advice based on their REAL transaction data provided below.

Guidelines:
- Always refer to the user's actual transaction data when answering
- Be concise, warm, and encouraging — not robotic
- Use ₹ (Indian Rupee) for all amounts
- Format numbers in Indian style (e.g., ₹1,25,000)
- Use **bold** for important numbers and key insights
- Use emojis sparingly but effectively (💰 💸 📊 ✅ 🎯 💡)
- Keep responses under 120 words unless a detailed breakdown is requested
- If data is missing or unclear, say so honestly
- Never make up transaction data — only use what is provided
- Give practical, actionable advice specific to the user's situation`;

// ── Main service function ─────────────────────────────────────────────────────

/**
 * Sends the user's message + their full financial context to Gemini
 * and returns the AI response as a string.
 *
 * @param {{ userMessage: string, userId: string, conversationHistory: Array }}
 * @returns Promise<string>
 */
export const sendToGeminiService = async ({
  userMessage,
  userId,
  conversationHistory = [],
}) => {
  try {
    // 1. Fetch user's real transactions
    const transactions = await getTransactionsservice({ userId });
    const financialContext = buildFinancialContext(transactions);

    // 2. Build conversation history for multi-turn context
    //    Gemini expects: [{ role: "user"|"model", parts: [{ text }] }]
    const history = conversationHistory.map((m) => ({
      role: m.role === "ai" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

    // 3. Build the full prompt — system context + financial data + user question
    const fullUserMessage = `${SYSTEM_PROMPT}

${financialContext}

===

User question: ${userMessage}`;

    // 4. Contents array: history + current message
    const contents = [
      ...history,
      { role: "user", parts: [{ text: fullUserMessage }] },
    ];

    // 5. Call Gemini API
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 400,
          topP: 0.9,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.log("Gemini API error:", err);
      throw new Error(err?.error?.message || "Gemini API failed");
    }

    const result = await response.json();

    // 6. Extract text from response
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;

    if (!text) throw new Error("Empty response from Gemini");

    return text.trim();
  } catch (error) {
    console.log("sendToGeminiService error:", error);
    throw error;
  }
};
