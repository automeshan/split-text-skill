"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins once at module level (not on every render)
if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollTrigger);
}

// Default timing per split type
const splitConfig = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 },
};

// Accessibility: respect user preference
function shouldAnimate() {
  if (typeof window === "undefined") return true;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * TextReveal - Reusable scroll-triggered text animation wrapper
 *
 * @param {ReactNode} children - Text element to animate (h1, p, span, etc.)
 * @param {"lines"|"words"|"chars"} reveal - Split type (default: "lines")
 * @param {number} rotate - Rotation in degrees (default: 0)
 * @param {boolean} opacity - Enable fade-in effect (default: false)
 * @param {number} blur - Blur amount in px (default: 0)
 * @param {number} duration - Animation duration (optional override)
 * @param {number} stagger - Stagger between elements (optional override)
 * @param {boolean} scrub - Tie animation to scrollbar (default: false)
 * @param {string} start - ScrollTrigger start position (default: "clamp(top 80%)")
 * @param {string} end - ScrollTrigger end position for scrub (default: "bottom 40%")
 * @param {string} className - Additional classes for wrapper div
 * @param {boolean} hover - Enable hover stagger effect (default: false)
 * @param {number} hoverStagger - Delay between each element in seconds (default: 0.01)
 * @param {number} hoverDuration - Hover transition duration in seconds (default: 0.6)
 * @param {number} hoverDistance - Y-translate distance in em (default: 1.3)
 * @param {string} hoverEase - CSS timing function (default: "cubic-bezier(0.625, 0.05, 0, 1)")
 */
export default function TextReveal({
  children,
  reveal = "lines",
  rotate = 0,
  opacity = false,
  blur = 0,
  duration,
  stagger,
  scrub = false,
  start = "clamp(top 80%)",
  end = "bottom 40%",
  className = "",
  hover = false,
  hoverStagger = 0.01,
  hoverDuration = 0.6,
  hoverDistance = 1.3,
  hoverEase = "cubic-bezier(0.625, 0.05, 0, 1)",
}) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Target the first child element (the actual text element) or container itself
    const textElement = container.children[0] || container;

    // Accessibility: skip animation, show text immediately
    if (!shouldAnimate()) {
      gsap.set(textElement, { visibility: "visible" });
      return;
    }

    let ctx;

    // Wait for fonts before splitting to ensure accurate line breaks
    document.fonts.ready.then(() => {
      ctx = gsap.context(() => {
        // Reveal element before animation
        gsap.set(textElement, { visibility: "visible" });

        // Determine split types based on reveal prop
        const typesToSplit =
          reveal === "lines"
            ? ["lines"]
            : reveal === "words"
              ? ["lines", "words"]
              : ["lines", "words", "chars"];

        // Get timing config (use overrides or defaults)
        const config = splitConfig[reveal];
        const animDuration = duration ?? config.duration;
        const animStagger = stagger ?? config.stagger;

        // HOVER-ONLY MODE: Skip scroll animation, just set up hover effect
        if (hover) {
          SplitText.create(textElement, {
            type: typesToSplit.join(", "),
            autoSplit: true,
            linesClass: "line",
            wordsClass: "word",
            charsClass: "letter",
            onSplit(instance) {
              const targets = instance[reveal];

              // Set CSS custom properties for dynamic hover effect (used by CSS for transform)
              container.style.setProperty("--hover-distance", `${hoverDistance}em`);
              container.style.setProperty("--hover-duration", `${hoverDuration}s`);
              container.style.setProperty("--hover-ease", hoverEase);
              container.style.setProperty("--hover-stagger", `${hoverStagger}s`);

              // Wrap each target in a clipping container and add inner span for animation
              // Batch style reads first, then writes (avoid layout thrashing)
              const elements = targets.map((el, i) => {
                const text = el.textContent;
                return { el, text, index: i };
              });

              // Batch all DOM writes
              elements.forEach(({ el, text, index }) => {
                // Outer element: tight clip container (lineHeight: 1 hides shadow)
                el.style.cssText = "overflow:hidden;display:inline-block;line-height:1;vertical-align:bottom";

                // Inner span: carries text-shadow and animates on hover
                const inner = document.createElement("span");
                inner.textContent = text;
                inner.style.cssText = `display:inline-block;text-shadow:0 var(--hover-distance) currentColor;transition:transform var(--hover-duration) var(--hover-ease);transition-delay:calc(${index} * var(--hover-stagger, ${hoverStagger}s))`;

                el.textContent = "";
                el.appendChild(inner);
              });

              container.dataset.hoverReveal = reveal;
            },
          });
          return; // Skip scroll animation setup
        }

        // SCROLL ANIMATION MODE (default)
        SplitText.create(textElement, {
          type: typesToSplit.join(", "),
          mask: "lines",
          autoSplit: true,
          linesClass: "line",
          wordsClass: "word",
          charsClass: "letter",
          onSplit(instance) {
            const targets = instance[reveal];

            // Set CSS variable for mask overflow (accounts for descenders + rotation)
            const maskOverflow = 110 + Math.abs(rotate) * 0.5;
            textElement.style.setProperty("--mask-overflow", `${maskOverflow}%`);

            // Base animation props
            const baseProps = {
              yPercent: maskOverflow,
              rotate,
              filter: blur ? `blur(${blur}px)` : "none",
              duration: animDuration,
              stagger: animStagger,
              ease: "expo.out",
              scrollTrigger: {
                trigger: textElement,
                start,
                end: scrub ? end : undefined,
                scrub: scrub ? 1 : false,
                once: !scrub,
              },
            };

            // Opacity: separate tween with delay for distinct fade effect
            if (opacity) {
              gsap.from(targets, {
                opacity: 0,
                duration: animDuration * 1.5,
                stagger: animStagger,
                ease: "power2.out",
                delay: animStagger * 0.5,
                scrollTrigger: {
                  trigger: textElement,
                  start,
                  end: scrub ? end : undefined,
                  scrub: scrub ? 1 : false,
                  once: !scrub,
                },
              });
            }

            return gsap.from(targets, baseProps);
          },
        });
      }, container);
    });

    return () => ctx?.revert();
  }, [reveal, rotate, opacity, blur, duration, stagger, scrub, start, end, hover, hoverStagger, hoverDuration, hoverDistance, hoverEase]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
