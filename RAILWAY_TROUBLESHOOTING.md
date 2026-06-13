# 🚨 Railway Deployment Troubleshooting Guide

## What Happened

Your initial Railway deployment build completed successfully, but the application failed the health check. The error:

```
Attempt #1-11 failed with service unavailable
1/1 replicas never became healthy!
Healthcheck failed!
```

---

## Root Cause

There was a **path mismatch** between the health check configuration and the actual health endpoint:

- **railway.json was checking**: `/health`
- **server.ts endpoint exists at**: `/api/health`
- **Result**: Railway couldn't verify the container was running, so it killed the deployment

---

## ✅ The Fix

I've updated two files to fix this:

### 1. **server.ts** - Added Root Health Endpoint
```typescript
// Root Health check (for container orchestration & monitoring)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Standard Health check (existing)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "RecruitIQ Server", timestamp: new Date().toISOString() });
});
```

### 2. **railway.json** - Correct Health Check Path
```json
"deploy": {
  "startCommand": "node dist/server.cjs",
  "restartPolicyType": "ON_FAILURE",
  "restartPolicyMaxRetries": 5,
  "healthcheckPath": "/api/health",
  "healthcheckInterval": 30
}
```

---

## 🚀 How to Redeploy

### Option 1: Trigger Manual Redeploy on Railway

1. Go to https://railway.app → Your Project → RecruitIQ
2. Click **Deployments** tab
3. Find the failed deployment
4. Click **Redeploy** (or wait for auto-redeploy)
5. Monitor the deployment logs

### Option 2: Push Update to GitHub (Auto-Deploy)

```bash
cd /home/banjo-9/Downloads/RecruitIQ-main
git pull origin main  # Get latest changes
# The fix is already committed, just push it!
```

Railway will **automatically redeploy** when it detects the changes.

### Option 3: Manually Trigger from Local

```bash
# Pull latest fixes (already done)
git pull origin main

# The deployment will auto-trigger on Railway
# Monitor at: https://railway.app/project/[YOUR-PROJECT-ID]
```

---

## 📊 Deployment Flow (Fixed)

```
Git Push
  ↓
Railway Detects Change
  ↓
Docker Build
  ✓ 2302 modules transformed
  ✓ Built in 7.95s
  ↓
Docker Image Push
  ✓ Image ready
  ↓
Container Start
  `node dist/server.cjs`
  ↓
Health Check (NEW)
  GET /api/health → { "status": "ok" }
  ✓ Returns 200 OK
  ↓
✅ Deployment Successful!
```

---

## 🔍 Verify the Fix Works

### Check Local Build
```bash
cd /home/banjo-9/Downloads/RecruitIQ-main
npm run build  # ✓ Should succeed
```

### Check Health Endpoints Exist
```bash
grep -n "app.get.*health" server.ts
# Output: Should show both /health and /api/health
```

### Test Locally
```bash
npm run dev
# Then in another terminal:
curl http://localhost:3000/health
curl http://localhost:3000/api/health
# Both should return 200 OK
```

---

## 📋 What Was Wrong (Technical Details)

### The Issue
- Railway's healthcheck feature requires an HTTP endpoint to verify container health
- It was configured to check `/health`
- But the server only had `/api/health`
- Result: Railway saw "service unavailable" and kept retrying
- After 11 failed attempts, Railway killed the container

### The Solution
- Added a simple, fast `/health` endpoint for container health monitoring
- Kept the detailed `/api/health` for application health checks
- This follows industry best practices for containerized apps

---

## 🎯 What Should Happen Next

### When You Redeploy:

1. **Build Phase** ✓
   - Docker compiles TypeScript
   - Bundles JavaScript
   - Installs production dependencies

2. **Container Start** ✓
   - Railway starts the Node.js process
   - Server initializes on port 3000
   - Health check endpoint responds

3. **Health Check** ✓
   - Railway GET /api/health
   - Response: `{ "status": "ok", ... }`
   - Status: HTTP 200
   - ✅ Container marked as healthy

4. **Ready** ✓
   - Railway routes traffic to container
   - App receives requests
   - Admin dashboard accessible

---

## 🔧 Environment Variables Checklist

Before redeploying, make sure these are set in Railway:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
SUPABASE_SERVICE_KEY=your-service-key-here
ADMIN_SECRET_KEY=your-admin-secret
NODE_ENV=production
ENABLE_REALTIME=true
ENABLE_ANALYTICS=true
```

**If missing:**
1. Go to Railway → Settings → Variables
2. Add each one
3. Trigger redeploy

---

## 📱 Testing After Deployment

Once the deployment succeeds:

1. **Test Health Check**
   ```bash
   curl https://your-railway-url/health
   curl https://your-railway-url/api/health
   # Both should return 200 OK
   ```

2. **Access Admin Dashboard**
   ```
   https://your-railway-url/?admin=YOUR_ADMIN_SECRET
   ```

3. **Check Logs**
   - Railway Dashboard → Logs tab
   - Look for "Server running on port 3000"

---

## 🚨 If Deployment Still Fails

### Check These:

1. **Node version** - Should be 20-alpine
   ```dockerfile
   FROM node:20-alpine  # ✓ Correct
   ```

2. **Build output** - Should succeed
   ```
   ✓ 2302 modules transformed
   ✓ built in 7.95s
   ```

3. **Port binding** - Server runs on 3000
   ```typescript
   const PORT = 3000;
   ```

4. **Environment vars** - All required vars set
   ```
   echo $VITE_SUPABASE_URL  # Should show URL
   ```

### Debug Commands

```bash
# View recent logs
railway logs -n 50

# Check deployment status
railway status

# Restart deployment
railway redeploy
```

---

## 💡 Best Practices Going Forward

### 1. **Always Include Health Checks**
- Prevents container orchestration failures
- Makes monitoring easier
- Alerts you to problems early

### 2. **Test Locally First**
```bash
npm run dev
curl http://localhost:3000/health
```

### 3. **Monitor Deployment Logs**
- Railway logs show what's happening
- Watch for errors during startup
- Check health check attempts

### 4. **Keep Backups**
- All code is in Git
- Can redeploy anytime
- Environment variables backed up locally

---

## 📚 Related Documentation

- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Full deployment instructions
- [ARCHITECTURE_GUIDE.md](ARCHITECTURE_GUIDE.md) - System design
- [QUICKSTART_SUPABASE_RAILWAY.md](QUICKSTART_SUPABASE_RAILWAY.md) - Quick start

---

## ✅ Confirmation Checklist

- [ ] Health endpoints added to server.ts
- [ ] railway.json updated with correct path
- [ ] Local build succeeds (`npm run build`)
- [ ] Changes committed to git
- [ ] Changes pushed to GitHub
- [ ] Redeployed on Railway
- [ ] Health check passes (11+ attempts → ✓ Healthy)
- [ ] Admin dashboard loads
- [ ] Real-time data working

---

## 🎉 You're Ready!

Your Railway deployment should now pass health checks and your application will be live!

If you need help:
1. Check the Railway dashboard logs
2. Verify environment variables are set
3. Run local tests with `npm run dev`
4. Check this guide for your specific issue

**Happy deploying!** 🚀
