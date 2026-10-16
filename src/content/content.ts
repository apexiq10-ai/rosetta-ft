// ============================================================================
// ROSETTA / Narrative Architecture
// Single source of truth for all copy. Components render from this file only.
// No copy is hardcoded in JSX. If a string appears on screen, it lives here.
// ============================================================================

export type Source = {
  id: string;
  claim: string;
  publisher: string;
  date: string;
  /** Omitted for illustrative entries, which stand in for a real citation. */
  url?: string;
};

export type Pillar = {
  id: "rails" | "perimeter" | "discipline" | "reach";
  index: number;
  shorthand: string;
  statement: string;
  body: string;
  proof: string;
  sourceIds: string[];
};

export type Collision = {
  id: string;
  index: number;
  title: string;
  tension: string;
  evidence: string[];
  cost: string;
  resolution: string;
  sourceIds: string[];
};

export type Audience = {
  id: "allocator" | "treasurer" | "gatekeeper" | "native" | "press";
  label: string;
  who: string;
  cares: string;
};

export type CascadeCell = {
  pillarId: Pillar["id"];
  audienceId: Audience["id"];
  message: string;
  proof: string;
  channel: string;
  doNotSay: string;
  sourceIds: string[];
};

export type AudienceTreatment = {
  audienceId: Audience["id"];
  audienceLabel: string;
  message: string;
  proof: string;
  channel: string;
  doNotSay: string;
  sourceIds: string[];
};

/** One touch in the play: who the seller is in front of, and what moves the deal. */
export type PlayStep = {
  order: number;
  audienceId: Audience["id"];
  audienceLabel: string;
  objective: string;
  move: string;
  asset: string;
  advanceWhen: string;
  sourceIds: string[];
};

export type DiscoveryQuestion = {
  audienceId: Audience["id"];
  audienceLabel: string;
  question: string;
  listenFor: string;
};

export type PlayObjection = {
  audienceId: Audience["id"];
  audienceLabel: string;
  objection: string;
  response: string;
  sourceIds: string[];
};

/** An audience the canvas suppresses for this pillar. Read from data, never generated. */
export type SuppressedSeat = {
  audienceId: Audience["id"];
  audienceLabel: string;
  reason: string;
};

/**
 * The sales play for one pillar. The canvas says what each seat hears; the
 * play says who the seller calls first, in what order, what to ask, and how
 * to answer pushback. Every factual assertion resolves to a source id that is
 * validated against this pillar at build time.
 */
export type SalesPlay = {
  pillarId: Pillar["id"];
  title: string;
  thesis: string;
  runWhen: string[];
  entryAudienceId: Audience["id"];
  entryAudienceLabel: string;
  entryRationale: string;
  sequence: PlayStep[];
  discovery: DiscoveryQuestion[];
  objections: PlayObjection[];
  suppressed: SuppressedSeat[];
  exitCriteria: string[];
};

/** Authored play content. Labels, suppressed seats and the entry seat are derived. */
export type SalesPlayContent = {
  thesis: string;
  runWhen: string[];
  entryRationale: string;
  sequence: {
    audienceId: Audience["id"];
    objective: string;
    move: string;
    asset: string;
    advanceWhen: string;
    sourceIds: string[];
  }[];
  discovery: { audienceId: Audience["id"]; question: string; listenFor: string }[];
  objections: {
    audienceId: Audience["id"];
    objection: string;
    response: string;
    sourceIds: string[];
  }[];
  exitCriteria: string[];
};

// ----------------------------------------------------------------------------
// SOURCES
// Every factual claim on screen resolves to one of these. Rendered as a
// numbered chip next to the claim, opening a drawer with publisher and date.
// The institution is a composite, so each entry names the kind of public
// record a live engagement would cite rather than linking to one.
// ----------------------------------------------------------------------------

const ILLUSTRATIVE = "Illustrative evidence";

export const sources: Source[] = [
  {
    id: "s1",
    claim:
      "The onchain money market fund is a US registered fund that uses public blockchains to process transactions and record share ownership.",
    publisher: "Fund registration statement",
    date: ILLUSTRATIVE,
  },
  {
    id: "s2",
    claim:
      "The tokenization platform behind the fund is now licensed as white-label infrastructure to other banks, making the firm both an asset manager and an infrastructure provider.",
    publisher: "Trade press ranking",
    date: ILLUSTRATIVE,
  },
  {
    id: "s3",
    claim:
      "A regulatory no-action letter permits registered funds to use the onchain money market fund for cash management, including as securities lending collateral.",
    publisher: "Regulatory correspondence",
    date: ILLUSTRATIVE,
  },
  {
    id: "s4",
    claim:
      "The firm acquired a crypto-native investment manager and relaunched its team as an active crypto strategy, reporting into the head of innovation.",
    publisher: "Acquisition press release",
    date: ILLUSTRATIVE,
  },
  {
    id: "s5",
    claim:
      "The digital assets business manages a book measured in single-digit billions, inside a firm whose total assets are measured in trillions.",
    publisher: "Acquisition press release",
    date: ILLUSTRATIVE,
  },
  {
    id: "s6",
    claim:
      "The firm operates across dozens of countries, serves clients in well over a hundred, and employs a deep bench of investment professionals.",
    publisher: "Corporate fact sheet",
    date: ILLUSTRATIVE,
  },
  {
    id: "s7",
    claim:
      "The digital assets team sits within the firm's innovation business group and has been active in the asset class for years.",
    publisher: "Role posting",
    date: ILLUSTRATIVE,
  },
  {
    id: "s8",
    claim:
      "Part of the acquisition consideration is paid in platform tokens, the digital securities representing shares of the onchain money market fund.",
    publisher: "Financial press",
    date: ILLUSTRATIVE,
  },
  {
    id: "s9",
    claim:
      "Bitcoin was down by double digits over the prior six months at the time the active crypto strategy launched.",
    publisher: "Financial press, citing market data",
    date: ILLUSTRATIVE,
  },
  {
    id: "s10",
    claim:
      "Launch messaging for the active crypto strategy: crypto's institutional moment has arrived.",
    publisher: "Acquisition press release",
    date: ILLUSTRATIVE,
  },
  {
    id: "s11",
    claim:
      "The firm runs a shelf of crypto exchange-traded products, including an index ETF with third-party custody.",
    publisher: "Product press releases",
    date: ILLUSTRATIVE,
  },
  {
    id: "s12",
    claim:
      "The digital assets social channel speaks in a native, community register distinct from the institutional site.",
    publisher: "Social channel",
    date: ILLUSTRATIVE,
  },
  {
    id: "s13",
    claim:
      "The firm is working with an on-ramp provider to help large investors swap stablecoins for yield-bearing tokens.",
    publisher: "Trade press ranking",
    date: ILLUSTRATIVE,
  },
  {
    id: "s14",
    claim:
      "The firm announced a partnership with a major crypto exchange focused on tokenization and digital asset product development.",
    publisher: "Financial press",
    date: ILLUSTRATIVE,
  },
  {
    id: "s15",
    claim:
      "The firm built its name over decades in value investing and actively managed funds before standing up a digital assets team.",
    publisher: "Trade press ranking",
    date: ILLUSTRATIVE,
  },
];

