// ScheduleBlocks.js — Today's time blocks with tick-off
import { C } from '../config/theme';
import { BLOCK_COLORS } from '../data/schedule';

function CheckCircle({ done, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 23, height: 23, borderRadius: '50%',
        border: done ? 'none' : `1.5px solid ${C.border2}`,
        background:   done ? C.green : 'transparent',
        display:      'flex', alignItems: 'center', justifyContent: 'center',
        cursor:       'pointer', flexShrink: 0,
        fontSize:     11, color: done ? '#030A08' : 'transparent',
        transition:   'all 0.25s',
        transform:    done ? 'scale(1)' : 'scale(1)',
        animation:    done ? 'rl-pop 0.3s cubic-bezier(.34,1.56,.64,1)' : 'none',
      }}
    >
      ✓
    </div>
  );
}

export default function ScheduleBlocks({ blocks, isBlockDone, onTick }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
      {blocks.map((block, i) => {
        const done    = block.locked || isBlockDone(`block_${i}`);
        const lcolor  = BLOCK_COLORS[block.type] || C.text3;

        return (
          <div
            key={i}
            style={{
              background:    block.type === 'mit'
                ? `linear-gradient(90deg,rgba(0,229,195,0.035) 0%,${C.bg2} 50%)`
                : C.bg2,
              border:        `1px solid ${C.border}`,
              borderLeft:    `2px solid ${lcolor}`,
              borderRadius:  14,
              padding:       '12px 14px',
              display:       'flex',
              alignItems:    'center',
              gap:           12,
              opacity:       done ? 0.35 : 1,
              transition:    'opacity 0.2s',
            }}
          >
            <div style={{ fontSize: 10, color: C.text3, minWidth: 50, fontWeight: 300, lineHeight: 1.4 }}>
              {block.time}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: done ? C.text3 : C.text, marginBottom: 1 }}>
                {block.title}
              </div>
              <div style={{ fontSize: 11, color: C.text3 }}>{block.sub}</div>
            </div>
            {!block.locked && (
              <CheckCircle
                done={done}
                onClick={() => onTick(`block_${i}`, block.streakType)}
              />
            )}
            {block.locked && (
              <div style={{ fontSize: 11, color: C.text3 }}>✓</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
