/**
 * Backend API Proxy Server for Chatbot
 * Handles Gemini API requests securely (API key hidden)
 * 
 * Setup:
 * 1. npm install express cors dotenv body-parser
 * 2. Create .env file with: GEMINI_API_KEY=your_key_here
 * 3. node server.js
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Gemini API endpoint
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Rate limiting storage
const rateLimits = {};
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_REQUESTS = 30;

/**
 * Rate limiting middleware
 */
function checkRateLimit(clientId) {
    const now = Date.now();
    
    if (!rateLimits[clientId]) {
        rateLimits[clientId] = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
    }
    
    const limit = rateLimits[clientId];
    
    if (now > limit.resetTime) {
        limit.count = 0;
        limit.resetTime = now + RATE_LIMIT_WINDOW;
    }
    
    if (limit.count >= RATE_LIMIT_REQUESTS) {
        return false;
    }
    
    limit.count++;
    return true;
}

/**
 * Chat endpoint
 */
app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        const clientId = req.ip; // Simple client identification
        
        // Check rate limit
        if (!checkRateLimit(clientId)) {
            return res.status(429).json({
                error: 'Rate limit exceeded',
                message: 'Too many requests. Please try again later.'
            });
        }
        
        // Validate input
        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Message is required'
            });
        }
        
        if (!GEMINI_API_KEY) {
            return res.status(500).json({
                error: 'Server configuration error',
                message: 'API key not configured'
            });
        }
        
        // Build system prompt
        const systemPrompt = `You are Saturnino Jusay's portfolio AI assistant. You represent a BSIT student from Golden Success College – Cebu Campus who is a full-stack web developer.

Your knowledge:
- Name: Saturnino Jusay
- Location: Cebu City, Philippines
- Email: ninojusay2@gmail.com
- Main Skills: ASP.NET MVC, C#, Angular, Node.js, MySQL, MSSQL, WordPress
- Capstone: Online Teacher Evaluation System (ASP.NET MVC, C#, Entity Framework, MSSQL)
- Experience: Full-stack development, WordPress, graphic design

Be friendly, professional, concise, and helpful. Keep responses under 200 words. If asked about things outside your knowledge, politely redirect to portfolio topics or suggest contacting directly at ninojusay2@gmail.com.`;

        // Build request payload
        const contents = [
            {
                parts: [{ text: systemPrompt }]
            }
        ];
        
        // Add conversation history for context
        if (Array.isArray(history) && history.length > 0) {
            history.slice(-5).forEach(msg => {
                contents.push({
                    parts: [{ text: `${msg.role}: ${msg.content}` }]
                });
            });
        }
        
        // Add current message
        contents.push({
            parts: [{ text: message }]
        });
        
        const payload = {
            contents: contents,
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 200
            }
        };
        
        // Call Gemini API
        const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API error:', errorData);
            
            return res.status(response.status).json({
                error: 'Gemini API error',
                message: errorData.error?.message || 'Failed to get AI response'
            });
        }
        
        const data = await response.json();
        
        if (!data.candidates || data.candidates.length === 0) {
            return res.status(500).json({
                error: 'No response from AI',
                message: 'AI did not return a valid response'
            });
        }
        
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        res.json({
            response: aiResponse,
            success: true
        });
        
    } catch (error) {
        console.error('Chat endpoint error:', error);
        
        res.status(500).json({
            error: 'Server error',
            message: 'An error occurred while processing your request'
        });
    }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'API server is running',
        timestamp: new Date().toISOString()
    });
});

/**
 * Info endpoint
 */
app.get('/api/info', (req, res) => {
    res.json({
        name: 'Saturnino Jusay - Chatbot Backend',
        version: '1.0.0',
        description: 'Secure backend proxy for Gemini AI chatbot',
        endpoints: {
            chat: 'POST /api/chat',
            health: 'GET /api/health',
            info: 'GET /api/info'
        }
    });
});

/**
 * Error handling
 */
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
});

/**
 * Start server
 */
app.listen(PORT, () => {
    console.log(`🚀 Chatbot backend server running on port ${PORT}`);
    console.log(`📝 Gemini API configured: ${GEMINI_API_KEY ? 'Yes ✓' : 'No ✗'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    console.log(`💬 Chat endpoint: POST http://localhost:${PORT}/api/chat`);
});

module.exports = app;
