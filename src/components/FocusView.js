// FocusView.js — Pomodoro focus screen
import { C, FONTS } from '../config/theme';
import { useTimer, MODES } from '../hooks/useTimer';

export default function FocusView({ mitText, onSessionComplete, onSheet }) {
  const timer = useTimer({ onSessionComplete });

  const modeColor = MODES[timer.mode].color;

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '16px 24px 0', textAlign: 'center',
      overflowY: 'auto', scrollbarWidth: 'none',
    }}>

      {/* Mode selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
        {Object.entries(MODES).map(([key, m]) => (
          <button
            key={key}
            onClick={() => timer.setMode(key)}
            style={{
              padding: '7px 14px', borderRadius: 20,
              fontSize: 11, cursor: 'pointer',
              fontFamily: FONTS.body,
              border:      `1px solid ${timer.mode === key ? modeColor + '55' : C.border2}`,
              background:  timer.mode === key ? modeColor + '15' : 'transparent',
              color:       timer.mode === key ? modeColor : C.text3,
              transition:  'all 0.2s',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Timer ring */}
      <div style={{ position: 'relative', width: 200, height: 200, marginBottom: 24 }}>
        <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="100" cy="100" r="90"
            fill="none" stroke={C.bg3} strokeWidth="2.5"
          />
          <circle cx="100" cy="100" r="90"
            fill="none" stroke={modeColor} strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={timer.circumference}
            strokeDashoffset={timer.strokeOffset}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s' }}
          />
        </svg>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)', textAlign: 'center',
        }}>
          <div style={{
            fontFamily: FONTS.display, fontSize: 48, fontWeight: 400,
            color: C.text, letterSpacing: '-0.03em', lineHeight: 1,
          }}>
            {timer.display}
          </div>
          <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>
            {MODES[timer.mode].phase}
          </div>
        </div>
      </div>

      {/* Session dots */}
      <div style={{ display: 'flex', gap: 7, justifyContent: 'center', marginBottom: 18 }}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            border: `1px solid ${C.border2}`,
            background: i < timer.sessOK ? C.green
                      : i === timer.sessOK ? C.teal
                      : C.bg4,
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      {/* Task name */}
      <div style={{ fontFamily: FONTS.display, fontSize: 17, fontWeight: 600, color: C.text, marginBottom: 4, lineHeight: 1.3, maxWidth: 270 }}>
        {mitText || 'Record one reel today'}
      </div>
      <div style={{ fontSize: 11, color: C.text3, marginBottom: 24 }}>Content · MIT today</div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <button
          onClick={timer.reset}
          style={{ width: 50, height: 50, borderRadius: '50%', background: C.bg3, border: `1px solid ${C.border2}`, color: C.text2, fontSize: 17, cursor: 'pointer' }}
        >
          ↺
        </button>
        <button
          onClick={timer.toggle}
          style={{
            width: 66, height: 66, borderRadius: '50%',
            background:   timer.running ? C.bg3 : C.teal,
            border:       `1px solid ${timer.running ? C.border2 : C.teal}`,
            color:        timer.running ? C.text : '#030A08',
            fontSize:     22, cursor: 'pointer',
            transition:   'all 0.2s',
          }}
        >
          {timer.running ? '⏸' : '▶'}
        </button>
        <button
          onClick={() => onSheet('stuck')}
          style={{ width: 50, height: 50, borderRadius: '50%', background: C.bg3, border: `1px solid ${C.border2}`, color: C.text2, fontSize: 17, cursor: 'pointer' }}
        >
          💬
        </button>
      </div>

      {!timer.running && (
        <div style={{ fontSize: 10, color: C.text3, textAlign: 'center' }}>
          Tap play to start · sound alerts enabled
        </div>
      )}

      {/* Body double mode */}
      <div
        onClick={() => onSheet('body')}
        style={{
          background: C.bg2, border: `1px solid ${C.border}`,
          borderRadius: 9, padding: '10px 14px',
          margin: '16px 0 24px', textAlign: 'center', cursor: 'pointer',
          fontSize: 12, color: C.text3,
        }}
      >
        🤝 <span style={{ color: C.teal }}>Body double mode</span> — tap to activate "working together" feeling
      </div>
    </div>
  );
}
