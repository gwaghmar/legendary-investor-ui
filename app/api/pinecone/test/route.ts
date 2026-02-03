import { NextResponse } from 'next/server';
import { pinecone, INDEX_NAME, ensureIndexExists } from '@/lib/pinecone';

export const runtime = 'nodejs'; // Pinecone requires Node.js runtime

export async function GET() {
    try {
        // Test 1: Check if we can connect to Pinecone
        const indexes = await pinecone.listIndexes();
        const indexNames = indexes.indexes?.map(i => i.name) || [];

        // Test 2: Check if our index exists
        const indexExists = indexNames.includes(INDEX_NAME);

        let indexStats = null;
        if (indexExists) {
            // Test 3: Get index stats
            const index = pinecone.index(INDEX_NAME);
            indexStats = await index.describeIndexStats();
        }

        return NextResponse.json({
            success: true,
            message: 'Pinecone connection successful!',
            data: {
                connectedToAPI: true,
                targetIndex: INDEX_NAME,
                indexExists,
                availableIndexes: indexNames,
                stats: indexStats ? {
                    vectorCount: indexStats.totalRecordCount,
                    dimension: indexStats.dimension,
                    namespaces: Object.keys(indexStats.namespaces || {}),
                } : null,
            },
        });
    } catch (error: any) {
        console.error('Pinecone test error:', error);

        return NextResponse.json({
            success: false,
            message: 'Pinecone connection failed',
            error: error.message,
            hint: error.message.includes('API key')
                ? 'Check your PINECONE_API_KEY in .env.local'
                : 'Check Pinecone dashboard for status',
        }, { status: 500 });
    }
}

// POST to create the index if it doesn't exist
export async function POST() {
    try {
        const index = await ensureIndexExists();
        const stats = await index.describeIndexStats();

        return NextResponse.json({
            success: true,
            message: `Index '${INDEX_NAME}' is ready!`,
            stats: {
                vectorCount: stats.totalRecordCount,
                dimension: stats.dimension,
            },
        });
    } catch (error: any) {
        console.error('Pinecone index creation error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}
