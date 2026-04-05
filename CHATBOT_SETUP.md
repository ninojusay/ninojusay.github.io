# 🤖 Saturnino's AI Chatbot - Setup Guide

## Overview

Your portfolio now has an intelligent AI chatbot powered by Google Gemini API! The chatbot can:

- ✅ Answer questions about your projects, skills, and experience
- ✅ Provide context-aware conversational responses
- ✅ Fall back to local knowledge base if API is unavailable
- ✅ Cache responses for better performance
- ✅ Support conversation history for context

---

## 🚀 Quick Start (Two Options)

### Option 1: Frontend-Only (Simple, No Backend)

1. **Get a Gemini API Key**
   - Go to: https://aistudio.google.com/app/apikey
   - Click "Create API Key"
   - Copy your key

2. **Add to index.html**
   - Open `index.html`
   - Find the line with: `// chatbot.initializeGemini('YOUR_GEMINI_API_KEY_HERE');`
   - Replace with: `chatbot.initializeGemini('YOUR_ACTUAL_KEY_HERE');`
   - Example:
     ```javascript
     chatbot.initializeGemini('AIzaSyD...');
     ```

3. **Test It**
   - Open your portfolio in browser
   - Click the 🤖 button
   - Ask a question!

**⚠️ Security Note:** API key will be visible in browser. Use Option 2 for production.

---

### Option 2: Backend Proxy (Recommended for Production)

This keeps your API key secure on the backend server.

#### Step 1: Install Dependencies

```bash
npm install express cors dotenv body-parser
```

#### Step 2: Create `.env` File

Create a file named `.env` in your project root:

```
GEMINI_API_KEY=YOUR_ACTUAL_KEY_HERE
PORT=3000
```

#### Step 3: Start Backend Server

```bash
node server.js
```

Output should show:
```
🚀 Chatbot backend server running on port 3000
📝 Gemini API configured: Yes ✓
```

#### Step 4: Enable Backend Mode in Chatbot

In `index.html`, find the initialization section and add:

```javascript
// Enable backend mode
chatbot.initializeGemini(null, true); // null = no client-side key, true = use backend
```

#### Step 5: Test

- Open http://localhost:3000/api/health
- Should return: `{"status":"ok","message":"API server is running"}`

---

## 📊 File Structure

```
your-portfolio/
├── index.html          (Main portfolio - includes chatbot UI)
├── chatbot.js          (Intelligent chatbot agent)
├── gemini-api.js       (Gemini API wrapper)
├── server.js           (Backend proxy - OPTIONAL)
├── .env                (Environment variables - OPTIONAL)
└── other files...
```

---

## 🔑 Getting Your Gemini API Key

1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key
5. Keep it secret! 🔐

**Free Tier:** 
- 60 requests per minute
- 1,500 requests per day

---

## 🎯 Chatbot Features

### Intent Detection
The chatbot recognizes and responds to:
- 💼 **Projects** - Ask about capstone, WordPress, Angular, Node.js
- 🛠️ **Skills** - Tech stack, expertise, proficiency
- 🤝 **Hiring** - Collaboration, job opportunities
- 📞 **Contact** - Email, social media, getting in touch
- 🚀 **Services** - What you offer
- 🎓 **Background** - Education, experience
- 🔧 **Technology** - Specific tech questions

### Smart Features
- ✅ **Context Awareness** - Remembers previous messages
- ✅ **Response Caching** - Faster repeated responses
- ✅ **Rate Limiting** - Prevents API abuse
- ✅ **Fallback Logic** - Works even if API fails
- ✅ **Auto-scroll** - Smooth chat scrolling
- ✅ **Loading Indicator** - "Thinking..." message

---

## 🔧 Configuration

### Chatbot.js Options

```javascript
// Initialize with Gemini API (frontend)
chatbot.initializeGemini('YOUR_API_KEY');

// Initialize with backend proxy
chatbot.initializeGemini(null, true);

// Use local knowledge base only (no AI)
const chatbot = new ChatbotAgent();
```

### Gemini API Options

```javascript
const geminiAPI = new GeminiAPI(
    'YOUR_API_KEY',  // API key (or null for backend mode)
    false            // useBackend (true/false)
);

// Set backend URL (if not default)
geminiAPI.setBackendMode(true, 'http://your-backend.com/api/chat');

// Clear conversation history
geminiAPI.clearHistory();

// Clear response cache
geminiAPI.clearCache();
```

---

## 📝 Conversation History

The chatbot maintains conversation history for better context:

```javascript
// Max 10 messages in history
// Automatically cleared after each session
// Can be manually cleared:
chatbot.geminiAPI.clearHistory();
```

---

## 🐛 Troubleshooting

### Chatbot not responding?

1. **Check API Key**
   ```javascript
   console.log(chatbot.geminiAPI.isConfigured());
   ```

2. **Check Browser Console**
   - Right-click → Inspect → Console tab
   - Look for error messages

3. **Test Gemini API directly**
   - https://aistudio.google.com/

### Backend server not working?

1. **Check if running**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Check logs**
   - Look at terminal output from `node server.js`

3. **Verify .env file**
   - Make sure `.env` is in project root
   - Has `GEMINI_API_KEY=your_key`
   - No spaces around `=`

### Rate limit exceeded?

- Wait 1 minute (rate resets)
- Or upgrade Gemini API plan

### Still using local responses instead of AI?

- Check browser console for errors
- Verify API key is valid
- Test with simple question first

---

## 🚀 Deploy to Production

### With GitHub Pages (No Backend)

1. Add API key to index.html
2. Push to GitHub
3. Enable GitHub Pages in settings
4. Done! 🎉

**⚠️ Note:** API key will be visible. Consider Option 2.

### With Heroku (Backend + Frontend)

1. Deploy backend to Heroku
2. Update chatbot initialization URL
3. Deploy frontend to GitHub Pages
4. Done! 🎉

**Steps:**

```bash
# Create Heroku app
heroku create your-app-name

# Add environment variable
heroku config:set GEMINI_API_KEY=your_key

# Deploy
git push heroku main

# Get backend URL (something like https://your-app-name.herokuapp.com)

# Update index.html with backend URL
```

---

## 📊 Performance Tips

1. **Use Backend Proxy** - More secure and faster
2. **Cache Responses** - Already enabled
3. **Limit History** - Default is 10 messages
4. **Rate Limiting** - Default 30 requests/minute

---

## 🔒 Security Best Practices

✅ **Do:**
- Use `.env` file for API keys
- Use backend proxy for production
- Add authentication if backend is public
- Keep API key secret

❌ **Don't:**
- Commit `.env` to Git
- Expose API key in code
- Use API key in frontend (unless frontend-only)
- Share API key publicly

---

## 📞 Support

If you have issues:

1. Check troubleshooting section above
2. Review browser console for errors
3. Test Gemini API at https://aistudio.google.com/
4. Check rate limits on API dashboard

---

## 📚 Resources

- **Gemini API Docs:** https://ai.google.dev/
- **Google AI Studio:** https://aistudio.google.com/
- **Express.js Docs:** https://expressjs.com/
- **CORS Guide:** https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

## 🎉 You're All Set!

Your chatbot is now powered by Google's Gemini AI! 

Try asking it:
- "Tell me about your capstone project"
- "What technologies do you work with?"
- "How can I hire you?"
- "What's your experience?"

Enjoy! 🚀
