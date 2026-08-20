"use client";

import { useRef, useState } from "react";
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

const CELL = "bg-paper p-6";

function PersonaColumn({ audience, cell }: { audience: Audience; cell: CascadeCell }) {
  // A cell with nothing to cite is making no claim, which is what the suppress
  // state is. Derived from the data rather than named in code.
  const suppressed = cell.sourceIds.length === 0;

  return (
    <div
      className={`grid w-full snap-start grid-rows-subgrid row-span-6 gap-px ${
        suppressed ? "opacity-60" : ""
      }`}
    >
      <div className={CELL}>
        <h3 className="font-sans text-2xl leading-tight font-semibold text-ink">
          {audience.label}
        </h3>
      </div>
      <div className={CELL}>
        <p className="font-body text-sm leading-relaxed text-slate">{audience.who}</p>
      </div>
      <div className={CELL}>
        <p className="font-body text-base leading-relaxed text-ink">{cell.message}</p>
      </div>
      <div className={CELL}>
        <p className="font-body text-sm leading-relaxed text-slate">
          {cell.proof}
          {cell.sourceIds.length > 0 ? (
            <SourceChip sourceIds={cell.sourceIds} className="ml-2 align-middle" />
          ) : null}
        </p>
      </div>
      <div className={CELL}>
        <p className="font-body text-sm leading-relaxed text-slate">{cell.channel}</p>
      </div>
      <div className="bg-accent-muted p-6">
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
  const [busy, setBusy] = useState(false);
  const captureRef = useRef<HTMLDivElement | null>(null);
  const pillar = pillars.find((item) => item.id === selectedPillarId) ?? pillars[0];

  const why = firstSentence(pillar.body);

  // Stepped left to right so the row reads as a sequence rather than a tint.
  const hero: { label: string; value: string; surface: string }[] = [
    { label: ui.whyLabel, value: why, surface: "bg-paper" },
    { label: ui.whatLabel, value: pillar.statement, surface: "bg-canvas" },
    { label: ui.howLabel, value: pillar.proof, surface: "bg-shade" },
  ];

  const downloadPdf = async () => {
    const node = captureRef.current;
    if (!node || busy) return;
    setBusy(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#ffffff" });
      // JPEG rather than PNG: a lossless capture of this page runs to tens of
      // megabytes, which defeats the point of a document meant to be emailed.
      const image = canvas.toDataURL("image/jpeg", 0.92);
      const landscape = canvas.width >= canvas.height;
      const pdf = new jsPDF({
        orientation: landscape ? "landscape" : "portrait",
        unit: "pt",
        format: "a4",
      });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 24;
      const fit = Math.min(
        (pageW - margin * 2) / canvas.width,
        (pageH - margin * 2) / canvas.height,
      );
      const w = canvas.width * fit;
      const h = canvas.height * fit;
      pdf.addImage(
        image,
        "JPEG",
        (pageW - w) / 2,
        (pageH - h) / 2,
        w,
        h,
      );
      pdf.save(`rosetta-messaging-canvas-${pillar.id}.pdf`);
    } finally {
      setBusy(false);
    }
  };

  // A mailto cannot carry an attachment, so the body says so rather than
  // pretending otherwise.
  const mailto = `mailto:?subject=${encodeURIComponent(
    `${ui.emailSubject} - ${pillar.shorthand}`,
  )}&body=${encodeURIComponent(
    [
      `${ui.whyLabel}: ${why}`,
      `${ui.whatLabel}: ${pillar.statement}`,
      `${ui.howLabel}: ${pillar.proof}`,
      "",
      ui.emailAttachReminder,
    ].join("\n"),
  )}`;

  return (
    <ScreenShell id="cascade" bg="paper">
      <h2 className="max-w-4xl font-sans text-3xl leading-tight font-semibold text-ink md:text-4xl">
        {cascadeIntro.heading}
      </h2>
      <p className="mt-4 font-body text-base leading-relaxed text-slate md:text-lg">
        {cascadeIntro.standfirst}
      </p>

      <div ref={captureRef} className="mt-10 bg-paper">
        {/* Choosing a pillar is the only interaction on this screen. */}
        <div
          role="tablist"
          aria-label={ui.pillarSelectorLabel}
          className="flex gap-px overflow-x-auto border border-hairline bg-hairline [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                  ? "bg-shade text-accent"
                  : "bg-paper text-slate hover:text-ink"
              }`}
            >
              {item.shorthand}
            </button>
          ))}
        </div>

        <div className="mt-px grid gap-px border-x border-b border-hairline bg-hairline md:grid-cols-3">
          {hero.map((item) => (
            <div key={item.label} className={`${item.surface} p-6 md:p-8`}>
              <h3 className="font-sans text-lg leading-tight font-semibold text-ink">
                {item.label}
              </h3>
              <p className="mt-4 font-body text-base leading-relaxed text-slate">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* One grid for all five personas: each field type is its own row track,
            so a long bullet in one column sets the height of that row in every
            column instead of pushing its own column out of step. */}
        <div className="mt-10 snap-x snap-mandatory overflow-x-auto border border-hairline [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="grid grid-cols-[repeat(5,minmax(15rem,1fr))] grid-rows-[auto_auto_auto_auto_auto_auto] gap-px bg-hairline">
            {audiences.map((audience) => {
              const cell = cascade.find(
                (item) => item.pillarId === pillar.id && item.audienceId === audience.id,
              );
              if (!cell) return null;
              return <PersonaColumn key={audience.id} audience={audience} cell={cell} />;
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={downloadPdf}
          disabled={busy}
          className="border border-accent bg-accent px-6 py-3 font-sans text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {ui.downloadPdf}
        </button>
        <a
          href={mailto}
          className="border border-ink px-6 py-3 font-sans text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {ui.emailCanvas}
        </a>
      </div>
    </ScreenShell>
  );
}
