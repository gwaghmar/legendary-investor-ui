import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { stockDatabase } from '@/lib/stock-data';

export async function GET() {
    try {
        // Try to fetch from Supabase first
        const { data, error } = await supabase.from('stocks').select('*');

        if (!error && data && data.length > 0) {
            return NextResponse.json(data);
        }

        // Fallback to mock data if DB is empty or not connected
        console.warn('Fetching stocks from Supabase failed or empty, using mock data:', error);
        return NextResponse.json(Object.values(stockDatabase));
    } catch (error) {
        return NextResponse.json(Object.values(stockDatabase));
    }
}
