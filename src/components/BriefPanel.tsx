"use client";

import { useState, type ReactNode } from "react";
import SourceChip from "./SourceChip";
import { sources, type Pillar, type SalesPlay } from "@/src/content/content";
import { ui } from "@/src/content/ui";

const PRIMARY =
  "border border-accent bg-accent px-6 py-3 font-sans text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const GENERATE =
  "border border-generate bg-generate px-6 py-3 font-sans text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const SECONDARY =
  "border border-ink px-6 py-3 font-sans text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const EYEBROW = "font-mono text-xs tracking-wide text-accent uppercase";
const SECTION_HEADING = "font-sans text-2xl leading-tight font-semibold text-ink";

/** Citation numbers are the position in the sources array, as everywhere else. */
function citationNumbers(sourceIds: string[]) {
  return sourceIds
    .map((id) => sources.findIndex((item) => item.id === id) + 1)
    .filter((index) => index > 0);
}

function cites(sourceIds: string[]) {
  const numbers = citationNumbers(sourceIds);
  return numbers.length ? ` [${numbers.join("] [")}]` : "";
}

function pad(order: number) {
  return String(order).padStart(2, "0");
}

function playAsText(play: SalesPlay) {
  const lines = [play.title, "", `${ui.playThesisLabel}: ${play.thesis}`, ""];
  lines.push(ui.playRunWhenLabel, ...play.runWhen.map((item) => `  - ${item}`), "");
  lines.push(`${ui.playEntryLabel}: ${play.entryAudienceLabel}`, `  ${play.entryRationale}`, "");
  lines.push(ui.playSequenceLabel);
  play.sequence.forEach((step) => {
    lines.push(
      `  ${pad(step.order)} ${step.audienceLabel}: ${step.objective}`,
      `     ${ui.playMoveLabel}: ${step.move}${cites(step.sourceIds)}`,
      `     ${ui.playAssetLabel}: ${step.asset}`,
      `     ${ui.playAdvanceLabel}: ${step.advanceWhen}`,
    );
  });
  lines.push("", ui.playDiscoveryLabel);
  play.discovery.forEach((item) => {
    lines.push(
      `  ${item.audienceLabel}: ${item.question}`,
      `     ${ui.playListenLabel}: ${item.listenFor}`,
    );
  });
  lines.push("", ui.playObjectionsLabel);
  play.objections.forEach((item) => {
    lines.push(
      `  ${item.audienceLabel}`,
      `     ${ui.playTheySayLabel}: ${item.objection}`,
      `     ${ui.playYouSayLabel}: ${item.response}${cites(item.sourceIds)}`,
    );
  });
  play.suppressed.forEach((seat) => {
    lines.push("", `${ui.playSuppressedLabel}: ${seat.audienceLabel}`, `  ${seat.reason}`);
  });
  lines.push("", ui.playExitLabel, ...play.exitCriteria.map((item) => `  - ${item}`));
  return lines.join("\n");
}

function Label({ children }: { children: ReactNode }) {
  return <p className={EYEBROW}>{children}</p>;
}

function Chips({ ids }: { ids: string[] }) {
  return ids.length > 0 ? <SourceChip sourceIds={ids} className="ml-2 align-middle" /> : null;
}

