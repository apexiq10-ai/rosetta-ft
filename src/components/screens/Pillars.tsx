import ScreenShell from "../ScreenShell";
import SourceChip from "../SourceChip";
import { pillars, pillarsIntro, type Pillar } from "@/src/content/content";

const pad = (value: number) => String(value).padStart(2, "0");

type PillarBodyProps = {
  pillar: Pillar;
  variant: "screen" | "card";
};

function SectionHeader() {
  return (
    <div className="mb-10">
      <h2 className="max-w-4xl font-sans text-3xl leading-tight font-semibold text-ink md:text-4xl">
        {pillarsIntro.heading}
      </h2>
      <p className="mt-4 font-body text-base leading-relaxed text-slate md:text-lg">
        {pillarsIntro.standfirst}
      </p>
    </div>
  );
}

function PillarBody({ pillar, variant }: PillarBodyProps) {
  const isScreen = variant === "screen";
  // Cards carry the same content at a tighter rhythm so all four pillars fit
  // one viewport on desktop without scrolling.
  const gap = isScreen ? "mt-6" : "mt-4";

  return (
    <>
      <span className="inline-block bg-accent-muted px-2 py-1 font-mono text-xs tracking-wide text-accent uppercase">
        {pillar.shorthand}
      </span>

      <h3
        className={`${gap} font-sans leading-tight font-semibold text-ink ${
          isScreen ? "text-3xl md:text-4xl" : "text-2xl"
        }`}
      >
        {pillar.statement}
      </h3>

      <p
        className={`${gap} max-w-[65ch] font-body leading-relaxed text-slate ${
          isScreen ? "text-base md:text-lg" : "text-sm"
        }`}
      >
        {pillar.body}
      </p>

      <p
        className={`${gap} max-w-[65ch] border-l-2 border-hairline pl-4 font-body leading-relaxed text-ink ${
          isScreen ? "text-sm" : "text-xs"
        }`}
      >
        {pillar.proof}
      </p>

      <SourceChip sourceIds={pillar.sourceIds} className={gap} />
    </>
  );
}

export default function Pillars() {
  const total = pillars.length;

  return (
    <>
      {/* Mobile: one pillar per full-viewport screen, with a running index so
          the reader always knows where they are in the sequence. The fill here
          is deliberate and is the exception to the content-sized default: the
          swipe-through sequence is the affordance, not dead space. */}
      {pillars.map((pillar, position) => (
        <ScreenShell key={pillar.id} id={`pillar-${pillar.id}`} fill className="md:hidden">
          {position === 0 ? <SectionHeader /> : null}
          {/* Same chrome as the desktop card: mobile was rendering the body
              straight onto the canvas with no border, surface or padding. */}
          <article className="border border-hairline bg-paper p-6 shadow-sm">
            <p className="font-mono text-xs tracking-wide text-slate uppercase">
              {pad(pillar.index)} / {pad(total)}
            </p>
            <div className="mt-6">
              <PillarBody pillar={pillar} variant="screen" />
            </div>
          </article>
        </ScreenShell>
      ))}

      {/* Desktop: all four at once, two up. */}
      <ScreenShell id="pillars" className="hidden md:flex">
        <SectionHeader />
        <div className="grid grid-cols-2 gap-6">
          {pillars.map((pillar) => (
            <article
              key={pillar.id}
              className="border border-hairline bg-paper p-6 shadow-sm"
            >
              <p className="font-mono text-xs tracking-wide text-slate uppercase">
                {pad(pillar.index)} / {pad(total)}
              </p>
              <div className="mt-4">
                <PillarBody pillar={pillar} variant="card" />
              </div>
            </article>
          ))}
        </div>
      </ScreenShell>
    </>
  );
}
