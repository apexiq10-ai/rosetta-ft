"use client";

import { useState, type ReactNode } from "react";
import ScreenShell from "../ScreenShell";
import SourceChip from "../SourceChip";
import { collisions, collisionsIntro, type Collision } from "@/src/content/content";
import { ui } from "@/src/content/ui";

const pad = (value: number) => String(value).padStart(2, "0");

type QuadrantProps = {
  label: string;
  tone: "plain" | "light" | "dark";
  accent?: boolean;
  children: ReactNode;
};

// One background per tone. Every quadrant otherwise carries the same rule
// weight and colour, which the grid gap supplies rather than each cell.
const tones: Record<QuadrantProps["tone"], string> = {
  plain: "bg-paper",
  light: "bg-canvas",
  dark: "bg-shade",
};

function Quadrant({ label, tone, accent = false, children }: QuadrantProps) {
  return (
    <div className={`p-6 md:p-8 ${tones[tone]} ${accent ? "border-t-2 border-accent" : ""}`}>
      <h3
        className={`font-sans text-lg leading-tight font-semibold ${
          accent ? "text-accent" : "text-ink"
        }`}
      >
        {label}
      </h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function CollisionCard({ collision }: { collision: Collision }) {
  return (
    <div className="grid gap-px border border-hairline bg-hairline md:grid-cols-2">
      <Quadrant label={ui.tensionLabel} tone="plain">
        <p className="font-body text-base leading-relaxed text-slate">
          {collision.tension}
        </p>
      </Quadrant>

      <Quadrant label={ui.evidenceLabel} tone="plain">
        <ul className="space-y-2">
          {collision.evidence.map((item, index) => (
            <li key={index} className="flex gap-3 font-body text-sm leading-relaxed text-ink">
              <span aria-hidden="true" className="text-slate">
                {pad(index + 1)}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Quadrant>

      <Quadrant label={ui.costLabel} tone="light">
        <p className="font-body text-base leading-relaxed text-ink">{collision.cost}</p>
      </Quadrant>

      <Quadrant label={ui.resolutionLabel} tone="dark" accent>
        <p className="font-body text-base leading-relaxed text-ink">
          {collision.resolution}
        </p>
        <SourceChip sourceIds={collision.sourceIds} className="mt-6" />
      </Quadrant>
    </div>
  );
}

export default function Collisions() {
  const total = collisions.length;
  const [index, setIndex] = useState(0);
  const active = collisions[index];

  const arrow = "border border-hairline bg-paper p-2 text-slate transition-colors hover:border-accent hover:text-ink disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  return (
    <ScreenShell id="collisions" bg="shade">
      <h2 className="max-w-4xl font-sans text-3xl leading-tight font-semibold text-ink md:text-4xl">
        {collisionsIntro.heading}
      </h2>
      <p className="mt-4 font-body text-base leading-relaxed text-slate md:text-lg">
        {collisionsIntro.standfirst}
      </p>

      <div className="mt-10 border border-hairline bg-paper">
        {/* Pagination lives at the head of the card: tabs carry the titles, the
            arrows step through them. */}
        <div className="flex items-stretch gap-3 border-b border-hairline p-3">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            aria-label={ui.sliderPrevious}
            className={`hidden shrink-0 md:block ${arrow}`}
          >
            <svg viewBox="0 0 8 12" className="h-3 w-2" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 1L2 6l5 5" />
            </svg>
          </button>

          <div
            role="tablist"
            aria-label={ui.sliderPagination}
            className="flex flex-1 gap-px overflow-x-auto bg-hairline [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {collisions.map((collision, i) => (
              <button
                key={collision.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                onClick={() => setIndex(i)}
                className={`flex min-w-[14rem] flex-1 flex-col gap-1 px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
                  i === index ? "bg-shade text-ink" : "bg-paper text-slate hover:text-ink"
                }`}
              >
                <span className="font-mono text-xs tracking-wide">
                  {pad(collision.index)} / {pad(total)}
                </span>
                <span className="font-sans text-sm leading-snug font-semibold">
                  {collision.title}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
            disabled={index === total - 1}
            aria-label={ui.sliderNext}
            className={`hidden shrink-0 md:block ${arrow}`}
          >
            <svg viewBox="0 0 8 12" className="h-3 w-2" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1l5 5-5 5" />
            </svg>
          </button>
        </div>

        <CollisionCard collision={active} />
      </div>
    </ScreenShell>
  );
}
