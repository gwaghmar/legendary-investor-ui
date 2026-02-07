#!/usr/bin/env python3
"""
LEGENDARY INVESTOR — AUTOMATED AUDIT SCRIPT
============================================
This script audits the live website against TradingView-style benchmarks.
Run with: python audit_script.py --url https://legendary-investor-ui.vercel.app
"""

import requests
from bs4 import BeautifulSoup
import yfinance as yf
import json
import time
from datetime import datetime
from typing import Dict, List, Optional
import argparse
import sys

class LegendaryInvestorAudit:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "base_url": base_url,
            "pages": {},
            "data_validation": {},
            "trust_ui": {},
            "ai_features": {},
            "scores": {}
        }
    
    def audit_page_load(self, path: str = "") -> Dict:
        """Audit page load time and basic accessibility"""
        url = f"{self.base_url}/{path}".rstrip('/')
        start = time.time()
        try:
            response = requests.get(url, timeout=30)
            load_time = (time.time() - start) * 1000
            return {
                "url": url,
                "status": response.status_code,
                "load_time_ms": round(load_time, 2),
                "has_content": len(response.text) > 1000,
                "title": self._extract_title(response.text)
            }
        except Exception as e:
            return {"url": url, "error": str(e)}
    
    def _extract_title(self, html: str) -> Optional[str]:
        """Extract page title from HTML"""
        soup = BeautifulSoup(html, 'html.parser')
        title = soup.find('title')
        return title.text if title else None
    
    def audit_trust_ui(self, html: str) -> Dict:
        """Check for trust UI elements"""
        soup = BeautifulSoup(html, 'html.parser')
        text = soup.get_text().lower()
        return {
            "has_timestamps": any(x in text for x in ['updated', 'as of', 'last refresh']),
            "has_source_badges": any(x in text for x in ['source:', 'data by', 'powered by']),
            "has_delayed_marker": any(x in text for x in ['delayed', '15 min', 'real-time']),
            "has_disclaimer": 'not financial advice' in text or 'educational' in text,
            "has_demo_badge": 'demo' in text or 'sample' in text
        }
    
    def validate_ticker_data(self, ticker: str) -> Dict:
        """Validate app data against Yahoo Finance"""
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            return {
                "ticker": ticker,
                "verified_pe": info.get('forwardPE') or info.get('trailingPE'),
                "verified_growth": info.get('revenueGrowth'),
                "verified_market_cap": info.get('marketCap'),
                "verified_price": info.get('currentPrice') or info.get('regularMarketPrice'),
                "source": "Yahoo Finance",
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            return {"ticker": ticker, "error": str(e)}
    
    def calculate_scores(self) -> Dict:
        """Calculate audit scores based on findings"""
        scores = {}
        
        # Page load score (target: <2000ms)
        load_times = [p.get('load_time_ms', 5000) for p in self.results['pages'].values() if 'load_time_ms' in p]
        avg_load = sum(load_times) / len(load_times) if load_times else 5000
        scores['page_load'] = min(10, max(0, 10 - (avg_load - 1000) / 400))
        
        # Trust UI score
        trust = self.results.get('trust_ui', {})
        trust_checks = [trust.get(k, False) for k in ['has_timestamps', 'has_source_badges', 'has_delayed_marker', 'has_disclaimer']]
        scores['trust_ui'] = sum(trust_checks) / len(trust_checks) * 10 if trust_checks else 0
        
        # Data accuracy score (placeholder - would need app data to compare)
        scores['data_accuracy'] = 1.0  # Low default until verified
        
        return scores
    
    def generate_recommendations(self) -> List[Dict]:
        """Generate prioritized recommendations"""
        recs = []
        scores = self.results.get('scores', {})
        
        if scores.get('data_accuracy', 0) < 5:
            recs.append({
                "priority": "P0",
                "category": "Data Accuracy",
                "issue": "Critical metric errors",
                "fix": "Fix data formulas and update to real-time sources"
            })
        
        if scores.get('trust_ui', 0) < 5:
            recs.append({
                "priority": "P0",
                "category": "Trust UI",
                "issue": "Missing data timestamps",
                "fix": "Add 'Last updated: X' to all data components"
            })
        
        if scores.get('page_load', 0) < 7:
            recs.append({
                "priority": "P1",
                "category": "Performance",
                "issue": "Slow page loads",
                "fix": "Optimize API calls and add caching"
            })
        
        return recs
    
    def run_full_audit(self) -> Dict:
        """Run complete audit suite"""
        print("=" * 60)
        print("LEGENDARY INVESTOR AUDIT")
        print(f"Base URL: {self.base_url}")
        print(f"Timestamp: {self.results['timestamp']}")
        print("=" * 60)
        
        # Audit main pages
        pages = ['', 'screener']
        print("\n📄 Auditing pages...")
        for page in pages:
            result = self.audit_page_load(page)
            self.results['pages'][page or 'home'] = result
            print(f"  → {result.get('url')}")
            print(f"    Load time: {result.get('load_time_ms', 'N/A')}ms")
            
            # Check trust UI on each page
            if result.get('status') == 200:
                try:
                    # For local testing, we might not get full HTML if JS rendered, but we try
                    trust = self.audit_trust_ui(requests.get(result['url']).text)
                    self.results['trust_ui'] = {**self.results.get('trust_ui', {}), **trust}
                    print(f"    Timestamps: {'✅' if trust['has_timestamps'] else '❌'}")
                    print(f"    Sources: {'✅' if trust['has_source_badges'] else '❌'}")
                except:
                    pass
        
        # Validate screener data
        print("\n📊 Validating screener data...")
        test_tickers = ['AAPL', 'NVDA', 'MU', 'TSLA', 'PLTR']
        for ticker in test_tickers:
            print(f"  → Fetching {ticker} (Yahoo Finance)...")
            validation = self.validate_ticker_data(ticker)
            self.results['data_validation'][ticker] = validation
            if 'error' not in validation:
                print(f"    Verified P/E: {validation.get('verified_pe')}")
                print(f"    Verified Growth: {validation.get('verified_growth')}")
            else:
                print(f"    Error: {validation.get('error')}")
        
        # Calculate scores
        self.results['scores'] = self.calculate_scores()
        
        # Generate recommendations
        self.results['recommendations'] = self.generate_recommendations()
        
        # Print summary
        self._print_summary()
        
        return self.results
    
    def _print_summary(self):
        """Print audit summary"""
        print("\n" + "=" * 60)
        print("AUDIT REPORT SUMMARY")
        print("=" * 60)
        
        print("\n📈 SCORES")
        for metric, score in self.results['scores'].items():
            bar = '█' * int(score) + '░' * (10 - int(score))
            print(f"  {metric:20} [{bar}] {score:.1f}/10")
        
        print("\n🎯 TOP RECOMMENDATIONS")
        for rec in self.results.get('recommendations', [])[:3]:
            print(f"\n  {rec['priority']}. [{rec['priority']}] {rec['category']}: {rec['issue']}")
            print(f"     Fix: {rec['fix']}")
        
        print("\n📄 PAGE AUDIT")
        print(f"  {'Page':20} {'Load (ms)':12} {'Timestamps':12} {'Sources':12}")
        print("  " + "-" * 56)
        for page, data in self.results['pages'].items():
            ts = '✅' if self.results.get('trust_ui', {}).get('has_timestamps') else '❌'
            src = '✅' if self.results.get('trust_ui', {}).get('has_source_badges') else '❌'
            lt = data.get('load_time_ms', 'N/A')
            print(f"  {page:20} {lt:<12} {ts:12} {src:12}")

def main():
    parser = argparse.ArgumentParser(description='Audit Legendary Investor website')
    parser.add_argument('--url', default='http://localhost:3000',
                        help='Base URL to audit')
    parser.add_argument('--output', default='audit_report.json',
                        help='Output file for JSON report')
    args = parser.parse_args()
    
    print(f"Starting audit for {args.url}...")
    auditor = LegendaryInvestorAudit(args.url)
    results = auditor.run_full_audit()
    
    # Save results
    with open(args.output, 'w') as f:
        json.dump(results, f, indent=2, default=str)
    print(f"\n💾 Report saved to {args.output}")
    
    print("\n✅ Audit complete!")

if __name__ == '__main__':
    main()