// ----------------------------------------------------------------------------
// SCREEN 1: MASTER NARRATIVE
// Full bleed. One statement. Nothing else on screen except the scroll cue.
// ----------------------------------------------------------------------------

export const masterNarrative = {
  eyebrow: "Rosetta / Narrative architecture",
  statementLead: "Your institution",
  statementRest:
    "didn't build a new asset class. It rebuilt the rails underneath it.",
  subhead:
    "A narrative architecture for your innovation group, your digital assets team, and your active crypto strategy.",
  scrollCue: "The argument",
};

// ----------------------------------------------------------------------------
// SCREEN 1: HERO STAGE
// The looping product theater beside the statement. It replays the page in
// miniature: scattered sources, the collisions between them, the pillars they
// resolve into, the cascade across audiences, and the generated brief.
// Pillar, audience and collision names are read from their own arrays below.
// ----------------------------------------------------------------------------

export const heroStage = {
  label: "How the framework is built",
  steps: [
    { id: "source", title: "Source", detail: "Every claim cited" },
    { id: "collide", title: "Collide", detail: "Where the story fights itself" },
    { id: "prove", title: "Prove", detail: "Four pillars" },
    { id: "cascade", title: "Cascade", detail: "Five audiences" },
    { id: "brief", title: "Play", detail: "Sales play on demand" },
  ],
  documents: [
    { id: "release", label: "Press release", phrase: "the institutional moment has arrived", sourceId: "s10" },
    { id: "social", label: "Social channel", phrase: "gm. the future is onchain", sourceId: "s12" },
    { id: "letter", label: "Regulatory letter", phrase: "eligible as lending collateral", sourceId: "s3" },
    { id: "filing", label: "Fund filing", phrase: "registered fund on public chains", sourceId: "s1" },
    { id: "coverage", label: "Trade press", phrase: "white-label rails for other banks", sourceId: "s2" },
  ],
  /** Each pair of documents that contradicts itself, and the collision it raises. */
  collisionPairs: [
    { from: "release", to: "social", collisionId: "voice" },
    { from: "filing", to: "coverage", collisionId: "brand" },
  ],
  collisionLabel: "Collision",
  storiesLabel: "5 sources. 5 stories.",
  /** Short forms of the Rails row of the canvas, sized for the stage. */
  cascadeLines: [
    { audienceId: "allocator", message: "Lead with registered fund.", avoid: "blockchain" },
    { audienceId: "treasurer", message: "Settlement on your schedule.", avoid: "tokenization" },
    { audienceId: "gatekeeper", message: "An operating record, not a pilot.", avoid: "innovation" },
    { audienceId: "native", message: "Early, and still running.", avoid: "crypto-native" },
    { audienceId: "press", message: "A market infrastructure story.", avoid: "crypto story" },
  ],
  briefInsight:
    "Open with the platform gatekeeper, because diligence has to be ready before demand arrives. Then take the operating record to allocators and treasurers. Every door opens on settlement, eligibility, or longevity. None of them opens on the word blockchain.",
  /** Mini sequence for the hero's play card, by audience id. */
  playSequence: ["gatekeeper", "press", "allocator", "treasurer"],
  ticker: {
    label: "The framework at a glance",
    claims: "Claims sourced",
    collisions: "Collisions resolved",
    pillars: "Pillars proven",
    audiences: "Audience doors",
    messages: "Messages cascaded",
    rules: "Do-not-say rules",
  },
};

// ----------------------------------------------------------------------------
// SCREEN 1B: THE ARGUMENT
// The one screen of setup that earns the right to the pillars.
// ----------------------------------------------------------------------------

