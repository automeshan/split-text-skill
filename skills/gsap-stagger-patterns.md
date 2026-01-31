# GSAP Stagger Patterns

Deep dive into GSAP's stagger object and advanced patterns for scroll reveals, lists, and grids.

## Stagger Object Anatomy

```js
gsap.to(".item", {
  y: 0,
  opacity: 1,
  stagger: {
    each: 0.1,           // Time between each element (seconds)
    amount: 1,           // OR total stagger duration (overrides each)
    from: "start",       // Direction/origin of stagger
    grid: [rows, cols],  // For grid layouts
    axis: "x",           // Grid stagger direction: "x" | "y"
    ease: "power2.in"    // Distribution curve (not the animation ease)
  }
});
```

### Simple vs Object Syntax

```js
// Simple: just the delay between each
stagger: 0.1

// Object: full control
stagger: { each: 0.1, from: "center" }
```

### `from` Options

| Value | Effect |
|-------|--------|
| `"start"` | First → last (default) |
| `"end"` | Last → first |
| `"center"` | Middle → outward |
| `"edges"` | Outside → inward |
| `"random"` | Random order |
| `5` | From index 5 outward |

```js
// Radiate from center
stagger: { amount: 0.6, from: "center" }

// Converge to center
stagger: { amount: 0.6, from: "edges" }

// From specific element
stagger: { amount: 0.6, from: 3 }  // From 4th element (0-indexed)
```

### Grid Stagger

For 2D layouts, GSAP can stagger based on distance from origin:

```js
gsap.from(".grid-item", {
  scale: 0,
  opacity: 0,
  stagger: {
    amount: 0.8,
    from: "center",
    grid: "auto",     // Auto-detect grid dimensions
    ease: "power2.in" // Eases the stagger distribution
  }
});

// Or specify grid dimensions
stagger: {
  grid: [4, 3],  // 4 rows, 3 columns
  from: "center",
  axis: "y"      // Stagger row by row
}
```

### Stagger Ease vs Animation Ease

```js
gsap.to(".item", {
  y: -20,
  ease: "power2.out",           // How each item animates
  stagger: {
    each: 0.1,
    ease: "power2.in"           // How delays are distributed
  }
});
```

- **Animation ease:** Controls the motion curve of each element
- **Stagger ease:** Controls the timing distribution across elements

## SplitText + Stagger

### Efficient DOM: Mask at Line Level

```js
// Good: Fewer DOM nodes
const split = new SplitText(el, {
  type: "chars,lines",
  mask: "lines"        // Mask overflow at line level
});

// Bad: Many DOM nodes
const split = new SplitText(el, {
  type: "chars",
  mask: "chars"        // Each char gets its own mask
});
```

### Character Reveal

```js
useGSAP(() => {
  const split = new SplitText(textRef.current, {
    type: "chars,lines",
    mask: "lines"
  });

  gsap.from(split.chars, {
    y: "100%",
    stagger: 0.02,
    duration: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: textRef.current,
      start: "top 80%",
      once: true
    }
  });

  return () => split.revert();
}, { scope: containerRef });
```

### Word Reveal with Rotation

```js
gsap.from(split.words, {
  y: "100%",
  rotation: 5,
  stagger: 0.06,
  duration: 0.8,
  ease: "expo.out"
});
```

### Line Reveal with Opacity

```js
gsap.from(split.lines, {
  y: 40,
  opacity: 0,
  stagger: 0.1,
  duration: 0.8,
  ease: "power2.out"
});
```

## ScrollTrigger.batch

For lists where items enter viewport at different times:

```js
useGSAP(() => {
  // Set initial state
  gsap.set(".stagger-item", { opacity: 0, y: 40 });

  ScrollTrigger.batch(".stagger-item", {
    onEnter: (elements) => {
      gsap.to(elements, {
        opacity: 1,
        y: 0,
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

**Batch vs Regular ScrollTrigger:**
- Regular: One trigger per element
- Batch: Groups elements entering together, applies stagger

## Timeline Position for Overlaps

Overlapping staggers create fluid, connected animations:

```js
const tl = gsap.timeline();

tl.from(".header-chars", { y: 100, stagger: 0.02, duration: 0.6 })
  .from(".subhead-words", { y: 50, stagger: 0.05 }, "<0.3")  // 0.3s after header starts
  .from(".cta", { opacity: 0, y: 20 }, "-=0.2");             // 0.2s before subhead ends
```

**Position shortcuts:**
- `"<"` - Start of previous animation
- `"<0.3"` - 0.3s after previous starts
- `"-=0.2"` - 0.2s before previous ends
- `"+=0.2"` - 0.2s after previous ends

## Hover Stagger with contextSafe

For event-driven staggers in React:

```js
function HoverStagger({ children }) {
  const containerRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  const onEnter = contextSafe(() => {
    gsap.to(".char", {
      y: -10,
      stagger: 0.02,
      duration: 0.4,
      ease: "power2.out"
    });
  });

  const onLeave = contextSafe(() => {
    gsap.to(".char", {
      y: 0,
      stagger: 0.02,
      duration: 0.4,
      ease: "power2.out"
    });
  });

  return (
    <div
      ref={containerRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}
```

## Scrub-Linked Stagger

Animation progress tied to scroll position:

```js
gsap.from(".word", {
  y: 40,
  opacity: 0,
  stagger: 0.1,
  scrollTrigger: {
    trigger: containerRef.current,
    start: "top 80%",
    end: "top 30%",
    scrub: 1           // Smoothing factor (higher = smoother)
  }
});
```

**Scrub values:**
- `scrub: true` - Instant, no smoothing
- `scrub: 1` - 1 second smoothing
- `scrub: 0.5` - 0.5 second smoothing

## Reverse Stagger

Animate out in reverse order:

```js
// Enter: first to last
gsap.from(".item", { y: 40, stagger: 0.05 });

// Exit: last to first
gsap.to(".item", { y: -40, stagger: { each: 0.05, from: "end" } });
```

## Stagger Functions

For complete custom control:

```js
gsap.to(".item", {
  y: -20,
  stagger: (index, target, list) => {
    // Custom delay calculation
    return index * 0.1 + Math.random() * 0.05;
  }
});
```

## Common Stagger Configs

Copy-paste starting points:

```js
const configs = {
  // Button hover - fast, subtle
  hover: {
    stagger: 0.01,
    duration: 0.5,
    ease: "power2.out"
  },

  // Text reveal - smooth entrance
  textReveal: {
    stagger: 0.03,
    duration: 0.8,
    ease: "expo.out"
  },

  // List items - clear sequence
  list: {
    stagger: 0.08,
    duration: 0.5,
    ease: "power2.out"
  },

  // Grid cards - radiating effect
  grid: {
    stagger: {
      amount: 0.6,
      from: "center",
      grid: "auto"
    },
    duration: 0.7,
    ease: "power3.out"
  },

  // Menu items - quick cascade
  menu: {
    stagger: 0.05,
    duration: 0.4,
    ease: "power2.out"
  }
};
```
