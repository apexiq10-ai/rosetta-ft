import {
  audiences,
  cascade,
  collisions,
  sources,
  type Audience,
  type CascadeCell,
  type DiscoveryQuestion,
  type Pillar,
  type PlayObjection,
  type PlayStep,
  type SalesPlay,
  type SuppressedSeat,
} from "@/src/content/content";
import { pillarFields } from "@/src/lib/pillar";

/**
 * Everything the model is allowed to know about one pillar, assembled from
 * content.ts. The play route and the validator read from the same context, so
 * the set of audiences and sources the model may cite cannot drift from the
 * set the server accepts.
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

export function playSystemPrompt(context: PlayContext) {
  const fields = pillarFields(context.pillar);
  const committee = context.active.map(({ audience, cell }) => ({
    audienceId: audience.id,
    seat: audience.label,
    who: audience.who,
    caresAbout: audience.cares,
    canvasMessage: cell.message,
    proof: cell.proof,
    channel: cell.channel,
    doNotSay: cell.doNotSay,
    sourceIds: cell.sourceIds,
  }));
  const evidence = sources
    .filter((source) => context.allowedSourceIds.has(source.id))
    .map((source) => ({ id: source.id, claim: source.claim }));
  const tensions = collisions.map((collision) => ({
    title: collision.title,
    tension: collision.tension,
    resolution: collision.resolution,
    sourceIds: collision.sourceIds,
  }));
  const ids = context.active.map((row) => `"${row.audience.id}"`).join(" | ");

  return `You are a senior enterprise sales strategist turning a vetted
messaging canvas into a sales play: the field document a seller and their
manager use to work one deal across a buying committee.

The canvas already says WHAT each seat hears. Your job is everything the
canvas does not contain: who the seller calls first and why, the order the
committee is worked in, what to ask in discovery, how to answer pushback,
and how the seller knows the play has worked.

PILLAR
Why: ${fields.why}
What: ${fields.what}
How: ${fields.how}

BUYING COMMITTEE (the only seats this play may route to)
${JSON.stringify(committee, null, 2)}

EVIDENCE (the only facts you may assert, by id)
${JSON.stringify(evidence, null, 2)}

KNOWN TENSIONS IN THE FIRM'S PUBLIC STORY (useful for objections)
${JSON.stringify(tensions, null, 2)}

RULES
1. Facts. Any statement about the firm, its products, or the regulator must
   be supported by an EVIDENCE entry, and you must list that entry's id in
   the item's sourceIds. Do not introduce any number, date, name, ranking,
   or claim that is not in EVIDENCE. Questions, seller actions, and
   conditions about the prospect are strategy, not facts, and need no id.
2. Do not copy any canvasMessage, proof, or channel string verbatim. The
   reader has the canvas open beside this play; repeating it wastes their
   time. Refer to it ("lead with the operating record") rather than quoting.
3. Respect every seat's doNotSay rule in everything addressed to that seat.
4. Sequence: 3 to 5 steps, each a different seat, using only audienceId
   values from the BUYING COMMITTEE. Order them so each step creates the
   condition the next step needs, and say what that condition is in
   advanceWhen. The first step must be the entry seat.
5. Discovery: 5 questions spread across at least 3 seats. Open questions a
   seller would actually ask in a first meeting. listenFor names the answer
   that tells the seller the deal is real.
6. Objections: 3 or 4, each the hardest realistic pushback from that seat,
   answered in two sentences or fewer, grounded in EVIDENCE or a tension's
   resolution.
7. runWhen: 3 account conditions that make this the right play to run.
   exitCriteria: 3 observable buyer behaviors that mean the play worked.
8. Register: an institutional sales document. Precise, active voice, no
   hype, no hedging, no forward-looking performance or asset claims.
9. Never use an em dash anywhere. Use a period or a comma instead.
10. Output valid JSON only, no markdown, no code fences, exactly:
{
  "thesis": "<one or two sentences: why this play wins and where it starts>",
  "runWhen": ["<string>", "<string>", "<string>"],
  "entryAudienceId": ${ids},
  "entryRationale": "<one or two sentences>",
  "sequence": [{"audienceId": ${ids}, "objective": "<string>", "move": "<string>", "asset": "<string>", "advanceWhen": "<string>", "sourceIds": ["<id>"]}],
  "discovery": [{"audienceId": ${ids}, "question": "<string>", "listenFor": "<string>"}],
  "objections": [{"audienceId": ${ids}, "objection": "<string>", "response": "<string>", "sourceIds": ["<id>"]}],
  "exitCriteria": ["<string>", "<string>", "<string>"]
}`;
}

// ---------------------------------------------------------------------------
// Validation. The model output is untrusted until it passes through here.
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
 * Parses and validates the model's JSON against the pillar's context. Unknown
 * or suppressed seats are dropped, uncited source ids are stripped, and the
 * result is rejected outright if too little survives to be a usable play.
 */
export function parsePlay(raw: string, context: PlayContext): SalesPlay {
  const text = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/, "")
    .trim();
  let data: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed !== "object" || parsed === null) throw new Error();
    data = parsed as Record<string, unknown>;
  } catch {
    throw new PlayValidationError("The model did not return valid JSON.");
  }

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
    throw new PlayValidationError("The model returned an incomplete play.");
  }

  return {
    pillarId: context.pillar.id,
    title: "",
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
    generatedAt: new Date().toISOString(),
  };
}