export const argument = {
  heading: "The problem is not the products.",
  paragraphs: [
    "Your institution holds one of the most complete digital asset positions of any traditional asset manager. A registered fund running on public blockchains. A regulator-blessed collateral use case. White-label infrastructure other banks are buying. A shelf of exchange-traded products. An active crypto team acquired from the crypto-native side of the market.",
    "It also holds five separate stories about them. An allocator hearing all five concludes that the firm is broad. An allocator hearing one concludes that the firm is leading.",
    "The digital assets book is measured in billions inside a firm measured in trillions. That gap is not a product gap. The firm has products competitors cannot match. It is a narrative gap, and narrative gaps are the only kind a communications function can close.",
  ],
  sourceIds: ["s5", "s6"],
};

// ----------------------------------------------------------------------------
// SCREEN 2: THE FOUR PILLARS
// One per screen on mobile. Two-up on desktop. Each is a provable claim.
// ----------------------------------------------------------------------------

export const pillarsIntro = {
  heading: "The four proofs",
  standfirst:
    "Each pillar is a claim the firm can already evidence, with the source behind it.",
};

export const pillars: Pillar[] = [
  {
    id: "rails",
    index: 1,
    shorthand: "Rails",
    statement: "We built the rails.",
    body:
      "The onchain money market fund has been operating as a registered fund on public blockchains since before the current cycle began. The platform is no longer a product the firm sells. It is infrastructure other institutions run on.",
    proof:
      "A US registered fund using public blockchains to process transactions and record share ownership. Now extended as a white-label service for other banks.",
    sourceIds: ["s1", "s2"],
  },
  {
    id: "perimeter",
    index: 2,
    shorthand: "Perimeter",
    statement: "We moved the perimeter.",
    body:
      "Competitors sell exposure inside the regulatory perimeter. Your institution got the perimeter moved. This is the most valuable and least marketed asset in the entire portfolio.",
    proof:
      "SEC no-action letter permitting registered funds to use the onchain money market fund for cash management, including as securities lending collateral.",
    sourceIds: ["s3"],
  },
  {
    id: "discipline",
    index: 3,
    shorthand: "Discipline",
    statement: "We apply the discipline.",
    body:
      "A market this inefficient deserves active research. The active crypto strategy is not a bet that prices go up. It is a bet that dispersion in this asset class is wide enough to reward the same discipline that built the firm.",
    proof:
      "An acquired crypto-native team, now running active strategies under the firm's research and risk framework.",
    sourceIds: ["s4", "s15"],
  },
  {
    id: "reach",
    index: 4,
    shorthand: "Reach",
    statement: "We own the distribution.",
    body:
      "Every crypto-native competitor can hire researchers and build custody. None of them can acquire decades of institutional relationships. Distribution is the one asset in this market that cannot be forked.",
    proof:
      "Operations across dozens of countries, clients in well over a hundred, and a deep bench of investment professionals.",
    sourceIds: ["s6", "s15"],
  },
];

// ----------------------------------------------------------------------------
// SCREEN 3: THE COLLISION MAP
// Three places the published language works against itself. With resolutions.
// This is the screen that earns the conversation.
// ----------------------------------------------------------------------------

export const collisionsIntro = {
  heading: "Three places the story collides with itself.",
  standfirst:
    "Each of these is visible from outside the firm, in published material, today. Each has a resolution that costs nothing to implement.",
};

export const collisions: Collision[] = [
  {
    id: "brand",
    index: 1,
    title: "One brand is doing three jobs.",
    tension:
      "One platform name is carrying a consumer investment brand, a business-to-business infrastructure service sold to banks, and a settlement instrument used in corporate acquisition consideration.",
    evidence: [
      "The platform name as the consumer-facing brand for onchain investing.",
      "The platform name as white-label blockchain infrastructure licensed to other banks.",
      "Platform tokens used as partial consideration in an acquisition.",
    ],
    cost:
      "A treasurer evaluating settlement infrastructure and a retail investor downloading an app are meeting the same brand and drawing opposite conclusions about what it is for. Infrastructure buyers read consumer marketing as a signal that the thing is not serious.",
    resolution:
      "The platform name becomes the infrastructure brand, singular. The retail surface moves under the corporate masterbrand. Infrastructure brands earn trust by being boring, narrow, and impossible to confuse with anything else.",
    sourceIds: ["s1", "s2", "s8"],
  },
  {
    id: "voice",
    index: 2,
    title: "Two voices, one firm.",
    tension:
      "The institutional channels speak in the register of a decades-old fiduciary. The digital assets channels speak in the register of a crypto-native account. Both are good at their job. Together they tell an allocator the firm has not decided what it is.",
    evidence: [
      "Institutional site language built around fiduciary caution and role-gated access.",
      "Digital assets social presence built around native idiom and community register.",
      "No shared vocabulary connecting the two across the portfolio.",
    ],
    cost:
      "Allocators run diligence across channels. Inconsistency of voice reads as inconsistency of conviction, and conviction is the thing being underwritten.",
    resolution:
      "One register, two altitudes. The voice stays constant and the technical depth flexes by channel. Native fluency should show through precision, not through idiom. The most credible signal to a crypto-native audience is a firm that describes settlement mechanics correctly, not one that uses their slang.",
    sourceIds: ["s12"],
  },
  {
    id: "moment",
    index: 3,
    title: "The moment claim reprices with the asset.",
    tension:
      "The active crypto strategy launched on the claim that crypto's institutional moment has arrived, in a stretch when bitcoin was down by double digits over six months. The market can falsify that claim on any given Tuesday.",
    evidence: [
      "Launch narrative anchored to a market-timing assertion.",
      "Asset prices materially below prior highs at announcement.",
      "The structural case, settlement and collateral, left largely unmarketed.",
    ],
    cost:
      "A narrative built on a price thesis has to be re-argued every quarter. Worse, it invites the comparison the firm should never invite: judged as a crypto manager rather than as the firm rebuilding the plumbing.",
    resolution:
      "Replace the moment claim with a structural claim. The institutional moment is not a price event, it is a settlement event. Money market funds becoming eligible collateral on public infrastructure is a change to market structure, and market structure does not get marked to market.",
    sourceIds: ["s9", "s10", "s3"],
  },
];

