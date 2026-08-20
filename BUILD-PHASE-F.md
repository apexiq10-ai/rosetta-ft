# BUILD-PHASE-F.md — Strategic Brief Generator

Run this after Phase E and the Part 2/3 Cascade redesign are all committed and confirmed working. This adds one new capability: generating a full strategic brief for whichever pillar tab is currently active in the Messaging canvas, covering that pillar's cascade across all five audiences.

Read this file in full before writing any code.

---

## 0. What this is and why it's simpler than Phase E

Phase E took free-text input from the user and had to guard against prompt injection and off-topic requests. This feature has no free-text input at all — the only input is which pillar tab is active, one of four fixed values already validated by TypeScript's union type. There is no injection surface. The system prompt can be simpler and doesn't need a refusal path.

The model's job here is synthesis and formatting, not fact generation: take the pillar's Why/What/How and all five of its cascade cells (message, proof, channel, doNotSay, sourceIds) and organize them into a properly structured brief with connective prose, an audience insight layer, and a coherent narrative arc — never introducing a fact that isn't already in the provided data.

---

## 1. New types

Append to `src/content/content.ts`:

```ts
export type AudienceTreatment = {
  audienceId: Audience["id"];
  audienceLabel: string;
  message: string;
  proof: string;
  channel: string;
  doNotSay: string;
  sourceIds: string[];
};

export type StrategicBrief = {
  pillarId: Pillar["id"];
  title: string;
  audienceInsight: string;        // 2-3 sentence synthesis, model-generated
  why: string;
  what: string;
  how: string;
  treatments: AudienceTreatment[]; // all five, in audience order
  generatedAt: string;             // ISO timestamp, set server-side
};
```

## 2. System prompt

```
You are formatting a strategic messaging brief from data that is
already fully vetted and sourced. You are not researching or
verifying anything - every fact you will use is provided to you
below, already correct.

PILLAR:
Why: {{PILLAR_WHY}}
What: {{PILLAR_WHAT}}
How: {{PILLAR_HOW}}

AUDIENCE TREATMENTS (five, one per audience):
{{TREATMENTS_JSON}}

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
3. Output valid JSON only, matching exactly:
   {"audienceInsight": "<string>"}
   No markdown, no code fences, no text outside the JSON object.
```

`{{PILLAR_WHY}}`, `{{PILLAR_WHAT}}`, `{{PILLAR_HOW}}` derive server-side from the same pillar body/statement/proof fields already used in the Cascade hero row - do not duplicate that derivation logic, extract it into a shared helper both the Cascade component and this API route import.

`{{TREATMENTS_JSON}}` is built server-side from the five cascade cells matching the requested `pillarId`, mapped into the `AudienceTreatment` shape.

## 3. API route

`src/app/api/brief/route.ts`

- `POST` only, body: `{ pillarId: Pillar["id"] }`. Validate it's one of the four known values, reject anything else with 400.
- Model: `claude-sonnet-4-6`, `max_tokens: 300` - this call only generates one short paragraph, everything else is assembled server-side from existing data.
- Build the five `AudienceTreatment` objects server-side from `content.ts`, in a fixed order: allocator, treasurer, gatekeeper, native, press.
- Call the model for `audienceInsight` only. Assemble the full `StrategicBrief` object server-side: pillar fields and treatments come directly from `content.ts`, `audienceInsight` comes from the model response, `generatedAt` is `new Date().toISOString()`.
- **Cache server-side**: an in-memory `Map<Pillar["id"], StrategicBrief>`. Since there are only four possible briefs and the underlying data never changes at runtime, generate each pillar's brief once per server instance and serve the cached version on repeat requests. This cuts cost and latency for anyone clicking between tabs and back.
- Return the full `StrategicBrief` object.

## 4. Component

`src/components/BriefPanel.tsx`

**Trigger:** one button, "Generate strategic brief," positioned near the existing Download PDF / Email row in Cascade, scoped to the currently active pillar tab. Label can update to reflect the pillar, e.g. "Generate strategic brief - Rails."

**On click:** loading state (reuse the same pattern as Phase E's "Thinking" state), then the brief renders in an expanding panel below the button - not a modal, keep it in-flow so it can scroll naturally with the rest of the page.

**Brief layout**, in order:
1. Title: "{Pillar shorthand} - strategic brief"
2. Audience insight paragraph (the one model-generated piece), set apart visually - larger type or a top border, since it's the synthesis that isn't available anywhere else on the page
3. Why / What / How, reusing the same visual treatment as the Cascade hero row for consistency
4. Five audience treatments in order, each as its own block: audience label, message, proof (with source chip), channel, do-not-say callout - same visual language as the persona columns, just stacked vertically instead of in a row since this is now a document meant to be read top to bottom, not scanned side to side

**Actions on the brief itself**, once generated:
- **Download PDF**: use jsPDF directly with text layout (not html2canvas) since this is structured text content and deserves proper typeset output, not a screenshot. Title, headings, and body text styled distinctly within the PDF. Filename: `rosetta-brief-{pillarId}.pdf`.
- **Email**: mailto link with the brief's full text content assembled into the body (title, audience insight, why/what/how, all five treatments in plain text). No attachment needed here, unlike the canvas email - the brief's content fits directly in an email body, so make it complete and readable inline. Subject: "Franklin Templeton strategic brief - {pillar label}".

**State:** local to `BriefPanel`. `status` (`idle | loading | success | error`), `brief` (the parsed response or null), keyed per pillar so switching tabs and coming back doesn't require regenerating if already fetched once in this session (client-side cache mirrors the server-side one).

## 5. Phase gate

- `npm run build` passes clean, zero console errors.
- Generate a brief for all four pillars, confirm each audience insight paragraph is coherent and contains no claim traceable outside the provided data - read each one against the source content manually, don't just confirm the API call succeeded.
- Confirm the server-side cache works: generate a brief, note the `generatedAt` timestamp, switch pillars and back, confirm the timestamp is identical on the second view (proving it served from cache, not regenerated).
- Download a PDF, open it, confirm it's legible and properly formatted, not just that the file downloads.
- Open the email draft, confirm the body contains the full brief text and reads cleanly as plain text.

Commit: `phase F: strategic brief generator`
