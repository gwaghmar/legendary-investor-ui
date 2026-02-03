import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Company CIK mappings (expanded)
const COMPANY_CIKS: Record<string, string> = {
    'AAPL': '0000320193',
    'GOOGL': '0001652044',
    'MSFT': '0000789019',
    'NVDA': '0001045810',
    'META': '0001326801',
    'AMZN': '0001018724',
    'TSLA': '0001318605',
    'JPM': '0000019617',
    'BRK.B': '0001067983',
    'V': '0001403161',
    'AMD': '0000002488',
    'INTC': '0000050863',
    'NFLX': '0001065280',
    'DIS': '0001744489',
};

const SEC_SUBMISSIONS_URL = 'https://data.sec.gov/submissions';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const symbol = searchParams.get('symbol')?.toUpperCase();

        if (!symbol) {
            return NextResponse.json({ error: 'Symbol required' }, { status: 400 });
        }

        const cik = COMPANY_CIKS[symbol];
        if (!cik) {
            return NextResponse.json({
                error: 'CIK not found for symbol (Supported: Top 50 Tech/Finance)',
                supported: Object.keys(COMPANY_CIKS)
            }, { status: 404 });
        }

        // SEC API requires a User-Agent with an email
        // Format: "Application Name admin@domain.com"
        const response = await fetch(`${SEC_SUBMISSIONS_URL}/CIK${cik}.json`, {
            headers: {
                'User-Agent': 'LegendaryInvestor/1.0 (educational project)',
                'Accept-Encoding': 'gzip, deflate',
                'Host': 'data.sec.gov',
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`SEC API Error: ${response.status}`);
        }

        const data = await response.json();
        const recent = data.filings?.recent || {};

        // format the messy parallel arrays into objects
        const filings = [];
        const limit = 20; // Last 20 filings

        if (recent.accessionNumber) {
            for (let i = 0; i < Math.min(recent.accessionNumber.length, limit); i++) {
                filings.push({
                    accessionNumber: recent.accessionNumber[i],
                    filingDate: recent.filingDate[i],
                    reportDate: recent.reportDate[i],
                    form: recent.form[i],
                    fileNumber: recent.fileNumber[i],
                    primaryDocument: recent.primaryDocument[i],
                    size: recent.size?.[i] || 0,
                    url: `https://www.sec.gov/Archives/edgar/data/${parseInt(cik)}/${recent.accessionNumber[i].replace(/-/g, '')}/${recent.primaryDocument[i]}`
                });
            }
        }

        return NextResponse.json({
            symbol,
            cik,
            name: data.name,
            filings
        });

    } catch (error: any) {
        console.error('SEC API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
