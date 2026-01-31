# Text Reveal Animation System

Scroll-triggered text reveal using GSAP SplitText and ScrollTrigger.

---

## Quick Reference

| Attribute | Values | Default |
|-----------|--------|---------|
| `data-split` | `"heading"` | Required |
| `data-split-reveal` | `"lines"` `"words"` `"chars"` | `"lines"` |
| `data-split-rotate` | number (degrees) | Optional |
| `data-split-opacity` | (presence) | Optional |
| `data-split-blur` | number (pixels) | Optional |
| `data-scrub` | (presence) | Optional |

**Required:** GSAP 3.x + SplitText 3.13+ + ScrollTrigger

```html
<h1 class="invisible" data-split="heading" data-split-reveal="words">
  Your Headline
</h1>
```

---

## When to Use

### Appropriate Use Cases

- Hero headlines and key statements
- Section titles on scroll entry
- Brand moments (1-3 elements per viewport max)

### When to Avoid

- Body text or paragraphs
- Multiple competing animations in same viewport
- Content-heavy pages where motion distracts from reading
- Elements below the fold that users scroll past quickly

### Performance Budget

- **Max 5-6** split elements per page
- **1-2** visible per viewport at any time
- Prefer `lines` over `chars` for fewer DOM nodes

---

## Prerequisites

### Dependencies

```bash
# GSAP Club membership required (SplitText is premium)
bun add gsap @gsap/premium
```

### Version Requirements

| Package | Minimum Version |
|---------|-----------------|
| GSAP | 3.12+ |
| SplitText | 3.13+ (ARIA support) |
| ScrollTrigger | 3.12+ |

### Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge). No IE11 support.

---

## Accessibility

### Reduced Motion (Required)

Always check user preference before initializing animations:

```javascript
function shouldAnimate() {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initTextReveal() {
  const headings = document.querySelectorAll('[data-split="heading"]');

  // Skip animation, show text immediately
  if (!shouldAnimate()) {
    headings.forEach((el) => (el.style.visibility = 'visible'));
    return;
  }

  // Continue with animation setup...
}
```

### Screen Reader Support

SplitText 3.13+ automatically handles ARIA attributes. The split elements remain readable by assistive technology without additional configuration.

### Testing Checklist

- [ ] Enable "Reduce Motion" in OS accessibility settings
- [ ] Verify text is visible without animation
- [ ] Test with VoiceOver/NVDA - text should read naturally

---

## CSS Setup

### Osmo Scaling System

For fluid responsive typography, add the Osmo scaling system to your project.

> See [Responsive Tailwind v4 Guide](./responsive-tailwind-v4.md) for full CSS setup.

### FOUC Prevention

Hide elements initially, reveal with GSAP before animation:

```html
<!-- Tailwind v4 -->
<h1 class="invisible" data-split="heading">Hidden until ready</h1>
```

```javascript
// Reveal before animating
gsap.set(heading, { autoAlpha: 1 });
```

---

## HTML API

### Attributes

| Attribute | Description | Required |
|-----------|-------------|----------|
| `data-split="heading"` | Marks element for processing | Yes |
| `data-split-reveal` | Animation granularity | No (default: `"lines"`) |
| `data-split-rotate` | Starting rotation in degrees | No |
| `data-split-opacity` | Adds fade-in effect | No |
| `data-split-blur` | Starting blur in pixels | No |
| `data-scrub` | Enables scroll-linked animation | No |

### Reveal Types

| Value | Splits Into | DOM Impact | Best For |
|-------|-------------|------------|----------|
| `lines` | Lines only | Minimal | Long headlines |
| `words` | Lines + Words | Moderate | Short headlines |
| `chars` | Lines + Words + Chars | Heavy | Brand moments |

### Scrub Mode

Add `data-scrub` to link animation progress directly to scroll position. The animation plays forward on scroll down and reverses on scroll up.

```html
<h1
  class="invisible"
  data-split="heading"
  data-split-reveal="lines"
  data-scrub
>
  Scroll-linked reveal
</h1>
```

**When to use scrub:**
- Storytelling sections where pacing matters
- Hero sections with dramatic reveals
- Interactive explainers

**When to avoid scrub:**
- Fast-scrolling users will miss the effect
- Mobile where scroll is less precise
- Multiple scrub elements competing

