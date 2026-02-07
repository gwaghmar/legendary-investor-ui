'use client';

type FilterState = {
    marketCap: string;
    pe: string;
    growth: string;
    sector: string;
    frameworks: string[];
};

export interface ScanTemplate {
    id: string;
    name: string;
    description: string;
    filters: FilterState;
}

const templates: ScanTemplate[] = [
    {
        id: 'quality-compounders',
        name: '💎 Quality Compounders',
        description: 'Buffett-style quality: High ROIC, Mega Cap, Fair Price',
        filters: {
            marketCap: 'large',
            pe: 'mid',
            growth: 'mid',
            sector: 'all',
            frameworks: ['buffett']
        }
    },
    {
        id: 'deep-value',
        name: '📉 Deep Value',
        description: 'Burry-style: Low P/E, potentially ignored stocks',
        filters: {
            marketCap: 'all',
            pe: 'low',
            growth: 'all',
            sector: 'all',
            frameworks: ['burry']
        }
    },
    {
        id: 'growth-at-reasonable-price',
        name: '🚀 GARP (Lynch)',
        description: 'Lynch-style: Good growth without overpaying',
        filters: {
            marketCap: 'mid',
            pe: 'mid',
            growth: 'high',
            sector: 'all',
            frameworks: ['lynch']
        }
    },
    {
        id: 'tech-momentum',
        name: '⚡ Tech Momentum',
        description: 'High growth technology stocks',
        filters: {
            marketCap: 'all',
            pe: 'all',
            growth: 'high',
            sector: 'Technology',
            frameworks: ['druckenmiller']
        }
    },
    {
        id: 'magic-formula',
        name: '✨ Magic Formula',
        description: 'Greenblatt: High ROIC + Low Earnings Yield',
        filters: {
            marketCap: 'large',
            pe: 'low',
            growth: 'all',
            sector: 'all',
            frameworks: ['magic']
        }
    },
    {
        id: 'dividend-aristocrats',
        name: '💰 Dividend Yield',
        description: 'Value stocks in stable sectors',
        filters: {
            marketCap: 'large',
            pe: 'mid',
            growth: 'low',
            sector: 'all', // Should ideally allow multiple sectors or filter by yield
            frameworks: ['buffett']
        }
    }
];

interface ScanTemplatesProps {
    onSelect: (filters: FilterState) => void;
}

export function ScanTemplates({ onSelect }: ScanTemplatesProps) {
    return (
        <div className="mb-6">
            <div className="text-xs text-muted-foreground uppercase tracking-tight mb-3">
                Quick Scans
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {templates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => onSelect(template.filters)}
                        className="flex flex-col items-start p-3 border-2 border-foreground/20 hover:border-foreground hover:bg-secondary/10 transition-all text-left group"
                    >
                        <span className="font-bold text-sm group-hover:text-primary transition-colors">
                            {template.name}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                            {template.description}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
