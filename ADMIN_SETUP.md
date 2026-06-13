# 🔐 Admin Dashboard Configuration

## Quick Setup

The admin dashboard is now built-in and ready to use. Here's how to configure it:

### 1. Local Development

Edit `.env.local`:
```env
VITE_ADMIN_SECRET=admin123
```

Then access the admin panel:
```
http://localhost:5173?admin=admin123
```

### 2. Production (Railway)

Set the environment variable in Railway dashboard:
```
ADMIN_SECRET_KEY=your-production-secret-key
```

Access:
```
https://your-railway-url.railway.app?admin=your-production-secret-key
```

### 3. Change the Secret

To change the admin secret:

1. Update `VITE_ADMIN_SECRET` in `.env.local` (dev) or Railway (production)
2. Redeploy or restart the dev server
3. Use the new secret in the `?admin=` URL parameter

---

## Features

### Real-time Dashboard Metrics
- ✅ **Total Candidates** - Live count with trends
- ✅ **Active Jobs** - Current job openings
- ✅ **Conversion Rate** - Application to hire conversion
- ✅ **Live Activity** - Real-time system activity

### Analytics Charts
- 📈 **Application Trends** - Line chart showing trends over time
- 📊 **Status Distribution** - Pie chart of candidate statuses
- 📋 **Detailed Tables** - Recent candidates and active jobs

### Liveness Indicators
- 🟢 **System Live Badge** - Shows if system is online
- 📡 **Real-time Status** - Live data update indicators
- ⚡ **Activity Pulse** - Animation showing active operations
- 🔄 **Last Sync** - Timestamp of last data refresh

---

## Database Integration

The admin dashboard pulls data from Supabase tables:

```
candidates  → List of all job applicants
jobs        → All posted positions
analytics   → Event tracking and metrics
tenants     → Organization data
```

### Real-time Updates

Changes to these tables update instantly in the admin dashboard thanks to Supabase realtime subscriptions.

---

## Security

### Development
- Default secret: `admin123`
- Change before deploying to production

### Production
- Generate secure secret: `openssl rand -base64 32`
- Store in Railway environment variables
- Never share the secret URL

### Access Control
- Admin URL parameter authenticates the session
- Session stored in localStorage for convenience
- Clear via logout button

---

## Troubleshooting

### Admin panel not loading
1. Check URL has correct `?admin=SECRET` parameter
2. Verify secret matches environment variable
3. Check browser console for errors

### No data showing
1. Verify Supabase credentials in environment
2. Check database tables exist and have data
3. Verify RLS policies allow reads

### Real-time not updating
1. Check internet connection
2. Verify Supabase real-time is enabled
3. Check browser Network tab for `/realtime/` connections

---

## API Reference

### useRealtimeData Hook

```typescript
const { data, loading, error, refetch, isLive } = useRealtimeData(table, {
  tenantId?: string,
  refreshInterval?: number,  // default: 30000ms
  enabled?: boolean           // default: true
});
```

### useRealtimeStats Hook

```typescript
const stats = useRealtimeStats(tenantId);
// Returns: { totalCandidates, activeJobs, totalApplications, conversionRate }
```

### useRealtimeStatus Hook

```typescript
const { isOnline } = useRealtimeStatus();
// Returns: { isOnline: boolean }
```

---

## Customization

### Add New Metrics

Edit `src/components/AdminDashboard.tsx`:

```tsx
<MetricCard
  icon={YourIcon}
  title="New Metric"
  value={newValue}
  change={12}
  isLive={true}
  color="bg-gradient-primary"
/>
```

### Modify Chart Data

Edit the `chartData` variable to fetch from different source:

```tsx
const chartData = analytics.slice(0, 30).map((item) => ({
  name: new Date(item.created_at).toLocaleDateString(),
  customValue: item.custom_field,
}));
```

### Change Update Frequency

Edit refresh intervals in `useRealtimeData`:

```tsx
refreshInterval={15000}  // 15 seconds instead of 30
```

---

## Performance Optimization

### Large Datasets
- Limit initial fetch: `.slice(0, 50)` for large tables
- Implement pagination for detailed views
- Use database indexes on frequently queried columns

### Real-time Scalability
- Supabase handles up to 10 realtime connections per user free tier
- Upgrade plan for more concurrent connections
- Use filtering to reduce realtime message volume

---

## Next Steps

1. ✅ Set admin secret in `.env` or Railway
2. ✅ Access admin dashboard: `?admin=YOUR_SECRET`
3. ✅ Verify real-time data updates
4. ✅ Customize metrics as needed
5. ✅ Deploy to production

---

**Your admin console is ready to manage RecruitIQ!** 👨‍💼
