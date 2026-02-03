# 🛠️ IMPLEMENTATION PLAYBOOK
## How to Build Everything (For Non-Technical Users)

> **Who This Is For:** You're using Antigravity to build. You give prompts, I do the work.
> **Philosophy:** Free or cheap. Phase by phase. Verify before moving on.

---

## 💰 COST SUMMARY (Monthly)

| Service | Free Tier | Paid Option | What It Does |
|---------|-----------|-------------|--------------|
| **OpenRouter** | $0 (pay-per-use) | ~$5-20/mo | AI responses (you already have this) |
| **Supabase** | ✅ FREE | $25/mo | Database (you already have this) |
| **Finnhub** | ✅ FREE (60 calls/min) | $0 | Real stock data |
| **CoinGecko** | ✅ FREE | $0 | Crypto data |
| **Vercel** | ✅ FREE (hobby) | $20/mo | Hosting (you already have this) |
| **SEC EDGAR** | ✅ FREE | $0 | Company filings |
| **Pinecone** | ✅ FREE (100K vectors) | $70/mo | Vector DB for RAG |

**TOTAL: $0-5/month to start. Scale to ~$35/month for production.**

---

## 📍 YOUR CURRENT CODEBASE MAP

```
legendary-investor-ui/
├── app/
│   ├── api/                    ← WHERE AI LIVES
│   │   ├── analyze/route.ts   ← Watchlist AI analysis
│   │   ├── debate/route.ts    ← Legend debates
│   │   ├── portfolio/parse/route.ts  ← Voice parsing
│   │   └── stocks/route.ts    ← Stock data (needs real API)
│   ├── dashboard/page.tsx     ← Dashboard (needs upgrades)
│   ├── portfolio/page.tsx     ← Portfolio input
│   ├── screener/page.tsx      ← Stock screener (mock data!)
│   └── page.tsx               ← Homepage with debate
├── components/
│   ├── debate-box.tsx         ← Main debate UI
│   ├── watchlist-view.tsx     ← Watchlist UI
│   ├── market-ticker.tsx      ← Scrolling ticker
│   └── ...
├── lib/
│   ├── supabase.ts            ← Database connection
│   └── legends.ts             ← Legend data (Buffett, Burry, etc.)
└── .env.local                 ← YOUR API KEYS ✅
```

---

# PHASE 1: FIX THE BASICS (Week 1)
## Goal: Replace all mock data with real APIs

### Step 1.1: Add Real Stock Prices to Screener

**THE PROBLEM:** `screener/page.tsx` has 20 hardcoded stocks with fake P/E, Growth, etc.

**PROMPT TO GIVE ME:**
```
Replace the hardcoded screenerData in app/screener/page.tsx with real 
data from Finnhub API. 

Steps:
1. Create a new API route at app/api/screener/route.ts
2. Use Finnhub free API to fetch real P/E, growth, ROIC for a list of symbols
3. Update the screener page to fetch from our API on load
4. Keep the same table UI, just use real data

Finnhub API key: I'll add FINNHUB_API_KEY to .env.local
Free tier: 60 calls/minute
```

**THEN ADD TO .env.local:**
```
FINNHUB_API_KEY=your_key_here
```

**GET YOUR FREE KEY:** https://finnhub.io/ → Sign up → Copy API key

**WHAT CHANGES:**
- File modified: `app/screener/page.tsx`
- File created: `app/api/screener/route.ts`

**VERIFY IT WORKED:**
```
Tell me: Open the screener page and check if the P/E ratios match 
what Finnhub shows for those stocks
```

---

### Step 1.2: Add Real Prices to Market Ticker

**THE PROBLEM:** `market-ticker.tsx` has some real headlines but hardcoded prices

