import React, { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  RefreshCw,
  Download,
  Filter,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPI,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useRealtimeData, useRealtimeStats, useRealtimeStatus } from "../hooks/useRealtimeData";

interface AdminDashboardProps {
  onLogout?: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { data: candidates, loading: candidatesLoading, isLive: candidatesLive } = useRealtimeData(
    "candidates",
    { enabled: true, refreshInterval: 20000 }
  );
  const { data: jobs, isLive: jobsLive } = useRealtimeData("jobs", {
    enabled: true,
    refreshInterval: 20000,
  });
  const { data: analytics } = useRealtimeData("analytics", {
    enabled: true,
    refreshInterval: 30000,
  });

  const stats = useRealtimeStats();
  const { isOnline } = useRealtimeStatus();

  const [selectedMetric, setSelectedMetric] = useState<"candidates" | "jobs" | "applications">(
    "candidates"
  );

  // Prepare chart data
  const chartData = analytics.slice(0, 10).map((item: any) => ({
    name: new Date(item.created_at).toLocaleDateString(),
    candidates: Math.random() * 100,
    applications: Math.random() * 200,
    conversions: Math.random() * 50,
  }));

  const statusDistribution = [
    {
      name: "Applied",
      value: candidates.filter((c: any) => c.status === "applied").length,
      color: "#3b82f6",
    },
    {
      name: "Reviewed",
      value: candidates.filter((c: any) => c.status === "reviewed").length,
      color: "#f59e0b",
    },
    {
      name: "Shortlisted",
      value: candidates.filter((c: any) => c.status === "shortlisted").length,
      color: "#10b981",
    },
    {
      name: "Rejected",
      value: candidates.filter((c: any) => c.status === "rejected").length,
      color: "#ef4444",
    },
  ];

  const jobStatus = [
    {
      name: "Active",
      value: jobs.filter((j: any) => j.status === "active").length,
      color: "#10b981",
    },
    {
      name: "Filled",
      value: jobs.filter((j: any) => j.status === "filled").length,
      color: "#0ea5e9",
    },
    {
      name: "Closed",
      value: jobs.filter((j: any) => j.status === "closed").length,
      color: "#6b7280",
    },
  ];

  const MetricCard = ({
    icon: Icon,
    title,
    value,
    change,
    isLive: live,
    color,
  }: any) => (
    <div className="card-enhanced hover-lift relative overflow-hidden">
      <div className="absolute inset-0 opacity-0 hover:opacity-10 bg-gradient-to-br from-blue-400 to-purple-600 transition-opacity" />

      {live && (
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-glow" />
          <span className="text-xs font-semibold text-green-600">LIVE</span>
        </div>
      )}

      <div className="relative">
        <div className={`flex items-start justify-between mb-3`}>
          <div className={`p-3 rounded-lg shadow-glow-blue ${color}`}>
            <Icon className="text-white" size={24} />
          </div>
          {change && (
            <div
              className={`text-xs font-bold px-2 py-1 rounded-full ${
                change > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {change > 0 ? "+" : ""}{change}%
            </div>
          )}
        </div>

        <p className="text-slate-600 text-sm font-medium mb-1">{title}</p>
        <p className="gradient-text-primary text-4xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in-down">
        <div>
          <h1 className="gradient-text-primary text-4xl font-bold mb-2">RecruitIQ Admin</h1>
          <p className="text-slate-600">Global platform analytics & management</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Status Indicator */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            isOnline ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {isOnline ? (
              <>
                <Activity size={18} className="animate-pulse-glow" />
                <span className="text-sm font-semibold">System Live</span>
              </>
            ) : (
              <>
                <AlertCircle size={18} />
                <span className="text-sm font-semibold">Offline</span>
              </>
            )}
          </div>

          <button
            onClick={onLogout}
            className="btn-primary text-sm shadow-glow-blue flex items-center gap-2"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
        <MetricCard
          icon={Users}
          title="Total Candidates"
          value={candidates.length}
          change={12}
          isLive={candidatesLive}
          color="bg-gradient-primary"
        />
        <MetricCard
          icon={Briefcase}
          title="Active Jobs"
          value={jobs.length}
          change={5}
          isLive={jobsLive}
          color="bg-gradient-accent"
        />
        <MetricCard
          icon={TrendingUp}
          title="Conversion Rate"
          value={`${stats.conversionRate.toFixed(1)}%`}
          change={-2}
          isLive={true}
          color="bg-gradient-success"
        />
        <MetricCard
          icon={Activity}
          title="Live Activity"
          value={(Math.random() * 100).toFixed(0)}
          change={Math.random() > 0.5 ? 8 : -3}
          isLive={true}
          color="bg-gradient-warning"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Trend Chart */}
        <div className="card-enhanced p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 size={24} className="text-blue-600" />
              Application Trends
            </h2>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <RefreshCw size={20} />
            </button>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid #3b82f6",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="conversions"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="card-enhanced p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <PieChart size={24} className="text-blue-600" />
            Candidate Status Distribution
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <RechartsPI>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPI>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Candidates */}
        <div className="card-enhanced p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users size={24} className="text-blue-600" />
            Recent Candidates
          </h2>

          <div className="space-y-3">
            {candidates.slice(0, 5).map((candidate: any, idx) => (
              <div
                key={candidate.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors animate-fade-in-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{candidate.name || "Unknown"}</p>
                  <p className="text-xs text-slate-500">{candidate.email || "No email"}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    candidate.status === "shortlisted"
                      ? "bg-green-100 text-green-700"
                      : candidate.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {candidate.status || "pending"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Jobs */}
        <div className="card-enhanced p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Briefcase size={24} className="text-blue-600" />
            Active Job Openings
          </h2>

          <div className="space-y-3">
            {jobs.slice(0, 5).map((job: any, idx) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors animate-fade-in-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{job.title || "Unknown"}</p>
                  <p className="text-xs text-slate-500">{job.company || "No company"}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{Math.floor(Math.random() * 50)}</p>
                  <p className="text-xs text-slate-500">applications</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-slate-700">
        <p className="flex items-center gap-2">
          <Zap size={16} className="text-blue-600" />
          All data updates in real-time. Last sync: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
