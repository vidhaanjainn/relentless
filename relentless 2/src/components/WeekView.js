// WeekView.js — Full week schedule with day pills + vertical breakdown
import { C, FONTS } from '../config/theme';
import { WEEK_SCHEDULE, BLOCK_COLORS } from '../data/schedule';

function getTodayIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1; // Mon=0 … Sun=6
}

export default function WeekView() {
  const todayIdx = getTodayIndex();
  const now = new Date();

  // Build date labels for each pill
  const monday = new Date(now);
  const dow = now.getDay() === 0 ? 7 : now.getDay();
  monday.setDate(now.getDate() - dow + 1);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.getDate();
  });

  return (
    <div style={{ padding: '18px 18px 90px', overflowY: 'auto', flex: 1, scrollbarWidth: 'none' }}>

      {/* Day pills */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 20, scrollbarWidth: 'none' }}>
        {WEEK_SCHEDULE.map((day, i) => {
          const isToday = i === todayIdx;
          const bottomColor = day.recording ? C.teal : day.gym ? C.red : 'transparent';
          return (
            <div
              key={day.day}
              style={{
                flexShrink: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '9px 12px',
                borderRadius: 9,
                border: `1px solid ${isToday ? C.tealBorder : C.border}`,
                borderBottom: `2px solid ${isToday ? C.teal : bottomColor}`,
                background: isToday ? C.tealSoft : C.bg2,
                minWidth: 48,
              }}
            >
              <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3, color: isToday ? C.teal : C.text3 }}>
                {day.day}
              </div>
              <div style={{ fontFamily: FONTS.display, fontSize: 16, color: isToday ? C.teal : C.text }}>
                {dates[i]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Verticals */}
      {[
        {
          color: C.teal, label: 'Content · Mon / Wed / Fri',
          rows: [
            { time: '11–3 PM', text: 'Scripts, emails, brand deals, collab replies', icon: '✍' },
            { time: '3–5 PM',  text: 'Record reel — MIT window, always protected',   icon: '🎬', highlight: true },
          ],
        },
        {
          color: C.purple, label: 'SaaS / Finance Apps · Tue + Sat PM',
          rows: [
            { time: '11–3 PM', text: 'Build: WiserMoney, Gym PWA, finance tools',    icon: '⌨' },
            { time: '3–5 PM',  text: 'Client pitch, outreach, pipeline',              icon: '📨' },
          ],
        },
        {
          color: C.blue, label: 'BedBox · Thursday only',
          rows: [
            { time: '11–4 PM', text: 'All BedBox ops — batched here, nowhere else',  icon: '🏠' },
            { time: '4–5 PM',  text: 'Portfolio review · Zerodha',                    icon: '📈' },
          ],
        },
        {
          color: C.red, label: 'Gym · Mon + Sat · nudge 4:50 PM',
          rows: [
            { time: '4:50 PM', text: 'Stop work. Close laptop. Leave now.',          icon: '🏋' },
            { time: 'Sunday',  text: 'Sport nudge — Pickleball or Cricket',          icon: '🏏' },
          ],
        },
      ].map(v => (
        <div key={v.label} style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: v.color }} />
            <div style={{ fontSize: 11, fontWeight: 500, color: C.text2 }}>{v.label}</div>
          </div>
          {v.rows.map((row, i) => (
            <div
              key={i}
              style={{
                background: C.bg2,
                border: `1px solid ${C.border}`,
                borderLeft: `${row.highlight ? '2px' : '1px'} solid ${row.highlight ? C.teal : C.border}`,
                borderRadius: 9,
                padding: '10px 13px',
                marginBottom: 5,
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <div style={{ fontSize: 10, color: C.text3, minWidth: 46, fontWeight: 300 }}>{row.time}</div>
              <div style={{ flex: 1, fontSize: 13, color: C.text }}>{row.text}</div>
              <div style={{ fontSize: 14 }}>{row.icon}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
