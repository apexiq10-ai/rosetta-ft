"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export type DeckItem = {
  id: string;
  /** Accessible name for this item's pagination dot. */
  label: string;
  node: ReactNode;
};

/**
 * One item at a time, swipeable, with dots to jump between them. Used where
 * content is meant to be compared rather than read straight through, and a
 * stacked list would bury it under scroll.
 */
export default function SwipeDeck({
  items,
  label,
}: {
  items: DeckItem[];
  label: string;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  const goTo = useCallback((next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(next, items.length - 1));
    // Commit the intent immediately so the dots respond even while the scroll
    // is still settling.
    setIndex(clamped);
    track.scrollTo({
      left: clamped * track.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [items.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (track.clientWidth > 0) {
          setIndex(Math.round(track.scrollLeft / track.clientWidth));
        }
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <div key={item.id} className="w-full shrink-0 snap-center">
            {item.node}
          </div>
        ))}
      </div>

      <div role="group" aria-label={label} className="mt-6 flex items-center gap-2">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={item.label}
            aria-current={i === index}
            className={`h-2 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              i === index ? "w-6 bg-accent" : "w-2 bg-hairline"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
