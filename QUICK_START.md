# 🚀 Quick Start - Gemini AI Chatbot

## 30-Second Setup

### Option 1: Frontend Only (Fastest)
```javascript
// In index.html, find this line:
chatbot.initializeGemini('YOUR_GEMINI_API_KEY_HERE');

// Replace with your actual key from:
// https://aistudio.google.com/app/apikey
chatbot.initializeGemini('AIzaSyD...');
```

Done! Refresh and test. 🎉

---

### Option 2: Backend Proxy (Secure)
```bash
# 1. Install dependencies
npm install

# 2. Create .env file with your API key
GEMINI_API_KEY=your_key_here

# 3. Start server
node server.js

# 4. Update index.html
chatbot.initializeGemini(null, true);
```

Done! Server running on port 3000. 🎉

---

## Test Commands

```bash
# Check if backend is running
curl http://localhost:3000/api/health

# Check if API key is set
echo $GEMINI_API_KEY
```

---

## Files Included

| File | Purpose |
|------|---------|
| `gemini-api.js` | Gemini API wrapper with caching & rate limiting |
| `chatbot.js` | Updated to support AI responses + fallback |
| `server.js` | Node.js backend proxy (optional) |
| `package.json` | npm dependencies |
| `.env.example` | Environment variables template |
| `CHATBOT_SETUP.md` | Full documentation |

---

## Key Features

✅ **Intelligent Responses** - Real AI via Gemini  
✅ **Fallback Logic** - Works without AI  
✅ **Rate Limiting** - Prevents abuse  
✅ **Response Caching** - Faster repeats  
✅ **Conversation History** - Better context  
✅ **Secure** - Backend hides API key  

---

## Get API Key

1. https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy & paste into chatbot

Free tier: 60 requests/min, 1,500/day

---

## Troubleshooting

❌ **Chatbot showing local responses?**  
→ Check browser console (F12) for errors  
→ Verify API key is correct  
→ Test key at https://aistudio.google.com/

❌ **Backend not connecting?**  
→ Run `node server.js` in terminal  
→ Check .env file has GEMINI_API_KEY  
→ Test with `curl http://localhost:3000/api/health`

---

## Deploy

**GitHub Pages:** Add API key to index.html, push to GitHub  
**Heroku:** Deploy backend, update frontend URL

See `CHATBOT_SETUP.md` for detailed instructions.

---

## Support Files

- `CHATBOT_SETUP.md` - Full setup guide  
- `.env.example` - Configuration template  
- This file - Quick reference  

Ready to chat? 🤖
