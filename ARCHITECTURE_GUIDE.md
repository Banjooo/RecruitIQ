# 🔧 Architecture & Integration Guide

## Overview

RecruitIQ now has a modern cloud-ready architecture with real-time capabilities:

```
┌─────────────────────────────────────────────────┐
│         React Frontend (Vite)                   │
│  ┌─────────────────────────────────────────┐   │
│  │ AdminDashboard                          │   │
│  │ Dashboard                               │   │
│  │ BusinessAuth                            │   │
│  │ CandidatePortal                         │   │
│  └─────────────────────────────────────────┘   │
│                    ↓                            │
│  ┌─────────────────────────────────────────┐   │
│  │ useRealtimeData Hook                    │   │
│  │ useRealtimeStats Hook                   │   │
│  │ useRealtimeStatus Hook                  │   │
│  └─────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────┘
                       │ HTTPS
                       ↓
        ┌──────────────────────────────┐
        │    Supabase Backend          │
        │                              │
        │ ┌──────────────────────────┐ │
        │ │ PostgreSQL Database      │ │
        │ ├──────────────────────────┤ │
        │ │ Realtime Subscriptions   │ │
        │ ├──────────────────────────┤ │
        │ │ Auth & RLS Policies      │ │
        │ └──────────────────────────┘ │
        └──────────────────────────────┘
```

---

## 📦 New Files Added

### 1. **src/lib/supabase.ts**
Supabase client configuration and data fetching utilities.

```typescript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(url, anonKey);

// Helper functions:
getTenants()
getCandidates()
getJobs()
getAnalytics()
updateCandidateStatus()
subscribeToRealtimeUpdates()
```

### 2. **src/hooks/useRealtimeData.ts**
React hooks for real-time data management.

```typescript
// Main hook - fetches and subscribes to table updates
useRealtimeData(table, options)

// Statistics hook - aggregates count data
useRealtimeStats(tenantId)

// Status hook - tracks online/offline status
useRealtimeStatus()
```

### 3. **src/components/AdminDashboard.tsx**
Full-featured admin console with charts and metrics.

```typescript
// Features:
- 4 metric cards with trends
- Line chart for application trends
- Pie chart for status distribution
- Recent candidates table
- Active jobs table
- Real-time status indicators
```

### 4. **src/components/LivenessIndicator.tsx**
Visual indicators for system status and real-time updates.

```typescript
<LivenessIndicator 
  isLive={boolean}
  isOnline={boolean}
  label={string}
/>

<SystemStatusBadge isOnline={boolean} />
```

---

## 🔌 Integration Points

### Connect Existing Components to Real-time

#### Example: Dashboard Component

```typescript
// OLD: Static state
const [candidates, setCandidates] = useState<Candidate[]>([]);

// NEW: Real-time hook
const { data: candidates, loading, isLive } = useRealtimeData("candidates", {
  tenantId: tenant?.id,
  refreshInterval: 20000,
  enabled: true
});

// Use isLive indicator
{isLive && <span className="text-green-600">Live</span>}
```

#### Example: CandidatePortal Component

```typescript
// Subscribe to job updates
const { data: jobs } = useRealtimeData("jobs", {
  enabled: true,
  refreshInterval: 30000
});

// Subscribe to analytics
const { data: analytics } = useRealtimeData("analytics", {
  enabled: true
});
```

#### Example: MpesaBilling Component

```typescript
// Track payment analytics
const { data: invoices } = useRealtimeData("invoices", {
  tenantId: tenant?.id,
  enabled: true
});
```

---

## 📊 Data Flow Architecture

### 1. **Initial Data Fetch**

```
Component Mount
      ↓
useRealtimeData Hook
      ↓
supabase.from(table).select()
      ↓
Set Loading State
      ↓
Update Component State
      ↓
Set Loading = false
```

### 2. **Real-time Subscription**

