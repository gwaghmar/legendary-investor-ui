import { NextResponse } from 'next/server';
import { getPineconeIndex } from '@/lib/pinecone';

export const runtime = 'nodejs';

// Generate simple embedding for query (matches ingestion embedding approach)
function generateSimpleEmbedding(text: string): number[] {
    const vector = new Array(1536).fill(0);
    const words = text.toLowerCase().split(/\s+/);

    words.forEach((word, idx) => {
        for (let i = 0; i < word.length; i++) {
            const hash = (word.charCodeAt(i) * 31 + idx) % 1536;
            vector[hash] = Math.min(1, vector[hash] + 0.1);
        }
    });

    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? vector.map(v => v / magnitude) : vector;
}

export interface RetrievalResult {
    content: string;
    symbol: string;
    filingType: string;
    filingDate: string;
    url: string;
    score: number;
}

// POST: Query RAG system for relevant SEC filings
export async function POST(req: Request) {
    try {
        const { query, symbol, topK = 3 } = await req.json();

        if (!query) {
            return NextResponse.json({ error: 'Query required' }, { status: 400 });
        }

        const index = await getPineconeIndex();

        // Generate query embedding
        const queryVector = generateSimpleEmbedding(query);

        // Build filter if symbol specified
        const filter = symbol ? { symbol: symbol.toUpperCase() } : undefined;

        // Query Pinecone
        const results = await index.query({
            vector: queryVector,
            topK,
            includeMetadata: true,
            filter,
        });

        // Format results
        const documents: RetrievalResult[] = results.matches?.map(match => ({
            content: (match.metadata as any)?.content || '',
            symbol: (match.metadata as any)?.symbol || '',
            filingType: (match.metadata as any)?.filingType || '',
            filingDate: (match.metadata as any)?.filingDate || '',
            url: (match.metadata as any)?.url || '',
            score: match.score || 0,
        })) || [];

        return NextResponse.json({
            success: true,
            query,
            symbol: symbol || 'all',
            results: documents,
            count: documents.length,
        });

    } catch (error: any) {
        console.error('RAG retrieval error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET: Health check
export async function GET() {
    try {
        const index = await getPineconeIndex();
        const stats = await index.describeIndexStats();

        return NextResponse.json({
            success: true,
            status: 'RAG retrieval API ready',
            vectorCount: stats.totalRecordCount,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
