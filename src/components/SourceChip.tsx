"use client";

import { sources } from "@/src/content/content";
import { ui } from "@/src/content/ui";
import { useSourceDrawer } from "./SourceDrawer";

type SourceChipProps = {
  sourceIds: string[];
  className?: string;
};

/**
 * Renders one numbered chip per source id. The number is the position of the
 * source in the sources array, so citations stay stable if the array grows.
 */
export default function SourceChip({ sourceIds, className = "" }: SourceChipProps) {
  const { openSource, openSourceId } = useSourceDrawer();

  return (
    <span className={`inline-flex flex-wrap items-center gap-1.5 ${className}`}>
      {sourceIds.map((id) => {
        const index = sources.findIndex((item) => item.id === id);
        if (index === -1) return null;
        const source = sources[index];

        return (
          <button
            key={id}
            type="button"
            onClick={() => openSource(id)}
            aria-haspopup="dialog"
            aria-expanded={openSourceId === id}
            aria-label={`${ui.sourceChipLabel} ${index + 1}. ${source.publisher}`}
            className="rounded-md border border-hairline bg-accent-muted px-1.5 py-0.5 font-mono text-xs tracking-wide text-accent transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            [{index + 1}]
          </button>
        );
      })}
    </span>
  );
}
