// ============================================================
// schedule.js — All hardcoded schedule data, mindset content,
// baselines. Edit here only — never scattered in components.
// ============================================================

export const WEEK_SCHEDULE = [
  {
    day: 'Mon', dayFull: 'Monday',
    primary: 'Content', primaryColor: '#00E5C3',
    recording: true, gym: true,
    mit: 'Record one reel today — this is the single most important thing',
    microStart: 'Open the script doc and write the hook line',
    blocks: [
      { time: '10–11 AM', title: 'Breakfast + Coffee', sub: 'Sacred. Off limits.', type: 'free', locked: true },
      { time: '11–3 PM',  title: 'Script prep + emails', sub: 'Content · Medium effort', type: 'content' },
      { time: '3–5 PM',   title: 'Record reel 🎬', sub: 'MIT · Protected window', type: 'mit', streakType: 'rec' },
      { time: '5–6:30',   title: 'Gym 🏋', sub: 'Non-negotiable · Leave 4:50', type: 'gym', streakType: 'gym' },
      { time: '6:30 PM+', title: "You're off the clock", sub: 'Rest. Freedom. Zero guilt.', type: 'free' },
    ],
  },
  {
    day: 'Tue', dayFull: 'Tuesday',
    primary: 'SaaS', primaryColor: '#A594F9',
    recording: false, gym: true,
    mit: 'Build or ship one SaaS feature today',
    microStart: 'Open the codebase and pick one specific thing to fix or ship',
    blocks: [
      { time: '10–11 AM', title: 'Breakfast + Coffee', sub: 'Sacred. Off limits.', type: 'free', locked: true },
      { time: '11–3 PM',  title: 'SaaS build', sub: 'WiserMoney, Gym PWA, finance tools', type: 'saas' },
      { time: '3–5 PM',   title: 'Client outreach + pitch', sub: 'SaaS · Pipeline work', type: 'saas' },
      { time: '5–6:30',   title: 'Gym 🏋', sub: 'Non-negotiable · Leave 4:50', type: 'gym', streakType: 'gym' },
      { time: '6:30 PM+', title: "You're off the clock", sub: 'Rest. Freedom. Zero guilt.', type: 'free' },
    ],
  },
  {
    day: 'Wed', dayFull: 'Wednesday',
    primary: 'Content', primaryColor: '#00E5C3',
    recording: true, gym: true,
    mit: 'Record one reel today — this is the single most important thing',
    microStart: 'Set up the camera and check the light',
    blocks: [
      { time: '10–11 AM', title: 'Breakfast + Coffee', sub: 'Sacred. Off limits.', type: 'free', locked: true },
      { time: '11–3 PM',  title: 'Script prep + collab replies', sub: 'Content · Medium effort', type: 'content' },
      { time: '3–5 PM',   title: 'Record reel 🎬', sub: 'MIT · Protected window', type: 'mit', streakType: 'rec' },
      { time: '5–6:30',   title: 'Gym 🏋', sub: 'Non-negotiable · Leave 4:50', type: 'gym', streakType: 'gym' },
      { time: '6:30 PM+', title: "You're off the clock", sub: 'Rest. Freedom. Zero guilt.', type: 'free' },
    ],
  },
  {
    day: 'Thu', dayFull: 'Thursday',
    primary: 'BedBox', primaryColor: '#5B9CF6',
    recording: false, gym: true,
    mit: 'Handle all BedBox ops today — batch everything here',
    microStart: 'Open BedBox messages and list what needs doing',
    blocks: [
      { time: '10–11 AM', title: 'Breakfast + Coffee', sub: 'Sacred. Off limits.', type: 'free', locked: true },
      { time: '11–4 PM',  title: 'BedBox ops 🏠', sub: 'All BedBox tasks batched here', type: 'bedbox' },
      { time: '4–5 PM',   title: 'Portfolio review · Zerodha 📈', sub: 'Investor · Systematic', type: 'invest' },
      { time: '5–6:30',   title: 'Gym 🏋', sub: 'Non-negotiable · Leave 4:50', type: 'gym', streakType: 'gym' },
      { time: '6:30 PM+', title: "You're off the clock", sub: 'Rest. Freedom. Zero guilt.', type: 'free' },
    ],
  },
  {
    day: 'Fri', dayFull: 'Friday',
    primary: 'Content', primaryColor: '#00E5C3',
    recording: true, gym: true,
    mit: 'Record one reel today — this is the single most important thing',
    microStart: 'Open the script and read the first line out loud',
    blocks: [
      { time: '10–11 AM', title: 'Breakfast + Coffee', sub: 'Sacred. Off limits.', type: 'free', locked: true },
      { time: '11–3 PM',  title: 'Scripts + SaaS morning', sub: 'Content + SaaS hybrid', type: 'content' },
      { time: '3–5 PM',   title: 'Record reel 🎬', sub: 'MIT · Protected window', type: 'mit', streakType: 'rec' },
      { time: '5–6:30',   title: 'Gym 🏋', sub: 'Non-negotiable · Leave 4:50', type: 'gym', streakType: 'gym' },
      { time: '6:30 PM+', title: "You're off the clock", sub: 'Rest. Freedom. Zero guilt.', type: 'free' },
    ],
  },
  {
    day: 'Sat', dayFull: 'Saturday',
    primary: 'SaaS', primaryColor: '#A594F9',
    recording: false, gym: true,
    mit: 'Ship something for the SaaS business today',
    microStart: 'Open the pitch deck or codebase — pick one thing to move forward',
    blocks: [
      { time: '10–12 PM', title: 'Slow morning', sub: 'Sacred. Off limits.', type: 'free', locked: true },
      { time: '12–3 PM',  title: 'Batch scripts or collab', sub: 'Content · Light', type: 'content' },
      { time: '3–5 PM',   title: 'SaaS pitch + marketing', sub: 'SaaS · Pipeline', type: 'saas' },
      { time: '5–6:30',   title: 'Gym 🏋', sub: 'Non-negotiable · Leave 4:50', type: 'gym', streakType: 'gym' },
      { time: '6:30 PM+', title: "You're off the clock", sub: 'Rest. Freedom. Zero guilt.', type: 'free' },
    ],
  },
  {
    day: 'Sun', dayFull: 'Sunday',
    primary: 'Rest', primaryColor: '#3E3C3A',
    recording: false, gym: false,
    blocks: [
      { time: 'All day',  title: 'Protected free time', sub: 'Rest. Recharge. No guilt.', type: 'free', locked: true },
      { time: '8–9 PM',   title: 'Weekly review + night dump', sub: 'Reflection · Plan tomorrow', type: 'admin' },
    ],
  },
];