```
Initial Fetch Complete
      ↓
Subscribe to table changes
      ↓
Supabase emits changes (INSERT, UPDATE, DELETE)
      ↓
Update component state immediately
      ↓
Re-render with new data
```

### 3. **Polling (Fallback)**

```
Every refreshInterval milliseconds:
      ↓
Re-fetch data from database
      ↓
Ensure data freshness even if subscription misses event
      ↓
Update state
```

---

## 🔐 Authentication & Security

### Admin Access Control

```typescript
// In App.tsx
const adminKey = params.get("admin");
const adminSecret = import.meta.env.VITE_ADMIN_SECRET;

if (adminKey === adminSecret) {
  setAdminAuthenticated(true);
  localStorage.setItem("recruitiq_admin_token", adminSecret);
}
```

### Database Security (RLS)

```sql
-- Example policy
CREATE POLICY "Tenant-scoped access"
ON candidates
USING (tenant_id = auth.uid());

-- Prevents data leakage between tenants
```

---

## 📈 Performance Optimization

### 1. **Lazy Loading**
```typescript
// Load admin dashboard only when needed
{activePerspective === "admin" && adminAuthenticated && (
  <AdminDashboard />
)}
```

### 2. **Incremental Updates**
```typescript
// Update specific record instead of re-fetching all
setData(prev => prev.map(item => 
  item.id === updated.id ? updated : item
))
```

### 3. **Reduce Realtime Load**
```typescript
// Only subscribe to tables you need
enabled: tenant?.id !== undefined

// Adjust refresh intervals
refreshInterval: 30000  // 30 seconds
```

### 4. **Index Optimization**
```sql
-- Database indexes for fast queries
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_candidates_tenant_id ON candidates(tenant_id);
```

---

## 🔄 Updating Data

### Example: Update Candidate Status

#### Old Way (with API)
```typescript
await fetch(`/api/candidates/${id}`, {
  method: "PATCH",
  body: JSON.stringify({ status, remarks })
})
```

#### New Way (with Supabase)
```typescript
import { updateCandidateStatus } from "../lib/supabase";

await updateCandidateStatus(id, "shortlisted");

// Component automatically updates via real-time!
```

### Example: Add New Candidate

```typescript
import { supabase } from "../lib/supabase";

const { data, error } = await supabase
  .from("candidates")
  .insert([{
    tenant_id: "org-1",
    name: "John Doe",
    email: "john@example.com",
    status: "applied"
  }]);

// Component state updates instantly!
```

---

## 🎨 Animation Integration

### Available Animation Classes

```css
/* Entrance animations */
.animate-fade-in-up      { animation: fadeInUp 0.6s ease-out }
.animate-fade-in-down    { animation: fadeInDown 0.6s ease-out }
.animate-slide-in-right  { animation: slideInRight 0.4s ease-out }
.animate-slide-in-left   { animation: slideInLeft 0.4s ease-out }
.animate-scale-in        { animation: scaleIn 0.4s ease-out }

/* Continuous animations */
.animate-pulse-glow      { animation: pulseGlow 2s infinite }
.animate-spin-slow       { animation: spinSlow 3s linear infinite }
.animate-bounce-gentle   { animation: bounceGentle 3s infinite }

/* Interactive animations */
.hover-lift              { transitions on hover with shadow }
.gradient-border         { animated gradient border }
.glass                   { glass morphism effect }
```

### Using in Components

```typescript
// Entrance animation
<div className="animate-fade-in-up">
  Welcome
</div>

// Live indicator animation
<div className="w-2 h-2 bg-green-500 animate-pulse-glow" />

// Hover effect
<button className="card-enhanced hover-lift">
  Click me
</button>
```

---

## 🧪 Testing Real-time Features

### Test 1: Subscribe to Changes

```typescript
// In browser console
const { data, error } = await supabase
  .from("candidates")
  .select()
  .limit(1);

console.log(data); // See candidates
```

### Test 2: Insert Data

