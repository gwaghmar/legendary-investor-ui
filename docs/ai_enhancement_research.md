# 🚀 LEGENDARY INVESTOR AI - VISIONARY RESEARCH DOCUMENT

> **Author:** Founder-Level AI Thinking  
> **Research Date:** Feb 2, 2026  
> **Status:** VISION & DATA COLLECTION - NO EXECUTION  
> **Philosophy:** "Build the future that doesn't exist yet."

---

## Executive Vision Statement

**The Problem:** Current retail investment apps are glorified spreadsheets with basic charting. They tell you WHAT is happening, not WHY. They don't think, reason, or learn. They're tools, not partners.

**The Vision:** Create the world's first **AI Investment Partner** that:
1. **Thinks Like a Legend** - Multi-agent AI that debates, reasons, and explains like Buffett, Burry, and Druckenmiller
2. **Knows Everything** - RAG-powered knowledge of every SEC filing, earnings call, and market event
3. **Understands You** - Personal AI with long-term memory of your goals, risk tolerance, and psychology
4. **Explains Its Thinking** - Chain-of-Thought reasoning that shows WHY, not just WHAT
5. **Never Sleeps** - Autonomous agents monitoring, analyzing, and alerting 24/7

---

## Part 1: Cutting-Edge AI Technologies

### 1.1 Chain-of-Thought (CoT) Reasoning

**What It Is:** AI shows its step-by-step reasoning process, like a human analyst walking through their logic.

**Why It Matters for Finance:**
- Solves the "black box" problem - users understand WHY AI recommends something
- Builds trust - critical for financial decisions
- Required by emerging regulations (EU AI Act)
- 70%+ of financial institutions expected to require explainable AI by late 2025

**Current Gap in Our App:**
- Debate messages are one-liners without reasoning
- No explanation of WHY a legend holds their opinion
- User can't follow the analytical process

**Implementation Vision:**
```
User asks: "Should I buy NVDA?"

CURRENT RESPONSE:
"Buffett: Too expensive. Not for me."

VISIONARY RESPONSE:
"Buffett: [REASONING]
   → Step 1: Analyzing valuation - P/E of 65x is 3x market average
   → Step 2: Checking moat - Strong CUDA ecosystem, but competition rising (AMD MI300)
   → Step 3: Applying margin of safety - Would need 40% drop to my buy zone
   → Step 4: Historical pattern - Reminds me of Cisco in 1999 (brilliant company, terrible price)
   CONCLUSION: Pass. Great business, wrong price. I'll watch from the sidelines."
```

---

### 1.2 Retrieval-Augmented Generation (RAG)

**What It Is:** AI retrieves and grounds its responses in REAL documents (SEC filings, earnings calls, news) rather than relying on potentially outdated training data.

**Why It's Revolutionary:**
- Eliminates hallucinations - every claim backed by source
- Real-time knowledge - not stuck in training cutoff
- Can cite exact page/paragraph from 10-K filings
- Understands MD&A, risk factors, footnotes

**SEC Filing RAG Pipeline:**
1. **Ingest:** Download 10-K, 10-Q, 8-K from EDGAR
2. **Chunk:** Segment into semantic pieces (balance sheet, MD&A, risk factors)
3. **Embed:** Convert to vectors with financial-tuned embeddings
4. **Store:** Vector DB (Pinecone/ChromaDB)
5. **Query:** User asks question → retrieve relevant chunks → generate grounded answer

**Current Gap in Our App:**
- Zero document grounding
- AI responses based on general knowledge, not real filings
- No source citations

**Implementation Vision:**
```
User: "What are Apple's biggest risks?"

VISIONARY RESPONSE:
"Based on Apple's FY2024 10-K filing (filed Nov 2024):

📄 [Source: Risk Factors, Page 12]
1. **Supply Chain Concentration** - 'A significant concentration of our 
   component and assembly capacity is in China' 
   
📄 [Source: Risk Factors, Page 15]  
2. **Services Growth Dependency** - 'Failure to grow services revenue 
   could materially impact our financial results'

📄 [Source: MD&A, Page 45]
3. **China Revenue Decline** - Greater China revenue decreased 8% YoY

[View Full 10-K →]"
```

