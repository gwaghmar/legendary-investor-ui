import { NextResponse } from 'next/server';
import { getAlphaVantageMacro } from '@/lib/alpha-vantage';

export async function GET() {
    try {
        const [gdp, cpi, rates, unemployment] = await Promise.all([
            getAlphaVantageMacro('REAL_GDP'),
            getAlphaVantageMacro('CPI'),
            getAlphaVantageMacro('FEDERAL_FUNDS_RATE'),
            getAlphaVantageMacro('UNEMPLOYMENT')
        ]);

        const indicators = [
            {
                name: 'Fed Funds Rate',
                current: rates ? `${rates.current}%` : 'N/A',
                trend: rates && rates.historical.length > 1 ? (rates.historical[rates.historical.length - 1] > rates.historical[rates.historical.length - 2] ? 'up' : 'down') : 'stable',
                description: 'The interest rate at which depository institutions trade federal funds overnight.',
                data: rates ? rates.historical : []
            },
            {
                name: 'US CPI (YoY)',
                current: cpi ? `${cpi.current}%` : 'N/A',
                trend: cpi && cpi.historical.length > 1 ? (cpi.historical[cpi.historical.length - 1] > cpi.historical[cpi.historical.length - 2] ? 'up' : 'down') : 'stable',
                description: 'The Consumer Price Index (CPI) measures the average change over time in prices paid by consumers.',
                data: cpi ? cpi.historical : []
            },
            {
                name: 'US GDP Growth',
                current: gdp ? `${gdp.current}%` : 'N/A',
                trend: gdp && gdp.historical.length > 1 ? (gdp.historical[gdp.historical.length - 1] > gdp.historical[gdp.historical.length - 2] ? 'up' : 'down') : 'stable',
                description: 'Total value of all finished goods and services produced within a country.',
                data: gdp ? gdp.historical : []
            },
            {
                name: 'Unemployment Rate',
                current: unemployment ? `${unemployment.current}%` : 'N/A',
                trend: unemployment && unemployment.historical.length > 1 ? (unemployment.historical[unemployment.historical.length - 1] > unemployment.historical[unemployment.historical.length - 2] ? 'up' : 'down') : 'stable',
                description: 'The percentage of unemployed workers in the total labor force.',
                data: unemployment ? unemployment.historical : []
            }
        ];

        return NextResponse.json({ indicators });
    } catch (error) {
        console.error('Macro API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch macro data' }, { status: 500 });
    }
}
