# Legendary Investor UI Development

# Task: AI Enhancement Research & Implementation

## Current Status
- [x] Initial research completed
- [x] Detailed visionary document created
- [x] Implementation playbook approved

## Phase 1: Fix The Basics (Real Data) ✅ COMPLETE
- [x] Step 1.1: Add Finnhub API for real screener data
- [x] Step 1.2: Add real prices to market ticker
- [x] Step 1.3: Fix dashboard placeholders
- [x] Step 1.4: Fix voice → textarea bug

## Phase 2: Upgrade AI Reasoning ✅ COMPLETE
- [x] Step 2.1: Chain-of-Thought debate prompts
- [x] Step 2.2: Bull/Bear case for watchlist
- [x] Step 2.3: Conversation memory

## Phase 3: Real Document Knowledge (RAG) ✅ COMPLETE
- [x] Step 3.1: Set up Pinecone
- [x] Step 3.2: SEC filing ingestion pipeline
- [x] Step 3.3: Retrieval API
- [x] Step 3.4: Integrate RAG into debates

## Phase 4: Multi-Agent Council ✅ COMPLETE
- [x] Step 4.1: Specialized agent prompts
- [x] Step 4.2: Council voting endpoint
- [x] Step 4.3: Council UI component

## Phase 5: Legendary Data Tab (New Request) ✅ COMPLETE
- [x] Step 5.1: Guru Portfolios UI (Holdings of Legends)
- [x] Step 5.2: SEC Filing Viewer (RAG Integration)
- [x] Step 5.3: AI Data Analyst Component
- [x] Step 5.4: Migrate to GitHub ✅ COMPLETE

## Phase 6: Advanced Features
- [ ] Step 6.1: Fear & Greed Coach
- [ ] Step 6.2: What-If Scenario Builder
- [ ] Step 6.3: AI Investment Thesis Generator

## Phase 2: Analysis & Planning [Active]
- [x] Scan and analyze `legendary-investor-ui` codebase <!-- id: 7 -->
- [x] Identify backend connection points and requirements <!-- id: 8 -->
- [x] Create `implementation_plan.md` for v0-style UI and integration <!-- id: 9 -->

## Phase 3: Implementation [Pending]
- [ ] Initialize/Upgrade project structure (if needed) <!-- id: 10 -->
- [x] Implement "v0" style Design System (Tailwind, Framer Motion, Shadcn) <!-- id: 11 -->
- [x] Build core UI components with premium aesthetics <!-- id: 12 -->
- [/] Integrate backend services ("connect everything") <!-- id: 13 -->
    - [/] Retrieve Supabase credentials via CLI <!-- id: 13-1 -->
    - [ ] Configure `env.local` with Supabase & OpenRouter keys <!-- id: 13-2 -->
    - [x] Implement OpenRouter (Claude) API Route <!-- id: 13-3 -->
    - [x] Deploy via Vercel CLI <!-- id: 13-4 -->
- [x] Implement Voice Portfolio Input <!-- id: 15 -->
    - [x] Add Microphone Button & Web Speech API Logic <!-- id: 15-1 -->
    - [x] Create API Endpoint for AI Parsing (Text -> JSON) <!-- id: 15-2 -->
    - [x] Build Confirmation UI for Parsed Data (Integrated into Page) <!-- id: 15-3 -->
- [x] Research Portfolio Import Options (Plaid/Snaptrade vs Manual) <!-- id: 16 -->
    - [x] Evaluate Plaid/Snaptrade for direct brokerage connection <!-- id: 16-1 -->
    - [ ] Design "Watchlist" feature for tracking potential buys <!-- id: 16-2 -->
- [x] Implement Watchlist Feature <!-- id: 17 -->
    - [x] Create Toggle UI (Portfolio / Watchlist) <!-- id: 17-1 -->
    - [x] Implement Dual State Management <!-- id: 17-2 -->
    - [x] Update Analysis Routing to support Watchlist context <!-- id: 17-3 -->
- [ ] Audit for Missing Basics (Header/Footer, Spacing, A11y) <!-- id: 18 -->
    - [ ] Create Audit Report detailing missing typical stock app features <!-- id: 18-1 -->
    - [ ] Implement fixes for Footer, Spacing/Padding consistency <!-- id: 18-2 -->
    - [ ] Add missing standard pages (About, Terms, Privacy) <!-- id: 18-3 -->
    - [ ] Run Accessibility Check (Lighthouse/manual) <!-- id: 18-4 -->
- [ ] Refine Debate Features <!-- id: 19 -->
    - [ ] Fix Chat Input wiring (User can talk to legends) <!-- id: 19-1 -->
    - [ ] Tune AI Prompt for "Short, Readable" mobile-friendly text <!-- id: 19-2 -->
    - [ ] Fix Clickability issues (z-index/layout check) <!-- id: 19-3 -->
    - [x] **[NEW]** Inject "Real/Emotional" Personalities into Prompts <!-- id: 19-4 -->
    - [x] **[NEW]** Update Topics with Real News (last 48h) <!-- id: 19-5 -->
    - [x] **[NEW]** Add "Topic Ticker" Sidebar to Debate Box <!-- id: 19-6 -->
- [ ] Fix Voice Portfolio Input <!-- id: 20 -->
    - [ ] Ensure transcription populates the main text box <!-- id: 20-1 -->
- [x] Smart Ticker Upgrades <!-- id: 24 -->
    - [x] Implement Red/Green "Panic/Euphoria" alerting logic <!-- id: 24-1 -->
    - [x] Add AI/News-driven headlines (Mocked with real data) <!-- id: 24-2 -->
- [ ] Fix Voice Portfolio Input <!-- id: 20 -->
    - [ ] Ensure transcription populates the main text box <!-- id: 20-1 -->
- [ ] Overhaul Watchlist UI <!-- id: 21 -->
    - [ ] Re-design from "Box" to "List with AI One-Liners (Buy/Sell)" <!-- id: 21-1 -->
- [ ] AI Dashboard Enhancements <!-- id: 22 -->
    - [ ] Add real analysis widgets (not just placeholder) <!-- id: 22-1 -->
- [ ] Final Accessibility & Responsive Sweep <!-- id: 23 -->
    - [ ] Mobile/PC resize check <!-- id: 23-1 -->
- [ ] Verify UI/UX and Data Integration <!-- id: 14 -->
