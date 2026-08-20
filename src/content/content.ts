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
  url: string;
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

// ----------------------------------------------------------------------------
// SOURCES
// Every factual claim on screen resolves to one of these. Rendered as a
// numbered chip next to the claim, opening a drawer with publisher and date.
// ----------------------------------------------------------------------------

export const sources: Source[] = [
  {
    id: "s1",
    claim:
      "Franklin Templeton launched the first US registered mutual fund to use public blockchains to process transactions and record share ownership.",
    publisher: "Franklin Templeton",
    date: "Accessed August 2026",
    url: "https://www.franklintempleton.com/about-us/franklin-templeton-digital-assets",
  },
  {
    id: "s2",
    claim:
      "Franklin Templeton has transformed the BENJI brand into a white-label blockchain service for other banks, operating as both an asset manager and a provider of crypto infrastructure.",
    publisher: "Fortune",
    date: "June 23, 2026",
    url: "https://fortune.com/ranking/crypto/2026/franklin-templeton/",
  },
  {
    id: "s3",
    claim:
      "The SEC issued a no-action letter to Franklin Templeton allowing registered funds to use the onchain money market fund FOBXX for cash management, including as securities lending collateral.",
    publisher: "Franklin Templeton Digital Assets",
    date: "2026",
    url: "https://x.com/FTDA_US",
  },
  {
    id: "s4",
    claim:
      "Franklin Templeton agreed to acquire 250 Digital and launched Franklin Crypto under Christopher Perkins and Seth Ginns alongside Tony Pecore, reporting to Sandy Kaul, Head of Innovation.",
    publisher: "Business Wire",
    date: "April 1, 2026",
    url: "https://www.businesswire.com/news/home/20260401198396/en",
  },
  {
    id: "s5",
    claim:
      "Franklin Templeton Digital Assets managed approximately $1.8 billion in global assets as of December 31, 2025.",
    publisher: "Business Wire",
    date: "April 1, 2026",
    url: "https://www.businesswire.com/news/home/20260401198396/en",
  },
  {
    id: "s6",
    claim:
      "Franklin Templeton operates in more than 30 countries, serves clients in more than 150 countries, and employs over 1,500 investment professionals.",
    publisher: "Franklin Templeton, via role posting",
    date: "2026",
    url: "https://builtin.com/job/vp-business-development-liquidity-exchange-services/7482421",
  },
  {
    id: "s7",
    claim:
      "The Digital Assets team sits within Franklin's Innovation, Research, Strategies & Technologies (FIRST) business group and has been active in digital assets since 2018.",
    publisher: "Franklin Templeton, via role posting",
    date: "2026",
    url: "https://builtin.com/job/vp-business-development-liquidity-exchange-services/7482421",
  },
  {
    id: "s8",
    claim:
      "Part of the 250 Digital consideration will be paid using BENJI tokens, the digital asset securities representing shares of the Franklin OnChain U.S. Government Money Fund.",
    publisher: "CNBC",
    date: "April 1, 2026",
    url: "https://www.cnbc.com/2026/04/01/franklin-templeton-acquires-digital-assets-investment-firm-in-active-crypto-management-push.html",
  },
  {
    id: "s9",
    claim:
      "Bitcoin was down roughly 41 percent over the prior six months and 21 percent year to date at the time of the Franklin Crypto announcement.",
    publisher: "CNBC, citing CoinMetrics",
    date: "April 1, 2026",
    url: "https://www.cnbc.com/2026/04/01/franklin-templeton-acquires-digital-assets-investment-firm-in-active-crypto-management-push.html",
  },
  {
    id: "s10",
    claim:
      "Christopher Perkins, on the launch of Franklin Crypto: crypto's institutional moment has arrived.",
    publisher: "Business Wire",
    date: "April 1, 2026",
    url: "https://www.businesswire.com/news/home/20260401198396/en",
  },
  {
    id: "s11",
    claim:
      "Franklin Templeton launched the Franklin Crypto Index ETF (EZPZ) tracking the CF Institutional Digital Asset Index, with custody by Coinbase, following EZBC in January 2024 and EZET in July 2024.",
    publisher: "Business Wire",
    date: "February 20, 2025",
    url: "https://www.businesswire.com/news/home/20250220096361/en",
  },
  {
    id: "s12",
    claim:
      "The Franklin Templeton Digital Assets social presence describes the firm as a global asset manager decoding markets and a future onchain, in a register distinct from the institutional site.",
    publisher: "Franklin Templeton Digital Assets, X",
    date: "Accessed August 2026",
    url: "https://x.com/FTDA_US",
  },
  {
    id: "s13",
    claim:
      "Franklin Templeton is working with MoonPay to help large investors swap stablecoins for yield-bearing tokens.",
    publisher: "Fortune",
    date: "June 23, 2026",
    url: "https://fortune.com/ranking/crypto/2026/franklin-templeton/",
  },
  {
    id: "s14",
    claim:
      "Franklin Templeton and Binance announced a partnership focused on tokenization and digital asset product development.",
    publisher: "Yahoo Finance",
    date: "September 2025",
    url: "https://finance.yahoo.com/news/investment-giant-franklin-templeton-partners-163828482.html",
  },
  {
    id: "s15",
    claim:
      "Franklin Templeton was founded in 1947 and built its name in value investing and actively managed mutual funds before establishing a digital assets team in 2018.",
    publisher: "Fortune",
    date: "June 23, 2026",
    url: "https://fortune.com/ranking/crypto/2026/franklin-templeton/",
  },
];

