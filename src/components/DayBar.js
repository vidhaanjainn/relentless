// DayBar.js — ADHD time blindness fix: thin progress bar showing
// where you are in the day between 10 AM and 6:30 PM.
// Always visible at the top of every screen.
import { useState, useEffect } from 'react';
import { C } from '../config/theme';

const DAY_START = 10 * 60;      // 10:00 AM in minutes
const DAY_END   = 18 * 60 + 30; // 6:30 PM in minutes

function getNowMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function getPct() {
  const mins = getNowMinutes();
  return Math.min(100, Math.max(0, (mins - DAY_START) / (DAY_END - DAY_START) * 100));
}

export default function DayBar() {
  const [pct, setPct] = useState(getPct);

  // Update every minute
  useEffect(() => {
    const interval = setInterval(() => setPct(getPct()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: 2, background: C.bg3, flexShrink: 0, position: 'relative', margin: '10px 20px 0' }}>
      <div style={{
        height: '100%',
        width:  `${pct}%`,
        background: `linear-gradient(90deg, ${C.teal}, ${C.green})`,
        borderRadius: 1,
        transition: 'width 60s linear',
      }} />
      <span style={{
        position:   'absolute',
        right:      0, top: -15,
        fontSize:   9, color: C.text3,
        letterSpacing: '0.05em',
      }}>
        6:30 PM
      </span>
    </div>
  );
}
