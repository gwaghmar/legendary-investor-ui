import { NextResponse } from 'next/server';
import { COUNCIL_AGENTS, CouncilAgent, AgentVote, Vote, calculateConsensus, CouncilDecision } from '@/lib/council-agents';

export const runtime = 'edge';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
const SITE_NAME = process.env.SITE_NAME || 'Legendary Investor';

async function getAgentVote(
    agent: CouncilAgent,
    symbol: string,
    question: string,
    context?: string
): Promise<AgentVote> {
    const prompt = `${agent.systemPrompt}

STOCK: ${symbol}
QUESTION: ${question}
${context ? `\nCONTEXT:\n${context}` : ''}

Analyze this investment and provide your vote.

RESPOND IN THIS EXACT JSON FORMAT:
{
  "vote": "STRONG_BUY" | "BUY" | "HOLD" | "SELL" | "STRONG_SELL",
  "confidence": 0-100,
  "reasoning": "2-3 sentences max explaining your vote",
  "keyMetrics": ["metric1", "metric2", "metric3"]
}

Be decisive. Give your honest assessment as the ${agent.title}.`;

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
                model: 'anthropic/claude-3.5-sonnet',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 300,
            }),
        });

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        // Parse JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                agentId: agent.id,
                agentName: agent.name,
                vote: parsed.vote || 'HOLD',
                confidence: Math.min(100, Math.max(0, parsed.confidence || 50)),
                reasoning: parsed.reasoning || 'No reasoning provided',
                keyMetrics: parsed.keyMetrics || [],
            };
        }
    } catch (error) {
        console.error(`Agent ${agent.id} voting error:`, error);
    }

    // Fallback vote if parsing fails
    return {
        agentId: agent.id,
        agentName: agent.name,
        vote: 'HOLD',
        confidence: 50,
        reasoning: 'Analysis inconclusive.',
        keyMetrics: [],
    };
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

        // Get votes from all agents in parallel
        const votePromises = activeAgents.map(agent => getAgentVote(agent, symbol, question, context));
        const votes = await Promise.all(votePromises);

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

// GET: List available council agents
export async function GET() {
    return NextResponse.json({
        agents: COUNCIL_AGENTS.map(a => ({
            id: a.id,
            name: a.name,
            title: a.title,
            specialty: a.specialty,
            avatar: a.avatar,
            color: a.color,
        })),
        usage: {
            endpoint: 'POST /api/council',
            body: {
                symbol: 'AAPL',
                question: 'Should I buy Apple stock for long-term holding?',
                agents: ['value', 'growth', 'risk', 'macro', 'quant'],
                context: 'Optional additional context about the investment',
            },
        },
    });
}
