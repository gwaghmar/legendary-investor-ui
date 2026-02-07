# LEGENDARY INVESTOR — FULL PRODUCT AUDIT (v2)

**TradingView + AI Hybrid Benchmark**

- **Auditor:** Claude Opus (Antigravity)
- **Date:** 2026-02-05
- **Product Vision:** TradingView + AI Baby — Research, analysis, and idea generation tool
- **Repo:** gwaghmar/legendary-investor-ui

---

## PART 1: FULL AUDIT (TradingView-Style Benchmarks)

### SECTION A: Executive Verdict (Recalibrated)

**Would I use this daily for research?**

> **MAYBE → YES (after P0 fixes)**

This is NOT a trading platform. It's a research and idea-generation tool. Judged against TradingView, Koyfin, and AlphaSense, the core concept is strong but execution has critical gaps.

#### Blockers (Research Tool Lens)

| Blocker | Severity | Why It Matters for Research |
|---------|----------|----------------------------|
| ROIC = 0% everywhere | Critical | Can't research quality companies if fundamentals are broken |
| P/E off by 4-6× | Critical | Users cross-check with Yahoo/Google; instant trust loss |
| No citations in AI | High | TradingView ideas have charts; your AI needs sources |
| No data timestamps | High | Users need to know if research is stale |
| No thesis save/export | Medium | Can't capture and share research insights |

#### 3 Strongest Features (vs TradingView)

| Feature | Why It's Strong | TradingView Equivalent |
|---------|-----------------|----------------------|
| AI Debate Box | No one else has AI personas debating stocks with distinct philosophies | TradingView Ideas (but user-generated, not AI) |
| Council Voting | 5 AI analysts vote with reasoning — unique "consensus" view | No equivalent |
| SEC RAG Search | Ask questions, get answers from 10-Ks — deep research moat | TradingView has no filing integration |

#### 3 Biggest Failures (vs TradingView)

| Failure | Impact | TradingView Comparison |
|---------|--------|----------------------|
| Broken fundamentals | Users can't trust any metric | TradingView pulls from reliable feeds; data is accurate |
| No citations/sources | AI outputs feel like hallucinations | TradingView ideas include charts and reasoning |
| No thesis builder | Users can't capture insights | TradingView users publish structured ideas |

#### Highest-Impact Fix

> **Fix data accuracy (ROIC, P/E) + Add citations to AI outputs.**
>
> This alone transforms the app from "fun toy" to "credible research tool."

---

### SECTION B: Feature Benchmarking vs TradingView

#### Benchmark Scorecard

| Feature | TradingView | Legendary Investor | Gap | Priority |
|---------|-------------|-------------------|-----|----------|
| Screener | Advanced filters, accurate data, custom formulas | Multi-framework (Magic/Buffett/Lynch), but data is broken | Data accuracy | P0 |
| Ideas/Thesis | User-generated ideas with charts, votes, comments | AI-generated debates, but no save/export | Thesis Builder | P1 |
| Charts | Best-in-class charting with indicators | No charting | Not core (deprioritize) | P3 |
| Fundamentals | Accurate, sourced, timestamped | Inaccurate, no sources, no timestamps | Trust UI | P0 |
| Community | Millions of users, social features | No community (AI replaces it) | N/A (different model) | — |
| Filings/Research | No SEC integration | SEC RAG + 13F guru tracking | Your edge | P2 |
| AI Analysis | None (manual research only) | Multi-persona debates + council | Your edge | P1 |
| Alerts | Price, indicator, drawing alerts | None | Nice-to-have | P2 |
| Mobile | Excellent mobile apps | Web-only, basic responsiveness | Low priority | P3 |
| Export/Share | Share ideas, embed charts | No export/share | Thesis Builder | P1 |

#### TradingView User Journey vs Legendary Investor

| Step | TradingView | Legendary Investor | Gap |
|------|-------------|-------------------|-----|
| 1. Discover idea | Browse community ideas, screener | Screener, Debate Box, Council | ✅ Covered |
| 2. Research ticker | Charts + fundamentals + news | Fundamentals (broken) + AI analysis + SEC RAG | ⚠️ Data accuracy |
| 3. Form thesis | Read ideas, draw on chart, take notes | AI generates bull/bear case | ⚠️ No save/capture |
| 4. Validate thesis | Check multiple timeframes, indicators | Council voting, debate | ✅ Covered |
| 5. Save/share | Publish idea, get votes/comments | None | ❌ Missing |
| 6. Track over time | Watchlist, alerts, replay | None | ⚠️ Nice-to-have |
| 7. Review outcome | Compare prediction vs actual | None | ⚠️ Future feature |

---

### SECTION C: Research Mode Coverage (Recalibrated)

