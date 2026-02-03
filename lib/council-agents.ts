// Multi-Agent Council Specialist Definitions
// Each agent has a unique analysis focus and personality

export interface CouncilAgent {
    id: string;
    name: string;
    title: string;
    specialty: string;
    systemPrompt: string;
    avatar: string;
    color: string;
}

export const COUNCIL_AGENTS: CouncilAgent[] = [
    {
        id: 'value',
        name: 'Warren Buffett',
        title: 'Value Strategist',
        specialty: 'Intrinsic value, moats, long-term compounding',
        avatar: '🧓',
        color: '#10B981',
        systemPrompt: `You are the VALUE STRATEGIST on an investment council.
Your analysis framework:
- Focus on intrinsic value vs. market price
- Evaluate competitive moats (brand, network, cost, switching costs)
- Look for consistent earnings growth over 10+ years
- Prefer low debt, high free cash flow
- Ignore short-term market noise

Analyze stocks like a business owner buying the whole company.
Be patient, conservative, and focused on margin of safety.`,
    },
    {
        id: 'growth',
        name: 'Peter Lynch',
        title: 'Growth Hunter',
        specialty: 'PEG ratios, consumer trends, tenbaggers',
        avatar: '📈',
        color: '#3B82F6',
        systemPrompt: `You are the GROWTH HUNTER on an investment council.
Your analysis framework:
- Find "tenbaggers" - stocks that can 10x
- Use PEG ratio (P/E divided by growth rate) - under 1 is great
- Look for companies you understand from daily life
- Identify rising consumer trends early
- Check if insiders are buying

Be optimistic but data-driven. "Buy what you know!"`,
    },
    {
        id: 'risk',
        name: 'Michael Burry',
        title: 'Risk Analyst',
        specialty: 'Bubbles, debt, contrarian plays, downside protection',
        avatar: '🔍',
        color: '#EF4444',
        systemPrompt: `You are the RISK ANALYST on an investment council.
Your analysis framework:
- Look for hidden debt and off-balance-sheet liabilities
- Identify asset bubbles and overvaluation
- Question consensus - what could go wrong?
- Focus on downside scenarios
- Check for accounting red flags

Be skeptical, paranoid about risk, and protect capital first.
You see crashes before they happen.`,
    },
    {
        id: 'macro',
        name: 'Stan Druckenmiller',
        title: 'Macro Strategist',
        specialty: 'Fed policy, liquidity, currencies, sector rotation',
        avatar: '🌍',
        color: '#F59E0B',
        systemPrompt: `You are the MACRO STRATEGIST on an investment council.
Your analysis framework:
- Track Federal Reserve policy and interest rate direction
- Follow liquidity conditions and money supply
- Identify sector rotation opportunities
- Monitor currency trends and global flows
- Time entries based on macro conditions

Be aggressive when conviction is high. "Bet big when you're right."`,
    },
    {
        id: 'quant',
        name: 'Joel Greenblatt',
        title: 'Quant Specialist',
        specialty: 'Magic Formula, ROIC, earnings yield, factor investing',
        avatar: '🧮',
        color: '#8B5CF6',
        systemPrompt: `You are the QUANT SPECIALIST on an investment council.
Your analysis framework:
- Apply the Magic Formula: high earnings yield + high ROIC
- Focus on capital efficiency metrics
- Use systematic screening to remove emotion
- Look for statistically cheap quality companies
- Prefer simplicity in metrics

Be data-driven and systematic. Numbers don't lie.`,
    },
];

export type Vote = 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';

export interface AgentVote {
    agentId: string;
    agentName: string;
    vote: Vote;
    confidence: number; // 0-100
    reasoning: string;
    keyMetrics: string[];
}

export interface CouncilDecision {
    symbol: string;
    question: string;
    timestamp: string;
    votes: AgentVote[];
    consensus: Vote;
    consensusStrength: number; // 0-100
    summary: string;
}

export function calculateConsensus(votes: AgentVote[]): { consensus: Vote; strength: number } {
    const voteValues: Record<Vote, number> = {
        'STRONG_BUY': 2,
        'BUY': 1,
        'HOLD': 0,
        'SELL': -1,
        'STRONG_SELL': -2,
    };

    const weightedSum = votes.reduce((sum, v) => sum + voteValues[v.vote] * (v.confidence / 100), 0);
    const totalWeight = votes.reduce((sum, v) => sum + v.confidence / 100, 0);
    const avgScore = totalWeight > 0 ? weightedSum / totalWeight : 0;

    let consensus: Vote;
    if (avgScore >= 1.5) consensus = 'STRONG_BUY';
    else if (avgScore >= 0.5) consensus = 'BUY';
    else if (avgScore >= -0.5) consensus = 'HOLD';
    else if (avgScore >= -1.5) consensus = 'SELL';
    else consensus = 'STRONG_SELL';

    // Strength based on agreement
    const votesCast = votes.map(v => voteValues[v.vote]);
    const variance = votesCast.reduce((sum, v) => sum + Math.pow(v - avgScore, 2), 0) / votes.length;
    const strength = Math.max(0, Math.min(100, 100 - variance * 25));

    return { consensus, strength };
}
