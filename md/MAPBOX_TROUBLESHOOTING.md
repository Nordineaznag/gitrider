# Mapbox Troubleshooting Guide - Static Export Fix

## 🚨 Critical Issue: Static Export & Environment Variables

Your app is configured with `output: "export"` in `next.config.js`, which creates a **static HTML export**. This means environment variables must be available at **BUILD TIME**, not runtime.

---

## ✅ Solution 1: Rebuild with Environment Variable (RECOMMENDED)

### Step 1: Verify your `.env.local` file exists

Create or verify `project/.env.local` contains:

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbHh4eHh4eHh4In0.xxxxxxxxxx
```

**Important**: Replace with your actual Mapbox token (get it from https://account.mapbox.com/access-tokens/)

### Step 2: Delete the build cache

```bash
# Windows (Command Prompt)
rmdir /s /q .next
rmdir /s /q out

# Windows (PowerShell)
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force out

# macOS/Linux
rm -rf .next out
```

### Step 3: Rebuild the application

```bash
npm run build
```

**CRITICAL**: The `.env.local` file must exist BEFORE you run `npm run build`. The environment variable gets embedded into the JavaScript bundles during build.

### Step 4: Restart the development server

If using dev mode:
```bash
npm run dev
```

If using production build:
```bash
npx serve@latest out
```

---

## ✅ Solution 2: Use next.config.js for Hardcoded Token (Development Only)

⚠️ **WARNING**: Only for development/testing. Never commit tokens to Git!

Edit `next.config.js`:

```javascript
module.exports = {
  // ... existing config
  env: {
    APP_NAME: "Ride App",
    APP_VERSION: "2.0.0",
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: "pk.your_token_here", // Add this line
  },
}
```

Then rebuild:
```bash
npm run build
```

---

## ✅ Solution 3: Runtime Configuration (Advanced)

If you need runtime environment variables, you must **disable static export**.

### Step 1: Modify `next.config.js`

```javascript
const nextConfig = {
  // Remove or comment out this line:
  // output: "export",
  
  // Keep everything else the same...
}
```

### Step 2: Update deployment

Now your app requires a Node.js server. You can deploy to:
- Vercel (automatic)
- Netlify with Next.js plugin
- Your own Node.js server
- Docker container

### Step 3: Add environment variable to deployment platform

**Vercel**:
1. Go to Project Settings → Environment Variables
2. Add `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`

**Netlify**:
1. Site Settings → Build & Deploy → Environment
2. Add `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`

**Docker/VPS**:
```bash
export NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_token_here
npm start
```

---

## 🔍 How to Verify It's Working

### Method 1: Check Build Output

When you run `npm run build`, look for:
```
✓ Collecting page data
✓ Generating static pages
```

No errors about missing environment variables.

### Method 2: Inspect Built Files

After build, check `out/_next/static/chunks/` - your token should be embedded in the JavaScript (this is safe because it's a PUBLIC token starting with `pk.`).

### Method 3: Browser Console

Open Developer Tools → Console, and type:
```javascript
console.log(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN)
```

Should show your token (or at least the first part before it's used).

### Method 4: Test Map Demo Page

Visit: `http://localhost:3000/map-demo`

You should see:
- ✅ Green checkmark for "Mapbox Configuration"
- ✅ Interactive map loading
- ✅ No error messages

---

## 🐛 Common Issues & Fixes

### Issue 1: "Mapbox access token not configured"

**Cause**: Environment variable not available at build time

**Fix**:
1. Ensure `.env.local` exists with correct token
2. Delete `.next` and `out` folders
3. Rebuild: `npm run build`
4. Restart dev server: `npm run dev`

---

### Issue 2: "401 Unauthorized" in console

**Cause**: Invalid or expired token

**Fix**:
1. Go to https://account.mapbox.com/access-tokens/
2. Create a new token or verify existing one
3. Copy the FULL token (starts with `pk.`)
4. Update `.env.local`
5. Rebuild

---

### Issue 3: Changes to `.env.local` not taking effect

**Cause**: Build cache or dev server not restarted

**Fix**:
```bash
# Stop dev server (Ctrl+C)
# Delete build cache
rm -rf .next out
# Restart
npm run dev
```

---

### Issue 4: Works in dev but not in production build

**Cause**: Environment variable not in build environment

**Fix for local production testing**:
```bash
# Ensure .env.local exists
cat .env.local  # Should show your token

# Clean build
rm -rf .next out
npm run build

# Serve the production build
npx serve@latest out
```

**Fix for deployed production**:
- Add environment variable to your hosting platform
- Rebuild/redeploy

---

### Issue 5: Map shows but "keep require api" error

**Cause**: Token might be hitting rate limits or has restrictions

**Fix**:
1. Check Mapbox dashboard: https://account.mapbox.com/
2. Verify token scopes include:
   - `styles:tiles`
   - `styles:read`
   - `fonts:read`
   - `datasets:read`
3. Check URL restrictions - remove them for testing
4. Check if you've exceeded free tier (50,000 loads/month)
5. Create a new unrestricted token for testing

---

### Issue 6: Console shows "undefined" for token

**Cause**: Static export can't access environment variables at runtime

**Fix**: Rebuild is required! Environment variables in static exports are replaced at build time.

```bash
# This is the ONLY way to update env vars in static export:
rm -rf .next out
npm run build
npm run dev  # or: npx serve@latest out
```