**PROMPT TO GIVE ME:**
```
Update components/market-ticker.tsx to fetch real prices:

1. Create app/api/ticker/route.ts that fetches:
   - Top 5 stock movers (Finnhub)
   - BTC and ETH prices (CoinGecko - free, no key needed)
   - Major indices (SPY, QQQ, DIA)

2. Update market-ticker.tsx to:
   - Fetch data on component mount
   - Refresh every 60 seconds
   - Keep the alert styling for big moves (>2%)

CoinGecko API (free, no key): https://api.coingecko.com/api/v3/simple/price
Finnhub API: Use the key from step 1.1
```

**VERIFY IT WORKED:**
```
Check the ticker on the homepage - do prices update? Compare to Google Finance
```

---

### Step 1.3: Fix the Dashboard Placeholders

**THE PROBLEM:** Dashboard shows "Coming soon..." and only one Buffett quote

**PROMPT TO GIVE ME:**
```
Upgrade app/dashboard/page.tsx:

1. Add a quotes array with 20+ legendary investor quotes
   - Rotate randomly on each page load
   
2. Replace "Saved Watchlists - Coming soon" with:
   - Fetch user's watchlist from Supabase (if logged in)
   - Show "Sign in to save watchlists" if not logged in

3. Replace "Recent Analysis" placeholder:
   - Store last 5 analyses in localStorage
   - Show them in a list with stock symbol and date

No external APIs needed for this - just use existing Supabase + localStorage
```

---

### Step 1.4: Fix Voice → Textarea Bug

**THE PROBLEM:** Voice transcription doesn't populate the main text box

**PROMPT TO GIVE ME:**
```
Fix the voice input in app/portfolio/page.tsx:

The issue: When user speaks, the transcript should appear in the 
main textarea (portfolioText state), but it's not connected.

1. In PortfolioVoiceInput, ensure the onHoldingsParsed callback 
   properly updates the parent's state
2. The transcript text should appear in the textarea immediately
3. After parsing, the structured holdings should also show

Debug by checking: Is handleVoiceParsed being called? What's in the data?
```

---

## PHASE 1 VERIFICATION CHECKLIST

Before moving to Phase 2, verify:
- [ ] Screener shows real P/E ratios (check AAPL, GOOGL match Finnhub)
- [ ] Ticker shows real BTC/ETH prices (check against CoinGecko)
- [ ] Dashboard rotates quotes (refresh page 3x, see different quotes)
- [ ] Voice input appears in textarea (test with microphone)

**PROMPT TO VERIFY:**
```
Run all the Phase 1 verification checks and tell me what's working 
and what's not. Show me screenshots or browser output.
```

---

# PHASE 2: UPGRADE AI REASONING (Week 2)
## Goal: Make AI show its thinking (Chain-of-Thought)

### Step 2.1: Upgrade Debate Prompts

**THE PROBLEM:** Legends give short answers without explaining WHY

**PROMPT TO GIVE ME:**
```
Upgrade app/api/debate/route.ts to use Chain-of-Thought reasoning:

1. Update the system prompt to require step-by-step reasoning:
   - Step 1: State the key fact about the stock
   - Step 2: Apply your investing framework
   - Step 3: Consider the counterargument
   - Step 4: Give your verdict with confidence %

2. Keep responses concise (under 300 chars) but structured

3. Add a "reasoning" field to the response that shows the steps

Example output format:
{
  "verdict": "PASS",
  "confidence": 75,
  "reasoning": [
    "P/E of 65 is 3x my comfort zone",
    "Moat is strong but competition rising",
    "Would buy at 40% discount"
  ],
  "message": "Great business, wrong price. Pass for now."
}

Update debate-box.tsx to show the reasoning steps in a collapsible section
```

**WHAT CHANGES:**
- File modified: `app/api/debate/route.ts`
- File modified: `components/debate-box.tsx`

---

### Step 2.2: Add "Why" Explanations to Watchlist

