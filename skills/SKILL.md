---
name: gsap-stagger
description: GSAP stagger animation patterns for Next.js with Tailwind v4. Use when implementing hover staggers, scroll-triggered reveals, list animations, card grids, or menu item staggers.
argument-hint: "[use-case] - hover|scroll|list|grid"
---

# GSAP Stagger Animations

Stagger animations create sequential, cascading effects across multiple elements. This skill covers patterns for hover effects, scroll reveals, lists, and grids.

## Supporting Files

- [tailwind-stagger-patterns.md](tailwind-stagger-patterns.md) - Tailwind v4 CSS stagger techniques
- [gsap-stagger-patterns.md](gsap-stagger-patterns.md) - GSAP stagger object deep dive
- [react-components.md](react-components.md) - Production-ready React components

## Decision Matrix

| Use Case | Approach | Why |
|----------|----------|-----|
| Simple hover effects | Tailwind + JS for delay | No GSAP overhead, CSS handles animation |
| Scroll-triggered reveals | GSAP + ScrollTrigger | Need scroll position, callbacks |
| Reversible animations | GSAP timeline | CSS can't reverse mid-animation |
| Complex timing/easing | GSAP | More control than CSS cubic-bezier |

## TextReveal Quick Reference

Production component for scroll-triggered text reveals with optional hover effects.

```jsx
import TextReveal from "@/app/components/TextReveal";

<TextReveal
  reveal="lines|words|chars"  // Split granularity (default: "lines")
  rotate={5}                  // Rotation in degrees (default: 0)
  opacity                     // Enable fade-in effect
  blur={8}                    // Blur amount in px (default: 0)
  scrub                       // Tie animation to scrollbar
  start="top 80%"             // ScrollTrigger start (default: "clamp(top 80%)")
  end="bottom 40%"            // ScrollTrigger end for scrub
  hover                       // Enable hover stagger (skips scroll animation)
  hoverStagger={0.02}         // Delay between elements in seconds
  hoverDuration={0.4}         // Transition duration in seconds
  hoverDistance={1.3}         // Y-translate distance in em
/>
```

### Default Timing Per Split Type

```js
const splitConfig = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 },
};
```

## Quick Stagger Configs

```js
// Copy-paste defaults for common patterns
const staggerConfigs = {
  hover:  { stagger: 0.01, duration: 0.6, ease: "power2.out" },
  scroll: { stagger: 0.08, duration: 0.8, ease: "expo.out" },
  list:   { stagger: 0.05, duration: 0.5, ease: "power2.out" },
  grid:   { stagger: { amount: 0.6, from: "center" }, duration: 0.7, ease: "power3.out" },
};
```

## Core Patterns

### 1. Button/Text Hover Stagger (Tailwind + JS)

Text-shadow creates a duplicate that slides up on hover. JS splits text and assigns staggered delays.

```jsx
// Split text, apply Tailwind classes, set transition-delay via JS
<span className="inline-block overflow-hidden">
  <span className="inline-block transition-transform duration-600 ease-[cubic-bezier(0.625,0.05,0,1)]
                   [text-shadow:0_1.3em_currentColor] hover:translate-y-[-1.3em]">
    {char}
  </span>
</span>
```

Key Tailwind classes:
- `overflow-hidden` - Masks the text-shadow duplicate
- `transition-transform` - Animates only transform
- `duration-600` - 0.6s (add to theme if needed)
- `[text-shadow:0_1.3em_currentColor]` - Creates duplicate below

### 2. Scroll-Triggered Text Reveal (GSAP SplitText)

```jsx
useGSAP(() => {
  const split = new SplitText(textRef.current, {
    type: "words,lines",
    mask: "lines"  // Efficient: mask at line level
  });

  gsap.from(split.words, {
    y: "100%",
    opacity: 0,
    stagger: 0.08,
    duration: 0.8,
    ease: "expo.out",
    scrollTrigger: {
      trigger: textRef.current,
      start: "top 80%",
      once: true
    }
  });

  return () => split.revert();
}, { scope: containerRef });
```

### 3. List/Menu Item Stagger (ScrollTrigger.batch)

```jsx
useGSAP(() => {
  ScrollTrigger.batch(".stagger-item", {
    onEnter: (elements) => {
      gsap.from(elements, {
        y: 40,
        opacity: 0,
        stagger: 0.05,
        duration: 0.5,
        ease: "power2.out"
      });
    },
    start: "top 85%",
    once: true
  });
}, { scope: listRef });
```

Tailwind base classes for items:
```jsx
<li className="stagger-item opacity-0 translate-y-10">
  {/* GSAP animates from these initial states */}
</li>
```

### 4. Card/Grid Stagger from Center

```jsx
useGSAP(() => {
  gsap.from(".grid-card", {
    scale: 0.8,
    opacity: 0,
    duration: 0.7,
    ease: "power3.out",
    stagger: {
      amount: 0.6,      // Total stagger time
      from: "center",   // Radiates from center
      grid: "auto"      // Auto-detect grid
    },
    scrollTrigger: {
      trigger: gridRef.current,
      start: "top 80%",
      once: true
    }
  });
}, { scope: gridRef });
```

