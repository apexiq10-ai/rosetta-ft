import ScreenShell from "../ScreenShell";
import { masterNarrative } from "@/src/content/content";

export default function MasterNarrative() {
  return (
    <ScreenShell id="narrative" className="relative">
      <p className="font-mono text-xs tracking-wide text-accent uppercase">
        {masterNarrative.eyebrow}
      </p>

      <h1 className="mt-8 max-w-4xl font-serif text-4xl leading-tight text-ink md:text-6xl">
        {masterNarrative.statement}
      </h1>

      <p className="mt-8 max-w-[65ch] font-body text-base leading-relaxed text-slate md:text-lg">
        {masterNarrative.subhead}
      </p>

      <div className="animate-cue absolute bottom-24 left-6 flex items-center gap-2 md:left-12">
        <span className="font-mono text-xs tracking-wide text-slate uppercase">
          {masterNarrative.scrollCue}
        </span>
        <svg
          viewBox="0 0 12 8"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-2 w-3 text-slate"
        >
          <path d="M1 1l5 5 5-5" />
        </svg>
      </div>
    </ScreenShell>
  );
}
