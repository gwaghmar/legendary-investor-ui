import type { LegendId, Sentiment } from './legends';

export interface StockData {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  pe: number;
  forwardPe: number;
  revenueGrowth: number;
  grossMargin: number;
  roic: number;
  debtEquity: number;
  freeCashFlow: string;
  shortInterest: number;
  insiderBuying: boolean;
  tangibleBook: number;
  magicScore: number;
  buffettScore: number;
  lastUpdated?: string;
  source?: string;
}

export interface LegendAnalysis {
  legendId: LegendId;
  verdict: 'STRONG BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG SELL';
  conviction: number;
  sentiment: Sentiment;
  quote: string;
  likes: string[];
  concerns: string[];
  closingQuote: string;
}

export const stockDatabase: Record<string, StockData> = {
  MU: {
    symbol: 'MU',
    name: 'Micron Technology',
    exchange: 'NASDAQ',
    sector: 'Semiconductors',
    price: 315.0,
    change: 22.5,
    changePercent: 7.7,
    pe: 36.2,
    forwardPe: 7.2,
    revenueGrowth: 98,
    grossMargin: 68,
    roic: 24,
    debtEquity: 0.3,
    freeCashFlow: '$8.2B',
    shortInterest: 3.2,
    insiderBuying: true,
    tangibleBook: 45,
    magicScore: 94,
    buffettScore: 78,
  },
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    sector: 'Semiconductors',
    price: 186.7,
    change: 3.42,
    changePercent: 1.87,
    pe: 65,
    forwardPe: 32,
    revenueGrowth: 122,
    grossMargin: 75,
    roic: 89,
    debtEquity: 0.41,
    freeCashFlow: '$27B',
    shortInterest: 1.1,
    insiderBuying: false,
    tangibleBook: 12,
    magicScore: 72,
    buffettScore: 85,
  },
  TSM: {
    symbol: 'TSM',
    name: 'Taiwan Semiconductor',
    exchange: 'NYSE',
    sector: 'Semiconductors',
    price: 306.97,
    change: 5.2,
    changePercent: 1.72,
    pe: 24,
    forwardPe: 18,
    revenueGrowth: 30,
    grossMargin: 54,
    roic: 28,
    debtEquity: 0.25,
    freeCashFlow: '$22B',
    shortInterest: 0.8,
    insiderBuying: true,
    tangibleBook: 85,
    magicScore: 87,
    buffettScore: 85,
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    exchange: 'NASDAQ',
    sector: 'Technology',
    price: 195.8,
    change: 2.1,
    changePercent: 1.08,
    pe: 22,
    forwardPe: 18,
    revenueGrowth: 15,
    grossMargin: 58,
    roic: 32,
    debtEquity: 0.1,
    freeCashFlow: '$69B',
    shortInterest: 0.9,
    insiderBuying: true,
    tangibleBook: 52,
    magicScore: 82,
    buffettScore: 88,
  },
  SOFI: {
    symbol: 'SOFI',
    name: 'SoFi Technologies',
    exchange: 'NASDAQ',
    sector: 'Financial Services',
    price: 26.22,
    change: 0.85,
    changePercent: 3.35,
    pe: 142,
    forwardPe: 45,
    revenueGrowth: 35,
    grossMargin: 82,
    roic: 4,
    debtEquity: 1.2,
    freeCashFlow: '-$200M',
    shortInterest: 8.5,
    insiderBuying: true,
    tangibleBook: 6,
    magicScore: 45,
    buffettScore: 52,
  },
};

import { type StockDataBundle } from './finnhub';

export function mapFinnhubToStockData(data: StockDataBundle): StockData | null {
  if (!data.profile || !data.quote || !data.metrics) return null;

  const { profile, quote, metrics } = data;

  // Calculate Scores
  const roic = metrics.roic || 0;
  const earningsYield = metrics.peRatio ? (100 / metrics.peRatio) : 0;
  const magicScore = Math.min(100, Math.max(0, Math.round((roic + earningsYield) * 2))); // Rough approximation

  // Buffett Score: Quality + Moat
  const grossMarginScore = (metrics.grossMargin || 0) > 40 ? 30 : 0;
  const roicScore = roic > 15 ? 30 : 0;
  const debtScore = (metrics.debtToEquity || 1) < 0.5 ? 20 : 0;
  const growthScore = (metrics.revenueGrowth || 0) > 10 ? 20 : 0;
  const buffettScore = grossMarginScore + roicScore + debtScore + growthScore;

  return {
    symbol: profile.symbol,
    name: profile.name,
    exchange: profile.exchange,
    sector: profile.industry || 'Unknown',
    price: quote.currentPrice,
    change: quote.change,
    changePercent: quote.changePercent,
    pe: metrics.peRatio || 0,
    forwardPe: 0, // Not always available in basic metrics, use 0 or fetch separately
    revenueGrowth: metrics.revenueGrowth || 0,
    grossMargin: metrics.grossMargin || 0,
    roic: parseFloat(roic.toFixed(2)),
    debtEquity: metrics.debtToEquity || 0,
    freeCashFlow: 'N/A', // Finnhub basic metrics don't give FCF directly
    shortInterest: 0, // Not in basic metrics
    insiderBuying: false, // Placeholder
    tangibleBook: 0, // Placeholder
    magicScore,
    buffettScore,
    lastUpdated: data.fetchedAt || new Date().toISOString(),
    source: 'Finnhub',
  };
}

