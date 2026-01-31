# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 16 App Router project demonstrating GSAP SplitText stagger animations with Tailwind CSS v4. This serves as both a demo application and a **skills library** documenting reusable animation patterns.

## Commands

```bash
bun dev          # Start dev server (localhost:3000)
bun run build    # Production build
bun run lint     # ESLint
```

## Tech Stack

- **Next.js 16** with App Router and React Compiler enabled
- **React 19** with `"use client"` directives for client components
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- **GSAP 3.14+** with SplitText and ScrollTrigger plugins

## Architecture

### Core Component

[TextReveal.jsx](app/components/TextReveal.jsx) - Scroll-triggered text animation wrapper using GSAP SplitText. Supports:
- Split types: `lines`, `words`, `chars`
- Effects: rotation, opacity fade, blur
- Modes: scroll-triggered (default), scrub (scroll-linked), hover-only

Key implementation patterns:
- Plugins registered at module level (not per render)
- `document.fonts.ready` before splitting (accurate line breaks)
- Mask at line level for efficient DOM (`mask: "lines"`)
- Separate opacity tween with delay for layered effect
- `prefers-reduced-motion` check

### Skills Documentation

The [skills/](skills/) directory contains Claude Code skill files:
- [SKILL.md](skills/SKILL.md) - Main skill entry point with decision matrix and quick reference
- [gsap-stagger-patterns.md](skills/gsap-stagger-patterns.md) - Stagger object deep dive
- [react-components.md](skills/react-components.md) - Production component patterns
- [tailwind-stagger-patterns.md](skills/tailwind-stagger-patterns.md) - CSS stagger techniques

### Styling Approach

[globals.css](app/globals.css) uses Tailwind v4's `@layer` with custom utilities:
- `prose-*` classes for typography (`prose-display` includes animation optimizations)
- Layout utilities in `@layer components`
- Hover stagger CSS using `data-hover-reveal` attribute
- Osmo viewport scaling system via `--size-*` CSS variables

### Default Timing Config

```js
const splitConfig = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 },
};
```

## Key Patterns

### Text-Shadow Stagger Technique
CSS-only hover effect: outer element clips, inner span has `text-shadow` that slides into view on `translateY(-1.3em)`. No duplicate DOM elements.

### GSAP Plugin Registration
```js
if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollTrigger);
}
```

### GPU Optimization
- `transform-gpu` class on animated elements
- `rotate(0.001deg)` forces subpixel rendering
- `text-rendering: optimizeSpeed` on large animated text
