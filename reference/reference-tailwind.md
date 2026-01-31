# Text Reveal Implementation Guide

This guide outlines how to implement a scroll-triggered text reveal animation using GSAP's SplitText and ScrollTrigger plugins.

## 1. HTML Markup

Contrary to basic examples, we include two attributes on each heading: one to target the element and one to define the split type.

For each heading you want to reveal on scroll, add these two attributes:

- `data-split="heading"`: Marks the element for processing.
- `data-split-reveal="lines"`: Accepts `"lines"`, `"words"`, or `"chars"` (alias for characters).

> **Note:** If `data-split-reveal` is omitted, it defaults to `"lines"`.

## 2. Configuration Options

Define a global configuration object to store the default duration and stagger for different split types.

```javascript
const splitConfig = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 },
};
```

## 3. Implementation Logic

The initialization happens in a single function. We split only as much as necessary to keep the DOM clean:

- **lines**: Splits by lines only.
- **words**: Splits by lines and words.
- **chars**: Splits by lines, words, and characters.

### Process Summary:

1. Select all elements with `[data-split="heading"]`.
2. Read the `data-split-reveal` value.
3. Initialize `SplitText` with the appropriate types.
4. In the `onSplit` callback, create the `ScrollTrigger` and return the tween for automatic cleanup.
5. Use `clamp()` for the `ScrollTrigger` start value to ensure animations always start from 0.

### Code Implementation:

```javascript
gsap.registerPlugin(SplitText, ScrollTrigger);

const splitConfig = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 },
};

function initMaskTextScrollReveal() {
  document.querySelectorAll('[data-split="heading"]').forEach((heading) => {
    // Find the split type, the default is 'lines'
    const type = heading.dataset.splitReveal || "lines";
    const typesToSplit =
      type === "lines"
        ? ["lines"]
        : type === "words"
          ? ["lines", "words"]
          : ["lines", "words", "chars"];

    // Split the text
    SplitText.create(heading, {
      type: typesToSplit.join(", "), // split into required elements
      mask: "lines", // wrap each line in an overflow:hidden div
      autoSplit: true,
      linesClass: "line",
      wordsClass: "word",
      charsClass: "letter",
      onSplit: function (instance) {
        const targets = instance[type]; // Register animation targets
        const config = splitConfig[type]; // Find matching duration and stagger

        return gsap.from(targets, {
          yPercent: 110,
          duration: config.duration,
          stagger: config.stagger,
          ease: "expo.out",
          scrollTrigger: {
            trigger: heading,
            start: "clamp(top 80%)",
            once: true,
          },
        });
      },
    });
  });
}

// Initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  initMaskTextScrollReveal();
});
```

## 4. Performance & Accessibility

### Accessibility

As of **SplitText version 13.0**, there is built-in support for screen readers. ARIA attributes are handled automatically by default, ensuring the text remains readable.

### Flash of Unstyled Content (FOUC)

Headings in the initial viewport might flash briefly before the JavaScript runs. To prevent this, hide the elements using the `invisible` utility class and reveal them using GSAP right before the animation.

**HTML:**

Add the `invisible` class to your elements:

```html
<h1 class="invisible" data-split="heading" data-split-reveal="lines">
  Your Headline
</h1>
```

**JavaScript Update:**

```javascript
document.addEventListener("DOMContentLoaded", () => {
  let headings = document.querySelectorAll('[data-split="heading"]');
  headings.forEach((heading) => {
    // Reset visibility before animation
    gsap.set(heading, { autoAlpha: 1 });
    // ... animation logic
  });
});
```

## 5. Bonus Optimization Tips

### Font Loading

Wait for fonts to be ready to ensure `SplitText` calculates positions correctly:

```javascript
document.fonts.ready.then(function () {
  initMaskTextScrollReveal();
});
```

### Rendering Performance

Use these Tailwind v4 utility classes (including arbitrary values) for smoother font rendering and performance:

- `transform-gpu`: Forces GPU acceleration (adds `transform: translate3d(...)`).
- `[text-rendering:optimizeSpeed]`: Optimizes text rendering.
- `[font-kerning:none]`: Disables font kerning for more predictable spacing during animation.

**Example Class Usage:**

```html
<div class="transform-gpu [text-rendering:optimizeSpeed] [font-kerning:none]">
  <!-- content -->
</div>
```
