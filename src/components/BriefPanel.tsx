"use client";

import { useState, type ReactNode } from "react";
import SourceChip from "./SourceChip";
import {
  sources,
  type Pillar,
  type StrategicBrief,
} from "@/src/content/content";
import { ui } from "@/src/content/ui";

const PRIMARY =
  "border border-accent bg-accent px-6 py-3 font-sans text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const GENERATE =
  "border border-generate bg-generate px-6 py-3 font-sans text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const SECONDARY =
  "border border-ink px-6 py-3 font-sans text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/** Citation numbers are the position in the sources array, as everywhere else. */
function citationNumbers(sourceIds: string[]) {
  return sourceIds
    .map((id) => sources.findIndex((item) => item.id === id) + 1)
    .filter((index) => index > 0);
}

function briefAsText(brief: StrategicBrief) {
  const lines = [
    brief.title,
    "",
    `${ui.audienceInsightLabel}: ${brief.audienceInsight}`,
    "",
    `${ui.whyLabel}: ${brief.why}`,
    `${ui.whatLabel}: ${brief.what}`,
    `${ui.howLabel}: ${brief.how}`,
    "",
  ];
  brief.treatments.forEach((treatment) => {
    const cites = citationNumbers(treatment.sourceIds);
    lines.push(
      treatment.audienceLabel,
      `  ${treatment.message}`,
      `  ${ui.proofLabel}: ${treatment.proof}${
        cites.length ? ` [${cites.join("] [")}]` : ""
      }`,
      `  ${ui.channelLabel}: ${treatment.channel}`,
      `  ${ui.doNotSayLabel}: ${treatment.doNotSay}`,
      "",
    );
  });
  return lines.join("\n");
}