// ----------------------------------------------------------------------------
// SCREEN 4: THE CASCADE
// 4 pillars x 5 audiences. One cell revealed at a time. Progressive disclosure.
// The "do not say" field is the one hiring managers notice.
// ----------------------------------------------------------------------------

export const cascadeIntro = {
  heading: "Messaging canvas",
  standfirst:
    "Select a pillar. See how the same proof lands across five audiences.",
};

export const audiences: Audience[] = [
  {
    id: "allocator",
    label: "Institutional allocator",
    who: "CIO, investment committee, consultant",
    cares: "Mandate fit, governance, and whether this survives a board question.",
  },
  {
    id: "treasurer",
    label: "Corporate treasurer",
    who: "CFO, head of treasury, corporate liquidity",
    cares: "Yield on idle cash, operational risk, counterparty quality, settlement finality.",
  },
  {
    id: "gatekeeper",
    label: "Platform gatekeeper",
    who: "Wirehouse diligence, RIA platform, home office",
    cares: "Suitability, diligence burden, and platform reputational risk.",
  },
  {
    id: "native",
    label: "Crypto-native counterparty",
    who: "Exchanges, custodians, protocol teams, market makers",
    cares: "Technical credibility, integration speed, and whether the firm actually ships.",
  },
  {
    id: "press",
    label: "Tier-one financial press",
    who: "Bloomberg, Financial Times, WSJ, CoinDesk, Barron's",
    cares: "The first, the number, and the tension.",
  },
];

