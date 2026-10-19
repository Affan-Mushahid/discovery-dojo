---
name: react-best-practices
description: Apply focused React and Next.js App Router practices when changing DiscoveryDojo UI or components.
---

# React and App Router practices

Use this checklist for React/Next.js work in this repository.

- Keep components small and responsibility-focused. Extract reusable behavior rather than creating monolithic pages.
- Prefer Server Components by default. Add `"use client"` only for state, browser APIs, or event-driven interactions that require it; keep the client boundary as low as practical.
- Keep secrets, privileged operations, and provider credentials on the server. Validate all untrusted input at route or server-action boundaries.
- Model loading, empty, success, and error states explicitly. Preserve accessible labels, keyboard operation, and semantic elements.
- Keep product rules in domain modules, not in visual components. Inject or call provider adapters at the application boundary.
- Avoid unnecessary effects and duplicated state. Use the existing project utilities and conventions before adding dependencies.
- Validate changes with the relevant `npm run lint`, `npm run typecheck`, and tests; do not report checks that were not run.
