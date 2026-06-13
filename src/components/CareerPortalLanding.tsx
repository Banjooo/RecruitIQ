import React, { useState } from "react";
import { Job, TenantConfig } from "../types";
import recruitiqLogo from "../assets/images/recruitiq_logo_1781261011773.jpg";
import { 
  Briefcase, Users, Star, ArrowRight, ShieldCheck, Cpu, 
  Sparkles, Zap, Award, CheckCircle2, FileText, ArrowUpRight, Check, 
  BookOpen, GraduationCap, TrendingUp, Search, Lock, Landmark, Flame, Compass, Settings,
  Phone, Mail, MapPin, MessageSquare, ShieldAlert, Building2, Send, ChevronDown, ChevronUp, Quote, HelpCircle
} from "lucide-react";

interface CareerPortalLandingProps {
  jobs: Job[];
  tenants: TenantConfig[];
  onSelectSeeker: () => void;
  onSelectCorporate: () => void;
  onSelectJob: (jobId: string) => void;
}

export default function CareerPortalLanding({ 
  jobs, 
  tenants, 
  onSelectSeeker, 
  onSelectCorporate,
  onSelectJob
}: CareerPortalLandingProps) {
  
  // Outer Home switcher State
  const [homeTab, setHomeTab] = useState<"home" | "about" | "pricing" | "contact">("home");
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  // Interactive Live CV Optimizer State
  const [testCvText, setTestCvText] = useState("");
  const [scoreResult, setScoreResult] = useState<{
    score: number;
    feedback: string[];
    grade: string;
    level: string;
    goldStatus: boolean;
  } | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Active Tab for career explorer section
  const [activeCareerTopic, setActiveCareerTopic] = useState<"tech" | "business" | "learning">("tech");

  // Contact form submission state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const featuredJobs = jobs.slice(0, 4);

  // Score simulator
  const handleScoreCv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testCvText.trim()) return;
    setIsEvaluating(true);
    
    setTimeout(() => {
      const text = testCvText.toLowerCase();
      let score = 55; // base
      const feedbacks: string[] = [];

      if (text.includes("react") || text.includes("vue") || text.includes("angular") || text.includes("next")) {
        score += 12;
      }
      if (text.includes("node") || text.includes("python") || text.includes("express") || text.includes("django") || text.includes("api")) {
        score += 15;
      }
      if (text.includes("typescript") || text.includes("javascript")) {
        score += 10;
      }
      if (text.includes("sql") || text.includes("postgres") || text.includes("database") || text.includes("mongodb")) {
        score += 12;
      }
      if (text.includes("git") || text.includes("docker") || text.includes("cloud") || text.includes("aws")) {
        score += 10;
      }

      score = Math.min(99, score);

      if (score < 65) {
        feedbacks.push("Include concrete programming frameworks (e.g., React, Node, or Django) matching modern enterprise workflows.");
        feedbacks.push("Quantify key project achievements with numbers (e.g., 'accelerated DB queries by 25%') to score higher on corporate parsers.");
      } else if (score < 85) {
        feedbacks.push("Solid background detected! Add explicit notes on database caching, distributed systems, or automated test pipelines.");
        feedbacks.push("Include clean KDPA compliance declarations or data consent terminology to attract strict enterprise hire teams.");
      } else {
        feedbacks.push("Exceptional alignment! Highly matching all premium technology roles on the corporate list.");
        feedbacks.push("Strong keyword parity for senior requirements. Your CV qualifies for high-priority matching lists.");
      }

      setScoreResult({
        score,
        feedback: feedbacks,
        grade: score >= 85 ? "L3 Elite Vetted Candidate" : score >= 70 ? "L2 Highly Optimal Professional" : "L1 Dynamic Competitor",
        level: score >= 85 ? "Premium Gold Alignment" : "Standard Alignment",
        goldStatus: score >= 75
      });
      setIsEvaluating(false);
    }, 850);
  };

  // Contact form handler
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingMessage(true);
    setTimeout(() => {
      setContactSuccess(true);
      setIsSendingMessage(false);
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    }, 700);
  };

  return (
    <div className="space-y-10 pb-20 font-sans text-slate-800">
      
      {/* 🧭 ENHANCED PREMIUM NAVIGATION BAR */}
      <nav className="glass rounded-2xl p-4 shadow-lg border border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in-up select-none sticky top-4 z-50">
        
        {/* Left Side: Brand Logo and Title */}
        <div className="flex items-center gap-3 cursor-pointer hover-lift" onClick={() => setHomeTab("home")}>
          <div className="w-12 h-12 gradient-border p-0.5 flex items-center justify-center overflow-hidden rounded-xl shadow-glow-gold">
            <div className="w-full h-full bg-white rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src={recruitiqLogo} 
                alt="RecruitIQ" 
                className="w-full h-full object-cover rounded-lg" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="gradient-text-primary text-lg font-black font-brand tracking-tight">RecruitIQ</span>
              <span className="bg-blue-100 text-blue-700 border border-blue-300 text-[9px] px-2 py-0.5 rounded-full font-mono font-bold uppercase shadow-glow-blue">Kenya</span>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wide">Operated by Morggy Technologies Ltd</p>
          </div>
        </div>

        {/* Center: Enhanced Navigation Tabs */}
        <div className="flex items-center text-xs font-bold bg-white/50 backdrop-filter backdrop-blur p-1.5 rounded-xl border border-white/30 gap-1">
          {['home', 'about', 'pricing', 'contact'].map((tab) => (
            <button 
              key={tab}
              type="button"
              onClick={() => setHomeTab(tab as any)} 
              className={`px-4 py-2.5 rounded-lg transition-all cursor-pointer font-medium relative ${
                homeTab === tab 
                  ? "bg-gradient-primary text-white shadow-md shadow-blue-500/20" 
                  : "text-slate-600 hover:text-blue-600 hover:bg-white/70"
              }`}
            >
              {tab === 'home' ? '🏠 Home' : tab === 'about' ? '📋 About' : tab === 'pricing' ? '💰 Pricing' : '📞 Contact'}
              {homeTab === tab && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-white rounded-full"></div>}
            </button>
          ))}
        </div>

        {/* Right Side Call To Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onSelectSeeker}
            className="btn-primary text-sm shadow-glow-blue hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
          >
            ✨ Search Jobs
          </button>
          <button 
            onClick={onSelectCorporate}
            className="btn-primary-outline text-sm border-2 hover:shadow-glow-gold transition-all transform hover:scale-105 active:scale-95"
          >
            🏢 Corporate Access
          </button>
        </div>

      </nav>

      {/* ----------------- TAB SECTION: HOME ----------------- */}
      {homeTab === "home" && (
        <div className="space-y-16 animate-fade-in">
          
          {/* 👑 Dynamic Light Hero Banner - Split Modern Graphics */}
          <section className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-amber-500/5 to-blue-600/5 rounded-3xl p-8 md:p-14 border border-amber-200 shadow-xl">
            {/* Ambient gold/blue vector elements (absolutely no black/dark backgrounds) */}
            <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-[#D4AF37]/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-10 w-[300px] h-[300px] bg-blue-300/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              
              {/* Left Column: Bold Typography & Light Textures */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-mono font-bold uppercase tracking-wider">
                  <Sparkles size={12} className="text-amber-500 animate-pulse" /> 
                  <span>Operated by Morggy Technologies</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-blue-900 font-sans">
                  Sovereign Talent Matching. <br/>
                  <span className="text-amber-600 font-serif italic font-semibold">
                    Rigorous Verification
                  </span>
                </h1>
                
                <p className="text-sm md:text-base text-slate-600 max-w-xl leading-relaxed font-sans font-light">
                  Align candidate skills accurately with East Africa's most transparent cognitive vetting engine. Under Kenyan regulations, we guarantee zero automated rejections and 100% human accountability.
                </p>

                {/* Light Feature Indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                  <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-200">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <Flame size={14} className="text-amber-600" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-700 block font-bold leading-none">Morggy Verified</span>
                      <span className="text-[10px] text-slate-400 font-mono">Premium Local Cloud</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-200">
                    <div className="bg-blue-105 p-2 rounded-lg">
                      <ShieldCheck size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-700 block font-bold leading-none">Section 35 Audited</span>
                      <span className="text-[10px] text-slate-400 font-mono">Odpc Compliant Audit</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button 
                    onClick={onSelectSeeker}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 cursor-pointer shadow-md group transform active:scale-95"
                  >
                    Explore Opportunities <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <button 
                    onClick={() => setHomeTab("pricing")}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-800 border-2 border-amber-300 font-bold px-6 py-3.5 rounded-xl text-xs uppercase transition"
                  >
                    View Pricing Plans
                  </button>
                </div>
              </div>

              {/* Right Column: Visual Telemetry Display Device (Light Mockup) */}
              <div className="lg:col-span-5 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-blue-400 rounded-2xl blur opacity-30"></div>
                
                {/* Clean Light Interface Device Box */}
                <div className="relative bg-white border-2 border-[#D4AF37] rounded-3xl overflow-hidden shadow-xl">
                  
                  {/* Mockup Header */}
                  <div className="bg-blue-50/70 p-3.5 border-b border-blue-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-gradient-to-tr from-blue-500 to-amber-500 p-0.5">
                        <img 
                          src={recruitiqLogo} 
                          alt="RecruitIQ" 
                          className="w-full h-full object-cover rounded" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-black text-blue-800 block leading-none">RECRUITIQ PLATFORM</span>
                        <span className="text-[8px] text-amber-600 font-mono font-bold tracking-wider block">Verified Core Service v2.0</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 text-transparent animate-pulse"></span>
                      <span className="text-[9px] text-slate-600 font-mono font-bold">Secure Local DB</span>
                    </div>
                  </div>

                  {/* Mockup Content Visualized */}
                  <div className="p-5 space-y-4">
                    
                    <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200 text-slate-700 space-y-2">
                      <p className="text-[10px] text-amber-805 font-mono uppercase tracking-widest font-black block">Matching Analytics Platform</p>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-800">
                          <span>Cognitive Match-Rating Index</span>
                          <span className="text-blue-600 font-mono">94% Perfect Match</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="h-full bg-gradient-to-r from-blue-400 via-[#D4AF37] to-amber-500 rounded-full" style={{ width: "94%" }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Simulation logs */}
                    <div className="space-y-2">
                      <span className="text-[9px] text-slate-450 uppercase font-mono font-bold tracking-wider block border-b pb-1">Real-time Activity Ledger</span>
                      <div className="space-y-1.5 font-mono text-[10px] text-slate-600">
                        <div className="flex justify-between p-1.5 rounded bg-blue-50/30 border-l-2 border-blue-500">
                          <span>👤 Candidate joseph.kiprop Vetted</span>
                          <strong className="text-blue-600">Score: 89%</strong>
                        </div>
                        <div className="flex justify-between p-1.5 rounded bg-amber-50/30 border-l-2 border-amber-500">
                          <span>⚙️ Anti-fraud Vector Match Completed</span>
                          <strong className="text-amber-700">Audit Safe</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400 font-mono uppercase">
                      <span>Server Location: Nairobi</span>
                      <span>101% Compliance Checked</span>
                    </div>

                  </div>

                </div>
              </div>

            </div>
          </section>

          {/* 🤝 Vetted Enterprise Co-Sponsors & Sponsor Banner */}
          <section className="bg-amber-50/30 border-y border-amber-100 py-6 text-center select-none shadow-3xs rounded-xl">
            <span className="text-[10px] text-amber-850 font-mono font-bold uppercase tracking-widest block mb-3">
              Trusted by leading tech stakeholders in East Africa
            </span>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 opacity-75">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-xs font-bold text-slate-700 font-mono">MORGGY TECHNOLOGIES</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                <span className="text-xs font-bold text-slate-700 font-mono">TIL-PAY CHANNELS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span className="text-xs font-bold text-slate-700 font-mono">JUJA GEEKS ACADEMY</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-slate-700 font-mono">ODPC REGISTERED FIRMS</span>
              </div>
            </div>
          </section>

          {/* 🎨 Crisp Bento Grid- Light, Premium, Blue & Gold Plated */}
          <section className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase font-black border border-blue-100 inline-block">
                Tailored SaaS Matrix
              </span>
              <h2 className="text-3xl font-extrabold text-blue-950 tracking-tight leading-normal">
                No complex dark overlays. <br/>
                <span className="font-serif italic text-amber-600 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-[#D4AF37]">
                  Clean digital workflows.
                </span>
              </h2>
              <p className="text-xs text-slate-550">
                Crafted meticulously under human-in-the-loop guidelines. Discover features designed for fast enterprise scaling in Juja and greater Nairobi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Divided tenancy */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transform group-hover:scale-105 duration-200">
                    <Building2 size={20} className="stroke-[2.5]" />
                  </div>
                  <h3 className="text-base font-extrabold text-blue-950">Multi-Org Division</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    Establish distinct tenant structures, dedicated jobs pages, billing profiles, and custom candidate databases separated under high administrative standards.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1.5 text-[10px] font-mono font-bold text-blue-600">
                  <span>Partition integrity verified</span>
                  <CheckCircle2 size={12} className="text-emerald-500" />
                </div>
              </div>

              {/* Card 2: Interactive gold card (not black!) */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-6 border-2 border-[#D4AF37] hover:shadow-lg transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/5 rounded-full blur-xl"></div>
                
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-amber-600 border border-amber-300 flex items-center justify-center transform group-hover:scale-105 duration-200">
                    <Cpu size={20} className="stroke-[2.5]" />
                  </div>
                  <h3 className="text-base font-extrabold text-amber-950">Resume Alignment Sandbox</h3>
                  <p className="text-xs text-amber-900/85 leading-relaxed font-light">
                    Submit test CV elements on our tool below to analyze core parities instantly, highlighting micro-skill markers required for local technology roles.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1 text-[10px] font-mono font-bold text-amber-800">
                  <span>⚡ Interactive Tool Below</span>
                  <ArrowRight size={10} className="animate-bounce" />
                </div>
              </div>

              {/* Card 3: Lipa na M-pesa billing */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transform group-hover:scale-105 duration-200">
                    <Landmark size={20} className="stroke-[2.5]" />
                  </div>
                  <h3 className="text-base font-extrabold text-blue-950">Lipa Na M-Pesa Integrated</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    Process direct subscription billings with standard limits (inclusive of 25 and 70 candidates limit bounds). Generates standard invoices transparently.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1.5 text-[10px] font-mono font-bold text-blue-600">
                  <span>Node paybill hook verified</span>
                  <CheckCircle2 size={12} className="text-emerald-500" />
                </div>
              </div>

            </div>
          </section>

          {/* 🛠️ ULTRA INTERACTIVE TOOL: Resume Cognitive Alignment Indexer (Light Theme!) */}
          <section className="bg-gradient-to-br from-[#FFFDF8] via-[#FFFDF5] to-blue-50/50 rounded-3xl p-8 border-2 border-[#D4AF37]/50 shadow-md relative text-slate-800">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-200/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Sandbox instructions */}
              <div className="lg:col-span-5 space-y-5">
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-100/70 border border-amber-300 text-amber-900 text-[10px] font-mono font-bold uppercase tracking-wider">
                  <Flame size={11} className="animate-pulse" /> Sandbox Technical Screener
                </div>
                
                <h3 className="text-2xl font-black text-blue-950 tracking-tight leading-tight">
                  Check your professional tech keyword visibility index.
                </h3>
                
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our advanced cognitive matching tool evaluates skill points instantaneously. Learn which parities matter, discover local market benchmarks, and design a high-scoring resume easily.
                </p>
                
                <div className="space-y-2 text-xs text-slate-600">
                  <span className="text-[10px] text-amber-700 font-mono uppercase tracking-widest block font-bold">Parameters Evaluated</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-amber-500 shrink-0" />
                    <span>Client technologies: React / TypeScript / CSS parities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-amber-500 shrink-0" />
                    <span>Server architectures: Node / Express / REST APIs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-amber-500 shrink-0" />
                    <span>Data stores: PostgreSQL / Firestore / MongoDB caches</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-tr from-blue-600 to-amber-500 p-0.5 flex items-center justify-center">
                    <img 
                      src={recruitiqLogo} 
                      alt="RecruitIQ" 
                      className="w-full h-full object-cover rounded" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-900 block leading-none">RECRUITIQ ANALYZER ENGINE</span>
                    <span className="text-[9px] text-slate-500 block leading-normal">Operated under KDPA Section 35 regulations</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Textarea input & outcome display (no dark overlays, absolutely light style) */}
              <div className="lg:col-span-7">
                <form onSubmit={handleScoreCv} className="bg-white p-6 border border-slate-250 rounded-2xl shadow-lg space-y-4">
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <label className="font-bold text-amber-700 uppercase tracking-widest block">
                        INSERT CV OVERVIEW / KEY COMPETENCIES
                      </label>
                      <span>Vetted secure</span>
                    </div>
                    
                    <textarea
                      value={testCvText}
                      onChange={(e) => setTestCvText(e.target.value)}
                      rows={4}
                      placeholder="e.g. 'I am a skilled React software developer with 4 years experience. I focus on TypeScript hooks, designing JSON REST APIs, writing Node.js backend pipelines, and scaling PostgreSQL indexes.'"
                      className="w-full text-xs text-slate-800 border-2 border-slate-200 hover:border-blue-450 focus:border-blue-500 focus:outline-none rounded-xl p-3 bg-blue-50/10 font-mono leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <p className="text-[10px] text-slate-450 flex items-center gap-1 font-mono">
                      <Lock size={12} className="text-emerald-500" />
                      Data remains private in your secure session
                    </p>
                    
                    <button
                      type="submit"
                      disabled={isEvaluating || !testCvText.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl px-5 py-3 transition shadow-sm cursor-pointer disabled:opacity-40 uppercase tracking-wider"
                    >
                      {isEvaluating ? "Calculating Tech Vectors..." : "Calculate Match Compatibility"}
                    </button>
                  </div>

                  {scoreResult && (
                    <div className="mt-4 p-5 bg-amber-50/30 border-2 border-amber-300 rounded-xl space-y-3.5 animate-fade-in">
                      
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-2.5 border-b border-amber-200">
                        <div>
                          <span className="text-[9px] text-amber-800 uppercase font-mono tracking-wider font-extrabold block">Evaluated Grade Class</span>
                          <span className="font-black text-blue-950 text-sm block">{scoreResult.grade}</span>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-slate-400 block font-mono">Calculated Compatibility score</span>
                          <span className="text-xl font-mono font-black text-blue-600 block">
                            {scoreResult.score}%
                          </span>
                        </div>
                      </div>

                      {/* Bar indicator */}
                      <div className="space-y-1">
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 via-[#D4AF37] to-amber-500 rounded-full transition-all duration-500" 
                            style={{ width: `${scoreResult.score}%` }} 
                          />
                        </div>
                        <p className="text-[9px] text-slate-400 font-mono text-right font-medium">Class parameters: {scoreResult.level}</p>
                      </div>

                      {/* Comments */}
                      <div className="space-y-1.5 text-xs text-slate-700 pt-1">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-amber-900 font-bold block">🚨 Advisory recommendations:</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-650 tracking-tight text-[11px] leading-relaxed">
                          {scoreResult.feedback.map((feed, fIndex) => (
                            <li key={fIndex}>{feed}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 bg-white border border-amber-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="font-bold text-slate-850 block">Ready to try your verified application profile?</span>
                          <span className="text-[10px] text-slate-450 font-mono">No auto-rejections are applied in this branch.</span>
                        </div>
                        <button 
                          type="button"
                          onClick={onSelectSeeker}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] uppercase px-4 py-2 rounded-lg cursor-pointer transition select-none"
                        >
                          Access Vacancies Board
                        </button>
                      </div>

                    </div>
                  )}

                </form>
              </div>

            </div>
          </section>

          {/* 🚀 Dynamic Career Learning Paths (Light!) */}
          <section className="bg-white border border-slate-205 rounded-3xl p-8 shadow-sm space-y-8">
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-150 pb-6">
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded border border-blue-100 uppercase block w-max">
                  RecruitIQ Training Guild
                </span>
                <h3 className="text-2xl font-black text-blue-950 tracking-tight leading-none">
                  Accelerate your technical positioning.
                </h3>
                <p className="text-xs text-slate-500 max-w-xl">
                  Take premium courses designed to match verification checkpoints running on corporate platforms, certified on Nairobi networks.
                </p>
              </div>

              {/* Course switch tabs */}
              <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-201 text-[11px] font-bold">
                <button
                  onClick={() => setActiveCareerTopic("tech")}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeCareerTopic === "tech"
                      ? "bg-white text-blue-600 shadow-xs border border-slate-251"
                      : "text-slate-605 hover:text-slate-900"
                  }`}
                >
                  Technology
                </button>
                <button
                  onClick={() => setActiveCareerTopic("business")}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeCareerTopic === "business"
                      ? "bg-white text-blue-600 shadow-xs border border-slate-251"
                      : "text-slate-655 hover:text-slate-900"
                  }`}
                >
                  Management
                </button>
                <button
                  onClick={() => setActiveCareerTopic("learning")}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeCareerTopic === "learning"
                      ? "bg-white text-blue-600 shadow-xs border border-slate-251"
                      : "text-slate-605 hover:text-slate-900"
                  }`}
                >
                  Regulated Audit Rules
                </button>
              </div>
            </div>

            {/* Path details */}
            {activeCareerTopic === "tech" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-white p-6 rounded-2xl border-b-4 border-amber-300 space-y-3 shadow-2xs hover:-translate-y-1 transition duration-150 border border-slate-150">
                  <div className="w-8 h-8 rounded-lg bg-blue-55 text-amber-600 flex items-center justify-center font-bold">
                    <BookOpen size={16} />
                  </div>
                  <h4 className="font-bold text-blue-950 text-xs uppercase font-mono tracking-wider">Full-Stack Interface Modeling</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    Designing React dashboards using TypeScript, organizing state changes, and optimizing dynamic components with client parameters.
                  </p>
                  <div className="text-[10px] font-mono font-bold text-slate-400 flex justify-between pt-1">
                    <span>★ 4.9 Premium</span>
                    <span>12 Chapters</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border-b-4 border-blue-400 space-y-3 shadow-2xs hover:-translate-y-1 transition duration-150 border border-slate-150">
                  <div className="w-8 h-8 rounded-lg bg-blue-55 text-blue-600 flex items-center justify-center font-bold">
                    <GraduationCap size={16} />
                  </div>
                  <h4 className="font-bold text-blue-950 text-xs uppercase font-mono tracking-wider">Fintech Daraja Middleware</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    Learn to connect Lipa Na M-Pesa programmatic parameters, deploy secure billing tables, and verify transactions under 1 second.
                  </p>
                  <div className="text-[10px] font-mono font-bold text-slate-400 flex justify-between pt-1">
                    <span>★ 4.8 Elite</span>
                    <span>8 Chapters</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border-b-4 border-amber-400 space-y-3 shadow-2xs hover:-translate-y-1 transition duration-150 border border-slate-150">
                  <div className="w-8 h-8 rounded-lg bg-blue-55 text-amber-600 flex items-center justify-center font-bold">
                    <TrendingUp size={16} />
                  </div>
                  <h4 className="font-bold text-blue-950 text-xs uppercase font-mono tracking-wider">Rest API Caching Models</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    Manage high scalability limits, write Node.js controllers, optimize PostgreSQL databases, and run Docker on local cloud hosts.
                  </p>
                  <div className="text-[10px] font-mono font-bold text-slate-400 flex justify-between pt-1">
                    <span>★ 4.9 Rated</span>
                    <span>10 Chapters</span>
                  </div>
                </div>

              </div>
            )}

            {activeCareerTopic === "business" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-amber-50/20 p-6 rounded-2xl border-t-4 border-blue-600 space-y-3 border border-slate-205">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Users size={16} />
                  </div>
                  <h4 className="font-bold text-blue-950 text-xs uppercase font-mono tracking-wider">HR Digital Sourcing Matrix</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    Establish compliant candidate evaluation guidelines, configure cognitive scoreboards fairly, and avoid profiling errors.
                  </p>
                  <div className="text-[10px] font-mono font-bold text-slate-400 flex justify-between pt-1 border-t pt-1.5">
                    <span>★ 4.8 Premium</span>
                    <span>6 Modules</span>
                  </div>
                </div>

                <div className="bg-amber-50/20 p-6 rounded-2xl border-t-4 border-amber-400 space-y-3 border border-slate-205">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Zap size={16} />
                  </div>
                  <h4 className="font-bold text-blue-950 text-xs uppercase font-mono tracking-wider">Multi-Tenant Billing Setup</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    SaaS allocation concepts, setting subscription thresholds, processing bulk corporate receipts, and allocating post quotas.
                  </p>
                  <div className="text-[10px] font-mono font-bold text-slate-400 flex justify-between pt-1 border-t pt-1.5">
                    <span>★ 5.0 Top Track</span>
                    <span>5 Modules</span>
                  </div>
                </div>

                <div className="bg-amber-50/20 p-6 rounded-2xl border-t-4 border-blue-600 space-y-3 border border-slate-205">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Award size={16} />
                  </div>
                  <h4 className="font-bold text-blue-950 text-xs uppercase font-mono tracking-wider">Stakeholder Transparency Management</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    Coordinating human screening pipelines, providing clear feedback matrices, and maintaining compliant candidate portals.
                  </p>
                  <div className="text-[10px] font-mono font-bold text-slate-400 flex justify-between pt-1 border-t pt-1.5">
                    <span>★ 4.7 Rated</span>
                    <span>4 Modules</span>
                  </div>
                </div>

              </div>
            )}

            {activeCareerTopic === "learning" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-emerald-500/5 text-emerald-950 p-6 rounded-2xl border-l-4 border-emerald-500 space-y-3 border border-emerald-100/80">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <ShieldCheck size={16} />
                  </div>
                  <h4 className="font-extrabold text-blue-950 text-xs uppercase font-mono tracking-wider">Kenya Data Protection Law 2019</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    Sovereignty protocols regarding candidate personally identifiable information (PII) data collection, processing consent, and storage.
                  </p>
                  <div className="text-[10px] font-mono font-bold text-emerald-700 flex justify-between pt-1 border-t border-emerald-100/50 pt-1.5">
                    <span>✓ Mandatory Course</span>
                    <span>3 Chapters</span>
                  </div>
                </div>

                <div className="bg-emerald-500/5 text-emerald-950 p-6 rounded-2xl border-l-4 border-emerald-500 space-y-3 border border-emerald-100/80">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <CheckCircle2 size={16} />
                  </div>
                  <h4 className="font-extrabold text-blue-950 text-xs uppercase font-mono tracking-wider">Section 35 Auditing Criteria</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    Why fully automatic filters are strictly restricted without manual oversight and how we enforce human-in-the-loop screening.
                  </p>
                  <div className="text-[10px] font-mono font-bold text-emerald-700 flex justify-between pt-1 border-t border-emerald-100/50 pt-1.5">
                    <span>✓ ODPC Recommended</span>
                    <span>4 Chapters</span>
                  </div>
                </div>

                <div className="bg-emerald-500/5 text-emerald-950 p-6 rounded-2xl border-l-4 border-emerald-500 space-y-3 border border-emerald-100/80">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Users size={16} />
                  </div>
                  <h4 className="font-extrabold text-blue-950 text-xs uppercase font-mono tracking-wider">Candidate Right of Erasure</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    Step-by-step guidance on implementing Section 40 "Right to be Forgotten" scrubbing tools inside Express Node JS SQL databases.
                  </p>
                  <div className="text-[10px] font-mono font-bold text-emerald-700 flex justify-between pt-1 border-t border-emerald-100/50 pt-1.5">
                    <span>✓ Regulatory Standard</span>
                    <span>5 Chapters</span>
                  </div>
                </div>

              </div>
            )}
          </section>

          {/* 🎯 Twin Pathway Navigation Boards (Light, No Black background layout) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Seeker pathway card */}
            <div className="bg-white border-2 border-slate-250 hover:border-blue-500 rounded-3xl p-8 flex flex-col justify-between space-y-8 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full pointer-events-none"></div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-105">
                    <Briefcase size={22} className="stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-mono font-black text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full block">
                    💼 CANDIDATES OPEN BOARD
                  </span>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest block">Job Seekers Panel</span>
                  <h3 className="text-xl font-black text-blue-950">Access Legitimate Vacancies</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    Submit application parameters, pass technical vector screening sandbox diagnostics, and coordinate direct recruiter matching checks easily.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 pt-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                    <span>No pre-filtered machine rejections. Every file is audited.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                    <span>Check application status and scores in real-time.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                    <span>Exercise Section 40 erasure rights immediately.</span>
                  </li>
                </ul>
              </div>

              <button 
                onClick={onSelectSeeker}
                className="w-full text-center py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs transition cursor-pointer uppercase tracking-wider shadow-sm active:scale-95"
              >
                Find Careers & Apply Directly <ArrowRight size={12} className="inline opacity-80" />
              </button>
            </div>

            {/* Corporate pathway card - (light styled with amber-gold accents!) */}
            <div className="bg-amber-50/45 border-2 border-amber-300 hover:border-amber-400 rounded-3xl p-8 flex flex-col justify-between space-y-8 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-full pointer-events-none"></div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white text-amber-600 border border-amber-300 flex items-center justify-center">
                    <Users size={22} className="stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-mono font-black text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full block">
                    👑 CORPORATES CONSOLE
                  </span>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-extrabold text-amber-700 uppercase tracking-widest block">Enterprise Tenant Hub</span>
                  <h3 className="text-xl font-black text-blue-950">Engage Compliance Recruits</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    Publish vacancies, define vetting vectors, trigger STK payments natively, and overview candidate scorings safely under Section 35 audit lines.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 pt-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-amber-500 shrink-0" />
                    <span>Set quotas based on active payment boundaries.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-amber-500 shrink-0" />
                    <span>Manage multiple organizational administrators.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-amber-500 shrink-0" />
                    <span>Download legal audit logs for regulatory officers.</span>
                  </li>
                </ul>
              </div>

              <button 
                onClick={onSelectCorporate}
                className="w-full text-center py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold rounded-xl text-xs transition cursor-pointer uppercase tracking-wider shadow-sm active:scale-95"
              >
                Access Recruiter Portal <ArrowUpRight size={12} className="inline opacity-80" />
              </button>
            </div>

          </section>

          {/* 🔔 Featured Vacancy Listings (Clean, No Dark apply button style!) */}
          <section className="space-y-6">
            <div className="flex justify-between items-end border-b border-slate-150 pb-4">
              <div className="space-y-11">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Live Openings On-The-Fly</span>
                <h3 className="text-2xl font-black text-blue-950 tracking-tight leading-none">Featured Opportunity Pipelines</h3>
              </div>
              <button 
                onClick={onSelectSeeker}
                className="text-blue-600 hover:text-blue-700 font-bold transition flex items-center gap-1.5 text-xs bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
              >
                Active Vacancies Directory ({jobs.length}) <ArrowRight size={14} className="inline" />
              </button>
            </div>

            {featuredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center text-slate-400 text-xs border border-dashed border-slate-201 shadow-sm">
                💼 No active vacancy items found in our local database branches yet. Login to corporate console above to register your first opening.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredJobs.map(j => (
                  <div key={j.id} className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-6 shadow-sm transition-all flex flex-col justify-between space-y-4 group relative">
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[9px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                            {j.department}
                          </span>
                          <h4 className="font-extrabold text-blue-950 text-sm mt-1 group-hover:text-blue-605 transition-colors line-clamp-1">{j.title}</h4>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-250 px-2.5 py-1 rounded shrink-0 leading-none">
                          {j.evaluationObjectives?.min_years_experience ? `${j.evaluationObjectives.min_years_experience}+ Years Exp` : "Expert"}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-light">
                        {j.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs font-mono">
                      <span className="text-[10px] text-slate-400">📍 {j.location || "Nairobi"}</span>
                      <button 
                        onClick={() => onSelectJob(j.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase px-3.5 py-2 rounded-lg transition shadow-sm"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 🌟 TRUSTED BY KENYAN INNOVATORS SECTION */}
          <section className="space-y-8 pt-8 border-t border-slate-100 font-sans">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-[10px] uppercase font-mono font-bold text-amber-700">
                <Star size={11} className="fill-amber-500 text-amber-500" /> Authorized Local Traction Cases
              </div>
              <h3 className="text-2xl font-black text-blue-950 tracking-tight">Trusted by Kenyan Innovators</h3>
              <p className="text-xs text-slate-500 max-w-2xl mx-auto">
                Discover how leading technological and logistics organizations in Nairobi use RecruitIQ's cognitive parities to safeguard digital compliance and hire talent.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Testimonial 1 */}
              <div className="bg-white border-2 border-slate-100 hover:border-[#D4AF37] p-5 rounded-2xl shadow-2xs transition-all duration-300 relative space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-0.5 text-[#D4AF37]">
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic font-light">
                    "The multi-tenant architecture and anti-CV fraud checkpoints in RecruitIQ saved our HR panel over 120 hours in the first three weeks of recruitment sprints. Robust and regulatory-sound."
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100 font-sans">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 shrink-0 select-none">TO</div>
                  <div>
                    <strong className="text-xs block text-slate-800 font-bold">Timothy Ouma</strong>
                    <span className="text-[10px] text-slate-400 block font-mono">DevOps, Morggy Tech</span>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white border-2 border-slate-100 hover:border-[#D4AF37] p-5 rounded-2xl shadow-2xs transition-all duration-300 relative space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-0.5 text-[#D4AF37]">
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic font-light">
                    "Lipa Na M-Pesa automated subscription setups are highly convenient. We managed 3 concurrent department drafts flawlessly with zero administrative bottlenecks and complete local compliance."
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100 font-sans">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-700 shrink-0 select-none">AY</div>
                  <div>
                    <strong className="text-xs block text-slate-800 font-bold">Amina Yusuf</strong>
                    <span className="text-[10px] text-slate-400 block font-mono">HR Dir, Safiri Logistics</span>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white border-2 border-slate-100 hover:border-[#D4AF37] p-5 rounded-2xl shadow-2xs transition-all duration-300 relative space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-0.5 text-[#D4AF37]">
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic font-light">
                    "An absolute game-changer for KDPA/ODPC compliance checking. Seamless candidate deletion compliance safeguards and no stressful automated auto-reject black-boxes."
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100 font-sans">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 shrink-0 select-none">GK</div>
                  <div>
                    <strong className="text-xs block text-slate-800 font-bold">George Kamau</strong>
                    <span className="text-[10px] text-slate-400 block font-mono">CCO, Boma Housing</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* 📬 FAQ ACCORDION ADVISORY SECTION */}
          <section className="space-y-8 pt-8 border-t border-slate-100 font-sans">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold font-mono text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                Support Mitigation Desk
              </span>
              <h3 className="text-2xl font-black text-blue-950 tracking-tight">Sovereign FAQ & Operations Advisory</h3>
              <p className="text-xs text-slate-500 max-w-2xl mx-auto">
                Detailed information regarding tenant isolation, applicant billing immunity, technical verification blitz criteria, and Section 40 data deletion mechanisms.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {[
                {
                  q: "How is tenant separation and applicant isolation maintained on RecruitIQ?",
                  a: "RecruitIQ uses secure, isolated multi-tenant data tags. Each company operates in its own sandboxed subdomain. No candidate files, AI logs, or criteria configurations are ever leaked or shared across organizations."
                },
                {
                  q: "Is RecruitIQ always 100% free for job seekers?",
                  a: "Yes, unconditionally. Job seekers can create profiles, take the tech verification blitz screening, and submit resumes totally free. There are absolutely no hidden micro-fees, premium seeker tiers, or digital costs."
                },
                {
                  q: "How does the Anti-CV Fraud Technical Verification Blitz work?",
                  a: "When candidates apply, they are invited to complete an interactive 3-question practical evaluation tailored dynamically to the job guidelines. This prevents skills inflation and ensures code/legal parities remain genuine."
                },
                {
                  q: "How are data deletion requests handled under Kenya's Data Protection Act (KDPA)?",
                  a: "In accordance with Section 40 of Kenya's Data Protection Act, job seekers can permanently request complete data erasure. Once requested, all files, profiles, AI matching ratings, and audit records are immediately purged."
                },
                {
                  q: "What are the automated subscription limit bounds?",
                  a: "The Seasonal Pack handles up to 25 applications per job role. The popular Corporate Standard handles 70 applications per job role, while the Enterprise Premium supports unmetered candidate processing with cbk-compliant channels."
                }
              ].map((item, idx) => {
                const isOpen = activeFaqIndex === idx;
                return (
                  <div 
                    key={idx} 
                    className="bg-white border border-slate-200 hover:border-blue-200 rounded-xl overflow-hidden transition-all duration-300"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left p-4.5 font-bold text-slate-850 hover:text-blue-600 flex items-center justify-between gap-4 text-xs select-none transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle size={15} className="text-blue-500 shrink-0" />
                        {item.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp size={16} className="text-[#D4AF37] shrink-0" />
                      ) : (
                        <ChevronDown size={16} className="text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4.5 pb-4.5 text-[11px] text-slate-500 leading-relaxed font-light bg-slate-50/50 border-t border-slate-100 animate-fade-in whitespace-pre-line">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      )}

      {/* ----------------- TAB SECTION: ABOUT US ----------------- */}
      {homeTab === "about" && (
        <div className="space-y-12 animate-fade-in max-w-4xl mx-auto">
          
          {/* Header block */}
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 border border-blue-105 px-3 py-1.5 rounded-full uppercase">
              Compliance-Driven Software Engineering
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-blue-950 leading-tight">
              About RecruitIQ & Morggy Technologies
            </h2>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto">
              Delivering secure, localized technical assessment networks across East Africa, ensuring compliance with the Office of the Data Protection Commissioner (ODPC) of Kenya.
            </p>
          </div>

          {/* Premium layout graphic segment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 md:p-8 rounded-3xl border border-slate-205 shadow-sm">
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-blue-950">Vanguard Vetting Frameworks</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Developed locally under the engineering supervision of **Morggy Technologies**, RecruitIQ v2.0 was designed to alleviate recruitment friction. Corporate teams face constant skills inflation, while job applicants frequently get excluded by opaque black-box machine-learning filters.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                We believe in **digital sovereignty** and **proportional, auditable matching scores**. Our platform does not implement unilateral automation algorithms. We maintain a strict "Human-In-The-Loop" methodology which requires physical recruitment managers to oversee and record final hirings manually.
              </p>
              
              <div className="pt-2">
                <blockquote className="border-l-4 border-amber-400 pl-3 italic text-xs text-slate-500 bg-amber-50/50 py-2 rounded-r-lg">
                  "Our goal is absolute alignment under Section 35 of the KDPA act, proving that technical tools can be both powerful and protective of digital human rights."
                  <span className="block text-[10px] uppercase tracking-wider text-amber-700 font-extrabold font-mono mt-1">— Morggy Technologies Executive Board</span>
                </blockquote>
              </div>
            </div>

            {/* Core Pillars Grid */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-widest font-mono text-amber-805 font-bold">Our Operational Pillars</h4>
              
              <div className="space-y-3">
                
                <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-200 shadow-3xs flex gap-3.5">
                  <div className="bg-blue-600 text-white p-2 rounded-lg h-9 w-9 flex items-center justify-center shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-blue-950 uppercase tracking-tight font-mono">1. Absolute PII Safeguards</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">We fully encrypt personal identifying documents, and provide real-time Section 40 erasure triggers so candidates manage their data.</p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-250 shadow-3xs flex gap-3.5">
                  <div className="bg-[#D4AF37] text-white p-2 rounded-lg h-9 w-9 flex items-center justify-center shrink-0">
                    <Cpu size={18} />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-amber-950 uppercase tracking-tight font-mono">2. Anti-bias Score Grids</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">We analyze matching vectors strictly off keyword parities, eliminating arbitrary demographic profiling flags completely.</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-200 shadow-3xs flex gap-3.5">
                  <div className="bg-blue-600 text-white p-2 rounded-lg h-9 w-9 flex items-center justify-center shrink-0">
                    <Landmark size={18} />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-blue-950 uppercase tracking-tight font-mono">3. Financial Accessibility</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">Processing direct micro-STK paybill transactions native in Kenya keeps onboarding costs down for small Juja boutiques and large Nairobi firms.</p>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Quick numbers block */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-3xl font-mono font-black text-blue-600 block">100%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">KDPA Regulated</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-3xl font-mono font-black text-amber-500 block">KSh 0</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Pay-To-Apply Fees</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-3xl font-mono font-black text-blue-600 block">&lt; 1s</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Evaluation Speed</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-3xl font-mono font-black text-amber-400 block">24/7</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Central Auditing</span>
            </div>
          </div>

        </div>
      )}

       {homeTab === "pricing" && (
        <div className="space-y-12 animate-fade-in max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 justify-center">
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 border border-blue-105 px-3 py-1 rounded-full uppercase">
                Corporate Onboarding Subscriptions
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase animate-pulse">
                🎓 Always 100% Free For Job Seekers
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950">
              Honest Plans, Zero Hidden Fees
            </h2>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto">
              Our structures respect enterprise division scales. Pay securely using Safaricom Till/Paybill numbers under automated client limits.
            </p>

            {/* Ethical Jobseeker Alert Banner */}
            <div className="max-w-2xl mx-auto bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-2.5 text-left text-xs text-emerald-850">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold font-mono text-xs shrink-0 select-none">✓</span>
              <div>
                <strong className="font-extrabold text-emerald-950">Job Seeker Ethical Guarantee:</strong>
                <p className="text-slate-550 text-[11px] leading-relaxed">
                  We maintain zero costs for applicants. Creating accounts, using the technical verification screening blitz, scoring parities, and submitting applications remains unconditionally **Free**.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Blocks (inclusive of approved corporate portal subscription parameters) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pay-As-You-Go Monthly */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6 relative group hover:border-slate-300">
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block bg-slate-100 w-max px-2.5 py-0.5 rounded font-bold">Seasonal Pack</span>
                <h3 className="text-xl font-bold text-blue-950">Pay-As-You-Go Monthly</h3>
                <p className="text-xs text-slate-500 leading-normal font-light">Ideal for startups or recruiters with active single month hiring seasons.</p>
                <div className="pt-2">
                  <span className="text-3xl font-mono font-black text-slate-800">KES 4,500</span>
                  <span className="text-slate-400 text-xs"> / active month</span>
                </div>
                
                <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl text-center space-y-0.5">
                  <span className="text-[9px] text-orange-700 uppercase font-bold tracking-wider block font-mono">Evaluation Limit Bound</span>
                  <strong className="text-orange-950 text-sm font-black block font-mono">25 APPLICATIONS / JOB</strong>
                </div>

                <div className="border-t pt-4 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    <span>Secure cloud-backed CV indexing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    <span>Anti-CV fraud screening questions blitz</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    <span>1 recruiter administrator profile seat</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={onSelectCorporate} 
                className="w-full text-center py-2.5 bg-slate-150 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase cursor-pointer"
              >
                Launch Pay-As-You-Go
              </button>
            </div>

            {/* Corporate Standard Quarterly */}
            <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-6 relative group hover:shadow-lg">
              <div className="absolute -top-3 left-4 bg-amber-500 text-white font-mono font-bold text-[9px] px-2.5 py-0.5 rounded uppercase tracking-wider border border-[#D4AF37]">
                Popular Standard
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest block bg-amber-50 w-max px-2.5 py-0.5 rounded">Quarterly Pack</span>
                <h3 className="text-xl font-bold text-blue-950">Corporate Standard</h3>
                <p className="text-xs text-slate-500 leading-normal font-light">Best for medium enterprises with active multi-department pipelines.</p>
                <div className="pt-2">
                  <span className="text-3xl font-mono font-black text-blue-600">KES 12,000</span>
                  <span className="text-slate-450 text-xs"> / 3 active months</span>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-0.5">
                  <span className="text-[9px] text-amber-800 uppercase font-bold tracking-wider block font-mono">Evaluation Limit Bound</span>
                  <strong className="text-amber-950 text-sm font-black block font-mono">70 APPLICATIONS / JOB</strong>
                </div>

                <div className="border-t pt-4 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-blue-500 shrink-0" />
                    <span className="font-bold text-blue-950">Up to 70 applications evaluated per vacancy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-blue-500 shrink-0" />
                    <span>Includes up to 5 HR dynamic login seats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-blue-500 shrink-0" />
                    <span>Standard priority Gemini AI matching analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-blue-500 shrink-0" />
                    <span>Full Section 35 compliance sheets & audit trails</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={onSelectCorporate} 
                className="w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs uppercase cursor-pointer shadow-sm"
              >
                Access Standard Portals
              </button>
            </div>

            {/* Enterprise Premium Half-Year */}
            <div className="bg-gradient-to-br from-amber-55/40 via-white to-amber-100/10 border-2 border-[#D4AF37] rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-6 relative group hover:shadow-lg">
              <div className="absolute -top-3 left-4 bg-[#D4AF37] text-slate-900 font-mono font-bold text-[9px] px-2.5 py-0.5 rounded uppercase tracking-wider border border-white">
                Premium Half-Year
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold text-amber-850 uppercase tracking-widest block bg-amber-100 w-max px-2.5 py-0.5 rounded font-bold">Unmetered Pack</span>
                <h3 className="text-xl font-bold text-blue-950">Enterprise Premium</h3>
                <p className="text-xs text-slate-500 leading-normal font-light">Unlimited processing for recruitment agencies & high-yield corporations.</p>
                <div className="pt-2">
                  <span className="text-3xl font-mono font-black text-amber-700">KES 22,000</span>
                  <span className="text-slate-450 text-xs font-bold"> / 6 active months</span>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center space-y-0.5">
                  <span className="text-[9px] text-emerald-700 uppercase font-bold tracking-wider block font-mono">Evaluation Limit Bound</span>
                  <strong className="text-emerald-950 text-sm font-black block font-mono">UNLIMITED OPERATIONS</strong>
                </div>

                <div className="border-t pt-4 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-amber-500 shrink-0" />
                    <span className="font-bold text-amber-950">No applications limits on checks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-amber-500 shrink-0" />
                    <span>Customizable assessment parameters alignment mapping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-amber-500 shrink-0" />
                    <span>Unlimited HR recruiter login seats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-amber-500 shrink-0" />
                    <span>Dual-Signatory CBK Lipa Na M-Pesa billing routes</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={onSelectCorporate} 
                className="w-full text-center py-2.5 bg-[#D4AF37] hover:bg-amber-400 text-slate-900 font-extrabold rounded-xl text-xs uppercase cursor-pointer"
              >
                Access Premium Level
              </button>
            </div>

          </div>

          {/* 📍 CENTRALIZED MORGGY OPERATOR CARD NOTATION */}
          <section className="bg-amber-50/50 p-6 rounded-2xl border-2 border-[#D4AF37]/45 max-w-2xl mx-auto space-y-4 shadow-sm animate-pulse-slow">
            <div className="text-center space-y-1">
              <div className="inline-flex p-2 bg-white rounded-full border border-amber-300 text-[#D4AF37] mb-1">
                <ShieldAlert size={18} />
              </div>
              <h4 className="text-base font-extrabold text-blue-950 font-serif leading-none">Official Operator Registration</h4>
              <p className="text-[11px] text-slate-500 leading-normal">Billing queries or specialized enterprise matching setup coordinates:</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono font-semibold text-slate-750">
              <div className="p-3 bg-white rounded-xl border border-amber-200/80 flex items-center justify-start gap-2.5">
                <Building2 className="text-[#D4AF37]" size={15} />
                <span>Firm: Morggy Technologies</span>
              </div>
              
              <a href="tel:0714042946" className="p-3 bg-white hover:bg-amber-50 rounded-xl border border-amber-200/80 flex items-center justify-start gap-2.5 transition text-blue-600">
                <Phone className="text-[#D4AF37]" size={15} />
                <span>Call: 0714042946</span>
              </a>
              
              <div className="p-3 bg-white rounded-xl border border-amber-200/80 flex items-center justify-start gap-2.5 font-mono">
                <MapPin className="text-[#D4AF37]" size={15} />
                <span>Juja: Nairobi Juja, Kenya</span>
              </div>
              
              <a href="mailto:morggytechnologies@gmail.com" className="p-3 bg-white hover:bg-amber-50 rounded-xl border border-amber-200/80 flex items-center justify-start gap-2.5 transition text-blue-600 truncate" title="morggytechnologies@gmail.com">
                <Mail className="text-[#D4AF37] shrink-0" size={15} />
                <span className="truncate">morggytechnologies@gmail.com</span>
              </a>
            </div>

            <p className="text-[10px] text-slate-400 font-mono text-center pt-1 leading-normal uppercase">
              Registered System Provider REF: #MORGGEY-DPA-NAIROBI-2026
            </p>
          </section>

        </div>
      )}

      {/* ----------------- TAB SECTION: CONTACT US ----------------- */}
      {homeTab === "contact" && (
        <div className="space-y-12 animate-fade-in max-w-4xl mx-auto">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 border border-blue-105 px-3 py-1.5 rounded-full uppercase">
              24/7 Corporate Systems Desk
            </span>
            <h2 className="text-3xl font-extrabold text-blue-950 font-serif leading-tight">
              Get in Touch with our Representative team
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              We respond to local paybill setups, administrative divisions parameters, and ODPC compliant pipeline audit registrations under 2 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Direct Address Details */}
            <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-201 shadow-sm space-y-5">
              
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-blue-950 uppercase font-mono tracking-wider">Morggy Technologies</h4>
                <p className="text-xs text-slate-400">Headquarters & Technical Operations Branch Office</p>
              </div>

              {/* Contacts */}
              <div className="space-y-4 text-xs font-sans text-slate-650">
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 font-bold flex items-center justify-center shrink-0 border border-amber-100">
                    <MapPin size={15} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">Operational Address</span>
                    <span className="text-slate-500 block">Nairobi Juja, Kenya</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Nairobi-Thika Highway campus wing</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0 border border-blue-100">
                    <Phone size={15} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">Official Telephone Desk</span>
                    <a href="tel:0714042946" className="text-blue-600 hover:underline block font-mono font-black">0714042946 / 0714042946</a>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Safaricom line: Monday to Friday 8AM - 5PM</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 font-bold flex items-center justify-center shrink-0 border border-amber-100">
                    <Mail size={15} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">Official Support Inbox</span>
                    <a href="mailto:morggytechnologies@gmail.com" className="text-blue-600 hover:underline block font-mono">morggytechnologies@gmail.com</a>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Typically replies under 60 minutes</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0 border border-blue-100">
                    <MessageSquare size={15} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">M-Pesa till Audit Gate</span>
                    <span className="text-slate-500 font-mono block">Till ID: 4568912 (Til-Pay limited)</span>
                  </div>
                </div>

              </div>

              {/* Mini ODPC Compliance statement */}
              <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-100 text-[11px] text-slate-500 leading-normal flex items-start gap-2 font-light">
                <ShieldCheck size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <span>Applicants can lodge erasure or data inspection actions natively on the candidate status lookup directory under <strong>Section 40</strong> compliance rights.</span>
              </div>

            </div>

            {/* Right Column: Interactive contact form (Light-themed, no heavy black slate!) */}
            <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-201 shadow-sm">
              {contactSuccess ? (
                <div className="p-8 text-center space-y-4 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900 leading-none">Inquiry logged Successfully</h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                    Thank you. Your message has been routed to Morggy Technologies systems division in Nairobi. One of our operational leads will call or email you shortly.
                  </p>
                  <button 
                    onClick={() => setContactSuccess(false)}
                    className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg hover:bg-blue-100 transition duration-150 cursor-pointer"
                  >
                    Submit another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 font-sans text-xs">
                  <h4 className="text-sm font-extrabold text-blue-9 scale block font-mono uppercase tracking-wider pb-2 border-b">
                    Send message to Morggy Technologies
                  </h4>

                  <div className="space-y-1">
                    <label className="text-slate-600 font-extrabold flex items-center gap-1">Full Name / Corporate Title</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                      placeholder="e.g. Timothy Banjo (Talent Acquisition Director)"
                      className="w-full text-xs p-2.5 border-2 border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:outline-none rounded-lg bg-blue-55/10"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-600 font-extrabold">Primary Email Address</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                        placeholder="e.g. timothy@company.co.ke"
                        className="w-full text-xs p-2.5 border-2 border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:outline-none rounded-lg bg-blue-55/10"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-extrabold">Telephone Line (For Callback)</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 0712345678"
                        className="w-full text-xs p-2.5 border-2 border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:outline-none rounded-lg bg-blue-55/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-600 font-extrabold">Detailed Support inquiry / Billing request</label>
                    <textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required
                      rows={4}
                      placeholder="e.g. 'I would like to upgrade our RecruitIQ sub-tenancy branch to the Gold Premium Pipeline (70 Candidates match limit, verified anti-fraud screening questions). Please send payment steps on M-Pesa.'"
                      className="w-full text-xs p-2.5 border-2 border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:outline-none rounded-lg bg-blue-55/10 font-mono"
                    />
                  </div>

                  {/* Submit item */}
                  <button
                    type="submit"
                    disabled={isSendingMessage}
                    className="w-full bg-blue-600 hover:bg-blue-750 text-white font-black rounded-xl py-3 transition shadow-sm active:scale-95 transform flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer text-xs"
                  >
                    <span>{isSendingMessage ? "Dispatching Query..." : "Submit Dispatch message"}</span>
                    <Send size={13} />
                  </button>

                  <p className="text-[10px] text-slate-400 font-mono text-center">
                    ✓ Your inquiry data will be kept secure under Nairobi local hosting protocols
                  </p>

                </form>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
