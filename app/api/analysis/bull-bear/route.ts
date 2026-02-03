import { NextResponse } from 'next/server';

export const runtime = 'edge';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
const SITE_NAME = process.env.SITE_NAME || 'Legendary Investor';

interface BullBearRequest {
    symbol: string;
    type: 'portfolio' | 'watchlist';
    context?: string;
}

export async function POST(req: Request) {
    if (!OPENROUTER_API_KEY) {
        return NextResponse.json({ error: 'OpenRouter API Key missing' }, { status: 500 });
    }

    try {
        const { symbol, type, context } = await req.json() as BullBearRequest;

        const systemPrompt = `You are a team of legendary investors analyzing ${symbol}.

TASK: Generate BOTH a Bull Case and Bear Case for this stock${type === 'watchlist' ? ' (user is considering buying)' : ' (user currently holds)'}.

${context ? `CONTEXT: ${context}` : ''}

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

🐂 BULL CASE:
• [Key strength 1 - be specific with data/metrics if possible]
• [Key strength 2]
• [Catalyst or growth driver]
Price Target: $XXX (+XX%)
Conviction: X/10

🐻 BEAR CASE:
• [Key risk 1 - be specific]
• [Key risk 2]  
• [What could go wrong]
Price Target: $XXX (-XX%)
Conviction: X/10

⚖️ VERDICT: [STRONG BUY / BUY / HOLD / SELL] (XX% confidence)
One-liner: [Summarize in under 15 words]

Keep the analysis insightful but concise. Be specific, not generic.`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': SITE_URL,
                'X-Title': SITE_NAME,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'anthropic/claude-3.5-sonnet',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Analyze ${symbol} for a ${type === 'watchlist' ? 'potential buy' : 'current holding'}.` }
                ],
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const content = data.choices[0].message.content;

        // Parse verdict
        let verdict = 'HOLD';
        if (content.includes('STRONG BUY')) verdict = 'STRONG BUY';
        else if (content.includes('BUY')) verdict = 'BUY';
        else if (content.includes('SELL')) verdict = 'SELL';

        // Parse confidence
        let confidence = 50;
        const confidenceMatch = content.match(/(\d{1,3})%\s*confidence/i);
        if (confidenceMatch) {
            confidence = parseInt(confidenceMatch[1]);
        }

        return NextResponse.json({
            symbol,
            content,
            verdict,
            confidence,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('Bull/Bear API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