export const cascade: CascadeCell[] = [
  // --- RAILS -----------------------------------------------------------------
  {
    pillarId: "rails",
    audienceId: "allocator",
    message:
      "This is not a pilot. It is a registered fund that has been settling on public infrastructure through multiple market cycles.",
    proof: "A US registered fund recording share ownership on public blockchains.",
    channel: "Consultant briefings, investment committee materials, allocator roundtables.",
    doNotSay:
      "Do not lead with blockchain. Lead with registered fund. The wrapper is the reassurance; the rails are the differentiation.",
    sourceIds: ["s1"],
  },
  {
    pillarId: "rails",
    audienceId: "treasurer",
    message:
      "Your cash can settle on infrastructure that operates on your schedule rather than the market's.",
    proof: "The onchain money market fund in operation; the platform licensed to other institutions.",
    channel: "Treasury and CFO publications, corporate liquidity events, direct BD enablement.",
    doNotSay:
      "Do not say tokenization. Treasurers buy operational outcomes, not technical categories. Say settlement, availability, reconciliation.",
    sourceIds: ["s1", "s2"],
  },
  {
    pillarId: "rails",
    audienceId: "gatekeeper",
    message:
      "The product is a money market fund. The infrastructure underneath it has been in production for years and is now licensed to other regulated institutions.",
    proof: "White-label platform adopted by other banks.",
    channel: "Home office diligence packs, platform due diligence sessions.",
    doNotSay:
      "Do not present this as innovation. Present it as an operating record. Gatekeepers price novelty as risk.",
    sourceIds: ["s2"],
  },
  {
    pillarId: "rails",
    audienceId: "native",
    message:
      "The registered fund on public chains was live before most of the current tokenization market existed.",
    proof: "Continuous operation since the earliest onchain registered fund launch.",
    channel: "Protocol and infrastructure conferences, engineering-led content, technical podcasts.",
    doNotSay:
      "Do not claim to be crypto-native. Claim to be early and still running. Longevity is the credential this audience cannot dismiss.",
    sourceIds: ["s1"],
  },
  {
    pillarId: "rails",
    audienceId: "press",
    message:
      "The asset manager that built the rails is now selling them to its competitors.",
    proof: "Platform extended into white-label infrastructure for other banks.",
    channel: "Exclusive with a tier-one outlet; executive byline as the follow.",
    doNotSay:
      "Do not pitch this as a crypto story. Pitch it as a market infrastructure story. Different desk, better reporter, longer shelf life.",
    sourceIds: ["s2"],
  },

  // --- PERIMETER -------------------------------------------------------------
  {
    pillarId: "perimeter",
    audienceId: "allocator",
    message:
      "The regulator has already answered the question your investment committee is going to ask.",
    proof: "SEC no-action letter permitting use of the onchain fund for cash management including securities lending collateral.",
    channel: "Consultant briefings, governance-focused thought leadership, IC-ready one-pagers.",
    doNotSay:
      "Do not overclaim the letter's scope. Describe precisely what it permits. Precision here is the entire value of the asset.",
    sourceIds: ["s3"],
  },
  {
    pillarId: "perimeter",
    audienceId: "treasurer",
    message:
      "Idle cash that also functions as eligible collateral is a balance sheet outcome, not a technology decision.",
    proof: "Registered funds permitted to use the onchain fund for cash management including as securities lending collateral.",
    channel: "Treasury media, collateral management forums, direct BD enablement.",
    doNotSay:
      "Do not mention crypto in this conversation at all. Nothing in this proposition requires it.",
    sourceIds: ["s3"],
  },
  {
    pillarId: "perimeter",
    audienceId: "gatekeeper",
    message:
      "The diligence question of the last three years now has a documented regulatory answer.",
    proof: "No-action relief on the record.",
    channel: "Diligence packs, compliance-facing briefings, platform legal review.",
    doNotSay:
      "Do not frame this as a competitive advantage. Frame it as a reduction in their workload. Gatekeepers buy less work.",
    sourceIds: ["s3"],
  },
  {
    pillarId: "perimeter",
    audienceId: "native",
    message:
      "Regulated collateral is the unlock this market has been waiting on, and it arrived through the registered fund channel.",
    proof: "Money market fund shares eligible for securities lending collateral.",
    channel: "Technical conferences, protocol partnership conversations, research notes.",
    doNotSay:
      "Do not position regulation as a constraint you tolerate. Position it as the moat you built. This audience respects the firm that did the hard version.",
    sourceIds: ["s3"],
  },
  {
    pillarId: "perimeter",
    audienceId: "press",
    message:
      "A regulator just allowed a blockchain-settled money market fund to be posted as securities lending collateral. That is a change to market structure.",
    proof: "SEC no-action letter.",
    channel: "Regulatory and market structure desks. Not the crypto desk.",
    doNotSay:
      "Do not let this be covered as a crypto win. It is a plumbing story, and plumbing stories are read by the people who allocate.",
    sourceIds: ["s3"],
  },

  // --- DISCIPLINE ------------------------------------------------------------
  {
    pillarId: "discipline",
    audienceId: "allocator",
    message:
      "Dispersion in this asset class is wide enough to reward research. We have applied the same framework here that we apply everywhere else.",
    proof: "Active crypto strategy operating under the firm's research and risk framework.",
    channel: "Allocator roundtables, research-led thought leadership, consultant education.",
    doNotSay:
      "Do not defend the asset class. Defend the method. Allocators who need convincing on crypto are not this year's buyer.",
    sourceIds: ["s4"],
  },
  {
    pillarId: "discipline",
    audienceId: "treasurer",
    message: "Not applicable. Treasury does not buy active crypto strategies.",
    proof: "Route this audience to Rails and Perimeter only.",
    channel: "None. Suppress.",
    doNotSay:
      "Do not cross-sell active strategies into a treasury conversation. It contaminates the operational credibility that made the conversation possible.",
    sourceIds: [],
  },
  {
    pillarId: "discipline",
    audienceId: "gatekeeper",
    message:
      "Active management with documented process, run inside an existing risk and compliance framework rather than bolted onto one.",
    proof: "Active crypto strategy integrated under the firm's innovation group leadership.",
    channel: "Platform diligence, manager research meetings.",
    doNotSay:
      "Do not emphasize the crypto-native pedigree of the acquired team. Emphasize the integration. Gatekeepers are underwriting the container.",
    sourceIds: ["s4"],
  },
  {
    pillarId: "discipline",
    audienceId: "native",
    message:
      "The team is the team you already know. The balance sheet and the distribution behind it are new.",
    proof: "Acquired investment team and liquid strategies now operating under the firm's name.",
    channel: "Industry conferences, native media, direct counterparty conversations.",
    doNotSay:
      "Do not describe the acquisition as validation of crypto by traditional finance. That framing insults the audience you just bought.",
    sourceIds: ["s4"],
  },
  {
    pillarId: "discipline",
    audienceId: "press",
    message:
      "A decades-old active manager thinks this asset class is inefficient enough to be worth researching. That is a more interesting claim than a price call.",
    proof: "Active crypto strategy launch.",
    channel: "Asset management and markets desks; CIO-level interviews.",
    doNotSay:
      "Do not repeat the institutional moment framing. It dates the coverage to the week it was published.",
    sourceIds: ["s4"],
  },

  // --- REACH -----------------------------------------------------------------
  {
    pillarId: "reach",
    audienceId: "allocator",
    message:
      "You are not underwriting a startup's survival. You are underwriting a firm that has been serving institutions for generations.",
    proof: "Operations across dozens of countries; clients in well over a hundred.",
    channel: "Standard institutional channels. Reinforcement, not lead.",
    doNotSay:
      "Do not lead with heritage. Heritage is the closing argument, never the opening one. Leading with it makes the innovation sound borrowed.",
    sourceIds: ["s6"],
  },
  {
    pillarId: "reach",
    audienceId: "treasurer",
    message:
      "Multinational treasury needs a counterparty that operates in your jurisdictions. Most digital asset providers operate in one.",
    proof: "Presence across dozens of countries.",
    channel: "Corporate liquidity events, treasury associations, direct BD.",
    doNotSay:
      "Do not compare to crypto firms by name. The comparison is implicit and stronger unstated.",
    sourceIds: ["s6"],
  },
  {
    pillarId: "reach",
    audienceId: "gatekeeper",
    message:
      "You already have an approved relationship with this firm. This is an extension of it, not a new counterparty.",
    proof: "Existing platform presence across the firm's fund complex.",
    channel: "Home office relationship management, platform expansion conversations.",
    doNotSay:
      "Do not treat digital assets as a separate business in this conversation. The whole advantage is that it is not.",
    sourceIds: ["s6"],
  },
  {
    pillarId: "reach",
    audienceId: "native",
    message:
      "Whatever you build, we can put it in front of institutions in well over a hundred countries. That is the part you cannot fork.",
    proof: "Global distribution footprint; existing partnership activity across exchanges and infrastructure providers.",
    channel: "Partnership and business development conversations, ecosystem events.",
    doNotSay:
      "Do not lecture on regulation. Lead with distribution. It is the only thing in the conversation they cannot build themselves.",
    sourceIds: ["s6", "s13", "s14"],
  },
  {
    pillarId: "reach",
    audienceId: "press",
    message:
      "The distribution question is the one nobody is asking. Products are easy to launch and impossible to sell.",
    proof: "Firm scale against a digital assets book measured in billions.",
    channel: "Analysis and feature coverage; CEO or head of innovation interviews.",
    doNotSay:
      "Do not volunteer the AUM gap without the framing. Stated alone it is a weakness. Stated as the runway, it is the story.",
    sourceIds: ["s5", "s6"],
  },
];

