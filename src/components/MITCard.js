// MITCard.js — The hero Most Important Task card
import { useState } from 'react';
import { C, FONTS, S } from '../config/theme';
import { openClaudeBrainstorm } from '../services/ai';

export default function MITCard({ tasks, microStart: microStartProp, onStartFocus, onSheet, mitDone, onToggleMIT }) {
  const [helpOpen, setHelpOpen] = useState(false);

  const mit        = tasks?.mit        || 'Record one reel today';
  const microStart = tasks?.micro_start || microStartProp || 'Just open the script doc';
  const energy     = tasks?.tasks?.[0]?.energy || 'deep_work';
  const vert       = tasks?.tasks?.[0]?.why    || 'Content';

  const energyLabel = { deep_work: 'Deep work', medium: 'Medium', light: 'Light' }[energy] || 'Deep work';
  const energyMins  = tasks?.tasks?.[0]?.mins ? ` · ${tasks.tasks[0].mins} min` : ' · 90 min';

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(145deg,#0A1915 0%,#080F0D 55%,#080809 100%)',
      border: `1px solid ${mitDone ? C.green : C.tealBorder}`,
      borderRadius: 22, padding: 20, marginBottom: 14,
      transition: 'border-color 0.3s ease',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: -50, right: -50,
        width: 180, height: 180,
        background: `radial-gradient(circle,${mitDone ? 'rgba(46,255,138,0.06)' : C.tealSoft} 0%,transparent 65%)`,
        pointerEvents: 'none', transition: 'background 0.3s ease',
      }} />

      {/* Eyebrow + MIT tick */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 5, height: 5, borderRadius: '50%',
            background: mitDone ? C.green : C.teal,
            animation: mitDone ? 'none' : 'rl-pulse 2s ease-in-out infinite',
            transition: 'background 0.3s ease',
          }} />
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: mitDone ? C.green : C.tealDim }}>
            Most Important Task
          </span>
        </div>

        <button
          onClick={onToggleMIT}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 20,
            background: mitDone ? 'rgba(46,255,138,0.12)' : 'transparent',
            border: `1px solid ${mitDone ? C.green : C.border2}`,
            color: mitDone ? C.green : C.text3,
            fontSize: 11, fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {mitDone ? '✓ Done' : '○ Mark done'}
        </button>
      </div>

      {/* MIT text */}
      <div style={{
        fontFamily: FONTS.display, fontSize: 20, fontWeight: 600, lineHeight: 1.25,
        color: mitDone ? C.text3 : C.text,
        textDecoration: mitDone ? 'line-through' : 'none',
        marginBottom: 12, transition: 'color 0.3s ease',
      }}>
        {mit}
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 16 }}>
        <span style={{ ...S.tag, borderColor: C.tealBorder, color: C.teal, background: C.tealSoft }}>
          {energyLabel}{energyMins}
        </span>
        <span style={{ ...S.tag, borderColor: C.border2, color: C.text2, background: 'transparent' }}>
          3:00 – 5:00 PM
        </span>
        <span style={{ ...S.tag, borderColor: C.border, color: C.text3, background: 'transparent' }}>
          {vert}
        </span>
      </div>

      {/* ADHD micro-start */}
      <div
        onClick={onStartFocus}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '9px 14px',
          background: C.tealSoft, border: `1px solid ${C.tealBorder}`,
          borderRadius: 9, marginBottom: 10, cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: 14, color: C.teal }}>→</span>
        <span style={{ fontSize: 13, color: C.teal, fontWeight: 500, flex: 1 }}>{microStart}</span>
        <span style={{ fontSize: 11, color: C.tealDim }}>start here</span>
      </div>

      {/* Primary CTA + Need help */}
      <div style={{ display: 'flex', gap: 8, marginBottom: helpOpen ? 10 : 0 }}>
        <button onClick={onStartFocus} style={{ ...S.btnPrimary, flex: 1 }}>
          Full session →
        </button>
        <button
          onClick={() => setHelpOpen(p => !p)}
          style={{
            ...S.btnGhost,
            color: helpOpen ? C.teal : C.text3,
            borderColor: helpOpen ? C.tealBorder : C.border2,
            transition: 'all 0.2s ease',
          }}
        >
          {helpOpen ? '✕' : 'Need help?'}
        </button>
      </div>

      {/* Collapsed help options */}
      <div style={{
        overflow: 'hidden',
        maxHeight: helpOpen ? 120 : 0,
        opacity: helpOpen ? 1 : 0,
        transition: 'max-height 0.25s ease, opacity 0.2s ease',
      }}>
        <div style={{ display: 'flex', gap: 8, paddingTop: 8 }}>
          <button onClick={() => onSheet('stuck')} style={{ ...S.btnGhost, flex: 1, fontSize: 12 }}>
            😶 Stuck?
          </button>
          <button onClick={() => onSheet('push')} style={{ ...S.btnGhost, flex: 1, fontSize: 12 }}>
            ⚡ Push me
          </button>
          <div
            onClick={() => openClaudeBrainstorm(mit)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              flex: 1, padding: '8px 10px', borderRadius: 10,
              background: C.purpleSoft, border: `1px solid ${C.purpleBorder}`,
              fontSize: 12, color: C.purple, cursor: 'pointer',
            }}
          >
            ✦ Brainstorm
          </div>
        </div>
      </div>
    </div>
  );
}
