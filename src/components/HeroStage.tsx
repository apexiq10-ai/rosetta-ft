"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  audiences,
  cascade,
  collisions,
  heroStage,
  pillars,
  sources,
} from "@/src/content/content";
import { ui } from "@/src/content/ui";

// ---------------------------------------------------------------------------
// Timeline. The stage is a fixed 640 x 420 canvas scaled to its container, so
// every position below is in stage pixels. Each frame names the step it
// belongs to and how long it holds; sub-frames inside a step stage a click.
// ---------------------------------------------------------------------------

const W = 640;
const H = 420;
const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

type Frame = { phase: number; sub: number; ms: number };

const FRAMES: Frame[] = [
  { phase: 0, sub: 0, ms: 3200 },
  { phase: 1, sub: 0, ms: 3600 },
  { phase: 2, sub: 0, ms: 3400 },
  { phase: 3, sub: 0, ms: 900 },
  { phase: 3, sub: 1, ms: 3800 },
  { phase: 4, sub: 0, ms: 1000 },
  { phase: 4, sub: 1, ms: 900 },
  { phase: 4, sub: 2, ms: 4800 },
];

/** Before the first frame everything is offstage, so the entrance plays. */
const PRE: Frame = { phase: -1, sub: 0, ms: 0 };

const phaseMs = (phase: number) =>
  FRAMES.filter((f) => f.phase === phase).reduce((sum, f) => sum + f.ms, 0);
const firstFrameOf = (phase: number) => FRAMES.findIndex((f) => f.phase === phase);
const lastFrameOf = (phase: number) =>
  FRAMES.length - 1 - [...FRAMES].reverse().findIndex((f) => f.phase === phase);

/** With motion reduced the stage holds on the fully drawn cascade. */
const STATIC_FRAME = lastFrameOf(3);

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCED_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

const DOC_W = 172;
const DOC_H = 104;
const DOC_POS: Record<string, { x: number; y: number; r: number }> = {
  release: { x: 24, y: 26, r: -3 },
  social: { x: 64, y: 246, r: 2.5 },
  letter: { x: 234, y: 128, r: -1.5 },
  filing: { x: 436, y: 22, r: 2 },
  coverage: { x: 404, y: 252, r: -2.5 },
};

const CARD = { w: 284, h: 166 };
const CARD_POS = [
  { x: 24, y: 28 },
  { x: 332, y: 28 },
  { x: 24, y: 226 },
  { x: 332, y: 226 },
];
const TAB = { x: 24, w: 172, h: 50, top: 40, step: 60 };

const AUD = { x: 252, w: 364, h: 64, top: 18, step: 76 };

const BRIEF = { x: 36, y: 18, w: 568, h: 384 };
const BUTTON = { x: 170, y: 186, w: 300, h: 48 };

const CURSOR: Record<string, [number, number]> = {
  "-1": [600, 440],
  "0": [588, 392],
  "1": [212, 204],
  "2": [300, 118],
  "3": [112, 66],
  "4": [112, 66],
  "5": [330, 212],
  "6": [330, 212],
  "7": [128, 362],
};

const center = (id: string) => ({
  x: DOC_POS[id].x + DOC_W / 2,
  y: DOC_POS[id].y + DOC_H / 2,
});

function move(ms = 700, delay = 0): CSSProperties {
  return {
    transitionProperty:
      "left, top, width, height, opacity, transform, background-color, color, border-color",
    transitionDuration: `${ms}ms`,
    transitionTimingFunction: EASE,
    transitionDelay: `${delay}ms`,
  };
}

const citation = (id: string) => sources.findIndex((s) => s.id === id) + 1;

function Bar({ w, className = "" }: { w: string; className?: string }) {
  return <div className={`h-[5px] bg-hairline ${className}`} style={{ width: w }} />;
}

// ---------------------------------------------------------------------------
// Stage
// ---------------------------------------------------------------------------