// ----------------------------------------------------------------------------
// SCREEN 4B: SALES PLAYS
// One per pillar. The canvas says what each seat hears; the play says who the
// seller calls first, in what order, what to ask, and how to answer pushback.
// Validated at build time: every seat must be active for the pillar and every
// source id must be in scope, or the build fails. The entry seat is the first
// step of the sequence.
// ----------------------------------------------------------------------------

export const salesPlays: Record<Pillar["id"], SalesPlayContent> = {
  rails: {
    thesis:
      "Sell the operating record, not the technology. Clear diligence first, then let a market structure story pull allocators and treasurers in.",
    runWhen: [
      "The account holds money market funds and is reviewing cash or settlement operations.",
      "A platform or consultant has asked for digital assets diligence materials.",
      "The buyer has seen tokenization pilots elsewhere and doubts any reached production.",
    ],
    entryRationale:
      "Gatekeepers decide who is allowed to buy. Clearing them first turns every later meeting into a purchase decision, not a permission request.",
    sequence: [
      {
        audienceId: "gatekeeper",
        objective: "Clear the fund as an operating product, not a pilot.",
        move: "Walk the home office through the production record and the banks now licensing the platform.",
        asset: "Home office diligence pack.",
        advanceWhen: "Diligence signs off or names its open items.",
        sourceIds: ["s1", "s2"],
      },
      {
        audienceId: "press",
        objective: "Make the market structure story public before the sales push.",
        move: "Offer one tier-one outlet the exclusive on banks running the firm's rails.",
        asset: "Exclusive briefing, executive byline as the follow.",
        advanceWhen: "Coverage files on the markets or infrastructure desk.",
        sourceIds: ["s2"],
      },
      {
        audienceId: "allocator",
        objective: "Get the fund onto the investment committee agenda.",
        move: "Lead with the registered fund wrapper, then show it has settled through multiple market cycles.",
        asset: "IC-ready one-pager and consultant briefing.",
        advanceWhen: "A consultant requests a manager meeting.",
        sourceIds: ["s1"],
      },
      {
        audienceId: "treasurer",
        objective: "Convert interest into a funded cash allocation.",
        move: "Frame it as settlement, availability, and reconciliation on the treasurer's schedule.",
        asset: "Treasury operations walkthrough with business development.",
        advanceWhen: "Treasury opens onboarding.",
        sourceIds: ["s1", "s2"],
      },
    ],
    discovery: [
      {
        audienceId: "gatekeeper",
        question: "What would a digital assets product need to show your diligence team before it reaches the platform?",
        listenFor: "Operating history. Rails answers it directly.",
      },
      {
        audienceId: "allocator",
        question: "When your committee last discussed digital assets, was the question exposure or infrastructure?",
        listenFor: "Exposure. Reframe to infrastructure and price leaves the room.",
      },
      {
        audienceId: "treasurer",
        question: "Where does cash sit idle because settlement windows will not let it move?",
        listenFor: "Named cut-offs, weekend gaps, or manual reconciliation.",
      },
      {
        audienceId: "native",
        question: "What do you need from a registered fund before you integrate it?",
        listenFor: "A track record. Longevity is the credential.",
      },
    ],
    objections: [
      {
        audienceId: "gatekeeper",
        objection: "We do not onboard experimental products.",
        response:
          "It is a registered fund with years in production, and other banks now license the platform. The record is the diligence answer.",
        sourceIds: ["s1", "s2"],
      },
      {
        audienceId: "treasurer",
        objection: "Is this just tokenization marketing?",
        response:
          "It is a settlement decision. The fund is in operation, and the infrastructure under it is licensed to other institutions.",
        sourceIds: ["s1", "s2"],
      },
      {
        audienceId: "press",
        objection: "Isn't this the same brand as your consumer app?",
        response:
          "The name carries several jobs today. The story is infrastructure other banks are buying, which belongs on the markets desk.",
        sourceIds: ["s2", "s8"],
      },
    ],
    exitCriteria: [
      "Diligence clears the fund for at least one platform.",
      "A consultant puts it on an investment committee agenda.",
      "A treasury team opens onboarding.",
    ],
  },

  perimeter: {
    thesis:
      "The regulator has already answered the committee's hardest question. State the letter precisely and sell less work and better collateral, not crypto.",
    runWhen: [
      "The account runs securities lending or manages collateral against cash balances.",
      "Compliance has stalled a digital assets review on regulatory grounds.",
      "The buyer cites regulatory uncertainty as the reason to wait.",
    ],
    entryRationale:
      "Compliance is where these deals die. A documented regulatory answer turns the gatekeeper from blocker into the person who clears the path.",
    sequence: [
      {
        audienceId: "gatekeeper",
        objective: "Retire the regulatory objection on the record.",
        move: "Take platform legal through exactly what the no-action relief permits, and nothing beyond it.",
        asset: "Compliance briefing on the letter's scope.",
        advanceWhen: "Legal records the regulatory question as closed.",
        sourceIds: ["s3"],
      },
      {
        audienceId: "allocator",
        objective: "Put the collateral use case in front of the committee.",
        move: "Show that registered funds may use the onchain fund for cash management, including as securities lending collateral.",
        asset: "IC one-pager on the letter.",
        advanceWhen: "The committee asks how it fits existing cash or lending mandates.",
        sourceIds: ["s3"],
      },
      {
        audienceId: "treasurer",
        objective: "Turn eligibility into a balance sheet decision.",
        move: "Position idle cash that also works as collateral. Leave crypto out of the conversation entirely.",
        asset: "Collateral management walkthrough.",
        advanceWhen: "Treasury and collateral teams meet on it together.",
        sourceIds: ["s3"],
      },
      {
        audienceId: "press",
        objective: "Land it as a market structure story.",
        move: "Brief the regulatory and market structure desks on what changed for collateral markets.",
        asset: "Desk briefing on the letter.",
        advanceWhen: "Coverage runs outside the crypto desk.",
        sourceIds: ["s3"],
      },
    ],
    discovery: [
      {
        audienceId: "gatekeeper",
        question: "Which regulatory question has blocked digital assets reviews on your platform before?",
        listenFor: "Eligibility. That is the question the letter addresses.",
      },
      {
        audienceId: "allocator",
        question: "If regulatory standing were settled, what would your committee still need to see?",
        listenFor: "Mandate fit and governance. Both are answerable.",
      },
      {
        audienceId: "treasurer",
        question: "How much of your cash is held separately from your collateral today?",
        listenFor: "A meaningful split. That duplication is the opening.",
      },
      {
        audienceId: "native",
        question: "What would regulated collateral change on your product roadmap?",
        listenFor: "Use cases or counterparties that were blocked without it.",
      },
    ],
    objections: [
      {
        audienceId: "allocator",
        objection: "A no-action letter is not an approval.",
        response:
          "Correct, and it should be described exactly as written. It permits registered funds to use the onchain fund for cash management, including as securities lending collateral.",
        sourceIds: ["s3"],
      },
      {
        audienceId: "treasurer",
        objection: "We are not putting that kind of risk on the balance sheet.",
        response:
          "Nothing here asks you to. It is a money market fund that registered funds are permitted to use as collateral.",
        sourceIds: ["s3"],
      },
      {
        audienceId: "native",
        objection: "Regulation slows everything down.",
        response:
          "Here it did the opposite. Regulated collateral arrived through the registered fund channel, which is the version the market can build on.",
        sourceIds: ["s3"],
      },
    ],
    exitCriteria: [
      "Platform legal records the regulatory question as closed.",
      "A collateral or securities lending desk joins the conversation.",
      "Coverage runs on a market structure desk.",
    ],
  },

  discipline: {
    thesis:
      "Sell the method, not the asset class. A known team inside the firm's risk framework, betting that dispersion rewards research, never on where prices go next.",
    runWhen: [
      "The allocator holds passive crypto exposure and is asking what active adds.",
      "Manager research is evaluating crypto strategies and wants process, not conviction.",
      "The committee or coverage is anchored on price direction.",
    ],
    entryRationale:
      "An acquisition puts relationships at risk first. Lock in the counterparties who know the team, then take the method to the people who underwrite it.",
    sequence: [
      {
        audienceId: "native",
        objective: "Keep the counterparties who already know the team.",
        move: "Confirm the team is unchanged, with the firm's balance sheet and distribution now behind it.",
        asset: "Direct counterparty conversations.",
        advanceWhen: "Counterparties confirm existing relationships continue.",
        sourceIds: ["s4"],
      },
      {
        audienceId: "gatekeeper",
        objective: "Get the strategy underwritten as a process, not a team bet.",
        move: "Show how the acquired team runs inside the firm's research and risk framework rather than beside it.",
        asset: "Manager research meeting with the framework documented.",
        advanceWhen: "Research approves a full due diligence review.",
        sourceIds: ["s4"],
      },
      {
        audienceId: "allocator",
        objective: "Move the conversation from price to method.",
        move: "Argue that dispersion rewards research, using the discipline that built the firm.",
        asset: "Research-led allocator roundtable.",
        advanceWhen: "An allocator asks for the process deep dive.",
        sourceIds: ["s4", "s15"],
      },
      {
        audienceId: "press",
        objective: "Replace the launch narrative with a method story.",
        move: "Pitch the inefficiency thesis to markets desks through a CIO interview.",
        asset: "CIO interview.",
        advanceWhen: "Coverage cites the method rather than a price call.",
        sourceIds: ["s4"],
      },
    ],
    discovery: [
      {
        audienceId: "allocator",
        question: "What would an active strategy have to show you that passive exposure cannot?",
        listenFor: "Dispersion or risk control. Both are method arguments.",
      },
      {
        audienceId: "allocator",
        question: "How is your committee judging crypto managers today: returns or process?",
        listenFor: "Returns. Move them to process before the market does it for you.",
      },
      {
        audienceId: "gatekeeper",
        question: "How do you underwrite a strategy whose team was acquired?",
        listenFor: "Integration and controls. That is the container the firm can document.",
      },
      {
        audienceId: "native",
        question: "What did you need to hear when the team changed ownership?",
        listenFor: "Continuity. Answer with the same team and new distribution.",
      },
    ],
    objections: [
      {
        audienceId: "allocator",
        objection: "Your launch said the institutional moment had arrived, and prices fell.",
        response:
          "The strategy does not depend on a price call. It is a bet that dispersion rewards research, run under the firm's risk framework.",
        sourceIds: ["s4", "s9", "s10"],
      },
      {
        audienceId: "gatekeeper",
        objection: "This is a crypto-native team with a new logo.",
        response:
          "The team now runs inside the firm's research and risk framework, reporting into the innovation group. Underwrite the container, not the pedigree.",
        sourceIds: ["s4"],
      },
      {
        audienceId: "native",
        objection: "Traditional finance just bought its way in.",
        response:
          "The team you know still runs the strategies. What changed is the balance sheet and distribution behind them.",
        sourceIds: ["s4"],
      },
    ],
    exitCriteria: [
      "Manager research opens a full due diligence review.",
      "An allocator schedules the process deep dive.",
      "Coverage frames the strategy as method, not a price call.",
    ],
  },

  reach: {
    thesis:
      "Distribution is the one asset in this market that cannot be forked. Start where approval already exists and sell digital assets as an extension, never a new counterparty.",
    runWhen: [
      "The account already has an approved relationship with the firm's fund complex.",
      "A multinational treasury is weighing providers that operate in one jurisdiction.",
      "A crypto-native partner has product but no route to institutional buyers.",
    ],
    entryRationale:
      "The firm is already on the platform. Starting where approval exists makes every later step an extension rather than a new counterparty review.",
    sequence: [
      {
        audienceId: "gatekeeper",
        objective: "Treat digital assets as an extension of the existing relationship.",
        move: "Bring it through the current home office relationship rather than a fresh onboarding.",
        asset: "Platform expansion conversation.",
        advanceWhen: "The platform reviews it under the existing relationship.",
        sourceIds: ["s6"],
      },
      {
        audienceId: "allocator",
        objective: "Close the survival question.",
        move: "Use the firm's scale and history as the closing argument, after the product case is made.",
        asset: "Standard institutional channels.",
        advanceWhen: "Counterparty longevity stops coming up.",
        sourceIds: ["s6", "s15"],
      },
      {
        audienceId: "treasurer",
        objective: "Win multinational treasury on jurisdiction coverage.",
        move: "Map the firm's footprint against the treasurer's entities. Leave competitors unnamed.",
        asset: "Treasury association and liquidity events.",
        advanceWhen: "Treasury maps its entities against the footprint.",
        sourceIds: ["s6"],
      },
      {
        audienceId: "native",
        objective: "Turn distribution into partnerships.",
        move: "Offer institutional distribution as the thing a partner cannot build alone.",
        asset: "Partnership and business development conversations.",
        advanceWhen: "A partner proposes a distribution agreement.",
        sourceIds: ["s6", "s13", "s14"],
      },
    ],
    discovery: [
      {
        audienceId: "gatekeeper",
        question: "Which of the firm's funds are already approved on your platform?",
        listenFor: "Any. Each one shortens the path.",
      },
      {
        audienceId: "treasurer",
        question: "How many jurisdictions does your treasury operate in, and how many does your digital assets provider cover?",
        listenFor: "A mismatch. That gap is the opening.",
      },
      {
        audienceId: "native",
        question: "Who are your institutional buyers today, and how do you reach them?",
        listenFor: "No reliable route. Distribution is the offer.",
      },
      {
        audienceId: "allocator",
        question: "What would make your committee comfortable on counterparty longevity?",
        listenFor: "Scale and history. Bring them as the close, not the opening.",
      },
    ],
    objections: [
      {
        audienceId: "allocator",
        objection: "Your digital assets book is small for a firm your size.",
        response:
          "That gap is the point. The reach behind it, dozens of countries and clients in well over a hundred, is what no new entrant can acquire.",
        sourceIds: ["s5", "s6"],
      },
      {
        audienceId: "gatekeeper",
        objection: "Digital assets means a new counterparty review.",
        response:
          "It is the firm you have already approved, extending an existing relationship rather than adding a counterparty.",
        sourceIds: ["s6"],
      },
      {
        audienceId: "native",
        objection: "Incumbents move too slowly to partner with.",
        response:
          "The firm already works with an on-ramp provider and a major exchange. The offer is distribution you cannot build yourself.",
        sourceIds: ["s13", "s14"],
      },
    ],
    exitCriteria: [
      "A platform reviews digital assets under the existing relationship.",
      "A multinational treasury shortlists the firm on jurisdiction coverage.",
      "A partner proposes a distribution agreement.",
    ],
  },
};

