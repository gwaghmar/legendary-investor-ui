# Master Development Skills Guide

This document compiles essential skills, best practices, and "tricks" for building high-quality, modern web applications. It draws from industry standards, `skills.sh` agent skills ecosystem, and expert recommendations for 2025.

## 1. The `skills.sh` Ecosystem

`skills.sh` is a standard and package manager for "Agent Skills"—reusable capabilities that can be added to AI agents (like GitHub Copilot, Cursor, etc.) to give them specialized knowledge.

### How to Use
You can add skills to your project to enhance your AI assistant's context:
```bash
npx skills add <owner/repo>
```

### Key Skill Repositories
*   **Vercel Best Practices**: `npx skills add vercel-labs/agent-skills` (Deploying, optimizing, and managing Vercel projects)
*   **Supabase Expertise**: `npx skills add supabase/agent-skills` (Postgres best practices, RLS policies, Auth setup)
*   **GitHub CLI**: `npx skills add dimillian/skills` (Interacting with GitHub via CLI)

---

## 2. Supabase "Tricks" & Best Practices

### Security (Critical)
1.  **RLS is Mandatory**: Never deploy without Row Level Security (RLS) on *every* table. Start with `deny all` and open up access selectively.
2.  **Service Role Danger**: Never expose `service_role` keys on the client. They bypass RLS. Use them only in safe backend environments (Edge Functions).
3.  **Secure Functions**: When using Postgres functions, use `security definer` carefully. It runs with the privileges of the creator (usually admin). Always search_path to `public` to prevent search_path hijacking.
4.  **Auth Policies**: Enforce strong passwords and use MFA for sensitive apps.

### Performance
1.  **Index Your Foreign Keys**: Postgres doesn't automatically index foreign keys. Doing so often strictly improves JOIN performance.
2.  **`pg_vector` Optimization**: For AI apps, use HNSW indexes for vector search. It's much faster than minimal IVFFlat for large datasets.
3.  **Connection Pooling**: Use the Transaction Pooler (port 6543) for serverless environments (like Vercel Edge Functions) to prevent running out of connections.

### Workflow
1.  **Local Dev**: Use `supabase start` to run a local clone of your stack. Never develop directly against the production database for schema changes.
2.  **Type Safety**: Generate TypeScript types directly from your DB schema:
    ```bash
    supabase gen types typescript --project-id <your-project-id> > database.types.ts
    ```
3.  **Branching**: Use Supabase Branching (if on Pro plan) to preview schema changes in a separate environment before merging.

---

## 3. Vercel Deployment & Optimization

### Core "Tricks"
1.  **Edge Middleware**: Use Middleware (`middleware.ts`) for authentication checks and geolocation redirects *before* a request hits your server component.
2.  **ISR (Incremental Static Regeneration)**: Use `revalidate` in `getStaticProps` (or fetch options) to have static speeds with dynamic content updates.
3.  **Image Optimization**: Don't use `next/image` blindly. Limit the `deviceSizes` in `next.config.js` to prevent generating too many variants, which spikes build times and costs.

### Performance
1.  **Font Optimization**: Use `next/font` to self-host Google fonts automatically. This prevents layout shifts (CLS).
2.  **Script Loading**: Use `next/script` with `strategy="lazyOnload"` or `strategy="worker"` to offload heavy third-party scripts (like analytics/chat) from the main thread.
3.  **Bundle Analysis**: Run `@next/bundle-analyzer` regularly. "Tree-shaking" isn't magic; you accidentally import huge libraries quite often.

### Environment Management
1.  **Preview Environments**: Every PR gets a URL. Use this for UX/UI review before merging.
2.  **System Environment Variables**: Vercel exposes `VERCEL_URL` (the domain of the current deployment). Use this to dynamically configure API callbacks.

---

## 4. API Design "Super Skills"

### Design Philosophy
1.  **Resource Oriented**: URLs are nouns (`/users`, `/invoices`), not verbs (`/getUsers`, `/createInvoice`).
2.  **Predictable Slashes**: Decide on trailing slashes (e.g., always strip them) and enforce it globally.
3.  **Filtering & Pagination**: Don't invent your own. Use standard query params: `?sort=-created_at&page=2&limit=20`.

### Robustness "Tricks"
1.  **HATEOAS (Light)**: You don't need full HATEOAS, but returning a `next` URL in pagination responses saves the client from calculating it.
2.  **Rate Limiting**: Implement specific rate limits per user/IP. Return `429 Too Many Requests` with a `Retry-After` header.
3.  **Idempotency**: Usage of `Idempotency-Key` headers for critical POST requests (like payments) prevents double-charging on network retries.

---

## 5. UX/UI Best Practices (2025 Standards)

### The "WOW" Factor
1.  **Micro-interactions**: Buttons shouldn't just "click". They should scale down slightly, ripple, or glow. Feedback confirms action.
2.  **Glassmorphism & Depth**: Use subtle transparency (`backdrop-filter: blur()`) and multi-layered shadows to create depth, not just flat layers.
3.  **Skeleton Loading**: Never show a blank screen or a generic spinner. Show a skeleton UI structure that matches the layout loading in.

### Accessibility (A11y) as a Feature
1.  **Keyboard Navigation**: If you can't navigate your app with `Tab` and `Enter`, it's broken. Focus rings are mandatory—style them to match your brand if the default blue is ugly.
2.  **Semantic HTML**: Use `<button>` for actions, `<a>` for navigation. `<div onClick={...}>` is an anti-pattern that breaks screen readers and keyboard nav.

### Modern Trends
1.  **Bento Grids**: Grid-based layouts (like Apple's promotional videos) are huge. They organize dense information into digestible, aesthetically pleasing blocks.
2.  **Dark Mode First**: Many developer-tools and modern SaaS start with Dark Mode as the default, not the alternative.

---

## 6. Writing Skills for Developers

### Documentation
1.  **The "Why", Not the "What"**: Code explains *what* it does. Comments should explain *why* it does it that way.
2.  **README Driven Development**: Write the README *before* you write the code. It forces you to think about the API and user experience first.

### Communication
1.  **BLUF (Bottom Line Up Front)**: In emails/updates, put the request or conclusion first. Context follows.
2.  **Error Messages**: Write error messages for the user, not the system.
    *   *Bad*: "500 Internal Server Error: Null Pointer Exception"
    *   *Good*: "We couldn't save your changes because of a temporary connection issue. Please try again."

