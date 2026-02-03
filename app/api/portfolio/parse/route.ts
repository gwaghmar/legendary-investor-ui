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
        const { transcript } = await req.json();

        if (!transcript) {
            return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
        }

        const systemPrompt = `You are a financial portfolio parser. 
    Your goal is to extract stock symbols and share counts from a natural language transcript.
    
    Rules:
    1. Identify stock symbols (e.g., "Apple" -> AAPL, "Google" -> GOOGL).
    2. Identify share quantities (e.g., "ten shares", "100").
    3. If no quantity is specified, assume 1.
    4. Return ONLY a valid JSON object with a "holdings" array.
    5. No markdown fencing (no \`\`\`json). Just the raw object.
    6. If the input is gibberish or has no stocks, return { "holdings": [] }.

    Example Input: "I have 10 shares of Apple and 50 of Microsoft"
    Example Output: { "holdings": [{ "symbol": "AAPL", "shares": 10 }, { "symbol": "MSFT", "shares": 50 }] }
    `;

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
                    { role: 'user', content: transcript }
                ],
                temperature: 0, // Deterministic for data extraction
            }),
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const content = data.choices[0].message.content.trim();
        // specific cleanup if the model creates markdown blocks despite instructions
        const jsonStr = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');

        const parsed = JSON.parse(jsonStr);

        return NextResponse.json(parsed);

    } catch (error: any) {
        console.error('Portfolio Parse Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