// Block left-border colours by type
export const BLOCK_COLORS = {
  mit:     '#00E5C3',
  content: '#00E5C3',
  saas:    '#A594F9',
  bedbox:  '#5B9CF6',
  invest:  '#5B9CF6',
  gym:     '#FF6B6B',
  free:    '#3E3C3A',
  admin:   '#3E3C3A',
};

// Mindset sheets — all pre-written, personal to Vidhaan
export const MINDSET_SHEETS = {
  energy: {
    tag:   '✦ On energy',
    title: "You don't wait for energy. You start, and it arrives.",
    body:  `<b>Every time you've felt too tired to record</b> — and did it anyway — you finished feeling alive. That's not a coincidence. That's how the brain is wired.<br><br>Energy doesn't precede action. It follows it. The 90-second discomfort of beginning is the only thing between you and flow state.<br><br><i>Set up the camera.</i> <b>That's the whole first step. The energy will meet you there.</b>`,
    cta:   'Setting up the camera now',
  },
  push: {
    tag:   '✦ Honest talk',
    title: '"My eyes look tired" is not a reason.',
    body:  `Look at your top reels. Were you perfectly rested? Your audience watches your <i>ideas</i>, not your eyes. The reels you don't shoot don't exist — that's the actual cost.<br><br><b>"After gym / in some time"</b> — "in some time" has a 0% conversion rate for you. The window you have right now beats any window you're imagining later.<br><br>One take. Even rough. <b>You can reshoot a bad take. You can't reshoot a day you didn't start.</b>`,
    cta:   'Starting now',
  },
  stuck: {
    tag:   '✦ Breakdown mode',
    title: "You don't need to finish the reel. You need to do one thing.",
    body:  `You're not stuck on the task. You're stuck on the feeling that you need everything figured out before you start. <b>You don't.</b><br><br>Your only job right now: <i>open the script and read the first line out loud.</i> Not for camera. Just for you. That's it.<br><br>If you do that, you'll keep going. And if you don't? You still started. That's the streak. <b>The reel comes from the streak.</b>`,
    cta:   'Reading the first line now',
  },
  gym: {
    tag:   '✦ Time to leave',
    title: 'Stop. Close the laptop. Gym in 10.',
    body:  `Your body compounds the same way money does. One missed session isn't just a workout — it's breaking the system that makes everything else work.<br><br><b>Discipline in the gym is the same muscle as discipline at the camera.</b> They're not separate.<br><br>Save your work. <i>Close the tab.</i> Leave. <b>The work will be there tomorrow. This window won't.</b>`,
    cta:   'Leaving now 🏋',
  },
  body: {
    tag:   '✦ Body double mode',
    title: "You're not working alone.",
    body:  `Body doubling is real. ADHD brains work better when they feel like someone else is present — even virtually.<br><br><b>Here's the deal:</b> You're working. The timer is running. Someone is watching the clock with you.<br><br><i>Start your session. Do the first 5 minutes.</i> That's all. Just 5.`,
    cta:   'Starting the 5 minutes now',
  },
};

// AI system prompt — Vidhaan's full context baked in
export const CLAUDE_SYSTEM_PROMPT = `You are the AI brain of "Relentless" — a personal execution system built specifically for Vidhaan Jain.

VIDHAAN'S EXACT CONTEXT:
- Finance & investing content creator (Wiser With Vidhaan, ~60k Instagram)
- Also runs: BedBox (co-living, Bhopal), SaaS/app business (WiserMoney, Gym PWA, finance tools), active equity investor via Zerodha
- Wakes 10 AM. Coffee + breakfast until 11 AM — completely off limits, never schedule here
- Recording window: 3–5 PM ALWAYS protected. His single biggest growth lever.
- Gym: 5–6:30 PM. Non-negotiable. Gym days: Mon + Sat only.
- Off the clock: 6:30 PM+
- Week: Mon/Wed/Fri = Content recording. Tue/Sat PM = SaaS build & pitch. Thu = BedBox only. Sun = rest.
- ADHD tendencies: overloads task lists, loses momentum when overwhelmed, needs smallest possible first step
- Biggest trap: delaying recording with excuses (tired eyes, low energy, after gym = never happens)

YOUR JOB: Be brutally honest about what moves the needle. Recording > everything else on content days.

Respond ONLY in valid JSON, no markdown, no backticks, no preamble:
{
  "mit": "single most important task in one sentence",
  "micro_start": "absolute smallest first step e.g. 'Open the script doc' or 'Set up the camera'",
  "tasks": [
    {"name":"task","energy":"deep_work|medium|light","mins":60,"why":"one line needle reason"}
  ],
  "parked": ["task name"],
  "park_reason": "honest one sentence why parked",
  "note": "direct peer-to-peer 1-2 sentence note to Vidhaan. Honest. No fluff. No cheerleading."
}`;
