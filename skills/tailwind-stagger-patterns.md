# Tailwind v4 Stagger Patterns

CSS stagger techniques using Tailwind v4 utility classes defined in `globals.css`. Keeps markup clean, styles centralized.

## Stagger Utility Classes

Add these to your `globals.css` alongside existing prose utilities:

```css
/* Stagger animation utilities */
@layer base {
  /* Base stagger character - used inside overflow container */
  .stagger-char {
    @apply inline-block transform-gpu;
    text-shadow: 0 1.3em currentColor;
    transform: translateY(0) rotate(0.001deg);
    transition: transform 0.5s cubic-bezier(0.625, 0.05, 0, 1);
    /* transition-delay set via JS: style={{ transitionDelay: `${i * 10}ms` }} */
  }

  /* Overflow mask for stagger characters */
  .stagger-mask {
    @apply inline-block overflow-hidden relative leading-[1.3];
  }

  /* Hover state - apply to parent with group */
  .group:hover .stagger-char,
  [data-stagger-hover]:hover .stagger-char {
    transform: translateY(-1.3em) rotate(0.001deg);
  }

  /* Stagger item for lists/grids - initial hidden state */
  .stagger-item {
    @apply opacity-0 translate-y-10 transform-gpu;
  }

  /* Stagger item revealed state */
  .stagger-item-visible {
    @apply opacity-100 translate-y-0;
  }
}

@layer components {
  /* Stagger button with background inset */
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

## Usage Patterns

### Button Hover Stagger

Clean markup with utility classes:

```jsx
function StaggerButton({ children, href }) {
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const el = textRef.current;
    const text = el.textContent;
    el.innerHTML = '';

    // Batch DOM mutations with DocumentFragment
    const fragment = document.createDocumentFragment();
    [...text].forEach((char, i) => {
      const mask = document.createElement('span');
      mask.className = 'stagger-mask';

      const span = document.createElement('span');
      span.className = 'stagger-char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.transitionDelay = `${i * 10}ms`;

      mask.appendChild(span);
      fragment.appendChild(mask);
    });
    el.appendChild(fragment);
  }, []); // children should be a string

  return (
    <a href={href} className="stagger-btn">
      <div className="stagger-btn__bg" />
      <span ref={textRef} className="stagger-btn__text">{children}</span>
    </a>
  );
}
```

### List Stagger (GSAP)

Items use `.stagger-item` for initial state:

```jsx
<ul ref={listRef}>
  {items.map(item => (
    <li key={item.id} className="stagger-item">
      {item.content}
    </li>
  ))}
</ul>
```

GSAP animates to visible:
```js
gsap.to(".stagger-item", {
  opacity: 1,
  y: 0,
  stagger: 0.05,
  duration: 0.5
});
```

### Grid Stagger (GSAP)

```jsx
<div ref={gridRef} className="grid grid-cols-3 gap-4">
  {cards.map(card => (
    <div key={card.id} className="stagger-item">
      {card.content}
    </div>
  ))}
</div>
```

## Text-Shadow Technique Explained

```
Before hover:           On hover:
┌───────────────┐      ┌───────────────┐
│   Original    │  →   │   (hidden)    │  ← slides up, exits mask
├───────────────┤      ├───────────────┤
│  text-shadow  │      │  text-shadow  │  ← slides up, enters view
│   (hidden)    │      │   (visible)   │
└───────────────┘      └───────────────┘
       ↑                      ↑
  overflow:hidden       translateY(-1.3em)
   hides shadow          reveals shadow
```

**Key values:**
- `1.3em` = line-height (adjust if your line-height differs)
- `rotate(0.001deg)` = forces subpixel rendering for smooth animation

## Adjusting for Different Line Heights

If your text has different line-height, update both values:

```css
/* For line-height: 1.5 */
.stagger-char-tall {
  @apply inline-block transform-gpu;
  text-shadow: 0 1.5em currentColor;
  /* ... */
}

.group:hover .stagger-char-tall {
  transform: translateY(-1.5em) rotate(0.001deg);
}
```

## Custom Timing via CSS Variables

Add to `@theme` block in globals.css:

```css
@theme inline {
  --duration-stagger: 500ms;
  --ease-stagger: cubic-bezier(0.625, 0.05, 0, 1);
}
```

Then reference in utilities:
```css
.stagger-char {
  transition: transform var(--duration-stagger) var(--ease-stagger);
}
```

## Performance Classes

Already included in utilities, but remember:

```css
.stagger-char {
  @apply transform-gpu;  /* GPU acceleration */
}

.prose-display {
  @apply [text-rendering:optimizeSpeed] [font-kerning:none];  /* For animated text */
}
```

## When CSS Isn't Enough

Switch to GSAP when you need:
- Scroll-triggered animations
- `from: "center"` or `from: "edges"` stagger patterns
- Reversible animations mid-flight
- Callbacks (`onComplete`, `onUpdate`)
- SplitText for responsive text splitting