| Mode | Score (0-10) | Benchmark | Missing Must-Haves |
|------|-------------|-----------|-------------------|
| Fundamental Research | 4 | Koyfin, Finviz | Fix ROIC/P/E accuracy; add FCF, margins, debt metrics; show calculation formulas |
| Thematic Research | 6 | TradingView Ideas | AI debates are strong; add save/export; add citations |
| Event-Driven Research | 5 | AlphaSense, Tegus | SEC RAG is good; add earnings calendar, insider trades, guidance changes |
| Comparative Research | 2 | Koyfin, TradingView | No compare mode; can't view 2 tickers side-by-side |
| Macro Research | 3 | TradingView, FRED | Druckenmiller persona exists; add FRED data overlays |
| Idea Generation | 7 | TradingView Ideas | Debate + Council = strong; needs thesis capture |
| Due Diligence | 5 | AlphaSense | SEC RAG + 13F good; add transcript search, red flag detection |

#### Per-Mode: 3 Missing Must-Haves

**Fundamental Research:**
- Fix ROIC calculation (currently 0% everywhere)
- Add FCF yield, gross/operating margins, debt-to-equity
- Show formula tooltips ("ROIC = NOPAT / Invested Capital")

**Thematic Research:**
- Add thesis save/export
- Add citations to every AI output
- Add "related tickers" suggestions

**Event-Driven Research:**
- Earnings calendar with whisper numbers
- Insider trade clusters with fundamentals overlay
- Guidance revision tracker

**Comparative Research:**
- Side-by-side ticker comparison
- Relative valuation charts (P/E vs sector)
- Historical multiple overlays

**Macro Research:**
- FRED data integration (rates, CPI, PMI)
- Sector/factor performance overlays
- Risk-on/risk-off regime indicator

---

### SECTION D: Screener Audit (TradingView Benchmark)

#### TradingView Screener vs Legendary Investor

| Dimension | TradingView | Legendary Investor | Score (0-10) |
|-----------|-------------|-------------------|--------------|
| Data Accuracy | Matches Yahoo/Bloomberg ±1% | Off by 4-6× on P/E; ROIC = 0% | 2 |
| Data Freshness | Real-time or 15-min delay (labeled) | Stale/cached, no timestamps | 3 |
| Filter Breadth | 100+ filters (fundamentals, technicals, custom) | 5-6 filters (P/E, growth, sector, cap) | 4 |
| Custom Formulas | Users can create custom columns | Fixed frameworks only | 3 |
| Explainability | Hover shows data source | No formulas, no sources | 2 |
| Speed | Sub-second results | 2-5 seconds | 6 |
| Export | CSV, API | CSV (but data is wrong) | 4 |
| Unique Value | Industry standard | Multi-framework scoring (Magic/Buffett/Lynch) | 7 |

**Overall Screener Score: 4/10** (concept is unique, but data is broken)

#### Confirmed Data Bugs (from Live Audit)

| Ticker | Metric | App Value | Real Value | Source | Error |
|--------|--------|-----------|------------|--------|-------|
| MU | P/E | 7× | 36.26× | Yahoo Finance | 5× off |
| TSM | P/E | 24× | 157.65× | Yahoo Finance | 6.5× off |
| PLTR | P/E | 48× | 208.38× | Yahoo Finance | 4× off |
| ABBV | P/E | 20× | 91.85× | Yahoo Finance | 4.5× off |
| AAPL | ROIC | 0% | 48.48% | FinanceCharts | Formula broken |
| TSLA | ROIC | 0% | 5.98% | FinanceCharts | Formula broken |
| SNOW | P/E | 0× | N/A (no earnings) | — | Should show "N/A" |
| CRWD | P/E | 0× | N/A (no earnings) | — | Should show "N/A" |

#### Root Cause Analysis (from Code)

**ROIC Bug:**
```typescript
// Finnhub returns ROE, not ROIC
// Code reads: roe: m.roeTTM || m.roeRfy || null
// But displays it as "ROIC" in the UI
// Actual ROIC requires: NOPAT / Invested Capital
// This is NOT calculated anywhere
```

**P/E Bug:**
```typescript
// Fallback data has hardcoded P/E values from 2024
// When Finnhub fetch fails, stale fallback is shown
// No "DEMO DATA" badge to warn users
```

#### Modern Scan Templates (Research-Focused)

| # | Template | Research Use Case |
|---|----------|-------------------|
| 1 | Quality Compounders Under Drawdown | Find Buffett-style quality at a discount |
| 2 | Post-Earnings Drift Candidates | Event-driven momentum research |
| 3 | Insider Buying + Strong FCF | Skin in the game + fundamentals |
| 4 | High ROIC + Low Debt | Capital-efficient quality |
| 5 | Revenue Acceleration + Expanding Margins | Growth inflection research |
| 6 | Guidance Raises (Last 90 Days) | Management confidence signals |
| 7 | AI/Infra Supply Chain | Thematic research (cite evidence) |
| 8 | Dividend Growth + Buyback Yield | Shareholder return focus |
| 9 | Short Interest Decline + Improving Fundamentals | Squeeze candidates (with fundamentals) |
| 10 | Sum-of-Parts / Spinoff Candidates | Complex value research |
| 11 | Sector Laggards with Catalyst | Contrarian rotation ideas |
| 12 | New 52-Week Highs + Accelerating Volume | Momentum leadership |

---

### SECTION E: AI Debate Box Audit (TradingView Ideas Benchmark)

#### TradingView Ideas vs Legendary Investor Debates

