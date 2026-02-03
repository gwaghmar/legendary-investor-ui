import { NextResponse } from 'next/server';

export const runtime = 'edge';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
const SITE_NAME = process.env.SITE_NAME || 'Legendary Investor';

export async function POST(req: Request) {
    if (!OPENROUTER_API_KEY) {
        return NextResponse.json({ error: 'OpenRouter API Key missing' }, { status: 500 });
    }

    try {
        const { symbol, price } = await req.json();

        const systemPrompt = `You are a financial analyst using the frameworks of Buffett, Lynch, and Burry.
    Analyze the stock symbol: ${symbol} (Price: $${price || 'N/A'}).
    
    Output JSON ONLY:
    {
      "signal": "BUY" | "SELL" | "HOLD",
      "confidence": number (0-100),
      "oneLiner": "A short, punchy 10-word reason."
    }
    
    Be decisive and opinionated.`;

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
                    { role: 'user', content: `Analyze ${symbol}` }
                ],
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        const content = data.choices[0].message.content.trim().replace(/^```json\s*/, '').replace(/\s*```$/, '');
        const parsed = JSON.parse(content);

        return NextResponse.json(parsed);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
