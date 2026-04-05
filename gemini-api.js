/**
 * Google Gemini API Integration Module
 * Provides intelligent AI responses with fallback to local knowledge base
 */

class GeminiAPI {
    constructor(apiKey = null, useBackend = false) {
        // API Configuration
        this.apiKey = apiKey;
        this.useBackend = useBackend;
        this.backendUrl = '/api/chat'; // Change if backend runs on different port
        this.model = 'gemini-1.5-flash';
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        
        // Rate limiting
        this.requestCount = 0;
        this.requestLimit = 30; // requests per minute
        this.lastResetTime = Date.now();
        
        // Cache for responses
        this.responseCache = {};
        this.maxCacheSize = 50;
        
        // Context window
        this.conversationHistory = [];
        this.maxHistoryLength = 10;
    }

    /**
     * Check if API key is configured
     */
    isConfigured() {
        return !!this.apiKey || this.useBackend;
    }

    /**
     * Rate limiting check
     */
    checkRateLimit() {
        const now = Date.now();
        if (now - this.lastResetTime > 60000) {
            this.requestCount = 0;
            this.lastResetTime = now;
        }
        
        if (this.requestCount >= this.requestLimit) {
            console.warn('Rate limit exceeded');
            return false;
        }
        
        this.requestCount++;
        return true;
    }

    /**
     * Add to conversation history for context
     */
    addToHistory(role, content) {
        this.conversationHistory.push({ role, content });
        
        // Keep only last N messages
        if (this.conversationHistory.length > this.maxHistoryLength) {
            this.conversationHistory.shift();
        }
    }

    /**
     * Build context from history
     */
    buildContext() {
        return this.conversationHistory
            .map(msg => `${msg.role}: ${msg.content}`)
            .join('\n');
    }

    /**
     * Get cached response if available
     */
    getCachedResponse(userInput) {
        const hash = this.hashInput(userInput);
        return this.responseCache[hash] || null;
    }

    /**
     * Cache response
     */
    cacheResponse(userInput, response) {
        const hash = this.hashInput(userInput);
        this.responseCache[hash] = response;
        
        // Simple cache eviction (FIFO)
        if (Object.keys(this.responseCache).length > this.maxCacheSize) {
            const firstKey = Object.keys(this.responseCache)[0];
            delete this.responseCache[firstKey];
        }
    }

    /**
     * Simple hash function for caching
     */
    hashInput(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return 'h' + Math.abs(hash);
    }

    /**
     * Send request through backend (recommended for security)
     */
    async sendThroughBackend(userInput) {
        try {
            const response = await fetch(this.backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userInput,
                    history: this.conversationHistory
                })
            });

            if (!response.ok) {
                throw new Error(`Backend error: ${response.status}`);
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Backend request failed:', error);
            return null;
        }
    }

    /**
     * Send request directly to Gemini API (client-side)
     */
    async sendDirectAPI(userInput) {
        try {
            if (!this.apiKey) {
                throw new Error('API key not configured');
            }

            if (!this.checkRateLimit()) {
                return null;
            }

            // Check cache first
            const cached = this.getCachedResponse(userInput);
            if (cached) {
                console.log('Using cached response');
                return cached;
            }

            // Build system prompt with context
            const systemPrompt = `You are Saturnino Jusay's portfolio AI assistant. You represent a BSIT student from Golden Success College – Cebu Campus who is a full-stack web developer.

Your knowledge:
- Name: Saturnino Jusay
- Location: Cebu City, Philippines
- Email: ninojusay2@gmail.com
- Main Skills: ASP.NET MVC, C#, Angular, Node.js, MySQL, MSSQL, WordPress
- Capstone: Online Teacher Evaluation System (ASP.NET MVC, C#, Entity Framework, MSSQL)
- Experience: Full-stack development, WordPress, graphic design

Be friendly, professional, concise, and helpful. If asked about things outside your knowledge, politely redirect to portfolio topics or suggest contacting directly.`;

            const payload = {
                contents: [
                    {
                        parts: [
                            {
                                text: systemPrompt
                            }
                        ]
                    },
                    {
                        parts: [
                            {
                                text: userInput
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 200
                }
            };

            const fullUrl = `${this.apiEndpoint}?key=${this.apiKey}`;
            
            const response = await fetch(fullUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates.length > 0) {
                const textContent = data.candidates[0].content.parts[0].text;
                this.cacheResponse(userInput, textContent);
                this.addToHistory('assistant', textContent);
                return textContent;
            }

            return null;
        } catch (error) {
            console.error('Gemini API error:', error);
            return null;
        }
    }

    /**
     * Main chat method with fallback logic
     */
    async chat(userInput) {
        try {
            this.addToHistory('user', userInput);

            // Try backend first if configured
            if (this.useBackend) {
                const response = await this.sendThroughBackend(userInput);
                if (response) return response;
                console.log('Backend failed, trying direct API...');
            }

            // Try direct API if key is available
            if (this.apiKey) {
                const response = await this.sendDirectAPI(userInput);
                if (response) return response;
                console.log('Direct API failed, check API key or quota');
            }

            // Return null to trigger fallback in main chatbot
            return null;
        } catch (error) {
            console.error('Chat error:', error);
            return null;
        }
    }

    /**
     * Set API key (securely pass from environment)
     */
    setApiKey(key) {
        this.apiKey = key;
    }

    /**
     * Enable/disable backend mode
     */
    setBackendMode(enabled, backendUrl = null) {
        this.useBackend = enabled;
        if (backendUrl) {
            this.backendUrl = backendUrl;
        }
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
    }

    /**
     * Clear response cache
     */
    clearCache() {
        this.responseCache = {};
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeminiAPI;
}
