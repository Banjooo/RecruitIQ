import React from "react";
import { TenantConfig, Job, Candidate } from "../types";
import { 
  Check, X, Shield, Zap, Sparkles, Scale, Info, 
  ChevronRight, ArrowUpRight, Award, CircleDot, Database
} from "lucide-react";

interface PricingBenefitsProps {
  tenant: TenantConfig;
  jobs: Job[];
  candidates: Candidate[];
  onUpgradeClick?: () => void;
}

export default function PricingBenefits({ 
  tenant, 
  jobs, 
  candidates, 
  onUpgradeClick 
}: PricingBenefitsProps) {
  
  // Calculate usage stats per job matching active filters
  const tenantJobs = jobs.filter(j => j.organizationId === tenant.id);
  
  // Determine limits based on plan
  const getPlanLimit = (plan: string) => {
    switch (plan) {
      case "pay_as_you_go": return 25;
      case "standard": return 70;
      case "premium": return Infinity;
      default: return 25;
    }
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case "pay_as_you_go": return "Pay-As-You-Go Monthly";
      case "standard": return "Corporate Standard (Quarterly)";
      case "premium": return "Enterprise Premium (Half-Year)";
      default: return plan;
    }
  };

  const currentLimit = getPlanLimit(tenant.billingPlan);
  const currentPlanLabel = getPlanLabel(tenant.billingPlan);

  // Core features matrix for our comparison table
  const comparisonFeatures = [
    {
      name: "Job Candidate Evaluation Cap",
      description: "Processing tolerance limit per individual vacant post",
      basic: "25 Applications",
      standard: "70 Applications",
      premium: "Unlimited Processing",
      highlight: true
    },
    {
      name: "Gemini AI Cognitive Verification",
      description: "Assisted curriculum review & compliance grading",
      basic: "Standard (3.5 Flash)",
      standard: "Priority Support (3.5 Flash)",
      premium: "Ultra Low-Latency Custom Rules",
      highlight: false
    },
    {
      name: "Kenyan Data Protection Compliance",
      description: "Adherence logs aligning with Section 35 & 40 ODPC guidelines",
      basic: "Standard Logs",
      standard: "Verified Audit Registry",
      premium: "Zero Retention Option + Dual-Signatory",
      highlight: false
    },
    {
      name: "Team Recruiter Admin Seats",
      description: "Collaborative recruiter identities with security audits",
      basic: "1 Active Seat",
      standard: "Up to 5 HR Admins",
      premium: "Unlimited Team Seats",
      highlight: false
    },
    {
      name: "Applicant Feedback Correspondence",
      description: "Automated custom email update dispatches under KDPA rules",
      basic: "Manual Only",
      standard: "Automated Templates",
      premium: "Instant Bulk Automated Dispatches",
      highlight: false
    },
    {
      name: "Dedicated Account Success Help",
      description: "Recruitment deployment optimization support",
      basic: "Web Tickets Only",
      standard: "Priority Callback Support",
      premium: "Dedicated Account Manager (Morggy Dev)",
      highlight: false
    }
  ];

  return (
    <div className="space-y-6" id="pricing-and-benefits-matrix">
      {/* Visual Header Block */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/20 text-[10px] font-mono font-bold uppercase tracking-wider animate-pulse">
            <Sparkles size={11} className="text-indigo-400" /> Subscription Plan Advisory Suite
          </div>
          <h2 className="text-2xl font-black tracking-tight font-sans">
            Morggy Technologies Subscription & Corporate Benefits
          </h2>
          <p className="text-xs text-indigo-200 leading-normal font-sans">
            View detailed licensing thresholds, compute vacancy evaluation consumption quotas, and optimize recruitment compliance metrics securely aligned with the Office of the Data Protection Commissioner (ODPC) of Kenya.
          </p>
        </div>
      </div>

      {/* Subscription Utilization Monitor Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CURRENT CORPORATE ACCOUNT SUBSCRIPTION</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 block shrink-0"></span>
              <strong className="text-slate-900 text-base font-black tracking-tight">{tenant.name}</strong>
              <span className="text-[9px] font-mono bg-indigo-50 border border-indigo-150 text-indigo-700 px-2.5 py-0.5 rounded-full uppercase font-black tracking-wider">
                {tenant.billingPlan.replace(/_/g, " ")}
              </span>
            </div>
          </div>
          {onUpgradeClick && (
            <button 
              onClick={onUpgradeClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg px-4.5 py-2.5 transition flex items-center gap-1.5 self-start cursor-pointer shadow-3xs"
            >
              Adjust Plan & Settle <ArrowUpRight size={13} />
            </button>
          )}
        </div>

        {/* Current Plan Metadata Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Active Evaluation Cap</span>
            <strong className="text-slate-800 text-lg font-extrabold block">
              {currentLimit === Infinity ? "Unlimited Processing" : `${currentLimit} Submissions / Job`}
            </strong>
            <p className="text-[10px] text-slate-400">Strict legal safety threshold per vacant listing.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Active Registered Vacancies</span>
            <strong className="text-slate-800 text-lg font-extrabold block">
              {tenantJobs.length} Positions Published
            </strong>
            <p className="text-[10px] text-slate-400">Securely routing compliant candidate applications.</p>
          </div>

          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 space-y-1">
            <span className="text-[10px] text-indigo-700 font-bold uppercase">Primary Billing Shortcode</span>
            <strong className="text-indigo-900 text-lg font-mono font-black tracking-wider block">LIPA TILL 4567952</strong>
            <p className="text-[10px] text-indigo-600 font-sans">Direct corporate Safaricom M-Pesa clearance.</p>
          </div>
        </div>

        {/* Job limits Usage breakdown */}
        <div className="space-y-2.5 pt-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Database size={13} className="text-indigo-600" /> active post processing utilization metrics
          </h4>
          {tenantJobs.length === 0 ? (
            <div className="bg-slate-50 rounded-lg p-3 text-center text-slate-500 text-xs">
              No active job vacancies created. Go to "Active Vacant Slots" to post empty positions.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {tenantJobs.map(job => {
                const appliedCount = candidates.filter(c => c.jobId === job.id).length;
                const limitVal = currentLimit;
                const percentage = Math.min(100, (appliedCount / limitVal) * 100);
                const isNearingLimit = limitVal !== Infinity && (limitVal - appliedCount) <= 5;

                return (
                  <div key={job.id} className="bg-slate-50/50 border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between space-y-3">
                    <div className="space-y-0.5">
                      <h5 className="font-bold text-slate-850 text-xs tracking-tight line-clamp-1">{job.title}</h5>
                      <span className="text-[10px] text-slate-400 font-medium font-sans block">{job.department}</span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-500">Submissions Checked:</span>
                        <strong className={isNearingLimit ? "text-orange-650 font-bold font-mono" : "text-slate-700 font-bold font-mono"}>
                          {appliedCount} / {limitVal === Infinity ? "∞" : limitVal}
                        </strong>
                      </div>
                      
                      {limitVal !== Infinity ? (
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-505 ${
                              isNearingLimit ? "bg-orange-500" : "bg-indigo-600"
                            }`} 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      ) : (
                        <div className="h-1.5 bg-indigo-50 border border-dashed border-indigo-200 rounded-full animate-pulse" />
                      )}
                      
                      {isNearingLimit && (
                        <p className="text-[9px] text-orange-600 font-bold font-sans">
                          ⚠️ Cap exhaustion warning. Advise HR upgrade!
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Plans comparison cards specifically highlighting the 25, 70, Unlimited limits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tier 1 */}
        <div className={`bg-white border rounded-2xl p-6 flex flex-col justify-between relative shadow-sm transition-all hover:shadow-md ${
          tenant.billingPlan === "pay_as_you_go" ? "ring-2 ring-indigo-600 border-indigo-200" : "border-slate-200"
        }`}>
          {tenant.billingPlan === "pay_as_you_go" && (
            <span className="absolute top-4 right-4 bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider font-mono">
              Your Active Plan
            </span>
          )}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Tier One</span>
              <h3 className="font-extrabold text-slate-930 text-base">Basic Seasonal Plan</h3>
              <p className="text-xl font-black text-slate-900 tracking-tight">KES 4,500 <span className="text-xs text-slate-400 font-normal">/ month</span></p>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">Perfect for startups managing occasional individual vacancy requirements in compliance.</p>
            </div>

            {/* Crucial stats callout */}
            <div className="p-3.5 bg-orange-50 border border-orange-100 rounded-xl space-y-1.5 text-center">
              <span className="text-[10px] text-orange-700 font-bold uppercase block tracking-wider">Candidate processing limit:</span>
              <strong className="text-orange-950 text-xl font-black block font-mono">25 APPLICATIONS / JOB</strong>
            </div>

            <ul className="space-y-2 text-xs pt-4 border-t border-slate-100">
              <li className="flex items-start gap-2 text-slate-600">
                <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>Standard curriculum evaluation engine</span>
              </li>
              <li className="flex items-start gap-2 text-slate-600">
                <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>Anti-CV fraud layout checks</span>
              </li>
              <li className="flex items-start gap-2 text-slate-600">
                <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>1 recruiter team login seat</span>
              </li>
              <li className="flex items-start gap-2 text-slate-600">
                <X size={14} className="text-slate-300 shrink-0 mt-0.5" />
                <span className="text-slate-400 line-through">Automated custom rejection alerts</span>
              </li>
              <li className="flex items-start gap-2 text-slate-600">
                <X size={14} className="text-slate-300 shrink-0 mt-0.5" />
                <span className="text-slate-400 line-through">Dual-Signatory Paybill reconciliation</span>
              </li>
            </ul>
          </div>
          {tenant.billingPlan !== "pay_as_you_go" && onUpgradeClick && (
            <button 
              onClick={onUpgradeClick}
              className="w-full mt-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition text-center cursor-pointer"
            >
              Downgrade to Standard Seasonal
            </button>
          )}
        </div>

        {/* Tier 2 */}
        <div className={`bg-slate-900 text-white border rounded-2xl p-6 flex flex-col justify-between relative shadow-md transition-all hover:shadow-lg ${
          tenant.billingPlan === "standard" ? "ring-2 ring-indigo-500 border-indigo-400" : "border-slate-800"
        }`}>
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            <span className="bg-amber-500 text-slate-900 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider font-mono">
              Most Popular
            </span>
            {tenant.billingPlan === "standard" && (
              <span className="bg-indigo-600 text-white border border-indigo-400/30 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider font-mono">
                Active
              </span>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono text-indigo-300">Tier Two</span>
              <h3 className="font-extrabold text-white text-base">Corporate Standard Pack</h3>
              <p className="text-xl font-black text-white tracking-tight">KES 12,000 <span className="text-xs text-slate-300 font-normal">/ 3 months</span></p>
              <p className="text-[11px] text-slate-300 leading-relaxed">Best for growing business entities with active multi-department vacancy pipelines.</p>
            </div>

            {/* Crucial stats callout */}
            <div className="p-3.5 bg-indigo-950 border border-indigo-800 rounded-xl space-y-1.5 text-center">
              <span className="text-[10px] text-indigo-300 font-bold uppercase block tracking-wider">Candidate processing limit:</span>
              <strong className="text-indigo-200 text-xl font-black block font-mono">70 APPLICATIONS / JOB</strong>
            </div>

            <ul className="space-y-2 text-xs pt-4 border-t border-slate-800">
              <li className="flex items-start gap-2 text-slate-300">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Priority Gemini AI parsing & grading</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Verified Data Protection Audit Trails</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Up to 5 HR dynamic login seats</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Automated tailored applicant feedback alerts</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <X size={14} className="text-slate-600 shrink-0 mt-0.5" />
                <span className="text-slate-500 line-through">Dual-Signatory system controls</span>
              </li>
            </ul>
          </div>
          {tenant.billingPlan !== "standard" && onUpgradeClick && (
            <button 
              onClick={onUpgradeClick}
              className="w-full mt-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition text-center cursor-pointer"
            >
              Select Corporate Standard
            </button>
          )}
        </div>

        {/* Tier 3 */}
        <div className={`bg-white border rounded-2xl p-6 flex flex-col justify-between relative shadow-sm transition-all hover:shadow-md ${
          tenant.billingPlan === "premium" ? "ring-2 ring-indigo-600 border-indigo-200" : "border-slate-200"
        }`}>
          {tenant.billingPlan === "premium" && (
            <span className="absolute top-4 right-4 bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider font-mono">
              Your Active Plan
            </span>
          )}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono text-amber-600">Tier Three</span>
              <h3 className="font-extrabold text-slate-930 text-base">Enterprise Premium Pack</h3>
              <p className="text-xl font-black text-slate-900 tracking-tight">KES 22,000 <span className="text-xs text-slate-400 font-normal">/ 6 months</span></p>
              <p className="text-[11px] text-slate-500 leading-relaxed">Unlimited processing for recruitment corporations needing fast automated results.</p>
            </div>

            {/* Crucial stats callout */}
            <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl space-y-1.5 text-center">
              <span className="text-[10px] text-emerald-700 font-bold uppercase block tracking-wider">Candidate processing limit:</span>
              <strong className="text-emerald-950 text-xl font-black block font-mono">UNLIMITED OPERATIONS</strong>
            </div>

            <ul className="space-y-2 text-xs pt-4 border-t border-slate-100 font-sans">
              <li className="flex items-start gap-2 text-slate-600">
                <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="font-semibold text-slate-800">Endless candidate submissions processing</span>
              </li>
              <li className="flex items-start gap-2 text-slate-600">
                <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>Custom cognitive parameters mapping</span>
              </li>
              <li className="flex items-start gap-2 text-slate-600">
                <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>Unlimited team seats with access controls</span>
              </li>
              <li className="flex items-start gap-2 text-slate-600">
                <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>Dual-Signatory Lipa Na M-Pesa billing routes</span>
              </li>
              <li className="flex items-start gap-2 text-slate-600">
                <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="font-semibold text-slate-800">SLA-guaranteed processing time (&lt; 10s)</span>
              </li>
            </ul>
          </div>
          {tenant.billingPlan !== "premium" && onUpgradeClick && (
            <button 
              onClick={onUpgradeClick}
              className="w-full mt-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition text-center cursor-pointer"
            >
              Upgrade to Enterprise Premium
            </button>
          )}
        </div>

      </div>

      {/* Structured Comparison Table - Feature parity matrix */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-150">
          <h4 className="text-sm font-bold text-slate-800 tracking-tight">Structured Benefit & Feature Parity Grid</h4>
          <p className="text-[11px] text-slate-500">Exhaustive matrix review mapping Morggy Technologies licenses.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left text-xs text-slate-700 font-sans">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                <th className="p-4 w-1/3">Corporate Feature Metric</th>
                <th className="p-4">Seasonal Basic</th>
                <th className="p-4">Corporate Standard</th>
                <th className="p-4">Enterprise Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonFeatures.map((feat, index) => (
                <tr key={index} className={feat.highlight ? "bg-indigo-50/20 font-medium" : "hover:bg-slate-50/30 transition-colors"}>
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{feat.name}</p>
                    <p className="text-[10px] text-slate-400 font-normal leading-normal">{feat.description}</p>
                  </td>
                  <td className="p-4 text-slate-600">{feat.basic}</td>
                  <td className="p-4 text-slate-700 font-medium">{feat.standard}</td>
                  <td className="p-4 text-indigo-900 font-black">{feat.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legal Compliance corner info section */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 font-sans">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-indigo-600 animate-pulse" />
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Kenya Data Protection Act safeguarding context</h4>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
          Morggy Technologies enforces strict structural principles. Under **Section 35 & 40** of the **Kenya Data Protection Act, 2019**, any entity utilizing automated systems must ensure human-in-the-loop audit logs. 
          Our standard and premium subscribers benefit from detailed audit panels, making sure automated matching scores act strictly as assistance logs rather than standalone automated rejection criteria. 
          Additionally, premium subscribers have access to a verified Section 40 erasure mechanism to destroy candidate records securely.
        </p>
      </div>

    </div>
  );
}
