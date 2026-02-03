import { Pinecone } from '@pinecone-database/pinecone';

// Initialize Pinecone client
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
});

export const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'legendary-investor';

// Get or create the index
export async function getPineconeIndex() {
    return pinecone.index(INDEX_NAME);
}

// Check if index exists, if not create it
export async function ensureIndexExists() {
    const indexes = await pinecone.listIndexes();
    const indexNames = indexes.indexes?.map(i => i.name) || [];

    if (!indexNames.includes(INDEX_NAME)) {
        // Create index with 1536 dimensions (OpenAI embeddings size)
        // For Claude/OpenRouter, we'll use a different embedding strategy
        await pinecone.createIndex({
            name: INDEX_NAME,
            dimension: 1536,
            metric: 'cosine',
            spec: {
                serverless: {
                    cloud: 'aws',
                    region: 'us-east-1',
                },
            },
        });

        // Wait for index to be ready
        await new Promise(resolve => setTimeout(resolve, 60000));
    }

    return getPineconeIndex();
}

export { pinecone };
