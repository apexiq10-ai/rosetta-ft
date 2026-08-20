"use client";

import { useState } from "react";
import { compliance } from "@/src/content/content";
import { ui } from "@/src/content/ui";

/**
 * Persistent, never dismissible. Mounted once in the root layout so it sits
 * over every screen background without being re-declared per screen.
 */
export default function ComplianceFooter() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-canvas/92 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-controls="compliance-detail"
          aria-label={ui.complianceToggle}
          className="flex w-full items-center gap-3 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span className="font-mono text-[11px] leading-snug text-slate md:text-xs">
            {compliance.short}
          </span>
          <svg
            viewBox="0 0 12 8"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={`ml-auto h-2 w-3 shrink-0 text-slate transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          >
            <path d="M1 1l5 5 5-5" />
          </svg>
        </button>

        <div id="compliance-detail" hidden={!expanded}>
          <p className="max-h-[40dvh] max-w-[65ch] overflow-y-auto pb-4 font-mono text-[11px] leading-relaxed text-slate">
            {compliance.long}
          </p>
        </div>
      </div>
    </div>
  );
}
