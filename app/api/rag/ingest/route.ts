import { NextResponse } from 'next/server';
import { getPineconeIndex, ensureIndexExists, INDEX_NAME } from '@/lib/pinecone';

export const runtime = 'nodejs';

// SEC EDGAR API endpoints
const SEC_SUBMISSIONS_URL = 'https://data.sec.gov/submissions';
const SEC_FILINGS_URL = 'https://www.sec.gov/cgi-bin/browse-edgar';

// Company CIK mappings (Central Index Key - SEC identifier)
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
};

interface FilingData {
    symbol: string;
    cik: string;
    filingType: string;
    filingDate: string;
    description: string;
    content: string;
    url: string;
}

// Simple text chunking for RAG
function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.slice(start, end));
        start = end - overlap;
        if (start >= text.length - overlap) break;
    }

    return chunks;
}

// Generate simple embeddings using keyword hashing (for demo - production would use OpenAI/Cohere)
function generateSimpleEmbedding(text: string): number[] {
    // Create a 1536-dimensional vector from text (matching OpenAI dimensions)
    const vector = new Array(1536).fill(0);
    const words = text.toLowerCase().split(/\s+/);

    words.forEach((word, idx) => {
        // Hash each word to multiple positions
        for (let i = 0; i < word.length; i++) {
            const hash = (word.charCodeAt(i) * 31 + idx) % 1536;
            vector[hash] = Math.min(1, vector[hash] + 0.1);
        }
    });

    // Normalize
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? vector.map(v => v / magnitude) : vector;
}

// Fetch SEC filing data from SEC EDGAR
async function fetchSECFiling(cik: string, filingType: string = '10-K'): Promise<FilingData | null> {
    try {
        // Get company submissions
        const response = await fetch(`${SEC_SUBMISSIONS_URL}/CIK${cik}.json`, {
            headers: {
                'User-Agent': 'LegendaryInvestor/1.0 (educational project)',
            },
        });

        if (!response.ok) {
            console.error(`SEC API error: ${response.status}`);
            return null;
        }

        const data = await response.json();
        const filings = data.filings?.recent;

        if (!filings) return null;

        // Find the most recent filing of the specified type
        const filingIndex = filings.form?.findIndex((f: string) => f === filingType);

        if (filingIndex === -1) return null;

        const accessionNumber = filings.accessionNumber[filingIndex];
        const filingDate = filings.filingDate[filingIndex];
        const primaryDocument = filings.primaryDocument[filingIndex];

        // Get the filing content (simplified - in production you'd parse the full document)
        const filingUrl = `https://www.sec.gov/Archives/edgar/data/${parseInt(cik)}/${accessionNumber.replace(/-/g, '')}/${primaryDocument}`;

        return {
            symbol: Object.keys(COMPANY_CIKS).find(k => COMPANY_CIKS[k] === cik) || 'UNKNOWN',
            cik,
            filingType,
            filingDate,
            description: `${filingType} filing from ${filingDate}`,
            content: `SEC ${filingType} filing for company with CIK ${cik}, filed on ${filingDate}. This is a placeholder for the full document content which would be parsed in production.`,
            url: filingUrl,
        };
    } catch (error) {
        console.error('Error fetching SEC filing:', error);
        return null;
    }
}

// POST: Ingest SEC filings for a stock symbol
export async function POST(req: Request) {
    try {
        const { symbol, filingType = '10-K' } = await req.json();

        if (!symbol) {
            return NextResponse.json({ error: 'Symbol required' }, { status: 400 });
        }

        const cik = COMPANY_CIKS[symbol.toUpperCase()];
        if (!cik) {
            return NextResponse.json({
                error: `CIK not found for ${symbol}. Supported: ${Object.keys(COMPANY_CIKS).join(', ')}`
            }, { status: 400 });
        }

        // Ensure index exists
        const index = await ensureIndexExists();

        // Fetch SEC filing
        const filing = await fetchSECFiling(cik, filingType);
        if (!filing) {
            return NextResponse.json({ error: 'Failed to fetch SEC filing' }, { status: 500 });
        }

        // Chunk the content
        const chunks = chunkText(filing.content);

        // Create vectors for each chunk
        const vectors = chunks.map((chunk, idx) => ({
            id: `${symbol}-${filingType}-${filing.filingDate}-chunk-${idx}`,
            values: generateSimpleEmbedding(chunk),
            metadata: {
                symbol: filing.symbol,
                filingType: filing.filingType,
                filingDate: filing.filingDate,
                chunkIndex: idx,
                content: chunk,
                url: filing.url,
            },
        }));

        // Upsert to Pinecone
        await index.upsert(vectors);

        return NextResponse.json({
            success: true,
            message: `Ingested ${filingType} for ${symbol}`,
            data: {
                symbol,
                filingType,
                filingDate: filing.filingDate,
                chunksCreated: chunks.length,
                url: filing.url,
            },
        });

    } catch (error: any) {
        console.error('SEC ingestion error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET: Check what filings are ingested for a symbol
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const symbol = searchParams.get('symbol');

        const index = await getPineconeIndex();
        const stats = await index.describeIndexStats();

        return NextResponse.json({
            success: true,
            supportedSymbols: Object.keys(COMPANY_CIKS),
            indexStats: {
                totalVectors: stats.totalRecordCount,
                dimension: stats.dimension,
            },
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
