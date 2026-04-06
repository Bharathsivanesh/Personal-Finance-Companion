// src/features/insights/hooks/useInsights.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { getInsightsService } from "../services/insightsService";
import { useTransactionRefresh } from "@/src/context/TransactionContext";
/**
 * Main insights hook — refetches when period or txType changes.
 * Returns: { data, loading, error, refetch }
 * data shape: { summary, chart, breakdown, comparison }  (no goal)
 */
export const useInsights = (period, txType) => {
  const { user } = useAuth();
  const { refreshKey } = useTransactionRefresh();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user?.uid) return;
    try {
      setLoading(true);
      setError(null);
      const result = await getInsightsService({
        userId: user.uid,
        period,
        txType,
      });
      setData(result);
    } catch (err) {
      console.log("useInsights error:", err);
      setError("Failed to load insights");
    } finally {
      setLoading(false);
    }
  }, [user?.uid, period, txType, refreshKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