---

### 1.3 Multi-Agent Swarm Trading Systems

**What It Is:** Multiple specialized AI agents that collaborate, debate, and reach consensus - like a virtual trading desk.

**Agent Roles:**
| Agent | Specialty | What They Do |
|-------|-----------|--------------|
| **Fundamental Analyst** | Financials | Parse balance sheets, calculate intrinsic value |
| **Technical Analyst** | Charts | Identify patterns, support/resistance, momentum |
| **Sentiment Analyst** | Market Mood | Analyze news, Twitter, Reddit, earnings calls |
| **Risk Manager** | Exposure | Monitor portfolio risk, correlation, drawdown |
| **Macro Strategist** | Big Picture | Fed policy, geopolitics, sector rotation |
| **Execution Agent** | Timing | Optimal entry/exit points, order sizing |

**How They Collaborate:**
```
Topic: "Should we buy META?"

[FUNDAMENTAL]: Strong cash flow, 30% ROIC, reasonable P/E at 25x. BUY.
[TECHNICAL]: Breaking out of 6-month consolidation, RSI at 65. BUY.
[SENTIMENT]: Negative news on AI spending concerns, -15% sentiment score. CAUTION.
[MACRO]: Ad spending soft in Q1 historically, but AI tailwinds strong. NEUTRAL.
[RISK MANAGER]: Portfolio already 15% tech, adding META increases sector concentration. REDUCE POSITION SIZE.

CONSENSUS: BUY with half-position, reassess after Q1 earnings.
```

**Current Gap in Our App:**
- Single AI personality per response
- No agent collaboration or debate protocol
- No specialized expertise per agent

---

### 1.4 Knowledge Graphs & Financial Ontologies

**What It Is:** A semantic network connecting companies, people, events, and concepts - not just data points.

**Why It's Powerful:**
- Understands RELATIONSHIPS, not just entities
- "Apple" is connected to: Tim Cook → suppliers → competitors → products → China → trade policy
- Can traverse: "If China tariffs increase → impact on Apple suppliers → cascade to stock price"

**Financial Ontology (FIBO Standard):**
```
COMPANY: Apple Inc.
├── CEO: Tim Cook
├── SECTOR: Technology
├── SUPPLIERS: 
│   ├── TSMC (chips) → Taiwan exposure
│   ├── Foxconn (assembly) → China exposure
│   └── Samsung (displays) → Korea exposure
├── COMPETITORS:
│   ├── Samsung (phones)
│   ├── Google (AI/phones)
│   └── Microsoft (ecosystem)
├── REGULATORY:
│   ├── EU Digital Markets Act
│   └── China data laws
└── MACRO SENSITIVITY:
    ├── Consumer spending (high)
    ├── Interest rates (medium)
    └── USD strength (high - 60% international revenue)
```

**Current Gap in Our App:**
- Stocks are treated as isolated entities
- No relationship mapping
- Can't answer: "Which of my stocks are exposed to China tariffs?"

---

### 1.5 Causal AI & Counterfactual Analysis

**What It Is:** Understanding CAUSE and EFFECT, not just correlation. Asking "What would happen IF...?"

**Why Correlation Isn't Enough:**
- Traditional AI: "Stocks A and B move together" (correlation)
- Causal AI: "Raising interest rates CAUSES tech stocks to decline because..." (causation)

**Counterfactual Scenarios:**
```
User: "What if the Fed cuts rates by 100bps?"

CAUSAL AI RESPONSE:
"Based on causal model:

DIRECT EFFECTS:
→ Bond prices ↑ 8-12% (inverse yield relationship)
→ Growth stocks ↑ 15-25% (lower discount rate on future earnings)
→ Banks ↓ 5-10% (net interest margin compression)

SECOND-ORDER EFFECTS:
→ Housing demand ↑ (cheaper mortgages)
→ Consumer spending ↑ (wealth effect + lower debt service)
→ USD weakens (yield differential with EU/Japan)

YOUR PORTFOLIO IMPACT:
→ Current portfolio: +11.3% projected
→ Most benefited holding: NVDA (+22% projected)
→ Most hurt holding: JPM (-7% projected)

RECOMMENDATION: Reduce JPM, increase duration in bond allocation"
```

