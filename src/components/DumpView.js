// DumpView.js — Task dump screen with Claude AI sorting + manual task add
import { useState } from 'react';
import { C, FONTS, S } from '../config/theme';
import { sortDump, fallbackSort } from '../services/ai';
import { getTodayStr, getDateStr } from '../hooks/useStorage';

const ENERGY_STYLE = {
  deep_work: { bg: C.tealSoft,  color: C.teal,  border: C.tealBorder,            label: 'Deep work' },
  medium:    { bg: C.blueSoft,  color: C.blue,  border: 'rgba(91,156,246,.22)',   label: 'Medium'    },
  light:     { bg: C.greenSoft, color: C.green, border: C.greenBorder,            label: 'Light'     },
};

const ENERGY_OPTIONS = ['deep_work', 'medium', 'light'];

export default function DumpView({ saveTasksForDate, getManualTasksForDate, addManualTask, removeManualTask, bumpCallCount }) {
  const [mode,        setMode]        = useState('tomorrow');
  const [text,        setText]        = useState('');
  const [loading,     setLoading]     = useState(false);
  const [result,      setResult]      = useState(null);
  const [error,       setError]       = useState('');

  // Manual task form
  const [showManual,  setShowManual]  = useState(false);
  const [manualDay,   setManualDay]   = useState('tomorrow');
  const [manualName,  setManualName]  = useState('');
  const [manualEnergy, setManualEnergy] = useState('medium');
  const [manualMins,  setManualMins]  = useState('');

  const targetDate = mode === 'today' ? getTodayStr() : getDateStr(1);
  const manualDate = manualDay === 'today' ? getTodayStr() : getDateStr(1);
  const manualTasksForDay = getManualTasksForDate(manualDate);

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      bumpCallCount();
      const data = await sortDump({ rawText: text, mode });
      setResult(data);
      saveTasksForDate(data, targetDate);
    } catch (err) {
      if (err.message === 'NO_KEY') {
        setError('No API key. Set REACT_APP_CLAUDE_KEY in .env.local');
        const data = fallbackSort(text);
        setResult(data);
        saveTasksForDate(data, targetDate);
      } else {
        setError(`Error: ${err.message}`);
        const data = fallbackSort(text);
        setResult(data);
        saveTasksForDate(data, targetDate);
      }
    }
    setLoading(false);
  }

  function handleAddManual() {
    if (!manualName.trim()) return;
    addManualTask({
      name: manualName.trim(),
      energy: manualEnergy,
      mins: manualMins ? parseInt(manualMins) : null,
    }, manualDate);
    setManualName('');
    setManualMins('');
  }

  const dayLabel = mode === 'today' ? 'today' : 'tomorrow';
  const manualDayLabel = manualDay === 'today' ? 'today' : 'tomorrow';

  return (
    <div style={{ padding: '18px 18px 90px', overflowY: 'auto', flex: 1, scrollbarWidth: 'none' }}>

      {/* Header */}
      <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 4 }}>
        What's on your mind?
      </div>
      <div style={{ fontSize: 13, color: C.text3, marginBottom: 20, lineHeight: 1.55 }}>
        Throw everything in. Claude finds what moves the needle and builds your day.
      </div>

      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {['tomorrow', 'today'].map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setResult(null); }}
            style={{
              padding: '7px 16px', borderRadius: 20,
              fontSize: 12, cursor: 'pointer',
              border: `1px solid ${mode === m ? C.tealBorder : C.border}`,
              background: mode === m ? C.tealSoft : 'transparent',
              color: mode === m ? C.teal : C.text3,
              fontFamily: FONTS.body, transition: 'all 0.2s',
            }}
          >
            {m === 'tomorrow' ? 'Plan tomorrow' : 'Today (urgent)'}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={mode === 'today'
          ? 'Brand deal email, urgent BedBox issue, collab reply...'
          : 'Script for gold reel, reply to Vani, BedBox check, Zerodha review...'
        }
        style={{
          width: '100%', minHeight: 130,
          background: C.bg2, border: `1px solid ${C.border2}`,
          borderRadius: 14, color: C.text,
          fontFamily: FONTS.body, fontSize: 14,
          padding: 14, resize: 'none', outline: 'none', lineHeight: 1.6,
        }}
      />
      <div style={{ fontSize: 11, color: C.text3, marginTop: 6, marginBottom: 2 }}>
        Tasks will be saved to <span style={{ color: C.teal }}>{dayLabel}</span>
      </div>

      {error && (
        <div style={{ marginTop: 8, fontSize: 12, color: C.orange, lineHeight: 1.5, background: C.orangeSoft, borderRadius: 9, padding: '9px 12px' }}>
          {error} — showing basic sort below.
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !text.trim()}
        style={{
          ...S.btnPrimary, width: '100%', marginTop: 12,
          opacity: (loading || !text.trim()) ? 0.45 : 1,
          cursor: (loading || !text.trim()) ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Claude is thinking...' : `Let Claude sort this → ${dayLabel}`}
      </button>

      {loading && (
        <div style={{ textAlign: 'center', padding: '16px 0', color: C.text3, fontSize: 13 }}>
          <span style={{ color: C.teal }}>●</span> Analysing what actually moves the needle...
        </div>
      )}

      {/* AI result */}
      {result && !loading && (
        <div style={{
          background: C.bg2, border: `1px solid ${C.tealBorder}`,
          borderRadius: 14, padding: 16, marginTop: 16,
        }}>
          <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.teal, marginBottom: 4, fontWeight: 600 }}>
            ✦ Sorted for {dayLabel}
          </div>

          {/* MIT — short, clean */}
          {result.mit && (
            <div style={{
              fontFamily: FONTS.display, fontSize: 16, fontWeight: 600,
              color: C.text, marginBottom: 10, lineHeight: 1.3,
            }}>
              MIT: {result.mit}
            </div>
          )}

          {result.note && (
            <div style={{
              background: C.purpleSoft, border: `1px solid ${C.purpleBorder}`,
              borderLeft: `2px solid ${C.purple}`,
              borderRadius: 9, padding: '10px 13px', marginBottom: 12,
              fontSize: 12, color: C.text2, lineHeight: 1.6,
            }}>
              {result.note}
            </div>
          )}

          {(result.tasks || []).map((t, i) => {
            const es = ENERGY_STYLE[t.energy] || ENERGY_STYLE.medium;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '9px 0', borderBottom: `1px solid ${C.border}`,
              }}>
                <div style={{ fontSize: 11, color: C.text3, minWidth: 16, marginTop: 1, fontFamily: FONTS.display }}>{i+1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.4 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: C.text3, marginTop: 3, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {t.mins && <span>{t.mins} min</span>}
                    <span style={{
                      fontSize: 9, padding: '2px 8px', borderRadius: 20,
                      background: es.bg, color: es.color, border: `1px solid ${es.border}`,
                    }}>
                      {es.label}
                    </span>
                    {t.why && <span style={{ color: C.text3 }}>{t.why}</span>}
                  </div>
                </div>
              </div>
            );
          })}

          {result.parked?.length > 0 && (
            <div style={{
              marginTop: 10, fontSize: 11, color: C.text3, lineHeight: 1.6,
              background: C.bg3, borderRadius: 9, padding: '9px 12px',
            }}>
              <strong style={{ color: C.text2 }}>{result.parked.length} parked:</strong> {result.parked.join(', ')}
              {result.park_reason && <><br /><span>{result.park_reason}</span></>}
            </div>
          )}
        </div>
      )}

      {/* ── Divider ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '22px 0 18px' }}>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        <span style={{ fontSize: 10, color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>or add manually</span>
        <div style={{ flex: 1, height: 1, background: C.border }} />
      </div>

      {/* Manual task add */}
      <div style={{
        background: C.bg2, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: 14, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.text3 }}>
            Add task
          </span>
          {/* Day picker */}
          <div style={{ display: 'flex', gap: 5 }}>
            {['today', 'tomorrow'].map(d => (
              <button
                key={d}
                onClick={() => setManualDay(d)}
                style={{
                  padding: '4px 10px', borderRadius: 20, fontSize: 11, cursor: 'pointer',
                  border: `1px solid ${manualDay === d ? C.tealBorder : C.border}`,
                  background: manualDay === d ? C.tealSoft : 'transparent',
                  color: manualDay === d ? C.teal : C.text3,
                  fontFamily: FONTS.body,
                }}
              >
                {d === 'today' ? 'Today' : 'Tomorrow'}
              </button>
            ))}
          </div>
        </div>

        {/* Task name input */}
        <input
          value={manualName}
          onChange={e => setManualName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddManual()}
          placeholder="Task name..."
          style={{
            width: '100%', padding: '10px 12px',
            background: C.bg3, border: `1px solid ${C.border2}`,
            borderRadius: 9, color: C.text,
            fontFamily: FONTS.body, fontSize: 13,
            outline: 'none', marginBottom: 9,
          }}
        />

        <div style={{ display: 'flex', gap: 8, marginBottom: 9 }}>
          {/* Energy picker */}
          <div style={{ display: 'flex', gap: 5, flex: 1 }}>
            {ENERGY_OPTIONS.map(e => {
              const es = ENERGY_STYLE[e];
              return (
                <button
                  key={e}
                  onClick={() => setManualEnergy(e)}
                  style={{
                    flex: 1, padding: '6px 4px', borderRadius: 8, fontSize: 10, cursor: 'pointer',
                    border: `1px solid ${manualEnergy === e ? es.border : C.border}`,
                    background: manualEnergy === e ? es.bg : 'transparent',
                    color: manualEnergy === e ? es.color : C.text3,
                    fontFamily: FONTS.body,
                  }}
                >
                  {es.label}
                </button>
              );
            })}
          </div>

          {/* Mins input */}
          <input
            value={manualMins}
            onChange={e => setManualMins(e.target.value.replace(/\D/g, ''))}
            placeholder="mins"
            style={{
              width: 54, padding: '6px 10px',
              background: C.bg3, border: `1px solid ${C.border2}`,
              borderRadius: 8, color: C.text,
              fontFamily: FONTS.body, fontSize: 12,
              outline: 'none', textAlign: 'center',
            }}
          />
        </div>

        <button
          onClick={handleAddManual}
          disabled={!manualName.trim()}
          style={{
            ...S.btnPrimary, width: '100%', fontSize: 13,
            opacity: manualName.trim() ? 1 : 0.4,
            cursor: manualName.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          + Add to {manualDayLabel}
        </button>
      </div>

      {/* Manual tasks list for selected day */}
      {manualTasksForDay.length > 0 && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: C.text3, marginBottom: 8 }}>
            Manual tasks — {manualDayLabel}
          </div>
          {manualTasksForDay.map(t => {
            const es = ENERGY_STYLE[t.energy] || ENERGY_STYLE.medium;
            return (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', marginBottom: 5,
                background: C.bg2, border: `1px solid ${C.border}`,
                borderRadius: 10,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: C.text2 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: C.text3, marginTop: 2, display: 'flex', gap: 6, alignItems: 'center' }}>
                    {t.mins && <span>{t.mins} min</span>}
                    <span style={{
                      fontSize: 9, padding: '2px 8px', borderRadius: 20,
                      background: es.bg, color: es.color, border: `1px solid ${es.border}`,
                    }}>
                      {es.label}
                    </span>
                  </div>
                </div>
                <div
                  onClick={() => removeManualTask(t.id, manualDate)}
                  style={{ fontSize: 13, color: C.text3, cursor: 'pointer', padding: '4px 6px', opacity: 0.6 }}
                >
                  ✕
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
