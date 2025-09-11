# Mini Seller Console

A small, polished React + Vite + Tailwind app for triaging **Leads**, editing details, and converting them into **Opportunities** with a clean, Material-like UI and strong accessibility.

## Features

- **Leads**
  - Search by name/company (local + global search in the top app bar)
  - Filter by status and sort by score (custom dropdowns with keyboard support)
  - Paginated table with sticky headers and row highlighting
  - Lead detail **slide-over** (animated, sticky header/footer, ESC to close)
  - Email validation and inline errors

- **Opportunities**
  - Convert directly from the Lead detail (optional amount in USD)
  - Prevent duplicate opportunity for the same lead
  - Paginated table with remove action
  - **Confirm dialog** (accessible `alertdialog`) before removing

- **Design & UX**
  - Material-inspired surface/shape/elevation, smooth scrolling
  - Top App Bar with blurred background and identity mark
  - **Custom SelectMenu**: auto-flip/clamp to avoid overflow; respects card boundaries
  - Styled scrollbars; consistent spacing and hierarchy
  - **Observability panel**: KPIs + lightweight SVG sparklines

- **State & Performance**
  - Fast client-side filtering, sorting, and pagination
  - Small utilities for **persistent UI preferences** (e.g., pagination) via `usePersistentState`
  - Optimistic UI on edits

- **Accessibility**
  - Proper roles/labels for dialogs and menus
  - Keyboard navigation: ↑/↓, Enter/Space, ESC; focus management on open/close
  - High-contrast states and clear hit targets

## Tech Stack

- **React** + **TypeScript** (Vite)
- **Tailwind CSS v4** with **@tailwindcss/postcss**
- **lucide-react** icons

## Getting Started

### Prerequisites
- Node.js 18+ (tested with Node 22)
- pnpm 8+ (tested with pnpm 10)

### Install
```bash
pnpm install
