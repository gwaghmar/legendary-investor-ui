export type LegendId = 'buffett' | 'munger' | 'burry' | 'lynch' | 'druckenmiller' | 'klarman' | 'greenblatt';

export type Sentiment = 'bullish' | 'bearish' | 'cautious' | 'neutral';

export interface Legend {
  id: LegendId;
  name: string;
  fullName: string;
  color: string;
  emoji: string;
  catchphrase: string;
  framework: string;
}

export const legends: Record<LegendId, Legend> = {
  buffett: {
    id: 'buffett',
    name: 'Buffett',
    fullName: 'Warren Buffett',
    color: '#2563EB',
    emoji: '👴',
    catchphrase: "Be fearful when others are greedy, and greedy when others are fearful.",
    framework: 'Quality Value Investing',
  },
  munger: {
    id: 'munger',
    name: 'Munger',
    fullName: 'Charlie Munger',
    color: '#7C3AED',
    emoji: '🧓',
    catchphrase: "Invert, always invert.",
    framework: 'Mental Models',
  },
  burry: {
    id: 'burry',
    name: 'Burry',
    fullName: 'Michael Burry',
    color: '#DC2626',
    emoji: '🔍',
    catchphrase: "I focus on value, not popularity.",
    framework: 'Deep Value & Contrarian',
  },
  lynch: {
    id: 'lynch',
    name: 'Lynch',
    fullName: 'Peter Lynch',
    color: '#059669',
    emoji: '🛒',
    catchphrase: "Invest in what you know.",
    framework: 'GARP (Growth at Reasonable Price)',
  },
  druckenmiller: {
    id: 'druckenmiller',
    name: 'Druckenmiller',
    fullName: 'Stan Druckenmiller',
    color: '#D97706',
    emoji: '📈',
    catchphrase: "It's not whether you're right or wrong, it's how much you make when you're right.",
    framework: 'Macro & Momentum',
  },
  klarman: {
    id: 'klarman',
    name: 'Klarman',
    fullName: 'Seth Klarman',
    color: '#0891B2',
    emoji: '🛡️',
    catchphrase: "Margin of safety is the difference between price and value.",
    framework: 'Margin of Safety',
  },
  greenblatt: {
    id: 'greenblatt',
    name: 'Greenblatt',
    fullName: 'Joel Greenblatt',
    color: '#4F46E5',
    emoji: '✨',
    catchphrase: "Buy good companies at bargain prices.",
    framework: 'Magic Formula',
  },
};

export const legendList = Object.values(legends);

export const sentimentColors: Record<Sentiment, string> = {
  bullish: '#059669',
  bearish: '#DC2626',
  cautious: '#D97706',
  neutral: '#6B7280',
};

export const sentimentLabels: Record<Sentiment, string> = {
  bullish: 'BULLISH',
  bearish: 'BEARISH',
  cautious: 'CAUTIOUS',
  neutral: 'NEUTRAL',
};
