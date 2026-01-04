# Deployment Fix Guide

The `ChunkLoadError` and `404` errors you are seeing on the deployed site (`darkgray-squirrel-611553...`) are typically caused by one of two things:
1. **Running in Development Mode (`npm run dev`) on the server**, which is unstable for public access.
2. **Uploading the local `.next` folder** to the server, which causes conflicts because Windows builds don't work on Linux servers.

## Step 1: Fix Environment Variables on Server

**Do NOT** upload your local `.env` file directly if it contains `AUTH_URL=http://192.168...` because that will break the server.

On your **Hostinger Server** (File Manager or Environment Variables settings), ensure your `.env` has:

```ini
# Database (Same as local, with the fix we just made)
DATABASE_URL="mysql://u511174624_edschool_pk:7Os%3AC%2B%3AW@srv2024.hstgr.io:3306/u511174624_edschool_pk"

# Auth (MUST be the domain name for production)
AUTH_URL="https://darkgray-squirrel-611553.hostingersite.com"
AUTH_TRUST_HOST=true
AUTH_SECRET="iqIbYGUITjaYGS/0kx68Ml1GH/wiRxvIng44ORg3GEk="

# SMTP
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@edschool.pk
SMTP_PASS=Bd8X|S0b
SMTP_FROM_EMAIL=info@edschool.pk
```

## Step 2: Clean and Rebuild

If you have terminal access on Hostinger (or via SSH), run these commands to create a fresh production build:

```bash
# 1. Stop the current server (Ctrl+C)

# 2. Remove the existing build folder (to clear cache issues)
rm -rf .next

# 3. Install dependencies (just in case)
npm install

# 4. Build for production (This creates the static files)
npm run build

# 5. Start the production server
npm start
```

## Step 3: Verify Startup Command

If you are using Hostinger's "Node.js Application" feature:
1.  Go to the Node.js settings.
2.  Start Command: `npm start` (instead of `npm run dev`).
3.  Click **Restart**.

This will ensure your users get the stable, built version of the site and eliminate the `ChunkLoadError`.