### Rotation

Add `data-split-rotate` with a degree value for subtle rotational entrance. Works best with `words` or `chars` reveals.

```html
<h1
  class="invisible"
  data-split="heading"
  data-split-reveal="words"
  data-split-rotate="5"
>
  Rotated entrance
</h1>
```

**Recommended values:**
- `3-5` degrees — Subtle, professional
- `8-12` degrees — Noticeable, playful
- `15+` degrees — Dramatic, use sparingly

**Best practices:**
- Pair with `words` or `chars` for visible effect
- Keep subtle (3-8°) for body text adjacent to content
- Ensure `transform-origin` allows natural pivot (default is element center)

### Opacity

Add `data-split-opacity` to fade in elements as they animate. Creates a softer, more elegant entrance.

```html
<h1
  class="invisible"
  data-split="heading"
  data-split-reveal="words"
  data-split-opacity
>
  Fades in smoothly
</h1>
```

**When to use opacity:**
- Softer, more elegant reveals
- Combined with rotation for polished effect
- When `yPercent` alone feels too mechanical

**When to avoid:**
- Already complex animations (keep it simple)
- Performance-critical pages with many elements

### Blur

Add `data-split-blur` with a pixel value to animate from blurred to sharp. Creates a dreamy, focus-pull effect.

```html
<h1
  class="invisible"
  data-split="heading"
  data-split-reveal="words"
  data-split-blur="10"
>
  Blurs into focus
</h1>
```

**Recommended values:**
- `4-8` pixels — Subtle, professional
- `10-15` pixels — Noticeable, cinematic
- `20+` pixels — Dramatic, use sparingly

**When to use blur:**
- Cinematic, premium feel
- Focus-pull storytelling moments
- Combined with opacity for ethereal effect

**When to avoid:**
- Performance-sensitive contexts (blur is GPU-intensive)
- Many elements animating simultaneously
- Mobile devices with limited GPU

**Combining effects:**

```html
<h1
  class="invisible"
  data-split="heading"
  data-split-reveal="chars"
  data-split-rotate="5"
  data-split-opacity
  data-split-blur="8"
>
  The ultimate combo
</h1>
```

### Example Markup

```html
<section class="w-full flex justify-center">
  <div class="container mx-auto">
    <h1
      class="text-[5em] leading-[1.1] invisible"
      data-split="heading"
      data-split-reveal="words"
    >
      Responsive Animated Text
    </h1>
  </div>
</section>
```

---

## JavaScript Implementation

### Configuration

```javascript
const splitConfig = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 },
};
```

### Core Function

```javascript
gsap.registerPlugin(SplitText, ScrollTrigger);

function initTextReveal() {
  // Accessibility check
  if (!shouldAnimate()) {
    document
      .querySelectorAll('[data-split="heading"]')
      .forEach((el) => (el.style.visibility = 'visible'));
    return;
  }

  document.querySelectorAll('[data-split="heading"]').forEach((heading) => {
    // Reveal element
    gsap.set(heading, { autoAlpha: 1 });

    // Determine split granularity
    const type = heading.dataset.splitReveal || 'lines';
    const typesToSplit =
      type === 'lines'
        ? ['lines']
        : type === 'words'
          ? ['lines', 'words']
          : ['lines', 'words', 'chars'];

    // Create split and animation
    SplitText.create(heading, {
      type: typesToSplit.join(', '),
      mask: 'lines',
      autoSplit: true,
      linesClass: 'line',
      wordsClass: 'word',
      charsClass: 'letter',
      onSplit(instance) {
        const targets = instance[type];
        const config = splitConfig[type];

        const isScrub = heading.dataset.scrub !== undefined;
        const rotate = parseFloat(heading.dataset.splitRotate) || 0;
        const useOpacity = heading.dataset.splitOpacity !== undefined;
        const blur = parseFloat(heading.dataset.splitBlur) || 0;

        return gsap.from(targets, {
          yPercent: 110,
          rotate,
          opacity: useOpacity ? 0 : 1,
          filter: blur ? `blur(${blur}px)` : 'none',
          duration: config.duration,
          stagger: config.stagger,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: heading,
            start: 'clamp(top 80%)',
            end: isScrub ? 'bottom 40%' : undefined,
            scrub: isScrub ? 1 : false,
            once: !isScrub,
          },
        });
      },
    });
  });
}

// Initialize after fonts load
document.fonts.ready.then(initTextReveal);
```

