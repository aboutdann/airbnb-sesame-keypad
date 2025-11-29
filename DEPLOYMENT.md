# 🚀 Deployment Guide - Airbnb Sesame Keypad

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `airbnb-sesame-keypad`
   - **Description**: `Airbnb guest door access keypad with Sesame smart lock integration`
   - **Visibility**: **PUBLIC** (required for Render free tier)
   - **DO NOT** check "Initialize this repository with..."
3. Click **"Create repository"**

## Step 2: Push Code to GitHub

After creating the repo, run these commands:

```bash
cd /Users/aboutdann/airbnb-sesame-keypad
git remote add origin https://github.com/YOUR_USERNAME/airbnb-sesame-keypad.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 3: Deploy to Render

1. Go to https://render.com
2. Sign up/Login
3. Click **"New +"** → **"Web Service"**
4. Click **"Connect account"** (GitHub)
5. Authorize Render to access GitHub
6. Select repository: **airbnb-sesame-keypad**
7. Click **"Connect"**

### Configure Deployment Settings:

- **Name**: `airbnb-sesame-keypad`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Region**: (leave default)
- **Plan**: `Free`

### Add Environment Variables:

Click **"Add Environment Variable"** for each:

```
PORT = 8080
NODE_ENV = production
ADMIN_PIN = 123456
SESAME_API_KEY = KH_[your_actual_sesame_key]
SESAME_DEVICE_UUID = ca0001ce-36d0-08da-0b50-e4dbf29ee923
IGMS_CLIENT_ID = [your_igms_client_id]
IGMS_CLIENT_SECRET = [your_igms_client_secret]
KEPAD_URL = https://airbnb-sesame-keypad.onrender.com
IGMS_REDIRECT_URI = https://airbnb-sesame-keypad.onrender.com/auth/callback
MORNING_MESSAGE_HOUR = 08
MORNING_MESSAGE_MINUTE = 00
```

**IMPORTANT**: 
- Replace `KH_[your_actual_sesame_key]` with your REAL Sesame API key
- Replace `[your_igms_client_id]` with your REAL iGMS Client ID
- Replace `[your_igms_client_secret]` with your REAL iGMS Client Secret
- Render will auto-fill your domain after first deployment

8. Click **"Create Web Service"**

Wait for deployment to complete (3-5 minutes). You'll see:
- Build starting...
- npm install running...
- Build complete
- Server starting...
- **Live** status (green)

## Step 4: Update Mobile App API URL

Once your Render URL is live (e.g., `https://airbnb-sesame-keypad.onrender.com`):

1. Update `mobile/src/services/api.ts`:

```typescript
const API_BASE_URL = __DEV__
  ? 'http://localhost:8080'  // Development
  : 'https://airbnb-sesame-keypad.onrender.com';  // Production - UPDATE THIS
```

2. Replace with your actual Render URL

## Step 5: Test the Deployment

1. Open your Render URL in browser
2. You should see the keypad UI
3. Enter PIN: `123456` (admin PIN)
4. Admin panel should appear
5. Test the mobile app - it should connect to your Render backend

## Step 6: Update iGMS (if using)

1. Go to iGMS Dashboard → Developer → Applications
2. Find your application
3. Click "Edit"
4. Update:
   - **App URL**: `https://airbnb-sesame-keypad.onrender.com`
   - **Redirect URI**: `https://airbnb-sesame-keypad.onrender.com/auth/callback`
5. Click "Save"

## ✅ Verification Checklist

- [ ] GitHub repository created and code pushed
- [ ] Render deployment shows "Live" status
- [ ] Can access https://your-render-url.onrender.com
- [ ] Admin PIN (123456) works
- [ ] All environment variables set in Render dashboard
- [ ] Mobile app API URL updated
- [ ] Mobile app can connect to Render backend
- [ ] iGMS application updated (if applicable)

## 🐛 Troubleshooting

### Render Build Fails
- Check Render logs for errors
- Verify all environment variables are set
- Ensure GitHub repo is public

### Mobile App Can't Connect
- Verify Render URL is correct in `api.ts`
- Check CORS settings in backend
- Ensure backend is "Live" on Render

### API Errors
- Check Render logs
- Verify environment variables
- Test API endpoints directly

## 📱 Next Steps

1. Set up iGMS webhook: `https://your-render-url.onrender.com/webhooks/igms`
2. Test webhook by creating a test reservation in iGMS
3. Check that PIN is generated and guest is notified
4. System is complete!

