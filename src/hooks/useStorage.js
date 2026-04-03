// ============================================================
// useStorage.js — All data persistence lives here.
//
// Keys (prefix "rl:"):
//   rl:streaks     → { rec, gym, mit, lastRecDate, lastGymDate, lastMitDate }
//   rl:tasks       → { [dateStr]: { mit, micro_start, tasks[], parked[], note } }
//   rl:manualTasks → { [dateStr]: [{ id, name, energy, mins, why }] }
//   rl:blocks      → { [dateStr]: { [blockId]: bool } }
//   rl:sessions    → [{ type, mins, completedAt, taskName }]
//   rl:callcount   → N
//   rl:wins        → { [dateStr]: { rec, gym, prep } }
//   rl:mitdone     → { [dateStr]: bool }
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

export function getDateStr(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// Migrate old flat rl:tasks → new date-keyed format
function migrateTasks(raw) {
  if (!raw) return {};
  // Already new format — keys look like dates
  const keys = Object.keys(raw);
  if (keys.length === 0) return {};
  if (keys[0].match(/^\d{4}-\d{2}-\d{2}$/)) return raw;
  // Old flat format — migrate to today
  const { date: _d, ...clean } = raw;
  return { [getTodayStr()]: clean };
}

export function useStorage() {
  const [streaks,     setStreaks]     = useState({ rec: 0, gym: 0, mit: 0 });
  const [tasksMap,    setTasksMap]    = useState({});
  const [manualTasks, setManualTasks] = useState({});
  const [blocks,      setBlocks]      = useState({});
  const [sessions,    setSessions]    = useState([]);
  const [callCount,   setCallCount]   = useState(0);
  const [wins,        setWins]        = useState({});
  const [mitDoneMap,  setMitDoneMap]  = useState({});
  const [loaded,      setLoaded]      = useState(false);

  useEffect(() => {
    setStreaks(     load('streaks')     || { rec: 0, gym: 0, mit: 0 });
    setTasksMap(    migrateTasks(load('tasks')));
    setManualTasks( load('manualTasks') || {});
    setBlocks(      load('blocks')      || {});
    setSessions(    load('sessions')    || []);
    setCallCount(   load('callcount')   || 0);
    setWins(        load('wins')        || {});
    setMitDoneMap(  load('mitdone')     || {});
    setLoaded(true);
  }, []);

  // ── AI Tasks — save for specific date ────────────────────────
  const saveTasksForDate = useCallback((data, dateStr) => {
    const target = dateStr || getTodayStr();
    const { date: _d, ...clean } = data;
    setTasksMap(prev => {
      const next = { ...prev, [target]: clean };
      save('tasks', next);
      return next;
    });
  }, []);

  const getTasksForDate = useCallback((dateStr) => {
    return tasksMap[dateStr || getTodayStr()] || null;
  }, [tasksMap]);

  // ── Manual Tasks ─────────────────────────────────────────────
  const addManualTask = useCallback((task, dateStr) => {
    const target = dateStr || getTodayStr();
    const newTask = {
      id: `mt_${Date.now()}`,
      name: task.name,
      energy: task.energy || 'medium',
      mins: task.mins || null,
      why: task.why || '',
    };
    setManualTasks(prev => {
      const next = { ...prev, [target]: [...(prev[target] || []), newTask] };
      save('manualTasks', next);
      return next;
    });
    return newTask;
  }, []);

  const removeManualTask = useCallback((taskId, dateStr) => {
    const target = dateStr || getTodayStr();
    setManualTasks(prev => {
      const next = { ...prev, [target]: (prev[target] || []).filter(t => t.id !== taskId) };
      save('manualTasks', next);
      return next;
    });
  }, []);

  const getManualTasksForDate = useCallback((dateStr) => {
    return manualTasks[dateStr || getTodayStr()] || [];
  }, [manualTasks]);

  // ── MIT done toggle ───────────────────────────────────────────
  const toggleMIT = useCallback(() => {
    const today = getTodayStr();
    setMitDoneMap(prev => {
      const next = { ...prev, [today]: !prev[today] };
      save('mitdone', next);
      return next;
    });
  }, []);

  const isMITDone = useCallback((dateStr) => {
    return !!mitDoneMap[dateStr || getTodayStr()];
  }, [mitDoneMap]);

  // ── Block check/uncheck ───────────────────────────────────────
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

  // ── Streaks ───────────────────────────────────────────────────
  const bumpStreak = useCallback((type) => {
    const today = getTodayStr();
    const lastKey = `last${type.charAt(0).toUpperCase() + type.slice(1)}Date`;
    setStreaks(prev => {
      if (prev[lastKey] === today) return prev;
      const next = { ...prev, [type]: (prev[type] || 0) + 1, [lastKey]: today };
      save('streaks', next);
      return next;
    });
  }, []);

  const dropStreak = useCallback((type) => {
    const today = getTodayStr();
    const lastKey = `last${type.charAt(0).toUpperCase() + type.slice(1)}Date`;
    setStreaks(prev => {
      if (prev[lastKey] !== today) return prev;
      const next = { ...prev, [type]: Math.max(0, (prev[type] || 0) - 1), [lastKey]: null };
      save('streaks', next);
      return next;
    });
  }, []);

  // ── Wins ──────────────────────────────────────────────────────
  const markWin = useCallback((winType) => {
    const today = getTodayStr();
    setWins(prev => {
      const next = { ...prev, [today]: { ...(prev[today] || {}), [winType]: true } };
      save('wins', next);
      return next;
    });
  }, []);

  const unmarkWin = useCallback((winType) => {
    const today = getTodayStr();
    setWins(prev => {
      const day = { ...(prev[today] || {}) };
      delete day[winType];
      const next = { ...prev, [today]: day };
      save('wins', next);
      return next;
    });
  }, []);

  const getTodayWins = useCallback(() => {
    return wins[getTodayStr()] || {};
  }, [wins]);

  // ── Sessions ──────────────────────────────────────────────────
  const addSession = useCallback((sessionData) => {
    setSessions(prev => {
      const trimmed = [...prev, { ...sessionData, completedAt: new Date().toISOString() }].slice(-100);
      save('sessions', trimmed);
      return trimmed;
    });
  }, []);

  // ── Call counter ──────────────────────────────────────────────
  const bumpCallCount = useCallback(() => {
    setCallCount(prev => {
      const next = prev + 1;
      save('callcount', next);
      return next;
    });
  }, []);

  return {
    loaded,
    streaks,
    tasks: getTasksForDate(getTodayStr()),   // today's AI tasks (convenience)
    tasksMap,
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
    wins: getTodayWins(),
    markWin,
    unmarkWin,
    mitDone: isMITDone(),
    isMITDone,
    toggleMIT,
    callCount,
    estimatedCostRs: (callCount * 0.24).toFixed(2),
    bumpCallCount,
  };
}