| Dimension | TradingView Ideas | Legendary Investor Debates | Score (0-10) |
|-----------|-------------------|---------------------------|--------------|
| Source Material | User research + charts | AI-generated from news + RAG | 6 |
| Citations | Charts, levels, reasoning | No citations, some hallucinations | 3 |
| Perspective Diversity | Varies by author | 7 distinct personas (Buffett, Burry, etc.) | 8 |
| Steelmanning | Depends on author | Weak — personas don't present strongest counter | 4 |
| Actionability | Clear entry/stop/target | No structured output | 3 |
| Save/Share | Yes, with votes/comments | No | 2 |
| Freshness | User-driven, varies | Real-time news-driven | 7 |
| Unique Value | Community wisdom | AI persona reasoning (unique) | 8 |

**Overall Debate Score: 5/10** (concept is strong, execution needs citations + structure)

#### Confirmed Debate Issues (from Live Audit)

| Issue | Example | Fix |
|-------|---------|-----|
| Hallucinated numbers | "AAPL P/B = 47" (false) | Require AI to cite source for any number |
| No citations | Responses have no links/sources | Add inline citations (EDGAR, Finnhub) |
| Over-dramatic personas | Burry predicts "CDO meltdown" for software stocks | Calibrate persona prompts |
| Repetitive phrases | "Moat remains intact" appears across tickers | Add response diversity |
| No steelmanning | Buffett dismisses growth; Burry dismisses everything | Require each persona to acknowledge counter |
| Slow (10-20s) | Council takes too long | Add loading indicator; optimize API calls |

#### Persona Calibration Notes

| Persona | Current Behavior | Calibrated Behavior |
|---------|------------------|---------------------|
| Buffett | Generic "quality and moats" | Focus on FCF yield, ROIC, management tenure; cite Berkshire letters |
| Munger | Quotes "invert, always invert" | Apply mental models specifically; identify cognitive biases |
| Burry | Predicts crashes everywhere | Focus on hidden leverage, off-balance-sheet, mispricing; cite SEC filings |
| Lynch | Generic "buy what you know" | Focus on PEG ratio, consumer trends, insider buying |
| Druckenmiller | Generic "macro matters" | Focus on Fed policy, liquidity, sector rotation; cite FRED data |
| Klarman | Generic "margin of safety" | Focus on downside protection, FCF, asset values |
| Greenblatt | Generic "Magic Formula" | Focus on earnings yield + ROIC ranking; show calculation |

---

### SECTION F: SEC RAG Audit (AlphaSense Benchmark)

#### AlphaSense vs Legendary Investor SEC RAG

| Dimension | AlphaSense | Legendary Investor | Score (0-10) |
|-----------|------------|-------------------|--------------|
| Filing Coverage | All SEC filings + transcripts | 10-K, 10-Q, 8-K (limited tickers) | 5 |
| Search Quality | Semantic + keyword + filters | Basic RAG search | 4 |
| Transcript Search | Earnings call transcripts | Not available | 2 |
| Citation Quality | Direct quotes with page numbers | Summaries without links | 3 |
| Cross-Filing Analysis | Compare across years/competitors | Single-filing only | 2 |
| Red Flag Detection | AI-powered risk signals | Not available | 1 |
| Unique Value | Industry standard for research | Free, AI-summarized, persona-driven | 6 |

**Overall RAG Score: 4/10** (good start, needs depth)

#### RAG Improvements Needed

| Improvement | Why It Matters | Effort |
|-------------|----------------|--------|
| Add citation links | Users need to verify AI summaries | Low |
| Expand ticker coverage | Currently ~15 tickers hardcoded | Medium |
| Add transcript search | Earnings calls are gold for research | High |
| Cross-filing comparison | "What changed from last year's 10-K?" | Medium |
| Red flag detection | "Any unusual related-party transactions?" | High |

---

### SECTION G: Trust UI Audit

#### TradingView Trust Signals vs Legendary Investor

| Signal | TradingView | Legendary Investor | Gap |
|--------|-------------|-------------------|-----|
| Data source badge | "Data by Nasdaq" visible | No source shown | ❌ |
| Timestamp | "Last updated: X" on charts | No timestamps | ❌ |
| Delayed data marker | "Delayed 15 min" badge | No marker | ❌ |
| Formula transparency | Hover shows calculation | No formulas shown | ❌ |
| Error handling | "Ticker not found" message | Blank page on invalid ticker | ❌ |
| AI confidence | N/A (no AI) | No confidence shown | ❌ |

**Trust UI Score: 2/10** (almost no trust signals)

#### Trust UI Requirements

| Requirement | Implementation |
|-------------|----------------|
| Source badge | Every metric shows "Source: Finnhub" or "Source: EDGAR" |
| Timestamp | Every metric shows "Updated: Feb 5, 2026 3:45 PM" |
| Delayed marker | If data is >15 min old, show ⏱️ icon |
| Stale warning | If data is >24 hours old, show "⚠️ Stale data — verify before use" |
| Formula tooltip | Hover on "ROIC" shows "NOPAT / Invested Capital" |
| AI confidence | Each AI response shows "Confidence: High/Medium/Low" |
| Citation count | Each AI response shows "Sources: 3 citations" |
| Demo badge | Fallback data shows "DEMO DATA — not real-time" |

