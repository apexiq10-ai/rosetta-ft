import ScreenShell from "../ScreenShell";
import { masterNarrative } from "@/src/content/content";

/** Thin structural divider, drawn in as part of the entrance sequence. */
function Rule({ step }: { step: string }) {
  return (
    <hr
      aria-hidden="true"
      className={`animate-enter-rule h-px w-full border-0 bg-paper/30 ${step}`}
    />
  );
}

export default function MasterNarrative() {
  return (
    <ScreenShell id="narrative" bg="accent" fill>
      {/* One gap value throughout, so the rhythm is the layout rather than a
          margin decided separately on each element. */}
      <div className="flex flex-col gap-8">
        <p className="animate-enter font-mono text-xs tracking-wide text-paper uppercase">
          {masterNarrative.eyebrow}
        </p>

        <Rule step="enter-step-2" />

        {/* Two voices in one headline: the name in the display serif, the
            claim in the sans that carries every other heading. */}
        <h1 className="animate-enter enter-step-2 max-w-4xl text-4xl leading-tight md:text-6xl">
          <span className="font-serif text-black">
            {masterNarrative.statementLead}
          </span>{" "}
          <span className="font-sans font-semibold text-paper">
            {masterNarrative.statementRest}
          </span>
        </h1>

        <Rule step="enter-step-3" />

        <p className="animate-enter enter-step-3 max-w-[65ch] font-body text-base leading-relaxed text-paper md:text-lg">
          {masterNarrative.subhead}
        </p>

        <div className="animate-cue flex items-center gap-2">
          <span className="font-mono text-xs tracking-wide text-paper uppercase">
            {masterNarrative.scrollCue}
          </span>
          <svg
            viewBox="0 0 12 8"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-2 w-3 text-paper"
          >
            <path d="M1 1l5 5 5-5" />
          </svg>
        </div>
      </div>
    </ScreenShell>
  );
}
