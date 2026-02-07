// Finnhub Real-Time Stock Data API
// Fetches live market data for AI analysis

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

export interface RealTimeQuote {
    symbol: string;
    currentPrice: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
    open: number;
    previousClose: number;
    timestamp: number;
}

export interface CompanyProfile {
    symbol: string;
    name: string;
    country: string;
    exchange: string;
    industry: string;
    marketCap: number;
    shareOutstanding: number;
    logo: string;
    weburl: string;
}

export interface CompanyMetrics {
    symbol: string;
    peRatio: number | null;
    pbRatio: number | null;
    psRatio: number | null;
    dividendYield: number | null;
    roe: number | null;
    roa: number | null;
    revenueGrowth: number | null;
    epsGrowth: number | null;
    debtToEquity: number | null;
    currentRatio: number | null;
    grossMargin: number | null;
    operatingMargin: number | null;
    netMargin: number | null;
    week52High: number | null;
    week52Low: number | null;
    beta: number | null;
    roic: number | null;
    source: string;
}

export interface CompanyNews {
    id: number;
    headline: string;
    summary: string;
    url: string;
    datetime: number;
    source: string;
    category: string;
}

export interface StockDataBundle {
    quote: RealTimeQuote | null;
    profile: CompanyProfile | null;
    metrics: CompanyMetrics | null;
    news: CompanyNews[];
    fetchedAt: string;
    error?: string;
}

