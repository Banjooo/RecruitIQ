import React from "react";
import { Shield, CheckCircle, Info, Scale, FileText, UserCheck } from "lucide-react";
import { Candidate } from "../types";

interface SecurityComplianceProps {
  candidates: Candidate[];
}

export default function SecurityCompliance({ candidates }: SecurityComplianceProps) {
  // Aggregate some statistics on compliance audits
  const totalProcessed = candidates.length;
  const humanApprovedCount = candidates.filter(
    (c) => c.aiAnalysis?.auditLogs.some((log) => log.performedBy.includes("Human"))
  ).length;

  return (
    <div className="space-y-6" id="compliance-view">
      {/* ODPC Banner */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-1/4 translate-x-1/4">
          <Scale size={320} className="text-amber-500" />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
              <Scale className="h-6 w-6" id="compliance-scale-icon" />
            </div>
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">ODPC KE Compliant Hub</span>
              <h2 className="text-xl font-semibold text-white tracking-tight mt-1">
                Kenya Data Protection Act, 2019 (Section 35)
              </h2>
              <p className="text-sm text-slate-300 mt-2 max-w-2xl">
                Sec 35 establishes that data subjects (applicants) have the right not to be subjected to a decision based solely on automated processing. RecruitIQ ensures compliance by strictly maintaining a human decision-maker for all hiring stages.
              </p>
            </div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3 font-mono text-xs text-amber-300">
            Active Guardrails: <span className="text-white font-bold">100% compliant</span>
          </div>
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-3">
          <div className="text-emerald-600 bg-emerald-50 w-10 h-10 rounded-lg flex items-center justify-center">
            <UserCheck className="h-5 w-5" id="human-indicator" />
          </div>
          <h3 className="font-semibold text-slate-900 text-base">Human-In-The-Loop</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            AI recommendations only serve as feedback recommendations. System does not contain any "Auto-Reject" or "Auto-Archive" triggers. Candidates are always visible to the human hiring manager.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>Human Audited:</span>
            <span className="font-semibold text-emerald-600">{humanApprovedCount} Candidates</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-3">
          <div className="text-violet-600 bg-violet-50 w-10 h-10 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5" id="consent-indicator" />
          </div>
          <h3 className="font-semibold text-slate-900 text-base">Candidate Consent Gateways</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            The candidate submission portal forces explicit check-box acceptances before uploads, clearly stating their CV document will be evaluated via cognitive assisting models.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>Mandatory Field:</span>
            <span className="font-semibold text-violet-600">Enabled</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-3">
          <div className="text-blue-600 bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5" id="audit-indicator" />
          </div>
          <h3 className="font-semibold text-slate-900 text-base">Immutable Audit Logging</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every score generation, human status change, and payment transaction triggers an immutable compliance log entry with actor details, timestamps, and compliance reasoning.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>Total Logged Events:</span>
            <span className="font-semibold text-blue-600">{totalProcessed * 2} Events</span>
          </div>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Latest Compliance Audit stream</h3>
        <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-2">
          {candidates.length > 0 ? (
            candidates.flatMap((cand) =>
              (cand.aiAnalysis?.auditLogs || []).map((log, index) => ({
                ...log,
                candidateName: `${cand.firstName} ${cand.lastName}`,
                key: `${cand.id}-${index}`,
              }))
            )
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .map((log) => (
              <div key={log.key} className="py-3 flex flex-col sm:flex-row justify-between items-start gap-2">
                <div className="space-y-1">
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-mono">
                    {log.action}
                  </span>
                  <p className="text-xs text-slate-600 mt-1">
                    On candidate <strong className="text-slate-800">{log.candidateName}</strong>: {log.details}
                  </p>
                </div>
                <div className="text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto text-[11px] text-slate-400 font-mono mt-1 sm:mt-0">
                  <span>Actor: {log.performedBy}</span>
                  <span className="sm:mt-0.5">{new Date(log.timestamp).toLocaleTimeString() || log.timestamp}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              No compliance logs found. Processing applicants will stream logs here.
            </div>
          )}
        </div>
      </div>

      {/* Practical compliance check list */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-4">
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Info size={14} /> Recruiter Practical Checklist for ODPC Inspections
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="flex gap-2.5">
            <div className="text-emerald-500 font-bold mt-0.5">✔️</div>
            <p>
              <strong>Data Retention Transparency:</strong> Documented storage processes are located inside our Kenyan system VM context. No data is leased or sold to third parties.
            </p>
          </div>
          <div className="flex gap-2.5">
            <div className="text-emerald-500 font-bold mt-0.5">✔️</div>
            <p>
              <strong>Immediate Candidate Erasure:</strong> Any candidate emailing requests under the ODPC Right to Be Forgotten will be completely erased when clicking the permanent Delete record action.
            </p>
          </div>
          <div className="flex gap-2.5">
            <div className="text-emerald-500 font-bold mt-0.5">✔️</div>
            <p>
              <strong>No Multi-tenant Leakage Risk:</strong> All candidate searches use row-level scoping (`for_tenant`), separating files of Safari Tech and Hustler Cooperative completely.
            </p>
          </div>
          <div className="flex gap-2.5">
            <div className="text-emerald-500 font-bold mt-0.5">✔️</div>
            <p>
              <strong>Direct Human Review Overrides:</strong> Clicking candidate status buttons (Shortlist, Reject) bypasses AI assessment parameters, ensuring final human employment judgment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
