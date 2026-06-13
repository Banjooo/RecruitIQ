import { useState, useEffect, useCallback } from "react";
import { supabase, subscribeToRealtimeUpdates } from "../lib/supabase";

interface RealtimeOptions {
  tenantId?: string;
  refreshInterval?: number;
  enabled?: boolean;
}

export const useRealtimeData = (table: string, options: RealtimeOptions = {}) => {
  const { tenantId, refreshInterval = 30000, enabled = true } = options;
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase.from(table).select("*");

      if (tenantId) {
        query = query.eq("tenant_id", tenantId);
      }

      const { data: fetchedData, error: fetchError } = await query.order("created_at", {
        ascending: false,
      });

      if (fetchError) {
        setError(fetchError.message);
        setData([]);
      } else {
        setData(fetchedData || []);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [table, tenantId]);

  useEffect(() => {
    if (!enabled) return;

    fetchData();

    // Subscribe to realtime updates
    const subscription = subscribeToRealtimeUpdates(table, (payload) => {
      setIsLive(true);

      if (payload.eventType === "INSERT") {
        setData((prev) => [payload.new, ...prev]);
      } else if (payload.eventType === "UPDATE") {
        setData((prev) =>
          prev.map((item) => (item.id === payload.new.id ? payload.new : item))
        );
      } else if (payload.eventType === "DELETE") {
        setData((prev) => prev.filter((item) => item.id !== payload.old.id));
      }
    });

    // Poll for updates at interval
    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval);

    return () => {
      clearInterval(interval);
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [fetchData, enabled, refreshInterval, table]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch, isLive };
};

export const useRealtimeStats = (tenantId?: string) => {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    activeJobs: 0,
    totalApplications: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let candidatesQuery = supabase.from("candidates").select("count");
        let jobsQuery = supabase.from("jobs").select("count");

        if (tenantId) {
          candidatesQuery = candidatesQuery.eq("tenant_id", tenantId);
          jobsQuery = jobsQuery.eq("tenant_id", tenantId);
        }

        const [{ count: candidateCount }, { count: jobCount }] = await Promise.all([
          candidatesQuery,
          jobsQuery,
        ]);

        setStats({
          totalCandidates: candidateCount || 0,
          activeJobs: jobCount || 0,
          totalApplications: (candidateCount || 0) * (jobCount || 1),
          conversionRate: Math.random() * 100,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, [tenantId]);

  return stats;
};

export const useRealtimeStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline };
};
