"use client";

import TextReveal from "./components/TextReveal";

export default function Home() {
  return (
    <div className="min-h-screen p-[2em] pb-[5em] sm:p-[5em] font-[family-name:var(--font-geist-sans)]">
      <main className="container mx-auto flex flex-col gap-[8em] items-center sm:items-start py-[5em]">
        <section className="h-[50vh] flex flex-col justify-center">
          <h1 className="prose-h1">SplitText Scroll Reveal</h1>
          <p className="prose-p-muted">Scroll down to see the magic.</p>
        </section>

        {/* Standard Reveals */}
        <section className="w-full">
          <h2 className="text-sm font-mono text-gray-400 mb-6 uppercase tracking-wider">
            Lines Reveal (Default)
          </h2>
          <TextReveal>
            <div className="text-[3.5em] font-bold leading-tight">
              This text will reveal line by line when you scroll into view. It
              demonstrates the subtle power of SplitText animations.
            </div>
          </TextReveal>
        </section>

        <section className="w-full">
          <h2 className="text-sm font-mono text-gray-400 mb-6 uppercase tracking-wider">
            Words Reveal
          </h2>
          <TextReveal reveal="words">
            <div className="text-[3.5em] font-bold leading-tight">
              Each word comes up individually. Creating a dynamic and engaging
              reading flow.
            </div>
          </TextReveal>
        </section>

        <section className="w-full">
          <h2 className="text-sm font-mono text-gray-400 mb-6 uppercase tracking-wider">
            Chars Reveal
          </h2>
          <TextReveal reveal="chars">
            <div className="text-[3.5em] font-bold leading-tight">
              Character by character precision.
            </div>
          </TextReveal>
        </section>

        {/* Rotation Reveals */}
        <section className="w-full">
          <div className="h-px w-full bg-gray-200 my-10"></div>
          <h2 className="text-sm font-mono text-purple-500 mb-6 uppercase tracking-wider">
            Rotation Effect
          </h2>
          <p className="prose-p-muted">
            Add subtle rotation for a more dynamic entrance. Works best with
            words or chars.
          </p>
        </section>

        <section className="w-full">
          <h2 className="text-sm font-mono text-gray-400 mb-6 uppercase tracking-wider">
            Words + Subtle Rotate (5°)
          </h2>
          <TextReveal reveal="words" rotate={5}>
            <div className="text-[3.5em] font-bold leading-tight">
              Each word tilts gently into place. A subtle touch of personality.
            </div>
          </TextReveal>
        </section>

        <section className="w-full">
          <h2 className="text-sm font-mono text-gray-400 mb-6 uppercase tracking-wider">
            Chars + Playful Rotate (8°)
          </h2>
          <TextReveal reveal="chars" rotate={8}>
            <div className="text-[3.5em] font-bold leading-tight">
              Playful vibes.
            </div>
          </TextReveal>
        </section>

        {/* Opacity Reveals */}
        <section className="w-full">
          <div className="h-px w-full bg-gray-200 my-10"></div>
          <h2 className="text-sm font-mono text-emerald-500 mb-6 uppercase tracking-wider">
            Opacity Effect
          </h2>
          <p className="prose-p-muted">
            Add a fade-in effect for softer, more elegant reveals. Combines well
            with rotation.
          </p>
        </section>

        <section className="w-full">
          <h2 className="text-sm font-mono text-gray-400 mb-6 uppercase tracking-wider">
            Words + Opacity
          </h2>
          <TextReveal reveal="words" opacity>
            <div className="text-[3.5em] font-bold leading-tight">
              Each word fades in gracefully. A softer, more elegant entrance.
            </div>
          </TextReveal>
        </section>

        <section className="w-full">
          <h2 className="text-sm font-mono text-gray-400 mb-6 uppercase tracking-wider">
            Chars + Rotate + Opacity (Combo)
          </h2>
          <TextReveal reveal="chars" rotate={5} opacity>
            <div className="text-[3.5em] font-bold leading-tight">
              The full experience.
            </div>
          </TextReveal>
        </section>

        {/* Blur Reveals */}
        <section className="w-full">
          <div className="h-px w-full bg-gray-200 my-10"></div>
          <h2 className="text-sm font-mono text-cyan-500 mb-6 uppercase tracking-wider">
            Blur Effect
          </h2>
          <p className="prose-p-muted">
            Add a focus-pull effect for cinematic reveals. GPU-intensive, use
            sparingly.
          </p>
        </section>

        <section className="w-full">
          <h2 className="text-sm font-mono text-gray-400 mb-6 uppercase tracking-wider">
            Words + Blur (8px)
          </h2>
          <TextReveal reveal="words" blur={8}>
            <div className="text-[3.5em] font-bold leading-tight">
              Words emerge from a dreamy haze into sharp focus.
            </div>
          </TextReveal>
        </section>

        <section className="w-full">
          <h2 className="text-sm font-mono text-gray-400 mb-6 uppercase tracking-wider">
            Chars + Opacity + Blur (Ultimate Combo)
          </h2>
          <TextReveal reveal="chars" rotate={3} opacity blur={6}>
            <div className="text-[3.5em] font-bold leading-tight">
              Pure cinema.
            </div>
          </TextReveal>
        </section>

        {/* Scrub Reveals */}
        <section className="w-full">
          <div className="h-px w-full bg-gray-200 my-10"></div>
          <h2 className="text-sm font-mono text-blue-500 mb-6 uppercase tracking-wider">
            Scrub Interaction
          </h2>
          <p className="prose-p-muted">
            These animations are tied directly to the scrollbar. Scroll up and
            down to play the animation.
          </p>
        </section>

        <section className="w-full">
          <h2 className="text-sm font-mono text-gray-400 mb-6 uppercase tracking-wider">
            Scrub Lines
          </h2>
          <TextReveal scrub>
            <div className="text-[3.5em] font-bold leading-tight">
              Control the animation with your scroll. As you move down, the
              lines reveal themselves. Move up, and they hide again.
            </div>
          </TextReveal>
        </section>

        <section className="w-full">
          <h2 className="text-sm font-mono text-gray-400 mb-6 uppercase tracking-wider">
            Scrub Words
          </h2>
          <TextReveal reveal="words" scrub>
            <div className="text-[3.5em] font-bold leading-tight">
              Complete control over every word. Perfect for storytelling
              sections or highlighting key messages.
            </div>
          </TextReveal>
        </section>

        <section className="h-[50vh]"></section>
      </main>
    </div>
  );
}
