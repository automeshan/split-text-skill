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
// Good: Fewer DOM nodes (TextReveal uses this)
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

### Production Pattern (from TextReveal)

```js
// Wait for fonts before splitting (ensures accurate line breaks)
document.fonts.ready.then(() => {
  // Reveal element before animation
  gsap.set(textElement, { visibility: "visible" });

  // Determine split types based on reveal prop
  const typesToSplit =
    reveal === "lines" ? ["lines"]
    : reveal === "words" ? ["lines", "words"]
    : ["lines", "words", "chars"];

  SplitText.create(textElement, {
    type: typesToSplit.join(", "),
    mask: "lines",  // Always mask at line level for efficiency
    autoSplit: true,
    linesClass: "line",
    wordsClass: "word",
    charsClass: "letter",
    onSplit(instance) {
      const targets = instance[reveal];

      // Calculate mask overflow (accounts for descenders + rotation)
      const maskOverflow = 110 + Math.abs(rotate) * 0.5;

      gsap.from(targets, {
        yPercent: maskOverflow,
        rotate,
        filter: blur ? `blur(${blur}px)` : "none",
        duration: animDuration,
        stagger: animStagger,
        ease: "expo.out",
        scrollTrigger: {
          trigger: textElement,
          start: "clamp(top 80%)",
          once: true
        }
      });
    }
  });
});
```

### Separate Opacity Tween Technique

TextReveal uses a separate tween for opacity to create a distinct fade effect:

```js
// Main animation: position, rotation, blur
gsap.from(targets, {
  yPercent: maskOverflow,
  rotate,
  filter: blur ? `blur(${blur}px)` : "none",
  duration: animDuration,
  stagger: animStagger,
  ease: "expo.out",
  scrollTrigger: { ... }
});

// Separate opacity tween with delay (1.5x duration, delayed start)
if (opacity) {
  gsap.from(targets, {
    opacity: 0,
    duration: animDuration * 1.5,  // Longer fade
    stagger: animStagger,
    ease: "power2.out",
    delay: animStagger * 0.5,      // Starts slightly after position
    scrollTrigger: { ... }
  });
}
```

**Why separate tweens?** The delayed opacity creates a layered effect where elements start moving before fully fading in.

### Default Timing Configuration

```js
const splitConfig = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 },
};
```

### Word Reveal with Rotation

```js
gsap.from(split.words, {
  yPercent: 110,  // Use yPercent for mask-based reveals
  rotation: 5,
  stagger: 0.06,
  duration: 0.8,
  ease: "expo.out"
});
```

### Line Reveal with Opacity

```js
gsap.from(split.lines, {
  yPercent: 110,
  opacity: 0,
  stagger: 0.08,
  duration: 0.8,
  ease: "expo.out"
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

### TextReveal Scrub Pattern

```js
// From TextReveal component
scrollTrigger: {
  trigger: textElement,
  start: "clamp(top 80%)",
  end: scrub ? "bottom 40%" : undefined,  // Only set end for scrub
  scrub: scrub ? 1 : false,
  once: !scrub  // Non-scrub animations play once
}
```

Usage:
```jsx
// User controls animation with scroll
<TextReveal scrub>
  <div className="prose-display">Control the animation with your scroll.</div>
</TextReveal>

<TextReveal reveal="words" scrub>
  <div className="prose-display">Complete control over every word.</div>
</TextReveal>
```

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
  // From TextReveal splitConfig - battle-tested defaults
  lines: { duration: 0.8, stagger: 0.08, ease: "expo.out" },
  words: { duration: 0.6, stagger: 0.06, ease: "expo.out" },
  chars: { duration: 0.4, stagger: 0.01, ease: "expo.out" },

  // Button hover - fast, subtle
  hover: {
    stagger: 0.01,
    duration: 0.5,
    ease: "power2.out"
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
