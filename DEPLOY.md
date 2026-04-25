# 🚀 DEPLOYMENT GUIDE - Adaptive Learning System

## Quick Deploy to Render.com (FREE)

### Step 1: Prepare Your Files

You have these files:
- `server.js` - Backend server
- `package.json` - Dependencies  
- `student.html` - Student interface
- `teacher.html` - Teacher dashboard

### Step 2: Create GitHub Repository

1. Go to https://github.com
2. Click "New Repository"
3. Name it: `adaptive-learning-jis`
4. Make it **Public** (required for free tier)
5. Click "Create repository"

6. Upload your files:
   - Click "uploading an existing file"
   - Drag all 4 files (server.js, package.json, student.html, teacher.html)
   - Click "Commit changes"

### Step 3: Deploy to Render

1. Go to https://render.com
2. Click "Sign Up" (use GitHub account - easiest)
3. Click "New +" → "Web Service"
4. Click "Connect" next to your `adaptive-learning-jis` repository
5. Fill in:
   - **Name:** `jis-adaptive-learning`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** FREE
6. Click "Create Web Service"

### Step 4: Wait for Deployment

- Takes 2-3 minutes
- You'll see: "Your service is live 🎉"
- You get a URL like: `https://jis-adaptive-learning.onrender.com`

### Step 5: Share with Students

**Student URL:**
```
https://jis-adaptive-learning.onrender.com/student.html
```

**Teacher Dashboard:**
```
https://jis-adaptive-learning.onrender.com/teacher.html
```

---

## ✅ YOU'RE DONE!

Students can now:
- Open the student URL on ANY device
- Complete the adaptive quiz
- You see them LIVE on teacher dashboard

---

## 📱 How to Use

### For Students:
1. Open: `https://your-app.onrender.com/student.html`
2. Enter name, class, student ID
3. Start the adaptive quiz
4. System tracks everything automatically

### For Teacher (YOU):
1. Open: `https://your-app.onrender.com/teacher.html`
2. See ALL students in real-time grid
3. Click any student for detailed journey
4. Export reports anytime

---

## 🔧 Troubleshooting

### "Service is unavailable"
- Free tier sleeps after 15 min inactivity
- First visitor waits 30 seconds for wake-up
- Then works normally

### "WebSocket connection failed"
- Check if URL has `https://` (not `http://`)
- Render uses secure WebSocket (wss://)

### Students not appearing
- Make sure they registered (entered name/ID)
- Check teacher dashboard is refreshed
- Look at browser console (F12) for errors

---

## 💰 Cost

**100% FREE** with limitations:
- Sleeps after 15 min inactivity
- 750 hours/month free (enough for classroom use)
- Wakes up in 30 seconds when accessed

### Want 24/7 uptime?
Upgrade to paid tier ($7/month) - optional, not required!

---

## 🎯 Alternative: Railway.app (Also FREE)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Node.js and deploys
6. Done! Get your URL

---

## 📞 Support

If something doesn't work:
1. Check browser console (F12 → Console)
2. Check Render logs (in Render dashboard → Logs tab)
3. Verify all files uploaded correctly to GitHub

---

## 🎉 Success Checklist

- ✅ Files uploaded to GitHub
- ✅ Render service created and deployed
- ✅ Got your URL (https://....onrender.com)
- ✅ Student page loads
- ✅ Teacher dashboard loads
- ✅ Test with one student - appears on dashboard
- ✅ Share URL with class!

**READY TO TEACH! 🚀**