**PROMPT TO GIVE ME:**
```
Upgrade the watchlist analysis in app/api/analyze/route.ts:

Current: Returns just a signal (BUY/HOLD/SELL) and one-liner

New: Return structured reasoning:
{
  "symbol": "AAPL",
  "signal": "HOLD",
  "confidence": 68,
  "bullCase": "Strong ecosystem, services growing 15%",
  "bearCase": "P/E stretched at 32x, growth slowing to 8%",
  "keyMetric": "Services revenue now 22% of total",
  "actionItem": "Wait for P/E under 25 or earnings beat"
}

Update components/watchlist-view.tsx to show bull/bear case on expand
```

---

### Step 2.3: Add Legend Context Memory

**THE PROBLEM:** Legends don't remember what you talked about before

**PROMPT TO GIVE ME:**
```
Add conversation memory to the debate:

1. Store last 10 messages in localStorage (per session)
2. Send previous messages as context to the API
3. Add "Remember I said..." capability

In debate-box.tsx:
- On mount, load messages from localStorage
- On new message, save to localStorage
- Pass message history to /api/debate

In app/api/debate/route.ts:
- Accept 'history' parameter
- Include in prompt: "Previous conversation: {history}"
- Tell AI: "Reference previous points when relevant"
```

---

## PHASE 2 VERIFICATION CHECKLIST

- [ ] Debate responses show reasoning steps (expandable)
- [ ] Watchlist items show bull/bear case on click
- [ ] Conversation persists after page refresh
- [ ] Legends reference previous messages sometimes

---

# PHASE 3: REAL DOCUMENT KNOWLEDGE (Week 3-4)
## Goal: AI knows REAL SEC filings (RAG)

### This Is The Big One - Here's How RAG Works:

```
[User Question] → [Find Relevant Doc Chunks] → [Add to Prompt] → [Grounded Answer]
```

### Step 3.1: Set Up Pinecone (Free Vector Database)

**GET YOUR FREE ACCOUNT:**
1. Go to https://www.pinecone.io/
2. Sign up (free tier = 100,000 vectors = ~100 company filings)
3. Create an index called "legendary-investor"
4. Copy your API key

**ADD TO .env.local:**
```
PINECONE_API_KEY=your_key_here
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX=legendary-investor
```

---

### Step 3.2: Create the SEC Filing Ingestion Pipeline

**PROMPT TO GIVE ME:**
```
Create a SEC filing ingestion system:

1. Create lib/rag/sec-fetcher.ts:
   - Function to download 10-K filings from SEC EDGAR
   - Parse the filing text (remove HTML)
   - Chunk into ~500 word segments with metadata

2. Create lib/rag/embeddings.ts:
   - Use OpenRouter to generate embeddings (text-embedding-ada-002)
   - Store in Pinecone with metadata (company, year, section)

3. Create app/api/ingest/route.ts:
   - POST endpoint that takes a stock symbol
   - Downloads latest 10-K
   - Chunks and stores in Pinecone
   - Returns: { success: true, chunks: 145 }

SEC EDGAR API (free): https://www.sec.gov/cgi-bin/browse-edgar

Start with just 5 popular stocks: AAPL, GOOGL, MSFT, NVDA, TSLA
```

**COST:** $0 (SEC is free, Pinecone free tier, OpenRouter embeddings ~$0.01 per filing)

---

### Step 3.3: Create the Retrieval API

**PROMPT TO GIVE ME:**
```
Create app/api/rag/query/route.ts:

1. Accept a question and optional stock symbol
2. Generate embedding for the question
3. Query Pinecone for top 5 relevant chunks
4. Return chunks with metadata (source, page, section)

Example:
POST /api/rag/query
{ "question": "What are Apple's biggest risks?", "symbol": "AAPL" }

Response:
{
  "chunks": [
    { "text": "A significant concentration...", "source": "10-K 2024", "section": "Risk Factors", "relevance": 0.92 }
  ]
}
```

---

### Step 3.4: Integrate RAG into Debates

