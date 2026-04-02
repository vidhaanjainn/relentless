// ============================================================
// theme.js — All colours, fonts, reusable style fragments
// Electric teal = MIT/primary. Green = completions/wins.
// Purple = AI/mindset. Orange = pressure. Red = gym only.
// ============================================================

export const C = {
  bg:     '#080809',
  bg2:    '#0D0D0F',
  bg3:    '#141416',
  bg4:    '#1A1A1E',
  bg5:    '#222226',

  teal:        '#00E5C3',
  tealDim:     '#00B89E',
  tealSoft:    'rgba(0,229,195,0.08)',
  tealBorder:  'rgba(0,229,195,0.18)',

  green:        '#2EFF8A',
  greenSoft:    'rgba(46,255,138,0.09)',
  greenBorder:  'rgba(46,255,138,0.22)',

  purple:        '#A594F9',
  purpleSoft:    'rgba(165,148,249,0.09)',
  purpleBorder:  'rgba(165,148,249,0.20)',

  orange:      '#FF8C42',
  orangeSoft:  'rgba(255,140,66,0.09)',

  red:      '#FF6B6B',
  redSoft:  'rgba(255,107,107,0.09)',

  blue:      '#5B9CF6',
  blueSoft:  'rgba(91,156,246,0.09)',

  text:    '#EDEAE4',
  text2:   '#7A7874',
  text3:   '#3E3C3A',

  border:   'rgba(255,255,255,0.055)',
  border2:  'rgba(255,255,255,0.10)',
};

export const FONTS = {
  display: "'Syne', sans-serif",
  body:    "'DM Sans', sans-serif",
};

export const S = {
  card: {
    background:   C.bg2,
    border:       `1px solid ${C.border}`,
    borderRadius: 14,
    padding:      '13px 15px',
  },
  mitCard: {
    position:     'relative',
    overflow:     'hidden',
    background:   'linear-gradient(145deg,#0A1915 0%,#080F0D 55%,#080809 100%)',
    border:       `1px solid ${C.tealBorder}`,
    borderRadius: 22,
    padding:      20,
  },
  btnPrimary: {
    background:   C.teal,
    color:        '#030A08',
    border:       'none',
    borderRadius: 9,
    padding:      '13px 18px',
    fontFamily:   "'Syne', sans-serif",
    fontSize:     14,
    fontWeight:   700,
    cursor:       'pointer',
    letterSpacing: '0.01em',
  },
  btnGhost: {
    background:   C.bg3,
    color:        C.text2,
    border:       `1px solid ${C.border2}`,
    borderRadius: 9,
    padding:      '13px 12px',
    fontFamily:   "'DM Sans', sans-serif",
    fontSize:     12,
    cursor:       'pointer',
  },
  tag: {
    fontSize:     10,
    padding:      '3px 10px',
    borderRadius: 20,
    border:       '1px solid',
    fontWeight:   400,
  },
  sectionLabel: {
    fontSize:      10,
    fontWeight:    600,
    letterSpacing: '0.09em',
    textTransform: 'uppercase',
    color:         C.text3,
    marginBottom:  10,
  },
};