Tailwind grid setup:
```jsx
<div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-4">
  <div className="grid-card opacity-0 scale-80">{/* ... */}</div>
</div>
```

## Stagger Object Reference

```js
stagger: {
  each: 0.1,           // Time between each element
  amount: 1,           // OR total stagger time (overrides each)
  from: "start",       // start | center | end | edges | random | index
  grid: [rows, cols],  // For grid layouts (or "auto")
  axis: "x",           // x | y - grid stagger direction
  ease: "power2.in"    // Distribution curve (not animation ease)
}
```

**`from` options:**
- `"start"` - First to last (default)
- `"end"` - Last to first
- `"center"` - Middle outward
- `"edges"` - Outside inward
- `"random"` - Random order
- `5` - From index 5 outward

## Performance Checklist

1. **Mask at line level** for SplitText
   ```js
   // Good: 19 DOM nodes for 17 chars
   type: "chars,lines", mask: "lines"

   // Bad: 34 DOM nodes for 17 chars
   type: "chars", mask: "chars"
   ```

2. **GPU acceleration** via Tailwind
   ```jsx
   className="transform-gpu will-change-transform"
   ```

3. **Cleanup** - Always revert SplitText
   ```js
   return () => split.revert();
   ```

## Accessibility

```js
// Check reduced motion preference
const shouldAnimate = () =>
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

useGSAP(() => {
  if (!shouldAnimate()) {
    gsap.set(elements, { opacity: 1, y: 0 }); // Show immediately
    return;
  }
  // ... animations
});
```

SplitText 3.13+ handles ARIA automatically. For older versions:
```js
new SplitText(el, { type: "chars", aria: "auto" });
```

## Common Patterns

### Hover with GSAP (when CSS isn't enough)

```jsx
const { contextSafe } = useGSAP({ scope: containerRef });

const onEnter = contextSafe(() => {
  gsap.to(".char", { y: -20, stagger: 0.02, duration: 0.4 });
});

const onLeave = contextSafe(() => {
  gsap.to(".char", { y: 0, stagger: 0.02, duration: 0.4 });
});
```

### Overlapping staggers in timeline

```js
tl.to(".item-a", { y: -20, stagger: 0.05 })
  .to(".item-b", { y: -20, stagger: 0.05 }, "<0.1"); // Start 0.1s into previous
```

### Scrub-linked stagger

```js
gsap.to(".word", {
  y: 0,
  opacity: 1,
  stagger: 0.1,
  scrollTrigger: {
    trigger: containerRef.current,
    start: "top 80%",
    end: "top 30%",
    scrub: 1  // Ties animation to scroll position
  }
});
```

## Real Usage Examples

From `app/page.js` - practical patterns for different effects:

### Basic Reveals

```jsx
// Lines (default) - smooth paragraph reveal
<TextReveal>
  <div className="prose-display">
    This text will reveal line by line when you scroll into view.
  </div>
</TextReveal>

// Words - dynamic reading flow
<TextReveal reveal="words">
  <div className="prose-display">
    Each word comes up individually.
  </div>
</TextReveal>

// Characters - precise letter-by-letter
<TextReveal reveal="chars">
  <div className="prose-display">Character by character precision.</div>
</TextReveal>
```

### Combined Effects

```jsx
// Words + subtle rotation (5°)
<TextReveal reveal="words" rotate={5}>
  <div className="prose-display">
    Each word tilts gently into place.
  </div>
</TextReveal>

// Characters + playful rotation (8°)
<TextReveal reveal="chars" rotate={8}>
  <div className="prose-display">Playful vibes.</div>
</TextReveal>

// Words + opacity fade
<TextReveal reveal="words" opacity>
  <div className="prose-display">
    Each word fades in gracefully.
  </div>
</TextReveal>

// Full combo: chars + rotation + opacity + blur
<TextReveal reveal="chars" rotate={3} opacity blur={6}>
  <div className="prose-display">Pure cinema.</div>
</TextReveal>
```

### Hover Stagger (CSS-based, no scroll)

```jsx
// Basic hover
<TextReveal reveal="chars" hover>
  <div className="prose-display cursor-pointer">Hover over me.</div>
</TextReveal>

// Custom timing
<TextReveal reveal="chars" hover hoverStagger={0.02} hoverDuration={0.4}>
  <div className="prose-display cursor-pointer">Faster stagger.</div>
</TextReveal>
```

### Scrub Interaction

```jsx
// Scrub lines - user controls animation with scroll
<TextReveal scrub>
  <div className="prose-display">
    Control the animation with your scroll.
  </div>
</TextReveal>

// Scrub words
<TextReveal reveal="words" scrub>
  <div className="prose-display">
    Complete control over every word.
  </div>
</TextReveal>
```
