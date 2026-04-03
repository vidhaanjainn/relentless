// ============================================================
// App.js — Root component.
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { C, FONTS } from './config/theme';
import { WEEK_SCHEDULE } from './data/schedule';
import { useStorage, getTodayStr } from './hooks/useStorage';

import DayBar         from './components/DayBar';
import MITCard        from './components/MITCard';
import ScheduleBlocks from './components/ScheduleBlocks';
import StreakGrid      from './components/StreakGrid';
import FocusView      from './components/FocusView';
import DumpView       from './components/DumpView';
import WeekView       from './components/WeekView';
import SettingsView   from './components/SettingsView';
import MindsetSheet   from './components/MindsetSheet';

// ── Helpers ──────────────────────────────────────────────────
function getTodayDayIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

function getDateLabel() {
  return new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

// ── Burst overlay ────────────────────────────────────────────
function BurstOverlay({ show }) {
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%',
      width: 50, height: 50, borderRadius: '50%',
      background: `radial-gradient(circle, ${C.green} 0%, transparent 70%)`,
      transform: 'translate(-50%,-50%) scale(0)',
      pointerEvents: 'none', zIndex: 999,
      animation: 'rl-burst 0.45s ease-out forwards',
    }} />
  );
}

// ── Toast ────────────────────────────────────────────────────
function Toast({ msg, ok }) {
  if (!msg) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 84, left: '50%',
      transform: 'translateX(-50%)',
      background: C.bg3,
      border: `1px solid ${ok ? C.greenBorder : C.border2}`,
      borderRadius: 9, padding: '10px 18px',
      fontSize: 12, color: ok ? C.green : C.text,
      zIndex: 998, whiteSpace: 'nowrap',
      animation: 'rl-fadein 0.28s ease',
      maxWidth: '88vw', textAlign: 'center',
    }}>
      {msg}
    </div>
  );
}

// ── Bottom Nav ───────────────────────────────────────────────
const TABS = [
  { id: 'home',  icon: '◈', label: 'Today' },
  { id: 'focus', icon: '◎', label: 'Focus' },
  { id: 'dump',  icon: '⊕', label: 'Dump'  },
  { id: 'week',  icon: '▦', label: 'Week'  },
];

