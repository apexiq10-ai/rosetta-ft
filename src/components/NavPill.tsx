"use client";

import { useEffect, useState } from "react";
import { ui } from "@/src/content/ui";

const TARGET_ID = "cascade";

/**
 * Escape hatch to the interactive framework. Sits alongside the linear scroll
 * rather than replacing it, and takes itself off screen once the reader has
 * arrived at the section it points to.
 */
export default function NavPill() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById(TARGET_ID);
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const jump = () => {
    document.getElementById(TARGET_ID)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  return (
    <button
      type="button"
      onClick={jump}
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden}
      className={`fixed right-6 bottom-16 z-40 flex items-center gap-2 border border-hairline bg-paper px-4 py-3 font-sans text-sm text-ink shadow-sm transition-opacity duration-200 hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:right-12 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {ui.navToFramework}
      <svg
        viewBox="0 0 12 8"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-2 w-3 text-accent"
      >
        <path d="M1 1l5 5 5-5" />
      </svg>
    </button>
  );
}
