// ============================================================
// useStorage.js — All data persistence lives here.
// Same pattern as vidhaan-gym. Swap point for Supabase later.
//
// Keys (prefix "rl:"):
//   rl:streaks    → { rec: N, gym: N, mit: N, lastRecDate, lastGymDate }
//   rl:tasks      → { mit, microStart, tasks[], parked[], note, date }
//   rl:blocks     → { [dateStr]: { [blockId]: bool } }
//   rl:sessions   → [{ type, mins, completedAt, taskName }]
//   rl:callcount  → N
//   rl:wins       → { [dateStr]: { rec, gym, prep } }
// ============================================================

import { useState, useEffect, useCallback } from 'react';

const PREFIX = 'rl:';

function load(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) { console.warn('Storage write failed:', e); }
}

export function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export function useStorage() {
  const [streaks,   setStreaks]   = useState({ rec: 0, gym: 0, mit: 0 });
  const [tasks,     setTasks]     = useState(null);   // AI-sorted task data for today
  const [blocks,    setBlocks]    = useState({});      // checked blocks by date
  const [sessions,  setSessions]  = useState([]);      // completed pomodoro sessions
  const [callCount, setCallCount] = useState(0);
  const [wins,      setWins]      = useState({});
  const [loaded,    setLoaded]    = useState(false);

  useEffect(() => {
    setStreaks(  load('streaks')   || { rec: 0, gym: 0, mit: 0 });
    setTasks(    load('tasks')     || null);
    setBlocks(   load('blocks')    || {});
    setSessions( load('sessions')  || []);
    setCallCount(load('callcount') || 0);
    setWins(     load('wins')      || {});
    setLoaded(true);
  }, []);

  // ── Tasks (AI dump result) ────────────────────────────────
  const saveTasks = useCallback((data) => {
    const withDate = { ...data, date: getTodayStr() };
    setTasks(withDate);
    save('tasks', withDate);
  }, []);

  // ── Block check/uncheck ───────────────────────────────────
  const toggleBlock = useCallback((blockId, dateStr = null) => {
    const target = dateStr || getTodayStr();
    setBlocks(prev => {
      const day  = prev[target] || {};
      const next = { ...prev, [target]: { ...day, [blockId]: !day[blockId] } };
      save('blocks', next);
      return next;
    });
  }, []);

  const isBlockDone = useCallback((blockId, dateStr = null) => {
    const target = dateStr || getTodayStr();
    return !!(blocks[target] || {})[blockId];
  }, [blocks]);

  // ── Streaks — idempotent per day ──────────────────────────
  // bumpStreak: increments only if not already done today
  // dropStreak: decrements only if was done today (for untick)
  const bumpStreak = useCallback((type) => {
    const today = getTodayStr();
    const lastKey = `last${type.charAt(0).toUpperCase() + type.slice(1)}Date`;
    setStreaks(prev => {
      if (prev[lastKey] === today) return prev; // already counted today
      const next = { ...prev, [type]: (prev[type] || 0) + 1, [lastKey]: today };
      save('streaks', next);
      return next;
    });
  }, []);

  const dropStreak = useCallback((type) => {
    const today = getTodayStr();
    const lastKey = `last${type.charAt(0).toUpperCase() + type.slice(1)}Date`;
    setStreaks(prev => {
      if (prev[lastKey] !== today) return prev; // wasn't counted today, nothing to drop
      const next = { ...prev, [type]: Math.max(0, (prev[type] || 0) - 1), [lastKey]: null };
      save('streaks', next);
      return next;
    });
  }, []);

  // ── Wins log ──────────────────────────────────────────────
  const markWin = useCallback((winType) => {
    // winType: 'rec' | 'gym' | 'prep'
    const today = getTodayStr();
    setWins(prev => {
      const next = { ...prev, [today]: { ...(prev[today] || {}), [winType]: true } };
      save('wins', next);
      return next;
    });
  }, []);

  const getTodayWins = useCallback(() => {
    return wins[getTodayStr()] || {};
  }, [wins]);

  // ── Sessions (pomodoro) ───────────────────────────────────
  const addSession = useCallback((sessionData) => {
    setSessions(prev => {
      const next = [...prev, { ...sessionData, completedAt: new Date().toISOString() }];
      // Keep last 100 sessions
      const trimmed = next.slice(-100);
      save('sessions', trimmed);
      return trimmed;
    });
  }, []);

  // ── Call counter (for cost transparency) ─────────────────
  const bumpCallCount = useCallback(() => {
    setCallCount(prev => {
      const next = prev + 1;
      save('callcount', next);
      return next;
    });
  }, []);

  // Estimated cost: Claude Haiku ~$0.0028/call → ~₹0.24/call
  const estimatedCostRs = (callCount * 0.24).toFixed(2);

  return {
    loaded,
    streaks,
    tasks,
    blocks,
    sessions,
    callCount,
    estimatedCostRs,
    wins: getTodayWins(),
    saveTasks,
    toggleBlock,
    isBlockDone,
    bumpStreak,
    dropStreak,
    markWin,
    addSession,
    bumpCallCount,
  };
}
