export interface InsiderTransaction {
    id: string;
    date: string;
    insiderName: string;
    title: string;
    type: 'Buy' | 'Sell' | 'Option Exercise';
    shares: number;
    price: number;
    value: number; // calculated as shares * price
}

export type ClusterSignal = 'Bullish' | 'Bearish' | 'Neutral';

// Mock Data
const mockTransactions: Record<string, InsiderTransaction[]> = {
    AAPL: [
        { id: '1', date: '2025-01-15', insiderName: 'Levinson Arthur D', title: 'Director', type: 'Sell', shares: 10000, price: 185.50, value: 1855000 },
        { id: '2', date: '2025-01-10', insiderName: 'Adams Katherine L', title: 'General Counsel', type: 'Sell', shares: 5000, price: 184.20, value: 921000 },
    ],
    TSLA: [
        { id: '1', date: '2025-02-01', insiderName: 'Musk Elon', title: 'CEO', type: 'Buy', shares: 50000, price: 180.00, value: 9000000 },
        { id: '2', date: '2025-01-28', insiderName: 'Denholm Robyn', title: 'Director', type: 'Buy', shares: 2000, price: 178.50, value: 357000 },
        { id: '3', date: '2025-01-15', insiderName: 'Baglino Andrew', title: 'SVP', type: 'Option Exercise', shares: 1000, price: 0, value: 0 },
    ],
    MSFT: [
        { id: '1', date: '2025-01-20', insiderName: 'Nadella Satya', title: 'CEO', type: 'Sell', shares: 15000, price: 405.00, value: 6075000 },
    ],
    // Fallback for others
    DEFAULT: [
        { id: '1', date: '2024-12-15', insiderName: 'Doe John', title: 'CFO', type: 'Sell', shares: 1200, price: 150.00, value: 180000 },
        { id: '2', date: '2024-11-20', insiderName: 'Smith Jane', title: 'Director', type: 'Buy', shares: 500, price: 145.00, value: 72500 }
    ]
};

export async function getInsiderTransactions(symbol: string): Promise<InsiderTransaction[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockTransactions[symbol] || mockTransactions['DEFAULT'];
}

export function analyzeCluster(transactions: InsiderTransaction[]): ClusterSignal {
    const buys = transactions.filter(t => t.type === 'Buy').length;
    const sells = transactions.filter(t => t.type === 'Sell').length;

    if (buys >= 2 && sells === 0) return 'Bullish';
    if (sells >= 3 && buys === 0) return 'Bearish';
    return 'Neutral';
}