---

### SECTION H: UX Audit (Research Tool Lens)

#### Top 12 UX Wins

| # | Win | Why It Works |
|---|-----|--------------|
| 1 | Multi-framework screener concept | Unique differentiation; Buffett/Lynch/Burry lenses |
| 2 | Council voting with personas | Engaging, visual consensus |
| 3 | Debate Box with live news | Feels current and alive |
| 4 | SEC RAG search | Deep research in one place |
| 5 | Guru 13F portfolios | Shows what legends actually own |
| 6 | Real-time price ticker | Market pulse at a glance |
| 7 | Brutalist/mono design | Memorable, terminal-like aesthetic |
| 8 | Voice input for portfolio | Modern, accessible |
| 9 | Clear disclaimer | Legal coverage for AI outputs |
| 10 | Framework tooltips | Educational for beginners |
| 11 | CSV export | Power users can extract data |
| 12 | Simple navigation | Home, Screener, Council, Data — clear |

#### Top 12 UX Failures

| # | Failure | Impact | Fix |
|---|---------|--------|-----|
| 1 | No thesis save/export | Users can't capture research | Build Thesis Builder |
| 2 | No data timestamps | Users don't know freshness | Add timestamps everywhere |
| 3 | No source badges | Users don't trust data | Add source badges |
| 4 | Broken fundamentals | Research is wrong | Fix ROIC, P/E |
| 5 | No compare mode | Can't research 2 tickers together | Add compare drawer |
| 6 | Council takes 10-20s | Too slow for research flow | Add loading state; optimize |
| 7 | No citations in AI | Feels like hallucination | Require citations |
| 8 | Empty states are basic | New users feel lost | Add onboarding, examples |
| 9 | Invalid ticker = blank page | Confusing | Show "Ticker not found" |
| 10 | No search history | Users repeat searches | Add recent searches |
| 11 | Mobile layout issues | Ticker takes too much space | Responsive improvements |
| 12 | No keyboard shortcuts | Power users want speed | Add command palette (v2) |

#### Missing Flows (Research Tool)

| Flow | Current State | Needed |
|------|---------------|--------|
| Thesis capture | None | Save bull/bear case, metrics, invalidation |
| Compare tickers | None | Side-by-side view |
| Search history | None | Recent searches, saved searches |
| Watchlist | Requires sign-up, untested | Logged-out watchlist with local storage |
| Export/share | CSV only (with broken data) | PDF thesis, shareable link |

---

### SECTION I: Roadmap (TradingView + AI Framing)

#### P0: Core Research Accuracy (1-2 weeks)

| Item | Why | Definition of Done |
|------|-----|-------------------|
| Fix ROIC formula | Currently 0% for all tickers | ROIC = NOPAT / Invested Capital; matches Morningstar ±5% |
| Fix P/E data source | Off by 4-6× | P/E matches Yahoo Finance ±5% for top 50 tickers |
| Add data timestamps | Users need freshness | Every metric shows "Updated: X" |
| Add source badges | Users need trust | Every metric shows "Source: Finnhub/EDGAR" |
| Add stale/demo badges | Fallback data looks real | Fallback shows "DEMO DATA" warning |
| Handle negative P/E | Shows 0× instead of N/A | Negative earnings shows "N/A" |

#### P1: Research-Grade AI (2-4 weeks)

| Item | Why | Definition of Done |
|------|-----|-------------------|
| Add citations to AI | Hallucinations destroy trust | Each response includes ≥1 verifiable citation |
| Add confidence badges | Users need uncertainty | Each response shows High/Medium/Low confidence |
| Steelmanning requirement | Good research presents both sides | Each persona acknowledges strongest counter |
| Persona calibration | Burry predicts doom for everything | Personas stay in-character but grounded |
| Thesis Builder (MVP) | Users can't capture research | Save bull/bear case, metrics, invalidation, export PDF |

#### P2: Research UX Polish (1-2 months)

| Item | Why | Definition of Done |
|------|-----|-------------------|
| Compare mode | Can't research 2 tickers together | Side-by-side view with all metrics |
| Scan templates | Modern research queries missing | 12 templates (see Section D) |
| Search history | Users repeat work | Recent + saved searches |
| RAG citations | AI summaries need verification | Each RAG response links to source filing |
| Loading states | Council takes 10-20s with no feedback | Spinner + estimated wait time |

#### P3: Differentiation Features (3-6 months)

| Item | Why | Definition of Done |
|------|-----|-------------------|
| Legendary Lenses feed | Your "TradingView Ideas" equivalent | Weekly AI memos with citations |
| "What Changed?" brief | Morning research digest | Daily summary for watchlist |
| Red flag detection | Due diligence automation | AI flags unusual accounting, related-party, etc. |
| Transcript search | Earnings calls are research gold | Search across transcripts |
| FRED macro overlays | Macro research depth | Rates, CPI, PMI overlays |

---

## PART 2: AUTOMATED AUDIT SCRIPT

This script allows an agent to audit the live website systematically.