export function getLegendAnalyses(stock: StockData): LegendAnalysis[] {
  const symbol = stock.symbol;


  const isMicron = symbol === 'MU';
  const isHighGrowth = stock.revenueGrowth > 50;
  const isValuePlay = stock.forwardPe < 15;
  const hasQuality = stock.roic > 20 && stock.grossMargin > 50;

  return [
    {
      legendId: 'buffett',
      verdict: hasQuality ? 'BUY' : 'HOLD',
      conviction: hasQuality ? 7 : 5,
      sentiment: hasQuality ? 'bullish' : 'neutral',
      quote: hasQuality
        ? `${stock.name} has the kind of economics I like - ${stock.grossMargin}% gross margins, ${stock.roic}% ROIC. That's a business with pricing power. At ${stock.forwardPe}x forward earnings, you're getting quality at a reasonable price.`
        : `The business is decent, but I want to see more durable competitive advantages. ${stock.grossMargin}% margins are good, but are they sustainable? I'd watch and wait.`,
      likes: hasQuality
        ? ['Strong gross margins', `${stock.roic}% ROIC`, 'Pricing power', 'Low debt']
        : ['Reasonable valuation', 'Growing market'],
      concerns: hasQuality
        ? ['Cyclical business', 'Capex intensive', 'Tech disruption risk']
        : ['Competitive moat unclear', 'Margin sustainability', 'Capital allocation'],
      closingQuote: hasQuality
        ? "A wonderful business at a fair price beats a fair business at a wonderful price."
        : "The best investment is in yourself. The second best is in businesses you understand.",
    },
    {
      legendId: 'burry',
      verdict: isValuePlay ? 'STRONG BUY' : 'HOLD',
      conviction: isValuePlay && isMicron ? 9 : 6,
      sentiment: isValuePlay ? 'bullish' : 'neutral',
      quote: isMicron
        ? `This is the most asymmetric bet in the AI space right now. ${stock.forwardPe}x forward earnings with ${stock.revenueGrowth}% revenue growth? The math is screaming at you. Everyone's chasing NVDA at 65x while ignoring the company that makes the memory every AI chip needs. I've seen this setup before - it's rare.`
        : `At ${stock.forwardPe}x forward P/E, the valuation is ${isValuePlay ? 'compelling' : 'stretched'}. I'm looking for asymmetry - where the upside significantly outweighs the downside. ${isValuePlay ? 'This fits.' : 'Not yet.'}`,
      likes: isValuePlay
        ? [`${stock.forwardPe}x forward P/E`, `${stock.revenueGrowth}% revenue growth`, 'HBM sold out to 2026', `${stock.grossMargin}% gross margins`]
        : ['Market position', 'Technology moat'],
      concerns: ['Cyclical business', 'Heavy capex needs', 'Competition risk', symbol === 'NVDA' ? 'Already up significantly' : 'Execution risk'],
      closingQuote: isValuePlay
        ? "The math doesn't lie. This is a 3:1 asymmetric setup."
        : "I focus on value, not popularity. Sometimes the best trade is no trade.",
    },
    {
      legendId: 'munger',
      verdict: hasQuality && isValuePlay ? 'BUY' : 'HOLD',
      conviction: hasQuality ? 6 : 4,
      sentiment: hasQuality ? 'neutral' : 'cautious',
      quote: hasQuality
        ? `The business economics are rational - ${stock.roic}% returns on capital, manageable debt. But ask yourself: will this business be around and thriving in 20 years? Technology changes fast.`
        : `I see a lot of people excited about this stock. Excitement is usually bad for returns. I want to see boring, predictable cash flows that will compound for decades.`,
      likes: hasQuality ? ['Rational economics', 'Good ROIC', 'Management quality'] : ['Market opportunity'],
      concerns: ['Technology disruption', 'Competition', 'Cyclicality', 'Complexity'],
      closingQuote: "Invert, always invert. What could go wrong, and how bad would it be?",
    },
    {
      legendId: 'lynch',
      verdict: isHighGrowth ? 'BUY' : 'HOLD',
      conviction: isHighGrowth ? 8 : 5,
      sentiment: isHighGrowth ? 'bullish' : 'neutral',
      quote: isHighGrowth
        ? `${stock.revenueGrowth}% revenue growth is the kind of number that gets me excited. This is a classic fast grower. The PEG ratio is attractive, and the story is clear. Know your story, stick with it.`
        : `Solid company, but where's the growth catalyst? I like to invest in companies where I can see the earnings doubling in 3-5 years. Show me that path.`,
      likes: isHighGrowth
        ? [`${stock.revenueGrowth}% growth`, 'Clear story', 'Market leadership', 'Attractive PEG']
        : ['Established position', 'Stable business'],
      concerns: ['Growth sustainability', 'Competition', 'Valuation if growth slows'],
      closingQuote: isHighGrowth
        ? "Behind every stock is a company. Find out what it's doing."
        : "Know what you own, and know why you own it.",
    },
    {
      legendId: 'druckenmiller',
      verdict: isHighGrowth ? 'BUY' : 'HOLD',
      conviction: isHighGrowth ? 7 : 5,
      sentiment: isHighGrowth ? 'bullish' : 'neutral',
      quote: `The trend is your friend. ${stock.name} is riding the AI wave with ${stock.revenueGrowth}% growth. Macro backdrop is supportive - Fed on pause, dollar stable. But remember: it's not about being right, it's about how much you make when you're right.`,
      likes: ['Momentum', 'Secular tailwinds', 'Liquidity', 'Institutional support'],
      concerns: ['Macro sensitivity', 'Rate risk', 'Position sizing', 'Crowded trade'],
      closingQuote: "The way to build superior long-term returns is through preservation of capital and home runs.",
    },
  ];
}
