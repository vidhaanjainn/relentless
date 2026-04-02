// DumpView.js — Task dump screen with Claude AI sorting
import { useState } from 'react';
import { C, FONTS, S } from '../config/theme';
import { sortDump, fallbackSort } from '../services/ai';

const ENERGY_STYLE = {
  deep_work: { bg: C.tealSoft,   color: C.teal,   border: C.tealBorder,   label: 'Deep work' },
  medium:    { bg: C.blueSoft,   color: C.blue,   border: 'rgba(91,156,246,.22)', label: 'Medium' },
  light:     { bg: C.greenSoft,  color: C.green,  border: C.greenBorder,  label: 'Light' },
};

export default function DumpView({ onSaveTasks, bumpCallCount }) {
  const [mode,    setMode]    = useState('tomorrow');
  const [text,    setText]    = useState('');
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState('');

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      bumpCallCount();
      const data = await sortDump({ rawText: text, mode });
      setResult(data);
      onSaveTasks(data);
    } catch (err) {
      if (err.message === 'NO_KEY') {
        setError('No API key. Set REACT_APP_CLAUDE_KEY in .env.local');
        const data = fallbackSort(text);
        setResult(data);
        onSaveTasks(data);
      } else {
        setError(`Error: ${err.message}`);
        const data = fallbackSort(text);
        setResult(data);
      }
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: '18px 18px 90px', overflowY: 'auto', flex: 1, scrollbarWidth: 'none' }}>
      <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 4 }}>
        What's on your mind?
      </div>
      <div style={{ fontSize: 13, color: C.text3, marginBottom: 20, lineHeight: 1.55 }}>
        Throw everything in. Messy is fine. Claude reads your dump, finds what actually moves the needle, and builds your day.
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {['tomorrow','today'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '7px 16px', borderRadius: 20,
              fontSize: 12, cursor: 'pointer',
              border: `1px solid ${mode === m ? C.tealBorder : C.border}`,
              background: mode === m ? C.tealSoft : 'transparent',
              color:      mode === m ? C.teal : C.text3,
              fontFamily: FONTS.body,
              transition: 'all 0.2s',
            }}
          >
            {m === 'tomorrow' ? 'Tomorrow' : 'Today (urgent)'}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={mode === 'today'
          ? 'e.g. Brand deal email just came in, urgent BedBox issue, need to reply to collab...'
          : 'e.g. Script for gold reel, reply to Vani, BedBox check, Zerodha review, call Shlok...'
        }
        style={{
          width: '100%', minHeight: 140,
          background: C.bg2, border: `1px solid ${C.border2}`,
          borderRadius: 14, color: C.text,
          fontFamily: FONTS.body, fontSize: 14,
          padding: 14, resize: 'none', outline: 'none',
          lineHeight: 1.6,
        }}
      />
      <div style={{ fontSize: 11, color: C.text3, marginTop: 8, lineHeight: 1.6 }}>
        Just type freely. <span style={{ color: C.teal }}>Claude finds what actually moves the needle</span>, parks the rest, tells you why.
      </div>

      {error && (
        <div style={{ marginTop: 10, fontSize: 12, color: C.orange, lineHeight: 1.5, background: C.orangeSoft, borderRadius: 9, padding: '9px 12px' }}>
          {error} — showing basic sort below.
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !text.trim()}
        style={{
          ...S.btnPrimary, width: '100%', marginTop: 14,
          opacity: (loading || !text.trim()) ? 0.45 : 1,
          cursor:  (loading || !text.trim()) ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Claude is thinking...' : 'Let Claude sort this →'}
      </button>

      {/* Loading indicator */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px 0', color: C.text3, fontSize: 13 }}>
          <span style={{ color: C.teal }}>●</span> Analysing what actually moves the needle...
        </div>
      )}

      {/* AI result */}
      {result && !loading && (
        <div style={{
          background: C.bg2, border: `1px solid ${C.tealBorder}`,
          borderRadius: 14, padding: 16, marginTop: 16,
        }}>
          <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.teal, marginBottom: 12, fontWeight: 600 }}>
            ✦ Claude sorted your tasks
          </div>

          {result.note && (
            <div style={{
              background: C.purpleSoft, border: `1px solid ${C.purpleBorder}`,
              borderLeft: `2px solid ${C.purple}`,
              borderRadius: 9, padding: '11px 13px', marginBottom: 12,
              fontSize: 13, color: C.text2, lineHeight: 1.6,
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
                  <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>
                    {t.mins ? `${t.mins} min · ` : ''}
                    <span style={{
                      fontSize: 9, padding: '2px 8px', borderRadius: 20,
                      background: es.bg, color: es.color, border: `1px solid ${es.border}`,
                    }}>
                      {es.label}
                    </span>
                    {t.why ? ` · ${t.why}` : ''}
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
              {result.park_reason && <><br /><span style={{ color: C.text3 }}>{result.park_reason}</span></>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