export default function BriefPanel({
  pillar,
  actions,
}: {
  pillar: Pillar;
  actions?: ReactNode;
}) {
  const [briefs, setBriefs] = useState<Record<string, StrategicBrief>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [failure, setFailure] = useState<{ id: string; message: string } | null>(null);

  const brief = briefs[pillar.id];
  const status: "idle" | "loading" | "success" | "error" =
    loadingId === pillar.id
      ? "loading"
      : brief
        ? "success"
        : failure?.id === pillar.id
          ? "error"
          : "idle";

  const generate = async () => {
    if (status === "loading" || brief) return;
    setLoadingId(pillar.id);
    setFailure(null);
    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pillarId: pillar.id }),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        const message =
          (data as { error?: string })?.error ?? "Could not generate the brief.";
        setFailure({ id: pillar.id, message });
        return;
      }
      setBriefs((current) => ({ ...current, [pillar.id]: data as StrategicBrief }));
    } catch {
      setFailure({ id: pillar.id, message: "Could not reach the brief service." });
    } finally {
      setLoadingId(null);
    }
  };

  // Typeset with jsPDF rather than captured as an image: this is structured
  // text and deserves selectable, searchable output.
  const downloadPdf = async () => {
    if (!brief) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 48;
    const width = pageW - margin * 2;
    let y = margin;

    const write = (
      text: string,
      size: number,
      style: "bold" | "normal",
      gapAfter: number,
      indent = 0,
    ) => {
      doc.setFont("helvetica", style);
      doc.setFontSize(size);
      const lines: string[] = doc.splitTextToSize(text, width - indent);
      const lineHeight = size * 1.35;
      lines.forEach((line) => {
        if (y + lineHeight > pageH - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin + indent, y);
        y += lineHeight;
      });
      y += gapAfter;
    };

    write(brief.title, 20, "bold", 6);
    write(new Date(brief.generatedAt).toUTCString(), 9, "normal", 18);

    write(ui.audienceInsightLabel, 12, "bold", 4);
    write(brief.audienceInsight, 11, "normal", 20);

    ([
      [ui.whyLabel, brief.why],
      [ui.whatLabel, brief.what],
      [ui.howLabel, brief.how],
    ] as const).forEach(([label, value]) => {
      write(label, 12, "bold", 4);
      write(value, 10, "normal", 14);
    });

    brief.treatments.forEach((treatment) => {
      const cites = citationNumbers(treatment.sourceIds);
      write(treatment.audienceLabel, 13, "bold", 6);
      write(treatment.message, 10, "normal", 8, 12);
      write(
        `${ui.proofLabel}: ${treatment.proof}${
          cites.length ? ` [${cites.join("] [")}]` : ""
        }`,
        10,
        "normal",
        8,
        12,
      );
      write(`${ui.channelLabel}: ${treatment.channel}`, 10, "normal", 8, 12);
      write(`${ui.doNotSayLabel}: ${treatment.doNotSay}`, 10, "normal", 20, 12);
    });

    doc.save(`rosetta-brief-${brief.pillarId}.pdf`);
  };

  const mailto = brief
    ? `mailto:?subject=${encodeURIComponent(
        `${ui.briefEmailSubject} - ${pillar.shorthand}`,
      )}&body=${encodeURIComponent(briefAsText(brief))}`
    : "";

  return (
    <div className="mt-8">
      {/* Export actions first, then the one action that creates something new. */}
      <div className="flex flex-wrap gap-4">
        {actions}
        <button
          type="button"
          onClick={generate}
          disabled={status === "loading"}
          className={GENERATE}
        >
          {status === "loading"
            ? ui.thinking
            : `${ui.generateBrief} - ${pillar.shorthand}`}
        </button>
      </div>

      {status === "error" && failure ? (
        <p role="status" className="mt-4 font-body text-sm leading-relaxed text-slate">
          {failure.message}
        </p>
      ) : null}

      {brief ? (
        <article className="mt-8 border border-hairline bg-paper">
          <div className="border-b border-hairline p-6 md:p-8">
            <h3 className="font-sans text-3xl leading-tight font-semibold text-ink md:text-4xl">
              {brief.title}
            </h3>
            {/* The one part of this document that exists nowhere else on the
                page, so it is set apart from the data it synthesizes. */}
            <p className="mt-6 border-t-2 border-accent pt-6 font-body text-lg leading-relaxed text-ink">
              {brief.audienceInsight}
            </p>
          </div>

          <div className="grid gap-px border-b border-hairline bg-hairline md:grid-cols-3">
            {[
              { label: ui.whyLabel, value: brief.why, surface: "bg-paper" },
              { label: ui.whatLabel, value: brief.what, surface: "bg-canvas" },
              { label: ui.howLabel, value: brief.how, surface: "bg-shade" },
            ].map((item) => (
              <div key={item.label} className={`${item.surface} p-6 md:p-8`}>
                <h4 className="font-sans text-lg leading-tight font-semibold text-ink">
                  {item.label}
                </h4>
                <p className="mt-4 font-body text-base leading-relaxed text-slate">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-px bg-hairline">
            {brief.treatments.map((treatment) => (
              <div key={treatment.audienceId} className="bg-paper p-6 md:p-8">
                <h4 className="font-sans text-2xl leading-tight font-semibold text-ink">
                  {treatment.audienceLabel}
                </h4>
                <p className="mt-4 font-body text-base leading-relaxed text-ink">
                  {treatment.message}
                </p>
                <p className="mt-4 font-body text-sm leading-relaxed text-slate">
                  {treatment.proof}
                  {treatment.sourceIds.length > 0 ? (
                    <SourceChip
                      sourceIds={treatment.sourceIds}
                      className="ml-2 align-middle"
                    />
                  ) : null}
                </p>
                <p className="mt-4 font-body text-sm leading-relaxed text-slate">
                  {treatment.channel}
                </p>
                <div className="mt-6 bg-accent-muted p-4">
                  <p className="font-mono text-xs tracking-wide text-accent uppercase">
                    {ui.doNotSayLabel}
                  </p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-ink">
                    {treatment.doNotSay}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 border-t border-hairline p-6 md:p-8">
            <button
              type="button"
              onClick={downloadPdf}
              className={PRIMARY}
            >
              {ui.downloadBriefPdf}
            </button>
            <a href={mailto} aria-label={ui.emailBrief} className={SECONDARY}>
              {ui.emailCanvas}
            </a>
          </div>
        </article>
      ) : null}
    </div>
  );
}
