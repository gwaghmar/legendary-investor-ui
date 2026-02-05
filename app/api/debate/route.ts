import { NextResponse } from 'next/server';
import { getPineconeIndex } from '@/lib/pinecone';
import { getStockData, formatStockContext } from '@/lib/finnhub';

export const runtime = 'nodejs'; // Use Node runtime for Pinecone

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
const SITE_NAME = process.env.SITE_NAME || 'Legendary Investor';

// Simple text embedding (matching ingestion)
function generateSimpleEmbedding(text: string): number[] {
    const vector = new Array(1536).fill(0);
    const words = text.toLowerCase().split(/\s+/);

    words.forEach((word, idx) => {
        for (let i = 0; i < word.length; i++) {
            const hash = (word.charCodeAt(i) * 31 + idx) % 1536;
            vector[hash] = Math.min(1, vector[hash] + 0.1);
        }
    });

    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? vector.map(v => v / magnitude) : vector;
}

export async function POST(req: Request) {
    if (!OPENROUTER_API_KEY) {
        return NextResponse.json({ error: 'OpenRouter API Key missing' }, { status: 500 });
    }

    try {
        const { topic, activeLegend, previousMessages, userMessage } = await req.json();

        // Fun personality prompts - short and punchy!
        const PERSONALITIES: Record<string, string> = {
            'buffett': `You are Warren Buffett. Folksy midwestern grandpa vibes. Love value investing, hate crypto. Use simple metaphors. Say things like "Be fearful when others are greedy." Keep it warm but wise.`,
            'munger': `You are Charlie Munger. Brutally honest curmudgeon. One-liners that sting. Hate stupidity, love mental models. Say things like "I have nothing to add" or call things "idiotic." Short and savage.`,
            'burry': `You are Michael Burry. Paranoid genius who sees crashes everywhere. Dark humor. Reference "The Big Short" or 2008. Always worried about bubbles. Cryptic but smart.`,
            'druckenmiller': `You are Stan Druckenmiller. Macro trader who follows the money. Talk about the Fed, liquidity, currencies. Aggressive and confident. "Bet big when you're right."`,
            'lynch': `You are Peter Lynch. Optimistic regular guy investor. "Buy what you know." Talk about checking stores, products you use. PEG ratios. Friendly and accessible.`,
            'greenblatt': `You are Joel Greenblatt. Magic Formula inventor. Love high earnings yield + high ROIC. Academic but practical. Numbers-focused.`,
            'klarman': `You are Seth Klarman. Value investor who loves margin of safety. Patient, careful, contrarian. Hate momentum investing. Thoughtful and measured.`,
        };

        const persona = PERSONALITIES[activeLegend] || 'You are a legendary investor with strong opinions.';

        // FETCH REAL-TIME STOCK DATA
        let stockContext = '';
        try {
            // Extract stock symbol from topic or user message (e.g., "AAPL", "Apple stock", "$TSLA")
            const searchSource = `${topic} ${userMessage || ''}`;
            const symbolMatch = searchSource.match(/\$?([A-Z]{1,5})(?:\s|$)/i) ||
                searchSource.match(/(?:stock|shares?|ticker)\s*:?\s*([A-Z]{1,5})/i);

            if (symbolMatch) {
                const symbol = symbolMatch[1].toUpperCase();
                const stockData = await getStockData(symbol);
                stockContext = formatStockContext(stockData);
            }
        } catch (e) {
            console.warn('Stock data fetch failed:', e);
        }

        // RAG SEARCH
        let ragContext = '';
        try {
            const index = await getPineconeIndex();
            // Search for context using user message + topic
            const queryVector = generateSimpleEmbedding(topic + ' ' + (userMessage || ''));
            const searchResults = await index.query({
                vector: queryVector,
                topK: 2,
                includeMetadata: true
            });

            if (searchResults.matches && searchResults.matches.length > 0) {
                const docs = searchResults.matches.map(match =>
                    `SOURCE (${(match.metadata as any)?.filingType} - ${(match.metadata as any)?.filingDate}):\n${(match.metadata as any)?.content}`
                );
                ragContext = docs.join('\n\n').slice(0, 1500); // Limit context length
            }
        } catch (e) {
            console.warn('RAG search failed:', e);
            // Continue without RAG if Pinecone fails (e.g. invalid key)
        }

        // Simple, effective prompt with LIVE STOCK DATA + RAG context
        const systemPrompt = `${persona}

TOPIC: "${topic}"
${userMessage ? `\nUSER ASKS: "${userMessage}"` : ''}
${stockContext ? `\n📊 LIVE MARKET DATA & NEWS (PRIORITY!):\n${stockContext}` : ''}
${ragContext ? `\nSEC FILINGS & BALANCE SHEET CONTEXT:\n${ragContext}` : ''}

RULES:
1. Reply in 1-2 SHORT sentences max (under 180 characters!)
2. Sound like YOU - use your personality and catchphrases
3. Give your actual opinion (bullish/bearish/neutral) - be decisive!
4. CRITICAL: Use the LIVE numbers (price, P/E, margins, news) to justify your take.
5. If news or balance sheet data is present, react to it - don't just use old knowledge.
6. NO links, NO URLs, NO sources, NO website mentions
7. NO emojis at the start of sentences
8. React to what the user asked if there's a question
9. Be entertaining and memorable!
10. NEVER mention "Legendary Investor", "website", "site", or any platform name

Just give your quick take. No intro, no "I think" - just say it.`;


        const messages: any[] = [
            { role: 'system', content: systemPrompt },
        ];

        // Add last few messages for context
        if (previousMessages && previousMessages.length > 0) {
            messages.push(...previousMessages.slice(-3));
        }

        if (userMessage) {
            messages.push({ role: 'user', content: userMessage });
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': SITE_URL,
                'X-Title': SITE_NAME,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-001',
                messages,
                temperature: 0.9, // More creative/fun
                max_tokens: 150, // Keep it SHORT
            }),
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const rawContent = data.choices[0].message.content;

        // Clean any website/URL mentions that slip through
        const content = rawContent
            .replace(/legendary\s*investor/gi, '')
            .replace(/https?:\/\/[^\s]+/gi, '')
            .replace(/www\.[^\s]+/gi, '')
            .replace(/\bwebsite\b/gi, '')
            .replace(/\bsite\b/gi, '')
            .replace(/localhost:[0-9]+/gi, '')
            .replace(/\s{2,}/g, ' ')
            .trim();

        // Simple verdict detection
        let verdict: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';
        const lower = content.toLowerCase();
        if (lower.includes('buy') || lower.includes('bullish') || lower.includes('love') || lower.includes('great')) {
            verdict = 'BULLISH';
        } else if (lower.includes('sell') || lower.includes('bearish') || lower.includes('avoid') || lower.includes('hate') || lower.includes('crash')) {
            verdict = 'BEARISH';
        }

        return NextResponse.json({
            content,
            verdict,
            legend: activeLegend
        });

    } catch (error: any) {
        console.error('Debate API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