export default function BriefPanel({
  pillar,
  actions,
}: {
  pillar: Pillar;
  actions?: ReactNode;
}) {
  const [plays, setPlays] = useState<Record<string, SalesPlay>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [failure, setFailure] = useState<{ id: string; message: string } | null>(null);

  const play = plays[pillar.id];
  const status: "idle" | "loading" | "success" | "error" =
    loadingId === pillar.id
      ? "loading"
      : play
        ? "success"
        : failure?.id === pillar.id
          ? "error"
          : "idle";

  const generate = async () => {
    if (status === "loading") return;
    // Already generated: take the reader to it rather than appearing inert.
    if (play) {
      document.getElementById(`play-${pillar.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
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
          (data as { error?: string })?.error ?? "Could not generate the play.";
        setFailure({ id: pillar.id, message });
        return;
      }
      setPlays((current) => ({ ...current, [pillar.id]: data as SalesPlay }));
    } catch {
      setFailure({ id: pillar.id, message: "Could not reach the play service." });
    } finally {
      setLoadingId(null);
    }
  };

  // Typeset with jsPDF rather than captured as an image: this is structured
  // text and deserves selectable, searchable output.
  const downloadPdf = async () => {
    if (!play) return;
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
      style: "bold" | "normal" | "italic",
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
    const heading = (text: string) => {
      y += 6;
      write(text, 13, "bold", 8);
    };

    write(play.title, 20, "bold", 6);
    write(new Date(play.generatedAt).toUTCString(), 9, "normal", 16);
    write(play.thesis, 11, "normal", 14);

    heading(ui.playRunWhenLabel);
    play.runWhen.forEach((item) => write(`•  ${item}`, 10, "normal", 4, 8));

    heading(`${ui.playEntryLabel}: ${play.entryAudienceLabel}`);
    write(play.entryRationale, 10, "normal", 6);

    heading(ui.playSequenceLabel);
    play.sequence.forEach((step) => {
      write(`${pad(step.order)}  ${step.audienceLabel}`, 11, "bold", 3);
      write(step.objective, 10, "italic", 4, 18);
      write(`${ui.playMoveLabel}: ${step.move}${cites(step.sourceIds)}`, 10, "normal", 3, 18);
      write(`${ui.playAssetLabel}: ${step.asset}`, 10, "normal", 3, 18);
      write(`${ui.playAdvanceLabel}: ${step.advanceWhen}`, 10, "normal", 10, 18);
    });

    heading(ui.playDiscoveryLabel);
    play.discovery.forEach((item) => {
      write(`${item.audienceLabel}: ${item.question}`, 10, "normal", 2, 8);
      write(`${ui.playListenLabel}: ${item.listenFor}`, 9, "italic", 8, 18);
    });

    heading(ui.playObjectionsLabel);
    play.objections.forEach((item) => {
      write(item.audienceLabel, 10, "bold", 2, 8);
      write(`${ui.playTheySayLabel}: ${item.objection}`, 10, "italic", 2, 18);
      write(`${ui.playYouSayLabel}: ${item.response}${cites(item.sourceIds)}`, 10, "normal", 8, 18);
    });

    play.suppressed.forEach((seat) => {
      heading(`${ui.playSuppressedLabel}: ${seat.audienceLabel}`);
      write(seat.reason, 10, "normal", 6);
    });

    heading(ui.playExitLabel);
    play.exitCriteria.forEach((item) => write(`•  ${item}`, 10, "normal", 4, 8));

    doc.save(`rosetta-sales-play-${play.pillarId}.pdf`);
  };

  const mailto = play
    ? `mailto:?subject=${encodeURIComponent(
        `${ui.briefEmailSubject} - ${pillar.shorthand}`,
      )}&body=${encodeURIComponent(playAsText(play))}`
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
          {status === "loading" ? ui.thinking : `${ui.generateBrief} - ${pillar.shorthand}`}
        </button>
      </div>

      {status === "error" && failure ? (
        <div role="alert" className="mt-6 border-l-4 border-accent bg-accent-muted p-4">
          <p className="font-sans text-sm font-semibold text-ink">{ui.playFailedLabel}</p>
          <p className="mt-1 font-body text-sm leading-relaxed text-ink">{failure.message}</p>
        </div>
      ) : null}

      {play ? (
        <article id={`play-${pillar.id}`} className="mt-8 scroll-mt-24 border border-hairline bg-paper">
          {/* The thesis: why this play wins and where it starts. */}
          <header className="border-b border-hairline p-6 md:p-8">
            <h3 className="font-sans text-3xl leading-tight font-semibold text-ink md:text-4xl">
              {play.title}
            </h3>
            <p className="mt-6 border-t-2 border-accent pt-6 font-body text-lg leading-relaxed text-ink">
              {play.thesis}
            </p>
          </header>

          <div className="grid gap-px border-b border-hairline bg-hairline md:grid-cols-2">
            <section className="bg-paper p-6 md:p-8">
              <Label>{ui.playRunWhenLabel}</Label>
              <ul className="mt-4 space-y-3">
                {play.runWhen.map((item) => (
                  <li key={item} className="flex gap-3 font-body text-base leading-relaxed text-ink">
                    <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section className="bg-canvas p-6 md:p-8">
              <Label>{ui.playEntryLabel}</Label>
              <p className="mt-4 font-sans text-2xl leading-tight font-semibold text-ink">
                {play.entryAudienceLabel}
              </p>
              <p className="mt-3 font-body text-base leading-relaxed text-slate">
                {play.entryRationale}
              </p>
            </section>
          </div>

          {/* The sequence is the core of the play: who, in what order, and the
              signal that earns the next step. */}
          <section className="border-b border-hairline p-6 md:p-8">
            <h4 className={SECTION_HEADING}>{ui.playSequenceLabel}</h4>
            <p className="mt-2 font-body text-sm leading-relaxed text-slate">
              {ui.playSequenceStandfirst}
            </p>
            <ol className="mt-6 grid gap-px border border-hairline bg-hairline">
              {play.sequence.map((step) => (
                <li
                  key={step.audienceId}
                  className="grid gap-4 bg-paper p-6 md:grid-cols-[4rem_1fr] md:gap-6"
                >
                  <p
                    aria-label={`${ui.stepLabel} ${step.order}`}
                    className="font-mono text-3xl leading-none text-accent"
                  >
                    {pad(step.order)}
                  </p>
                  <div>
                    <Label>{step.audienceLabel}</Label>
                    <p className="mt-2 font-sans text-lg leading-snug font-semibold text-ink">
                      {step.objective}
                    </p>
                    <div className="mt-4 grid gap-px bg-hairline md:grid-cols-3">
                      <div className="bg-paper py-3 md:pr-4">
                        <p className="font-sans text-xs font-semibold text-ink">{ui.playMoveLabel}</p>
                        <p className="mt-1 font-body text-sm leading-relaxed text-slate">
                          {step.move}
                          <Chips ids={step.sourceIds} />
                        </p>
                      </div>
                      <div className="bg-paper py-3 md:px-4">
                        <p className="font-sans text-xs font-semibold text-ink">{ui.playAssetLabel}</p>
                        <p className="mt-1 font-body text-sm leading-relaxed text-slate">{step.asset}</p>
                      </div>
                      <div className="bg-paper py-3 md:pl-4">
                        <p className="font-sans text-xs font-semibold text-generate">
                          {ui.playAdvanceLabel}
                        </p>
                        <p className="mt-1 font-body text-sm leading-relaxed text-ink">
                          {step.advanceWhen}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="border-b border-hairline p-6 md:p-8">
            <h4 className={SECTION_HEADING}>{ui.playDiscoveryLabel}</h4>
            <div className="mt-6 grid gap-px border border-hairline bg-hairline md:grid-cols-2">
              {play.discovery.map((item) => (
                <div key={item.question} className="bg-paper p-6">
                  <Label>{item.audienceLabel}</Label>
                  <p className="mt-3 font-body text-base leading-relaxed text-ink">{item.question}</p>
                  <p className="mt-3 font-body text-sm leading-relaxed text-slate">
                    <span className="font-sans font-semibold text-ink">{ui.playListenLabel}: </span>
                    {item.listenFor}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-b border-hairline p-6 md:p-8">
            <h4 className={SECTION_HEADING}>{ui.playObjectionsLabel}</h4>
            <div className="mt-6 grid gap-px border border-hairline bg-hairline">
              {play.objections.map((item) => (
                <div key={item.objection} className="grid gap-4 bg-paper p-6 md:grid-cols-2 md:gap-8">
                  <div>
                    <Label>
                      {item.audienceLabel} / {ui.playTheySayLabel}
                    </Label>
                    <p className="mt-3 font-body text-base leading-relaxed text-ink italic">
                      &ldquo;{item.objection}&rdquo;
                    </p>
                  </div>
                  <div className="border-l-2 border-generate pl-4">
                    <p className="font-sans text-xs font-semibold text-generate">{ui.playYouSayLabel}</p>
                    <p className="mt-2 font-body text-base leading-relaxed text-ink">
                      {item.response}
                      <Chips ids={item.sourceIds} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {play.suppressed.length > 0 ? (
            <section className="border-b border-hairline bg-accent-muted p-6 md:p-8">
              {play.suppressed.map((seat) => (
                <div key={seat.audienceId}>
                  <Label>
                    {ui.playSuppressedLabel}: {seat.audienceLabel}
                  </Label>
                  <p className="mt-2 font-body text-sm leading-relaxed text-ink">{seat.reason}</p>
                </div>
              ))}
            </section>
          ) : null}

          <section className="border-b border-hairline p-6 md:p-8">
            <h4 className={SECTION_HEADING}>{ui.playExitLabel}</h4>
            <ul className="mt-4 space-y-3">
              {play.exitCriteria.map((item) => (
                <li key={item} className="flex gap-3 font-body text-base leading-relaxed text-ink">
                  <span aria-hidden className="mt-1.5 h-4 w-4 shrink-0 border-2 border-generate" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <div className="flex flex-wrap gap-4 p-6 md:p-8">
            <button type="button" onClick={downloadPdf} className={PRIMARY}>
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