**Current Gap in Our App:**
- No scenario analysis
- No "what if" capabilities
- Can't model portfolio impact of macro events

---

### 1.6 Neuro-Symbolic AI

**What It Is:** Combining neural networks (pattern recognition) with symbolic reasoning (logic, rules).

**Why Both Are Needed:**
- Neural networks: Great at patterns, bad at rules
- Symbolic AI: Great at rules, bad at patterns
- Finance needs BOTH: "P/E must be < 20 AND trend is bullish AND sentiment is positive"

**Application Example:**
```
Rule Layer (Symbolic):
- Buffett Quality Screen: ROIC > 15%, Debt/Equity < 50%, 10yr EPS growth > 8%
- Magic Formula: High earnings yield + high ROIC

Pattern Layer (Neural):
- Chart pattern recognition (head & shoulders, flags)
- Earnings call sentiment analysis
- Anomaly detection in price action

COMBINED OUTPUT:
"GOOGL passes Buffett Quality Screen (ROIC: 32%, D/E: 5%, 10yr EPS growth: 18%)
 + Neural network detects bullish flag formation on weekly chart
 + Earnings call sentiment: +0.72 (positive)
 = HIGH CONVICTION BUY"
```

**Current Gap in Our App:**
- Screener uses only basic filters (P/E, Growth, ROIC)
- No pattern recognition on charts
- No rule + pattern combination

---

### 1.7 Foundation Models for Finance (FinGPT/BloombergGPT)

**What They Are:**
- **BloombergGPT:** 50B params, trained on 363B tokens of Bloomberg financial data (closed-source)
- **FinGPT:** Open-source alternative, fine-tuned with LoRA, uses RLSP (Reinforcement Learning on Stock Prices)

**Why Domain-Specific Matters:**
- General LLMs make mistakes on financial jargon
- FinGPT understands: "The 10-year/2-year spread inverted" → recession signal
- BloombergGPT can generate BQL queries, understand terminal commands

**Current Gap in Our App:**
- Using general Claude model (excellent, but not finance-specialized)
- Could fine-tune or use FinGPT for specialized financial reasoning

---

### 1.8 Digital Twins & Stress Testing

**What It Is:** A virtual replica of your portfolio that can be stress-tested under thousands of scenarios.

**Stress Testing Scenarios:**
1. 2008-style financial crisis
2. COVID-19 market crash (30% drop in 30 days)
3. Stagflation (high inflation + recession)
4. Tech bubble burst (50% correction in growth stocks)
5. Black swan event (random 20% overnight gap)

**Monte Carlo Simulation:**
```
Running 10,000 simulations for your portfolio...

RESULTS:
- Median 10-year return: +142%
- 95th percentile (good case): +287%
- 5th percentile (bad case): +12%
- Probability of loss after 10 years: 3.2%
- Maximum drawdown (95% confidence): -38%

STRESS TEST: 2008 Scenario
- Projected portfolio decline: -42%
- Recovery time: 4.2 years
- Most vulnerable holding: [HIGH BETA STOCK]
```

**Current Gap in Our App:**
- No simulation capabilities
- No stress testing
- No Monte Carlo projections

---

## Part 2: Innovative Features Nobody Has Built

### 2.1 "Legend Mode" - Debate with Persistent Memory

**Innovation:** Legends REMEMBER your portfolio, your history, your mistakes.

```
Buffett: "I notice you bought TSLA at $400 last year. You told me you
         bought it for the growth story. It's now at $180. Are you still
         holding because of fundamentals, or because you can't admit the
         loss? That's called loss aversion, and I've seen it destroy portfolios."
```

---

### 2.2 "Fear & Greed Coach" - Emotional AI Guardrails

**Innovation:** AI detects when you're about to make an emotional mistake.

