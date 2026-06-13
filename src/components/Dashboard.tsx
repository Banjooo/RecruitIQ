import React, { useState } from "react";
import { Job, Candidate, TenantConfig } from "../types";
import { UserCheck, Briefcase, Plus, Sparkles, Filter, CheckCircle, Search, Info, Trash2, ArrowUpRight, Scale, AlertCircle, ChevronRight, Shield } from "lucide-react";
import PricingBenefits from "./PricingBenefits";
import RecruitmentMetrics from "./RecruitmentMetrics";

interface DashboardProps {
  tenant: TenantConfig;
  jobs: Job[];
  candidates: Candidate[];
  onAddJob: (jobData: any) => Promise<any>;
  onUpdateCandidateStatus: (id: string, status: Candidate["status"], remarks: string) => Promise<any>;
  onNavigateToTab?: (tab: "candidates" | "jobs" | "billing" | "compliance" | "admins") => void;
}

export default function Dashboard({
  tenant,
  jobs,
  candidates,
  onAddJob,
  onUpdateCandidateStatus,
  onNavigateToTab
}: DashboardProps) {
  // Navigation & filtering states
  const [activeTab, setActiveTab] = useState<"candidates" | "jobs-manager" | "email-dispatches" | "pricing" | "metrics">("candidates");
  const [selectedJobIdFilter, setSelectedJobIdFilter] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [queryName, setQueryName] = useState("");
  
  // Comparative analysis selection list
  const [selectedCandidatesToCompare, setSelectedCandidatesToCompare] = useState<string[]>([]);
  const [isComparingViewOpen, setIsComparingViewOpen] = useState(false);

  // Recruiter dispatched email alerts memory state
  const [recruiterAlerts, setRecruiterAlerts] = useState<any[]>([]);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState<string>("");

  const activeAlert = recruiterAlerts.find((item, idx) => {
    const idStr = item.id || idx.toString();
    return idStr === selectedAlertId;
  }) || recruiterAlerts[0] || null;

  // Selected candidate detail panel
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(candidates[0] || null);

  // New job modal state & dynamic screening parameters
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [newLocation, setNewLocation] = useState("Nairobi, Westlands");
  const [newDescription, setNewDescription] = useState("");
  const [mustHaveTags, setMustHaveTags] = useState<string>("");
  const [minExp, setMinExp] = useState(1);
  const [minEdu, setMinEdu] = useState("Bachelor's or Diploma");
  const [customAttr, setCustomAttr] = useState("");
  const [newMatchAlertThreshold, setNewMatchAlertThreshold] = useState<number>(80);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Suggested screening questions from Gemini to hold for the job creator form
  const [screeningQ1, setScreeningQ1] = useState("");
  const [screeningQ2, setScreeningQ2] = useState("");
  const [screeningQ3, setScreeningQ3] = useState("");

  // Multi-option selections for requirements, degrees, and what to do
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);
  const [selectedWhatToDo, setSelectedWhatToDo] = useState<string[]>([]);

  // HR Preset Role Templates
  const handleApplyRolePreset = (preset: "software_engineer" | "hr_compliance" | "backend_developer") => {
    if (preset === "software_engineer") {
      setNewTitle("Frontend Software Engineer");
      setNewDepartment("Engineering");
      setNewLocation("Nairobi, Westlands (Hybrid)");
      setNewDescription("We are looking for a Software Engineer to lead the design and localization of corporate web solutions in East Africa. This role is responsible for crafting clean, responsive React frontends and ensuring seamless integration with local banking clearing houses.");
      setSelectedDegrees(["BSc in Computer Science / Software Engineering", "Bachelor of Business Information Technology (BBIT)"]);
      setSelectedRequirements(["TypeScript, React.js & Tailwind CSS", "Git distributed version control & team pull requests"]);
      setSelectedWhatToDo(["Design and deploy compliant SaaS recruitment flows", "Write clean, robust, and responsive user interface code"]);
      setMustHaveTags("React, TypeScript, CSS, Tailwind");
      setMinExp(3);
      setMinEdu("BSc in Computer Science");
      setCustomAttr("Agile methodology, Hybrid Westlands Nairobi setting");
      setScreeningQ1("Have you built high-priority responsive frontends in React?");
      setScreeningQ2("What version control branching strategy do you prefer?");
      setScreeningQ3("Are you available for hybrid workspace schedules?");
    } else if (preset === "hr_compliance") {
      setNewTitle("HR & Legal Compliance Specialist");
      setNewDepartment("Administrative & Legal");
      setNewLocation("Nairobi, Upper Hill");
      setNewDescription("Seeking an HR and Compliance Specialist to overlook digital recruitment pipelines, verify automated screening logs, and safeguard candidate data under the guidelines of the Office of the Data Protection Commissioner of Kenya (ODPC).");
      setSelectedDegrees(["Bachelor of Commerce (Human Resources)"]);
      setSelectedRequirements(["Kenyan Data Protection Act (KDPA) Auditing Guidelines", "Candidate Data Protection & ODPC Regulations"]);
      setSelectedWhatToDo(["Conduct detailed manual criteria validation under KDPA Safeguards", "Formulate clear employee policies and direct onboarding matrices"]);
      setMustHaveTags("Compliance, Law, HR, KDPA");
      setMinExp(4);
      setMinEdu("Bachelor of Commerce (HR) or Law degree");
      setCustomAttr("Kenyan Labor Laws, HR auditing");
      setScreeningQ1("How do you design recruitment checklists that respect ODPC standards?");
      setScreeningQ2("Describe your experience managing regulatory human resource disputes.");
      setScreeningQ3("Are you fully available for local on-site team sessions?");
    } else if (preset === "backend_developer") {
      setNewTitle("Backend Stack Developer");
      setNewDepartment("Engineering");
      setNewLocation("Mombasa Branch");
      setNewDescription("Join our Engineering core team to design and maintain secure backend processing networks, database pipelines, and payment APIs (Safaricom Daraja / direct institutional banks matching).");
      setSelectedDegrees(["BSc in Computer Science / Software Engineering", "Diploma in IT / Computer Science"]);
      setSelectedRequirements(["Node.js, Express & REST API integrations", "PostgreSQL & Relational SQL queries"]);
      setSelectedWhatToDo(["Optimize database structures and secure server-side API proxy routes", "Integrate Safaricom Daraja API for M-Pesa automated transaction clearing"]);
      setMustHaveTags("Node.js, Express, SQL, M-Pesa, API");
      setMinExp(2);
      setMinEdu("BSc in Computer Science or High Diploma");
      setCustomAttr("Relational databases, Daraja SDKs, backend security");
      setScreeningQ1("How do you secure API secrets from getting exposed in front-end assets?");
      setScreeningQ2("What relational query optimizations do you recommend for large candidate lists?");
      setScreeningQ3("Can you work with complex distributed microservice systems?");
    }
  };

  // Human intervention comment state
  const [humanRemarks, setHumanRemarks] = useState("");

  // Aggregate stats
  const totalApplied = candidates.length;
  const totalShortlisted = candidates.filter(c => c.status === "Shortlisted").length;
  const totalReviewing = candidates.filter(c => c.status === "Reviewing").length;

  // Let Gemini automatically extract goals from a sample text description
  const handleSuggestObjectives = async () => {
    if (!newDescription || newDescription.trim().length < 15) {
      alert("Please provide a slightly more descriptive job summary first.");
      return;
    }
    setIsSuggesting(true);
    try {
      const response = await fetch("/api/suggest-objectives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: newDescription }),
      });
      const data = await response.json();
      if (data.objectives) {
        setMustHaveTags(data.objectives.must_have?.join(", ") || "");
        setMinExp(data.objectives.min_years_experience || 2);
        setMinEdu(data.objectives.minimum_education || "Bachelor's degree or practical bootcamp equivalent");
        setCustomAttr(data.objectives.custom_attributes?.join(", ") || "");
        
        // Populate custom screening questions returned by our upgraded API
        const qList = data.objectives.screening_questions || [];
        setScreeningQ1(qList[0] || "Describe your custom technical workflow.");
        setScreeningQ2(qList[1] || "How do you align code bases to secure best practices?");
        setScreeningQ3(qList[2] || "What is your main professional driver?");
      }
    } catch (err) {
      console.error("AI Goal suggestions error:", err);
      // Fallback
      setMustHaveTags("React, CSS, Git");
      setMinExp(1);
      setMinEdu("Bachelor's degree / Higher Diploma");
      setScreeningQ1("What projects have you delivered using React?");
      setScreeningQ2("Do you work well collaborating using Git repositories?");
      setScreeningQ3("Are you comfortable working in hybrid settings?");
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tagList = mustHaveTags.split(",").map((s) => s.trim()).filter(Boolean);
      const attrList = customAttr.split(",").map((s) => s.trim()).filter(Boolean);

      // Build an enriched description incorporating the multi-selected objectives
      let enrichedDescription = newDescription;
      if (selectedDegrees.length > 0) {
        enrichedDescription += `\n\n[Degrees Preferred]\n- ` + selectedDegrees.join('\n- ');
      }
      if (selectedRequirements.length > 0) {
        enrichedDescription += `\n\n[Requirements & Tech Stacks Requested]\n- ` + selectedRequirements.join('\n- ');
      }
      if (selectedWhatToDo.length > 0) {
        enrichedDescription += `\n\n[Core Responsibilities (What to Do)]\n- ` + selectedWhatToDo.join('\n- ');
      }

      await onAddJob({
        organizationId: tenant.id,
        title: newTitle,
        department: newDepartment || "General",
        location: newLocation,
        description: enrichedDescription,
        evaluationObjectives: {
          must_have: tagList,
          min_years_experience: minExp,
          minimum_education: selectedDegrees.length > 0 ? selectedDegrees.join(" or ") : minEdu,
          custom_attributes: [
            ...attrList,
            ...selectedRequirements.map(r => `Req: ${r}`),
            ...selectedWhatToDo.map(w => `Do: ${w}`)
          ]
        },
        screeningQuestions: [screeningQ1, screeningQ2, screeningQ3].filter(Boolean),
        matchAlertThreshold: newMatchAlertThreshold
      });
      setIsCreatingJob(false);
      // clear
      setNewTitle("");
      setNewDepartment("");
      setNewLocation("Nairobi, Westlands");
      setNewDescription("");
      setMustHaveTags("");
      setCustomAttr("");
      setScreeningQ1("");
      setScreeningQ2("");
      setScreeningQ3("");
      setNewMatchAlertThreshold(80);
      setSelectedDegrees([]);
      setSelectedRequirements([]);
      setSelectedWhatToDo([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkChange = async (targetStatus: Candidate["status"]) => {
    if (selectedCandidatesToCompare.length === 0) return;
    try {
      const remarks = `Automated bulk status update. Handled manually by B2B Recruiter.`;
      await Promise.all(
        selectedCandidatesToCompare.map((id) =>
          onUpdateCandidateStatus(id, targetStatus, remarks)
        )
      );
      setSelectedCandidatesToCompare([]);
      alert(`Successfully updated ${selectedCandidatesToCompare.length} candidates to state: ${targetStatus}`);
    } catch (err) {
      console.error("Bulk transition failure:", err);
      alert("Failed to complete bulk status change.");
    }
  };

  const handleStatusChange = async (targetStatus: Candidate["status"]) => {
    if (!selectedCandidate) return;
    try {
      const remarks = humanRemarks.trim() || `Hiring manager status transition update. Certified Section 35 compliance.`;
      const updated = await onUpdateCandidateStatus(selectedCandidate.id, targetStatus, remarks);
      // reload panel
      setHumanRemarks("");
      setSelectedCandidate(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAlerts = async () => {
    setIsLoadingAlerts(true);
    try {
      const res = await fetch("/api/recruiter-alerts");
      const data = await res.json();
      setRecruiterAlerts(data || []);
    } catch (err) {
      console.error("Alerts hydration failure:", err);
    } finally {
      setIsLoadingAlerts(false);
    }
  };

  React.useEffect(() => {
    fetchAlerts();
  }, [activeTab, candidates]);

  // Filter candidates list
  const filteredCandidates = candidates.filter(cand => {
    if (selectedJobIdFilter !== "all" && cand.jobId !== selectedJobIdFilter) return false;
    if (selectedStatusFilter !== "all" && cand.status !== selectedStatusFilter) return false;
    if (queryName) {
      const fullName = `${cand.firstName} ${cand.lastName}`.toLowerCase();
      if (!fullName.includes(queryName.toLowerCase()) && !cand.email.toLowerCase().includes(queryName.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6" id="dashboard-hud">
      {/* 🎯 ENHANCED KPI METRICS WITH GRADIENTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        
        {/* Total Applicants Card */}
        <div className="card-enhanced hover-lift">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-gradient-primary p-3 rounded-lg shadow-glow-blue">
              <UserCheck className="text-white" size={24} />
            </div>
            <div className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
              <ArrowUpRight size={14} /> +12%
            </div>
          </div>
          <p className="text-slate-600 text-sm font-medium mb-1">Total Applicants</p>
          <p className="gradient-text-primary text-3xl font-bold">{totalApplied}</p>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600" style={{ width: '85%' }}></div>
          </div>
        </div>

        {/* Under Review Card */}
        <div className="card-enhanced hover-lift">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-gradient-warning p-3 rounded-lg shadow-glow-gold">
              <Search className="text-white" size={24} />
            </div>
            <div className="text-sm font-semibold text-amber-600 flex items-center gap-1">
              <AlertCircle size={14} /> Action!
            </div>
          </div>
          <p className="text-slate-600 text-sm font-medium mb-1">Under Review</p>
          <p className="gradient-text-primary text-3xl font-bold">{totalReviewing}</p>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-gradient-to-r from-amber-300 to-amber-600" style={{ width: '60%' }}></div>
          </div>
        </div>

        {/* Shortlisted Card */}
        <div className="card-enhanced hover-lift">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-gradient-success p-3 rounded-lg shadow-glow-success">
              <CheckCircle className="text-white" size={24} />
            </div>
            <div className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
              <ArrowUpRight size={14} /> +8%
            </div>
          </div>
          <p className="text-slate-600 text-sm font-medium mb-1">Shortlisted (AI)</p>
          <p className="gradient-text-primary text-3xl font-bold">{totalShortlisted}</p>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-600" style={{ width: '70%' }}></div>
          </div>
        </div>

        {/* Compliance Status Card */}
        <div className="card-enhanced hover-lift bg-gradient-to-br from-slate-50 to-blue-50 border-l-4 border-gradient-primary">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-gradient-primary p-3 rounded-lg shadow-glow-blue">
              <Shield className="text-white" size={24} />
            </div>
            <span className="badge-success text-xs">Active</span>
          </div>
          <p className="text-slate-600 text-sm font-medium mb-1">KDPA Compliance</p>
          <p className="gradient-text-primary text-lg font-bold">In-Loop Verified</p>
          <p className="text-xs text-emerald-600 font-semibold mt-3">✅ Zero auto-rejections</p>
        </div>
      </div>

      {/* 📊 ENHANCED PLAN ADVISORY BANNER */}
      <div className="glass rounded-xl p-4 border border-white/20 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="bg-gradient-accent text-slate-900 rounded-lg px-3 py-1.5 font-bold font-mono text-xs uppercase tracking-wide shadow-glow-gold">Plan Info</span>
          <span className="text-slate-700 font-body text-sm">
            Current: <span className="gradient-text-primary font-bold uppercase">{tenant.billingPlan.replace(/_/g, " ")}</span> | Max <span className="font-bold">{tenant.billingPlan === "pay_as_you_go" ? 25 : tenant.billingPlan === "standard" ? 70 : "∞"}</span> per job
          </span>
        </div>
        <button 
          onClick={() => setActiveTab("pricing")}
          className="btn-primary text-sm shadow-glow-blue transition-all flex items-center gap-2 whitespace-nowrap"
        >
          Upgrade Plan <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* ENHANCED Navigation tabs */}
      <div className="flex items-center justify-between border-b-2 border-slate-200">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("candidates")}
            className={`px-4 py-3 text-sm font-bold transition-all rounded-t-lg ${
              activeTab === "candidates"
                ? "bg-gradient-primary text-white shadow-md"
                : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
            }`}
          >
            👥 Candidates
          </button>
          <button
            onClick={() => setActiveTab("jobs-manager")}
            className={`px-4 py-3 text-sm font-bold transition-all rounded-t-lg ${
              activeTab === "jobs-manager"
                ? "bg-gradient-primary text-white shadow-md"
                : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
            }`}
          >
            📋 Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab("email-dispatches")}
            className={`px-4 py-3 text-sm font-bold transition-all rounded-t-lg ${
              activeTab === "email-dispatches"
                ? "bg-gradient-primary text-white shadow-md"
                : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
            }`}
          >
            📧 Alerts ({recruiterAlerts.length})
          </button>
          <button
            onClick={() => setActiveTab("metrics")}
            className={`px-4 py-3 text-sm font-bold transition-all rounded-t-lg ${
              activeTab === "metrics"
                ? "bg-gradient-primary text-white shadow-md"
                : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
            }`}
          >
            📊 Metrics
          </button>
          <button
            onClick={() => setActiveTab("pricing")}
            className={`px-4 py-3 text-sm font-bold transition-all rounded-t-lg ${
              activeTab === "pricing"
                ? "bg-gradient-accent text-slate-900 shadow-glow-gold"
                : "text-slate-600 hover:text-amber-600 hover:bg-amber-50"
            }`}
          >
            💰 Pricing
          </button>
        </div>

        <button
          onClick={() => {
            setIsCreatingJob(true);
            setActiveTab("jobs-manager");
          }}
          className="btn-primary text-xs shadow-glow-blue flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={16} /> New Job Post
        </button>
      </div>

      {/* Main container according to active tab */}
      {activeTab === "candidates" ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Candidates selector sidebar */}
          <div className="lg:col-span-2 card-enhanced space-y-4 h-[630px] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="font-bold text-slate-800 text-xs uppercase font-mono">Applicants Pool</h3>
                <span className="badge-info text-xs">{filteredCandidates.length} Records</span>
              </div>

              {/* Filtering block */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={queryName}
                    onChange={(e) => setQueryName(e.target.value)}
                    placeholder="Search candidate name or email..."
                    className="w-full text-xs border border-slate-200 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-55"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectedJobIdFilter}
                    onChange={(e) => setSelectedJobIdFilter(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg py-1.5 px-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer font-medium"
                  >
                    <option value="all">All Vacancies</option>
                    {jobs.map(j => (
                      <option key={j.id} value={j.id}>{j.title}</option>
                    ))}
                  </select>

                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg py-1.5 px-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer font-medium"
                  >
                    <option value="all">All Stages</option>
                    <option value="Applied">Applied</option>
                    <option value="Reviewing">Reviewing</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* Bulk Actions & Side-by-Side Comparison Area */}
                {selectedCandidatesToCompare.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 mt-1 shadow-sm">
                    <div className="flex justify-between items-center pb-1.5 border-b border-slate-200">
                      <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider block">
                        ⚙️ Selected ({selectedCandidatesToCompare.length})
                      </span>
                      <button
                        onClick={() => setSelectedCandidatesToCompare([])}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold font-mono"
                      >
                        [Clear All]
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-1 pt-1">
                      <button
                        onClick={() => handleBulkChange("Reviewing")}
                        className="text-[9px] bg-white hover:bg-slate-100 text-amber-700 hover:text-amber-800 border border-amber-200 py-1.5 rounded font-bold transition"
                      >
                        Bulk Review
                      </button>
                      <button
                        onClick={() => handleBulkChange("Shortlisted")}
                        className="text-[9px] bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded font-bold transition"
                      >
                        Bulk Shortlist
                      </button>
                      <button
                        onClick={() => handleBulkChange("Rejected")}
                        className="text-[9px] bg-white hover:bg-red-50 text-red-600 border border-red-200 py-1.5 rounded font-bold transition"
                      >
                        Bulk Reject
                      </button>
                    </div>
                    {selectedCandidatesToCompare.length >= 2 && (
                      <button
                        onClick={() => setIsComparingViewOpen(true)}
                        className="w-full text-[10px] bg-amber-500 hover:bg-amber-600 text-white font-bold py-1.5 rounded flex items-center justify-center gap-1 transition"
                      >
                        ⚖️ Compare Candidates Side-by-Side
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* list of candidate summary cards */}
              <div className="space-y-2 overflow-y-auto max-h-[400px] pr-1">
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((cand) => (
                    <button
                      key={cand.id}
                      onClick={() => {
                        setSelectedCandidate(cand);
                        setHumanRemarks("");
                      }}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all flex justify-between items-center ${
                        selectedCandidate?.id === cand.id
                          ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                          : "border-slate-100 bg-white hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCandidatesToCompare((prev) => {
                              if (prev.includes(cand.id)) {
                                return prev.filter((id) => id !== cand.id);
                              } else {
                                if (prev.length >= 3) {
                                  alert("You can select up to 3 candidates for comparison.");
                                  return prev;
                                }
                                return [...prev, cand.id];
                              }
                            });
                          }}
                          className="p-1 cursor-pointer text-slate-400 hover:text-indigo-600"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCandidatesToCompare.includes(cand.id)}
                            readOnly
                            className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-0 focus:outline-none cursor-pointer"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-slate-800 text-xs">
                              {cand.firstName} {cand.lastName}
                            </h4>
                            {cand.sourceType === "CyberCafePortal" && (
                              <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[8px] px-1 rounded font-mono font-bold">
                                Cafe Match
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {jobs.find((j) => j.id === cand.jobId)?.title || "Unknown role"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right space-y-0.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          cand.status === "Shortlisted" ? "bg-emerald-100 text-emerald-800" :
                          cand.status === "Reviewing" ? "bg-amber-100 text-amber-800" :
                          cand.status === "Rejected" ? "bg-slate-150 text-slate-600" : "bg-indigo-50 text-indigo-800"
                        }`}>
                          {cand.status}
                        </span>
                        {cand.aiScore !== null && (
                          <p className="text-[10px] font-mono font-bold text-slate-500">
                            Fit: <span className="font-bold text-indigo-700">{cand.aiScore}%</span>
                          </p>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    No candidates found matching filter criteria.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-[11px] text-slate-500 leading-normal flex gap-1.5">
              <Info size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
              <span>
                To satisfy <strong>DPA Kenya Section 35</strong>, scoring only helps match candidates with goals. HR agents make all status changes manually.
              </span>
            </div>
          </div>

          {/* AI Assessment analysis panel */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[630px] flex flex-col justify-between">
            {selectedCandidate ? (
              <div className="space-y-6">
                {/* Header info */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-indigo-500 uppercase tracking-widest font-bold">Applicant Dossier</span>
                    <h3 className="text-lg font-bold text-slate-900">
                      {selectedCandidate.firstName} {selectedCandidate.lastName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {selectedCandidate.email} • Mobile: {selectedCandidate.phoneNumber}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">AI Match Score</span>
                    {selectedCandidate.aiScore !== null ? (
                      <div className="inline-flex items-center gap-1.5 bg-indigo-50 rounded-full px-3 py-1 font-mono text-sm font-bold text-indigo-700 border border-indigo-100">
                        <Sparkles size={14} className="text-amber-500 animate-pulse" /> {selectedCandidate.aiScore}% Match
                      </div>
                    ) : (
                      <span className="text-xs italic text-slate-400">Processing...</span>
                    )}
                  </div>
                </div>

                {/* AI brain summary boxes */}
                {selectedCandidate.aiAnalysis ? (
                  <div className="space-y-4">
                    {/* matched skills tags */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Core Strengths matched</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCandidate.aiAnalysis.skillsMatched?.map((skill) => (
                          <span key={skill} className="bg-indigo-50 text-indigo-700 border border-indigo-100 rounded px-2.5 py-0.5 text-[10px] font-bold">
                            {skill}
                          </span>
                        ))}
                        {selectedCandidate.aiAnalysis.skillsMatched?.length === 0 && (
                          <span className="text-slate-400 text-xs italic">Incomplete skill alignment detected</span>
                        )}
                      </div>
                    </div>

                    {/* rating summary */}
                    <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 text-xs text-slate-700">
                      <p className="font-bold font-mono text-[9px] uppercase tracking-wider text-slate-400 mb-1 font-bold">Acreage Experience Alignment</p>
                      <p className="text-slate-700 font-medium">{selectedCandidate.aiAnalysis.experienceRating}</p>
                    </div>

                    {/* two columns: strengths / gaps */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* strengths */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest font-mono flex items-center gap-1">
                          🟢 Identified Strengths
                        </p>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600 text-xs leading-relaxed">
                          {selectedCandidate.aiAnalysis.strengths?.map((st) => (
                            <li key={st}>{st}</li>
                          ))}
                        </ul>
                      </div>

                      {/* gaps */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest font-mono flex items-center gap-1">
                          🟠 Technical Gaps or limits
                        </p>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600 text-xs leading-relaxed">
                          {selectedCandidate.aiAnalysis.gaps?.map((gp) => (
                            <li key={gp}>{gp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* recommendation paragraph */}
                    <div className="space-y-1 px-4 py-3 bg-indigo-950 text-white rounded-lg text-xs border border-indigo-900 shadow-sm">
                      <p className="font-mono text-[9px] uppercase tracking-wider text-amber-300 font-bold">Recruiter Cognitive Summary</p>
                      <p className="leading-relaxed text-indigo-100">{selectedCandidate.aiAnalysis.recommendations}</p>
                    </div>

                    {/* ⚡ Anti-CV Fraud Technical Blitz Session Breakdown */}
                    {selectedCandidate.blitzScore !== undefined && selectedCandidate.blitzScore !== null && (
                      <div className="bg-slate-900 text-white border border-slate-800 rounded-xl p-4 space-y-3.5 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                            <span className="p-1 w-5 h-5 bg-indigo-500/10 text-indigo-400 rounded flex items-center justify-center font-bold">⚡</span>
                            Anti-CV Fraud Blitz Outcome
                          </p>
                          <div className="bg-indigo-650 text-white font-bold font-mono px-2 py-0.5 rounded text-[11px]">
                            Verified Score: {selectedCandidate.blitzScore}% Match
                          </div>
                        </div>

                        {selectedCandidate.blitzFeedback && (
                          <div className="text-[11px] text-slate-300 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                            <strong>Assessor Critique:</strong> {selectedCandidate.blitzFeedback}
                          </div>
                        )}

                        {selectedCandidate.blitzTranscript && selectedCandidate.blitzTranscript.length > 0 && (
                          <div className="space-y-3 pt-1">
                            <p className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-wider">Evaluation Transcript</p>
                            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 flex flex-col gap-2">
                              {selectedCandidate.blitzTranscript.map((t: any, idx: number) => (
                                <div key={idx} className="bg-slate-950/40 p-2.5 rounded border border-slate-800/60 text-[10.5px] space-y-1">
                                  <p className="text-indigo-300 font-medium">Q: {t.question}</p>
                                  <p className="text-slate-400">Ans: <span className="text-slate-200 italic">"{t.answer}"</span></p>
                                  <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 pt-1">
                                    <span className="text-emerald-550 bg-emerald-500/10 px-1.5 py-0.2 rounded font-semibold">{t.score}% Accuracy</span>
                                    <span>•</span>
                                    <span>Critique: {t.critique}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Submitted role-specific screening questions answers logs */}
                    {selectedCandidate.screeningAnswers && selectedCandidate.screeningAnswers.length > 0 && (
                      <div className="bg-amber-50/45 border border-amber-200 rounded-xl p-4 space-y-3 shadow-xs">
                        <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest font-mono flex items-center gap-1.5">
                          📋 Submitted Screening Answers
                        </p>
                        <div className="space-y-3 pt-0.5">
                          {selectedCandidate.screeningAnswers.map((item, idx) => (
                            <div key={idx} className="space-y-1">
                              <p className="text-[11px] font-bold text-slate-700">Q: {item.question}</p>
                              <p className="text-[11px] text-slate-650 bg-white border border-slate-200 rounded-lg px-3 py-2 leading-relaxed italic">
                                "{item.answer || "No response provided"}"
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* actual resume content source toggle */}
                    <div className="border border-slate-200 rounded-lg p-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">Actual Submitted File Extract</p>
                      <p className="text-[10px] text-slate-500 max-h-[70px] overflow-y-auto font-mono bg-slate-50 p-2 rounded border border-slate-150 whitespace-pre-wrap">
                        {selectedCandidate.resumeText}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500">
                    No assisted intelligence analysis exists for this record.
                  </div>
                )}

                {/* Human Status Control Actions bottom */}
                <div className="border-t border-slate-200 pt-4 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Human Review Remarks / Regulatory Notes (KDPA Compliant File Log):
                    </label>
                    <input
                      type="text"
                      value={humanRemarks}
                      onChange={(e) => setHumanRemarks(e.target.value)}
                      placeholder="Add manually verified details for the audit log..."
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 mr-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 justify-end font-sans">
                    <button
                      onClick={() => handleStatusChange("Reviewing")}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg px-4 py-2 transition"
                    >
                      Assign Reviewing
                    </button>

                    <button
                      onClick={() => handleStatusChange("Rejected")}
                      className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-lg px-4 py-2 transition"
                    >
                      Archive (Reject)
                    </button>

                    <button
                      onClick={() => handleStatusChange("Shortlisted")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-indigo-700 font-bold rounded-lg px-5 py-2 transition shadow-sm flex items-center gap-1"
                    >
                      ✔️ Shortlist Candidate
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
                Choose an applicant on the left sidebar to initialize live recruitment analysis panels.
              </div>
            )}
          </div>
        </div>
      ) : activeTab === "email-dispatches" ? (
        /* Dispatched notification email alerts log */
        <div className="space-y-4 font-sans" id="email-dispatches-log-panel">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
            <h3 className="text-sm font-bold text-slate-800 font-mono uppercase tracking-wider flex items-center gap-1.5">
              📧 Recruiter Email Alerts Dispatch Log
            </h3>
            <p className="text-xs text-slate-500">
              Under Kenya's DPA regulations and organizational security rules, RecruitIQ automatically logs and transmits high-priority notifications to recruiting stakeholders when candidates match at least 80% of criteria objectives. No automated reject filters are applied.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Alerts Feed Column */}
            <div className="md:col-span-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3 max-h-[500px] overflow-y-auto">
              <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase border-b border-slate-100 pb-1.5">
                Sent SMTP Mail Queue
              </span>
              
              {isLoadingAlerts ? (
                <div className="text-xs text-slate-400 py-6 text-center italic">Loading dispatched SMTP queues...</div>
              ) : recruiterAlerts.length > 0 ? (
                <div className="space-y-2">
                  {recruiterAlerts.map((alertItem, index) => {
                    const uniqueId = alertItem.id || index.toString();
                    const isSelected = selectedAlertId === uniqueId || (selectedAlertId === "" && index === 0);
                    return (
                      <button
                        key={uniqueId}
                        onClick={() => {
                          setSelectedAlertId(uniqueId);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex justify-between items-center ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/50 shadow-sm font-semibold"
                            : "border-slate-100 bg-white hover:border-slate-200"
                        }`}
                      >
                        <div className="space-y-0.5 truncate pr-2">
                          <h4 className="font-bold text-slate-800 truncate text-[11px] max-w-[125px]">
                            {alertItem.candidateName}
                          </h4>
                          <p className="text-[10px] text-slate-400 truncate max-w-[125px]">
                            {alertItem.jobTitle}
                          </p>
                        </div>
                        <span className="bg-indigo-100 text-indigo-800 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono shrink-0">
                          {alertItem.score}% Match
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-slate-400 py-12 text-center">
                  No high-scoring matches have triggered SMTP notifications yet (Score of 80% or greater required).
                </div>
              )}
            </div>

            {/* Render selected Email Preview Sandbox */}
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              {activeAlert ? (
                <div className="space-y-4">
                  {/* SMTP Envelope Header bar */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] space-y-1.5 font-mono text-slate-600">
                    <p><strong>SMTP RELAY:</strong> secure-smtp.recruitiq.co.ke</p>
                    <p><strong>SENDER:</strong> alerts@recruitiq.co.ke (RecruitIQ Automated Mailer)</p>
                    <p><strong>RECIPIENT (Recruiter Inbox):</strong> {activeAlert.recipientEmail}</p>
                    <p><strong>SUBJECT:</strong> <span className="text-indigo-700 font-bold">{activeAlert.subject}</span></p>
                    <p><strong>TIMESTAMP TIMESTAMP:</strong> {new Date(activeAlert.sentAt).toLocaleString()}</p>
                    <p className="flex items-center gap-1.5 text-emerald-600 font-bold uppercase mt-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      DELIVERED ACCORDING TO SYSTEM REGULATORY RULES (SMTP TLS Handshake Verified)
                    </p>
                  </div>

                  {/* Mail Body Layout Preview Panel */}
                  <div className="border border-slate-100 rounded-xl p-4 bg-slate-50 shadow-inner max-h-[350px] overflow-y-auto space-y-4">
                    <div className="bg-white border border-slate-150 rounded-xl p-5 space-y-3 shadow-xs">
                      <div className="flex justify-between items-center border-b border-indigo-50 pb-3">
                        <span className="text-xs font-black text-indigo-700 font-mono tracking-tight">RECRUITIQ ALERTS LOG</span>
                        <span className="text-[10px] text-slate-400 font-mono font-bold">SMTP OUTBOX ID: {activeAlert.id?.slice(0, 8)}</span>
                      </div>
                      <div className="whitespace-pre-line leading-relaxed text-slate-700 font-sans pt-2 text-[11px]">
                        {activeAlert.body}
                      </div>
                      <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-400 italic leading-normal">
                        Note: In compliance with Kenya ODPC Section 35, candidate profiling logs are registered in real-time under user guidance. All ultimate status changes are verified manually by system curators.
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-400 text-xs italic">
                  Select a logged SMTP notification log on the left list to view raw email transmissions.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : activeTab === "metrics" ? (
        <RecruitmentMetrics 
          candidates={candidates}
          jobs={jobs}
        />
      ) : activeTab === "pricing" ? (
        <PricingBenefits 
          tenant={tenant}
          jobs={jobs}
          candidates={candidates}
          onUpgradeClick={() => onNavigateToTab?.("billing")}
        />
      ) : (
        /* Jobs summary list layout */
        <div className="space-y-5">
          {/* Quick Career Link Banner */}
          <div className="bg-gradient-to-r from-indigo-55 via-indigo-50 to-blue-50 border border-indigo-150 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[9px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Public Seeker Career Link Specification</span>
              <h4 className="text-xs font-bold text-slate-800 mt-1">Live White-Labeled Seeker Intake Subdomain Page</h4>
              <p className="text-[11px] text-slate-500">Provide this secure subdomain link to job seekers at institutions or digital centers to initiate intake pipelines with zero manual auto-filters.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] text-indigo-600 font-mono italic bg-white border border-indigo-100 rounded px-2.5 py-1.5 font-semibold">
                http://recruitiq.co.ke/{tenant.slug}/apply
              </span>
            </div>
          </div>

          {isCreatingJob && (
            <form onSubmit={handleSaveJob} className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Plus size={18} className="text-indigo-600" /> New Job Vacancy Specification
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreatingJob(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {/* Recruitment Role Copilot Presets */}
              <div className="bg-gradient-to-r from-indigo-50/50 to-amber-50/20 border border-indigo-100 rounded-xl p-4 space-y-3 shadow-3xs">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <span className="bg-indigo-600 text-white rounded-full p-0.5"><Sparkles size={11} /></span>
                  <span>Recruitment Role Copilot Presets (Auto-fills descriptions, objectives, and checklists):</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyRolePreset("software_engineer")}
                    className="bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-700 text-[10px] sm:text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                  >
                    💻 Frontend Engineer Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyRolePreset("hr_compliance")}
                    className="bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-700 text-[10px] sm:text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                  >
                    🛡️ HR & KDPA Compliance Specialist
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyRolePreset("backend_developer")}
                    className="bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-700 text-[10px] sm:text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                  >
                    ⚙️ Backend Stack Developer
                  </button>
                </div>
              </div>

              {/* Grid definitions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Job Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Lead Systems Architect"
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Department</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    placeholder="Engineering / Sales / HR"
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Location desk</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Nairobi, Westlands"
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Job summary description and objectives suggestion */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">General Job Description</label>
                  <button
                    type="button"
                    onClick={handleSuggestObjectives}
                    disabled={isSuggesting}
                    className="text-xs font-mono font-bold bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    💡 {isSuggesting ? "Analyzing..." : "Autofill Objectives & Suggested Questions"}
                  </button>
                </div>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={4}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Insert the duties and parameters. Click 'Autofill Objectives & Suggested Questions' to let assistance populate tags, educational requirements and desired years of experience instantly..."
                  required
                ></textarea>
              </div>

              {/* Interactive Objectives Pre-checks (Multi-option selection) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  📋 Interactive Objectives Specification Checklist (Multi-Option Selection)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Column 1: Degree / Education required */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-600 block">🎓 Preferred Academic Background:</span>
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {[
                        "Diploma in IT / Computer Science",
                        "BSc in Computer Science / Software Engineering",
                        "Bachelor of Business Information Technology (BBIT)",
                        "BSc in Telecommunication & Electrical Eng",
                        "Bachelor of Commerce (Human Resources)"
                      ].map((deg) => {
                        const isChecked = selectedDegrees.includes(deg);
                        return (
                          <label key={deg} className={`flex items-start gap-2 p-1.5 rounded-lg border text-[11px] cursor-pointer transition ${isChecked ? 'bg-indigo-50/85 border-indigo-200 text-indigo-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedDegrees(selectedDegrees.filter(d => d !== deg));
                                } else {
                                  setSelectedDegrees([...selectedDegrees, deg]);
                                }
                              }}
                              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 shrink-0"
                            />
                            <span>{deg}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 2: Tech Stacks and requirements */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-600 block">🚀 Experience & Technical Skills:</span>
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {[
                        "TypeScript, React.js & Tailwind CSS",
                        "Node.js, Express & REST API integrations",
                        "PostgreSQL & Relational SQL queries",
                        "Kenyan Data Protection Act (KDPA) Auditing Guidelines",
                        "Git distributed version control & team pull requests"
                      ].map((reqItem) => {
                        const isChecked = selectedRequirements.includes(reqItem);
                        return (
                          <label key={reqItem} className={`flex items-start gap-2 p-1.5 rounded-lg border text-[11px] cursor-pointer transition ${isChecked ? 'bg-indigo-50/85 border-indigo-200 text-indigo-950' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedRequirements(selectedRequirements.filter(r => r !== reqItem));
                                } else {
                                  setSelectedRequirements([...selectedRequirements, reqItem]);
                                }
                              }}
                              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 shrink-0"
                            />
                            <span>{reqItem}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 3: What to do (tasks) */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-600 block">⚙️ Core Activities (What to do):</span>
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {[
                        "Design and deploy compliant SaaS recruitment flows",
                        "Optimize database structures and secure server-side API proxy routes",
                        "Formulate clear employee policies and direct onboarding matrices",
                        "Conduct detailed manual criteria validation under KDPA Safeguards",
                        "Integrate Safaricom Daraja API for M-Pesa automated transaction clearing"
                      ].map((act) => {
                        const isChecked = selectedWhatToDo.includes(act);
                        return (
                          <label key={act} className={`flex items-start gap-2 p-1.5 rounded-lg border text-[11px] cursor-pointer transition ${isChecked ? 'bg-indigo-50/85 border-indigo-200 text-indigo-950' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedWhatToDo(selectedWhatToDo.filter(w => w !== act));
                                } else {
                                  setSelectedWhatToDo([...selectedWhatToDo, act]);
                                }
                              }}
                              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 shrink-0"
                            />
                            <span>{act}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* matching objective boxes */}
              <div className="bg-slate-55 border border-indigo-100 rounded-xl p-5 space-y-4">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block border-b border-indigo-50 pb-2">
                  Target Objectives Parser Filters
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 block">
                      Target Tech Stacks (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={mustHaveTags}
                      onChange={(e) => setMustHaveTags(e.target.value)}
                      placeholder="e.g. React, Docker, SQL, Rust"
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 block">Minimum Years Experience</label>
                    <input
                      type="number"
                      value={minExp}
                      onChange={(e) => setMinExp(Number(e.target.value))}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 block">Minimum Education Degree</label>
                    <input
                      type="text"
                      value={minEdu}
                      onChange={(e) => setMinEdu(e.target.value)}
                      placeholder="e.g. Bachelor's in Software Engineering"
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 font-sans">
                    <label className="text-[11px] font-bold text-slate-500 block">
                      Soft Skills & Other Parameters (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={customAttr}
                      onChange={(e) => setCustomAttr(e.target.value)}
                      placeholder="e.g. Hybrid workplace, Leadership, agile methodologies"
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white"
                    />
                  </div>
                  <div className="space-y-1.5 font-sans">
                    <label className="text-[11px] font-bold text-indigo-700 block">
                      📧 Recruiter Alert Match Threshold %
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={newMatchAlertThreshold}
                      onChange={(e) => setNewMatchAlertThreshold(Math.max(0, Math.min(100, Number(e.target.value))))}
                      placeholder="80"
                      className="w-full text-xs border border-indigo-200 rounded-lg px-3 py-2 bg-white font-mono font-bold focus:border-indigo-500 focus:outline-none"
                    />
                    <p className="text-[9px] text-slate-400 leading-normal">
                      When CV matching equals or exceeds this trigger, high-score email notifications are dispatched dynamically.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Screening Questions Panel */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-5 space-y-3">
                <span className="text-[10px] uppercase font-mono font-bold text-amber-800 block border-b border-amber-100 pb-2">
                  📋 Role-Specific Screening Questions (Suggested by Gemini AI or editable)
                </span>
                <p className="text-[11px] text-slate-500">
                  These questions are dynamically served to candidate applicants before form consent submission. Customize them block-by-block.
                </p>
                <div className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">Question 1</label>
                    <input
                      type="text"
                      value={screeningQ1}
                      onChange={(e) => setScreeningQ1(e.target.value)}
                      placeholder="e.g. Do you have hands-on experience building custom React hooks?"
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">Question 2</label>
                    <input
                      type="text"
                      value={screeningQ2}
                      onChange={(e) => setScreeningQ2(e.target.value)}
                      placeholder="e.g. How do you implement robust exception handlers?"
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">Question 3</label>
                    <input
                      type="text"
                      value={screeningQ3}
                      onChange={(e) => setScreeningQ3(e.target.value)}
                      placeholder="e.g. Are you fully available for hybrid operations in Nairobi?"
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingJob(false)}
                  className="bg-slate-50 border border-slate-200 text-slate-600 rounded-lg px-4 py-2 hover:bg-slate-100 transition font-bold"
                >
                  Discard Form
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-5 py-2 font-bold transition shadow-sm"
                >
                  Publish Active Slot
                </button>
              </div>
            </form>
          )}

          {/* Active Jobs listing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white border border-slate-220 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-500 uppercase tracking-widest font-bold">{job.department}</span>
                    <h4 className="font-bold text-slate-800 text-base mt-0.5">{job.title}</h4>
                    <span className="text-xs text-slate-400 font-medium">{job.location}</span>
                  </div>

                  <span className="bg-emerald-50 text-emerald-800 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100 uppercase">
                    {job.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {job.description}
                </p>

                {/* Screening Questions list annotations */}
                {job.screeningQuestions && job.screeningQuestions.length > 0 && (
                  <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-3 space-y-1.5 text-[11px] shadow-xs">
                    <span className="font-bold text-amber-800 text-[9px] font-mono block uppercase">Active Screening Questions:</span>
                    <ul className="list-decimal pl-4 space-y-1 text-slate-600">
                      {job.screeningQuestions.map((q, qIndex) => (
                        <li key={qIndex} className="font-medium">{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-1.5">
                  {job.evaluationObjectives.must_have.map((tag) => (
                    <span key={tag} className="bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Side-by-side Candidate Comparative Review Modal Workspace */}
      {isComparingViewOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto font-sans">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-6xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between shadow-md shrink-0">
              <div className="space-y-0.5">
                <span className="text-[10px] bg-indigo-500 text-white font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  RecruitIQ Comparative Workspace
                </span>
                <h3 className="text-sm font-bold tracking-tight">Side-by-Side Candidates Evaluation Matrix</h3>
              </div>
              <button
                onClick={() => setIsComparingViewOpen(false)}
                className="text-slate-300 hover:text-white font-mono text-xs font-bold bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition"
              >
                Close Matrix
              </button>
            </div>

            {/* Modal Matrix Grid Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              <p className="text-xs text-slate-500 leading-normal">
                Compare primary parameters, strengths, gaps and dynamic screening answers across candidates. Approved manually by HR curators to verify KDPA Section 35 compliance records.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedCandidatesToCompare.map((candId) => {
                  const comparee = candidates.find((c) => c.id === candId);
                  if (!comparee) return null;
                  const associatedJob = jobs.find((j) => j.id === comparee.jobId);
                  return (
                    <div
                      key={comparee.id}
                      className="border border-slate-200 bg-slate-50/50 rounded-2xl p-4 space-y-4 shadow-sm flex flex-col justify-between"
                    >
                      {/* Name Card */}
                      <div className="border-b border-slate-200 pb-3 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] bg-slate-105 text-slate-500 px-2 py-0.5 rounded font-mono font-bold">
                              ID: {comparee.id.slice(0, 8)}
                            </span>
                            <h4 className="font-bold text-slate-800 text-sm mt-1">
                              {comparee.firstName} {comparee.lastName}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-medium">{comparee.email}</p>
                          </div>
                          
                          {comparee.aiScore !== null && (
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 font-mono block">Fit Score</span>
                              <span className="text-base font-extrabold text-indigo-700 font-mono mt-0.5 inline-block">
                                {comparee.aiScore}%
                              </span>
                            </div>
                          )}
                        </div>

                        <span className="bg-indigo-50 text-indigo-800 border border-indigo-100 font-mono text-[9px] font-bold px-2 py-0.5 rounded mt-2 block w-fit truncate">
                          Applied: {associatedJob?.title || "Unknown role"}
                        </span>
                      </div>

                      {/* Technical Matching Metrics */}
                      <div className="space-y-2.5">
                        <h5 className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          Objectives Matrix
                        </h5>

                        <div className="space-y-1 text-xs text-slate-600">
                          <p>
                            <strong>Status:</strong>{" "}
                            <span className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[10px]">
                              {comparee.status}
                            </span>
                          </p>
                          <p>
                            <strong>Experience Rating:</strong>{" "}
                            <span className="text-slate-505 font-medium">
                              {comparee.aiAnalysis?.experienceRating || "Unspecified"}
                            </span>
                          </p>
                        </div>

                        {/* tech matches */}
                        {comparee.aiAnalysis?.skillsMatched && comparee.aiAnalysis.skillsMatched.length > 0 && (
                          <div className="space-y-1 pt-1">
                            <span className="text-[10px] text-slate-400 font-medium block">Matched Core Skills:</span>
                            <div className="flex flex-wrap gap-1">
                              {comparee.aiAnalysis.skillsMatched.map((tag) => (
                                <span
                                  key={tag}
                                  className="bg-white text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-mono text-[9px]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Strengths and Gaps Compare block */}
                      {comparee.aiAnalysis && (
                        <div className="space-y-3 pt-3 border-t border-slate-200">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase font-mono tracking-tight block">
                              🟢 Identified Strengths
                            </span>
                            <ul className="list-disc pl-4 text-[11px] text-slate-650 space-y-0.5">
                              {comparee.aiAnalysis.strengths?.slice(0, 3).map((item, idx) => (
                                <li key={idx} className="line-clamp-2">{item}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-amber-600 uppercase font-mono tracking-tight block">
                              🟠 Technical Gaps
                            </span>
                            <ul className="list-disc pl-4 text-[11px] text-slate-655 space-y-0.5">
                              {comparee.aiAnalysis.gaps?.slice(0, 3).map((item, idx) => (
                                <li key={idx} className="line-clamp-2">{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Screening Answers side-by-side block */}
                      <div className="space-y-2 border-t border-slate-200 pt-3 flex-1">
                        <h5 className="font-mono text-[9px] font-bold text-amber-800 uppercase tracking-wider">
                          Screening Answers
                        </h5>
                        
                        {comparee.screeningAnswers && comparee.screeningAnswers.length > 0 ? (
                          <div className="space-y-2">
                            {comparee.screeningAnswers.map((item, idx) => (
                              <div key={idx} className="space-y-0.5">
                                <span className="text-[10px] text-slate-400 font-medium block truncate">
                                  Q{idx + 1}: {item.question}
                                </span>
                                <p className="text-[10px] text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded italic leading-relaxed">
                                  "{item.answer || "N/A"}"
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">No screening question answers recorded</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Matrix Footer */}
            <div className="bg-slate-50 border-t border-slate-150 px-6 py-4 rounded-b-2xl flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400">
                Comparisons run client-side under strict memory-isolated variables. Zero telemetry data is transmitted.
              </span>
              <button
                onClick={() => setIsComparingViewOpen(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg px-5 py-2 transition"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
