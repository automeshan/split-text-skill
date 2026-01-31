"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

export default function Home() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(SplitText, ScrollTrigger);

    const splitConfig = {
      lines: { duration: 0.8, stagger: 0.08 },
      words: { duration: 0.6, stagger: 0.06 },
      chars: { duration: 0.4, stagger: 0.01 },
    };

    let ctx = gsap.context(() => {
      const headings = gsap.utils.toArray('[data-split="heading"]');

      headings.forEach((heading) => {
        // Reset visibility before animation
        gsap.set(heading, { autoAlpha: 1 });

        const type = heading.dataset.splitReveal || "lines";
        const typesToSplit =
          type === "lines"
            ? ["lines"]
            : type === "words"
              ? ["lines", "words"]
              : ["lines", "words", "chars"];

        const split = new SplitText(heading, {
          type: typesToSplit.join(", "),
          mask: "lines", // Kept from reference, though may not be standard
          linesClass: "line",
          wordsClass: "word",
          charsClass: "letter",
        });

        const targets = split[type];
        const config = splitConfig[type];

        const isScrub = heading.dataset.scrub !== undefined;

        gsap.from(targets, {
          yPercent: 110,
          duration: config.duration,
          stagger: config.stagger,
          ease: "expo.out",
          scrollTrigger: {
            trigger: heading,
            start: "clamp(top 80%)",
            end: isScrub ? "bottom 40%" : undefined,
            scrub: isScrub ? 1 : false,
            once: !isScrub,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen p-[2em] pb-[5em] sm:p-[5em] font-[family-name:var(--font-geist-sans)]"
    >
      <main className="container mx-auto flex flex-col gap-[8em] items-center sm:items-start py-[5em]">
        <section className="h-[50vh] flex flex-col justify-center">
          <h1 className="text-[4em] leading-[1.1] font-bold mb-[0.5em]">SplitText Scroll Reveal</h1>
          <p className="text-[1.25em] text-gray-500">Scroll down to see the magic.</p>
        </section>

        {/* Standard Reveals */}
        <section className="w-full">
          <h2 className="text-sm font-mono text-gray-400 mb-6 uppercase tracking-wider">
            Lines Reveal (Default)
          </h2>
          <div
            className="text-[3.5em] font-bold leading-tight overflow-hidden invisible transform-gpu [text-rendering:optimizeSpeed] [font-kerning:none]"
            data-split="heading"
            data-split-reveal="lines"
          >
            This text will reveal line by line when you scroll into view. It
            demonstrates the subtle power of SplitText animations.
          </div>
        </section>

        <section className="w-full">
          <h2 className="text-sm font-mono text-gray-400 mb-6 uppercase tracking-wider">
            Words Reveal
          </h2>
          <div
            className="text-[3.5em] font-bold leading-tight"
            data-split="heading"
            data-split-reveal="words"
          >
            Each word comes up individually. Creating a dynamic and engaging
            reading flow.
          </div>
        </section>

        <section className="w-full">
          <h2 className="text-sm font-mono text-gray-400 mb-6 uppercase tracking-wider">
            Chars Reveal
          </h2>
          <div
            className="text-[3.5em] font-bold leading-tight invisible transform-gpu [text-rendering:optimizeSpeed] [font-kerning:none]"
            data-split="heading"
            data-split-reveal="chars"
          >
            Character by character precision.
          </div>
        </section>

        {/* Scrub Reveals */}
        <section className="w-full">
          <div className="h-px w-full bg-gray-200 my-10"></div>
          <h2 className="text-sm font-mono text-blue-500 mb-6 uppercase tracking-wider">
            Scrub Interaction
          </h2>
          <p className="mb-8 text-gray-500">
            These animations are tied directly to the scrollbar. Scroll up and
            down to play the animation.
          </p>
        </section>

        <section className="w-full">
          <h2 className="text-sm font-mono text-gray-400 mb-6 uppercase tracking-wider">
            Scrub Lines
          </h2>
          <div
            className="text-[3.5em] font-bold leading-tight invisible transform-gpu [text-rendering:optimizeSpeed] [font-kerning:none]"
            data-split="heading"
            data-split-reveal="lines"
            data-scrub="true"
          >
            Control the animation with your scroll. As you move down, the lines
            reveal themselves. Move up, and they hide again.
          </div>
        </section>

        <section className="w-full">
          <h2 className="text-sm font-mono text-gray-400 mb-6 uppercase tracking-wider">
            Scrub Words
          </h2>
          <div
            className="text-[3.5em] font-bold leading-tight invisible transform-gpu [text-rendering:optimizeSpeed] [font-kerning:none]"
            data-split="heading"
            data-split-reveal="words"
            data-scrub="true"
          >
            Complete control over every word. Perfect for storytelling sections or
            highlighting key messages.
          </div>
        </section>

        <section className="h-[50vh]"></section>
      </main>
    </div>
  );
}
