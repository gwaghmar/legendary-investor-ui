import { NextResponse } from 'next/server';
import { COUNCIL_AGENTS, CouncilAgent, AgentVote, calculateConsensus, CouncilDecision } from '@/lib/council-agents';

export const runtime = 'edge';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
const SITE_NAME = process.env.SITE_NAME || 'Legendary Investor';

// Use a cheaper, faster model for batch processing
const MODEL = 'google/gemini-2.0-flash-001';

async function getCouncilVotes(
    symbol: string,
    question: string,
    activeAgents: CouncilAgent[],
    context?: string
): Promise<AgentVote[]> {
    const agentsDesc = activeAgents.map(a =>
        `- ${a.name} (${a.title}): ${a.systemPrompt.slice(0, 100)}...`
    ).join('\n');

    const prompt = `You are playing the role of an Investment Council composed of 5 legendary investors.
    
THE COUNCIL MEMBERS:
${agentsDesc}

TASK:
Analyze the stock ${symbol} based on the question: "${question}".
${context ? `CONTEXT:\n${context}` : ''}

Each member must vote independently based on their specific philosophy.

RESPOND ONLY WITH A JSON ARRAY containing an object for each council member.
Format:
[
  {
    "agentId": "value", // specific agent ID
    "vote": "STRONG_BUY" | "BUY" | "HOLD" | "SELL" | "STRONG_SELL",
    "confidence": 0-100,
    "reasoning": "2 sentences max explaining the vote from their specific persona",
    "keyMetrics": ["metric1", "metric2"]
  },
  ...
]`;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': SITE_URL,
                'X-Title': SITE_NAME,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                response_format: { type: 'json_object' }
            }),
        });

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        // Robust JSON parsing
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const parsedVotes = JSON.parse(jsonMatch[0]);

            // Map back to ensure correct structure
            return parsedVotes.map((v: any) => {
                const agent = activeAgents.find(a => a.id === v.agentId) || activeAgents[0];
                return {
                    agentId: agent.id,
                    agentName: agent.name,
                    vote: v.vote || 'HOLD',
                    confidence: Math.min(100, Math.max(0, v.confidence || 50)),
                    reasoning: v.reasoning || 'Analysis inconclusive.',
                    keyMetrics: v.keyMetrics || [],
                };
            });
        }
    } catch (error) {
        console.error('Council batch voting error:', error);
    }

    // Fallback if API fails
    return activeAgents.map(agent => ({
        agentId: agent.id,
        agentName: agent.name,
        vote: 'HOLD',
        confidence: 50,
        reasoning: 'Council currently unavailable.',
        keyMetrics: [],
    }));
}

export async function POST(req: Request) {
    if (!OPENROUTER_API_KEY) {
        return NextResponse.json({ error: 'OpenRouter API Key missing' }, { status: 500 });
    }

    try {
        const { symbol, question, agents = ['value', 'growth', 'risk', 'macro', 'quant'], context } = await req.json();

        if (!symbol || !question) {
            return NextResponse.json({ error: 'Symbol and question required' }, { status: 400 });
        }

        // Filter to requested agents
        const activeAgents = COUNCIL_AGENTS.filter(a => agents.includes(a.id));

        // BATCH REQUEST: 1 Call instead of 5
        const votes = await getCouncilVotes(symbol, question, activeAgents, context);

        // Calculate consensus
        const { consensus, strength } = calculateConsensus(votes);

        // Generate summary
        const bullishVotes = votes.filter(v => v.vote === 'STRONG_BUY' || v.vote === 'BUY').length;
        const bearishVotes = votes.filter(v => v.vote === 'SELL' || v.vote === 'STRONG_SELL').length;

        let summary = '';
        if (bullishVotes > bearishVotes) {
            summary = `The council is bullish on ${symbol} with ${bullishVotes} of ${votes.length} members recommending a buy.`;
        } else if (bearishVotes > bullishVotes) {
            summary = `The council is bearish on ${symbol} with ${bearishVotes} of ${votes.length} members recommending to sell or avoid.`;
        } else {
            summary = `The council is divided on ${symbol}. Consider both sides carefully before making a decision.`;
        }

        const decision: CouncilDecision = {
            symbol: symbol.toUpperCase(),
            question,
            timestamp: new Date().toISOString(),
            votes,
            consensus,
            consensusStrength: Math.round(strength),
            summary,
        };

        return NextResponse.json(decision);

    } catch (error: any) {
        console.error('Council API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
