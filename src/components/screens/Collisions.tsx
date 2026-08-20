"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ScreenShell from "../ScreenShell";
import SourceChip from "../SourceChip";
import { collisions, collisionsIntro, type Collision } from "@/src/content/content";
import { ui } from "@/src/content/ui";

const pad = (value: number) => String(value).padStart(2, "0");

function CollisionCard({ collision, total }: { collision: Collision; total: number }) {
  return (
    <article className="w-full shrink-0 snap-center px-1">
      <div className="h-full rounded-md border border-hairline bg-paper p-6 shadow-sm md:p-10">
        <p className="font-mono text-xs tracking-wide text-slate uppercase">
          {pad(collision.index)} / {pad(total)}
        </p>

        <h3 className="mt-6 font-sans text-3xl leading-tight font-semibold text-ink md:text-4xl">
          {collision.title}
        </h3>

        {/* Problem on the left, answer on the right. The split fills the card
            width and doubles as the separation the section needs. */}
        <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="font-body text-base leading-relaxed text-slate md:text-lg">
              {collision.tension}
            </p>

            <p className="mt-8 font-mono text-xs tracking-wide text-slate uppercase">
              {ui.evidenceLabel}
            </p>
            <ul className="mt-3 space-y-2">
              {collision.evidence.map((item, index) => (
                <li
                  key={index}
                  className="flex gap-3 font-mono text-xs leading-relaxed text-ink"
                >
                  <span aria-hidden="true" className="text-slate">
                    {pad(index + 1)}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs tracking-wide text-slate uppercase">
              {ui.costLabel}
            </p>
            <p className="mt-3 border-l-2 border-accent pl-4 font-body text-base leading-relaxed text-ink">
              {collision.cost}
            </p>

            <div className="mt-8 rounded-md bg-accent-muted p-6">
              <p className="font-mono text-xs tracking-wide text-accent uppercase">
                {ui.resolutionLabel}
              </p>
              <p className="mt-3 font-body text-base leading-relaxed text-ink">
                {collision.resolution}
              </p>
            </div>

            <SourceChip sourceIds={collision.sourceIds} className="mt-6" />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Collisions() {
  const total = collisions.length;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  // The track is the source of truth for position, so a native swipe and an
  // arrow press converge on the same state.
  const goTo = useCallback((next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(next, total - 1));
    // Commit the intent immediately rather than waiting for the scroll to
    // settle, so a second arrow press advances instead of re-requesting the
    // page still being animated to.
    setIndex(clamped);
    track.scrollTo({
      left: clamped * track.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [total]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setIndex(Math.round(track.scrollLeft / track.clientWidth));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <ScreenShell id="collisions" bg="shade">
      <h2 className="max-w-4xl font-sans text-3xl leading-tight font-semibold text-ink md:text-4xl">
        {collisionsIntro.heading}
      </h2>
      <p className="mt-4 max-w-[70ch] font-body text-base leading-relaxed text-slate md:text-lg">
        {collisionsIntro.standfirst}
      </p>

      <div
        ref={trackRef}
        className="mt-10 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {collisions.map((collision) => (
          <CollisionCard key={collision.id} collision={collision} total={total} />
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label={ui.sliderPrevious}
          className="hidden rounded-md border border-hairline bg-paper p-2 text-slate transition-colors hover:border-accent hover:text-ink disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:block"
        >
          <svg viewBox="0 0 8 12" className="h-3 w-2" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 1L2 6l5 5" />
          </svg>
        </button>

        <div role="group" aria-label={ui.sliderPagination} className="flex items-center gap-2">
          {collisions.map((collision, i) => (
            <button
              key={collision.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${ui.sliderGoTo} ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-md transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                i === index ? "w-6 bg-accent" : "w-2 bg-hairline hover:bg-slate"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index === total - 1}
          aria-label={ui.sliderNext}
          className="hidden rounded-md border border-hairline bg-paper p-2 text-slate transition-colors hover:border-accent hover:text-ink disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:block"
        >
          <svg viewBox="0 0 8 12" className="h-3 w-2" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1l5 5-5 5" />
          </svg>
        </button>
      </div>
    </ScreenShell>
  );
}
