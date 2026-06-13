import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase credentials not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export const getTenants = async () => {
  const { data, error } = await supabase.from("tenants").select("*");
  if (error) {
    console.error("Error fetching tenants:", error);
    return [];
  }
  return data || [];
};

export const getCandidates = async (tenantId?: string) => {
  let query = supabase.from("candidates").select("*");
  if (tenantId) {
    query = query.eq("tenant_id", tenantId);
  }
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching candidates:", error);
    return [];
  }
  return data || [];
};

export const getJobs = async (tenantId?: string) => {
  let query = supabase.from("jobs").select("*");
  if (tenantId) {
    query = query.eq("tenant_id", tenantId);
  }
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
  return data || [];
};

export const getAnalytics = async (tenantId?: string) => {
  let query = supabase.from("analytics").select("*");
  if (tenantId) {
    query = query.eq("tenant_id", tenantId);
  }
  const { data, error } = await query.order("created_at", { ascending: false }).limit(100);
  if (error) {
    console.error("Error fetching analytics:", error);
    return [];
  }
  return data || [];
};

export const updateCandidateStatus = async (candidateId: string, status: string) => {
  const { data, error } = await supabase
    .from("candidates")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", candidateId);

  if (error) {
    console.error("Error updating candidate status:", error);
    return null;
  }
  return data;
};

export const subscribeToRealtimeUpdates = (
  table: string,
  callback: (payload: any) => void
) => {
  const subscription = supabase
    .channel(`public:${table}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table },
      callback
    )
    .subscribe();

  return subscription;
};
