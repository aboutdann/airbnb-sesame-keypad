# ⚡ Quick Deployment Guide

## 🎯 Goal: Deploy Backend to Render & Test with Mobile App

### ✅ What's Ready:
- ✅ All code committed to git
- ✅ Server configured for Render (binds to 0.0.0.0)
- ✅ Mobile app ready with API integration
- ✅ All dependencies installed

### 🚀 Quick Steps:

#### 1. Create GitHub Repo (2 minutes)
```bash
# Go to: https://github.com/new
# Create: airbnb-sesame-keypad (PUBLIC)
# Then run:
cd /Users/aboutdann/airbnb-sesame-keypad
git remote add origin https://github.com/YOUR_USERNAME/airbnb-sesame-keypad.git
git branch -M main
git push -u origin main
```

#### 2. Deploy to Render (5 minutes)

**Option A: Use Render Dashboard (Recommended)**
1. Go to: https://render.com
2. Sign up/Login (use GitHub)
3. Click: **"New +"** → **"Web Service"**
4. Connect GitHub → Select `airbnb-sesame-keypad`
5. Configure:
   - **Name**: `airbnb-sesame-keypad`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
6. Add Environment Variables (see below)
7. Click: **"Create Web Service"**

**Option B: Use Render API (Advanced)**
```bash
# You have Render API key: rnd_pQNpUB1CVUkLMAFGfQKJvu0mbHtT
# See render-api-deploy.sh for API deployment
```

#### 3. Environment Variables (CRITICAL)

Add these in Render Dashboard → Environment:

```
PORT=8080
NODE_ENV=production
ADMIN_PIN=123456
SESAME_API_KEY=KH_[your_actual_key]
SESAME_DEVICE_UUID=ca0001ce-36d0-08da-0b50-e4dbf29ee923
IGMS_CLIENT_ID=[your_client_id]
IGMS_CLIENT_SECRET=[your_client_secret]
KEPAD_URL=https://airbnb-sesame-keypad.onrender.com
IGMS_REDIRECT_URI=https://airbnb-sesame-keypad.onrender.com/auth/callback
MORNING_MESSAGE_HOUR=08
MORNING_MESSAGE_MINUTE=00
```

**⚠️ IMPORTANT**: Replace placeholder values with your real API keys!

#### 4. Wait for Deployment (3-5 minutes)
- Watch Render logs
- Wait for "Live" status
- Your URL: `https://airbnb-sesame-keypad.onrender.com`

#### 5. Test Backend
```bash
# Open in browser:
https://airbnb-sesame-keypad.onrender.com

# Test admin PIN:
# Enter: 123456
# Should see admin panel
```

#### 6. Update Mobile App (if needed)
The mobile app is already configured with:
```typescript
// mobile/src/services/api.ts
const API_BASE_URL = __DEV__
  ? 'http://localhost:8080'
  : 'https://airbnb-sesame-keypad.onrender.com'; // ✅ Already set!
```

If your Render URL is different, update it in `mobile/src/services/api.ts`

#### 7. Test Mobile App
```bash
cd mobile
npm run ios    # or npm run android
# App should connect to Render backend
```

### 🎉 Success Checklist:
- [ ] GitHub repo created and code pushed
- [ ] Render service shows "Live"
- [ ] Can access keypad at Render URL
- [ ] Admin PIN (123456) works
- [ ] Mobile app connects to Render backend
- [ ] All environment variables set

### 🐛 Troubleshooting:

**Build Fails:**
- Check Render logs
- Verify all env vars are set
- Ensure GitHub repo is PUBLIC

**Can't Connect:**
- Verify Render URL is correct
- Check CORS settings
- Ensure service is "Live"

**Mobile App Issues:**
- Update API URL in `mobile/src/services/api.ts`
- Check network connectivity
- Verify backend is running

### 📞 Need Help?
- Render Docs: https://render.com/docs
- Check `DEPLOYMENT.md` for detailed guide
- Check Render logs for errors

