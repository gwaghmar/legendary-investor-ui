'use client';

import { useState, useMemo, useEffect } from 'react';
import { StockAutocomplete } from '@/components/stock-autocomplete';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ScanTemplates } from '@/components/scan-templates';

interface ScreenerStock {
  symbol: string;
  name: string;
  pe: number;
  growth: number;
  roic: number;
  magicScore: number;
  buffettScore: number;
  verdict: 'STRONG BUY' | 'BUY' | 'HOLD' | 'SELL';
  sector: string;
  marketCap: string;
}

// Metric explanations for tooltips
const metricTooltips: Record<string, string> = {
  pe: "P/E Ratio: How many $ you pay for $1 of earnings. Lower = cheaper stock. Under 15 is cheap, over 30 is expensive.",
  growth: "Revenue Growth: How fast the company's sales are growing. Above 20% is great, negative means shrinking.",
  roic: "Return on Capital: How well the company turns invested money into profit. Above 15% is excellent!",
  magic: "Magic Score: Greenblatt's formula combining cheap price + high returns. Higher = better value.",
  buffett: "Buffett Score: Based on Warren's rules - strong moat, fair price, quality business. 80+ is great.",
  verdict: "AI Verdict: Our combined rating based on all frameworks. STRONG BUY = rare gem!",
};

