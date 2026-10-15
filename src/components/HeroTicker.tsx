"use client";

import { useEffect, useState } from "react";
import {
  audiences,
  cascade,
  collisions,
  heroStage,
  pillars,
  sources,
} from "@/src/content/content";

// Counted from the content itself, so the strip cannot drift from the page.
const ITEMS = [
  { label: heroStage.ticker.claims, value: sources.length },
  { label: heroStage.ticker.collisions, value: collisions.length },
  { label: heroStage.ticker.pillars, value: pillars.length },
  { label: heroStage.ticker.audiences, value: audiences.length },
  { label: heroStage.ticker.messages, value: cascade.length },
  {
    label: heroStage.ticker.rules,
    value: cascade.filter((cell) => cell.doNotSay.length > 0).length,
  },
];

/** Eases from zero to each total once, on first paint. */
function useCountUp(duration = 1400) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => setProgress(1));
      return () => cancelAnimationFrame(frame);
    }
    let frame = 0;
    const start = performance.now() + 500;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration]);
  return progress;
}

function Row({ progress, hidden = false }: { progress: number; hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <li key={item.label} className="flex items-center gap-2.5 pr-8 md:pr-10">
          <span className="font-mono text-[11px] tracking-wide whitespace-nowrap text-paper/75 uppercase">
            {item.label}
          </span>
          <span className="min-w-[2.75rem] border border-paper/25 bg-paper/10 px-2 py-0.5 text-center font-mono text-xs text-paper tabular-nums">
            {String(Math.round(item.value * progress)).padStart(2, "0")}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The running tally under the hero. Scrolls as a marquee, with the copy
 * duplicated so the loop has no seam.
 */
export default function HeroTicker() {
  const progress = useCountUp();

  return (
    <div className="mt-12 flex items-center gap-6 border-t border-paper/20 pt-5">
      <span className="hidden shrink-0 items-center gap-2 font-mono text-[11px] tracking-wide text-paper uppercase sm:flex">
        <span aria-hidden="true" className="grid grid-cols-2 gap-0.5">
          <span className="h-1 w-1 bg-paper" />
          <span className="h-1 w-1 bg-paper/50" />
          <span className="h-1 w-1 bg-paper/50" />
          <span className="h-1 w-1 bg-paper" />
        </span>
        {heroStage.ticker.label}
      </span>
      <div className="hero-fade relative min-w-0 flex-1 overflow-hidden">
        <div className="hero-marquee flex w-max">
          <Row progress={progress} />
          <Row progress={progress} hidden />
        </div>
      </div>
    </div>
  );
}
