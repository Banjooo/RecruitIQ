import React from "react";
import { Activity, Wifi, WifiOff, Zap } from "lucide-react";

interface LivenessIndicatorProps {
  isLive: boolean;
  isOnline: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export default function LivenessIndicator({
  isLive,
  isOnline,
  label,
  size = "md",
}: LivenessIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const containerClasses = {
    sm: "text-xs gap-1",
    md: "text-sm gap-2",
    lg: "text-base gap-2",
  };

  return (
    <div className={`flex items-center ${containerClasses[size]}`}>
      {/* Online/Offline Status */}
      {isOnline ? (
        <>
          <Wifi size={size === "sm" ? 12 : size === "md" ? 14 : 16} className="text-green-600" />
          <span className="text-green-600 font-semibold">Online</span>
        </>
      ) : (
        <>
          <WifiOff size={size === "sm" ? 12 : size === "md" ? 14 : 16} className="text-red-600" />
          <span className="text-red-600 font-semibold">Offline</span>
        </>
      )}

      {/* Live Status */}
      {isLive && (
        <div className={`flex items-center ${containerClasses[size]}`}>
          <div
            className={`${sizeClasses[size]} bg-green-500 rounded-full animate-pulse-glow`}
          />
          <span className="text-green-600 font-semibold">Live</span>
        </div>
      )}

      {label && <span className="text-slate-600">{label}</span>}
    </div>
  );
}

export function SystemStatusBadge({ isOnline }: { isOnline: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
        isOnline
          ? "bg-green-100 text-green-700 shadow-glow-success"
          : "bg-red-100 text-red-700 shadow-glow-danger"
      }`}
    >
      {isOnline ? (
        <>
          <Activity size={16} className="animate-pulse-glow" />
          System Live
        </>
      ) : (
        <>
          <Zap size={16} />
          System Offline
        </>
      )}
    </div>
  );
}
