import React, { useState } from "react";
import { Building2, Sparkles, ShieldCheck, Lock, Mail, Users, ArrowRight, Eye, EyeOff, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { TenantConfig } from "../types";

interface BusinessAuthProps {
  onAuthSuccess: (tenant: TenantConfig) => void;
  onDemoBypass: () => void;
}

export default function BusinessAuth({ onAuthSuccess, onDemoBypass }: BusinessAuthProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  // Login States
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Registration States
  const [regName, setRegName] = useState("");
  const [regSlug, setRegSlug] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Success message state
  const [successMsg, setSuccessMsg] = useState("");

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Format on the fly to lowercase alphanumeric or hyphen
    const formatted = rawValue.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    setRegSlug(formatted);
  };

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    if (!loginIdentifier || !loginPassword) {
      setLoginError("Please provide both your slug/email and password.");
      return;
    }

    setIsLoggingIn(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: loginIdentifier,
          password: loginPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Authentication failed. Please try again.");
      }

      setSuccessMsg(`Welcome back, ${data.tenant.name}!`);
      setTimeout(() => {
        onAuthSuccess(data.tenant);
      }, 800);
    } catch (err: any) {
      setLoginError(err.message || "Unable to contact auth servers.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const submitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!regName || !regSlug || !regEmail || !regPassword) {
      setRegError("Please fill out all mandatory fields.");
      return;
    }

    if (regPassword.length < 5) {
      setRegError("Password must be at least 5 alphanumeric characters.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError("Your passwords do not match. Please verify.");
      return;
    }

    setIsRegistering(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          slug: regSlug,
          email: regEmail,
          password: regPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to register corporate account.");
      }

      setSuccessMsg(`Account created! Welcoming ${data.tenant.name} onboard.`);
      setTimeout(() => {
        onAuthSuccess(data.tenant);
      }, 1000);
    } catch (err: any) {
      setRegError(err.message || "Registration error occurred.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleQuickLogin = (email: string, pass: string) => {
    setLoginIdentifier(email);
    setLoginPassword(pass);
    // Autofocus/simulate
    setLoginError("");
  };

  return (
    <div className="max-w-2xl mx-auto my-6 p-1 animate-fade-in-up" id="business-auth-vault">
      {/* ENHANCED Visual Header card */}
      <div className="bg-gradient-primary rounded-2xl text-white p-6 md:p-8 shadow-lg shadow-blue-500/20 border border-white/20 glass space-y-4 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-2 w-max bg-white/10 backdrop-filter backdrop-blur border border-white/20 text-xs text-white px-3 py-1.5 rounded-full font-mono font-bold tracking-widest uppercase shadow-glow-blue">
          <Sparkles size={13} className="animate-pulse" />
          B2B Recruitment Gateway
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold font-brand tracking-tight">RecruitIQ Enterprise Hub</h2>
          <p className="text-sm text-white/80 max-w-lg leading-relaxed">
            Eliminate traditional sourcing delays. Register to customize AI evaluations, configure M-Pesa channels, and receive ODPC-compliant recruiter notifications.
          </p>
        </div>
      </div>

      {/* ENHANCED Tabs list */}
      <div className="card-enhanced shadow-lg overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/80 p-1.5">
          <button
            onClick={() => {
              setActiveTab("login");
              setLoginError("");
              setRegError("");
              setSuccessMsg("");
            }}
            className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold font-brand transition-all ${
              activeTab === "login"
                ? "bg-gradient-primary text-white shadow-md shadow-blue-500/20"
                : "text-slate-600 hover:text-blue-600"
            }`}
          >
            🏢 Corporate Log In
          </button>
          <button
            onClick={() => {
              setActiveTab("register");
              setLoginError("");
              setRegError("");
              setSuccessMsg("");
            }}
            className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold font-brand transition-all ${
              activeTab === "register"
                ? "bg-gradient-primary text-white shadow-md shadow-blue-500/20"
                : "text-slate-600 hover:text-blue-600"
            }`}
          >
            🚀 Register Company
          </button>
        </div>

        {/* ENHANCED Success feedback */}
        {successMsg && (
          <div className="badge-success m-4 text-sm p-4 gap-3">
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ENHANCED Form Container */}
        <div className="p-6 md:p-8">
          {activeTab === "login" ? (
            <div className="space-y-6">
              {loginError && (
                <div className="badge-danger text-sm p-4 gap-3">
                  <AlertCircle size={18} />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={submitLogin} className="space-y-5 font-body">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 block uppercase tracking-widest font-mono">
                    Business Slug or Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      className="input-enhanced pl-10 focus:ring-blue-500"
                      placeholder="e.g. morggy-technologies"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 block uppercase tracking-widest font-mono">
                    Security Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      className="input-enhanced pl-10 pr-10 focus:ring-blue-500"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="btn-primary w-full shadow-glow-blue hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {isLoggingIn ? "Authenticating..." : "Log in to Corporate Console"}
                  <ArrowRight size={14} />
                </button>
              </form>

              {/* Demo Mode */}
              <div className="border-t border-slate-200 pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-widest font-bold">Quick Demo Access</p>
                  <button
                    onClick={onDemoBypass}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold underline transition"
                  >
                    Skip to Demo
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleQuickLogin("recruiting-team@safaritech.co.ke", "admin")}
                    className="card-enhanced hover-lift p-4"
                  >
                    <div className="badge-info text-xs mb-2 w-max">Demo 1</div>
                    <p className="text-sm font-bold text-slate-900">Safari Tech Solutions</p>
                    <p className="text-xs text-slate-500 font-mono mt-1">recruiting-team@safaritech.co.ke</p>
                  </button>

                  <button
                    onClick={() => handleQuickLogin("hrmanager@hustlercoop.co.ke", "admin")}
                    className="card-enhanced hover-lift p-4"
                  >
                    <div className="badge-success text-xs mb-2 w-max">Demo 2</div>
                    <p className="text-sm font-bold text-slate-900">Hustler Agro-Cooperative</p>
                    <p className="text-xs text-slate-500 font-mono mt-1">hrmanager@hustlercoop.co.ke</p>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {regError && (
                <div className="badge-danger text-sm p-4 gap-3">
                  <AlertCircle size={18} />
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={submitRegister} className="space-y-5 font-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 block uppercase tracking-widest font-mono">
                      Corporate Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        className="input-enhanced pl-10 focus:ring-blue-500"
                        placeholder="e.g. Nairobi Logistics Ltd"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 block uppercase tracking-widest font-mono">
                      Business URL Slug
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-xs font-mono font-bold text-blue-600">/</span>
                      <input
                        type="text"
                        className="input-enhanced pl-6 pr-3 font-mono focus:ring-blue-500"
                        placeholder="nairobi-logistics"
                        value={regSlug}
                        onChange={handleSlugChange}
                      />
                    </div>
                    {regSlug && (
                      <p className="text-xs text-blue-600 font-mono">👉 /career/{regSlug}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 block uppercase tracking-widest font-mono">
                    Corporate Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                    <input
                      type="email"
                      className="input-enhanced pl-10 focus:ring-blue-500"
                      placeholder="e.g. hrmanager@nairobilogistics.co.ke"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 block uppercase tracking-widest font-mono">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                      <input
                        type={showRegPassword ? "text" : "password"}
                        className="input-enhanced pl-10 pr-10 focus:ring-blue-500"
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 block uppercase tracking-widest font-mono">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                      <input
                        type="password"
                        className="input-enhanced pl-10 focus:ring-blue-500"
                        placeholder="••••••••"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="btn-primary w-full shadow-glow-blue hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {isRegistering ? "Registering company in Nairobi node..." : "Create Corporate Account & Log In"}
                  <ArrowRight size={13} />
                </button>
              </form>

              <div className="border-t border-slate-100 pt-4 flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="text-emerald-500 flex-shrink-0" size={15} />
                <span>By opening a business workspace your data complies with Section 35 audit logs automatically.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
