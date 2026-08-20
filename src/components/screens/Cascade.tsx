"use client";

import { useState } from "react";
import ScreenShell from "../ScreenShell";
import {
  audiences,
  cascade,
  pillars,
  type Audience,
  type CascadeCell,
  type Pillar,
} from "@/src/content/content";
import { ui } from "@/src/content/ui";

type SelectorProps<T extends string> = {
  label: string;
  options: { id: T; label: string }[];
  selectedId: T;
  onSelect: (id: T) => void;
};

/**
 * Generic pill selector. Knows nothing about pillars or audiences beyond the
 * id/label shape, so a fifth audience or a fifth pillar needs no change here.
 */
function Selector<T extends string>({
  label,
  options,
  selectedId,
  onSelect,
}: SelectorProps<T>) {
  return (
    <div>
      <p className="font-mono text-xs tracking-wide text-slate uppercase">{label}</p>
      <div role="group" aria-label={label} className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option.id === selectedId;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={isSelected}
              className={`rounded-md border px-3 py-2 font-sans text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isSelected
                  ? "border-accent bg-accent text-paper"
                  : "border-hairline bg-paper text-slate hover:border-accent hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * The revealed cell. Split out from the selector shell so that the exact
 * markup a reader sees can be rendered for any pillar/audience pair without
 * going through the selector state.
 */
export function CascadeCellView({
  cell,
  audience,
}: {
  cell: CascadeCell;
  audience: Audience;
}) {
  return (
    <div key={`${cell.pillarId}-${cell.audienceId}`} className="animate-cell">
      <p className="max-w-[65ch] font-mono text-xs leading-relaxed tracking-wide text-slate uppercase">
        {audience.who}
      </p>
      <p className="mt-2 max-w-[65ch] font-body text-sm leading-relaxed text-slate">
        {audience.cares}
      </p>

      <p className="mt-8 max-w-[65ch] font-sans text-2xl leading-snug font-semibold text-ink md:text-3xl">
        {cell.message}
      </p>

      <p className="mt-8 font-mono text-xs tracking-wide text-slate uppercase">
        {ui.proofLabel}
      </p>
      <p className="mt-3 max-w-[65ch] font-body text-base leading-relaxed text-ink">
        {cell.proof}
      </p>

      <p className="mt-8 font-mono text-xs tracking-wide text-slate uppercase">
        {ui.channelLabel}
      </p>
      <p className="mt-3 max-w-[65ch] font-body text-base leading-relaxed text-ink">
        {cell.channel}
      </p>

      <div className="mt-10 max-w-[65ch] rounded-md bg-accent-muted p-6">
        <p className="font-mono text-xs tracking-wide text-accent uppercase">
          {ui.doNotSayLabel}
        </p>
        <p className="mt-3 font-body text-base leading-relaxed text-ink">
          {cell.doNotSay}
        </p>
      </div>
    </div>
  );
}

export default function Cascade() {
  // Defaults come off the head of each array rather than a literal id, so the
  // component keeps working if the content order changes.
  const [selectedPillarId, setSelectedPillarId] = useState<Pillar["id"]>(
    pillars[0].id,
  );
  const [selectedAudienceId, setSelectedAudienceId] = useState<Audience["id"]>(
    audiences[0].id,
  );

  const audience = audiences.find((item) => item.id === selectedAudienceId);
  const cell = cascade.find(
    (item) =>
      item.pillarId === selectedPillarId && item.audienceId === selectedAudienceId,
  );

  return (
    <ScreenShell id="cascade" bg="paper">
      <Selector
        label={ui.pillarSelectorLabel}
        options={pillars.map((pillar) => ({ id: pillar.id, label: pillar.shorthand }))}
        selectedId={selectedPillarId}
        onSelect={setSelectedPillarId}
      />

      <div className="mt-8">
        <Selector
          label={ui.audienceSelectorLabel}
          options={audiences.map((item) => ({ id: item.id, label: item.label }))}
          selectedId={selectedAudienceId}
          onSelect={setSelectedAudienceId}
        />
      </div>

      {/* One cell at a time on every viewport. The min-height holds the page
          steady so stepping through combinations does not jump the scroll. */}
      <div
        aria-live="polite"
        className="mt-12 min-h-[30rem] border-t border-hairline pt-10 md:min-h-[26rem]"
      >
        {cell && audience ? <CascadeCellView cell={cell} audience={audience} /> : null}
      </div>
    </ScreenShell>
  );
}