// Fetch real-time quote
async function fetchQuote(symbol: string): Promise<RealTimeQuote | null> {
    try {
        const res = await fetch(`${BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
        const data = await res.json();

        if (data.c === 0 && data.h === 0) {
            return null; // Invalid symbol or no data
        }

        return {
            symbol,
            currentPrice: data.c,
            change: data.d,
            changePercent: data.dp,
            high: data.h,
            low: data.l,
            open: data.o,
            previousClose: data.pc,
            timestamp: data.t,
        };
    } catch (error) {
        console.error(`Finnhub quote error for ${symbol}:`, error);
        return null;
    }
}

// Fetch company profile
async function fetchProfile(symbol: string): Promise<CompanyProfile | null> {
    try {
        const res = await fetch(`${BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
        const data = await res.json();

        if (!data.name) return null;

        return {
            symbol,
            name: data.name,
            country: data.country,
            exchange: data.exchange,
            industry: data.finnhubIndustry,
            marketCap: data.marketCapitalization,
            shareOutstanding: data.shareOutstanding,
            logo: data.logo,
            weburl: data.weburl,
        };
    } catch (error) {
        console.error(`Finnhub profile error for ${symbol}:`, error);
        return null;
    }
}

// Fetch basic financials / metrics
async function fetchMetrics(symbol: string): Promise<CompanyMetrics | null> {
    try {
        const res = await fetch(`${BASE_URL}/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`);
        const data = await res.json();

        const m = data.metric || {};

        return {
            symbol,
            peRatio: m.peIncludedExtraordinaryItemsTTM || m.peBasicExclExtraTTM || m.peTTM || null,
            pbRatio: m.pbQuarterly || m.pbAnnual || null,
            psRatio: m.psTTM || null,
            dividendYield: m.dividendYieldIndicatedAnnual || null,
            roe: m.roeTTM || m.roeRfy || null,
            roa: m.roaTTM || m.roaRfy || null,
            revenueGrowth: m.revenueGrowthQuarterlyYoy || m.revenueGrowth3Y || null,
            epsGrowth: m.epsGrowthQuarterlyYoy || m.epsGrowth3Y || null,
            debtToEquity: m.totalDebtToEquityQuarterly || m.totalDebtToEquityAnnual || null,
            currentRatio: m.currentRatioQuarterly || m.currentRatioAnnual || null,
            grossMargin: m.grossMarginTTM || m.grossMarginAnnual || null,
            operatingMargin: m.operatingMarginTTM || m.operatingMarginAnnual || null,
            netMargin: m.netProfitMarginTTM || m.netProfitMarginAnnual || null,
            week52High: m['52WeekHigh'] || null,
            week52Low: m['52WeekLow'] || null,
            beta: m.beta || null,
            roic: m.roicTTM || calculateROIC(m) || null,
            source: 'Finnhub',
        };
    } catch (error) {
        console.error(`Finnhub metrics error for ${symbol}:`, error);
        return null;
    }
}

function calculateROIC(m: any): number | null {
    // Formula: NOPAT / Invested Capital
    // NOPAT ≈ Operating Income * (1 - Tax Rate)
    // Invested Capital ≈ Total Equity + Total Debt

    // Per Share Approach:
    // Operating Income/Share = Revenue/Share * Operating Margin
    // Equity/Share = Book Value/Share
    // Debt/Share = Book Value/Share * Debt/Equity Ratio

    const revenuePerShare = m.revenuePerShareTTM;
    const operatingMargin = m.operatingMarginTTM;
    const bookValuePerShare = m.bookValuePerShareQuarterly;
    const debtToEquity = m.totalDebtToEquityQuarterly;

    if (!revenuePerShare || !operatingMargin || !bookValuePerShare) return null;

    const taxRate = 0.21; // Estimate
    const operatingIncomePerShare = revenuePerShare * (operatingMargin / 100);
    const nopatPerShare = operatingIncomePerShare * (1 - taxRate);

    const totalDebtPerShare = bookValuePerShare * (debtToEquity ? (debtToEquity / 100) : 0);
    const investedCapitalPerShare = bookValuePerShare + totalDebtPerShare;

    if (investedCapitalPerShare === 0) return null;

    return (nopatPerShare / investedCapitalPerShare) * 100;
}

// Fetch stock peers
export async function getStockPeers(symbol: string): Promise<string[]> {
    try {
        const res = await fetch(`${BASE_URL}/stock/peers?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(`Finnhub peers error for ${symbol}:`, error);
        return [];
    }
}

// Fetch company news
export async function fetchNews(symbol: string): Promise<CompanyNews[]> {
    try {
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);

        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        const res = await fetch(
            `${BASE_URL}/company-news?symbol=${symbol}&from=${formatDate(oneMonthAgo)}&to=${formatDate(today)}&token=${FINNHUB_API_KEY}`
        );
        const data = await res.json();

        return Array.isArray(data) ? data.slice(0, 5) : [];
    } catch (error) {
        console.error(`Finnhub news error for ${symbol}:`, error);
        return [];
    }
}

// Fetch 13F filings / Institutional ownership
export async function getStockFilings(symbol: string): Promise<any[]> {
    try {
        // Finnhub doesn't have a direct "13F visual timeline" endpoint in free, 
        // so we fetch institutional ownership or filings and summarize.
        const res = await fetch(`${BASE_URL}/stock/filings?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
        const data = await res.json();
        return Array.isArray(data) ? data.slice(0, 5) : [];
    } catch (error) {
        console.error(`Finnhub filings error for ${symbol}:`, error);
        return [];
    }
}

import { getAlphaVantageQuote, getAlphaVantageFundamentals } from './alpha-vantage';

// Main function: Get all stock data for a symbol
export async function getStockData(symbol: string): Promise<StockDataBundle> {
    const cleanSymbol = symbol.toUpperCase().trim();

    if (!FINNHUB_API_KEY) {
        return {
            quote: null,
            profile: null,
            metrics: null,
            news: [],
            fetchedAt: new Date().toISOString(),
            error: 'Finnhub API key not configured',
        };
    }

    // Fetch all data in parallel
    let [quote, profile, metrics, news] = await Promise.all([
        fetchQuote(cleanSymbol),
        fetchProfile(cleanSymbol),
        fetchMetrics(cleanSymbol),
        fetchNews(cleanSymbol),
    ]);

    // Waterfall: Fallback to Alpha Vantage if essential data is missing
    if (!quote || metrics?.peRatio === null || metrics?.roic === null) {
        console.log(`Missing essential data for ${cleanSymbol}, attempting Alpha Vantage fallback...`);
        const [avQuote, avMetrics] = await Promise.all([
            getAlphaVantageQuote(cleanSymbol),
            getAlphaVantageFundamentals(cleanSymbol)
        ]);

        if (avQuote) {
            quote = {
                symbol: cleanSymbol,
                currentPrice: avQuote.price,
                change: avQuote.change,
                changePercent: avQuote.changePercent,
                high: avQuote.price, // Fallback
                low: avQuote.price, // Fallback
                open: avQuote.price, // Fallback
                previousClose: avQuote.price - avQuote.change,
                timestamp: Date.now() / 1000,
            };
        }

        if (avMetrics && metrics) {
            metrics.peRatio = metrics.peRatio || avMetrics.pe;
            metrics.roic = metrics.roic || avMetrics.roic;
            metrics.source = 'Alpha Vantage (Fallback)';
        }
    }

    return {
        quote,
        profile,
        metrics,
        news,
        fetchedAt: new Date().toISOString(),
        error: !quote && !profile ? `Could not find data for ${cleanSymbol}` : undefined,
    };
}

// Format stock data into a readable context string for AI
export function formatStockContext(data: StockDataBundle): string {
    if (data.error) {
        return `Note: Could not fetch live data. ${data.error}`;
    }

    const parts: string[] = [];
    const symbol = data.profile?.symbol || data.quote?.symbol || 'Unknown';

    // Company info
    if (data.profile) {
        parts.push(`Company: ${data.profile.name} (${data.profile.symbol})`);
        parts.push(`Industry: ${data.profile.industry}`);
        parts.push(`Market Cap: $${(data.profile.marketCap / 1000).toFixed(1)}B`);
    }

    // Price action
    if (data.quote) {
        const direction = data.quote.change >= 0 ? '+' : '';
        parts.push(`Current Price: $${data.quote.currentPrice.toFixed(2)} (${direction}${data.quote.changePercent.toFixed(2)}% today)`);
        parts.push(`Day Range: $${data.quote.low.toFixed(2)} - $${data.quote.high.toFixed(2)}`);
    }

    // Key metrics
    if (data.metrics) {
        const m = data.metrics;
        if (m.peRatio) parts.push(`P/E Ratio: ${m.peRatio.toFixed(1)}`);
        if (m.pbRatio) parts.push(`P/B Ratio: ${m.pbRatio.toFixed(2)}`);
        if (m.roe) parts.push(`ROE: ${m.roe.toFixed(1)}%`);
        if (m.revenueGrowth) parts.push(`Revenue Growth: ${m.revenueGrowth.toFixed(1)}%`);
        if (m.grossMargin) parts.push(`Gross Margin: ${m.grossMargin.toFixed(1)}%`);
        if (m.debtToEquity) parts.push(`Debt/Equity: ${m.debtToEquity.toFixed(2)}`);
        if (m.dividendYield) parts.push(`Dividend Yield: ${m.dividendYield.toFixed(2)}%`);
        if (m.week52High && m.week52Low) {
            parts.push(`52-Week Range: $${m.week52Low.toFixed(2)} - $${m.week52High.toFixed(2)}`);
        }
        if (m.beta) parts.push(`Beta: ${m.beta.toFixed(2)}`);
    }

    // Recent News
    if (data.news && data.news.length > 0) {
        parts.push(`\nLatest News for ${symbol}:`);
        data.news.forEach((n, i) => {
            parts.push(`${i + 1}. ${n.headline} (${new Date(n.datetime * 1000).toLocaleDateString()})`);
        });
    }

    parts.push(`\nData as of: ${new Date(data.fetchedAt).toLocaleString()}`);

    return parts.join('\n');
}

