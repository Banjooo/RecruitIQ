import React, { useState, useEffect } from "react";
import { TenantConfig, Job, Candidate, InVoice } from "./types";
import Dashboard from "./components/Dashboard";
import CandidatePortal from "./components/CandidatePortal";
import MpesaBilling from "./components/MpesaBilling";
import SecurityCompliance from "./components/SecurityCompliance";
import CorporateAdmins from "./components/CorporateAdmins";
import SuperAdminPortal from "./components/SuperAdminPortal";
import BusinessAuth from "./components/BusinessAuth";
import CareerPortalLanding from "./components/CareerPortalLanding";
import AdminDashboard from "./components/AdminDashboard";
import recruitiqLogo from "./assets/images/recruitiq_logo_1781261011773.jpg";
import { Briefcase, UserCheck, Receipt, Scale, User, ShieldAlert, Sparkles, Building2, RefreshCw, LogOut, Users, Shield, Home, Phone, MapPin, Mail } from "lucide-react";

export default function App() {
  const [activePerspective, setActivePerspective] = useState<"landing" | "recruiter" | "candidate" | "admin">("landing");
  const [activeSubTab, setActiveSubTab] = useState<"candidates" | "jobs" | "billing" | "compliance" | "admins" | "superadmin">("candidates");
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [tenants, setTenants] = useState<TenantConfig[]>([]);

  const [tenant, setTenant] = useState<TenantConfig | null>(() => {
    const saved = localStorage.getItem("recruitiq_tenant");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [invoices, setInvoices] = useState<InVoice[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const [initialJobId, setInitialJobId] = useState<string>("");
  const [initialTenantSlug, setInitialTenantSlug] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramJobId = params.get("jobId");
    const paramTenantSlug = params.get("tenant") || params.get("slug");
    const adminKey = params.get("admin");
    const adminSecret = import.meta.env.VITE_ADMIN_SECRET || "admin123";
    
    // Check for admin access
    if (adminKey === adminSecret || localStorage.getItem("recruitiq_admin_token")) {
      setAdminAuthenticated(true);
      localStorage.setItem("recruitiq_admin_token", adminSecret);
    }
    
    if (paramJobId) {
      setInitialJobId(paramJobId);
      setActivePerspective("candidate");
    }
    if (paramTenantSlug) {
      setInitialTenantSlug(paramTenantSlug);
      setActivePerspective("candidate");
    }
  }, []);

  // Keep localStorage sync'ed safely on any updates
  useEffect(() => {
    if (tenant) {
      localStorage.setItem("recruitiq_tenant", JSON.stringify(tenant));
    } else {
      localStorage.removeItem("recruitiq_tenant");
    }
  }, [tenant]);

  // Sync systems data on mounting
  const syncData = async () => {
    setIsSyncing(true);
    try {
      // Fetch all global tenants
      const tenantsRes = await fetch("/api/tenants");
      const tenantsData = await tenantsRes.json();
      setTenants(tenantsData || []);

      // In candidate perspective we fetch all jobs. Web application-wide jobs.
      // In recruiter perspective we filter jobs by the logged-in tenant!
      const tenantIdParam = activePerspective === "recruiter" && tenant ? tenant.id : "";
      const jobRes = await fetch(`/api/jobs?tenantId=${tenantIdParam}`);
      const jobData = await jobRes.json();
      setJobs(jobData);

      if (activePerspective === "recruiter" && tenant) {
        // Fetch processed candidate profiles for this specific recruiter tenant
        const candRes = await fetch(`/api/candidates?tenantId=${tenant.id}`);
        const candData = await candRes.json();
        setCandidates(candData);

        // Fetch corporate payment logs
        const invRes = await fetch("/api/billing/invoices");
        const invData = await invRes.json();
        setInvoices(invData);
      }
    } catch (err) {
      console.error("Failed to sync databases with Express proxy:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    syncData();
  }, [tenant, activePerspective]);

  const handleApply = async (application: {
    jobId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    cvFileName: string;
    rawText: string;
    isVisualMode: boolean;
  }) => {
    // Find organization ID of the job so applications land on the correct tenant dashboard
    const targetJob = jobs.find(j => j.id === application.jobId);
    const targetTenantId = targetJob ? targetJob.organizationId : (tenant ? tenant.id : "org-1");

    const response = await fetch("/api/evaluate-candidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...application,
        tenantId: targetTenantId,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to process application.");
    }

    const data = await response.json();
    await syncData();
    return data;
  };

  const handleAddJob = async (jobData: any) => {
    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      throw new Error("Failed to register job posting template.");
    }

    await syncData();
  };

  const handleUpdateCandidateStatus = async (id: string, status: Candidate["status"], remarks: string) => {
    const response = await fetch(`/api/candidates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, remarks }),
    });

    if (!response.ok) {
      throw new Error("Failed to transition candidate stage.");
    }

    const updated = await response.json();
    await syncData();
    return updated;
  };

  const handleInitiateStkPush = async (phoneNumber: string, amount: number) => {
    const response = await fetch("/api/billing/stk-push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phoneNumber,
        amount,
        tenantId: tenant.id,
        accountReference: `RECRUITIQ-${tenant.slug.toUpperCase()}`,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send STK push request.");
    }

    const data = await response.json();
    setTenant((prev) => ({
      ...prev,
      hasActiveSubscription: true,
      billingPlan: amount >= 15000 ? "premium" : "standard",
    }));
    await syncData();
    return data;
  };

  const handleGenerateInvoice = async (amount: number, description: string) => {
    const response = await fetch("/api/billing/create-invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenantId: tenant.id,
        amount,
        description,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to compile billing invoice.");
    }

    await syncData();
  };

  const handleInitiateBankPayment = async (bankDetails: {
    amount: number;
    bankName: string;
    paymentMethod: "card" | "transfer";
    accountOrCardNumber: string;
    accountName: string;
  }) => {
    if (!tenant) return;
    const response = await fetch("/api/billing/bank-pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenantId: tenant.id,
        ...bankDetails,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed secure bank check-out.");
    }

    const data = await response.json();
    setTenant((prev: any) => {
      if (!prev) return null;
      return {
        ...prev,
        hasActiveSubscription: true,
        billingPlan: bankDetails.amount >= 22000 ? "premium" : bankDetails.amount >= 12000 ? "standard" : "pay_as_you_go",
      };
    });
    await syncData();
    return data;
  };

  const handleMarkInvoicePaid = async (id: string) => {
    const response = await fetch(`/api/billing/pay-invoice/${id}`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to simulate paid callback.");
    }

    await syncData();
  };

  return (
    <div className="min-h-screen bg-brand-bg text-slate-900 flex flex-col font-sans selection:bg-blue-50">
      
      {/* DIRECT RECRUITIQ COMPLIANCE BAR */}
      <div className="bg-brand-secondary text-slate-300 font-semibold px-4 py-2 border-b border-brand-accent/30 flex items-center justify-between text-xs font-mono animate-fade-in">
        <div className="flex items-center gap-2">
          <ShieldAlert size={14} className="text-brand-accent animate-pulse" id="alert-indicator-global" />
          <span>RecruitIQ Kenya Compliance Node: "Human-In-The-Loop" Active. Section 35 ODPC Compliance Enforced. Zero auto-rejections.</span>
        </div>
        <div className="hidden md:block text-slate-400 font-sans">
          Central Tenant Host: <span className="underline font-bold text-white font-mono">recruitiq.co.ke</span>
        </div>
      </div>

      {/* GLOBAL PERSPECTIVE SELECTOR BANNER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & title context leading to landing view */}
          <div className="flex items-center gap-3.5 cursor-pointer animate-fade-in" onClick={() => setActivePerspective("landing")}>
            <div className="w-11 h-11 bg-gradient-to-br from-[#1E3A8A] via-[#111827] to-[#D4AF37] rounded-xl flex items-center justify-center p-0.5 shadow-md overflow-hidden flex-shrink-0 transition-transform duration-305 hover:scale-105 border border-[#D4AF37]/45">
              <div className="bg-white w-full h-full rounded-[9px] flex items-center justify-center overflow-hidden">
                <img 
                  src={recruitiqLogo} 
                  alt="RecruitIQ Logo Banner" 
                  className="w-full h-full object-cover rounded-[9px]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-black tracking-tight text-neutral-900 font-sans leading-none">
                  Recruit<span className="text-brand-primary">IQ</span>
                </h1>
                <span className="bg-blue-50 text-brand-primary border border-blue-100 text-[8px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                  SaaS Hub
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold tracking-wide mt-0.5">East Africa's Smartest Recruitment & Career Portal</p>
            </div>
          </div>

          {/* Perspective switcher tab */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono hidden lg:inline">Select Pathway</span>
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-205 flex items-center flex-wrap gap-1">
              <button
                onClick={() => setActivePerspective("landing")}
                className={`text-[11px] px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activePerspective === "landing"
                    ? "bg-brand-primary text-white shadow-sm font-black text-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Home size={13} />
                Portal Home
              </button>
              <button
                onClick={() => setActivePerspective("candidate")}
                className={`text-[11px] px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activePerspective === "candidate"
                    ? "bg-brand-primary text-white shadow-sm font-black text-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <User size={13} />
                Job Seekers
              </button>
              <button
                onClick={() => setActivePerspective("recruiter")}
                className={`text-[11px] px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activePerspective === "recruiter"
                    ? "bg-brand-primary text-white shadow-sm font-black text-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Building2 size={13} />
                For Corporates
              </button>
              {adminAuthenticated && (
                <button
                  onClick={() => setActivePerspective("admin")}
                  className={`text-[11px] px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activePerspective === "admin"
                      ? "bg-gradient-accent text-white shadow-glow-gold font-black text-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="Admin Console"
                >
                  <Shield size={13} />
                  Admin Console
                </button>
              )}
            </div>

            {/* Sync trigger button */}
            <button
              onClick={syncData}
              disabled={isSyncing}
              className="p-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 transition"
              title="Refresh and sync server DB"
            >
              <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
            </button>

            {/* Prominent Header Logout Button */}
            {tenant && (
              <button
                onClick={() => setTenant(null)}
                className="text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 border border-rose-150 px-3 py-2 rounded-lg transition duration-150 flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Sign Out of Corporate Console"
              >
                <LogOut size={13} />
                Logout
              </button>
            )}
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER CONTENT AREA */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-6 py-6 font-sans">
        {activePerspective === "admin" && adminAuthenticated ? (
          <AdminDashboard 
            onLogout={() => {
              setAdminAuthenticated(false);
              localStorage.removeItem("recruitiq_admin_token");
              setActivePerspective("landing");
            }}
          />
        ) : activePerspective === "landing" ? (
          <CareerPortalLanding
            jobs={jobs}
            tenants={tenants}
            onSelectSeeker={() => {
              setActivePerspective("candidate");
            }}
            onSelectCorporate={() => {
              setActivePerspective("recruiter");
            }}
            onSelectJob={(jobId) => {
              setInitialJobId(jobId);
              setActivePerspective("candidate");
            }}
          />
        ) : activePerspective === "recruiter" ? (
          !tenant ? (
            <BusinessAuth 
              onAuthSuccess={(newTenant) => setTenant(newTenant)}
              onDemoBypass={() => {
                setTenant({
                  id: "org-1",
                  name: "Morggy Technologies Kenya",
                  slug: "morggy-technologies",
                  billingPlan: "standard",
                  hasActiveSubscription: true,
                  mpesaTillNo: "5422891",
                  mpesaShortCode: "174379",
                });
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
              
              {/* LEFT HR VERTICAL NAVIGATION BAR */}
              <div className="md:col-span-1 space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  
                  {/* Org profiling block with clean Logout trigger */}
                  <div className="border-b border-slate-100 pb-3">
                    <div className="flex justify-between items-start gap-1">
                      <div>
                        <p className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-widest">Active Business</p>
                        <h3 className="font-bold text-sm text-slate-800 tracking-tight mt-1 truncate max-w-[130px]" title={tenant.name}>
                          {tenant.name}
                        </h3>
                        <span className="text-[10px] font-mono text-slate-400 block mt-0.5 bg-slate-100 px-1.5 py-0.5 rounded w-max">/{tenant.slug}</span>
                      </div>
                      <button
                        onClick={() => setTenant(null)}
                        className="text-[10px] font-bold text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 border border-rose-100 px-2 py-1 rounded transition duration-150"
                        title="Sign Out of Corporate Console"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>

                  {/* Vertical menu tabs list */}
                  <div className="space-y-1 text-sm font-medium">
                    <button
                      onClick={() => setActiveSubTab("candidates")}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                        activeSubTab === "candidates"
                          ? "bg-indigo-600 text-white shadow-sm font-bold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <UserCheck size={14} />
                      Existing New Features
                    </button>

                    <button
                      onClick={() => setActiveSubTab("jobs")}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                        activeSubTab === "jobs"
                          ? "bg-indigo-600 text-white shadow-sm font-bold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <Briefcase size={14} />
                      Open Vacancies ({jobs.length})
                    </button>

                    <button
                      onClick={() => setActiveSubTab("billing")}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                        activeSubTab === "billing"
                          ? "bg-indigo-600 text-white shadow-sm font-bold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <Receipt size={14} />
                      Corporate Payment Channels
                    </button>

                    <button
                      onClick={() => setActiveSubTab("compliance")}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                        activeSubTab === "compliance"
                          ? "bg-indigo-600 text-white shadow-sm font-bold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <Scale size={14} />
                      Kenya DPA Safeguards
                    </button>

                    <button
                      onClick={() => setActiveSubTab("admins")}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                        activeSubTab === "admins"
                          ? "bg-indigo-600 text-white shadow-sm font-bold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <Users size={14} />
                      Corporate Team Admins
                    </button>

                    <div className="pt-2 border-t border-slate-100 mt-1">
                      <button
                        onClick={() => setActiveSubTab("superadmin")}
                        className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 border ${
                          activeSubTab === "superadmin"
                            ? "bg-amber-400 border-amber-500 text-amber-950 font-extrabold shadow-md"
                            : "text-blue-600 border-blue-150 bg-blue-50/50 hover:bg-blue-50 font-bold"
                        }`}
                      >
                        <Shield size={14} className="text-amber-600 animate-pulse" />
                        Platform Control Panel
                      </button>
                    </div>
                  </div>

                </div>

                {/* quick promo credit box with golden amber styling */}
                <div className="bg-amber-50 text-slate-850 rounded-xl p-5 border-2 border-amber-300 space-y-3 shadow-sm relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-20 h-20 bg-amber-400/5 rounded-full blur-xl pointer-events-none"></div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-600 animate-pulse" />
                    <span className="text-xs font-bold text-amber-700 font-mono">Cognitive Hub Active</span>
                  </div>
                  <p className="text-[11px] text-slate-650 leading-relaxed">
                    Our integration uses **Gemini 3.5 Flash** server-side caching. This optimizes candidate matching costs to less than **KES 0.05 per resume check**.
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-amber-250 text-[10px] text-slate-500 font-mono">
                    <span className="text-slate-500">Usage plan:</span>
                    <span className="font-semibold text-amber-900 uppercase bg-amber-100 px-1.5 py-0.5 rounded">{tenant?.billingPlan || "Standard"}</span>
                  </div>
                </div>

              </div>

              {/* RIGHT HR WORKSPACE WINDOW PANEL */}
              <div className="md:col-span-3">
                {activeSubTab === "candidates" && (
                  <Dashboard
                    tenant={tenant}
                    jobs={jobs}
                    candidates={candidates}
                    onAddJob={handleAddJob}
                    onUpdateCandidateStatus={handleUpdateCandidateStatus}
                    onNavigateToTab={setActiveSubTab}
                  />
                )}

                {activeSubTab === "jobs" && (
                  <Dashboard
                    tenant={tenant}
                    jobs={jobs}
                    candidates={candidates}
                    onAddJob={handleAddJob}
                    onUpdateCandidateStatus={handleUpdateCandidateStatus}
                    onNavigateToTab={setActiveSubTab}
                  />
                )}

                {activeSubTab === "billing" && (
                  <MpesaBilling
                    tenant={tenant}
                    invoices={invoices}
                    onRefreshBilling={syncData}
                    onInitiateStkPush={handleInitiateStkPush}
                    onGenerateInvoice={handleGenerateInvoice}
                    onMarkInvoicePaid={handleMarkInvoicePaid}
                    onInitiateBankPayment={handleInitiateBankPayment}
                  />
                )}

                {activeSubTab === "compliance" && (
                  <SecurityCompliance candidates={candidates} />
                )}

                {activeSubTab === "admins" && (
                  <CorporateAdmins tenant={tenant} />
                )}

                {activeSubTab === "superadmin" && (
                  <SuperAdminPortal
                    tenants={tenants}
                    jobsCount={jobs.length}
                    candidatesCount={candidates.length}
                    onRefreshAllData={syncData}
                  />
                )}
              </div>

            </div>
          )
        ) : (
          /* Public Career landing zone where seekers apply in Nairobi hubs */
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
            <CandidatePortal 
              jobs={jobs} 
              onApply={handleApply} 
              initialJobId={initialJobId}
              initialTenantSlug={initialTenantSlug}
              tenants={tenants}
            />
          </div>
        )}
      </main>

      {/* FOOTER CREDENTIAL NOTATIONS */}
      <footer className="bg-slate-50 border-t border-slate-200 py-10 mt-12 text-xs text-slate-500 animate-fade-in">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          
          {/* Top segment: Morggy Technologies Contact Section under gold branding (#D4AF37) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-slate-200">
            <div className="md:col-span-5 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#D4AF37] rounded-full"></div>
                <span className="text-sm font-black text-slate-800 tracking-tight">Morggy Technologies</span>
              </div>
              <p className="text-[11px] text-slate-500 max-w-sm leading-relaxed">
                Leading systems integrator and authorized technology partner in East Africa powering enterprise scale multi-tenant matches.
              </p>
            </div>
            
            <div className="md:col-span-7 flex flex-wrap gap-x-4 gap-y-4 items-center md:justify-end text-[11px]">
              
              <div className="flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs hover:border-[#D4AF37] transition-all duration-300">
                <div className="bg-amber-50 p-1.5 rounded-lg text-[#D4AF37]">
                  <Phone size={14} className="stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-mono font-bold uppercase leading-none mb-1">Call Us Directly</span>
                  <a href="tel:0714042946" className="font-bold text-slate-700 hover:text-blue-600 font-mono transition-colors">0714042946</a>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs hover:border-[#D4AF37] transition-all duration-300">
                <div className="bg-amber-50 p-1.5 rounded-lg text-[#D4AF37]">
                  <MapPin size={14} className="stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-mono font-bold uppercase leading-none mb-1">Our Office</span>
                  <span className="font-bold text-slate-700">Nairobi Juja, Kenya</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs hover:border-[#D4AF37] transition-all duration-300">
                <div className="bg-amber-50 p-1.5 rounded-lg text-[#D4AF37]">
                  <Mail size={14} className="stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-mono font-bold uppercase leading-none mb-1">Corporate Support</span>
                  <a href="mailto:morggytechnologies@gmail.com" className="font-bold text-slate-700 hover:text-blue-600 font-mono transition-colors">morggytechnologies@gmail.com</a>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom segment: copyright and tags */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 text-[11px]">
            <div className="text-center sm:text-left space-y-0.5">
              <p className="font-bold text-slate-600 font-mono">RecruitIQ Kenya © 2026</p>
              <p className="text-[10px]">Fully localized for the Kenyan Business Ecosystem & Office of the Data Protection Commissioner (ODPC).</p>
            </div>
            <div className="flex gap-4 font-mono text-[10px]">
              <span>Secured via Safaricom paybill channels</span>
              <span className="text-slate-300">|</span>
              <span>Refreshed on Nairobi UTC</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