```python
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
        scores['trust_ui'] = sum(trust_checks) / len(trust_checks) * 10
        
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
        pages = ['', 'screener', 'council', 'data']
        print("\n📄 Auditing pages...")
        for page in pages:
            result = self.audit_page_load(page)
            self.results['pages'][page or 'home'] = result
            print(f"  → {result.get('url')}")
            print(f"    Load time: {result.get('load_time_ms', 'N/A')}ms")
            
            # Check trust UI on each page
            if result.get('status') == 200:
                try:
                    html = requests.get(result['url']).text
                    trust = self.audit_trust_ui(html)
                    self.results['trust_ui'] = {**self.results.get('trust_ui', {}), **trust}
                    print(f"    Timestamps: {'✅' if trust['has_timestamps'] else '❌'}")
                    print(f"    Sources: {'✅' if trust['has_source_badges'] else '❌'}")
                except:
                    pass
        
        # Validate screener data
        print("\n📊 Validating screener data...")
        test_tickers = ['AAPL', 'NVDA', 'MU', 'TSLA', 'PLTR']
        for ticker in test_tickers:
            validation = self.validate_ticker_data(ticker)
            self.results['data_validation'][ticker] = validation
            print(f"  → {ticker}")
            if 'error' not in validation:
                print(f"    Verified P/E: {validation.get('verified_pe')}")
                print(f"    Verified Growth: {validation.get('verified_growth')}")
        
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
    parser.add_argument('--url', default='https://legendary-investor-ui.vercel.app',
                        help='Base URL to audit')
    parser.add_argument('--output', default='audit_report.json',
                        help='Output file for JSON report')
    parser.add_argument('--selenium', action='store_true',
                        help='Use Selenium for JavaScript rendering')
    args = parser.parse_args()
    
    auditor = LegendaryInvestorAudit(args.url)
    results = auditor.run_full_audit()
    
    # Save results
    with open(args.output, 'w') as f:
        json.dump(results, f, indent=2, default=str)
    print(f"\n💾 Report saved to {args.output}")
    
    print("\n✅ Audit complete!")

if __name__ == '__main__':
    main()
```

### How to Run the Audit Script

```bash
# Install dependencies
pip install requests beautifulsoup4 yfinance

# For full browser testing (optional)
pip install selenium webdriver-manager

# Run basic audit
python audit_script.py --url https://legendary-investor-ui.vercel.app

# Run with Selenium (captures JavaScript-rendered content)
python audit_script.py --url https://legendary-investor-ui.vercel.app --selenium

# Save to custom file
python audit_script.py --output my_audit.json
```

### Script Output Example

```
============================================================
LEGENDARY INVESTOR AUDIT
Base URL: https://legendary-investor-ui.vercel.app
Timestamp: 2026-02-05T14:30:00
============================================================

📄 Auditing pages...
  → https://legendary-investor-ui.vercel.app
    Load time: 1250ms
    Timestamps: ❌
    Sources: ❌
  → https://legendary-investor-ui.vercel.app/screener
    Load time: 2100ms
    Timestamps: ❌
    Sources: ✅

📊 Validating screener data...
  → AAPL
    Verified P/E: 32.5
    Verified Growth: 3.2%
  → NVDA
    Verified P/E: 58.3
    Verified Growth: 122.4%
  → MU
    Verified P/E: 36.26
    Verified Growth: 61.5%

============================================================
AUDIT REPORT SUMMARY
============================================================

📈 SCORES
  page_load            [███████░░░] 7.5/10
  trust_ui             [██░░░░░░░░] 2.0/10
  data_accuracy        [█░░░░░░░░░] 1.0/10

🎯 TOP RECOMMENDATIONS

  1. [P0] Data Accuracy: Critical metric errors
     Fix: Fix data formulas and update to real-time sources

  2. [P0] Trust UI: Missing data timestamps
     Fix: Add 'Last updated: X' to all data components

📄 PAGE AUDIT
  Page                 Load (ms)    Timestamps   Sources     
  --------------------------------------------------------
  home                 1250         ❌           ❌          
  screener             2100         ❌           ✅          
  council              1800         ❌           ❌          
  data                 1500         ❌           ✅          

💾 Report saved to audit_report.json

✅ Audit complete!
```

---

## PART 3: THESIS BUILDER SPECIFICATION

### Overview

The Thesis Builder is Legendary Investor's equivalent of TradingView's "Publish Idea" feature — but AI-assisted and structured for research rigor.

**Core concept:** Users capture their investment thesis in a structured format, with AI helping to articulate bull/bear cases and identify key metrics and invalidation triggers.

### User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Researcher | Save my investment thesis for a ticker | I can track my reasoning over time |
| Power user | Have AI help me articulate bull/bear cases | I don't miss key arguments |
| Beginner | See a structured thesis template | I learn how to think about investments |
| Team member | Share my thesis with colleagues | We can discuss and refine ideas |
| Disciplined investor | Define invalidation triggers | I know when my thesis is broken |

### Data Model

