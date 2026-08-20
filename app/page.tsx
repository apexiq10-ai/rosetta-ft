import ScreenShell from "@/src/components/ScreenShell";
import SourceChip from "@/src/components/SourceChip";
import { argument, masterNarrative } from "@/src/content/content";

export default function Home() {
  return (
    <main className="h-dvh snap-y snap-proximity overflow-y-auto overscroll-y-none">
      <ScreenShell>
        <p className="font-mono text-xs tracking-wide text-accent uppercase">
          {masterNarrative.eyebrow}
        </p>
        <h1 className="mt-6 max-w-4xl font-serif text-4xl leading-tight text-ink md:text-6xl">
          {masterNarrative.statement}
        </h1>
        <p className="mt-8 max-w-[65ch] font-body text-base leading-relaxed text-slate md:text-lg">
          {masterNarrative.subhead}
        </p>
      </ScreenShell>

      <ScreenShell bg="paper">
        <h2 className="font-sans text-3xl font-semibold text-ink md:text-4xl">
          {argument.heading}
        </h2>
        <SourceChip sourceIds={argument.sourceIds} className="mt-8" />
      </ScreenShell>
    </main>
  );
}
