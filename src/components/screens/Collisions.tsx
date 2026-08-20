import ScreenShell from "../ScreenShell";
import SourceChip from "../SourceChip";
import { collisions, collisionsIntro, type Collision } from "@/src/content/content";
import { ui } from "@/src/content/ui";

const pad = (value: number) => String(value).padStart(2, "0");

type CollisionBodyProps = {
  collision: Collision;
  total: number;
  variant: "screen" | "card";
};

/**
 * One collision, rendered identically on both viewports apart from type scale.
 * The visual job here is to keep the problem and the resolution legible as two
 * separate things: everything above the resolution block states the tension,
 * the tinted block answers it.
 */
function CollisionBody({ collision, total, variant }: CollisionBodyProps) {
  const isScreen = variant === "screen";

  return (
    <>
      <p className="font-mono text-xs tracking-wide text-slate uppercase">
        {pad(collision.index)} / {pad(total)}
      </p>

      <h3
        className={`mt-6 font-sans leading-tight font-semibold text-ink ${
          isScreen ? "text-3xl md:text-4xl" : "text-3xl"
        }`}
      >
        {collision.title}
      </h3>

      <p className="mt-6 max-w-[65ch] font-body text-base leading-relaxed text-slate md:text-lg">
        {collision.tension}
      </p>

      <p className="mt-8 font-mono text-xs tracking-wide text-slate uppercase">
        {ui.evidenceLabel}
      </p>
      <ul className="mt-3 max-w-[65ch] space-y-2">
        {collision.evidence.map((item, index) => (
          <li
            key={index}
            className="flex gap-3 font-mono text-xs leading-relaxed text-ink"
          >
            <span aria-hidden="true" className="text-slate">
              {pad(index + 1)}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <p className="mt-8 font-mono text-xs tracking-wide text-slate uppercase">
        {ui.costLabel}
      </p>
      <p className="mt-3 max-w-[65ch] border-l-2 border-accent pl-4 font-body text-base leading-relaxed text-ink">
        {collision.cost}
      </p>

      <div className="mt-8 max-w-[65ch] rounded-md bg-accent-muted p-6">
        <p className="font-mono text-xs tracking-wide text-accent uppercase">
          {ui.resolutionLabel}
        </p>
        <p className="mt-3 font-body text-base leading-relaxed text-ink">
          {collision.resolution}
        </p>
      </div>

      <SourceChip sourceIds={collision.sourceIds} className="mt-6" />
    </>
  );
}

export default function Collisions() {
  const total = collisions.length;

  return (
    <>
      <ScreenShell id="collisions" bg="shade">
        <h2 className="max-w-3xl font-sans text-3xl leading-tight font-semibold text-ink md:text-4xl">
          {collisionsIntro.heading}
        </h2>
        <p className="mt-8 max-w-[65ch] font-body text-base leading-relaxed text-slate md:text-lg">
          {collisionsIntro.standfirst}
        </p>
      </ScreenShell>

      {/* Mobile: one collision per full-viewport screen, same sequence pattern
          as the pillars so the reader keeps the same wayfinding. */}
      {collisions.map((collision) => (
        <ScreenShell
          key={collision.id}
          id={`collision-${collision.id}`}
          bg="shade"
          fill
          className="md:hidden"
        >
          <CollisionBody collision={collision} total={total} variant="screen" />
        </ScreenShell>
      ))}

      {/* Desktop: stacked full width, never side by side. These need the
          reading room more than they need density. */}
      <ScreenShell id="collisions-detail" bg="shade" className="hidden md:flex">
        <div className="space-y-8">
          {collisions.map((collision) => (
            <article
              key={collision.id}
              className="rounded-md border border-hairline bg-paper p-10 shadow-sm"
            >
              <CollisionBody collision={collision} total={total} variant="card" />
            </article>
          ))}
        </div>
      </ScreenShell>
    </>
  );
}