---

## SPA Integration (React/Next.js)

### React Hook Pattern

```javascript
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

export function useTextReveal() {
  const splitsRef = useRef([]);

  useEffect(() => {
    // Skip if reduced motion preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document
        .querySelectorAll('[data-split="heading"]')
        .forEach((el) => (el.style.visibility = 'visible'));
      return;
    }

    // Wait for fonts then initialize
    document.fonts.ready.then(() => {
      document.querySelectorAll('[data-split="heading"]').forEach((heading) => {
        gsap.set(heading, { autoAlpha: 1 });

        const type = heading.dataset.splitReveal || 'lines';
        const typesToSplit =
          type === 'lines'
            ? ['lines']
            : type === 'words'
              ? ['lines', 'words']
              : ['lines', 'words', 'chars'];

        const split = SplitText.create(heading, {
          type: typesToSplit.join(', '),
          mask: 'lines',
          autoSplit: true,
          onSplit(instance) {
            const config = {
              lines: { duration: 0.8, stagger: 0.08 },
              words: { duration: 0.6, stagger: 0.06 },
              chars: { duration: 0.4, stagger: 0.01 },
            }[type];

            return gsap.from(instance[type], {
              yPercent: 110,
              duration: config.duration,
              stagger: config.stagger,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: heading,
                start: 'clamp(top 80%)',
                once: true,
              },
            });
          },
        });

        splitsRef.current.push(split);
      });
    });

    // Cleanup on unmount
    return () => {
      splitsRef.current.forEach((split) => split.revert());
      splitsRef.current = [];
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);
}
```

### Usage in Component

```javascript
export default function HeroSection() {
  useTextReveal();

  return (
    <section>
      <h1 className="invisible" data-split="heading" data-split-reveal="words">
        Welcome to Our Site
      </h1>
    </section>
  );
}
```

---

## Customization

### Per-Element Overrides

Extend the data attribute API for granular control:

```html
<h1
  data-split="heading"
  data-split-reveal="chars"
  data-split-duration="1.2"
  data-split-stagger="0.02"
>
  Custom Timing
</h1>
```

```javascript
const duration = parseFloat(heading.dataset.splitDuration) || config.duration;
const stagger = parseFloat(heading.dataset.splitStagger) || config.stagger;
```

### Alternative Easing

```javascript
// Common alternatives
ease: 'power4.out'    // Snappy
ease: 'expo.out'      // Smooth deceleration (default)
ease: 'back.out(1.7)' // Slight overshoot
ease: 'elastic.out'   // Bouncy (use sparingly)
```

### Stagger Direction

```javascript
// Default: top to bottom
stagger: 0.08

// Bottom to top
stagger: { each: 0.08, from: 'end' }

// Center outward
stagger: { each: 0.08, from: 'center' }

// Random
stagger: { each: 0.08, from: 'random' }
```

---

## Performance Tips

### GPU Acceleration

Add to animated elements for smoother rendering:

```html
<h1 class="transform-gpu [text-rendering:optimizeSpeed] [font-kerning:none]">
  Optimized Text
</h1>
```

### Font Loading

Always wait for fonts before splitting to ensure accurate line breaks:

```javascript
document.fonts.ready.then(initTextReveal);
```

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Text jumps/reflows after split | Fonts not loaded | Wait for `document.fonts.ready` |
| Animation doesn't trigger | ScrollTrigger start position | Adjust `start: "clamp(top 90%)"` |
| Memory leak in SPA | Missing cleanup | Call `split.revert()` on unmount |
| Text invisible on load | FOUC CSS without JS reveal | Ensure `gsap.set(el, { autoAlpha: 1 })` runs |
| Accessibility warning | Old SplitText version | Update to 3.13+ for ARIA support |
| Lines break differently than design | Viewport/font mismatch | Use `autoSplit: true` for responsive recalc |

---

## Version History

| Date | Change |
|------|--------|
| 2025-01 | Added accessibility, SPA patterns, troubleshooting |
