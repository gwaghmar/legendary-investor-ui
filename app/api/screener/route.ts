import { NextResponse } from 'next/server';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// Expanded list of 40 popular stocks across sectors
const SCREENER_SYMBOLS = [
    // Tech Giants
    'AAPL', 'GOOGL', 'MSFT', 'NVDA', 'META', 'AMZN', 'TSLA', 'TSM', 'AVGO', 'ORCL',
    // AI & Cloud
    'CRM', 'PLTR', 'SNOW', 'CRWD', 'MU', 'AMD', 'INTC', 'QCOM',
    // Finance
    'JPM', 'V', 'MA', 'BAC', 'GS', 'BRK.B', 'AXP',
    // Healthcare
    'UNH', 'JNJ', 'LLY', 'PFE', 'ABBV', 'MRK',
    // Consumer
    'COST', 'HD', 'WMT', 'KO', 'PEP', 'MCD', 'NKE', 'DIS',
    // Energy & Industrial
    'XOM', 'CVX'
];

interface StockMetrics {
    symbol: string;
    name: string;
    pe: number;
    growth: number;
    roic: number;
    eps: number;
    marketCap: string;
    sector: string;
}

async function fetchWithTimeout(url: string, timeout = 5000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

async function getStockMetrics(symbol: string): Promise<StockMetrics | null> {
    if (!FINNHUB_API_KEY) {
        console.error('FINNHUB_API_KEY not set');
        return null;
    }

    try {
        // Get company profile
        const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        const profileRes = await fetchWithTimeout(profileUrl);
        const profile = await profileRes.json();

        // Get basic financials (P/E, ROE, etc.)
        const metricsUrl = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`;
        const metricsRes = await fetchWithTimeout(metricsUrl);
        const metrics = await metricsRes.json();

        if (!profile?.name) {
            return null;
        }

        const m = metrics?.metric || {};

        // Calculate market cap string
        const marketCapValue = profile.marketCapitalization || 0;
        let marketCap = '$0';
        if (marketCapValue >= 1000) {
            marketCap = `$${(marketCapValue / 1000).toFixed(1)}T`;
        } else {
            marketCap = `$${marketCapValue.toFixed(0)}B`;
        }

        return {
            symbol: symbol,
            name: profile.name || symbol,
            pe: m.peNormalizedAnnual || m.peTTM || 0,
            growth: m.revenueGrowth3Y || m.revenueGrowthQuarterlyYoy || 0,
            roic: m.roic || m.roa || 0, // Fallback to ROA if ROIC not available
            eps: m.epsGrowthTTMYoy || 0,
            marketCap: marketCap,
            sector: profile.finnhubIndustry || 'Unknown',
        };
    } catch (error) {
        console.error(`Error fetching ${symbol}:`, error);
        return null;
    }
}

// Calculate Magic Formula score (high earnings yield + high ROIC)
function calculateMagicScore(pe: number, roic: number): number {
    if (pe <= 0 || roic <= 0) return 50;

    // Earnings yield (inverse of P/E, higher is better)
    const earningsYield = 100 / pe;

    // Normalize scores to 0-100 range
    const eyScore = Math.min(earningsYield * 5, 50); // Max 50 points from E/Y
    const roicScore = Math.min(roic, 50); // Max 50 points from ROIC

    return Math.round(eyScore + roicScore);
}

// Calculate Buffett Quality score
function calculateBuffettScore(roic: number, growth: number, pe: number): number {
    // Buffett likes: high ROIC, reasonable growth, reasonable P/E
    let score = 50;

    // ROIC contribution (max 30 points)
    if (roic >= 15) score += Math.min(roic - 15, 30);

    // Reasonable P/E contribution (max 20 points)
    if (pe > 0 && pe <= 25) score += 20;
    else if (pe > 25 && pe <= 35) score += 10;

    return Math.min(Math.round(score), 100);
}

// Determine verdict based on scores
function getVerdict(magicScore: number, buffettScore: number): 'STRONG BUY' | 'BUY' | 'HOLD' | 'SELL' {
    const avgScore = (magicScore + buffettScore) / 2;
    if (avgScore >= 85) return 'STRONG BUY';
    if (avgScore >= 70) return 'BUY';
    if (avgScore >= 50) return 'HOLD';
    return 'SELL';
}

export async function GET() {
    const results = [];

    // Process in smaller batches to avoid rate limits (Finnhub free = 60/min)
    for (const symbol of SCREENER_SYMBOLS) {
        const metrics = await getStockMetrics(symbol);
        if (metrics) {
            const magicScore = calculateMagicScore(metrics.pe, metrics.roic);
            const buffettScore = calculateBuffettScore(metrics.roic, metrics.growth, metrics.pe);

            results.push({
                symbol: metrics.symbol,
                name: metrics.name,
                pe: Math.round(metrics.pe * 10) / 10,
                growth: Math.round(metrics.growth),
                roic: Math.round(metrics.roic),
                magicScore,
                buffettScore,
                verdict: getVerdict(magicScore, buffettScore),
                sector: metrics.sector,
                marketCap: metrics.marketCap,
            });
        }

        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        count: results.length,
        stocks: results,
    });
}
