// ============================================================
// ai.js — All AI calls live here. Same pattern as gemini.js
// in vidhaan-gym. Swap provider by changing REACT_APP_AI_PROV.
//
// SECURITY:
//   - Key comes ONLY from .env.local (never hardcoded)
//   - .env.local is in .gitignore — never committed
//   - Calls go directly browser → API provider
//   - No intermediary server, no logging
//
// Cost: Claude Haiku ~₹0.24/call. Under ₹50/month at usage.
//
// To swap provider: change REACT_APP_AI_PROV in .env.local
//   claude  → Claude Haiku (default, best reasoning)
//   gemini  → Gemini 2.5 Flash (free tier, 250 req/day)
//   groq    → Groq + Llama (free, fastest, weaker context)
// ============================================================

import { CLAUDE_SYSTEM_PROMPT } from '../data/schedule';

const PROV = process.env.REACT_APP_AI_PROV || 'claude';
const KEY  = process.env.REACT_APP_CLAUDE_KEY || '';

// ── Provider endpoints ────────────────────────────────────────
async function callClaude(userMsg) {
  // KEY is baked in at npm start time from .env.local
  // If empty: stop npm start, verify .env.local has REACT_APP_CLAUDE_KEY, restart npm start
  if (!KEY) throw new Error('NO_KEY');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method:  'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         KEY,  // from .env.local only
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5-20251001', // cheapest capable model
      max_tokens: 800,
      system:     CLAUDE_SYSTEM_PROMPT,
      messages:   [{ role: 'user', content: userMsg }],
    }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    const msg = e.error?.message || `Claude API error ${res.status}`;
    // 401 = bad key, 429 = rate limit
    if (res.status === 401) throw new Error('Invalid API key — check REACT_APP_CLAUDE_KEY in .env.local');
    throw new Error(msg);
  }
  const d = await res.json();
  return d.content?.[0]?.text || '';
}

async function callGemini(userMsg) {
  const gemKey = process.env.REACT_APP_GEMINI_KEY || '';
  if (!gemKey) throw new Error('NO_KEY');
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${gemKey}`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ contents: [{ parts: [{ text: CLAUDE_SYSTEM_PROMPT + '\n\n' + userMsg }] }] }),
    }
  );
  const d = await res.json();
  if (d.error) throw new Error(d.error.message);
  return d.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callGroq(userMsg) {
  const groqKey = process.env.REACT_APP_GROQ_KEY || '';
  if (!groqKey) throw new Error('NO_KEY');
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
    body:    JSON.stringify({
      model:      'llama-3.1-8b-instant',
      max_tokens: 800,
      messages:   [
        { role: 'system', content: CLAUDE_SYSTEM_PROMPT },
        { role: 'user',   content: userMsg },
      ],
    }),
  });
  const d = await res.json();
  if (d.error) throw new Error(d.error.message);
  return d.choices?.[0]?.message?.content || '';
}

// ── Main export ───────────────────────────────────────────────
async function callAI(userMsg) {
  if (PROV === 'gemini') return callGemini(userMsg);
  if (PROV === 'groq')   return callGroq(userMsg);
  return callClaude(userMsg); // default: claude
}

// ── Task dump → sorted priority list ─────────────────────────
export async function sortDump({ rawText, mode }) {
  const userMsg = `Mode: ${mode === 'today' ? 'Today (urgent, same-day)' : "Tomorrow's planning"}\n\nTask dump:\n${rawText}`;
  const raw = await callAI(userMsg);
  // Strip accidental markdown fences
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

// ── Fallback parser (no API key / parse error) ────────────────
export function fallbackSort(rawText) {
  const items = rawText.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
  const deepKw  = ['script','record','reel','build','write','pitch','design','saas','code'];
  const lightKw = ['check','review','zerodha','schedule'];
  const kept = [], parked = [];
  items.forEach((item, i) => {
    const l = item.toLowerCase();
    let energy = 'medium';
    if (deepKw.some(k => l.includes(k)))  energy = 'deep_work';
    if (lightKw.some(k => l.includes(k))) energy = 'light';
    if (i < 4) kept.push({ name: item, energy, mins: energy === 'deep_work' ? 90 : 30, why: '' });
    else parked.push(item);
  });
  return {
    mit:         kept[0]?.name || 'Record one reel today',
    micro_start: 'Open the script doc and read the first line',
    tasks:       kept,
    parked,
    park_reason: 'Add your Claude API key to .env.local for full AI analysis.',
    note:        'Set REACT_APP_CLAUDE_KEY in .env.local to unlock intelligent prioritisation.',
  };
}

// ── Open Claude app for brainstorm (zero API cost) ────────────
// Uses existing Claude Pro subscription. No API call made.
//
// HOW THIS WORKS:
// - On Vercel (HTTPS): iOS Universal Links intercept claude.ai and open the Claude app
// - On local dev (HTTP): Universal Links don't fire, opens in Safari instead
//   → We copy the prompt to clipboard so you can paste into the Claude app manually
//
// location.href (not window.open) gives iOS the best chance to intercept.
export function openClaudeBrainstorm(mitText) {
  const prompt = `I'm working on: "${mitText}"

Context: I'm a finance content creator (Wiser With Vidhaan). This is my MIT today — the single thing that moves the needle most.

Help me:
1. Break this into the 3 smallest first steps
2. Give me the single opening action to start right now
3. If I'm stuck, what's the real reason and how do I break through?`;

  // Always copy to clipboard as backup (works silently)
  navigator.clipboard?.writeText(prompt).catch(() => {});

  // location.href triggers iOS Universal Links → opens Claude app if installed
  window.location.href = `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
}