```
[ALERT: PANIC SELLING DETECTION]

You're about to sell your entire portfolio at a -15% loss.
Historical pattern: 87% of panic sellers regret within 6 months.

Your portfolio has recovered from similar drops 4 times before.
Average recovery time: 8 months.

Before you proceed, let's talk:
- Why do you want to sell right now?
- What new information changed your thesis?
- Would Buffett sell in this situation?

[CONTINUE ANYWAY] [TALK TO AI COACH] [WAIT 24 HOURS]
```

---

### 2.3 "What If Machine" - Interactive Scenario Builder

**Innovation:** Drag-and-drop scenario building with AI impact analysis.

```
┌─────────────────────────────────────────┐
│          WHAT IF SCENARIO BUILDER        │
├─────────────────────────────────────────┤
│ [+] Fed cuts rates 50bps              ▼ │
│ [+] China invades Taiwan               ▼ │
│ [+] Inflation spikes to 8%            ▼ │
│ [+] NVDA beats earnings by 20%        ▼ │
├─────────────────────────────────────────┤
│ YOUR PORTFOLIO IMPACT:                   │
│ ████████░░░░░░░ -23.4%                   │
│                                          │
│ LEGEND COMMENTARY:                       │
│ Burry: "Taiwan scenario is your biggest │
│ risk. You have 40% exposure through     │
│ TSMC, Apple, and Nvidia supply chains." │
└─────────────────────────────────────────┘
```

---

### 2.4 "AI Investment Thesis Generator"

**Innovation:** AI writes full investment memos with citations.

```
📝 INVESTMENT THESIS: GOOGLE (GOOGL)

EXECUTIVE SUMMARY:
Buy GOOGL at $170 with 12-month target of $220 (29% upside).

BULL CASE (60% probability):
1. Search moat intact despite AI concerns
2. Cloud growing 30%+ with AI tailwinds
3. YouTube monetization accelerating
[Source: Q4 2025 Earnings Call, timestamp 23:45]

BEAR CASE (25% probability):
1. Antitrust ruling forces Search/Android separation
2. AI Overviews cannibalize ad clicks
[Source: DOJ Filing, April 2025]

VALUATION:
- DCF (10% WACC): $195 fair value
- Comp Analysis: Trading at 20% discount to peers
- Sum-of-Parts: Search $150B, Cloud $80B, YouTube $50B

RISK FACTORS:
- Regulatory (HIGH)
- AI disruption (MEDIUM)
- China revenue (LOW)

POSITION SIZING: 
- Recommend 5% of portfolio given risk/reward
- Stop-loss at $145 (-15%)
```

---

### 2.5 "Legend Council" - Multi-Agent Voting System

**Innovation:** Watch legends vote on your decisions with confidence scores.

```
QUESTION: "Should I add to my AAPL position?"

             BUFFETT    MUNGER     BURRY      LYNCH     DRUCK
             ────────────────────────────────────────────────
VOTE:         ✓ YES     ✓ YES     ✗ NO       ○ WAIT    ✓ YES
CONFIDENCE:    85%       78%       92%        45%       71%
REASONING:   [expand]   [expand]  [expand]   [expand]  [expand]

COUNCIL VERDICT: 3-1-1 in favor of YES (avg confidence: 74%)

DISSENT NOTE (Burry):
"Apple is a great business at the wrong price. P/E of 32 with
single-digit growth isn't Buffett's game - it's Buffett's legacy.
I'm waiting for a 25% pullback."
```

---

### 2.6 "Gamified Learning Journey"

**Innovation:** Learn investing through XP, achievements, and challenges.

```
🎮 YOUR INVESTOR PROFILE

Level: 23 (Value Apprentice)
XP: 4,520 / 5,000 to next level

ACHIEVEMENTS UNLOCKED:
🏆 First Trade - Made your first investment
🏆 Diamond Hands - Held through a -20% dip
🏆 Thesis Writer - Wrote your first investment thesis
🏆 Buffett Disciple - Passed the Value Investing quiz
🔒 Contrarian King - Buy when others are fearful (LOCKED)

TODAY'S CHALLENGES:
□ Read one 10-K filing (+100 XP)
□ Ask a legend about a stock (+50 XP)
□ Correctly identify a chart pattern (+75 XP)
```

---

### 2.7 "AI-Generated Stock Stories"