export default function HeroStage() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const fitRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [visible, setVisible] = useState(true);
  const [frameIndex, setFrameIndex] = useState(-1);
  // Bumped on every loop and every manual jump, so the progress bar restarts.
  const [run, setRun] = useState(0);

  // Fit the fixed canvas to whatever width the column gives it.
  useEffect(() => {
    const node = fitRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / W);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Stop the clock while the hero is scrolled away or the tab is hidden.
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting && document.visibilityState === "visible"),
    );
    observer.observe(node);
    const onVisibility = () =>
      setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (reduced || !visible) return;
    const hold = frameIndex === -1 ? 450 : FRAMES[frameIndex].ms;
    const timer = window.setTimeout(() => {
      const next = (frameIndex + 1) % FRAMES.length;
      if (next === 0) setRun((r) => r + 1);
      setFrameIndex(next);
    }, hold);
    return () => window.clearTimeout(timer);
    // run is a dependency so that jumping to the step already showing
    // restarts its hold instead of letting the old timer cut it short.
  }, [frameIndex, run, reduced, visible]);

  const shownIndex = reduced && frameIndex === -1 ? STATIC_FRAME : frameIndex;
  const frame = shownIndex === -1 ? PRE : FRAMES[shownIndex];
  const { phase, sub } = frame;

  const jump = (target: number) => {
    setRun((r) => r + 1);
    setFrameIndex(reduced ? lastFrameOf(target) : firstFrameOf(target));
  };

  const rails = pillars[0];
  const [cx, cy] = CURSOR[String(shownIndex)];
  const clicking = (phase === 3 || phase === 4) && sub === 1;
  const docsOut = phase < 0 || phase >= 3;

  return (
    <div ref={rootRef} className="w-full">
      <div className="border border-paper/25 bg-paper shadow-[0_30px_80px_-20px_rgba(4,12,40,0.55)]">
        {/* Window chrome, kept at native size so it stays crisp. */}
        <div className="flex items-center gap-3 border-b border-hairline px-4 py-2.5">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-hairline" />
            <span className="h-2 w-2 rounded-full bg-hairline" />
            <span className="h-2 w-2 rounded-full bg-hairline" />
          </span>
          <span className="hidden truncate font-mono text-[11px] tracking-wide text-slate uppercase sm:inline">
            {heroStage.label}
          </span>
          <span className="ml-auto font-mono text-[11px] tracking-wide whitespace-nowrap text-accent uppercase">
            {phase >= 0
              ? `${String(phase + 1).padStart(2, "0")} ${heroStage.steps[phase].title}`
              : ""}
          </span>
        </div>

        <div
          ref={fitRef}
          aria-hidden="true"
          className="hero-dots relative w-full overflow-hidden"
          style={{ aspectRatio: `${W} / ${H}` }}
        >
          <div
            className="absolute top-0 left-0 origin-top-left"
            style={{
              width: W,
              height: H,
              transform: `scale(${scale ?? 1})`,
              visibility: scale === null ? "hidden" : "visible",
            }}
          >
            {/* ---- 01 / 02: sources, then the collisions between them ---- */}
            <svg
              className="absolute inset-0"
              width={W}
              height={H}
              viewBox={`0 0 ${W} ${H}`}
              fill="none"
            >
              {heroStage.collisionPairs.map((pair, i) => {
                const a = center(pair.from);
                const b = center(pair.to);
                return (
                  <line
                    key={pair.collisionId}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    className="hero-march stroke-collide"
                    style={{
                      ...move(500, phase === 1 ? 250 + i * 300 : 0),
                      opacity: phase === 1 ? 1 : 0,
                    }}
                  />
                );
              })}
            </svg>

            {heroStage.documents.map((doc, i) => {
              const pos = DOC_POS[doc.id];
              const colliding = heroStage.collisionPairs.some(
                (pair) => pair.from === doc.id || pair.to === doc.id,
              );
              const target = CARD_POS[i % CARD_POS.length];
              let style: CSSProperties;
              if (phase === 2) {
                style = {
                  left: target.x + CARD.w / 2 - DOC_W / 2,
                  top: target.y + CARD.h / 2 - DOC_H / 2,
                  opacity: 0,
                  transform: "scale(0.45) rotate(0deg)",
                  ...move(650, i * 60),
                };
              } else if (docsOut) {
                style = {
                  left: pos.x,
                  top: pos.y,
                  opacity: 0,
                  transform: `translateY(26px) rotate(${pos.r}deg)`,
                  ...move(phase < 0 ? 0 : 400),
                };
              } else {
                style = {
                  left: pos.x,
                  top: pos.y,
                  opacity: phase === 1 && !colliding ? 0.4 : 1,
                  transform: `rotate(${pos.r}deg)`,
                  ...move(700, phase === 0 ? 120 + i * 130 : 0),
                };
              }
              const hot = phase === 1 && colliding;
              return (
                <div
                  key={doc.id}
                  className="absolute border border-hairline bg-paper p-3 shadow-[0_8px_24px_-12px_rgba(14,17,22,0.35)]"
                  style={{ width: DOC_W, height: DOC_H, ...style }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] tracking-wide text-slate uppercase">
                      {doc.label}
                    </span>
                    <span className="bg-accent-muted px-1 font-mono text-[10px] text-accent">
                      [{citation(doc.sourceId)}]
                    </span>
                  </div>
                  <Bar w="100%" className="mt-2.5" />
                  <p className="mt-2 font-body text-[12px] leading-snug text-ink">
                    <span
                      className="box-decoration-clone px-0.5"
                      style={{
                        ...move(400, hot ? 200 : 0),
                        backgroundColor: hot
                          ? "color-mix(in oklab, var(--color-collide) 16%, transparent)"
                          : "transparent",
                        color: hot ? "var(--color-collide)" : undefined,
                      }}
                    >
                      {doc.phrase}
                    </span>
                  </p>
                  <Bar w="62%" className="mt-2" />
                </div>
              );
            })}

            {heroStage.collisionPairs.map((pair, i) => {
              const a = center(pair.from);
              const b = center(pair.to);
              const collision = collisions.find((c) => c.id === pair.collisionId);
              if (!collision) return null;
              return (
                <div
                  key={pair.collisionId}
                  className="absolute w-[172px] border border-collide bg-paper px-3 py-2"
                  style={{
                    left: (a.x + b.x) / 2 - 86,
                    top: (a.y + b.y) / 2 - 26,
                    opacity: phase === 1 ? 1 : 0,
                    transform: phase === 1 ? "none" : "scale(0.9)",
                    ...move(450, phase === 1 ? 600 + i * 300 : 0),
                  }}
                >
                  <p className="font-mono text-[9px] tracking-wide text-collide uppercase">
                    {heroStage.collisionLabel} {String(collision.index).padStart(2, "0")}
                  </p>
                  <p className="mt-1 font-sans text-[12px] leading-tight font-semibold text-ink">
                    {collision.title}
                  </p>
                </div>
              );
            })}

            <p
              className="absolute left-0 w-full text-center font-mono text-[10px] tracking-wide text-slate uppercase"
              style={{
                top: 392,
                opacity: phase === 0 || phase === 1 ? 1 : 0,
                ...move(400, phase === 0 ? 900 : 0),
              }}
            >
              {heroStage.storiesLabel}
            </p>

            {/* ---- 03 / 04: pillar cards that fold into the canvas tabs ---- */}
            {pillars.map((pillar, i) => {
              const asTab = phase >= 3;
              const selected = asTab && i === 0 && (phase > 3 || sub >= 1);
              const slot = asTab
                ? { x: TAB.x, y: TAB.top + i * TAB.step, w: TAB.w, h: TAB.h }
                : { x: CARD_POS[i].x, y: CARD_POS[i].y, w: CARD.w, h: CARD.h };
              const shown = phase === 2 || phase === 3;
              let delay = 0;
              if (phase === 2) delay = 300 + i * 110;
              if (phase === 3 && sub === 0) delay = i * 50;
              return (
                <div
                  key={pillar.id}
                  className={`absolute overflow-hidden border p-3.5 ${
                    selected
                      ? "border-accent bg-accent text-paper"
                      : "border-hairline bg-paper text-ink"
                  }`}
                  style={{
                    left: slot.x,
                    top: slot.y,
                    width: slot.w,
                    height: slot.h,
                    opacity: shown ? 1 : 0,
                    transform: shown ? "none" : "translateY(12px)",
                    boxShadow: asTab ? "none" : "0 10px 30px -18px rgba(14,17,22,0.4)",
                    ...move(phase === 4 ? 350 : 650, delay),
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-1.5 py-0.5 font-mono text-[10px] tracking-wide uppercase ${
                        selected ? "bg-paper/15 text-paper" : "bg-accent-muted text-accent"
                      }`}
                    >
                      {pillar.shorthand}
                    </span>
                    <span
                      className={`font-mono text-[10px] ${selected ? "text-paper/70" : "text-slate"}`}
                    >
                      {String(pillar.index).padStart(2, "0")} / {String(pillars.length).padStart(2, "0")}
                    </span>
                  </div>
                  <div style={{ opacity: asTab ? 0 : 1, ...move(300) }}>
                    <p className="mt-4 font-sans text-[21px] leading-tight font-semibold">
                      {pillar.statement}
                    </p>
                    <Bar w="92%" className="mt-4" />
                    <Bar w="70%" className="mt-2" />
                    <div className="mt-4 flex gap-1">
                      {pillar.sourceIds.map((id) => (
                        <span
                          key={id}
                          className="border border-hairline bg-accent-muted px-1 font-mono text-[10px] text-accent"
                        >
                          [{citation(id)}]
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            <svg
              className="absolute inset-0"
              width={W}
              height={H}
              viewBox={`0 0 ${W} ${H}`}
              fill="none"
            >
              {heroStage.cascadeLines.map((line, i) => {
                const x1 = TAB.x + TAB.w;
                const y1 = TAB.top + TAB.h / 2;
                const y2 = AUD.top + i * AUD.step + AUD.h / 2;
                const on = phase === 3 && sub === 1;
                return (
                  <path
                    key={line.audienceId}
                    d={`M${x1} ${y1} C ${x1 + 34} ${y1}, ${AUD.x - 34} ${y2}, ${AUD.x} ${y2}`}
                    pathLength={1}
                    strokeDasharray="1"
                    strokeWidth={1.5}
                    className="stroke-accent"
                    style={{
                      strokeDashoffset: on ? 0 : 1,
                      opacity: on ? 1 : 0,
                      transitionProperty: "stroke-dashoffset, opacity",
                      transitionDuration: on ? "600ms" : "250ms",
                      transitionTimingFunction: EASE,
                      transitionDelay: on ? `${120 + i * 140}ms` : "0ms",
                    }}
                  />
                );
              })}
            </svg>

            {heroStage.cascadeLines.map((line, i) => {
              const audience = audiences.find((a) => a.id === line.audienceId);
              const hasCell = cascade.some(
                (c) => c.pillarId === rails.id && c.audienceId === line.audienceId,
              );
              if (!audience || !hasCell) return null;
              const on = phase === 3 && sub === 1;
              return (
                <div
                  key={line.audienceId}
                  className="absolute border border-hairline bg-paper px-3.5 py-2.5"
                  style={{
                    left: AUD.x,
                    top: AUD.top + i * AUD.step,
                    width: AUD.w,
                    height: AUD.h,
                    opacity: on ? 1 : 0,
                    transform: on ? "none" : "translateX(16px)",
                    ...move(on ? 550 : 300, on ? 300 + i * 140 : 0),
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-sans text-[12.5px] font-semibold text-ink">
                      {audience.label}
                    </span>
                    <span className="flex items-center gap-1.5 bg-accent-muted px-1.5 py-0.5">
                      <span className="font-mono text-[8.5px] tracking-wide text-accent uppercase">
                        {ui.doNotSayLabel}
                      </span>
                      <span className="relative font-body text-[11px] text-ink">
                        {line.avoid}
                        <span
                          className="absolute top-1/2 left-0 h-[1.5px] bg-collide"
                          style={{
                            width: on ? "100%" : "0%",
                            transitionProperty: "width",
                            transitionDuration: "350ms",
                            transitionTimingFunction: EASE,
                            transitionDelay: on ? `${1000 + i * 140}ms` : "0ms",
                          }}
                        />
                      </span>
                    </span>
                  </div>
                  <p className="mt-1.5 font-body text-[12px] text-slate">{line.message}</p>
                </div>
              );
            })}

            {/* ---- 05: the brief, generated on demand ---- */}
            <div
              className={`absolute flex items-center justify-center bg-generate font-sans text-[13px] font-semibold text-paper ${
                phase === 4 && sub === 1 ? "hero-press" : ""
              }`}
              style={{
                left: BUTTON.x,
                top: BUTTON.y,
                width: BUTTON.w,
                height: BUTTON.h,
                opacity: phase === 4 && sub < 2 ? 1 : 0,
                transform: phase === 4 && sub < 2 ? "none" : "translateY(10px)",
                ...move(400, phase === 4 && sub === 0 ? 200 : 0),
              }}
            >
              {phase === 4 && sub >= 1 ? (
                <span>
                  {ui.thinking}
                  <span className="hero-dot">.</span>
                  <span className="hero-dot [animation-delay:150ms]">.</span>
                  <span className="hero-dot [animation-delay:300ms]">.</span>
                </span>
              ) : (
                `${ui.generateBrief} - ${rails.shorthand}`
              )}
            </div>

            <BriefCard on={phase === 4 && sub === 2} title={`${rails.shorthand} ${ui.playTitleSuffix}`} />

            {/* The cursor, standing in for the reader driving the canvas. */}
            <div
              className="absolute z-10"
              style={{
                left: cx,
                top: cy,
                opacity: phase < 0 ? 0 : 1,
                ...move(850),
              }}
            >
              {clicking ? (
                <span
                  key={`${run}-${shownIndex}`}
                  className="hero-ping absolute top-0 left-0 h-7 w-7 rounded-full border-2 border-accent"
                />
              ) : null}
              <svg width="20" height="22" viewBox="0 0 20 22" className="drop-shadow-sm">
                <path
                  d="M2 1.5v16.2l4.3-4.1 2.9 6.7 3-1.3-2.9-6.6h6.1z"
                  className="fill-ink stroke-paper"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Stepper: doubles as the legend and as a way to scrub the loop. */}
        <div className="grid grid-cols-5 border-t border-hairline">
          {heroStage.steps.map((step, i) => {
            const state = phase > i ? "done" : phase === i ? "active" : "todo";
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => jump(i)}
                aria-current={state === "active" ? "step" : undefined}
                className={`group flex flex-col items-start gap-1 px-2 pt-3 pb-3 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent sm:px-4 ${
                  i > 0 ? "border-l border-hairline" : ""
                } ${state === "active" ? "bg-canvas" : "bg-paper hover:bg-canvas"}`}
              >
                <span className="relative mb-1.5 block h-0.5 w-full overflow-hidden bg-hairline">
                  {state !== "todo" ? (
                    <span
                      key={state === "active" ? `${run}-${i}` : "done"}
                      className={`absolute inset-0 origin-left bg-accent ${
                        state === "active" && !reduced ? "hero-fill" : ""
                      }`}
                      style={
                        state === "active" && !reduced
                          ? {
                              animationDuration: `${phaseMs(i)}ms`,
                              animationPlayState: visible ? "running" : "paused",
                            }
                          : undefined
                      }
                    />
                  ) : null}
                </span>
                <span
                  className={`font-mono text-[10px] tracking-wide ${
                    state === "todo" ? "text-slate" : "text-accent"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-sans text-xs font-semibold text-ink sm:text-sm">
                  {step.title}
                </span>
                <span className="hidden font-body text-xs leading-snug text-slate xl:block">
                  {step.detail}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BriefCard({ on, title }: { on: boolean; title: string }) {
  const words = heroStage.briefInsight.split(" ");
  const sequence = heroStage.playSequence.flatMap((id) =>
    audiences.filter((audience) => audience.id === id),
  );
  const openingSeat = sequence[0]?.label ?? "";
  const reveal = (delay: number): CSSProperties => ({
    opacity: on ? 1 : 0,
    transform: on ? "none" : "translateY(6px)",
    ...move(450, on ? delay : 0),
  });

  const column = (label: string, body: ReactNode, surface: string, delay: number) => (
    <div className={`${surface} p-3`} style={reveal(delay)}>
      <p className="font-sans text-[11px] font-semibold text-ink">{label}</p>
      <div className="mt-2">{body}</div>
    </div>
  );

  return (
    <div
      className="absolute flex flex-col border border-hairline bg-paper p-6 shadow-[0_20px_50px_-24px_rgba(14,17,22,0.45)]"
      style={{
        left: BRIEF.x,
        top: BRIEF.y,
        width: BRIEF.w,
        height: BRIEF.h,
        opacity: on ? 1 : 0,
        transform: on ? "none" : "translateY(24px)",
        ...move(on ? 600 : 350),
      }}
    >
      <p className="font-sans text-[19px] leading-tight font-semibold text-ink">{title}</p>
      <p className="mt-3 border-t-2 border-accent pt-3 font-body text-[13px] leading-[1.5] text-ink">
        {words.map((word, i) => (
          <span
            key={i}
            style={{
              opacity: on ? 1 : 0,
              transitionProperty: "opacity",
              transitionDuration: "200ms",
              transitionDelay: on ? `${350 + i * 38}ms` : "0ms",
            }}
          >
            {word}{" "}
          </span>
        ))}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-px bg-hairline">
        {column(
          ui.playEntryLabel,
          <p className="font-body text-[11px] leading-snug text-slate">{openingSeat}</p>,
          "bg-paper",
          1500,
        )}
        {column(ui.playDiscoveryLabel, <><Bar w="92%" /><Bar w="66%" className="mt-1.5" /></>, "bg-canvas", 1600)}
        {column(ui.playObjectionsLabel, <><Bar w="88%" /><Bar w="60%" className="mt-1.5" /></>, "bg-shade", 1700)}
      </div>

      {/* The sequence, in order: the part of the play the canvas cannot show. */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {sequence.map((audience, i) => (
          <span
            key={audience.id}
            className="border border-hairline px-1.5 py-0.5 font-mono text-[9px] tracking-wide text-slate uppercase"
            style={reveal(1900 + i * 90)}
          >
            <span className="text-accent">{String(i + 1).padStart(2, "0")}</span> {audience.label}
          </span>
        ))}
      </div>

      <div className="mt-auto flex gap-3" style={reveal(2500)}>
        <span className="border border-accent bg-accent px-4 py-2 font-sans text-[11px] font-semibold text-paper">
          {ui.downloadBriefPdf}
        </span>
        <span className="border border-ink px-4 py-2 font-sans text-[11px] font-semibold text-ink">
          {ui.emailCanvas}
        </span>
      </div>
    </div>
  );
}
