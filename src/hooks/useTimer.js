// ============================================================
// useTimer.js — Pomodoro timer logic + Web Audio beeps
// Three modes: deep (50m), attack (25m), rest (10m)
// Sound via Web Audio API — no external files needed
// ============================================================

import { useState, useRef, useCallback, useEffect } from 'react';

export const MODES = {
  deep:   { label: 'Deep · 50m',   mins: 50, phase: 'DEEP WORK',    color: '#00E5C3' },
  attack: { label: 'Attack · 25m', mins: 25, phase: 'ATTACK MODE',  color: '#A594F9' },
  rest:   { label: 'Rest · 10m',   mins: 10, phase: 'RECOVERY',     color: '#2EFF8A' },
};

export function useTimer({ onSessionComplete }) {
  const [mode,    setModeState] = useState('deep');
  const [sec,     setSec]       = useState(MODES.deep.mins * 60);
  const [running, setRunning]   = useState(false);
  const [sessOK,  setSessOK]    = useState(0);  // completed sessions today

  const total   = MODES[mode].mins * 60;
  const pct     = sec / total; // 1 → 0
  const circumference = 2 * Math.PI * 90; // r=90
  const strokeOffset  = circumference * pct;

  const intervalRef = useRef(null);
  const audioCtxRef = useRef(null);

  // ── Audio ─────────────────────────────────────────────────
  function initAudio() {
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch(e) {}
    }
    // Mobile Safari requires resume() after user gesture
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
  }

  function haptic(pattern = [10]) {
    try { navigator.vibrate?.(pattern); } catch(e) {}
  }

  function beep(freq = 660, duration = 0.35) {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    try {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch(e) {}
  }

  // ── Timer tick ────────────────────────────────────────────
  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSec(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setSessOK(s => s + 1);
          beep(880, 0.4);
          onSessionComplete?.({ type: mode, mins: MODES[mode].mins });
          return 0;
        }
        if (prev === 61) { beep(440, 0.2); haptic([15]); } // 1 min warning
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, mode]); // eslint-disable-line

  // ── Controls ──────────────────────────────────────────────
  const toggle = useCallback(() => {
    initAudio(); // must happen on user gesture
    setRunning(r => !r);
  }, []);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setSec(MODES[mode].mins * 60);
  }, [mode]);

  const setMode = useCallback((m) => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setModeState(m);
    setSec(MODES[m].mins * 60);
  }, []);

  // ── Display ───────────────────────────────────────────────
  const mins = Math.floor(sec / 60);
  const secs = sec % 60;
  const display = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

  return {
    mode, sec, running, sessOK, total,
    display, strokeOffset, circumference,
    toggle, reset, setMode,
  };
}
