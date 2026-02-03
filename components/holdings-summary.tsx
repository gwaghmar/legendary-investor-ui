'use client';

interface Holding {
  symbol: string;
  shares: number;
  price: number;
  value: number;
  percentage: number;
}

interface HoldingsSummaryProps {
  holdings: Holding[];
  totalValue: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export function HoldingsSummary({ holdings, totalValue, riskLevel }: HoldingsSummaryProps) {
  const riskColors = {
    LOW: '#059669',
    MEDIUM: '#D97706',
    HIGH: '#DC2626',
  };

  return (
    <div className="border-2 border-foreground p-4 sm:p-6">
      <div className="text-xs text-muted-foreground uppercase tracking-tight mb-4">
        Your Holdings
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-6 min-w-max pb-4">
          {holdings.map((holding) => (
            <div key={holding.symbol} className="flex flex-col items-center min-w-[80px]">
              <span className="font-bold text-sm">{holding.symbol}</span>
              <span className="text-xs text-muted-foreground">{holding.shares} shares</span>
              <span className="text-sm font-bold mt-1">${holding.value.toLocaleString()}</span>

              {/* Bar representation */}
              <div className="w-full h-2 bg-secondary mt-2">
                <div
                  className="h-full bg-foreground"
                  style={{ width: `${Math.min(holding.percentage * 2, 100)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {holding.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-foreground/20">
        <div>
          <span className="text-sm text-muted-foreground">Total Value: </span>
          <span className="font-bold">${totalValue.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Risk Level:</span>
          <span
            className="text-xs font-bold px-2 py-1"
            style={{
              backgroundColor: riskColors[riskLevel],
              color: '#FFFFFF',
            }}
          >
            {riskLevel}
          </span>
        </div>
      </div>
    </div>
  );
}