**PROMPT TO GIVE ME:**
```
Upgrade app/api/debate/route.ts to use RAG:

1. Before generating response, call /api/rag/query with the debate topic
2. Add retrieved chunks to the system prompt:
   "Use these SEC filing excerpts to ground your response:
    [chunks]
    Always cite your source: (Source: 10-K 2024, Risk Factors)"

3. Update response format to include sources:
   {
     "message": "...",
     "sources": [
       { "text": "excerpt...", "filing": "10-K 2024", "section": "Risk Factors" }
     ]
   }

4. Update debate-box.tsx to show [View Sources] link that expands citations
```

---

## PHASE 3 VERIFICATION CHECKLIST

- [ ] Can ingest a 10-K filing (run: ingest AAPL)
- [ ] RAG query returns relevant chunks
- [ ] Debate responses cite SEC filings
- [ ] Sources link shows the actual excerpt

---

# PHASE 4: MULTI-AGENT COUNCIL (Week 5)
## Goal: Multiple AI agents debate and vote

### Step 4.1: Create Specialized Agent Prompts

**PROMPT TO GIVE ME:**
```
Create lib/agents/agent-prompts.ts with specialized agents:

1. BUFFETT_AGENT:
   - Focus: Value investing, moats, management quality
   - Metrics: ROIC, owner earnings, debt levels
   - Bias: Conservative, long-term, hates complexity

2. BURRY_AGENT:
   - Focus: Deep value, contrarian plays, shorts
   - Metrics: Book value, hidden assets, market irrationality
   - Bias: Skeptical, looks for what others miss

3. LYNCH_AGENT:
   - Focus: GARP, understand the business, local knowledge
   - Metrics: PEG ratio, growth sustainability
   - Bias: Optimistic on growth at reasonable price

4. DRUCKENMILLER_AGENT:
   - Focus: Macro, sector rotation, timing
   - Metrics: Fed policy, economic indicators
   - Bias: Willing to be aggressive when odds favor

Each agent should have:
- systemPrompt: string
- analyzeStock(symbol, data): Promise<Analysis>
- vote(): 'BUY' | 'HOLD' | 'SELL'
- confidence: number (0-100)
```

---

### Step 4.2: Create the Council Endpoint

**PROMPT TO GIVE ME:**
```
Create app/api/council/route.ts:

1. Accept a stock symbol and question
2. Run all 4 agents IN PARALLEL (Promise.all)
3. Collect votes and reasoning from each
4. Calculate consensus:
   - 4-0: "STRONG CONSENSUS"
   - 3-1: "MAJORITY AGREES"
   - 2-2: "COUNCIL DIVIDED"

Response format:
{
  "symbol": "NVDA",
  "question": "Should I buy?",
  "votes": {
    "buffett": { "vote": "HOLD", "confidence": 75, "reasoning": "..." },
    "burry": { "vote": "SELL", "confidence": 85, "reasoning": "..." },
    "lynch": { "vote": "BUY", "confidence": 60, "reasoning": "..." },
    "druckenmiller": { "vote": "BUY", "confidence": 70, "reasoning": "..." }
  },
  "consensus": "COUNCIL DIVIDED",
  "summary": "2-1-1 split. Value investors cautious on valuation, growth investors see AI tailwinds."
}
```

---

### Step 4.3: Create Council UI Component

**PROMPT TO GIVE ME:**
```
Create components/legend-council.tsx:

1. Visual panel showing 4 legend avatars in a row
2. Each has a vote badge: ✓ BUY (green), ○ HOLD (yellow), ✗ SELL (red)
3. Confidence meter below each (progress bar 0-100%)
4. Click to expand reasoning
5. Summary banner at bottom with consensus

Add this to the debate page and watchlist detail view
Can be triggered with a "Ask Council" button
```

---

# PHASE 5: ADVANCED FEATURES (Week 6+)
## Goal: The innovative stuff nobody else has

### Step 5.1: Fear & Greed Coach

