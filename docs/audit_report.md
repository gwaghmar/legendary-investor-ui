# Audit Report: Legendary Investor UI
**Date:** 2026-02-02
**Status:** In Progress

## 1. Structural & Layout Issues
*   **Missing Global Footer:** The Footer currently exists only in `app/page.tsx`. It is missing from `app/layout.tsx`, meaning other pages (Portfolio, Dashboard) usually lack a footer or have a different one.
*   **Header Consistency:** The Header is manually included in `page.tsx` and `portfolio/page.tsx` but technically should be in `layout.tsx` for SPA-like persistence, though typically keeping it per-page allows for specific variations. However, a global layout wrapper is cleaner.
*   **Spacing inconsistencies:**
    *   `app/page.tsx` uses `pt-14` (padding-top) for the sticky header.
    *   `app/portfolio/page.tsx` uses `pt-20`.
    *   This visual jump is jarring when navigating.

## 2. Missing Standard Pages
A professional app requires these pages for trust and compliance:
-   [ ] **About Page**: (`/about`) - Mission, Team, Explanation of "Legendary Frameworks".
-   [ ] **Privacy Policy**: (`/privacy`) - Essential for any app handling user data (voice, portfolio).
-   [ ] **Terms of Service**: (`/terms`) - Legal disclaimer (Not financial advice).
-   [ ] **Settings**: (`/settings`) - Theme toggle, API key management (if we want to move keys there eventually), User Profile.

## 3. UI/UX Refinement
-   **Empty States:** The Watchlist/Portfolio empty states are functional but basics. Could use better illustrations.
-   **Loading States:** Skeleton loaders are missing for the "Analysis" page; it uses a simple text "Loading analysis...".
-   **Mobile Responsiveness:** The "MarketTicker" and "Header" stacking might consume too much vertical space on mobile landscape.

## 4. Accessibility (A11y)
-   **ARIA Labels:** Missing on some interactive elements (Mic button has an icon but might need `aria-label="Voice Input"`).
-   **Contrast:** The "v0" aesthetic uses black/white which is generally good, but some `muted-foreground` text might be too light on light mode.

## Action Plan
1.  **Refactor Footer:** Extract `Footer` to a component and add to `app/layout.tsx` (or ensure it's in all page wrappers).
2.  **Standardize Spacing:** Define a global `main` class or variable for header offset.
3.  **Create Static Pages:** Create `app/about/page.tsx`, `app/legal/privacy/page.tsx`, etc.
4.  **Enhance A11y:** Add `aria-labels` to icon-only buttons.
