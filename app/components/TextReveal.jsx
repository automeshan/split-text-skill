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

              // Set CSS custom property for dynamic hover distance (used by CSS for transform)
              container.style.setProperty("--hover-distance", `${hoverDistance}em`);

              // Wrap each target in a clipping container and add inner span for animation
              targets.forEach((el, i) => {
                const text = el.textContent;

                // Outer element: tight clip container (lineHeight: 1 hides shadow)
                el.style.overflow = "hidden";
                el.style.display = "inline-block";
                el.style.lineHeight = "1";
                el.style.verticalAlign = "bottom";

                // Inner span: carries text-shadow and animates on hover
                const inner = document.createElement("span");
                inner.textContent = text;
                inner.style.display = "inline-block";
                inner.style.textShadow = `0 ${hoverDistance}em currentColor`;
                inner.style.transition = `transform ${hoverDuration}s ${hoverEase}`;
                inner.style.transitionDelay = `${i * hoverStagger}s`;

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
  }, [reveal, rotate, opacity, blur, duration, stagger, scrub, start, end, hover, hoverStagger, hoverDuration, hoverDistance, hoverEase]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
