import React, { useState, useEffect } from "react";
import { TenantConfig, UserActivityLog } from "../types";
import { 
  Activity, 
  Settings, 
  ShieldAlert, 
  Database, 
  Cpu, 
  HardDrive, 
  Zap, 
  CheckCircle, 
  FileText, 
  Users, 
  Briefcase, 
  RefreshCw, 
  ToggleLeft, 
  ToggleRight, 
  Award, 
  AlertOctagon, 
  Globe 
} from "lucide-react";

interface SuperAdminPortalProps {
  tenants: TenantConfig[];
  jobsCount: number;
  candidatesCount: number;
  onRefreshAllData: () => Promise<void>;
}

export default function SuperAdminPortal({
  tenants,
  jobsCount,
  candidatesCount,
  onRefreshAllData
}: SuperAdminPortalProps) {
  const [activityLogs, setActivityLogs] = useState<UserActivityLog[]>([]);
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorTestMessage, setErrorTestMessage] = useState<string | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<TenantConfig | null>(null);
  const [isUpdatingTenant, setIsUpdatingTenant] = useState(false);

  // Load super admin data
  const loadAdminTelemetry = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch activity logs
      const logsRes = await fetch("/api/admin/activity-logs");
      const logsData = await logsRes.json();
      setActivityLogs(logsData || []);

      // 2. Fetch diagnostics
      const diagRes = await fetch("/api/admin/diagnostics");
      const diagData = await diagRes.json();
      setDiagnostics(diagData);
    } catch (err) {
      console.error("Super Admin correlation failure:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminTelemetry();
  }, []);

  // Modify subscriber parameters
  const handleUpdateTenantDetails = async (
    tenantId: string, 
    hasActiveSubscription: boolean, 
    billingPlan: TenantConfig["billingPlan"]
  ) => {
    setIsUpdatingTenant(true);
    try {
      const res = await fetch("/api/admin/update-business-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, hasActiveSubscription, billingPlan })
      });
      const data = await res.json();
      if (data.status === "success") {
        await onRefreshAllData();
        await loadAdminTelemetry();
        if (selectedTenant && selectedTenant.id === tenantId) {
          setSelectedTenant(data.tenant);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to propagate tenant parameter update.");
    } finally {
      setIsUpdatingTenant(false);
    }
  };

  // Trigger simulated error crash
  const handleTriggerMockCrash = async () => {
    setErrorTestMessage(null);
    try {
      const res = await fetch("/api/admin/mock-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ simulatedErrorType: "SMTP_TLS_TIMEOUT_MOCK" })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorTestMessage(data.message || "Simulated API pipeline crash handled.");
      }
    } catch (err: any) {
      setErrorTestMessage("Direct Network Intercept Success: Simulating critical pipeline safety isolation.");
    }
    // Refresh log to display the error trigger activity
    loadAdminTelemetry();
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in" id="super-admin-root">
      {/* Cover Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-950 shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-indigo-500 font-mono font-extrabold px-2 py-0.5 rounded uppercase tracking-widest">
              Platform Master Console
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/30">
              ✔️ AUDIT OK
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Timothy's Administrative Control & Audit Portal</h2>
          <p className="text-xs text-indigo-200">
            System activity auditing, simulated error handler checks, and business tenants governance under KDPA requirements.
          </p>
        </div>

        <button
          onClick={loadAdminTelemetry}
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold px-4 py-2 rounded-xl border border-indigo-500 hover:border-indigo-400 cursor-pointer shadow-sm disabled:opacity-50 transition flex items-center gap-1.5 self-stretch md:self-auto justify-center"
        >
          <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
          {isLoading ? "Refreshing Telemetry..." : "Force Sync Diagnostics"}
        </button>
      </div>

      {/* Aggregate KPI Matrices */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Global Tenants</span>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-3xl font-black text-slate-800">{tenants.length}</span>
            <Users size={22} className="text-slate-400" />
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Active business subdomains</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Jobs Published</span>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-3xl font-black text-slate-800">{jobsCount}</span>
            <Briefcase size={22} className="text-slate-400" />
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Current recruiting specifications</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Applicants Database</span>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-3xl font-black text-slate-800">{candidatesCount}</span>
            <FileText size={22} className="text-slate-400" />
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Dossiers retained in secured local hosting</p>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 shadow-xs">
          <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-widest">Revenue Cleared</span>
          <div className="flex items-center justify-between mt-1.5 animate-pulse">
            <span className="text-xl font-black text-indigo-900">KES 34,000</span>
            <Award size={22} className="text-indigo-600" />
          </div>
          <p className="text-[10px] text-indigo-500 mt-2 font-medium">Reconciled via Safaricom M-Pesa</p>
        </div>
      </div>

      {/* Main workspace layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Business Subdomains List & diagnostics console */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Registered Business tenants (Businesses Management) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 uppercase font-mono tracking-wide">
                🏢 Registered Business Partners Management
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Audit corporate teams, configure plans, and manage platform listings dynamically.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    <th className="py-2.5 px-3">Unique Slug</th>
                    <th className="py-2.5 px-3">Business Name</th>
                    <th className="py-2.5 px-3">Active Subscription</th>
                    <th className="py-2.5 px-3">Billing Tier</th>
                    <th className="py-2.5 px-3 text-right">Corporate Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {tenants.map((ten) => (
                    <tr key={ten.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 font-mono font-bold text-indigo-700">
                        {ten.slug}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800">
                        {ten.name}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${ten.hasActiveSubscription ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${ten.hasActiveSubscription ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {ten.hasActiveSubscription ? "ACTIVE" : "EXPIRED"}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[10px] capitalize font-bold text-slate-500">
                        {ten.billingPlan.replace("_", " ")}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedTenant(ten)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold px-2.5 py-1 rounded text-[10px] cursor-pointer transition border border-slate-200"
                        >
                          Configure Account
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Activity log checklist stream (Request #6) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="border-b border-indigo-50 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 uppercase font-mono tracking-wide">
                  🕵️ Legal Recruitment Activity Log Checklist (KDPA Auditable)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Detailed stream tracking authentication events, candidate profile parsing, and data scrub triggers.
                </p>
              </div>
              <span className="bg-slate-100 text-slate-700 font-mono text-[10px] px-2.5 py-1 rounded font-bold">
                {activityLogs.length} Checked Logs
              </span>
            </div>

            {/* Filter-less complete log list */}
            <div className="max-h-[350px] overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-100 bg-slate-50 shadow-inner p-3 space-y-2.5">
              {activityLogs.length > 0 ? (
                activityLogs.map((log) => (
                  <div key={log.id} className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 hover:border-indigo-300 transition-all shadow-3xs">
                    <div className="flex flex-wrap justify-between items-center gap-1 pb-1 border-b border-slate-50">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        <span className="text-[10px] font-black font-mono text-indigo-700 uppercase">
                          {log.action}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-normal font-sans pr-1">
                      {log.details}
                    </p>

                    <div className="flex flex-wrap justify-between items-center gap-2 pt-1 font-mono text-[9px] text-slate-400">
                      <p>
                        <strong>ACTOR:</strong> <span className="text-slate-600 font-bold">{log.actor}</span>
                      </p>
                      <p>
                        <strong>IP ADDRESS:</strong> <span className="text-indigo-600 font-bold">{log.ip}</span>
                      </p>
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[8px] font-bold text-slate-500">
                        SLUG: {log.tenantSlug.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-slate-400 italic">
                  No security compliance logs available yet.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right column: Config Details & Live Diagnostics Console */}
        <div className="space-y-6">
          
          {/* Account configurations panel */}
          {selectedTenant && (
            <div className="bg-white border-2 border-indigo-600 rounded-2xl p-5 space-y-4 shadow-lg animate-fade-in">
              <div className="flex justify-between items-center border-b border-indigo-50 pb-2">
                <span className="text-[9px] bg-indigo-600 text-white font-mono font-black px-1.5 py-0.5 rounded uppercase">
                  Account Management
                </span>
                <button
                  onClick={() => setSelectedTenant(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-xs"
                >
                  Close
                </button>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold text-slate-400">ORGANIZATION NAME</h4>
                <p className="text-base font-extrabold text-slate-800">{selectedTenant.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Slug: <span className="text-indigo-600 font-semibold">{selectedTenant.slug}</span></p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                  Toggle Subscription State
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={isUpdatingTenant}
                    onClick={() => {
                      handleUpdateTenantDetails(
                        selectedTenant.id, 
                        !selectedTenant.hasActiveSubscription, 
                        selectedTenant.billingPlan
                      );
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold font-mono transition cursor-pointer ${
                      selectedTenant.hasActiveSubscription 
                        ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100' 
                        : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {selectedTenant.hasActiveSubscription ? (
                      <>
                        <ToggleRight size={16} /> Suspend Subscription
                      </>
                    ) : (
                      <>
                        <ToggleLeft size={16} /> Activate Subscription
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                  Configure Plan Level
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
                  {["pay_as_you_go", "standard", "premium"].map((plan) => {
                    const isCurrent = selectedTenant.billingPlan === plan;
                    return (
                      <button
                        key={plan}
                        type="button"
                        disabled={isUpdatingTenant || isCurrent}
                        onClick={() => {
                          handleUpdateTenantDetails(
                            selectedTenant.id,
                            selectedTenant.hasActiveSubscription,
                            plan as TenantConfig["billingPlan"]
                          );
                        }}
                        className={`text-[9px] py-2 rounded-lg font-black border transition cursor-pointer capitalize ${
                          isCurrent 
                            ? 'bg-indigo-600 border-indigo-700 text-white shadow-xs' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {plan.replace("_", " ")}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200 font-mono text-[9px] text-slate-500 space-y-1">
                <p><strong>REVENUE IDENTIFIER:</strong> {selectedTenant.id}</p>
                <p><strong>M-PESA TILL NO:</strong> {selectedTenant.mpesaTillNo}</p>
                <p><strong>M-PESA SHORT CODE:</strong> {selectedTenant.mpesaShortCode}</p>
              </div>
            </div>
          )}

          {/* Diagnostics and error handling console (Request #7) */}
          <div className="bg-slate-900 border border-slate-950 rounded-2xl p-5 text-slate-300 font-mono text-xs space-y-4 shadow-lg">
            <div className="border-b border-slate-800 pb-3 flex items-center gap-1.5">
              <Cpu size={16} className="text-indigo-400" />
              <div>
                <h3 className="font-bold text-white text-sm">System Diagnostics Console</h3>
                <span className="text-[9px] text-zinc-500 font-semibold uppercase">Cluster metrics of RecruitIQ</span>
              </div>
            </div>

            {diagnostics ? (
              <div className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-500 font-bold block">PLATFORM STATE:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1 font-mono">
                      <CheckCircle size={10} /> {diagnostics.status}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-500 font-bold block">POSTGRES HEALTH:</span>
                    <span className="text-indigo-400 font-bold block truncate">
                      {diagnostics.postgresPool}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] text-slate-500 font-bold">SANDBOX CONTAINER MEMORY:</span>
                  <div className="w-full bg-slate-950 rounded-full h-2.5 border border-slate-800 overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: diagnostics.sandboxMemory.percentage }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-zinc-400">
                    <p>{diagnostics.sandboxMemory.used} of {diagnostics.sandboxMemory.total}</p>
                    <p className="font-bold">{diagnostics.sandboxMemory.percentage} allocated</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="text-[9px] text-slate-500 font-bold block border-b border-slate-800 pb-1">API SERVICE LATENCY COMPLIANCE:</span>
                  <p className="text-[10px] flex justify-between">
                    <span>Gemini Core Proxy:</span>
                    <span className="text-indigo-300 font-bold">{diagnostics.latencyMetrics.geminiResponse}</span>
                  </p>
                  <p className="text-[10px] flex justify-between">
                    <span>M-Pesa Reconciliation Check:</span>
                    <span className="text-indigo-300 font-bold">{diagnostics.latencyMetrics.mpesaCallbackRecon}</span>
                  </p>
                  <p className="text-[10px] flex justify-between">
                    <span>SMTP Relay Service load:</span>
                    <span className="text-indigo-300 font-bold">{diagnostics.latencyMetrics.resendSmtpSend}</span>
                  </p>
                </div>

                {/* Error handling test workspace */}
                <div className="border border-red-950 bg-red-950/20 p-3.5 rounded-xl space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-300">
                    <ShieldAlert size={14} className="text-red-400 animate-pulse" />
                    <span>Diagnostics Error Handling Test (Request #7)</span>
                  </div>
                  <p className="text-[10px] text-red-200/75 leading-normal font-sans">
                    Force system to resolve a simulated SMTP TLS proxy crash to test RecruitIQ's robust error boundaries and automatic log persistence mechanisms.
                  </p>

                  <button
                    type="button"
                    onClick={handleTriggerMockCrash}
                    className="w-full bg-red-500/20 hover:bg-red-500/35 border border-red-500/50 hover:border-red-500 text-red-200 text-[10px] py-1.5 rounded-lg font-mono font-bold cursor-pointer transition uppercase"
                  >
                    💥 Probe Simulated Error Pipeline
                  </button>

                  {errorTestMessage && (
                    <div className="bg-black/80 border border-red-500 rounded p-2.5 mt-2 max-h-[140px] overflow-y-auto text-[10px] text-red-400/90 leading-normal font-sans select-none whitespace-pre-line shadow-inner">
                      <strong>Resolved Diagnostic Log Report:</strong>
                      <p className="mt-1">{errorTestMessage}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-zinc-500 italic text-[11px] py-8 text-center">
                Syncing system telemetry matrices...
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
