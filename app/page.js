"use client";

import TextReveal from "./components/TextReveal";

export default function Home() {
  return (
    <div className="page-wrapper">
      <main className="page-main">
        <section className="section-hero">
          <h1 className="prose-h1">SplitText Scroll Reveal</h1>
          <p className="prose-p-muted">Scroll down to see the magic.</p>
        </section>

        {/* Standard Reveals */}
        <section className="section-content">
          <h2 className="prose-h2">Lines Reveal (Default)</h2>
          <TextReveal>
            <div className="prose-display">
              This text will reveal line by line when you scroll into view. It
              demonstrates the subtle power of SplitText animations.
            </div>
          </TextReveal>
        </section>

        <section className="section-content">
          <h2 className="prose-h2">Words Reveal</h2>
          <TextReveal reveal="words">
            <div className="prose-display">
              Each word comes up individually. Creating a dynamic and engaging
              reading flow.
            </div>
          </TextReveal>
        </section>

        <section className="section-content">
          <h2 className="prose-h2">Chars Reveal</h2>
          <TextReveal reveal="chars">
            <div className="prose-display">Character by character precision.</div>
          </TextReveal>
        </section>

        {/* Rotation Reveals */}
        <section className="section-content">
          <div className="divider"></div>
          <h2 className="prose-h2-accent text-purple-500">Rotation Effect</h2>
          <p className="prose-p-muted">
            Add subtle rotation for a more dynamic entrance. Works best with
            words or chars.
          </p>
        </section>

        <section className="section-content">
          <h2 className="prose-h2">Words + Subtle Rotate (5°)</h2>
          <TextReveal reveal="words" rotate={5}>
            <div className="prose-display">
              Each word tilts gently into place. A subtle touch of personality.
            </div>
          </TextReveal>
        </section>

        <section className="section-content">
          <h2 className="prose-h2">Chars + Playful Rotate (8°)</h2>
          <TextReveal reveal="chars" rotate={8}>
            <div className="prose-display">Playful vibes.</div>
          </TextReveal>
        </section>

        {/* Opacity Reveals */}
        <section className="section-content">
          <div className="divider"></div>
          <h2 className="prose-h2-accent text-emerald-500">Opacity Effect</h2>
          <p className="prose-p-muted">
            Add a fade-in effect for softer, more elegant reveals. Combines well
            with rotation.
          </p>
        </section>

        <section className="section-content">
          <h2 className="prose-h2">Words + Opacity</h2>
          <TextReveal reveal="words" opacity>
            <div className="prose-display">
              Each word fades in gracefully. A softer, more elegant entrance.
            </div>
          </TextReveal>
        </section>

        <section className="section-content">
          <h2 className="prose-h2">Chars + Rotate + Opacity (Combo)</h2>
          <TextReveal reveal="chars" rotate={5} opacity>
            <div className="prose-display">The full experience.</div>
          </TextReveal>
        </section>

        {/* Blur Reveals */}
        <section className="section-content">
          <div className="divider"></div>
          <h2 className="prose-h2-accent text-cyan-500">Blur Effect</h2>
          <p className="prose-p-muted">
            Add a focus-pull effect for cinematic reveals. GPU-intensive, use
            sparingly.
          </p>
        </section>

        <section className="section-content">
          <h2 className="prose-h2">Words + Blur (8px)</h2>
          <TextReveal reveal="words" blur={8}>
            <div className="prose-display">
              Words emerge from a dreamy haze into sharp focus.
            </div>
          </TextReveal>
        </section>

        <section className="section-content">
          <h2 className="prose-h2">Chars + Opacity + Blur (Ultimate Combo)</h2>
          <TextReveal reveal="chars" rotate={3} opacity blur={6}>
            <div className="prose-display">Pure cinema.</div>
          </TextReveal>
        </section>

        {/* Scrub Reveals */}
        <section className="section-content">
          <div className="divider"></div>
          <h2 className="prose-h2-accent text-blue-500">Scrub Interaction</h2>
          <p className="prose-p-muted">
            These animations are tied directly to the scrollbar. Scroll up and
            down to play the animation.
          </p>
        </section>

        <section className="section-content">
          <h2 className="prose-h2">Scrub Lines</h2>
          <TextReveal scrub>
            <div className="prose-display">
              Control the animation with your scroll. As you move down, the
              lines reveal themselves. Move up, and they hide again.
            </div>
          </TextReveal>
        </section>

        <section className="section-content">
          <h2 className="prose-h2">Scrub Words</h2>
          <TextReveal reveal="words" scrub>
            <div className="prose-display">
              Complete control over every word. Perfect for storytelling
              sections or highlighting key messages.
            </div>
          </TextReveal>
        </section>

        <section className="section-spacer"></section>
      </main>
    </div>
  );
}