```typescript
// In browser console
await supabase.from("candidates").insert({
  tenant_id: "org-1",
  name: "Test User",
  email: "test@example.com"
});

// Watch dashboard update instantly!
```

### Test 3: Connection Status

```typescript
// In browser console
console.log(navigator.onLine); // true/false

// Disconnect network (DevTools → Network → Offline)
// Watch "System Offline" appear on admin dashboard
```

---

## 🚀 Deployment Checklist

- [ ] Environment variables set in Railway
- [ ] Supabase tables created and populated
- [ ] Real-time subscriptions enabled
- [ ] RLS policies configured
- [ ] Admin secret key set
- [ ] Build succeeds: `npm run build`
- [ ] Docker builds: `docker build .`
- [ ] Local testing: `npm run dev`
- [ ] Admin dashboard accessible
- [ ] Real-time updates work

---

## 📝 Code Examples

### Example 1: Custom Hook Usage

```typescript
import { useRealtimeData } from "../hooks/useRealtimeData";

export function CandidateList({ tenantId }) {
  const { data: candidates, loading, error, refetch } = useRealtimeData(
    "candidates",
    { tenantId, refreshInterval: 20000 }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {candidates.map(c => (
        <li key={c.id}>{c.name} - {c.status}</li>
      ))}
    </ul>
  );
}
```

### Example 2: Admin Dashboard Stats

```typescript
import { useRealtimeStats } from "../hooks/useRealtimeData";

export function Stats({ tenantId }) {
  const stats = useRealtimeStats(tenantId);

  return (
    <div>
      <h2>Candidates: {stats.totalCandidates}</h2>
      <h2>Jobs: {stats.activeJobs}</h2>
      <h2>Conversion: {stats.conversionRate.toFixed(2)}%</h2>
    </div>
  );
}
```

### Example 3: Live Status Badge

```typescript
import LivenessIndicator, { SystemStatusBadge } from "../components/LivenessIndicator";
import { useRealtimeStatus } from "../hooks/useRealtimeData";

export function Header() {
  const { isOnline } = useRealtimeStatus();

  return (
    <header>
      <SystemStatusBadge isOnline={isOnline} />
      <LivenessIndicator isLive={true} isOnline={isOnline} />
    </header>
  );
}
```

---

## 🔗 Connecting Services

### Supabase → Frontend

```
Environment Variables (.env)
  ↓
vite.config imports env
  ↓
src/lib/supabase.ts creates client
  ↓
src/hooks/useRealtimeData uses client
  ↓
Components use hooks
```

### Frontend → Railway

```
Git Push to main
  ↓
Railway detects change
  ↓
Railway builds Docker image
  ↓
Railway deploys container
  ↓
Environment variables injected
  ↓
App connects to Supabase
```

---

## 📚 API Reference

### Supabase Functions

```typescript
// Fetch data
const data = await getTenants();
const candidates = await getCandidates(tenantId);
const jobs = await getJobs(tenantId);

// Update data
await updateCandidateStatus(candidateId, "shortlisted");

// Subscribe to changes
const subscription = subscribeToRealtimeUpdates(table, (payload) => {
  console.log(payload); // { eventType, new, old }
});
```

### React Hooks

```typescript
// Fetch + subscribe
const { data, loading, error, refetch, isLive } = useRealtimeData(table);

// Stats aggregation
const stats = useRealtimeStats(tenantId);

// Connectivity status
const { isOnline } = useRealtimeStatus();
```

---

## 🎯 Summary

Your RecruitIQ platform now has:

✅ **Real-time Data Sync** - Changes appear instantly
✅ **Admin Dashboard** - Full platform oversight
✅ **Cloud Ready** - Deploy anywhere
✅ **Beautiful UI** - Smooth animations throughout
✅ **Scalable** - Database indexes and RLS policies
✅ **Secure** - Environment variables and authentication

**Start building!** 🚀
