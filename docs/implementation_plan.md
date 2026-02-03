# Implementation Plan - Legendary Investor UI "v0" Upgrade

## Goal
To upgrade the current prototype into a fully connected, premium "v0-style" application. This involves replacing hardcoded data with a live Supabase backend and enhancing the UI with "rich aesthetics" (animations, glassmorphism, polished typography).

## User Review Required
> [!IMPORTANT]
> **Supabase Credentials**: I will attempt to fetch these via CLI. If not logged in, I will need you to run `npx supabase login`.
> **OpenRouter Key**: This is required for the AI debate feature using Claude.

## Proposed Changes

### 1. Backend Integration (Supabase & OpenRouter)
We will replace `lib/stock-data.ts` and `lib/legends.ts` with a real database connection.

#### [NEW] `lib/supabase.ts`
- Initialize Supabase client using environment variables.

#### [NEW] `app/api/stocks/route.ts`
- GET endpoint to fetch stock data (supports "Live" updates).

#### [NEW] `app/api/debate/route.ts`
- POST endpoint to generate debate responses.
- **Provider**: OpenRouter
- **Model**: `anthropic/claude-3.5-sonnet` (enforce Claude only).

#### [NEW] `.env.local`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENROUTER_API_KEY`
- `SITE_URL`

### 2. UI "v0" Polish (Rich Aesthetics) [Completed]
- [x] Framer Motion animations in `LegendCharacter`.
- [x] Glassmorphism in `DebateBox`.
- [x] Real-time ticker styling.

### 3. "Connect Everything" (CLI Workflow)
- **Supabase**: Run `npx supabase projects list` -> Get keys -> Write to `.env.local`.
- **OpenRouter**: Add key to `.env.local`.
- **Vercel**: Run `npx vercel` to deploy.

### 4. Voice Portfolio Input [New]
#### [NEW] `components/portfolio-voice-input.tsx`
- **Microphone Button**: Toggles recording state.
- **Web Speech API**: Uses `window.webkitSpeechRecognition` to capture live audio to text.
- **Transcript Display**: Shows real-time speech.
- **AI Processing**: Sends transcript to `/api/portfolio/parse`.

#### [NEW] `app/api/portfolio/parse/route.ts`
- **Goal**: Convert natural language (e.g., "I bought 10 shares of Apple at 150") into JSON.
- **Input**: `{ transcript: string }`
- **Output**: `{ symbol: "AAPL", shares: 10, cost: 150 }`
- **Model**: `anthropic/claude-3.5-sonnet` (via OpenRouter).

### 5. Future Integrations (Research Phase)
#### Portfolio Import (Snaptrade Recommended)
- **Why**: Specifically built for investment apps, offering a free tier for developers. Plaid is expensive ($500/mo min) for investment data.
- **Plan**: Use Snaptrade API to connect Robinhood/Schwab accounts securely.

#### Watchlist Analysis
- **Goal**: Allow users to track and analyze "potential buys" separately from their owned portfolio.
- **UI**: A toggle/tab in the portfolio section for "Watchlist".
- **AI**: The same "Legendary Analysis" engine runs on this list.

## Verification Plan

### Automated Tests
- **Browser Testing**: Verify no console errors and smooth animations.

### Manual Verification
1.  **Visual Check**: Open the `HomePage`. Verify the "Debate Box" looks premium and characters animate on hover.
2.  **Data Check**: Verify that changing a value in Supabase (e.g., NVDA price) reflects on the frontend after refresh.
3.  **Interaction**: Click a legend character and verify the "Debate Box" updates with their specific style/quote.
