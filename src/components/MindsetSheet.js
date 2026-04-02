// MindsetSheet.js — Bottom sheet overlay for mindset / gym nudges
import { C, FONTS } from '../config/theme';
import { MINDSET_SHEETS } from '../data/schedule';

export default function MindsetSheet({ type, onClose }) {
  if (!type) return null;

  const s = MINDSET_SHEETS[type] || MINDSET_SHEETS.energy;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 200,
          animation: 'rl-fade 0.25s ease',
        }}
      />

      {/* Sheet */}
      <div style={{
        position:     'fixed',
        bottom:       0, left: 0, right: 0,
        background:   C.bg2,
        borderRadius: '26px 26px 0 0',
        border:       `1px solid ${C.border2}`,
        borderBottom: 'none',
        padding:      '22px 20px 44px',
        zIndex:       201,
        maxHeight:    '88dvh',
        overflowY:    'auto',
        scrollbarWidth: 'none',
        animation:    'rl-slideup 0.32s cubic-bezier(.32,.72,0,1)',
      }}>
        {/* Handle */}
        <div style={{ width: 34, height: 3, background: C.bg5, borderRadius: 2, margin: '0 auto 20px' }} />

        {/* Tag */}
        <div style={{ fontSize: 9, letterSpacing: '0.13em', textTransform: 'uppercase', color: C.purple, marginBottom: 10, fontWeight: 600 }}>
          {s.tag}
        </div>

        {/* Title */}
        <div style={{ fontFamily: FONTS.display, fontSize: 21, fontWeight: 700, color: C.text, marginBottom: 14, lineHeight: 1.2 }}>
          {s.title}
        </div>

        {/* Body — uses safe subset: <b> <i> <br> */}
        <div
          style={{ fontSize: 14, color: C.text2, lineHeight: 1.8, marginBottom: 26 }}
          dangerouslySetInnerHTML={{ __html: s.body
            .replace(/<b>/g,  `<strong style="color:${C.text};font-weight:500">`)
            .replace(/<\/b>/g, '</strong>')
            .replace(/<i>/g,  `<em style="color:${C.teal};font-style:italic">`)
            .replace(/<\/i>/g, '</em>')
          }}
        />

        {/* CTA */}
        <button
          onClick={onClose}
          style={{
            width:        '100%',
            background:   C.teal,
            color:        '#030A08',
            border:       'none',
            borderRadius: 9,
            padding:      15,
            fontFamily:   FONTS.display,
            fontSize:     14,
            fontWeight:   700,
            cursor:       'pointer',
            letterSpacing: '0.01em',
          }}
        >
          {s.cta}
        </button>
      </div>
    </>
  );
}
