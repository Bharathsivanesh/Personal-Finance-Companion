// src/features/insights/hooks/useDailyActivity.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { getDailyActivityService } from "../services/insightsService";

/**
 * Fetches daily activity data independently of the period/type filter.
 * This is called ONCE when the screen mounts and never changes on filter switch.
 *
 * Returns:
 *   activityMap  — { "2024-03-15": 3, "2024-03-16": 1, ... }
 *   startDate    — "YYYY-MM-DD" of user's first ever transaction
 *   endDate      — "YYYY-MM-DD" of today
 *   loading      — boolean
 *   error        — string | null
 */
export const useDailyActivity = () => {
  const { user } = useAuth();
  const [activityMap, setActivityMap] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user?.uid) return;
    try {
      setLoading(true);
      setError(null);
      const result = await getDailyActivityService({ userId: user.uid });
      console.log("Daily activity result:", result);
      setActivityMap(result.activityMap);
      setStartDate(result.startDate);
      setEndDate(result.endDate);
    } catch (err) {
      console.log("useDailyActivity error:", err);
      setError("Failed to load activity");
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { activityMap, startDate, endDate, loading, error };
};
