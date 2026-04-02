// MITCard.js — The hero Most Important Task card
import { C, FONTS, S } from '../config/theme';
import { openClaudeBrainstorm } from '../services/ai';

export default function MITCard({ tasks, microStart: microStartProp, onStartFocus, onSheet }) {
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
      border: `1px solid ${C.tealBorder}`,
      borderRadius: 22, padding: 20, marginBottom: 14,
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: -50, right: -50,
        width: 180, height: 180,
        background: `radial-gradient(circle,${C.tealSoft} 0%,transparent 65%)`,
        pointerEvents: 'none',
      }} />

      {/* Eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 11 }}>
        <div style={{
          width: 5, height: 5, borderRadius: '50%', background: C.teal,
          animation: 'rl-pulse 2s ease-in-out infinite',
        }} />
        <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.tealDim }}>
          Most Important Task
        </span>
      </div>

      {/* MIT text */}
      <div style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 600, lineHeight: 1.25, color: C.text, marginBottom: 12 }}>
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

      {/* Main buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={onStartFocus} style={{ ...S.btnPrimary, flex: 1 }}>
          Full session →
        </button>
        <button onClick={() => onSheet('stuck')} style={S.btnGhost}>Stuck?</button>
        <button onClick={() => onSheet('push')}  style={S.btnGhost}>Push me</button>
      </div>

      {/* Brainstorm with Claude — opens claude.ai, zero API cost */}
      <div
        onClick={() => openClaudeBrainstorm(mit)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '8px 13px', borderRadius: 20,
          background: C.purpleSoft, border: `1px solid ${C.purpleBorder}`,
          fontSize: 12, color: C.purple, cursor: 'pointer',
        }}
      >
        ✦ Brainstorm with Claude
      </div>
    </div>
  );
}
