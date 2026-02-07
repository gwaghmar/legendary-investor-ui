export interface TranscriptSegment {
    id: string;
    speaker: string;
    role: 'executive' | 'analyst' | 'operator';
    text: string;
    time: string;
    sentiment: 'positive' | 'negative' | 'neutral';
}

export interface EarningsCall {
    symbol: string;
    quarter: string;
    year: number;
    date: string;
    segments: TranscriptSegment[];
}

// Mock Data for Key Stocks
const mockTranscripts: Record<string, EarningsCall> = {
    AAPL: {
        symbol: 'AAPL',
        quarter: 'Q1',
        year: 2025,
        date: 'Jan 30, 2025',
        segments: [
            { id: '1', speaker: 'Tim Cook', role: 'executive', time: '05:00', sentiment: 'positive', text: "We are thrilled to report stronger than expected results, driven by robust demand for iPhone 16 and record Services revenue." },
            { id: '2', speaker: 'Luca Maestri', role: 'executive', time: '08:30', sentiment: 'neutral', text: "Gross margin was 46.2%, near the high end of our guidance range." },
            { id: '3', speaker: 'Analyst (Morgan Stanley)', role: 'analyst', time: '15:20', sentiment: 'neutral', text: "Can you provide more color on the Vision Pro adoption rates?" },
            { id: '4', speaker: 'Tim Cook', role: 'executive', time: '16:05', sentiment: 'positive', text: "Vision Pro has exceeded our internal expectations in the enterprise sector. Companies are finding incredible use cases." },
            { id: '5', speaker: 'Analyst (Goldman Sachs)', role: 'analyst', time: '22:15', sentiment: 'neutral', text: "How are you thinking about AI capability on the edge vs cloud?" },
            { id: '6', speaker: 'Tim Cook', role: 'executive', time: '23:00', sentiment: 'positive', text: "We believe our silicon advantage allows us to run more impactful AI models directly on-device, preserving privacy and reducing latency." }
        ]
    },
    TSLA: {
        symbol: 'TSLA',
        quarter: 'Q4',
        year: 2024,
        date: 'Jan 24, 2025',
        segments: [
            { id: '1', speaker: 'Elon Musk', role: 'executive', time: '04:00', sentiment: 'positive', text: "This was a record quarter. The demand for Cybertruck is off the charts." },
            { id: '2', speaker: 'Vaibhav Taneja', role: 'executive', time: '09:15', sentiment: 'neutral', text: "We continue to focus on cost reductions. COGS per vehicle declined sequentially." },
            { id: '3', speaker: 'Elon Musk', role: 'executive', time: '12:45', sentiment: 'positive', text: "FSD Beta v12 is a step change. It's end-to-end neural nets. It feels like a human driving." },
            { id: '4', speaker: 'Analyst (Wolfe Research)', role: 'analyst', time: '18:30', sentiment: 'negative', text: "Are you concerned about the recent price cuts impacting margins long term?" },
            { id: '5', speaker: 'Elon Musk', role: 'executive', time: '19:10', sentiment: 'neutral', text: "We want to make our cars accessible. Affordability is the key limit to volume." }
        ]
    },
    MSFT: {
        symbol: 'MSFT',
        quarter: 'Q2',
        year: 2025,
        date: 'Jan 28, 2025',
        segments: [
            { id: '1', speaker: 'Satya Nadella', role: 'executive', time: '03:30', sentiment: 'positive', text: "We've moved from talking about AI to applying AI at scale. Copilot is becoming an everyday habit for millions." },
            { id: '2', speaker: 'Amy Hood', role: 'executive', time: '07:45', sentiment: 'neutral', text: "Azure growth was 30% in constant currency, with 6 points from AI services." },
            { id: '3', speaker: 'Analyst (Jefferies)', role: 'analyst', time: '14:20', sentiment: 'neutral', text: "Can you update us on the GitHub Copilot monetization curve?" },
            { id: '4', speaker: 'Satya Nadella', role: 'executive', time: '15:10', sentiment: 'positive', text: "It's effectively standard issue for developers now. Productivity gains are undeniable." }
        ]
    }
};

export async function getTranscript(symbol: string): Promise<EarningsCall | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockTranscripts[symbol] || null;
}

export function searchTranscripts(transcript: EarningsCall, query: string): TranscriptSegment[] {
    if (!query) return transcript.segments;
    const lowerQuery = query.toLowerCase();
    return transcript.segments.filter(s =>
        s.text.toLowerCase().includes(lowerQuery) ||
        s.speaker.toLowerCase().includes(lowerQuery)
    );
}
