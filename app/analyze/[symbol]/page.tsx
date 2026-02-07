import { getStockData } from '@/lib/finnhub';
import { mapFinnhubToStockData, stockDatabase } from '@/lib/stock-data';
import { StockAnalysisClient } from '@/components/stock-analysis-client';
import { Header } from '@/components/header';
import Link from 'next/link';

interface PageParams {
  symbol: string;
}

export default async function StockAnalysisPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  let stock = null;

  // Try to fetch real data
  try {
    const rawData = await getStockData(upperSymbol);
    stock = mapFinnhubToStockData(rawData);
  } catch (e) {
    console.error("Failed to fetch stock data", e);
  }

  // Fallback to mock database if API fails
  if (!stock && stockDatabase[upperSymbol]) {
    stock = stockDatabase[upperSymbol];
    // Mark as Mock/Demo data
    stock.source = "Demo Data";
    stock.lastUpdated = new Date().toISOString();
  }

  if (!stock) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20 px-4 pb-12">
          <div className="max-w-4xl mx-auto text-center py-20">
            <div className="text-6? sm:text-8xl mb-6 opacity-20 font-bold select-none">404</div>
            <h1 className="text-3xl font-bold uppercase tracking-tight mb-4">Stock Not Found</h1>
            <p className="text-muted-foreground mb-12 max-w-md mx-auto">
              We couldn&apos;t find data for <span className="text-foreground font-bold underline">{upperSymbol}</span>.
              Our AI scouts are currently only monitoring major US stocks and legendary favorites.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-12">
              {['AAPL', 'NVDA', 'TSLA', 'MSFT', 'META', 'BRK.B', 'GOOGL', 'AMZN'].map(t => (
                <Link
                  key={t}
                  href={`/analyze/${t}`}
                  className="border-2 border-foreground p-3 hover:bg-foreground hover:text-background transition-all font-bold text-sm"
                >
                  {t}
                </Link>
              ))}
            </div>

            <Link
              href="/screener"
              className="inline-block bg-primary text-white border-2 border-primary px-8 py-3 font-bold uppercase tracking-widest hover:bg-transparent hover:text-primary transition-all"
            >
              Back to Stock Screener
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return <StockAnalysisClient stock={stock} />;
}
