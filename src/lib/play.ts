import {
  audiences,
  cascade,
  collisions,
  type Audience,
  type CascadeCell,
  type DiscoveryQuestion,
  type Pillar,
  type PlayObjection,
  type PlayStep,
  type SalesPlay,
  type SalesPlayContent,
  type SuppressedSeat,
  pillars,
  salesPlays,
} from "@/src/content/content";
import { ui } from "@/src/content/ui";

/**
 * Everything a play is allowed to reference for one pillar, assembled from
 * content.ts. The canvas and the plays read from the same data, so the set of
 * seats and sources a play may cite cannot drift from what the canvas shows.
 */
export type PlayContext = {
  pillar: Pillar;
  active: { audience: Audience; cell: CascadeCell }[];
  suppressed: SuppressedSeat[];
  allowedSourceIds: Set<string>;
};

export function buildPlayContext(pillar: Pillar): PlayContext {
  const rows = audiences.flatMap((audience) => {
    const cell = cascade.find(
      (item) => item.pillarId === pillar.id && item.audienceId === audience.id,
    );
    return cell ? [{ audience, cell }] : [];
  });

  // A cell with nothing to cite is making no claim: the canvas suppresses that
  // seat for this pillar, so the play must not route a seller to it.
  const active = rows.filter((row) => row.cell.sourceIds.length > 0);
  const suppressed = rows
    .filter((row) => row.cell.sourceIds.length === 0)
    .map<SuppressedSeat>((row) => ({
      audienceId: row.audience.id,
      audienceLabel: row.audience.label,
      reason: row.cell.doNotSay,
    }));

  const allowedSourceIds = new Set<string>([
    ...pillar.sourceIds,
    ...active.flatMap((row) => row.cell.sourceIds),
    ...collisions.flatMap((collision) => collision.sourceIds),
  ]);

  return { pillar, active, suppressed, allowedSourceIds };
}

// ---------------------------------------------------------------------------
// Validation. Authored plays pass through here at build time, so a seat the
// pillar suppresses or a source outside its scope fails the build.
// ---------------------------------------------------------------------------

/** House style: no em dashes, ever. Replaced rather than rejected. */
function clean(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/\s*—\s*/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}

function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function strings(value: unknown, max: number): string[] {
  return list(value).map(clean).filter(Boolean).slice(0, max);
}

export class PlayValidationError extends Error {}

/**
 * Validates play content against the pillar's context. Unknown or suppressed
 * seats are dropped, out-of-scope source ids are stripped, and the result is
 * rejected outright if too little survives to be a usable play.
 */
export function validatePlay(input: unknown, context: PlayContext): SalesPlay {
  if (typeof input !== "object" || input === null) {
    throw new PlayValidationError("Play content must be an object.");
  }
  const data = input as Record<string, unknown>;

  const seats = new Map(context.active.map((row) => [row.audience.id, row.audience.label]));
  const seat = (value: unknown): Audience["id"] | null =>
    typeof value === "string" && seats.has(value as Audience["id"])
      ? (value as Audience["id"])
      : null;
  const cite = (value: unknown) =>
    Array.from(
      new Set(
        list(value).filter(
          (id): id is string => typeof id === "string" && context.allowedSourceIds.has(id),
        ),
      ),
    );

  const sequence: PlayStep[] = [];
  const seen = new Set<string>();
  for (const item of list(data.sequence)) {
    const step = item as Record<string, unknown>;
    const audienceId = seat(step.audienceId);
    if (!audienceId || seen.has(audienceId)) continue;
    const objective = clean(step.objective);
    const move = clean(step.move);
    if (!objective || !move) continue;
    seen.add(audienceId);
    sequence.push({
      order: sequence.length + 1,
      audienceId,
      audienceLabel: seats.get(audienceId)!,
      objective,
      move,
      asset: clean(step.asset),
      advanceWhen: clean(step.advanceWhen),
      sourceIds: cite(step.sourceIds),
    });
  }
  sequence.splice(5);

  const discovery: DiscoveryQuestion[] = list(data.discovery).flatMap((item) => {
    const entry = item as Record<string, unknown>;
    const audienceId = seat(entry.audienceId);
    const question = clean(entry.question);
    if (!audienceId || !question) return [];
    return [
      {
        audienceId,
        audienceLabel: seats.get(audienceId)!,
        question,
        listenFor: clean(entry.listenFor),
      },
    ];
  }).slice(0, 6);

  const objections: PlayObjection[] = list(data.objections).flatMap((item) => {
    const entry = item as Record<string, unknown>;
    const audienceId = seat(entry.audienceId);
    const objection = clean(entry.objection);
    const response = clean(entry.response);
    if (!audienceId || !objection || !response) return [];
    return [
      {
        audienceId,
        audienceLabel: seats.get(audienceId)!,
        objection,
        response,
        sourceIds: cite(entry.sourceIds),
      },
    ];
  }).slice(0, 4);

  // The entry seat is whatever the sequence actually opens with, so the two
  // can never disagree on the page.
  const entry = sequence[0];
  const thesis = clean(data.thesis);

  if (!thesis || !entry || sequence.length < 2 || discovery.length < 3 || objections.length < 2) {
    throw new PlayValidationError("The play is incomplete.");
  }

  return {
    pillarId: context.pillar.id,
    title: `${context.pillar.shorthand} ${ui.playTitleSuffix}`,
    thesis,
    runWhen: strings(data.runWhen, 4),
    entryAudienceId: entry.audienceId,
    entryAudienceLabel: entry.audienceLabel,
    entryRationale: clean(data.entryRationale),
    sequence,
    discovery,
    objections,
    suppressed: context.suppressed,
    exitCriteria: strings(data.exitCriteria, 4),
  };
}

/** Counts every seat and citation in authored content, to detect silent drops. */
function footprint(play: Pick<SalesPlayContent, "sequence" | "discovery" | "objections">) {
  return [
    play.sequence.length,
    play.discovery.length,
    play.objections.length,
    play.sequence.reduce((sum, step) => sum + step.sourceIds.length, 0),
    play.objections.reduce((sum, item) => sum + item.sourceIds.length, 0),
  ].join("/");
}

/**
 * The four plays, validated once when the module loads. Authored content must
 * pass the validator unchanged: if it would drop a seat or strip a citation,
 * this throws and the static build fails instead of shipping a quiet edit.
 */
export const plays = Object.fromEntries(
  pillars.map((pillar) => {
    const content = salesPlays[pillar.id];
    const play = validatePlay(content, buildPlayContext(pillar));
    if (footprint(play) !== footprint(content)) {
      throw new PlayValidationError(
        `Sales play "${pillar.id}" cites a seat or source outside its pillar (${footprint(content)} authored, ${footprint(play)} valid).`,
      );
    }
    return [pillar.id, play];
  }),
) as Record<Pillar["id"], SalesPlay>;
