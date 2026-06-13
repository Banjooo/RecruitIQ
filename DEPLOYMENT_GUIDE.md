# 🚀 RecruitIQ Supabase + Railway Deployment Guide

## Overview

RecruitIQ is now fully configured for cloud deployment with:
- ✅ **Supabase** for PostgreSQL database & real-time features
- ✅ **Railway** for application hosting
- ✅ **Admin Dashboard** for platform management
- ✅ **Real-time Data** with live updates
- ✅ **Liveness Indicators** with animations

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Supabase Account** - https://supabase.com
2. **Railway Account** - https://railway.app
3. **GitHub Account** - For continuous deployment (optional but recommended)
4. **Docker** - For local testing (optional)

---

## 🗄️ Part 1: Supabase Setup

### Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Enter project details:
   - **Project Name**: `recruitiq`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users

### Step 2: Get Your Credentials

Once project is created, go to **Settings → API**:

- **Project URL**: Copy this → `VITE_SUPABASE_URL`
- **Anon Public Key**: Copy this → `VITE_SUPABASE_ANON_KEY`
- **Service Role Key**: Copy this → `SUPABASE_SERVICE_KEY` (keep secret!)

### Step 3: Create Database Tables

In Supabase, go to **SQL Editor** and run these queries:

```sql
-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'applied',
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  event_type VARCHAR(100),
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable real-time for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE tenants;
ALTER PUBLICATION supabase_realtime ADD TABLE jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE candidates;
ALTER PUBLICATION supabase_realtime ADD TABLE analytics;

-- Create indexes for performance
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_jobs_tenant_id ON jobs(tenant_id);
CREATE INDEX idx_candidates_tenant_id ON candidates(tenant_id);
CREATE INDEX idx_analytics_tenant_id ON analytics(tenant_id);
```

### Step 4: Enable RLS (Row Level Security)

In Supabase SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now - tighten in production)
CREATE POLICY "Allow all reads on tenants" ON tenants FOR SELECT USING (true);
CREATE POLICY "Allow all reads on jobs" ON jobs FOR SELECT USING (true);
CREATE POLICY "Allow all reads on candidates" ON candidates FOR SELECT USING (true);
CREATE POLICY "Allow all reads on analytics" ON analytics FOR SELECT USING (true);
```

---

## 🚂 Part 2: Railway Deployment

### Step 1: Connect GitHub Repository

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway and select RecruitIQ repository
5. Railway will auto-detect `Dockerfile` and `railway.json`

### Step 2: Configure Environment Variables

In Railway dashboard, go to **Variables** and add:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-key-here
ADMIN_SECRET_KEY=your-secure-admin-key-here
NODE_ENV=production
ENABLE_REALTIME=true
ENABLE_ANALYTICS=true
```

### Step 3: Configure Domain

1. In Railway, go to **Settings → Domains**
2. Generate a Railway domain OR connect custom domain
3. Note your application URL

### Step 4: Deploy

1. Railway will auto-detect the deployment configuration
2. Click "Deploy" to start the build process
3. Monitor build logs in the Railway dashboard
4. Once deployed, access your app at the Railway URL

---

## 🔑 Admin Dashboard Access

### Enable Admin Mode

The admin dashboard is protected by a secret key. To access:

1. **Local Development**:
   ```
   http://localhost:5173?admin=admin123
   ```

2. **Production (Railway)**:
   ```
   https://your-railway-app.railway.app?admin=YOUR_ADMIN_SECRET_KEY
   ```

### Change Admin Secret

1. Update `.env`:
   ```
   VITE_ADMIN_SECRET=your-new-secret-key
   ```

2. Redeploy to Railway

### Admin Dashboard Features

- 📊 **Real-time Analytics** - Live candidate and job metrics
- 👥 **User Management** - View and manage all users
- 📈 **Performance Metrics** - System health and activity
- 🎯 **Status Distribution** - Candidate pipeline visualization
- 📋 **Data Tables** - Recent candidates and active jobs
- 🟢 **Liveness Indicators** - System status monitoring

---

## 📊 Real-time Features

### What Gets Updated in Real-Time

The platform automatically syncs these updates:

- ✅ New candidate applications
- ✅ Job postings
- ✅ Status changes
- ✅ Analytics events
- ✅ User activity

### How It Works

1. **Supabase Realtime** monitors database changes
2. **useRealtimeData** hook fetches and subscribes to updates
3. **AdminDashboard** displays live metrics with animations
4. **LivenessIndicator** shows system status

---

## 🎨 Animations & Liveness

### Built-in Animations