**PROMPT TO GIVE ME:**
```
Create an emotional guardrails system:

1. Create lib/psychology/emotion-detector.ts:
   - Detect patterns: Selling during dips, buying at highs
   - Track user's trade history in localStorage
   - Calculate "emotional score" (0-100)

2. Create components/emotion-coach.tsx:
   - Shows when risky behavior detected
   - "You're about to sell at a -15% loss..."
   - Provides Buffett/Munger wisdom
   - [Proceed Anyway] vs [Wait 24 Hours]

3. Trigger on watchlist removal during red days
   Trigger on rapid buy after big green day
```

---

### Step 5.2: What-If Scenario Builder

**PROMPT TO GIVE ME:**
```
Create components/what-if-builder.tsx:

1. Drag-and-drop scenario cards:
   - "Fed cuts rates 50bps"
   - "China tariffs +25%"
   - "Recession starts"
   - "Inflation spikes to 8%"

2. When card added, call app/api/scenario/route.ts:
   - Calculate impact on each holding
   - Use simple rules + AI reasoning

3. Show portfolio impact:
   - Red/green bar showing % change
   - List of most affected stocks
   - AI explanation of why

Start simple with 5 scenarios, expand later
```

---

### Step 5.3: AI Investment Thesis Generator

**PROMPT TO GIVE ME:**
```
Create app/api/thesis/route.ts:

Given a stock symbol, generate a full investment thesis:

1. Fetch data: price, fundamentals, recent news
2. Query RAG for relevant 10-K sections
3. Generate structured thesis:
   - Executive Summary (2-3 sentences)
   - Bull Case (3 points with sources)
   - Bear Case (3 points with sources)
   - Valuation (DCF rough estimate, comparables)
   - Risk Factors (top 3)
   - Recommended Action
   - Position Sizing suggestion

Output as markdown, display in a modal or dedicated page
```

---

# 📋 MASTER PROMPT CHEAT SHEET

Copy-paste these when ready:

| Phase | Prompt Start |
|-------|--------------|
| 1.1 | "Replace the hardcoded screenerData with Finnhub API..." |
| 1.2 | "Update market-ticker.tsx to fetch real prices..." |
| 1.3 | "Upgrade app/dashboard/page.tsx with rotating quotes..." |
| 1.4 | "Fix the voice input so transcript appears in textarea..." |
| 2.1 | "Upgrade debate API to use Chain-of-Thought reasoning..." |
| 2.2 | "Upgrade watchlist analysis to return bull/bear case..." |
| 2.3 | "Add conversation memory using localStorage..." |
| 3.1 | "Set up Pinecone integration for RAG..." |
| 3.2 | "Create SEC filing ingestion pipeline..." |
| 3.3 | "Create RAG query endpoint..." |
| 3.4 | "Integrate RAG into debate responses..." |
| 4.1 | "Create specialized agent prompts for council..." |
| 4.2 | "Create council voting endpoint..." |
| 4.3 | "Create council UI component..." |
| 5.1 | "Create emotional guardrails system..." |
| 5.2 | "Create what-if scenario builder..." |
| 5.3 | "Create AI investment thesis generator..." |

---

# ⏱️ TIMELINE ESTIMATE

| Phase | Time | Complexity | Cost |
|-------|------|------------|------|
| Phase 1 | 3-4 days | Easy | FREE (Finnhub/CoinGecko) |
| Phase 2 | 2-3 days | Easy | FREE (prompt changes only) |
| Phase 3 | 5-7 days | Medium | ~$1/mo (Pinecone free + OpenRouter) |
| Phase 4 | 3-4 days | Medium | FREE (same API, more calls) |
| Phase 5 | 5-7 days | Medium | FREE |

**TOTAL: ~3-4 weeks for full implementation**

---

# 🚦 HOW TO START

**RIGHT NOW, TELL ME:**
```
Let's start Phase 1. First, help me set up the Finnhub API:
1. Walk me through getting the free API key
2. Add it to my .env.local
3. Implement Step 1.1 (real screener data)
```

I'll guide you through each step, write all the code, test it, and verify it works before moving on.

**Ready when you are! 🚀**
