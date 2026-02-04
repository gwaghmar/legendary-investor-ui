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
}

export interface StockDataBundle {
    quote: RealTimeQuote | null;
    profile: CompanyProfile | null;
    metrics: CompanyMetrics | null;
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
            peRatio: m.peBasicExclExtraTTM || m.peTTM || null,
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
        };
    } catch (error) {
        console.error(`Finnhub metrics error for ${symbol}:`, error);
        return null;
    }
}

// Main function: Get all stock data for a symbol
export async function getStockData(symbol: string): Promise<StockDataBundle> {
    const cleanSymbol = symbol.toUpperCase().trim();

    if (!FINNHUB_API_KEY) {
        return {
            quote: null,
            profile: null,
            metrics: null,
            fetchedAt: new Date().toISOString(),
            error: 'Finnhub API key not configured',
        };
    }

    // Fetch all data in parallel
    const [quote, profile, metrics] = await Promise.all([
        fetchQuote(cleanSymbol),
        fetchProfile(cleanSymbol),
        fetchMetrics(cleanSymbol),
    ]);

    return {
        quote,
        profile,
        metrics,
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

    parts.push(`Data as of: ${new Date(data.fetchedAt).toLocaleString()}`);

    return parts.join('\n');
}