// ----------------------------------------------------------------------------
// SCREEN 1: MASTER NARRATIVE
// Full bleed. One statement. Nothing else on screen except the scroll cue.
// ----------------------------------------------------------------------------

export const masterNarrative = {
  eyebrow: "Franklin Templeton FIRST",
  statement:
    "Franklin Templeton is not asking institutions to believe in a new asset class. It is rebuilding the infrastructure the existing ones already run on.",
  subhead:
    "A narrative architecture for FIRST, its Digital Assets team, and Franklin Crypto.",
  scrollCue: "The argument",
};

// ----------------------------------------------------------------------------
// SCREEN 1B: THE ARGUMENT
// The one screen of setup that earns the right to the pillars.
// ----------------------------------------------------------------------------

export const argument = {
  heading: "The problem is not the products.",
  paragraphs: [
    "Franklin Templeton holds the most complete digital asset position of any traditional asset manager. A registered fund running on public blockchains. A regulator-blessed collateral use case. White-label infrastructure other banks are buying. Three exchange-traded products. An active crypto team acquired from the crypto-native side of the market.",
    "It also holds five separate stories about them. An allocator hearing all five concludes that Franklin Templeton is broad. An allocator hearing one concludes that Franklin Templeton is leading.",
    "Digital Assets manages roughly $1.8 billion inside a $1.6 trillion firm. That gap is not a product gap. Franklin Templeton has products competitors cannot match. It is a narrative gap, and narrative gaps are the only kind a communications function can close.",
  ],
  sourceIds: ["s5", "s6"],
};

// ----------------------------------------------------------------------------
// SCREEN 2: THE FOUR PILLARS
// One per screen on mobile. Two-up on desktop. Each is a provable claim.
// ----------------------------------------------------------------------------

