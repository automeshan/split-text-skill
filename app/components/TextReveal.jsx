"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
}) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(SplitText, ScrollTrigger);

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

        // Use SplitText.create() with autoSplit for responsive recalculation
        SplitText.create(textElement, {
          type: typesToSplit.join(", "),
          mask: "lines",
          autoSplit: true,
          linesClass: "line",
          wordsClass: "word",
          charsClass: "letter",
          onSplit(instance) {
            const targets = instance[reveal];

            // Base animation props
            const baseProps = {
              yPercent: 110,
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
  }, [reveal, rotate, opacity, blur, duration, stagger, scrub, start, end]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