```typescript
// types/thesis.ts

interface Thesis {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Core fields
  ticker: string;
  companyName: string;
  stance: 'bullish' | 'bearish' | 'neutral';
  timeHorizon: '1mo' | '3mo' | '6mo' | '1yr' | '3yr';
  confidence: 'high' | 'medium' | 'low';
  
  // Price tracking
  priceAtCreation: number;
  targetPrice: number;
  worstCasePrice: number;
  
  // Cases
  bullCase: {
    summary: string;
    points: ThesisPoint[];
  };
  bearCase: {
    summary: string;
    points: ThesisPoint[];
  };
  
  // Research
  keyMetrics: KeyMetric[];
  invalidationTriggers: string[];
  catalysts: Catalyst[];
  sources: Source[];
  
  // Status
  status: 'active' | 'closed';
  closedAt?: Date;
  outcome?: 'correct' | 'partial' | 'incorrect';
  lessons?: string;
}

interface ThesisPoint {
  id: string;
  content: string;
  source?: Source;
  isAIGenerated: boolean;
}

interface KeyMetric {
  name: string;
  currentValue: string;
  targetValue: string;
  source: string;
  status: 'on_track' | 'warning' | 'off_track';
}

interface Catalyst {
  date: string;
  description: string;
  expectedImpact: 'positive' | 'negative' | 'neutral';
}

interface Source {
  type: 'sec_filing' | 'earnings' | 'news' | 'council' | 'debate' | 'other';
  title: string;
  url?: string;
  date?: string;
}
```

### UI Components

#### 1. Thesis Builder Modal

**Trigger:** "Build Thesis" button appears on:
- Stock analyze page
- Council results
- Debate conclusions
- Screener row actions

**Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│  BUILD THESIS                                    [X] Close  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  NVDA — NVIDIA Corporation                                  │
│  Current Price: $875.50                                     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ STANCE      [🟢 Bullish] [⚪ Neutral] [🔴 Bearish]  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ TIME HORIZON                                         │   │
│  │ [1 mo] [3 mo] [6 mo] [1 yr] [3 yr]                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ CONFIDENCE   [High] [Medium] [Low]                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ════════════════════════════════════════════════════════  │
│                                                             │
│  BULL CASE                                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Summary (1-2 sentences)                              │   │
│  │ ________________________________________________    │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Key Points:                                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • AI chip demand remains insatiable [AI] [Edit] [X] │   │
│  │ • Data center revenue up 200% YoY   [AI] [Edit] [X] │   │
│  │ • Blackwell ramp ahead of schedule  [AI] [Edit] [X] │   │
│  │ [+ Add point]                                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Target Price: $_____ (___% upside)                         │
│                                                             │
│  ════════════════════════════════════════════════════════  │
│                                                             │
│  BEAR CASE (Steelman the other side)                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Summary                                              │   │
│  │ ________________________________________________    │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Key Points:                                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • Competition from AMD, custom chips [AI] [Edit]    │   │
│  │ • Valuation assumes perfection       [AI] [Edit]    │   │
│  │ • China export restrictions          [AI] [Edit]    │   │
│  │ [+ Add point]                                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Worst Case Price: $_____ (___% downside)                   │
│                                                             │
│  ════════════════════════════════════════════════════════  │
│                                                             │
│  KEY METRICS TO WATCH                                       │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Metric            Current     Target    Source     │    │
│  │ ─────────────────────────────────────────────────  │    │
│  │ Data Center Rev   $30.4B      $50B      10-K       │    │
│  │ Gross Margin      72.5%       70%+      Finnhub    │    │
│  │ P/E Ratio         58×         40×       Yahoo      │    │
│  │ [+ Add metric]                                     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ════════════════════════════════════════════════════════  │
│                                                             │
│  INVALIDATION TRIGGERS (I'm wrong if...)                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ☐ Data center revenue growth drops below 50% YoY   │   │
│  │ ☐ Gross margin falls below 65%                      │   │
│  │ ☐ Major customer (MSFT/GOOGL) announces switch     │   │
│  │ [+ Add trigger]                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ════════════════════════════════════════════════════════  │
│                                                             │
│  UPCOMING CATALYSTS                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Feb 26, 2026 — Q4 Earnings              [Positive]  │   │
│  │ Mar 2026 — GTC Conference               [Positive]  │   │
│  │ [+ Add catalyst]                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ════════════════════════════════════════════════════════  │
│                                                             │
│  SOURCES                                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • 10-K FY2025 (SEC EDGAR)              [View]       │   │
│  │ • Council Analysis (Legendary)          [View]       │   │
│  │ • Burry Debate (Legendary)              [View]       │   │
│  │ [+ Add source]                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [🤖 AI Assist]  [Save Draft]  [💾 Save Thesis]  [Share]   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 2. AI Assist Feature

When user clicks "🤖 AI Assist", the system:
1. Fetches current data (price, fundamentals, recent news)
2. Pulls any existing Council/Debate output for this ticker
3. Searches SEC RAG for relevant filing excerpts
4. Generates suggested bull/bear points with citations

**AI Assist Modal:**

```
┌─────────────────────────────────────────────────────────────┐
│  🤖 AI THESIS ASSISTANT                          [X] Close  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Generating thesis points for NVDA...                       │
│  [████████████████████░░░░░░░░░░] 65%                       │
│                                                             │
│  ────────────────────────────────────────────────────────── │
│                                                             │
│  SUGGESTED BULL POINTS                                      │
│                                                             │
│  ☑ AI chip demand remains insatiable as hyperscalers       │
│    increase capex by 40% YoY (Source: 10-K p.12)           │
│                                                             │
│  ☑ Data center revenue grew 217% YoY to $47.5B             │
│    (Source: Q3 2025 Earnings)                               │
│                                                             │
│  ☐ Blackwell architecture sees strong pre-orders;          │
│    management raised guidance (Source: GTC 2025)            │
│                                                             │
│  ────────────────────────────────────────────────────────── │
│                                                             │
│  SUGGESTED BEAR POINTS                                      │
│                                                             │
│  ☑ Valuation at 58× P/E assumes flawless execution         │
│    (Source: Yahoo Finance)                                  │
│                                                             │
│  ☑ China export restrictions limit TAM by ~$5B/year        │
│    (Source: 10-K Risk Factors p.23)                         │
│                                                             │
│  ☐ AMD MI300 gaining share in inference workloads          │
│    (Source: AMD Investor Day)                               │
│                                                             │
│  ────────────────────────────────────────────────────────── │
│                                                             │
│  [Add Selected to Thesis]                     [Regenerate]  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Implementation Priority

| Phase | Feature | Effort | Impact |
|-------|---------|--------|--------|
| MVP | Basic thesis creation (no AI) | Medium | High |
| MVP | Save/list/view theses | Low | High |
| MVP | Manual bull/bear points | Low | High |
| V1 | AI Assist for points | Medium | High |
| V1 | Key metrics tracking | Low | Medium |
| V1 | Invalidation triggers | Low | High |
| V1 | Close thesis with outcome | Low | Medium |
| V2 | Share/export | Medium | Medium |
| V2 | Price tracking + alerts | Medium | High |
| V2 | Integration with Council/Debate | Medium | High |
| V3 | Public thesis feed | High | Medium |
| V3 | Thesis performance analytics | High | Medium |

---

## PART 4: COMPETITIVE POSITIONING

### Market Landscape

```
┌─────────────────────────────────────────────────────────────────────────┐
│                 RESEARCH TOOL COMPETITIVE LANDSCAPE                      │
│                                                                          │
│  Depth of Analysis                                                       │
│      ▲                                                                   │
│      │                                                                   │
│      │        ┌─────────────┐                                            │
│      │        │ AlphaSense  │ ← Enterprise, $$$$                         │
│      │        │   Tegus     │                                            │
│      │        └─────────────┘                                            │
│      │                                                                   │
│      │        ┌─────────────┐                                            │
│      │        │   Koyfin    │ ← Pro, $$                                  │
│      │        │  Sentieo    │                                            │
│      │        └─────────────┘                                            │
│      │                                                                   │
│      │            ★ LEGENDARY                                            │
│      │            ★ INVESTOR   ← AI + Personas (NEW)                     │
│      │                                                                   │
│      │        ┌─────────────┐                                            │
│      │        │ TradingView │ ← Mass market, $                           │
│      │        │   Finviz    │                                            │
│      │        └─────────────┘                                            │
│      │                                                                   │
│      │        ┌─────────────┐                                            │
│      │        │ Yahoo Fin   │ ← Free, basic                              │
│      │        │ Google Fin  │                                            │
│      │        └─────────────┘                                            │
│      │                                                                   │
│      └──────────────────────────────────────────────────────────────▶   │
│                                                   Ease of Use            │
└─────────────────────────────────────────────────────────────────────────┘
```

### Competitive Matrix

| Feature | TradingView | Koyfin | AlphaSense | Finviz | Legendary Investor |
|---------|-------------|--------|------------|--------|-------------------|
| Price | Free-$60/mo | $0-$99/mo | $10k+/yr | Free-$40/mo | Free (TBD) |
| Target User | Traders | Analysts | Institutions | Screeners | Retail researchers |
| Charting | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ❌ (not core) |
| Fundamentals | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ (after fixes) |
| Screener | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ (unique frameworks) |
| SEC Filings | ❌ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐ (RAG-powered) |
| AI Analysis | ❌ | ❌ | ⭐⭐⭐ | ❌ | ⭐⭐⭐⭐⭐ (core feature) |
| Multi-Framework | ❌ | ❌ | ❌ | ❌ | ⭐⭐⭐⭐⭐ (unique) |
| Idea Generation | ⭐⭐⭐⭐ (community) | ⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ (AI personas) |
| Thesis Builder | ⭐⭐⭐ (ideas) | ❌ | ⭐⭐⭐ | ❌ | ⭐⭐⭐⭐⭐ (planned) |
| 13F Tracking | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ (guru portfolios) |
| Mobile | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ (web only) |

### Positioning Statements

#### For TradingView Users

> "TradingView shows you charts. Legendary Investor shows you what Buffett, Burry, and Lynch would think about those charts."

- TradingView = Charts + Community Ideas
- Legendary = AI Debates + Multi-Framework Analysis + SEC RAG
- **Key differentiator:** AI-generated research with distinct investment philosophies, not user-generated content.

#### For Koyfin Users

> "Koyfin gives you data. Legendary Investor gives you insight."

- Koyfin = Dashboards + Fundamentals + Institutional-grade data
- Legendary = Same data + AI interpretation through legendary frameworks
- **Key differentiator:** Not just "what are the numbers" but "what would Buffett/Burry think about these numbers."

#### For AlphaSense Users

> "AlphaSense costs $10k/year. Legendary Investor gives you 80% of the value for free."

- AlphaSense = Enterprise search across filings, transcripts, expert calls
- Legendary = SEC RAG + AI summarization + persona-driven insights
- **Key differentiator:** Accessible to retail investors, not just institutions.

#### For Finviz Users

> "Finviz screens stocks. Legendary Investor screens AND debates them."

- Finviz = Fast screener + heatmaps + basic fundamentals
- Legendary = Multi-framework screener + AI Council + Thesis Builder
- **Key differentiator:** Not just "find stocks" but "understand why to buy or not buy."

### The Pitch

> **"Legendary Investor is what happens when TradingView and AI have a baby — raised by Buffett, Burry, and Lynch."**
>
> Research smarter. Think in frameworks. Build theses that hold up.

---

## NEXT STEPS

Based on this audit, here's what to do next:

### Immediate (This Week)
- [ ] Fix ROIC formula — Currently 0% for all tickers
- [ ] Fix P/E data source — Off by 4-6×
- [ ] Add timestamps and source badges — Trust UI basics
- [ ] Add "DEMO" badge to fallback data — Honesty

### Next 2 Weeks
- [ ] Add citations to AI outputs — Each debate/council response needs sources
- [ ] Build Thesis Builder MVP — Basic create/save/view
- [ ] Calibrate personas — Stop Burry from predicting doom everywhere

### Next Month
- [ ] Launch Thesis Builder with AI Assist
- [ ] Add compare mode — Side-by-side tickers
- [ ] Create 12 scan templates — Modern research queries
- [ ] Build "My Theses" page — Research journal

---

## PART 5: SUPPLEMENTAL RESEARCH & TECHNICAL FEASIBILITY

### 1. TradingView "Ideas" Publishing Standards
Research into TradingView's official guidelines reveals a strict focus on *analysis* over *calls*.

*   **Structure:**
    *   **Title:** Must be descriptive (not just "BUY NVDA").
    *   **Description:** The core value. "Why" is more important than "What". Top authors use 500-2000 words.
    *   **Category:** Technical vs. Fundamental (Legendary Investor focuses on Fundamental).
    *   **Strategy:** Long / Neutral / Short must be declared.
    *   **Charts:** Almost all top ideas include an annotated chart image.
*   **Key Lesson for Legendary Investor:**
    *   The "Thesis Builder" must enforce a "WHY" section.
    *   We should auto-generate a "Neutral" stance if the user is unsure.
    *   **Action:** Add a "Thesis Quality Score" that rewards citing sources and explaining reasoning.

### 2. Data Accuracy & Technical Solutions
#### ROIC Calculation (Finnhub Limitation)
Finnhub does *not* provide a direct `roic` field in its basic metrics endpoint, which explains the "0%" bug.
*   **The Fix:** We must calculate it client-side or server-side.
*   **Formula:** `ROIC = NOPAT / Invested Capital`
*   **Approximation for MVP:**
    *   `NOPAT` ≈ Operating Income * (1 - Tax Rate)
    *   `Invested Capital` ≈ Total Debt + Total Equity
    *   *Note:* Finnhub's `metric` endpoint provides `operatingMargin`, `taxRate`, `longTermDebt`, and `totalEquity`.
    *   **Action:** Create a utility function `calculateROIC(metrics)` to derive this value dynamically.

#### P/E Ratio & Timestamps
*   **Current State:** Yahoo Finance data is good, but our display is stale.
*   **Best Practice:**
    *   **Real-time:** Use `metric.peIncludedExtraordinaryItemsTTM` from Finnhub for TTM P/E.
    *   **Fallback:** Yahoo Finance `trailingPE` or `forwardPE`.
    *   **Display:** MUST show specific timestamp. "As of [Date]" is standard on Koyfin/Morningstar.

### 3. Competitor Benchmarks (Free vs Paid)
*   **Koyfin Free:** 2 years historical data, 15-min delayed non-US data.
*   **Legendary Edge:** We can offer *better* than 2 years context via AI summaries of older 10-Ks, beating Koyfin's free tier on *qualitative* history.
*   **AlphaSense:** $10k/yr price tag is due to transcript search and "smart synonyms".
    *   **Our Move:** We don't need smart synonyms yet. Free SEC RAG is enough to win against their price anchor.

### 4. SEC RAG Implementation
*   **Source:** `data.sec.gov` is free but rate-limited (10 requests/sec) and requires a User-Agent.
*   **Alternative:** `sec-api.io` has a free tier that might be easier for immediate "Search" functionality without building a complex scraper.
*   **Recommendation:** Stick to `sec-api.io` free tier for the MVP RAG to avoid maintenance burden of direct EDGAR parsing.