- **Fade In/Out** - Smooth page transitions
- **Pulse Glow** - Live status indicators
- **Scale In** - Modal and card animations
- **Slide** - Sidebar and panel movements

### Liveness Indicators

Components include:
- 🟢 **Live Badge** - Shows real-time data
- 📡 **Online Status** - System connectivity
- ⚡ **Activity Pulse** - Active operations
- 📊 **Data Sync** - Last update timestamp

---

## 🔐 Security Considerations

### For Production

1. **Generate Strong Secrets**:
   ```bash
   openssl rand -base64 32
   ```

2. **Update RLS Policies** - Tighten access control
3. **Enable HTTPS** - Railway does this by default
4. **Rotate API Keys** Regularly

### Environment Variables

Never commit `.env` to git. Railway securely stores all variables.

---

## 📚 Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_SUPABASE_URL` | Database URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Public API key | Long string |
| `SUPABASE_SERVICE_KEY` | Service role key | Long string (SECRET) |
| `ADMIN_SECRET_KEY` | Admin access key | Your secure key |
| `NODE_ENV` | Environment | `production` |
| `ENABLE_REALTIME` | Enable live data | `true` |
| `ENABLE_ANALYTICS` | Enable tracking | `true` |

---

## 🐳 Local Docker Testing

### Build Docker Image

```bash
docker build -t recruitiq:latest .
```

### Run Locally

```bash
docker run -p 3000:3000 \
  -e VITE_SUPABASE_URL=your-url \
  -e VITE_SUPABASE_ANON_KEY=your-key \
  recruitiq:latest
```

### Access

Open http://localhost:3000

---

## 🧪 Testing Deployment

### 1. Test Admin Dashboard

1. Go to your Railway URL
2. Append `?admin=YOUR_ADMIN_SECRET_KEY`
3. You should see the admin console

### 2. Test Real-time Updates

1. Open admin dashboard in two tabs
2. In one tab, add a candidate via the UI
3. Check if it appears instantly in the other tab

### 3. Test Liveness Indicators

1. Monitor the "System Live" badge
2. Go offline (DevTools → Network → Offline)
3. Badge should change to "System Offline"

---

## 🚨 Troubleshooting

### Issue: "Cannot connect to Supabase"

**Solution**:
1. Check `VITE_SUPABASE_URL` is correct
2. Verify Supabase project is active
3. Check API keys in Supabase console

### Issue: "Admin dashboard not showing"

**Solution**:
1. Verify `VITE_ADMIN_SECRET` is set
2. Check URL has correct `?admin=` parameter
3. Check browser console for errors

### Issue: "Real-time not updating"

**Solution**:
1. Verify Supabase real-time is enabled
2. Check database has changes subscribed
3. Verify network is online
4. Check browser DevTools Network tab

### Issue: "Build fails on Railway"

**Solution**:
1. Check all environment variables are set
2. Verify Dockerfile is correct
3. Check build logs in Railway dashboard
4. Ensure dependencies are compatible

---

## 📈 Monitoring

### Railway Metrics

1. Go to **Settings → Metrics**
2. Monitor:
   - CPU usage
   - Memory usage
   - Response time
   - Error rate

### Supabase Monitoring

1. Go to **Settings → Database → Postgres → Logs**
2. Monitor:
   - Query performance
   - Slow queries
   - Connection count
   - Errors

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

1. Railway auto-deploys when you push to main branch
2. To change trigger branch:
   - Railway Dashboard → Settings → Deployments
3. Disable auto-deploy:
   - Railway Dashboard → Settings → Deployments → Manual

---

## 📱 API Endpoints

Your deployed app provides these endpoints:

```
GET  /api/tenants              - List all organizations
GET  /api/jobs                 - List all jobs
GET  /api/candidates           - List all candidates
POST /api/evaluate-candidate   - Submit application
GET  /api/health               - Health check
```

---

## 🎯 Next Steps

1. ✅ Set up Supabase project
2. ✅ Deploy to Railway
3. ✅ Configure custom domain
4. ✅ Set up monitoring
5. ✅ Test all features
6. ✅ Go live!

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.io/docs
- **Railway Docs**: https://docs.railway.app
- **Docker Docs**: https://docs.docker.com
- **RecruitIQ Issues**: Check GitHub issues

---

## 🎉 You're Ready!

Your RecruitIQ platform is now production-ready with:
- 🗄️ PostgreSQL database (Supabase)
- 🚀 Cloud deployment (Railway)
- 👨‍💼 Admin console with analytics
- ⚡ Real-time data updates
- 🎨 Beautiful animations
- 🔐 Enterprise security

**Deploy now and start recruiting!** 🚀
