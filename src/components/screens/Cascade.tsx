"use client";

import { useState } from "react";
import ScreenShell from "../ScreenShell";
import SourceChip from "../SourceChip";
import {
  audiences,
  cascade,
  cascadeIntro,
  pillars,
  type Audience,
  type CascadeCell,
  type Pillar,
} from "@/src/content/content";
import { ui } from "@/src/content/ui";

/** First sentence of a body paragraph, used as the "why" without rewriting it. */
function firstSentence(text: string) {
  const end = text.indexOf(". ");
  return end === -1 ? text : text.slice(0, end + 1);
}

function HeroItem({ label, children }: { label: string; children: string }) {
  return (
    <div className="bg-paper p-6 md:p-8">
      <h3 className="font-sans text-lg leading-tight font-semibold text-ink">{label}</h3>
      <p className="mt-4 font-body text-base leading-relaxed text-slate">{children}</p>
    </div>
  );
}

function PersonaColumn({
  audience,
  cell,
}: {
  audience: Audience;
  cell: CascadeCell;
}) {
  // A cell with nothing to cite is making no claim, which is what the suppress
  // state is. Derived from the data rather than named in code.
  const suppressed = cell.sourceIds.length === 0;

  return (
    <div
      className={`flex w-[85%] shrink-0 snap-center flex-col bg-paper p-6 md:w-auto ${
        suppressed ? "opacity-60" : ""
      }`}
    >
      <h3 className="font-sans text-2xl leading-tight font-semibold text-ink">
        {audience.label}
      </h3>
      <p className="mt-2 font-body text-sm leading-relaxed text-slate">{audience.who}</p>

      <ul className="mt-6 flex-1 space-y-4 border-t border-hairline pt-6">
        <li className="font-body text-base leading-relaxed text-ink">{cell.message}</li>
        <li className="font-body text-sm leading-relaxed text-slate">
          {cell.proof}
          {cell.sourceIds.length > 0 ? (
            <SourceChip sourceIds={cell.sourceIds} className="ml-2 align-middle" square />
          ) : null}
        </li>
        <li className="font-body text-sm leading-relaxed text-slate">{cell.channel}</li>
      </ul>

      <div className="mt-6 bg-accent-muted p-4">
        <p className="font-mono text-xs tracking-wide text-accent uppercase">
          {ui.doNotSayLabel}
        </p>
        <p className="mt-2 font-body text-sm leading-relaxed text-ink">{cell.doNotSay}</p>
      </div>
    </div>
  );
}

export default function Cascade() {
  const [selectedPillarId, setSelectedPillarId] = useState<Pillar["id"]>(pillars[0].id);
  const pillar = pillars.find((item) => item.id === selectedPillarId) ?? pillars[0];

  return (
    <ScreenShell id="cascade" bg="paper">
      <h2 className="max-w-4xl font-sans text-3xl leading-tight font-semibold text-ink md:text-4xl">
        {cascadeIntro.heading}
      </h2>
      <p className="mt-4 max-w-[70ch] font-body text-base leading-relaxed text-slate md:text-lg">
        {cascadeIntro.standfirst}
      </p>

      {/* Choosing a pillar is the only interaction on this screen. */}
      <div
        role="tablist"
        aria-label={ui.pillarSelectorLabel}
        className="mt-10 flex gap-px overflow-x-auto border border-hairline bg-hairline [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {pillars.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === selectedPillarId}
            onClick={() => setSelectedPillarId(item.id)}
            className={`flex-1 px-6 py-4 font-sans text-base font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
              item.id === selectedPillarId
                ? "bg-shade text-ink"
                : "bg-paper text-slate hover:text-ink"
            }`}
          >
            {item.shorthand}
          </button>
        ))}
      </div>

      <div className="mt-px grid gap-px border-x border-b border-hairline bg-hairline md:grid-cols-3">
        <HeroItem label={ui.whyLabel}>{firstSentence(pillar.body)}</HeroItem>
        <HeroItem label={ui.whatLabel}>{pillar.statement}</HeroItem>
        <HeroItem label={ui.howLabel}>{pillar.proof}</HeroItem>
      </div>

      {/* Five personas at once here, side by side on desktop and swipeable on
          mobile, which is the point of calling it a canvas. */}
      <div className="mt-10 flex snap-x snap-mandatory gap-px overflow-x-auto border border-hairline bg-hairline [scrollbar-width:none] md:grid md:grid-cols-5 md:overflow-visible [&::-webkit-scrollbar]:hidden">
        {audiences.map((audience) => {
          const cell = cascade.find(
            (item) => item.pillarId === pillar.id && item.audienceId === audience.id,
          );
          if (!cell) return null;
          return <PersonaColumn key={audience.id} audience={audience} cell={cell} />;
        })}
      </div>
    </ScreenShell>
  );
}
