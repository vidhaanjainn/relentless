// WeekView.js — Full week schedule + per-day tasks from storage
import { useState } from 'react';
import { C, FONTS } from '../config/theme';
import { WEEK_SCHEDULE, BLOCK_COLORS } from '../data/schedule';
import { getDateStr, getTodayStr } from '../hooks/useStorage';

const ENERGY_STYLE = {
  deep_work: { bg: C.tealSoft,  color: C.teal,  border: C.tealBorder,           label: 'Deep' },
  medium:    { bg: C.blueSoft,  color: C.blue,  border: 'rgba(91,156,246,.22)',  label: 'Med'  },
  light:     { bg: C.greenSoft, color: C.green, border: C.greenBorder,           label: 'Light'},
};

function getTodayIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

// Get the dateStr for a given day index this week (Mon=0)
function getWeekDateStr(dayIndex) {
  const now = new Date();
  const dow = now.getDay() === 0 ? 7 : now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - dow + 1);
  const d = new Date(monday);
  d.setDate(monday.getDate() + dayIndex);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export default function WeekView({ getTasksForDate, getManualTasksForDate }) {
  const todayIdx    = getTodayIndex();
  const [activeDay, setActiveDay] = useState(todayIdx);

  const now = new Date();
  const dow = now.getDay() === 0 ? 7 : now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - dow + 1);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.getDate();
  });

  const activeDay_ = WEEK_SCHEDULE[activeDay];
  const activeDateStr = getWeekDateStr(activeDay);
  const aiTasks    = getTasksForDate ? (getTasksForDate(activeDateStr) || null) : null;
  const manTasks   = getManualTasksForDate ? (getManualTasksForDate(activeDateStr) || []) : [];
  const hasUserTasks = (aiTasks?.tasks?.length > 0) || manTasks.length > 0;

  return (
    <div style={{ padding: '18px 18px 90px', overflowY: 'auto', flex: 1, scrollbarWidth: 'none' }}>

      {/* Day pills */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 20, scrollbarWidth: 'none' }}>
        {WEEK_SCHEDULE.map((day, i) => {
          const isToday  = i === todayIdx;
          const isActive = i === activeDay;
          const bottomColor = day.recording ? C.teal : day.gym ? C.red : 'transparent';
          return (
            <div
              key={day.day}
              onClick={() => setActiveDay(i)}
              style={{
                flexShrink: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '9px 12px', borderRadius: 9, cursor: 'pointer',
                border: `1px solid ${isActive ? C.tealBorder : C.border}`,
                borderBottom: `2px solid ${isActive ? C.teal : isToday ? bottomColor : 'transparent'}`,
                background: isActive ? C.tealSoft : C.bg2,
                minWidth: 48, transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3, color: isActive ? C.teal : C.text3 }}>
                {day.day}
              </div>
              <div style={{ fontFamily: FONTS.display, fontSize: 16, color: isActive ? C.teal : isToday ? C.text : C.text2 }}>
                {dates[i]}
              </div>
              {isToday && !isActive && (
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.teal, marginTop: 3 }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Active day header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: activeDay_.primaryColor || C.teal }} />
          <div style={{ fontFamily: FONTS.display, fontSize: 17, fontWeight: 600, color: C.text }}>
            {activeDay_.dayFull}
          </div>
          {activeDay === todayIdx && (
            <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 20, background: C.tealSoft, color: C.teal, border: `1px solid ${C.tealBorder}` }}>
              Today
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: C.text3 }}>{activeDay_.primary}</div>
      </div>

      {/* MIT for this day */}
      {(aiTasks?.mit || activeDay_?.mit) && (
        <div style={{
          background: 'linear-gradient(135deg,#0A1915 0%,#080F0D 100%)',
          border: `1px solid ${C.tealBorder}`,
          borderRadius: 12, padding: '12px 14px', marginBottom: 14,
        }}>
          <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.tealDim, marginBottom: 5, fontWeight: 600 }}>
            MIT
          </div>
          <div style={{ fontSize: 14, color: C.text, fontFamily: FONTS.display, fontWeight: 600 }}>
            {aiTasks?.mit || activeDay_?.mit}
          </div>
        </div>
      )}

      {/* Schedule blocks for this day */}
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.09em', textTransform: 'uppercase', color: C.text3, marginBottom: 8 }}>
        Time blocks
      </div>
      <div style={{ marginBottom: 18 }}>
        {(activeDay_?.blocks || []).map((block, i) => {
          const lcolor = BLOCK_COLORS[block.type] || C.text3;
          return (
            <div
              key={i}
              style={{
                background: C.bg2,
                border: `1px solid ${C.border}`,
                borderLeft: `2px solid ${lcolor}`,
                borderRadius: 11, padding: '10px 13px',
                marginBottom: 5,
                display: 'flex', alignItems: 'center', gap: 12,
                opacity: block.locked ? 0.45 : 1,
              }}
            >
              <div style={{ fontSize: 10, color: C.text3, minWidth: 50, fontWeight: 300, lineHeight: 1.4 }}>
                {block.time}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: C.text }}>{block.title}</div>
                <div style={{ fontSize: 11, color: C.text3 }}>{block.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* User tasks for this day */}
      {hasUserTasks && (
        <>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.09em', textTransform: 'uppercase', color: C.text3, marginBottom: 8 }}>
            Tasks
          </div>

          {/* AI-sorted tasks */}
          {(aiTasks?.tasks || []).map((t, i) => {
            const es = ENERGY_STYLE[t.energy] || ENERGY_STYLE.medium;
            return (
              <div key={`ai_${i}`} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', marginBottom: 5,
                background: C.bg2, border: `1px solid ${C.border}`,
                borderLeft: `2px solid ${C.teal}`,
                borderRadius: 10,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: C.text2 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: C.text3, marginTop: 2, display: 'flex', gap: 6, alignItems: 'center' }}>
                    {t.mins && <span>{t.mins} min</span>}
                    <span style={{
                      fontSize: 9, padding: '2px 7px', borderRadius: 20,
                      background: es.bg, color: es.color, border: `1px solid ${es.border}`,
                    }}>
                      {es.label}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: 9, padding: '2px 7px', borderRadius: 20, background: C.tealSoft, color: C.tealDim, border: `1px solid ${C.tealBorder}` }}>
                  AI
                </div>
              </div>
            );
          })}

          {/* Manual tasks */}
          {manTasks.map(t => {
            const es = ENERGY_STYLE[t.energy] || ENERGY_STYLE.medium;
            return (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', marginBottom: 5,
                background: C.bg2, border: `1px solid ${C.border}`,
                borderLeft: `2px solid ${C.purple}`,
                borderRadius: 10,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: C.text2 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: C.text3, marginTop: 2, display: 'flex', gap: 6, alignItems: 'center' }}>
                    {t.mins && <span>{t.mins} min</span>}
                    <span style={{
                      fontSize: 9, padding: '2px 7px', borderRadius: 20,
                      background: es.bg, color: es.color, border: `1px solid ${es.border}`,
                    }}>
                      {es.label}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: 9, padding: '2px 7px', borderRadius: 20, background: C.purpleSoft, color: C.purple, border: `1px solid ${C.purpleBorder}` }}>
                  Manual
                </div>
              </div>
            );
          })}

          {/* Parked tasks */}
          {aiTasks?.parked?.length > 0 && (
            <div style={{
              marginTop: 6, fontSize: 11, color: C.text3, lineHeight: 1.6,
              background: C.bg3, borderRadius: 9, padding: '9px 12px',
            }}>
              <strong style={{ color: C.text2 }}>Parked:</strong> {aiTasks.parked.join(', ')}
            </div>
          )}
        </>
      )}

      {!hasUserTasks && (
        <div style={{
          background: C.bg2, border: `1px solid ${C.border}`,
          borderRadius: 12, padding: '14px 16px',
          fontSize: 12, color: C.text3, lineHeight: 1.6,
        }}>
          No tasks added yet for {activeDay_.dayFull}. Use the Dump tab to plan this day or add tasks manually.
        </div>
      )}
    </div>
  );
}
