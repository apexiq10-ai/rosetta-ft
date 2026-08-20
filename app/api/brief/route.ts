import Anthropic from "@anthropic-ai/sdk";
import {
  audiences,
  cascade,
  pillars,
  type Audience,
  type AudienceTreatment,
  type Pillar,
  type StrategicBrief,
} from "@/src/content/content";
import { pillarFields } from "@/src/lib/pillar";

// Fixed presentation order for the brief, independent of the content array.
const AUDIENCE_ORDER: Audience["id"][] = [
  "allocator",
  "treasurer",
  "gatekeeper",
  "native",
  "press",
];

/**
 * There are four possible briefs and the underlying data never changes at
 * runtime, so each one is generated once per server instance and served from
 * here afterwards.
 */
const briefCache = new Map<Pillar["id"], StrategicBrief>();

function buildTreatments(pillarId: Pillar["id"]): AudienceTreatment[] {
  return AUDIENCE_ORDER.flatMap<AudienceTreatment>((audienceId) => {
    const audience = audiences.find((item) => item.id === audienceId);
    const cell = cascade.find(
      (item) => item.pillarId === pillarId && item.audienceId === audienceId,
    );
    if (!audience || !cell) return [];
    return [
      {
        audienceId,
        audienceLabel: audience.label,
        message: cell.message,
        proof: cell.proof,
        channel: cell.channel,
        doNotSay: cell.doNotSay,
        sourceIds: cell.sourceIds,
      },
    ];
  });
}

function systemPrompt(
  fields: { why: string; what: string; how: string },
  treatments: AudienceTreatment[],
) {
  return `You are formatting a strategic messaging brief from data that is
already fully vetted and sourced. You are not researching or
verifying anything - every fact you will use is provided to you
below, already correct.

PILLAR:
Why: ${fields.why}
What: ${fields.what}
How: ${fields.how}

AUDIENCE TREATMENTS (five, one per audience):
${JSON.stringify(treatments, null, 2)}

TASK: Write a two-to-three sentence "audience insight" paragraph that
sits at the top of the brief, synthesizing what these five treatments
reveal in common about how this pillar should be positioned across a
buying committee. This is the only prose you are generating - do not
rewrite the pillar fields or the treatments, they will be rendered
as-is from the data provided.

HARD CONSTRAINTS:
1. Do not introduce any fact, number, date, or claim that is not
   already present in the PILLAR or AUDIENCE TREATMENTS data above.
2. Write in the register of an institutional strategy brief: precise,
   active voice, no hedging, no hype language, no filler transitions.
3. State only what the provided data shows in combination. Do not add
   an original strategic conclusion, characterization, or framing
   (e.g. 'this shifts the frame from X to Y') that isn't directly
   supported by connecting the provided facts - if the audience
   insight would otherwise require asserting a new interpretive
   claim, describe the pattern across the five treatments instead and
   let the reader draw the strategic conclusion themselves.
4. Never use an em dash (—) anywhere in the audience insight text.
   Use a period, a comma, or 'and' to join clauses instead - this is
   a strict house style rule with no exceptions.
5. Output valid JSON only, matching exactly:
   {"audienceInsight": "<string>"}
   No markdown, no code fences, no text outside the JSON object.`;
}

/** The model is asked for bare JSON; a stray fence should not break the route. */
function parseInsight(raw: string): string | null {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
  try {
    const parsed: unknown = JSON.parse(cleaned);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as { audienceInsight?: unknown }).audienceInsight === "string"
    ) {
      const insight = (parsed as { audienceInsight: string }).audienceInsight.trim();
      return insight.length > 0 ? insight : null;
    }
  } catch {
    return null;
  }
  return null;
}

function fail(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return fail("Request body must be JSON.", 400);
  }

  const requested = (payload as { pillarId?: unknown } | null)?.pillarId;
  // The only input is one of four values the union type already constrains.
  const pillar = pillars.find((item) => item.id === requested);
  if (!pillar) {
    return fail("pillarId must be one of: rails, perimeter, discipline, reach.", 400);
  }

  const cached = briefCache.get(pillar.id);
  if (cached) return Response.json(cached);

  const fields = pillarFields(pillar);
  const treatments = buildTreatments(pillar.id);

  if (!process.env.ANTHROPIC_API_KEY) {
    return fail("ANTHROPIC_API_KEY is not configured on the server.", 500);
  }

  let insight: string | null = null;
  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system: systemPrompt(fields, treatments),
      messages: [
        { role: "user", content: "Write the audience insight paragraph." },
      ],
    });

    if (response.stop_reason === "refusal") {
      return fail("The model declined to generate this brief.", 502);
    }

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");
    insight = parseInsight(text);
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return fail("The configured ANTHROPIC_API_KEY was rejected.", 502);
    }
    if (error instanceof Anthropic.RateLimitError) {
      return fail("Rate limited. Try again shortly.", 429);
    }
    if (error instanceof Anthropic.APIError) {
      return fail(`Upstream error ${error.status ?? ""}`.trim() + ".", 502);
    }
    return fail("Could not reach the model.", 502);
  }

  if (!insight) {
    return fail("The model did not return a usable audience insight.", 502);
  }

  // Everything except the insight is assembled here from content.ts, so the
  // model cannot introduce a fact by rewriting a field.
  const brief: StrategicBrief = {
    pillarId: pillar.id,
    title: `${pillar.shorthand} - strategic brief`,
    audienceInsight: insight,
    why: fields.why,
    what: fields.what,
    how: fields.how,
    treatments,
    generatedAt: new Date().toISOString(),
  };

  briefCache.set(pillar.id, brief);
  return Response.json(brief);
}
