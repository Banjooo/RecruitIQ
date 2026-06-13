import React, { useState } from "react";
import { Users, UserPlus, Shield, Trash2, Mail, Briefcase, CheckCircle2, UserCheck, BarChart3, Lock } from "lucide-react";
import { TenantConfig } from "../types";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  isActive: boolean;
  canEditRules: boolean;
  lastActive: string;
}

interface CorporateAdminsProps {
  tenant: TenantConfig;
}

export default function CorporateAdmins({ tenant }: CorporateAdminsProps) {
  // Local admin list initialized with three verified business admin accounts
  const [admins, setAdmins] = useState<AdminUser[]>([
    {
      id: "adm-1",
      name: "Timothy Banjo",
      email: "timothybanjo42@gmail.com",
      role: "Corporate CEO / System Owner",
      department: "Management",
      isActive: true,
      canEditRules: true,
      lastActive: "Active Now"
    },
    {
      id: "adm-2",
      name: "Grace Koech",
      email: "grace.koech@morggy.tech",
      role: "Engineering Panel Chair",
      department: "Technical Recruiting",
      isActive: true,
      canEditRules: true,
      lastActive: "12 mins ago"
    },
    {
      id: "adm-3",
      name: "David Kiprop",
      email: "david.kiprop@morggy.tech",
      role: "HR Compliance Director",
      department: "Human Resources",
      isActive: true,
      canEditRules: true,
      lastActive: "1 hr ago"
    }
  ]);

  // Form states
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Technical Evaluator");
  const [newDept, setNewDept] = useState("Engineering");
  const [newCanEdit, setNewCanEdit] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newAdmin: AdminUser = {
      id: "adm-" + Math.random().toString(36).substring(2, 7),
      name: newName,
      email: newEmail,
      role: newRole,
      department: newDept,
      isActive: true,
      canEditRules: newCanEdit,
      lastActive: "Just invited"
    };

    setAdmins((prev) => [...prev, newAdmin]);
    setNewName("");
    setNewEmail("");
    setSuccessMsg(`Invitation dispatched. Admin ${newName} provisioned successfully.`);
    setShowForm(false);

    setTimeout(() => {
      setSuccessMsg("");
    }, 4000);
  };

  const handleRemoveAdmin = (id: string) => {
    // Keep at least 1 main admin
    if (admins.length <= 1) return;
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6" id="corporate-team-dashboard">
      
      {/* Intro Banner: B2B Platform Clarification */}
      <div className="bg-indigo-950 text-white rounded-xl p-6 border border-indigo-900 shadow-md">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-1.5 bg-indigo-900/50 text-indigo-300 font-mono text-[10px] uppercase font-black px-2.5 py-1 rounded-full w-max tracking-wider">
            ⚙️ SaaS Corporate Utility Environment
          </div>
          <h2 className="text-xl font-bold tracking-tight">RecruitIQ Business Administration Console</h2>
          <p className="text-xs text-indigo-200 leading-relaxed">
            As a <strong className="text-white">B2B Software-as-a-Service system provider</strong>, RecruitIQ does not act as a recruitment agency. 
            We supply high-compatibility cognitive screening and evaluation utilities directly to internal corporate HR professionals, panel leaders, and executive staff.
          </p>
          <p className="text-xs text-indigo-350 italic">
            Configured for <strong className="text-indigo-250 font-bold">{tenant.name}</strong>. Add 3 or more internal business administrators down below to unlock decentralized candidate rating and prevent single-point rating bias.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-4 rounded-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Corporate Admin Collaboration Status Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3 shadow-xs">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <Users size={18} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-wide">Registered Administrators</p>
            <p className="text-lg font-black text-slate-800 mt-0.5">{admins.length} Active</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3 shadow-xs">
          <div className="p-2.5 bg-slate-50 text-slate-600 rounded-lg">
            <Shield size={18} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-wide">Min. Analysis Quorum</p>
            <p className="text-lg font-black text-slate-800 mt-0.5">3 Admins <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded ml-1">MET</span></p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3 shadow-xs">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <BarChart3 size={18} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-wide">Audit Trail Level</p>
            <p className="text-lg font-black text-slate-800 mt-0.5">KDPA Guarded</p>
          </div>
        </div>
      </div>

      {/* Main Admin List Workspace */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4.5 border-b border-slate-150 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lock size={15} className="text-slate-400" /> Internal Recruiting Tool Access List
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Control which corporate managers have permission to edit screening objectives and review candidate ratings.</p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer transition shadow-xs"
          >
            <UserPlus size={14} />
            {showForm ? "Close Drawer" : "Provision New Admin"}
          </button>
        </div>

        {/* Drawer Form */}
        {showForm && (
          <div className="bg-slate-50 border-b border-slate-200 p-6 animate-fade-in">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">Invite Internal Corporate Colleague</h4>
            <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Jane Atieno"
                  required
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Work Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. j.atieno@morggy.tech"
                  required
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Corporate Role / Title</label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Lead Technologist"
                  required
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Division / Cost Center</label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Engineering">Engineering & Ops</option>
                  <option value="Human Resources">Human Resources Council</option>
                  <option value="Compliance">Regulatory Audit Office</option>
                  <option value="Management">C-Suite / Executive</option>
                </select>
              </div>

              <div className="md:col-span-2 lg:col-span-4 flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newCanEdit}
                    onChange={(e) => setNewCanEdit(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-[11px] font-semibold text-slate-600">Grant permission to modify screening rules and AI parameters for jobs</span>
                </label>

                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition"
                >
                  Confirm Provisioning
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Admins Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono tracking-wider font-semibold uppercase text-[10px]">
                <th className="py-3 px-6">Administrator Name</th>
                <th className="py-3 px-6">Work Email</th>
                <th className="py-3 px-6">Security Clearance Role</th>
                <th className="py-3 px-6 text-center">Screening Rule Editor?</th>
                <th className="py-3 px-6">Last Active</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-50/50 transition duration-150">
                  <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-[11px] select-none uppercase">
                      {admin.name.split(" ").map(w => w[0]).join("")}
                    </div>
                    {admin.name}
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-mono flex-shrink-0">
                    <span className="flex items-center gap-1">
                      <Mail size={12} className="text-slate-400" />
                      {admin.email}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="block font-medium text-slate-800">{admin.role}</span>
                    <span className="text-[10px] text-slate-405 font-mono text-slate-400 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">{admin.department}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {admin.canEditRules ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">
                        ✓ Write Perms
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-500 border border-slate-150 text-[9px] px-2 py-0.5 rounded-full font-mono">
                        Read Only
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${admin.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                      <span className="text-slate-600">{admin.lastActive}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleRemoveAdmin(admin.id)}
                      disabled={admins.length <= 1}
                      title="Revoke Admin Access"
                      className="text-rose-500 hover:text-rose-700 disabled:opacity-30 p-1.5 hover:bg-rose-50 rounded transition duration-150 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 border-t border-slate-150 px-6 py-4 flex items-center justify-between text-[11px] text-slate-500">
          <span>Ensuring internal alignment with organizational guidelines and Kenya Data Protection Act constraints.</span>
          <span className="font-semibold text-indigo-700">Multi-panel Review Guard Active</span>
        </div>
      </div>

    </div>
  );
}
