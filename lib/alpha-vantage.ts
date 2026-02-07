const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

export async function getAlphaVantageQuote(symbol: string) {
    if (!ALPHA_VANTAGE_API_KEY) {
        console.warn('Alpha Vantage API key missing. Falling back to demo data.');
        return null;
    }

    try {
        const response = await fetch(`${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
        const data = await response.json();

        if (data['Global Quote']) {
            const quote = data['Global Quote'];
            return {
                price: parseFloat(quote['05. price']),
                change: parseFloat(quote['09. change']),
                changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
                volume: parseInt(quote['06. volume']),
                source: 'Alpha Vantage'
            };
        }
        return null;
    } catch (error) {
        console.error('Alpha Vantage fetch error:', error);
        return null;
    }
}

export async function getAlphaVantageFundamentals(symbol: string) {
    if (!ALPHA_VANTAGE_API_KEY) return null;

    try {
        const response = await fetch(`${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
        const data = await response.json();

        if (data && data.Symbol) {
            return {
                pe: parseFloat(data.PERatio) || 0,
                dividendYield: parseFloat(data.DividendYield) || 0,
                marketCap: parseInt(data.MarketCapitalization) || 0,
                bookValue: parseFloat(data.BookValue) || 0,
                eps: parseFloat(data.EPS) || 0,
                roic: parseFloat(data.ReturnOnInvestmentTTM) * 100 || 0, // AV uses decimals
                source: 'Alpha Vantage'
            };
        }
        return null;
    } catch (error) {
        console.error('Alpha Vantage fundamentals error:', error);
        return null;
    }
}

export async function getAlphaVantageMovers() {
    if (!ALPHA_VANTAGE_API_KEY) return null;

    try {
        const response = await fetch(`${BASE_URL}?function=TOP_GAINERS_LOSERS&apikey=${ALPHA_VANTAGE_API_KEY}`);
        const data = await response.json();

        if (data && data.top_gainers) {
            return {
                gainers: data.top_gainers.slice(0, 5).map((m: any) => ({
                    symbol: m.ticker,
                    price: parseFloat(m.price),
                    change: parseFloat(m.change_amount),
                    changePercent: parseFloat(m.change_percentage.replace('%', ''))
                })),
                losers: data.top_losers.slice(0, 5).map((m: any) => ({
                    symbol: m.ticker,
                    price: parseFloat(m.price),
                    change: parseFloat(m.change_amount),
                    changePercent: parseFloat(m.change_percentage.replace('%', ''))
                })),
                source: 'Alpha Vantage'
            };
        }
        return null;
    } catch (error) {
        console.error('Alpha Vantage movers error:', error);
        return null;
    }
}

export async function getAlphaVantageMacro(indicator: 'REAL_GDP' | 'CPI' | 'FEDERAL_FUNDS_RATE' | 'UNEMPLOYMENT') {
    if (!ALPHA_VANTAGE_API_KEY) return null;

    try {
        const response = await fetch(`${BASE_URL}?function=${indicator}&interval=monthly&apikey=${ALPHA_VANTAGE_API_KEY}`);
        const data = await response.json();

        if (data && data.data) {
            // Take last 12 months
            const lastYear = data.data.slice(0, 12).reverse();
            return {
                name: data.name,
                current: lastYear[lastYear.length - 1].value,
                unit: data.unit,
                historical: lastYear.map((d: any) => parseFloat(d.value)),
                source: 'Alpha Vantage'
            };
        }
        return null;
    } catch (error) {
        console.error(`Alpha Vantage macro error (${indicator}):`, error);
        return null;
    }
}
