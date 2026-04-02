// SettingsView.js — Provider info, cost counter, schedule, toggles
// Key comes from .env.local only — never user-editable in UI
import { useState } from 'react';
import { C, FONTS } from '../config/theme';

function Row({ label, value, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 0', borderBottom: `1px solid ${C.border}`,
    }}>
      <span style={{ fontSize: 14, color: C.text }}>{label}</span>
      {value    && <span style={{ fontSize: 12, color: C.teal }}>{value}</span>}
      {children}
    </div>
  );
}

function Toggle({ defaultOn = true }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div
      onClick={() => setOn(v => !v)}
      style={{
        width: 42, height: 24, borderRadius: 12, flexShrink: 0,
        background:  on ? C.teal : C.bg4,
        border:      `1px solid ${on ? C.teal : C.border2}`,
        position:    'relative', cursor: 'pointer',
        transition:  'background 0.25s',
      }}
    >
      <div style={{
        position: 'absolute', top: 3,
        left:     on ? 21 : 3,
        width: 16, height: 16, borderRadius: '50%',
        background: 'white', transition: 'left 0.25s',
      }} />
    </div>
  );
}

export default function SettingsView({ callCount, estimatedCostRs }) {
  const prov   = process.env.REACT_APP_AI_PROV || 'claude';
  const hasKey = !!(
    prov === 'claude' ? process.env.REACT_APP_CLAUDE_KEY :
    prov === 'gemini' ? process.env.REACT_APP_GEMINI_KEY :
    prov === 'groq'   ? process.env.REACT_APP_GROQ_KEY   : ''
  );

  const provLabels = {
    claude: 'Claude Haiku (Anthropic) — under ₹50/mo',
    gemini: 'Gemini 2.5 Flash (Google) — free tier',
    groq:   'Groq + Llama — free, fastest',
  };

  return (
    <div style={{ padding: '18px 18px 90px', overflowY: 'auto', flex: 1, scrollbarWidth: 'none' }}>

      {/* AI Provider */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10, fontWeight: 600 }}>AI Provider</div>
        <div style={{ background: C.bg2, border: `1px solid ${C.tealBorder}`, borderRadius: 9, padding: '13px 15px', marginBottom: 8 }}>
          <div style={{ fontSize: 13, color: C.text, marginBottom: 2 }}>{provLabels[prov] || provLabels.claude}</div>
          <div style={{ fontSize: 11, color: C.text3 }}>Set via REACT_APP_AI_PROV in .env.local</div>
          <div style={{
            display: 'inline-block', marginTop: 5, fontSize: 9, padding: '2px 7px',
            borderRadius: 10,
            background: hasKey ? C.greenSoft   : C.orangeSoft,
            color:      hasKey ? C.green        : C.orange,
            border:    `1px solid ${hasKey ? C.greenBorder : 'rgba(255,140,66,.22)'}`,
          }}>
            {hasKey ? '✓ Key loaded from .env.local' : '⚠ No key — set REACT_APP_CLAUDE_KEY in .env.local'}
          </div>
        </div>
        <div style={{ fontSize: 11, color: C.text3, lineHeight: 1.6, background: C.bg3, borderRadius: 9, padding: '9px 11px', border: `1px solid ${C.border}` }}>
          <strong style={{ color: C.text2 }}>🔒 Security:</strong> Keys live only in .env.local (never committed — it's in .gitignore). In production, add to Vercel Environment Variables. Never hardcode.
        </div>
      </div>

      {/* Cost transparency */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10, fontWeight: 600 }}>Cost Transparency</div>
        <div style={{ borderTop: `1px solid ${C.border}` }}>
          <Row label="AI calls this month"        value={String(callCount)} />
          <Row label="Est. cost (Claude Haiku)"   value={`₹${estimatedCostRs}`} />
          <Row label="Budget cap"                  value="₹50 / month" />
        </div>
      </div>

      {/* Schedule */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10, fontWeight: 600 }}>Your Schedule</div>
        <div style={{ borderTop: `1px solid ${C.border}` }}>
          {[
            ['Wake up',             '10:00 AM'],
            ['App quiet until',     '11:00 AM'],
            ['Camera setup nudge',  '2:30 PM (content days)'],
            ['Recording window',    '3–5 PM'],
            ['Gym nudge',           '4:50 PM daily'],
            ['Off the clock',       '6:30 PM'],
            ['Night dump — 1st',    '9:00 PM'],
            ['Night dump — 2nd',    '10:30 PM'],
          ].map(([label, val]) => <Row key={label} label={label} value={val} />)}
        </div>
      </div>

      {/* Notifications */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10, fontWeight: 600 }}>Notifications</div>
        <div style={{ borderTop: `1px solid ${C.border}` }}>
          {[
            ['Morning brief (11 AM)',      true],
            ['Camera setup nudge (2:30)',  true],
            ['Gym reminder (4:50 PM)',      true],
            ['Pressure escalation',         true],
            ['Night dump reminder',         true],
            ['Sunday sport nudge',          true],
          ].map(([label, def]) => <Row key={label} label={label}><Toggle defaultOn={def} /></Row>)}
        </div>
        <div style={{ fontSize: 11, color: C.text3, marginTop: 8, lineHeight: 1.5 }}>
          Push notifications require service worker — coming in v4. Currently in-app toasts only.
        </div>
      </div>

      {/* ADHD */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10, fontWeight: 600 }}>ADHD & Focus</div>
        <div style={{ borderTop: `1px solid ${C.border}` }}>
          {[
            ['Micro-start button on MIT', true],
            ['Day progress bar',          true],
            ['Body double mode',          true],
            ['Timer sound alerts',        true],
          ].map(([label, def]) => <Row key={label} label={label}><Toggle defaultOn={def} /></Row>)}
        </div>
      </div>

      {/* Discipline locks */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10, fontWeight: 600 }}>Discipline Locks</div>
        <div style={{ borderTop: `1px solid ${C.border}` }}>
          {[
            ['Lock SaaS to Tue/Sat only',            true],
            ['Warn if off-schedule',                   true],
            ['Auto-shift gym to 7 PM after 2 skips',  true],
          ].map(([label, def]) => <Row key={label} label={label}><Toggle defaultOn={def} /></Row>)}
        </div>
      </div>

      {/* Provider swap guide */}
      <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '13px 15px' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: C.text2, marginBottom: 8 }}>How to swap AI provider</div>
        <div style={{ fontSize: 11, color: C.text3, lineHeight: 1.8 }}>
          In .env.local set:<br />
          REACT_APP_AI_PROV=gemini<br />
          REACT_APP_GEMINI_KEY=AIza...<br /><br />
          Options: claude | gemini | groq<br />
          Then npm start (or redeploy to Vercel)
        </div>
      </div>
    </div>
  );
}