// ----------------------------------------------------------------------------
// SCREEN 5: CLOSE
// ----------------------------------------------------------------------------

export const close = {
  heading: "One story. Four proofs. Five doors.",
  paragraphs: [
    "A messaging framework is only worth building if it survives contact with a channel calendar, a conference schedule, and a business development conversation that has to close.",
    "This one does, because every claim in it is already true and already published. Nothing here requires your institution to become something it is not. It requires the firm to say one thing consistently that it currently says five ways.",
  ],
  cta: {
    label: "Arthur Daglish",
    detail: "arthur@apex-iq.ai",
  },
};

// ----------------------------------------------------------------------------
// COMPLIANCE
// Rendered persistently in the footer on every screen. Not dismissible.
// ----------------------------------------------------------------------------

export const compliance = {
  short:
    "Independent concept work. The institution is a composite and the evidence is illustrative.",
  long:
    "This is independent concept work prepared for discussion. The institution described is a composite of a traditional asset manager with a digital assets franchise; it does not name, represent, or speak for any specific firm, and it is not affiliated with, reviewed by, sponsored by, or endorsed by any financial institution. Evidence entries are illustrative placeholders for the public filings, releases, and coverage a live engagement would cite. Nothing here constitutes investment advice, a recommendation, an offer, or a solicitation. No forward-looking statements, performance claims, or asset projections are made or implied.",
};
