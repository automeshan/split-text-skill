# React Stagger Components

Production-ready components for common stagger patterns. Uses utility classes from globals.css.

## Important Notes

- All components require `"use client"` directive (Next.js App Router)
- `children` prop in StaggerButton should be a string for stable dependency
- Import pattern assumes `@/lib/gsapConfig` is a thin re-export, not a barrel file

## Required CSS in globals.css

```css
/* Stagger utilities - add to @layer base */
@layer base {
  .stagger-char {
    @apply inline-block transform-gpu;
    text-shadow: 0 1.3em currentColor;
    transform: translateY(0) rotate(0.001deg);
    transition: transform 0.5s cubic-bezier(0.625, 0.05, 0, 1);
  }

  .stagger-mask {
    @apply inline-block overflow-hidden relative leading-[1.3];
  }

  .group:hover .stagger-char {
    transform: translateY(-1.3em) rotate(0.001deg);
  }

  .stagger-item {
    @apply opacity-0 translate-y-10 transform-gpu;
  }
}

@layer components {
  .stagger-btn {
    @apply group relative flex items-center justify-center;
    @apply max-w-48 p-4 text-base leading-none cursor-pointer no-underline;
  }

  .stagger-btn__bg {
    @apply absolute inset-0 bg-neutral-100 rounded;
    transition: inset 0.5s cubic-bezier(0.625, 0.05, 0, 1);
  }

  .stagger-btn:hover .stagger-btn__bg {
    @apply inset-0.5;
  }

  .stagger-btn__text {
    @apply relative whitespace-nowrap leading-[1.3];
  }
}
```

## StaggerButton

CSS-based hover stagger with background inset effect.

```jsx
"use client";
import { useRef, useLayoutEffect } from "react";

export function StaggerButton({ children, href, className = "" }) {
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const text = el.textContent;
    el.innerHTML = "";

    // Batch DOM mutations with DocumentFragment
    const fragment = document.createDocumentFragment();
    [...text].forEach((char, i) => {
      const mask = document.createElement("span");
      mask.className = "stagger-mask";

      const span = document.createElement("span");
      span.className = "stagger-char";
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.transitionDelay = `${i * 10}ms`;

      mask.appendChild(span);
      fragment.appendChild(mask);
    });
    el.appendChild(fragment);
  }, [children]); // Note: children should be a string

  return (
    <a href={href} className={`stagger-btn ${className}`}>
      <div className="stagger-btn__bg" />
      <span ref={textRef} className="stagger-btn__text">
        {children}
      </span>
    </a>
  );
}
```

**Usage:**
```jsx
<StaggerButton href="/contact">Get in Touch</StaggerButton>
```

## StaggerList

Scroll-triggered list reveal using ScrollTrigger.batch.

```jsx
"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";

export function StaggerList({ items, className = "" }) {
  const listRef = useRef(null);

  useGSAP(() => {
    gsap.set(".stagger-item", { opacity: 0, y: 40 });

    ScrollTrigger.batch(".stagger-item", {
      onEnter: (elements) => {
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: "power2.out",
        });
      },
      start: "top 85%",
      once: true,
    });
  }, { scope: listRef });

  return (
    <ul ref={listRef} className={className}>
      {items.map((item, i) => (
        <li key={item.id || i} className="stagger-item">
          {item.content || item}
        </li>
      ))}
    </ul>
  );
}
```

**Usage:**
```jsx
<StaggerList
  items={["First item", "Second item", "Third item"]}
  className="space-y-4"
/>

// Or with objects
<StaggerList
  items={[
    { id: 1, content: <NavLink href="/">Home</NavLink> },
    { id: 2, content: <NavLink href="/about">About</NavLink> },
  ]}
/>
```

## StaggerGrid

Cards radiating from center on scroll.

```jsx
"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsapConfig";

export function StaggerGrid({ children, className = "" }) {
  const gridRef = useRef(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray(".grid-card");

    gsap.set(cards, { opacity: 0, scale: 0.8 });

    gsap.to(cards, {
      opacity: 1,
      scale: 1,
      duration: 0.7,
      ease: "power3.out",
      stagger: {
        amount: 0.6,
        from: "center",
        grid: "auto",
      },
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top 80%",
        once: true,
      },
    });
  }, { scope: gridRef });

  return (
    <div ref={gridRef} className={`grid gap-4 ${className}`}>
      {children}
    </div>
  );
}

// Card wrapper for grid items
export function GridCard({ children, className = "" }) {
  return (
    <div className={`grid-card ${className}`}>
      {children}
    </div>
  );
}
```

**Usage:**
```jsx
<StaggerGrid className="grid-cols-2 md:grid-cols-3">
  <GridCard className="p-6 bg-white rounded-lg shadow">Card 1</GridCard>
  <GridCard className="p-6 bg-white rounded-lg shadow">Card 2</GridCard>
  <GridCard className="p-6 bg-white rounded-lg shadow">Card 3</GridCard>
</StaggerGrid>
```

## StaggerText

GSAP-based hover stagger for when CSS text-shadow isn't enough.

```jsx
"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsapConfig";

export function StaggerText({ children, className = "" }) {
  const textRef = useRef(null);
  const splitRef = useRef(null);

  const { contextSafe } = useGSAP(() => {
    splitRef.current = new SplitText(textRef.current, {
      type: "chars",
    });

    return () => splitRef.current?.revert();
  }, { scope: textRef });

  const onEnter = contextSafe(() => {
    gsap.to(splitRef.current.chars, {
      y: -8,
      stagger: 0.02,
      duration: 0.4,
      ease: "power2.out",
    });
  });

  const onLeave = contextSafe(() => {
    gsap.to(splitRef.current.chars, {
      y: 0,
      stagger: 0.02,
      duration: 0.4,
      ease: "power2.out",
    });
  });

  return (
    <span
      ref={textRef}
      className={`inline-block cursor-pointer ${className}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
    </span>
  );
}
```

**Usage:**
```jsx
<StaggerText className="text-2xl font-bold">
  Hover over me
</StaggerText>
```

## Integration with TextReveal

The existing `TextReveal` component in this project already supports hover stagger via the `hover` prop:

```jsx
import TextReveal from "@/app/components/TextReveal";

// CSS-based hover stagger (text-shadow technique)
<TextReveal reveal="chars" hover hoverStagger={0.01} hoverDuration={0.5}>
  Hover to see stagger
</TextReveal>

// Scroll-triggered reveal + hover
<TextReveal reveal="words" opacity hover>
  Scroll reveal with hover effect
</TextReveal>
```

**When to use TextReveal vs custom:**
- **TextReveal:** Scroll-triggered reveals, SplitText integration, combined effects
- **StaggerButton:** Button-specific styling, background inset effect
- **StaggerText:** Simple hover-only, no scroll trigger needed

## Accessibility

All components should respect reduced motion:

```jsx
const shouldAnimate = () =>
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

useGSAP(() => {
  if (!shouldAnimate()) {
    gsap.set(".stagger-item", { opacity: 1, y: 0 });
    return;
  }
  // ... animations
});
```

For CSS-based components, add to globals.css:

```css
@media (prefers-reduced-motion: reduce) {
  .stagger-char,
  .stagger-btn__bg {
    transition: none;
  }
}
```
