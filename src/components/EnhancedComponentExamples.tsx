import React from 'react';
import { Sparkles, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * ENHANCED COMPONENT EXAMPLE
 * This demonstrates how to apply the new theme system to your components
 * Copy patterns from here to upgrade your existing components
 */

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
  gradient?: 'primary' | 'success' | 'warning' | 'danger';
}

/**
 * ENHANCED METRIC CARD
 * Shows how to create a modern metric card with gradients, animations, and depth
 */
export function MetricCardEnhanced({
  icon,
  label,
  value,
  trend,
  gradient = 'primary'
}: MetricCardProps) {
  const gradientMap = {
    primary: 'bg-gradient-primary',
    success: 'bg-gradient-success',
    warning: 'bg-gradient-warning',
    danger: 'bg-gradient-danger'
  };

  const trendColorMap = {
    up: 'text-emerald-600',
    down: 'text-red-600'
  };

  return (
    <div className="card-enhanced hover-lift">
      {/* Card Header with Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className={`${gradientMap[gradient]} p-3 rounded-lg shadow-glow-blue`}>
          <div className="text-white text-2xl">
            {icon}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${trendColorMap[trend.direction]}`}>
            <TrendingUp size={16} className={trend.direction === 'down' ? 'rotate-180' : ''} />
            <span className="text-sm font-semibold">{trend.percentage}%</span>
          </div>
        )}
      </div>

      {/* Metric Value */}
      <div className="mb-2">
        <p className="text-slate-600 text-sm font-medium mb-1">{label}</p>
        <p className="gradient-text-primary text-3xl font-bold">
          {value}
        </p>
      </div>

      {/* Optional Sparkline */}
      <div className="h-1 bg-slate-100 rounded-full overflow-hidden mt-4">
        <div className="h-full bg-gradient-to-r from-blue-400 to-amber-300" style={{ width: '75%' }}></div>
      </div>
    </div>
  );
}

/**
 * ENHANCED STATUS BADGE
 * Shows how to create modern, animated status indicators
 */
export function StatusBadgeEnhanced({
  status,
  label
}: {
  status: 'success' | 'warning' | 'danger' | 'info';
  label: string;
}) {
  const statusConfig = {
    success: {
      className: 'badge-success',
      icon: <CheckCircle2 size={14} />
    },
    warning: {
      className: 'badge-warning',
      icon: <AlertCircle size={14} />
    },
    danger: {
      className: 'badge-danger',
      icon: <AlertCircle size={14} />
    },
    info: {
      className: 'badge-info',
      icon: <Sparkles size={14} />
    }
  };

  return (
    <div className={statusConfig[status].className}>
      {statusConfig[status].icon}
      <span>{label}</span>
    </div>
  );
}

/**
 * ENHANCED BUTTON COMPONENT
 * Shows variants with different styles and interactions
 */
export function ButtonEnhanced({
  variant = 'primary',
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  size = 'md',
  isLoading = false
}: {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}) {
  const baseClasses = 'font-semibold rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'btn-primary focus:ring-blue-500',
    secondary: 'btn-secondary focus:ring-blue-500',
    outline: 'btn-primary-outline focus:ring-blue-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="animate-spin-slow">⚙️</span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

/**
 * ENHANCED INPUT COMPONENT
 * Shows modern input field with animations and validation states
 */
export function InputEnhanced({
  placeholder,
  value,
  onChange,
  error,
  success,
  type = 'text'
}: {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  success?: boolean;
  type?: string;
}) {
  return (
    <div className="w-full">
      <input
        className={`
          input-enhanced
          ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}
          ${success ? 'border-green-400 focus:border-green-500 focus:ring-green-100' : ''}
        `}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{error}</p>}
      {success && <p className="text-green-600 text-sm mt-1 flex items-center gap-1"><CheckCircle2 size={14} />Success</p>}
    </div>
  );
}

/**
 * ENHANCED HERO SECTION
 * Modern landing page hero with animations and gradient background
 */
export function HeroSectionEnhanced() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-gentle"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 animate-fade-in-up">
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-300 px-4 py-2 rounded-full border border-blue-500/20 text-sm font-medium">
            <Sparkles size={16} />
            Introducing Enhanced RecruitIQ
          </span>
        </div>

        <h1 className="gradient-text-primary text-5xl md:text-6xl font-bold mb-4 leading-tight">
          The Future of Recruitment Management
        </h1>

        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Modern, intuitive, and powerful. Transform your recruitment process with our next-generation platform designed for ambitious teams.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <ButtonEnhanced variant="primary" size="lg">
            Start Free Trial →
          </ButtonEnhanced>
          <ButtonEnhanced variant="outline" size="lg">
            Learn More
          </ButtonEnhanced>
        </div>
      </div>
    </div>
  );
}

/**
 * ENHANCED CARD GRID
 * Shows how to create feature cards with modern styling
 */
export function FeatureCardEnhanced({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card-enhanced hover-lift group">
      {/* Icon Container */}
      <div className="mb-4 p-3 w-fit bg-gradient-primary rounded-lg shadow-glow-blue group-hover:shadow-glow-gold transition-smooth">
        <div className="text-white text-2xl">
          {icon}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:gradient-text-primary transition-smooth">
        {title}
      </h3>
      <p className="text-slate-600 text-sm leading-relaxed">
        {description}
      </p>

      {/* Hover CTA */}
      <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-smooth">
        Learn more →
      </div>
    </div>
  );
}

/**
 * ENHANCED TABLE COMPONENT
 * Shows modern table styling with hover effects
 */
export function TableEnhanced({
  headers,
  rows
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="rounded-lg overflow-hidden border border-slate-200">
      <table className="table-enhanced">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, cellIdx) => (
                <td key={cellIdx}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * EXAMPLE DASHBOARD SECTION
 * Shows how to put it all together
 */
export function DashboardSectionExample() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Dashboard Overview</h2>
        <p className="text-slate-600">Welcome back! Here's your recruitment summary.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCardEnhanced
          icon="👥"
          label="Total Candidates"
          value={1234}
          trend={{ direction: 'up', percentage: 12 }}
          gradient="primary"
        />
        <MetricCardEnhanced
          icon="📋"
          label="Active Jobs"
          value={28}
          trend={{ direction: 'up', percentage: 8 }}
          gradient="success"
        />
        <MetricCardEnhanced
          icon="✅"
          label="Shortlisted"
          value={156}
          trend={{ direction: 'up', percentage: 25 }}
          gradient="warning"
        />
        <MetricCardEnhanced
          icon="🎯"
          label="Conversion Rate"
          value="12.5%"
          trend={{ direction: 'down', percentage: 3 }}
          gradient="danger"
        />
      </div>

      {/* Status Badges Example */}
      <div className="card-enhanced">
        <h3 className="font-semibold text-slate-900 mb-4">Recent Status Updates</h3>
        <div className="flex flex-wrap gap-3">
          <StatusBadgeEnhanced status="success" label="Candidate Shortlisted" />
          <StatusBadgeEnhanced status="warning" label="Interview Scheduled" />
          <StatusBadgeEnhanced status="info" label="New Application" />
          <StatusBadgeEnhanced status="danger" label="Application Rejected" />
        </div>
      </div>
    </div>
  );
}