**Innovation:** Transform dry financial data into compelling narratives.

```
📖 THE NVIDIA STORY (2024-2025)

CHAPTER 1: The AI Awakening
In late 2023, something extraordinary happened. Jensen Huang's 
30-year bet on GPUs suddenly paid off in ways no one imagined. 
ChatGPT had awakened the world to AI, and every company on Earth 
needed NVIDIA's chips to survive...

CHAPTER 2: The $1 Trillion Club
By June 2024, NVIDIA joined Apple, Microsoft, and Amazon in the 
elite trillion-dollar club. But whispers grew louder: "Is this 
1999 all over again?"

CHAPTER 3: The Competition Awakens
AMD's MI300 chip arrived. Amazon built Trainium. Google had TPUs.
The question became: Can NVIDIA maintain its 80% market share?

[CONTINUE READING] or [HEAR BUFFETT'S TAKE]
```

---

## Part 3: Gap Analysis - Current App vs. Vision

| Feature | Current State | Visionary State | Gap Level |
|---------|---------------|-----------------|-----------|
| **Reasoning** | One-liners | Chain-of-Thought | 🔴 Critical |
| **Knowledge** | General LLM | RAG + SEC filings | 🔴 Critical |
| **Agents** | Single AI | Multi-agent swarm | 🔴 Critical |
| **Memory** | Stateless | Persistent user memory | 🟡 Medium |
| **Relationships** | Isolated stocks | Knowledge Graph | 🟡 Medium |
| **Scenarios** | None | Causal AI + Monte Carlo | 🟡 Medium |
| **Charts** | None | Multimodal pattern recognition | 🟡 Medium |
| **Emotions** | None | Fear/Greed coaching | 🟢 Innovation |
| **Gamification** | None | XP, achievements, challenges | 🟢 Innovation |
| **Stories** | None | AI narrative generation | 🟢 Innovation |
| **Voting** | Single opinion | Legend Council | 🟢 Innovation |
| **Thesis** | None | Auto-generated memos | 🟢 Innovation |
| **Voice** | Input only | Two-way conversation | 🟡 Medium |
| **Real Data** | Mock/hardcoded | Live APIs | 🔴 Critical |
| **Stress Test** | None | Digital Twin simulation | 🟢 Innovation |

---

## Part 4: Implementation Priority Matrix

### Tier 1: Foundation (Do First)
1. **Real Data Integration** - Replace ALL mock data with live APIs
2. **RAG Pipeline** - Build SEC filing ingestion and retrieval
3. **Chain-of-Thought Prompts** - Upgrade all AI prompts to show reasoning

### Tier 2: Differentiation (Do Next)
4. **Multi-Agent Debates** - Specialized agents with collaboration protocol
5. **Persistent Memory** - User portfolio history, preferences, psychology
6. **Knowledge Graph** - Stock relationships, supply chains, macro connections

### Tier 3: Innovation (Moonshots)
7. **Causal AI** - "What If" scenario engine
8. **Fear/Greed Coach** - Emotional guardrails
9. **Legend Council** - Voting system with confidence scores
10. **Gamification** - XP, achievements, learning journey
11. **AI Stories** - Narrative generation for stocks

### Tier 4: Future (Watch & Research)
12. **Quantum ML** - Portfolio optimization (when hardware matures)
13. **Federated Learning** - Cross-user insights without privacy loss
14. **Digital Twin** - Full portfolio simulation sandbox

---

## Part 5: Technical Architecture Vision

