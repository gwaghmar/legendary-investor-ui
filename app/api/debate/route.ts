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
        return NextResponse.json({ 
            error: 'OpenRouter API Key missing. Please add OPENROUTER_API_KEY to environment variables.' 
        }, { status: 500 });
    }

    try {
        const { topic, activeLegend, previousMessages, userMessage } = await req.json();

        // Add logging for debugging
        console.log('Debate API called with:', { topic, activeLegend, hasUserMessage: !!userMessage });

        // Fun personality prompts
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
                ragContext = docs.join('\n\n').slice(0, 1500);
            }
        } catch (e) {
            console.warn('RAG search failed:', e);
        }

        const systemPrompt = `${persona}

TOPIC: "${topic}"
${userMessage ? `\nUSER ASKS: "${userMessage}"` : ''}
${stockContext ? `\n📊 LIVE MARKET DATA & NEWS (PRIORITY!):\n${stockContext}` : ''}
${ragContext ? `\nSEC FILINGS & BALANCE SHEET CONTEXT:\n${ragContext}` : ''}

RULES:
1. You represent specific legendary investors. Be decisive.
2. CRITICAL: Use the LIVE numbers provided to justify your take.
3. If news or balance sheet data is present, react to it.
4. Output MUST be valid JSON only.

JSON STRUCTURE:
{
  "content": "Your message here (max 2 sentences, succinct, in character). Use (Source: X) for numbers.",
  "verdict": "BULLISH" | "BEARISH" | "NEUTRAL",
  "confidence": number (0-100),
  "citations": ["List specific sources used, e.g. 'Finnhub', '10-K'"]
}

Do not output markdown code blocks. Just the raw JSON.`;


        const messages: any[] = [
            { role: 'system', content: systemPrompt },
        ];

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
                temperature: 0.7,
                max_tokens: 250,
                response_format: { type: "json_object" }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenRouter API failed:', response.status, errorText);
            return NextResponse.json({ 
                error: `OpenRouter API failed: ${response.status}` 
            }, { status: response.status });
        }

        const data = await response.json();

        if (data.error) {
            console.error('OpenRouter returned error:', data.error);
            throw new Error(`OpenRouter: ${data.error.message || JSON.stringify(data.error)}`);
        }

        const rawContent = data.choices[0].message.content;

        // Parse JSON
        let parsed;
        try {
            const cleanJson = rawContent.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
            parsed = JSON.parse(cleanJson);
        } catch (e) {
            console.error("Failed to parse debate JSON", rawContent);
            parsed = {
                content: rawContent,
                verdict: 'NEUTRAL',
                confidence: 50,
                citations: []
            };
        }

        // Fallback checks
        if (!parsed.citations) parsed.citations = [];
        if (!parsed.confidence) parsed.confidence = 50;

        return NextResponse.json({
            content: parsed.content,
            verdict: parsed.verdict,
            confidence: parsed.confidence,
            citations: parsed.citations,
            legend: activeLegend
        });

    } catch (error: any) {
        console.error('Debate API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