export const pillars: Pillar[] = [
  {
    id: "rails",
    index: 1,
    shorthand: "Rails",
    statement: "We built the rails.",
    body:
      "FOBXX has been operating as a registered fund on public blockchains since before the current cycle began. BENJI is no longer a product Franklin Templeton sells. It is infrastructure other institutions run on.",
    proof:
      "First US registered mutual fund to use public blockchains to process transactions and record share ownership. Now extended as a white-label service for other banks.",
    sourceIds: ["s1", "s2"],
  },
  {
    id: "perimeter",
    index: 2,
    shorthand: "Perimeter",
    statement: "We moved the perimeter.",
    body:
      "Competitors sell exposure inside the regulatory perimeter. Franklin Templeton got the perimeter moved. This is the most valuable and least marketed asset in the entire portfolio.",
    proof:
      "SEC no-action letter permitting registered funds to use FOBXX for cash management, including as securities lending collateral.",
    sourceIds: ["s3"],
  },
  {
    id: "discipline",
    index: 3,
    shorthand: "Discipline",
    statement: "We apply the discipline.",
    body:
      "A market this inefficient deserves active research. Franklin Crypto is not a bet that prices go up. It is a bet that dispersion in this asset class is wide enough to reward the same discipline that built the firm.",
    proof:
      "Franklin Crypto launched April 2026, bringing crypto-native active management under Franklin Templeton's research and risk framework.",
    sourceIds: ["s4", "s15"],
  },
  {
    id: "reach",
    index: 4,
    shorthand: "Reach",
    statement: "We own the distribution.",
    body:
      "Every crypto-native competitor can hire researchers and build custody. None of them can acquire seventy-nine years of institutional relationships. Distribution is the one asset in this market that cannot be forked.",
    proof:
      "Operations in more than 30 countries, clients in more than 150, over 1,500 investment professionals.",
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
    id: "benji",
    index: 1,
    title: "BENJI is doing three jobs.",
    tension:
      "One name is carrying a consumer investment brand, a business-to-business infrastructure service sold to banks, and a settlement instrument used in corporate acquisition consideration.",
    evidence: [
      "BENJI as the consumer-facing brand for onchain investing.",
      "BENJI as white-label blockchain infrastructure licensed to other banks.",
      "BENJI tokens used as partial consideration in the 250 Digital acquisition.",
    ],
    cost:
      "A treasurer evaluating settlement infrastructure and a retail investor downloading an app are meeting the same brand and drawing opposite conclusions about what it is for. Infrastructure buyers read consumer marketing as a signal that the thing is not serious.",
    resolution:
      "BENJI becomes the infrastructure brand, singular. The retail surface moves under the Franklin Templeton masterbrand. Infrastructure brands earn trust by being boring, narrow, and impossible to confuse with anything else.",
    sourceIds: ["s1", "s2", "s8"],
  },
  {
    id: "voice",
    index: 2,
    title: "Two voices, one firm.",
    tension:
      "The institutional channels speak in the register of a seventy-nine-year-old fiduciary. The digital assets channels speak in the register of a crypto-native account. Both are good at their job. Together they tell an allocator the firm has not decided what it is.",
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
      "Franklin Crypto launched on the claim that crypto's institutional moment has arrived, in a week when bitcoin was down roughly forty-one percent over six months. The market can falsify that claim on any given Tuesday.",
    evidence: [
      "Launch narrative anchored to a market-timing assertion.",
      "Asset prices materially below prior highs at announcement.",
      "The structural case, settlement and collateral, left largely unmarketed.",
    ],
    cost:
      "A narrative built on a price thesis has to be re-argued every quarter. Worse, it invites the comparison Franklin Templeton should never invite: judged as a crypto manager rather than as the firm rebuilding the plumbing.",
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
    who: "Bloomberg, FT, WSJ, CoinDesk, Barron's",
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
    proof: "First US registered mutual fund to record share ownership on public blockchains.",
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
    proof: "FOBXX operating as an onchain money market fund; BENJI licensed to other institutions.",
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
    proof: "White-label BENJI adopted by other banks.",
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
    proof: "BENJI extended into white-label infrastructure for other banks.",
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
    proof: "SEC no-action letter permitting FOBXX use for cash management including securities lending collateral.",
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
    proof: "Registered funds permitted to use FOBXX for cash management including as securities lending collateral.",
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
    proof: "Franklin Crypto operating under the firm's research and risk framework.",
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
    proof: "Franklin Crypto integrated under the firm's innovation group leadership.",
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
    proof: "250 Digital investment team and liquid strategies now operating as Franklin Crypto.",
    channel: "Industry conferences, native media, direct counterparty conversations.",
    doNotSay:
      "Do not describe the acquisition as validation of crypto by traditional finance. That framing insults the audience you just bought.",
    sourceIds: ["s4"],
  },
  {
    pillarId: "discipline",
    audienceId: "press",
    message:
      "A seventy-nine-year-old active manager thinks this asset class is inefficient enough to be worth researching. That is a more interesting claim than a price call.",
    proof: "Franklin Crypto launch, April 2026.",
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
      "You are not underwriting a startup's survival. You are underwriting a firm that has been serving institutions since 1947.",
    proof: "Operations in more than 30 countries; clients in more than 150.",
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
    proof: "Presence in more than 30 countries.",
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
      "Whatever you build, we can put it in front of institutions in more than 150 countries. That is the part you cannot fork.",
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
    proof: "Firm scale against a digital assets book of roughly $1.8 billion.",
    channel: "Analysis and feature coverage; CEO or head of innovation interviews.",
    doNotSay:
      "Do not volunteer the AUM gap without the framing. Stated alone it is a weakness. Stated as the runway, it is the story.",
    sourceIds: ["s5", "s6"],
  },
];

// ----------------------------------------------------------------------------
// SCREEN 5: CLOSE
// ----------------------------------------------------------------------------

export const close = {
  heading: "One story. Four proofs. Five doors.",
  paragraphs: [
    "A messaging framework is only worth building if it survives contact with a channel calendar, a conference schedule, and a business development conversation that has to close.",
    "This one does, because every claim in it is already true and already published. Nothing here requires Franklin Templeton to become something it is not. It requires the firm to say one thing consistently that it currently says five ways.",
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
    "Independent concept work. Not affiliated with or endorsed by Franklin Templeton.",
  long:
    "This is independent concept work prepared for interview discussion. It is not affiliated with, reviewed by, sponsored by, or endorsed by Franklin Templeton Investments or any of its affiliates. All company facts are drawn from public disclosures and press coverage, cited with publisher and date. Nothing here constitutes investment advice, a recommendation, an offer, or a solicitation. No forward-looking statements, performance claims, or asset projections are made or implied. Franklin Templeton, FIRST, BENJI, FOBXX, EZBC, EZET, and EZPZ are the property of their respective owners and are referenced for identification only.",
};