function BottomNav({ active, onChange }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(8,8,9,0.96)',
      backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
      borderTop: `1px solid ${C.border}`,
      display: 'flex', padding: '10px 0 24px', zIndex: 100,
    }}>
      {TABS.map(t => (
        <div
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 3,
            cursor: 'pointer', padding: '5px 0',
            opacity: active === t.id ? 1 : 0.3,
            transition: 'opacity 0.2s',
          }}
        >
          <div style={{ fontSize: 19, lineHeight: 1 }}>{t.icon}</div>
          <div style={{ fontSize: 9, color: active === t.id ? C.teal : C.text2, letterSpacing: '0.03em' }}>
            {t.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const {
    loaded,
    streaks,
    tasks,                   // today's AI tasks
    getTasksForDate,
    saveTasksForDate,
    manualTasks,
    addManualTask,
    removeManualTask,
    getManualTasksForDate,
    blocks,
    toggleBlock,
    isBlockDone,
    sessions,
    addSession,
    bumpStreak,
    dropStreak,
    wins,
    markWin,
    unmarkWin,
    mitDone,
    toggleMIT,
    callCount,
    estimatedCostRs,
    bumpCallCount,
  } = useStorage();

  const [tab,          setTab]          = useState('home');
  const [sheet,        setSheet]        = useState(null);
  const [burst,        setBurst]        = useState(false);
  const [toast,        setToast]        = useState({ msg: '', ok: false });
  const [showSettings, setShowSettings] = useState(false);

  const todayIdx   = getTodayDayIndex();
  const todayDay   = WEEK_SCHEDULE[todayIdx];
  const mitText    = tasks?.mit         || todayDay?.mit         || 'Record one reel today';
  const microStart = tasks?.micro_start || todayDay?.microStart  || 'Open the doc and start';

  // ── Toast ────────────────────────────────────────────────────
  const showToast = useCallback((msg, ok = false) => {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg: '', ok: false }), 3200);
  }, []);

  // ── Haptic ───────────────────────────────────────────────────
  const haptic = useCallback((pattern = [10]) => {
    try { navigator.vibrate?.(pattern); } catch(e) {}
  }, []);

  // ── Celebrate ────────────────────────────────────────────────
  const celebrate = useCallback(() => {
    setBurst(true);
    setTimeout(() => setBurst(false), 500);
    haptic([10, 50, 10]);
  }, [haptic]);

  // ── MIT toggle ───────────────────────────────────────────────
  const handleToggleMIT = useCallback(() => {
    const nowDone = !mitDone;
    toggleMIT();
    if (nowDone) {
      celebrate();
      bumpStreak('mit');
      showToast("MIT done. That's the one that matters. ✦", true);
    } else {
      dropStreak('mit');
    }
  }, [mitDone, toggleMIT, celebrate, bumpStreak, dropStreak, showToast]);

  // ── Block tick ───────────────────────────────────────────────
  const handleTick = useCallback((blockId, streakType) => {
    const nowDone = !isBlockDone(blockId);
    toggleBlock(blockId);
    if (nowDone) {
      celebrate();
      if (streakType === 'rec') { bumpStreak('rec'); markWin('rec'); showToast('Recording logged 🎬', true); }
      if (streakType === 'gym') { bumpStreak('gym'); markWin('gym'); showToast('Gym logged 💪', true); }
    } else {
      if (streakType === 'rec') { dropStreak('rec'); unmarkWin('rec'); }
      if (streakType === 'gym') { dropStreak('gym'); unmarkWin('gym'); }
    }
  }, [isBlockDone, toggleBlock, celebrate, bumpStreak, dropStreak, markWin, unmarkWin, showToast]);

  // ── Session complete ─────────────────────────────────────────
  const handleSessionComplete = useCallback((sessionData) => {
    addSession(sessionData);
    celebrate();
    showToast('Session complete 🎯 Take a break.', true);
  }, [addSession, celebrate, showToast]);

  // ── Scheduled nudges ─────────────────────────────────────────
  useEffect(() => {
    const now = new Date();
    const h = now.getHours(), m = now.getMinutes();
    if (h === 14 && m >= 30 && m < 35) showToast('Camera setup time. 3 PM window opens in 30 min.');
    if (h === 16 && m >= 50 && m < 55) setSheet('gym');
    if (h === 21 && m >= 0  && m < 5 ) showToast('Night dump time. What needs to happen tomorrow?');
    if (h === 22 && m >= 30 && m < 35) showToast('Still no dump. Quick — what needs to happen tomorrow?');
  }, []); // eslint-disable-line

  // ── Loading ──────────────────────────────────────────────────
  if (!loaded) {
    return (
      <div style={{
        background: C.bg, height: '100dvh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16,
      }}>
        <div style={{ fontSize: 36 }}>⚡</div>
        <div style={{ color: C.text3, fontSize: 13, fontFamily: FONTS.body }}>Loading...</div>
      </div>
    );
  }

  // ── Wins ─────────────────────────────────────────────────────
  const winItems = [
    wins.prep && 'Script prepared',
    wins.rec  && 'Reel recorded',
    wins.gym  && 'Gym done',
    mitDone   && 'MIT completed ✦',
  ].filter(Boolean);

  // ═══════════════════════════
  // RENDER
  // ═══════════════════════════
  return (
    <div style={{
      background: C.bg, height: '100dvh',
      fontFamily: FONTS.body, color: C.text,
      maxWidth: 480, margin: '0 auto',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', position: 'relative',
    }}>
      <style>{`
        @keyframes rl-pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.75)} }
        @keyframes rl-pop     { 0%{transform:scale(.5)} 100%{transform:scale(1)} }
        @keyframes rl-burst   { 0%{transform:translate(-50%,-50%) scale(0);opacity:1} 100%{transform:translate(-50%,-50%) scale(2.8);opacity:0} }
        @keyframes rl-fadein  { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes rl-fade    { from{opacity:0} to{opacity:1} }
        @keyframes rl-slideup { from{transform:translateY(100%)} to{transform:translateY(0)} }
        * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
        ::-webkit-scrollbar { display:none; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
      `}</style>

      {/* ── SETTINGS ── */}
      {showSettings && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: C.bg }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 0', flexShrink: 0 }}>
            <span style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: C.teal }}>Settings</span>
            <div
              onClick={() => setShowSettings(false)}
              style={{ width: 33, height: 33, borderRadius: '50%', background: C.bg3, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 13, color: C.text2 }}
            >✕</div>
          </div>
          <SettingsView callCount={callCount} estimatedCostRs={estimatedCostRs} />
        </div>
      )}

      {!showSettings && (
        <>
          {/* ── TOPBAR ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 0', flexShrink: 0, zIndex: 10 }}>
            <span style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, letterSpacing: '0.02em', color: C.teal }}>
              Relentless
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, color: C.text3, fontWeight: 300 }}>{getDateLabel()}</span>
              <div
                onClick={() => setShowSettings(true)}
                style={{ width: 33, height: 33, borderRadius: '50%', background: C.bg3, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 13, color: C.text2 }}
              >⚙</div>
            </div>
          </div>

          {/* ── DAY BAR ── */}
          <DayBar />

          {/* ══ HOME ══ */}
          {tab === 'home' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 90px', scrollbarWidth: 'none' }}>
              <div style={{ fontSize: 10, color: C.text3, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 300 }}>
                {getGreeting()}
              </div>
              <div style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 600, lineHeight: 1.2, marginBottom: 20 }}>
                Hey Vidhaan,<br />
                <span style={{ color: C.teal }}>
                  {todayDay?.recording ? 'record today.' : todayDay?.primary === 'BedBox' ? 'BedBox day.' : todayDay?.primary === 'SaaS' ? "let's build." : 'one job today.'}
                </span>
              </div>

              <MITCard
                tasks={tasks}
                microStart={microStart}
                onStartFocus={() => setTab('focus')}
                onSheet={setSheet}
                mitDone={mitDone}
                onToggleMIT={handleToggleMIT}
              />

              {/* Mindset */}
              <div
                onClick={() => setSheet('energy')}
                style={{
                  background: C.bg2, border: `1px solid ${C.border}`,
                  borderLeft: `2px solid ${C.purple}`,
                  borderRadius: 14, padding: '13px 15px',
                  marginBottom: 14, cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: C.purple, marginBottom: 6, fontWeight: 600 }}>
                  ✦ Today's mindset
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: C.text2 }}>
                  <strong style={{ color: C.text, fontWeight: 500 }}>Energy follows action.</strong> You don't get energy before starting — you get it 90 seconds in. The window is open. Set up the camera.
                </div>
              </div>

              {/* Today's blocks */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.09em', textTransform: 'uppercase', color: C.text3 }}>
                  Today's blocks
                </span>
                <span onClick={() => setTab('week')} style={{ fontSize: 12, color: C.teal, cursor: 'pointer' }}>
                  Full week →
                </span>
              </div>
              <ScheduleBlocks
                blocks={todayDay?.blocks || []}
                isBlockDone={isBlockDone}
                onTick={handleTick}
              />

              {/* Streaks */}
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.09em', textTransform: 'uppercase', color: C.text3, marginBottom: 10 }}>
                Streaks
              </div>
              <StreakGrid streaks={streaks} />

              {/* Wins */}
              <div style={{
                background: C.bg2,
                border: `1px solid ${winItems.length > 0 ? C.greenBorder : C.border}`,
                borderRadius: 14, padding: '13px 15px',
              }}>
                <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: C.green, marginBottom: 8 }}>
                  ✦ Wins today
                </div>
                {winItems.length === 0
                  ? <div style={{ fontSize: 12, color: C.text3 }}>Tick off your blocks above — wins log here.</div>
                  : winItems.map((w, i) => (
                    <div key={i} style={{ fontSize: 13, color: C.text2, padding: '4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: C.green, fontSize: 10 }}>✦</span> {w}
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* ══ FOCUS ══ */}
          {tab === 'focus' && (
            <FocusView
              mitText={mitText}
              onSessionComplete={handleSessionComplete}
              onSheet={setSheet}
            />
          )}

          {/* ══ DUMP ══ */}
          {tab === 'dump' && (
            <DumpView
              saveTasksForDate={saveTasksForDate}
              getManualTasksForDate={getManualTasksForDate}
              addManualTask={addManualTask}
              removeManualTask={removeManualTask}
              bumpCallCount={bumpCallCount}
            />
          )}

          {/* ══ WEEK ══ */}
          {tab === 'week' && (
            <WeekView
              getTasksForDate={getTasksForDate}
              getManualTasksForDate={getManualTasksForDate}
            />
          )}

          <BottomNav active={tab} onChange={setTab} />
        </>
      )}

      <MindsetSheet type={sheet} onClose={() => setSheet(null)} />
      <BurstOverlay show={burst} />
      <Toast msg={toast.msg} ok={toast.ok} />
    </div>
  );
}