// Fallback data - 100+ stocks including S&P 500, ETFs, and major sectors
const fallbackData: ScreenerStock[] = [
  // ===== ETFs =====
  { symbol: 'SPY', name: 'S&P 500 ETF', pe: 25, growth: 10, roic: 15, magicScore: 70, buffettScore: 80, verdict: 'BUY', sector: 'ETF', marketCap: '$550B' },
  { symbol: 'QQQ', name: 'Nasdaq 100 ETF', pe: 32, growth: 18, roic: 20, magicScore: 72, buffettScore: 78, verdict: 'BUY', sector: 'ETF', marketCap: '$280B' },
  { symbol: 'IWM', name: 'Russell 2000 ETF', pe: 18, growth: 8, roic: 12, magicScore: 65, buffettScore: 68, verdict: 'HOLD', sector: 'ETF', marketCap: '$75B' },
  { symbol: 'DIA', name: 'Dow Jones ETF', pe: 22, growth: 6, roic: 14, magicScore: 68, buffettScore: 75, verdict: 'HOLD', sector: 'ETF', marketCap: '$35B' },
  { symbol: 'VOO', name: 'Vanguard S&P 500', pe: 25, growth: 10, roic: 15, magicScore: 70, buffettScore: 82, verdict: 'BUY', sector: 'ETF', marketCap: '$450B' },
  { symbol: 'VTI', name: 'Vanguard Total Market', pe: 24, growth: 9, roic: 14, magicScore: 68, buffettScore: 80, verdict: 'BUY', sector: 'ETF', marketCap: '$400B' },
  { symbol: 'ARKK', name: 'ARK Innovation', pe: 45, growth: 30, roic: 8, magicScore: 45, buffettScore: 40, verdict: 'SELL', sector: 'ETF', marketCap: '$8B' },
  { symbol: 'XLF', name: 'Financial Select ETF', pe: 14, growth: 5, roic: 12, magicScore: 62, buffettScore: 70, verdict: 'HOLD', sector: 'ETF', marketCap: '$45B' },
  { symbol: 'XLE', name: 'Energy Select ETF', pe: 12, growth: -5, roic: 15, magicScore: 58, buffettScore: 65, verdict: 'HOLD', sector: 'ETF', marketCap: '$40B' },
  { symbol: 'XLK', name: 'Technology Select ETF', pe: 35, growth: 20, roic: 25, magicScore: 75, buffettScore: 78, verdict: 'BUY', sector: 'ETF', marketCap: '$70B' },

  // ===== MEGA CAP TECH =====
  { symbol: 'AAPL', name: 'Apple', pe: 32, growth: 8, roic: 150, magicScore: 75, buffettScore: 92, verdict: 'HOLD', sector: 'Technology', marketCap: '$3.8T' },
  { symbol: 'GOOGL', name: 'Alphabet', pe: 22, growth: 15, roic: 32, magicScore: 82, buffettScore: 88, verdict: 'BUY', sector: 'Technology', marketCap: '$2.4T' },
  { symbol: 'MSFT', name: 'Microsoft', pe: 35, growth: 12, roic: 42, magicScore: 78, buffettScore: 90, verdict: 'BUY', sector: 'Technology', marketCap: '$3.1T' },
  { symbol: 'NVDA', name: 'NVIDIA', pe: 65, growth: 122, roic: 89, magicScore: 72, buffettScore: 85, verdict: 'HOLD', sector: 'Technology', marketCap: '$4.5T' },
  { symbol: 'META', name: 'Meta', pe: 25, growth: 18, roic: 35, magicScore: 80, buffettScore: 82, verdict: 'BUY', sector: 'Technology', marketCap: '$1.7T' },
  { symbol: 'AMZN', name: 'Amazon', pe: 42, growth: 20, roic: 15, magicScore: 68, buffettScore: 75, verdict: 'HOLD', sector: 'Technology', marketCap: '$2.2T' },
  { symbol: 'TSM', name: 'TSMC', pe: 28, growth: 25, roic: 30, magicScore: 80, buffettScore: 78, verdict: 'BUY', sector: 'Technology', marketCap: '$900B' },
  { symbol: 'AVGO', name: 'Broadcom', pe: 35, growth: 30, roic: 45, magicScore: 85, buffettScore: 82, verdict: 'BUY', sector: 'Technology', marketCap: '$800B' },

  // ===== AI & CLOUD =====
  { symbol: 'CRM', name: 'Salesforce', pe: 45, growth: 12, roic: 18, magicScore: 65, buffettScore: 70, verdict: 'HOLD', sector: 'Technology', marketCap: '$320B' },
  { symbol: 'PLTR', name: 'Palantir', pe: 180, growth: 40, roic: 12, magicScore: 45, buffettScore: 50, verdict: 'SELL', sector: 'Technology', marketCap: '$180B' },
  { symbol: 'CRWD', name: 'CrowdStrike', pe: 75, growth: 35, roic: 22, magicScore: 60, buffettScore: 65, verdict: 'HOLD', sector: 'Technology', marketCap: '$95B' },
  { symbol: 'MU', name: 'Micron', pe: 7, growth: 98, roic: 24, magicScore: 94, buffettScore: 78, verdict: 'STRONG BUY', sector: 'Technology', marketCap: '$140B' },
  { symbol: 'AMD', name: 'AMD', pe: 40, growth: 45, roic: 28, magicScore: 72, buffettScore: 70, verdict: 'HOLD', sector: 'Technology', marketCap: '$200B' },
  { symbol: 'INTC', name: 'Intel', pe: 15, growth: -8, roic: 5, magicScore: 45, buffettScore: 55, verdict: 'SELL', sector: 'Technology', marketCap: '$100B' },
  { symbol: 'QCOM', name: 'Qualcomm', pe: 18, growth: 12, roic: 35, magicScore: 78, buffettScore: 75, verdict: 'BUY', sector: 'Technology', marketCap: '$200B' },
  { symbol: 'ORCL', name: 'Oracle', pe: 25, growth: 15, roic: 28, magicScore: 72, buffettScore: 75, verdict: 'BUY', sector: 'Technology', marketCap: '$400B' },
  { symbol: 'NOW', name: 'ServiceNow', pe: 70, growth: 25, roic: 30, magicScore: 68, buffettScore: 70, verdict: 'HOLD', sector: 'Technology', marketCap: '$200B' },
  { symbol: 'SNOW', name: 'Snowflake', pe: 200, growth: 35, roic: 5, magicScore: 35, buffettScore: 40, verdict: 'SELL', sector: 'Technology', marketCap: '$60B' },
  { symbol: 'NET', name: 'Cloudflare', pe: 150, growth: 30, roic: 8, magicScore: 40, buffettScore: 45, verdict: 'SELL', sector: 'Technology', marketCap: '$35B' },
  { symbol: 'DDOG', name: 'Datadog', pe: 85, growth: 28, roic: 15, magicScore: 55, buffettScore: 58, verdict: 'HOLD', sector: 'Technology', marketCap: '$45B' },

  // ===== FINANCE =====
  { symbol: 'JPM', name: 'JPMorgan', pe: 12, growth: 8, roic: 15, magicScore: 75, buffettScore: 80, verdict: 'BUY', sector: 'Financial', marketCap: '$700B' },
  { symbol: 'V', name: 'Visa', pe: 30, growth: 10, roic: 45, magicScore: 82, buffettScore: 88, verdict: 'BUY', sector: 'Financial', marketCap: '$620B' },
  { symbol: 'MA', name: 'Mastercard', pe: 35, growth: 12, roic: 55, magicScore: 85, buffettScore: 90, verdict: 'BUY', sector: 'Financial', marketCap: '$480B' },
  { symbol: 'BAC', name: 'Bank of America', pe: 10, growth: 5, roic: 10, magicScore: 62, buffettScore: 72, verdict: 'HOLD', sector: 'Financial', marketCap: '$350B' },
  { symbol: 'GS', name: 'Goldman Sachs', pe: 14, growth: 8, roic: 12, magicScore: 68, buffettScore: 75, verdict: 'BUY', sector: 'Financial', marketCap: '$180B' },
  { symbol: 'WFC', name: 'Wells Fargo', pe: 11, growth: 4, roic: 10, magicScore: 60, buffettScore: 68, verdict: 'HOLD', sector: 'Financial', marketCap: '$220B' },
  { symbol: 'MS', name: 'Morgan Stanley', pe: 15, growth: 6, roic: 14, magicScore: 66, buffettScore: 72, verdict: 'HOLD', sector: 'Financial', marketCap: '$170B' },
  { symbol: 'C', name: 'Citigroup', pe: 8, growth: 2, roic: 8, magicScore: 55, buffettScore: 60, verdict: 'HOLD', sector: 'Financial', marketCap: '$130B' },
  { symbol: 'AXP', name: 'American Express', pe: 20, growth: 10, roic: 30, magicScore: 75, buffettScore: 85, verdict: 'BUY', sector: 'Financial', marketCap: '$200B' },
  { symbol: 'SCHW', name: 'Charles Schwab', pe: 18, growth: 8, roic: 18, magicScore: 68, buffettScore: 72, verdict: 'HOLD', sector: 'Financial', marketCap: '$130B' },
  { symbol: 'BLK', name: 'BlackRock', pe: 22, growth: 10, roic: 15, magicScore: 72, buffettScore: 78, verdict: 'BUY', sector: 'Financial', marketCap: '$150B' },
  { symbol: 'PYPL', name: 'PayPal', pe: 18, growth: 8, roic: 15, magicScore: 65, buffettScore: 65, verdict: 'HOLD', sector: 'Financial', marketCap: '$80B' },
  { symbol: 'SQ', name: 'Block (Square)', pe: 35, growth: 20, roic: 12, magicScore: 58, buffettScore: 60, verdict: 'HOLD', sector: 'Financial', marketCap: '$50B' },

  // ===== HEALTHCARE =====
  { symbol: 'UNH', name: 'UnitedHealth', pe: 18, growth: 12, roic: 25, magicScore: 80, buffettScore: 82, verdict: 'BUY', sector: 'Healthcare', marketCap: '$450B' },
  { symbol: 'LLY', name: 'Eli Lilly', pe: 85, growth: 50, roic: 45, magicScore: 78, buffettScore: 80, verdict: 'HOLD', sector: 'Healthcare', marketCap: '$800B' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', pe: 15, growth: 3, roic: 22, magicScore: 65, buffettScore: 85, verdict: 'HOLD', sector: 'Healthcare', marketCap: '$380B' },
  { symbol: 'PFE', name: 'Pfizer', pe: 12, growth: -15, roic: 8, magicScore: 50, buffettScore: 60, verdict: 'SELL', sector: 'Healthcare', marketCap: '$160B' },
  { symbol: 'ABBV', name: 'AbbVie', pe: 14, growth: 5, roic: 25, magicScore: 72, buffettScore: 78, verdict: 'BUY', sector: 'Healthcare', marketCap: '$320B' },
  { symbol: 'MRK', name: 'Merck', pe: 16, growth: 8, roic: 28, magicScore: 75, buffettScore: 80, verdict: 'BUY', sector: 'Healthcare', marketCap: '$280B' },
  { symbol: 'TMO', name: 'Thermo Fisher', pe: 28, growth: 10, roic: 18, magicScore: 68, buffettScore: 75, verdict: 'HOLD', sector: 'Healthcare', marketCap: '$200B' },
  { symbol: 'DHR', name: 'Danaher', pe: 30, growth: 8, roic: 15, magicScore: 65, buffettScore: 72, verdict: 'HOLD', sector: 'Healthcare', marketCap: '$180B' },
  { symbol: 'BMY', name: 'Bristol-Myers', pe: 8, growth: -5, roic: 20, magicScore: 62, buffettScore: 68, verdict: 'HOLD', sector: 'Healthcare', marketCap: '$100B' },
  { symbol: 'AMGN', name: 'Amgen', pe: 20, growth: 5, roic: 35, magicScore: 72, buffettScore: 78, verdict: 'BUY', sector: 'Healthcare', marketCap: '$160B' },
  { symbol: 'GILD', name: 'Gilead Sciences', pe: 12, growth: 2, roic: 25, magicScore: 70, buffettScore: 72, verdict: 'HOLD', sector: 'Healthcare', marketCap: '$110B' },
  { symbol: 'ISRG', name: 'Intuitive Surgical', pe: 75, growth: 15, roic: 22, magicScore: 60, buffettScore: 68, verdict: 'HOLD', sector: 'Healthcare', marketCap: '$180B' },

  // ===== CONSUMER =====
  { symbol: 'COST', name: 'Costco', pe: 55, growth: 8, roic: 28, magicScore: 70, buffettScore: 85, verdict: 'HOLD', sector: 'Consumer', marketCap: '$400B' },
  { symbol: 'HD', name: 'Home Depot', pe: 25, growth: 4, roic: 45, magicScore: 78, buffettScore: 82, verdict: 'BUY', sector: 'Consumer', marketCap: '$380B' },
  { symbol: 'WMT', name: 'Walmart', pe: 30, growth: 5, roic: 18, magicScore: 68, buffettScore: 78, verdict: 'HOLD', sector: 'Consumer', marketCap: '$600B' },
  { symbol: 'KO', name: 'Coca-Cola', pe: 25, growth: 3, roic: 35, magicScore: 68, buffettScore: 90, verdict: 'HOLD', sector: 'Consumer', marketCap: '$280B' },
  { symbol: 'PEP', name: 'PepsiCo', pe: 24, growth: 4, roic: 30, magicScore: 70, buffettScore: 85, verdict: 'HOLD', sector: 'Consumer', marketCap: '$230B' },
  { symbol: 'MCD', name: 'McDonalds', pe: 28, growth: 6, roic: 42, magicScore: 75, buffettScore: 85, verdict: 'BUY', sector: 'Consumer', marketCap: '$220B' },
  { symbol: 'NKE', name: 'Nike', pe: 28, growth: 8, roic: 35, magicScore: 72, buffettScore: 80, verdict: 'HOLD', sector: 'Consumer', marketCap: '$120B' },
  { symbol: 'TSLA', name: 'Tesla', pe: 80, growth: 25, roic: 22, magicScore: 55, buffettScore: 60, verdict: 'HOLD', sector: 'Consumer', marketCap: '$800B' },
  { symbol: 'SBUX', name: 'Starbucks', pe: 25, growth: 5, roic: 30, magicScore: 68, buffettScore: 78, verdict: 'HOLD', sector: 'Consumer', marketCap: '$110B' },
  { symbol: 'TGT', name: 'Target', pe: 15, growth: 2, roic: 18, magicScore: 62, buffettScore: 70, verdict: 'HOLD', sector: 'Consumer', marketCap: '$70B' },
  { symbol: 'LOW', name: 'Lowes', pe: 20, growth: 3, roic: 40, magicScore: 75, buffettScore: 78, verdict: 'BUY', sector: 'Consumer', marketCap: '$145B' },
  { symbol: 'DIS', name: 'Disney', pe: 35, growth: 5, roic: 8, magicScore: 55, buffettScore: 65, verdict: 'HOLD', sector: 'Consumer', marketCap: '$200B' },
  { symbol: 'NFLX', name: 'Netflix', pe: 45, growth: 15, roic: 25, magicScore: 68, buffettScore: 72, verdict: 'HOLD', sector: 'Consumer', marketCap: '$300B' },
  { symbol: 'ABNB', name: 'Airbnb', pe: 25, growth: 18, roic: 35, magicScore: 75, buffettScore: 72, verdict: 'BUY', sector: 'Consumer', marketCap: '$100B' },
  { symbol: 'BKNG', name: 'Booking Holdings', pe: 22, growth: 12, roic: 45, magicScore: 80, buffettScore: 78, verdict: 'BUY', sector: 'Consumer', marketCap: '$160B' },
  { symbol: 'UBER', name: 'Uber', pe: 35, growth: 20, roic: 15, magicScore: 62, buffettScore: 65, verdict: 'HOLD', sector: 'Consumer', marketCap: '$180B' },
  { symbol: 'CMG', name: 'Chipotle', pe: 55, growth: 15, roic: 35, magicScore: 72, buffettScore: 75, verdict: 'HOLD', sector: 'Consumer', marketCap: '$85B' },
  { symbol: 'YUM', name: 'Yum! Brands', pe: 28, growth: 6, roic: 40, magicScore: 72, buffettScore: 78, verdict: 'BUY', sector: 'Consumer', marketCap: '$40B' },

  // ===== ENERGY =====
  { symbol: 'XOM', name: 'Exxon', pe: 14, growth: -5, roic: 18, magicScore: 65, buffettScore: 70, verdict: 'HOLD', sector: 'Energy', marketCap: '$500B' },
  { symbol: 'CVX', name: 'Chevron', pe: 12, growth: -8, roic: 15, magicScore: 60, buffettScore: 72, verdict: 'HOLD', sector: 'Energy', marketCap: '$280B' },
  { symbol: 'COP', name: 'ConocoPhillips', pe: 10, growth: -5, roic: 18, magicScore: 68, buffettScore: 72, verdict: 'HOLD', sector: 'Energy', marketCap: '$130B' },
  { symbol: 'SLB', name: 'Schlumberger', pe: 15, growth: 8, roic: 15, magicScore: 65, buffettScore: 68, verdict: 'HOLD', sector: 'Energy', marketCap: '$70B' },
  { symbol: 'EOG', name: 'EOG Resources', pe: 9, growth: 5, roic: 22, magicScore: 75, buffettScore: 75, verdict: 'BUY', sector: 'Energy', marketCap: '$75B' },

  // ===== INDUSTRIALS =====
  { symbol: 'CAT', name: 'Caterpillar', pe: 18, growth: 8, roic: 28, magicScore: 75, buffettScore: 78, verdict: 'BUY', sector: 'Industrial', marketCap: '$180B' },
  { symbol: 'DE', name: 'John Deere', pe: 15, growth: 5, roic: 30, magicScore: 78, buffettScore: 80, verdict: 'BUY', sector: 'Industrial', marketCap: '$130B' },
  { symbol: 'UPS', name: 'UPS', pe: 18, growth: 3, roic: 35, magicScore: 72, buffettScore: 78, verdict: 'BUY', sector: 'Industrial', marketCap: '$120B' },
  { symbol: 'RTX', name: 'RTX (Raytheon)', pe: 22, growth: 8, roic: 12, magicScore: 65, buffettScore: 72, verdict: 'HOLD', sector: 'Industrial', marketCap: '$150B' },
  { symbol: 'HON', name: 'Honeywell', pe: 25, growth: 6, roic: 22, magicScore: 68, buffettScore: 75, verdict: 'HOLD', sector: 'Industrial', marketCap: '$140B' },
  { symbol: 'BA', name: 'Boeing', pe: 40, growth: 15, roic: 5, magicScore: 45, buffettScore: 55, verdict: 'HOLD', sector: 'Industrial', marketCap: '$180B' },
  { symbol: 'GE', name: 'GE Aerospace', pe: 35, growth: 20, roic: 18, magicScore: 65, buffettScore: 70, verdict: 'HOLD', sector: 'Industrial', marketCap: '$200B' },
  { symbol: 'LMT', name: 'Lockheed Martin', pe: 18, growth: 5, roic: 50, magicScore: 82, buffettScore: 85, verdict: 'BUY', sector: 'Industrial', marketCap: '$120B' },
  { symbol: 'MMM', name: '3M', pe: 12, growth: -2, roic: 18, magicScore: 58, buffettScore: 65, verdict: 'HOLD', sector: 'Industrial', marketCap: '$70B' },
  { symbol: 'FDX', name: 'FedEx', pe: 14, growth: 5, roic: 12, magicScore: 62, buffettScore: 68, verdict: 'HOLD', sector: 'Industrial', marketCap: '$70B' },

  // ===== UTILITIES & REITS =====
  { symbol: 'NEE', name: 'NextEra Energy', pe: 22, growth: 8, roic: 10, magicScore: 60, buffettScore: 72, verdict: 'HOLD', sector: 'Utilities', marketCap: '$160B' },
  { symbol: 'DUK', name: 'Duke Energy', pe: 18, growth: 3, roic: 8, magicScore: 55, buffettScore: 68, verdict: 'HOLD', sector: 'Utilities', marketCap: '$85B' },
  { symbol: 'SO', name: 'Southern Company', pe: 20, growth: 4, roic: 9, magicScore: 58, buffettScore: 70, verdict: 'HOLD', sector: 'Utilities', marketCap: '$95B' },
  { symbol: 'AMT', name: 'American Tower', pe: 40, growth: 5, roic: 12, magicScore: 55, buffettScore: 65, verdict: 'HOLD', sector: 'REIT', marketCap: '$100B' },
  { symbol: 'PLD', name: 'Prologis', pe: 35, growth: 8, roic: 8, magicScore: 52, buffettScore: 62, verdict: 'HOLD', sector: 'REIT', marketCap: '$120B' },
  { symbol: 'O', name: 'Realty Income', pe: 45, growth: 3, roic: 5, magicScore: 48, buffettScore: 65, verdict: 'HOLD', sector: 'REIT', marketCap: '$50B' },

  // ===== TELECOM & MEDIA =====
  { symbol: 'T', name: 'AT&T', pe: 8, growth: -2, roic: 8, magicScore: 55, buffettScore: 62, verdict: 'HOLD', sector: 'Telecom', marketCap: '$150B' },
  { symbol: 'VZ', name: 'Verizon', pe: 9, growth: 1, roic: 12, magicScore: 60, buffettScore: 68, verdict: 'HOLD', sector: 'Telecom', marketCap: '$170B' },
  { symbol: 'TMUS', name: 'T-Mobile', pe: 25, growth: 10, roic: 15, magicScore: 68, buffettScore: 72, verdict: 'BUY', sector: 'Telecom', marketCap: '$250B' },
  { symbol: 'CMCSA', name: 'Comcast', pe: 12, growth: 2, roic: 15, magicScore: 62, buffettScore: 70, verdict: 'HOLD', sector: 'Telecom', marketCap: '$160B' },
  { symbol: 'CHTR', name: 'Charter Comm', pe: 10, growth: 3, roic: 12, magicScore: 60, buffettScore: 65, verdict: 'HOLD', sector: 'Telecom', marketCap: '$55B' },
];

type Framework = 'magic' | 'buffett' | 'lynch' | 'burry' | 'druckenmiller';
type SortField = 'symbol' | 'pe' | 'growth' | 'roic' | 'magicScore' | 'buffettScore' | 'verdict';
type SortDirection = 'asc' | 'desc';

export default function ScreenerPage() {
  const [screenerData, setScreenerData] = useState<ScreenerStock[]>(fallbackData);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'live' | 'cached' | 'fallback'>('fallback');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const [selectedFrameworks, setSelectedFrameworks] = useState<Framework[]>(['magic', 'buffett']);
  const [marketCapFilter, setMarketCapFilter] = useState('all');
  const [peFilter, setPeFilter] = useState('all');
  const [growthFilter, setGrowthFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('magicScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Fetch real data on mount
  useEffect(() => {
    async function fetchScreenerData() {
      try {
        // Check localStorage cache first (valid for 15 minutes)
        const cached = localStorage.getItem('screenerData');
        const cachedTime = localStorage.getItem('screenerDataTime');
        const now = Date.now();

        if (cached && cachedTime && (now - parseInt(cachedTime)) < 15 * 60 * 1000) {
          const parsedData = JSON.parse(cached);
          setScreenerData(parsedData);
          setDataSource('cached');
          setLastUpdated(new Date(parseInt(cachedTime)).toLocaleTimeString());
          setIsLoading(false);
          return;
        }

        // Fetch fresh data
        const res = await fetch('/api/screener');
        const data = await res.json();

        if (data.success && data.stocks?.length > 0) {
          setScreenerData(data.stocks);
          setDataSource('live');
          setLastUpdated(new Date().toLocaleTimeString());

          // Cache the data
          localStorage.setItem('screenerData', JSON.stringify(data.stocks));
          localStorage.setItem('screenerDataTime', now.toString());
        }
      } catch (error) {
        console.error('Failed to fetch screener data:', error);
        setDataSource('fallback');
      } finally {
        setIsLoading(false);
      }
    }

    fetchScreenerData();
  }, []);


  const frameworks: { id: Framework; label: string; color: string }[] = [
    { id: 'magic', label: 'Greenblatt Magic Formula', color: '#10B981' },
    { id: 'buffett', label: 'Buffett Quality', color: '#3B82F6' },
    { id: 'lynch', label: 'Lynch GARP', color: '#8B5CF6' },
    { id: 'burry', label: 'Burry Deep Value', color: '#EF4444' },
    { id: 'druckenmiller', label: 'Druckenmiller Macro', color: '#F59E0B' },
  ];

  const toggleFramework = (framework: Framework) => {
    setSelectedFrameworks((prev) =>
      prev.includes(framework)
        ? prev.filter((f) => f !== framework)
        : [...prev, framework]
    );
  };

  const filteredData = useMemo(() => {
    let data = [...screenerData];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      data = data.filter(s =>
        s.symbol.toLowerCase().includes(query) ||
        s.name.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (marketCapFilter !== 'all') {
      const caps: Record<string, (s: ScreenerStock) => boolean> = {
        mega: (s) => s.marketCap.includes('T'),
        large: (s) => s.marketCap.includes('B') && parseFloat(s.marketCap) >= 100,
        mid: (s) => s.marketCap.includes('B') && parseFloat(s.marketCap) < 100,
      };
      if (caps[marketCapFilter]) data = data.filter(caps[marketCapFilter]);
    }

    if (peFilter !== 'all') {
      const pes: Record<string, (s: ScreenerStock) => boolean> = {
        low: (s) => s.pe < 15,
        mid: (s) => s.pe >= 15 && s.pe <= 30,
        high: (s) => s.pe > 30,
      };
      if (pes[peFilter]) data = data.filter(pes[peFilter]);
    }

    if (growthFilter !== 'all') {
      const growths: Record<string, (s: ScreenerStock) => boolean> = {
        high: (s) => s.growth >= 20,
        mid: (s) => s.growth >= 10 && s.growth < 20,
        low: (s) => s.growth < 10,
      };
      if (growths[growthFilter]) data = data.filter(growths[growthFilter]);
    }

    if (sectorFilter !== 'all') {
      data = data.filter((s) => s.sector === sectorFilter);
    }

    // Framework-based scoring - calculate combined score from selected frameworks
    if (selectedFrameworks.length > 0) {
      data = data.map(stock => {
        let combinedScore = 0;
        let count = 0;

        // Magic Formula: Low P/E + High ROIC
        if (selectedFrameworks.includes('magic')) {
          const peScore = Math.max(0, 100 - stock.pe * 2);
          const roicScore = Math.min(100, stock.roic * 2);
          combinedScore += (peScore + roicScore) / 2;
          count++;
        }

        // Buffett: High ROIC + Moat (approximated by market cap)
        if (selectedFrameworks.includes('buffett')) {
          const roicScore = Math.min(100, stock.roic * 2);
          const moatScore = stock.marketCap.includes('T') ? 90 : stock.marketCap.includes('B') ? 70 : 40;
          combinedScore += (roicScore + moatScore) / 2;
          count++;
        }

        // Lynch GARP: Growth at Reasonable Price (PEG-like)
        if (selectedFrameworks.includes('lynch')) {
          const pegLike = stock.growth > 0 ? stock.pe / stock.growth : 100;
          const garpScore = Math.max(0, 100 - pegLike * 20);
          combinedScore += garpScore;
          count++;
        }

        // Burry Deep Value: Very low P/E only
        if (selectedFrameworks.includes('burry')) {
          const deepValueScore = stock.pe < 10 ? 100 : stock.pe < 15 ? 70 : stock.pe < 20 ? 40 : 10;
          combinedScore += deepValueScore;
          count++;
        }

        // Druckenmiller Macro: High growth + momentum
        if (selectedFrameworks.includes('druckenmiller')) {
          const momentumScore = Math.min(100, stock.growth * 3);
          combinedScore += momentumScore;
          count++;
        }

        return { ...stock, _frameworkScore: count > 0 ? combinedScore / count : 50 };
      });

      // Sort by framework score first (highest first)
      data.sort((a, b) => (b as any)._frameworkScore - (a as any)._frameworkScore);
    }

    // Then apply user's selected sort
    if (sortField !== 'symbol') {
      data.sort((a, b) => {
        let aVal: number | string = a[sortField];
        let bVal: number | string = b[sortField];

        if (sortField === 'verdict') {
          const verdictOrder = { 'STRONG BUY': 4, BUY: 3, HOLD: 2, SELL: 1 };
          aVal = verdictOrder[a.verdict];
          bVal = verdictOrder[b.verdict];
        }

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }

        return sortDirection === 'asc'
          ? (aVal as number) - (bVal as number)
          : (bVal as number) - (aVal as number);
      });
    }

    return data;
  }, [screenerData, searchQuery, marketCapFilter, peFilter, growthFilter, sectorFilter, sortField, sortDirection, selectedFrameworks]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, marketCapFilter, peFilter, growthFilter, sectorFilter, pageSize]);

  // Paginate the filtered data
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const verdictColors: Record<string, string> = {
    'STRONG BUY': '#059669',
    BUY: '#059669',
    HOLD: '#D97706',
    SELL: '#DC2626',
  };

  const sectors = [...new Set(screenerData.map((s) => s.sector))];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight">
              Stock Screener
            </h1>
            <div className="flex items-center gap-3">
              {isLoading && (
                <span className="text-xs text-muted-foreground animate-pulse">Loading real data...</span>
              )}
              {!isLoading && (
                <span className={`text-xs px-2 py-1 font-mono ${dataSource === 'live' ? 'bg-green-600 text-white' :
                  dataSource === 'cached' ? 'bg-yellow-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                  {dataSource === 'live' ? '● LIVE' :
                    dataSource === 'cached' ? '● CACHED' :
                      '● DEMO'}
                </span>
              )}
            </div>
          </div>
          <p className="text-muted-foreground mb-2">
            Find opportunities using legendary frameworks
          </p>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mb-4">
              Data from Finnhub • Last updated: {lastUpdated}
            </p>
          )}

          {/* Search Input */}
          <div className="mb-6 relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <StockAutocomplete
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by symbol or company name..."
              inputClassName="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <ScanTemplates
            onSelect={(filters) => {
              setMarketCapFilter(filters.marketCap);
              setPeFilter(filters.pe);
              setGrowthFilter(filters.growth);
              setSectorFilter(filters.sector);
              // Safe cast since we know our frameworks match
              setSelectedFrameworks(filters.frameworks as Framework[]);
            }}
          />

          {/* Frameworks */}
          <div className="border-2 border-foreground p-4 mb-6">
            <div className="text-xs text-muted-foreground uppercase tracking-tight mb-3">
              Frameworks
            </div>
            <div className="flex flex-wrap gap-2">
              {frameworks.map((framework) => {
                const isSelected = selectedFrameworks.includes(framework.id);
                return (
                  <button
                    key={framework.id}
                    onClick={() => toggleFramework(framework.id)}
                    className="text-sm px-3 py-1.5 border-2 transition-colors font-medium"
                    style={{
                      backgroundColor: isSelected ? framework.color : 'transparent',
                      borderColor: framework.color,
                      color: isSelected ? 'white' : framework.color,
                    }}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {isSelected ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" strokeWidth={2} />
                        </svg>
                      )}
                      {framework.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="border-2 border-foreground p-4 mb-6">
            <div className="text-xs text-muted-foreground uppercase tracking-tight mb-3">
              Filters
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Market Cap</label>
                <select
                  value={marketCapFilter}
                  onChange={(e) => setMarketCapFilter(e.target.value)}
                  className="w-full border-2 border-foreground bg-background px-2 py-1.5 text-sm"
                >
                  <option value="all">All</option>
                  <option value="mega">Mega ($1T+)</option>
                  <option value="large">Large ($100B+)</option>
                  <option value="mid">Mid ($10B-100B)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">P/E Ratio</label>
                <select
                  value={peFilter}
                  onChange={(e) => setPeFilter(e.target.value)}
                  className="w-full border-2 border-foreground bg-background px-2 py-1.5 text-sm"
                >
                  <option value="all">Any</option>
                  <option value="low">Low (&lt;15)</option>
                  <option value="mid">Mid (15-30)</option>
                  <option value="high">High (&gt;30)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Revenue Growth</label>
                <select
                  value={growthFilter}
                  onChange={(e) => setGrowthFilter(e.target.value)}
                  className="w-full border-2 border-foreground bg-background px-2 py-1.5 text-sm"
                >
                  <option value="all">Any</option>
                  <option value="high">High (20%+)</option>
                  <option value="mid">Mid (10-20%)</option>
                  <option value="low">Low (&lt;10%)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Sector</label>
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="w-full border-2 border-foreground bg-background px-2 py-1.5 text-sm"
                >
                  <option value="all">All</option>
                  {sectors.map((sector) => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="border-2 border-foreground">
            <div className="p-4 border-b border-foreground/20 flex justify-between items-center">
              <span className="text-xs text-muted-foreground uppercase tracking-tight">
                Showing {paginatedData.length} of {filteredData.length} stocks
              </span>
              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Show:</span>
                {[10, 20, 30].map((size) => (
                  <button
                    key={size}
                    onClick={() => setPageSize(size)}
                    className={`text-xs px-2 py-1 border ${pageSize === size ? 'bg-foreground text-background' : 'border-foreground/30 hover:border-foreground'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b-2 border-foreground">
                  <tr>
                    {[
                      { field: 'symbol' as SortField, label: 'Stock', tooltip: '' },
                      { field: 'pe' as SortField, label: 'P/E', tooltip: 'pe' },
                      { field: 'growth' as SortField, label: 'Growth', tooltip: 'growth' },
                      { field: 'roic' as SortField, label: 'ROIC', tooltip: 'roic' },
                      { field: 'magicScore' as SortField, label: 'Magic', tooltip: 'magic' },
                      { field: 'buffettScore' as SortField, label: 'Buffett', tooltip: 'buffett' },
                      { field: 'verdict' as SortField, label: 'Verdict', tooltip: 'verdict' },
                    ].map(({ field, label, tooltip }) => (
                      <th
                        key={field}
                        onClick={() => handleSort(field)}
                        className="px-4 py-3 text-left font-bold uppercase tracking-tight cursor-pointer hover:bg-secondary relative group"
                        title={tooltip ? metricTooltips[tooltip] : ''}
                      >
                        <span className="flex items-center gap-1">
                          {label}
                          {tooltip && <span className="text-muted-foreground text-xs">ⓘ</span>}
                        </span>
                        {sortField === field && (
                          <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                        {tooltip && (
                          <div className="absolute left-0 top-full z-50 hidden group-hover:block bg-foreground text-background text-xs p-2 rounded shadow-lg w-64 font-normal normal-case">
                            {metricTooltips[tooltip]}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((stock) => (
                    <tr
                      key={stock.symbol}
                      className="border-b border-foreground/10 hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <Link href={`/analyze/${stock.symbol}`} className="hover:underline">
                          <span className="font-bold">{stock.symbol}</span>
                          <span className="text-muted-foreground ml-2">{stock.name}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3">{stock.pe}x</td>
                      <td className={`px-4 py-3 ${stock.growth >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                        {stock.growth >= 0 ? '+' : ''}{stock.growth}%
                      </td>
                      <td className="px-4 py-3">{stock.roic}%</td>
                      <td className="px-4 py-3">{stock.magicScore}</td>
                      <td className="px-4 py-3">{stock.buffettScore}</td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-bold px-2 py-1"
                          style={{
                            backgroundColor: verdictColors[stock.verdict],
                            color: '#FFFFFF',
                          }}
                        >
                          {stock.verdict}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="text-sm border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <span className="text-sm font-mono">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="text-sm border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => {
                // Export CSV functionality
                const headers = ['Symbol', 'Name', 'P/E', 'Growth', 'ROIC', 'Magic Score', 'Buffett Score', 'Verdict', 'Sector', 'Market Cap'];
                const rows = filteredData.map(s => [s.symbol, s.name, s.pe, s.growth, s.roic, s.magicScore, s.buffettScore, s.verdict, s.sector, s.marketCap]);
                const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'screener_results.csv';
                a.click();
              }}
              className="text-sm border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
            >
              <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
            <button
              onClick={() => {
                // Save screen to localStorage
                const screenConfig = { selectedFrameworks, marketCapFilter, peFilter, growthFilter, sectorFilter };
                localStorage.setItem('savedScreen', JSON.stringify(screenConfig));
                alert('Screen saved! Your filters will be restored next time.');
              }}
              className="text-sm border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
            >
              <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save Screen
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