```
┌─────────────────────────────────────────────────────────────────┐
│                    LEGENDARY INVESTOR AI                         │
│                   "Think Different. Invest Smarter."             │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────┼─────────────────────────────────┐
│                         DATA LAYER                              │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐   │
│  │ Finnhub   │  │ CoinGecko │  │ SEC EDGAR │  │ News APIs │   │
│  │ (Stocks)  │  │ (Crypto)  │  │ (Filings) │  │(Sentiment)│   │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘   │
│        └──────────────┼─────────────────────────────┘          │
│                       ▼                                         │
│            ┌─────────────────────┐                              │
│            │   Data Aggregation  │                              │
│            │    + Normalization  │                              │
│            └──────────┬──────────┘                              │
└─────────────────────────┼───────────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────────┐
│                    KNOWLEDGE LAYER                               │
│  ┌───────────────────┐  │  ┌───────────────────┐                │
│  │   Vector Store    │  │  │  Knowledge Graph  │                │
│  │  (RAG Embeddings) │  │  │  (Relationships)  │                │
│  └─────────────────┬─┘  │  └────────┬──────────┘                │
│                    └────┴───────────┘                           │
│                          │                                       │
│            ┌─────────────┴─────────────┐                        │
│            │    Retrieval Orchestrator │                        │
│            │   (Semantic + Graph Query)│                        │
│            └─────────────┬─────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────────┐
│                    AI REASONING LAYER                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐│
│  │ Buffett AI │  │ Burry AI   │  │ Lynch AI   │  │ Druck AI   ││
│  │ (Value)    │  │ (Contrarian)│ │ (GARP)     │  │ (Macro)    ││
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘│
│         └───────────────┼───────────────────────────────┘       │
│                         ▼                                        │
│              ┌─────────────────────┐                             │
│              │  Legend Council     │                             │
│              │  (Debate + Vote)    │                             │
│              └──────────┬──────────┘                             │
│                         ▼                                        │
│              ┌─────────────────────┐                             │
│              │ Chain-of-Thought    │                             │
│              │ Explainer           │                             │
│              └──────────┬──────────┘                             │
└─────────────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────────┐
│                    PERSONALIZATION LAYER                         │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│  │ User Memory    │  │ Risk Profiler  │  │ Emotion Coach  │     │
│  │ (Long-term)    │  │ (Psychology)   │  │ (Fear/Greed)   │     │
│  └────────────────┘  └────────────────┘  └────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────────┐
│                    PRESENTATION LAYER                            │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐    │
│  │Dashboard│  │Screener│  │Watchlist│  │ Debate │  │ Ticker │   │
│  └────────┘  └────────┘  └────────┘  └────────┘  └────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Appendix A: Data Sources Reference

### Stock Data APIs
| Provider | Free Tier | Best For |
|----------|-----------|----------|
| Finnhub | Yes | Real-time WebSocket |
| EODHD | 20 req/day | Global coverage |
| FMP | 250 req/day | Fundamentals |
| Polygon | 5 req/min | Historical |

### Crypto APIs
| Provider | Best For |
|----------|----------|
| CoinGecko | Market data, trending |
| CoinAPI | Multi-exchange |
| Bitquery | On-chain data |

### Commodity APIs
| Provider | Coverage |
|----------|----------|
| OilpriceAPI | Oil, Gold, Gas |
| AllTick | Precious metals |
| Databento | CME Futures |

### Alternative Data
| Source | Data Type |
|--------|-----------|
| SEC EDGAR | 10-K, 10-Q, 8-K filings |
| Twitter/X API | Social sentiment |
| Reddit API | WSB mentions |
| News APIs | Market news stream |

---

## Appendix B: Competitive Landscape

| Competitor | What They Have | What We'll Build Better |
|------------|----------------|------------------------|
| **Robinhood** | Gamification, free trades | AI reasoning, not just gamification |
| **Bloomberg Terminal** | Data, data, data | AI-first, consumer-friendly |
| **Seeking Alpha** | Articles, ratings | AI-written theses with sources |
| **Danelfin** | AI scores | Explainable AI with CoT |
| **ChatGPT** | General knowledge | Finance-specialized RAG |
| **Magnifi** | Chat-based search | Multi-agent debates |

---

## Final Thought

> "The best way to predict the future is to invent it."  
> — Alan Kay

This app isn't about building what exists. It's about building what SHOULD exist. 

Every retail investor deserves access to the collective wisdom of Buffett, Burry, Munger, and Druckenmiller - not as a gimmick, but as genuine AI partners that think, reason, remember, and explain.

**The future is multi-agent, memory-rich, causally-aware, emotionally intelligent AI.**

Let's build it.

---

*Document Version: 2.0 | Last Updated: Feb 2, 2026 | Status: READY FOR EXECUTION*