---

## 📝 Quick Checklist

Use this checklist to debug your issue:

- [ ] `.env.local` file exists in project root
- [ ] `.env.local` contains `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk...`
- [ ] Token starts with `pk.` (public token)
- [ ] Token is valid (test at https://api.mapbox.com/styles/v1/mapbox/streets-v12?access_token=YOUR_TOKEN)
- [ ] Deleted `.next` folder
- [ ] Deleted `out` folder
- [ ] Ran `npm run build`
- [ ] Restarted dev server or rebuilt production
- [ ] No URL restrictions on token (for testing)
- [ ] Token has correct scopes enabled
- [ ] Not exceeding Mapbox free tier limits

---

## 🔐 Token Verification

Test your token directly:

```bash
# Replace YOUR_TOKEN with your actual token
curl "https://api.mapbox.com/styles/v1/mapbox/streets-v12?access_token=YOUR_TOKEN"
```

If valid, you'll get JSON response. If invalid, you'll get 401 error.

Or visit in browser:
```
https://api.mapbox.com/geocoding/v5/mapbox.places/new%20york.json?access_token=YOUR_TOKEN
```

Should show geocoding results for "new york".

---

## 📊 Understanding Static Export

With `output: "export"`:

```javascript
// Build time (npm run build):
process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN = "pk.abc123..."
↓
// Gets replaced with literal value in JavaScript:
const token = "pk.abc123...";
↓
// Runtime (browser):
const token = "pk.abc123..."; // Hardcoded value
```

Without static export:

```javascript
// Runtime (server-side or client-side):
const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
// Token read from environment at runtime
```

**Key Takeaway**: Static export = rebuild required for any env var changes!

---

## 🚀 Production Deployment Guide

### For Static Export (Current Setup)

**Build Command**:
```bash
npm run build
```

**Output Directory**: `out/`

**Deployment Targets**:
- GitHub Pages
- Netlify (static site)
- Vercel (static)
- AWS S3 + CloudFront
- Any static hosting

**Environment Variables**:
- Must be set in build environment
- Cannot be changed without rebuild

**Vercel Example**:
1. Settings → Environment Variables
2. Add `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
3. Add to: Production, Preview, Development
4. Redeploy

**Netlify Example**:
1. Site settings → Build & deploy → Environment
2. Add variable
3. Clear cache and redeploy

---

### For Server-Side (If You Switch)

Remove `output: "export"` from `next.config.js`

**Build Command**:
```bash
npm run build
npm start
```

**Benefits**:
- Runtime environment variables
- API routes work
- Server-side rendering
- Better SEO

**Drawbacks**:
- Requires Node.js server
- Slightly more expensive hosting
- More complex deployment

---

## 🆘 Still Not Working?

### Check Browser Console

Open DevTools (F12) → Console tab

Look for errors:
```
❌ Failed to initialize map
❌ 401 Unauthorized
❌ Token is required
❌ Access token not configured
```

### Check Network Tab

Open DevTools (F12) → Network tab

Filter by "mapbox"

Look for:
- ✅ 200 status = Working
- ❌ 401 status = Invalid token
- ❌ 403 status = Token restrictions
- ❌ 429 status = Rate limit exceeded

### Enable Debug Logging

Add to your map component:

```javascript
console.log('Token:', process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.substring(0, 10) + '...');
console.log('Token length:', process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.length);
```

Should show:
```
Token: pk.eyJ1Iio...
Token length: 120+ characters
```

If shows:
```
Token: undefined
Token length: undefined
```

→ Token not embedded at build time! Rebuild required!

---

## 🎯 The Most Common Mistake

**❌ WRONG**: Updating `.env.local` and just refreshing browser

**✅ CORRECT**: Updating `.env.local`, deleting build cache, rebuilding

```bash
# Every time you change .env.local:
rm -rf .next out
npm run build
npm run dev
```

---

## 📞 Need More Help?

1. **Check Mapbox Status**: https://status.mapbox.com/
2. **Mapbox Support**: https://support.mapbox.com/
3. **Check Token**: https://account.mapbox.com/access-tokens/
4. **API Usage**: https://account.mapbox.com/ (check if over quota)

---

## 🔑 Quick Test Token Setup

For immediate testing, try this:

1. **Get token**: Visit https://account.mapbox.com/access-tokens/
2. **Copy default public token** (already created for you)
3. **Create `.env.local`**:
   ```bash
   echo NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.YOUR_TOKEN_HERE > .env.local
   ```
4. **Clean and rebuild**:
   ```bash
   npm run clean  # or: rm -rf .next out
   npm run build
   npm run dev
   ```
5. **Test**: Visit http://localhost:3000/map-demo

Should work immediately!

---

## 📌 Summary

**For Static Export Apps (your current setup)**:

1. Environment variables are **baked into the build**
2. Must rebuild after ANY `.env.local` changes
3. Token gets embedded in JavaScript bundles
4. This is safe because Mapbox tokens are PUBLIC (start with `pk.`)
5. Clean build cache before rebuilding

**The Fix**:
```bash
rm -rf .next out && npm run build && npm run dev
```

**Remember**: Static export = Rebuild required for env changes! 🔄

---

**Last Updated**: 2024
**Issue**: Map requires API key even though configured
**Root Cause**: Static export requires rebuild for env var changes
**Solution**: Clean cache → Rebuild → Restart server