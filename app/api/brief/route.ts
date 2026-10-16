import Anthropic from "@anthropic-ai/sdk";
import { pillars, type Pillar, type SalesPlay } from "@/src/content/content";
import { ui } from "@/src/content/ui";
import {
  buildPlayContext,
  parsePlay,
  playSystemPrompt,
  PlayValidationError,
} from "@/src/lib/play";

// A full play is a few thousand tokens of structured output; give the function
// room to finish rather than relying on the platform default.
export const maxDuration = 60;

/**
 * There are four possible plays and the underlying data never changes at
 * runtime, so each one is generated once per server instance and served from
 * here afterwards.
 */
const playCache = new Map<Pillar["id"], SalesPlay>();

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

  const cached = playCache.get(pillar.id);
  if (cached) return Response.json(cached);

  if (!process.env.ANTHROPIC_API_KEY) {
    return fail("ANTHROPIC_API_KEY is not configured on the server.", 500);
  }

  const context = buildPlayContext(pillar);
  let text = "";
  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 3000,
      system: playSystemPrompt(context),
      messages: [{ role: "user", content: "Write the sales play." }],
    });

    if (response.stop_reason === "refusal") {
      return fail("The model declined to generate this play.", 502);
    }

    text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");
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

  let play: SalesPlay;
  try {
    play = parsePlay(text, context);
  } catch (error) {
    if (error instanceof PlayValidationError) return fail(error.message, 502);
    throw error;
  }

  play.title = `${pillar.shorthand} ${ui.playTitleSuffix}`;
  playCache.set(pillar.id, play);
  return Response.json(play);
}
