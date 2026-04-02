// StreakGrid.js — Rec / Gym / MIT streak cards with week dots
import { C, FONTS } from '../config/theme';

function StreakCard({ num, label, hot }) {
  const dots = Array.from({ length: 7 }, (_, i) => {
    if (i < num % 7) return 'done';
    if (i === num % 7 && num > 0) return 'now';
    return 'empty';
  });

  return (
    <div style={{
      background:    C.bg2,
      border:        `1px solid ${hot ? C.tealBorder : C.border}`,
      borderRadius:  14,
      padding:       '13px 10px',
      textAlign:     'center',
      transition:    'border-color 0.3s',
    }}>
      <div style={{
        fontFamily:   FONTS.display,
        fontSize:     28, fontWeight: 700,
        color:        hot ? C.green : C.teal,
        lineHeight:   1, marginBottom: 3,
        transition:   'all 0.3s',
      }}>
        {num}
      </div>
      <div style={{ fontSize: 10, color: C.text3, lineHeight: 1.3 }}>{label}</div>
      <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 7 }}>
        {dots.map((type, i) => (
          <div key={i} style={{
            width:        6, height: 6, borderRadius: '50%',
            background:   type === 'done' ? C.green
                        : type === 'now'  ? C.teal
                        : C.bg4,
            transition:   'background 0.3s',
          }} />
        ))}
      </div>
    </div>
  );
}

export default function StreakGrid({ streaks }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 18 }}>
      <StreakCard num={streaks.rec} label="Recording"   hot={streaks.rec > 3} />
      <StreakCard num={streaks.gym} label="Gym days"    hot={streaks.gym > 4} />
      <StreakCard num={streaks.mit} label="MITs done"   hot={streaks.mit > 5} />
    </div>
  );
}
