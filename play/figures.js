// rulez — the people and animals of every level, drawn as realistic silhouettes.
// Loaded after world.js and levels.js: it replaces their simpler figures, so every
// place that draws a person, rider, horse, camel or elephant gets these versions.
//
// Figures are drawn on a 100-unit person (feet on y = 0, facing right) and scaled.

const ARM = 4.6;
const limb = (d, c, w = ARM) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

// ---------- Gear ----------

function hatSVG(hat, c, crest = '#B5302B') {
  const hats = {
    cowboy: `<ellipse cx="1" cy="-95.5" rx="14" ry="2.6" fill="${c}"/><path d="M-6 -95 Q-6 -106 1 -106 Q8 -106 8 -95Z" fill="${c}"/>`,
    bicorne: `<path d="M-16 -95 Q1 -114 18 -95 Q1 -101 -16 -95Z" fill="${c}"/><circle cx="1" cy="-101" r="2" fill="#2A4FA8"/><circle cx="1" cy="-101" r="1" fill="#fff"/>`,
    shako: `<path d="M-6 -95 L-7.5 -110 H9.5 L8 -95Z" fill="${c}"/><path d="M1 -110 Q-2 -118 1 -123 Q4 -118 1 -110" fill="${crest}"/>`,
    knight: `<path d="M-7.6 -83 V-96 Q1 -104 9.6 -96 V-83Z" fill="${c}"/><path d="M2 -92 H9" stroke="#C9CED9" stroke-width="1.2"/><path d="M1 -102 Q-10 -116 -18 -106 Q-8 -106 1 -102" fill="${crest}"/>`,
    viking: `<path d="M-7.6 -91 Q1 -108 9.6 -91Z" fill="${c}"/><path d="M1 -91 V-83" stroke="${c}" stroke-width="2"/>`,
    hoplite: `<path d="M-7.6 -84 V-96 Q1 -104 9.6 -96 V-84 H6 V-89 H-3 V-84Z" fill="${c}"/><path d="M-9 -100 Q1 -118 13 -100 Q1 -108 -9 -100Z" fill="${crest}"/>`,
    brodie: `<path d="M-13 -94 Q1 -105 15 -94 Q1 -97 -13 -94Z" fill="${c}"/>`,
    kepi: `<path d="M-6 -95 L-5 -104 H8 L9 -95Z M9 -95 H14" fill="${c}" stroke="${c}" stroke-width="2"/>`,
    phrygian: `<path d="M-7 -94 Q-7 -106 4 -105 Q12 -102 10 -96 L14 -98 L9 -93Z" fill="#C0392B"/>`,
    tophat: `<path d="M-9 -96 H11" stroke="${c}" stroke-width="2.4"/><rect x="-5.5" y="-111" width="13" height="15" fill="${c}"/>`,
    flatcap: `<path d="M-8 -94 Q1 -101 10 -94 L15 -93 L9 -92Z" fill="${c}"/>`,
    tricorne: `<path d="M-12 -95 L1 -105 L14 -95 Q1 -99 -12 -95Z" fill="${c}"/>`,
    laurel: `<path d="M-6.5 -95 Q1 -101 8.5 -95" fill="none" stroke="#7BA05B" stroke-width="2.4" stroke-dasharray="2 1.4"/>`,
    nemes: `<path d="M-9 -78 L-8 -94 Q1 -102 10 -94 L11 -78 L6 -84 H-4Z" fill="${c}"/><path d="M-7 -93 Q1 -99 9 -93" fill="none" stroke="#E5B94E" stroke-width="1.6"/>`,
    feather: `<path d="M-6.5 -95 Q1 -99 8.5 -95" stroke="#E7C46A" stroke-width="1.6" fill="none"/><path d="M6 -96 Q12 -110 18 -108" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    bowler: `<path d="M-9 -95 H11" stroke="${c}" stroke-width="2.2"/><path d="M-5.5 -95 Q-5.5 -105 1 -105 Q7.5 -105 7.5 -95Z" fill="${c}"/>`,
    space: `<circle cx="1" cy="-91" r="10.5" fill="${c}"/><path d="M-3 -95 Q3 -99 8 -94" stroke="#BFE3FF" stroke-width="1.4" fill="none" opacity=".8"/>`,
    hair: `<path d="M-8 -94 L-13 -100 L-6 -98 L-8 -106 L-1 -100 L1 -110 L4 -100 L10 -106 L8 -98 L15 -100 L10 -93Z" fill="#E9E9E9"/>`,
  };
  return hats[hat] || '';
}

function holdSVG(hold, c, [hx, hy], flag = ['#2A4FA8', '#F2F2F2', '#C0392B']) {
  const holds = {
    axe: `<path d="M${hx} ${hy + 6} L${hx + 4} ${hy - 26}" stroke="${c}" stroke-width="2.2"/><path d="M${hx + 3} ${hy - 26} Q${hx + 15} ${hy - 31} ${hx + 14} ${hy - 15} Q${hx + 8} ${hy - 20} ${hx + 3.6} ${hy - 18}Z" fill="${c}"/>`,
    spear: `<path d="M${hx - 4} ${hy + 40} L${hx + 6} ${hy - 50}" stroke="${c}" stroke-width="2"/><path d="M${hx + 6} ${hy - 50} l-2.6 8 h5.4Z" fill="${c}"/>`,
    pike: `<path d="M${hx - 2} ${hy + 40} L${hx + 2} ${hy - 62}" stroke="${c}" stroke-width="2"/><path d="M${hx + 2} ${hy - 62} l-3 9 h6Z" fill="${c}"/>`,
    lance: `<path d="M${hx - 12} ${hy + 4} L${hx + 92} ${hy - 8}" stroke="${c}" stroke-width="3.6" stroke-linecap="round"/><path d="M${hx - 2} ${hy - 4} l0 12 l-9 -6Z" fill="${c}"/>`,
    sword: `<path d="M${hx} ${hy} L${hx + 6} ${hy - 32}" stroke="${c}" stroke-width="2.2"/><path d="M${hx - 4} ${hy - 3} L${hx + 5} ${hy + 1}" stroke="${c}" stroke-width="2.4"/>`,
    musket: `<path d="M${hx - 16} ${hy + 16} L${hx + 22} ${hy - 32}" stroke="${c}" stroke-width="2.8" stroke-linecap="round"/><path d="M${hx + 22} ${hy - 32} L${hx + 30} ${hy - 43}" stroke="${c}" stroke-width="1.2"/>`,
    rifle: `<path d="M${hx - 16} ${hy + 8} L${hx + 26} ${hy - 6}" stroke="${c}" stroke-width="2.8" stroke-linecap="round"/>`,
    torch: `<path d="M${hx} ${hy + 4} L${hx + 2} ${hy - 14}" stroke="${c}" stroke-width="2.4"/>${glow(hx + 2, hy - 20, 16, 'ember', 'w-twinkle')}<path d="M${hx - 1} ${hy - 14} Q${hx + 2} ${hy - 26} ${hx + 5} ${hy - 14}Z" fill="#FFB45A"/>`,
    scroll: `<rect x="${hx - 2}" y="${hy - 12}" width="6" height="14" rx="2" fill="#EFE3C7"/>`,
    camera: `<rect x="${hx - 2}" y="${hy - 8}" width="10" height="7" fill="${c}"/><circle cx="${hx + 9}" cy="${hy - 9}" r="3" fill="#EEE"/>${glow(hx + 9, hy - 9, 26, 'white', 'w-flash')}`,
    bat: `<path d="M${hx} ${hy + 4} L${hx + 10} ${hy - 32}" stroke="#9A6A3A" stroke-width="5" stroke-linecap="round"/>`,
    flag: `<path d="M${hx} ${hy + 30} L${hx + 2} ${hy - 52}" stroke="${c}" stroke-width="1.8"/>${anim('w-flag', `<path d="M${hx + 2} ${hy - 52} h10 v20 h-10Z" fill="${flag[0]}"/><path d="M${hx + 12} ${hy - 52} h10 v20 h-10Z" fill="${flag[1]}"/><path d="M${hx + 22} ${hy - 52} h10 v20 h-10Z" fill="${flag[2]}"/>`)}`,
    drum: `<rect x="${hx - 12}" y="${hy - 2}" width="18" height="14" rx="3" fill="#E9E2C6"/><path d="M${hx - 12} ${hy + 2} h18 M${hx - 12} ${hy + 8} h18" stroke="#B5302B" stroke-width="2"/>`,
  };
  return holds[hold] || '';
}

// ---------- Colour ----------

const hexRgb = hex => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(x => x + x).join('');
  const n = parseInt(h, 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
};
// Blend a toward b by t (0..1). Used to tint clothes toward each scene's light.
function mix(a, b, t) {
  if (!/^#[0-9a-f]{3,6}$/i.test(a) || !/^#[0-9a-f]{3,6}$/i.test(b)) return a;
  const A = hexRgb(a), B = hexRgb(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
}
const darker = (col, t = 0.22) => mix(col, '#000000', t);

// ---------- Clothes ----------
// Every person wears an outfit: chosen by o.wear, else by their hat or outfit, else everyday clothes.

const SKIN = ['#F0CDAA', '#E2B48C', '#C99068', '#A8714C', '#7E5034'];
const HAIR = ['#2A1E16', '#4A3020', '#6E4A2A', '#B8884E', '#1A1A1A', '#8A8A8A'];
const TOPS = ['#B5402E', '#2F6DB5', '#3E7A52', '#D9952E', '#6A4A8E', '#E8E2D6', '#4A5A6E', '#8E3E3E'];
const BOTTOMS = ['#2E3A52', '#4A4038', '#3A3A44', '#6E5A44', '#2A2A30'];

const WEAR = {
  hoplite: { top: '#A8322D', bottom: 'skin', shoes: '#6B4A2E', hat: '#B8862E', shield: '#B8862E', belt: '#6B4A2E' },
  viking: { top: '#6E5A3A', bottom: '#4A3E30', shoes: '#3A2A1E', hat: '#8A8E98', belt: '#2A2018' },
  knight: { top: '#B0302B', bottom: '#8A8E98', shoes: '#6A6E78', hat: '#A8AEB8', sleeves: '#8A8E98' },
  grenadier: { top: '#2A4FA8', bottom: '#ECE8DE', shoes: '#1E1E22', hat: '#1E1E22', belt: '#ECE8DE' },
  napoleon: { top: '#5E6068', bottom: '#ECE8DE', shoes: '#141418', hat: '#141418' },
  revolutionary: { top: '#5A6E8A', bottom: '#C9B48A', shoes: '#3A2A1E', hat: '#C0392B' },
  gentleman: { top: '#22222A', bottom: '#2E2E36', shoes: '#141418', hat: '#141418', shirt: '#F2F2F2' },
  worker: { top: '#6A5A48', bottom: '#4A4038', shoes: '#2A2420', hat: '#3A342E' },
  cowboy: { top: '#B5402E', bottom: '#3A4E72', shoes: '#4A2E1E', hat: '#7A5634' },
  toga: { top: '#F2EEE4', bottom: '#F2EEE4', shoes: '#8A6A44', hat: '#7BA05B' },
  egyptian: { top: '#F4F0E6', bottom: '#F4F0E6', shoes: '#C9A060', hat: '#2A4FA8', skin: '#B07A50', belt: '#E5B94E' },
  tommy: { top: '#7A7448', bottom: '#6E6A44', shoes: '#3A2E22', hat: '#5A5A42', belt: '#5A5034' },
  flapper: { top: '#1F8A80', bottom: 'skin', shoes: '#1A1A1A', hat: '#1A1A1A', hair: '#1A1A1A' },
  tux: { top: '#141418', bottom: '#141418', shoes: '#0A0A0A', hat: '#141418', shirt: '#F2F2F2' },
  space: { top: '#E9EDF6', bottom: '#E9EDF6', shoes: '#AEB6CC', hat: '#E9EDF6', belt: '#AEB6CC' },
  scientist: { top: '#F2F2F2', bottom: '#3A3A44', shoes: '#1A1A1A', hair: '#E9E9E9' },
  athlete: { top: 'skin', bottom: '#E9E2D2', shoes: 'skin' },
  robe: { top: '#E9E2D2', bottom: '#E9E2D2', shoes: '#8A6A44', belt: '#B8862E' },
  dress: { top: '#4E6A8E', bottom: '#4E6A8E', shoes: '#2A2420' },
  monk: { top: '#D9741E', bottom: '#D9741E', shoes: 'skin' },
  samurai: { top: '#2A2A3A', bottom: '#3A3A4A', shoes: '#1A1A1A', hair: '#141414' },
  native: { top: '#A8784E', bottom: '#8A5E3A', shoes: '#6B4A2E', hair: '#141414', belt: '#C0392B' },
};
const HAT_WEAR = {
  hoplite: 'hoplite', viking: 'viking', knight: 'knight', shako: 'grenadier', kepi: 'grenadier', bicorne: 'napoleon',
  phrygian: 'revolutionary', tricorne: 'revolutionary', brodie: 'tommy', tophat: 'gentleman', flatcap: 'worker',
  cowboy: 'cowboy', laurel: 'toga', nemes: 'egyptian', feather: 'flapper', bowler: 'tux', space: 'space', hair: 'scientist',
};

// Outfits vary person to person but stay the same each time a scene is drawn.
let figN = 0;
const _renderScene = renderScene;
renderScene = stage => { figN = 0; return _renderScene(stage); };

function dress(o) {
  figN++;
  const r = seeded((figN * 2654435761) % 2147483646 + 1);
  r(); r(); // let neighbouring people diverge
  const preset = typeof o.wear === 'object' ? o.wear
    : WEAR[o.wear] || WEAR[HAT_WEAR[o.hat]] || (o.outfit === 'robe' ? WEAR.robe : o.outfit === 'dress' ? WEAR.dress : null);
  const base = preset || { top: TOPS[Math.floor(r() * TOPS.length)], bottom: BOTTOMS[Math.floor(r() * BOTTOMS.length)], shoes: '#2A2420' };
  return {
    ...base,
    skin: base.skin || SKIN[Math.floor(r() * SKIN.length)],
    hairC: base.hair || HAIR[Math.floor(r() * HAIR.length)],
  };
}

// ---------- People ----------
// figure(h, sceneColor, options):
//   pose:   stand | walk | run | raise | forward | hips | sit | aim
//   hat, outfit (robe dress tunic coat cape armor), hold, shield, shieldColor, flag, crest, facing
//   wear:   a preset name from WEAR, or { top, bottom, shoes, hat, ... }
//   tint:   how much the scene colour tints the clothes (0 = full colour, 1 = silhouette)

function figure(h, c, o = {}) {
  const { pose = 'stand', hat = '', outfit = '', hold = '', crest, facing = 1 } = o;
  const w = dress(o);
  const t = o.flat ? 1 : o.tint ?? 0.3;
  const k = x => mix(x === 'skin' ? w.skin : x, c, t);
  const skin = k('skin'), top = k(w.top), bottom = k(w.bottom), shoes = k(w.shoes || '#2A2420');
  const hatC = k(w.hat || w.top), hair = k(w.hairC);

  const legL = 'M-9 -46 H-0.8 L-1.6 -24 L-2.2 -3 H-7 L-8.4 -24Z';
  const legR = 'M0.8 -46 H9 L8.4 -24 L7.2 -3 H2 L1.6 -24Z';
  const shoeL = 'M-7.4 -4 H-1.8 Q3 -3.4 3 0 H-7.4Z', shoeR = 'M1.8 -4 H7.6 Q12 -3.4 12 0 H1.8Z';
  const leg = (d, s, col, rot) => `<g${rot ? ` transform="rotate(${rot} 0 -46)"` : ''}><path d="${d}" fill="${col}"/><path d="${s}" fill="${shoes}"/></g>`;
  const swing = { walk: 16, run: 34 }[pose] || 0;
  const lean = pose === 'run' ? 10 : 0;
  let legs = `${leg(legR, shoeR, darker(bottom, 0.18), -swing)}${leg(legL, shoeL, bottom, swing)}`;
  if (pose === 'sit') legs = `<path d="M-9 -46 H9 L22 -44 L24 -40 L20 -4 H15 L15 -36 H-6 Q-10 -40 -9 -46Z" fill="${bottom}"/><path d="M15 -5 H21 Q26 -4 26 0 H15Z" fill="${shoes}"/>`;

  let armL = 'M-10 -77 Q-13.5 -64 -12.5 -50', armR = 'M10 -77 Q13.5 -64 12.5 -50', hand = [12.5, -50], handL = [-12.5, -50];
  if (pose === 'walk') { armL = 'M-10 -77 Q-4 -64 2 -54'; armR = 'M10 -77 Q14 -64 9 -52'; hand = [9, -52]; handL = [2, -54]; }
  if (pose === 'run') { armL = 'M-10 -77 Q-18 -66 -12 -56'; armR = 'M10 -77 Q22 -70 26 -80'; hand = [26, -80]; handL = [-12, -56]; }
  if (pose === 'raise') { armR = 'M10 -77 Q16 -92 18 -106'; hand = [18, -106]; }
  if (pose === 'forward') { armR = 'M10 -77 Q20 -68 28 -66'; armL = 'M-10 -77 Q2 -68 14 -66'; hand = [28, -66]; handL = [14, -66]; }
  if (pose === 'aim') { armR = 'M10 -77 Q18 -74 22 -72'; armL = 'M-10 -77 Q6 -72 16 -70'; hand = [10, -72]; handL = [16, -70]; }
  if (pose === 'hips') { armL = 'M-10 -77 Q-20 -64 -10 -56'; armR = 'M10 -77 Q20 -64 10 -56'; hand = [10, -56]; handL = [-10, -56]; }
  if (pose === 'dab') { armL = 'M-10 -77 Q-26 -88 -40 -104'; armR = 'M10 -77 Q2 -90 -8 -92'; hand = [-8, -92]; handL = [-40, -104]; }
  const sleeve = k(w.sleeves || w.top);

  const robeC = k(w.top);
  const outfits = {
    robe: `<path d="M-10.5 -52 L-15 -1 H15 L10.5 -52Z" fill="${robeC}"/><path d="M1 -52 L2 -1 H15 L10.5 -52Z" fill="#000" opacity=".12"/>`,
    dress: `<path d="M-10 -54 L-16 -20 H16 L10 -54Z" fill="${top}"/><path d="M1 -54 L2 -20 H16 L10 -54Z" fill="#000" opacity=".12"/>`,
    tunic: `<path d="M-10.5 -52 L-13.5 -32 H13.5 L10.5 -52Z" fill="${top}"/>`,
    coat: `<path d="M-11 -52 L-14 -26 L-5 -30 L0 -46 L5 -30 L14 -26 L11 -52Z" fill="${darker(top, 0.1)}"/>`,
    armor: `<path d="M-12.5 -80 Q1 -86 14.5 -80 L15 -70 H-13Z" fill="${k('#A8AEB8')}"/><path d="M-10.5 -50 L-12.5 -38 H12.5 L10.5 -50Z" fill="${k('#8A8E98')}"/>`,
  };
  const cape = outfit === 'cape' ? `<path d="M-11 -80 Q-26 -40 -20 -4 L-8 -10 L-6 -46Z" fill="${k('#8E2A2A')}"/>` : '';
  const shieldC = k(o.shieldColor || w.shield || '#8A5A34');
  const shield = hold === 'shield' || o.shield
    ? `<circle cx="-14" cy="-62" r="11" fill="${shieldC}"/><circle cx="-14" cy="-62" r="11" fill="none" stroke="${darker(shieldC, 0.35)}" stroke-width="1.6"/><circle cx="-14" cy="-62" r="2.8" fill="${k('#C9CED9')}"/>` : '';
  const gear = k('#4A3A2A');

  const body = `
    ${o.noShadow ? '' : `<ellipse cx="2" cy="0" rx="13" ry="2.4" fill="#000" opacity=".2"/>`}
    ${cape}${legs}
    ${limb(armL, darker(sleeve, 0.2))}<circle cx="${handL[0]}" cy="${handL[1]}" r="2.4" fill="${darker(skin, 0.15)}"/>
    <path d="M-10.5 -80 C-6 -83 6 -83 10.5 -80 L12.2 -66 L10.2 -50 L9 -45 H-9 L-10.2 -50 L-12.2 -66Z" fill="${top}"/>
    <path d="M1 -82.6 C6 -82.6 8 -82 10.5 -80 L12.2 -66 L10.2 -50 L9 -45 H1Z" fill="#000" opacity=".13"/>
    ${w.shirt ? `<path d="M-3.4 -81.5 L1 -70 L5.4 -81.5Z" fill="${k(w.shirt)}"/>` : ''}
    ${w.belt ? `<rect x="-10" y="-50" width="20" height="3" fill="${k(w.belt)}"/>` : ''}
    <rect x="-2.4" y="-86" width="4.8" height="7" fill="${darker(skin, 0.12)}"/>
    <ellipse cx="1" cy="-91" rx="6.6" ry="7.6" fill="${skin}"/>
    ${hat ? '' : `<path d="M-5.8 -94 Q1 -102 7.8 -94 Q8.6 -90 7.4 -87 Q2 -94 -5.2 -88 Q-6.6 -91 -5.8 -94Z" fill="${hair}"/>`}
    <circle cx="5.2" cy="-91.5" r=".9" fill="${darker(skin, 0.6)}"/>
    ${outfits[outfit] || ''}
    ${limb(armR, sleeve)}<circle cx="${hand[0]}" cy="${hand[1]}" r="2.4" fill="${skin}"/>
    ${hatSVG(hat, hatC, crest)}
    ${hold && hold !== 'shield' ? holdSVG(hold, gear, hand, o.flag) : ''}${shield}`;
  const s = h / 100;
  return `<g transform="scale(${(s * facing).toFixed(3)} ${s.toFixed(3)})${lean ? ` rotate(${lean})` : ''}">${body}</g>`;
}

// ---------- Horses ----------
// A horse standing on y = 0, about 135 units to the withers, facing right.
// o: gait, rear, mane, tack (saddle and bridle), scene (colour that tints a natural coat)

function horse(c, { gait = true, rear = false, mane, tack = false } = {}) {
  const coat = c, far = darker(coat, 0.25), maneC = mane || darker(coat, 0.45);
  const leg = (cls, d, col) => anim(gait ? cls : '', `<path d="${d}" fill="${col}"/>`);
  const front = 'M50 -96 L63 -94 L61 -42 L63 -10 L67 0 H55 L55 -10 L53 -42Z';
  const front2 = 'M36 -94 L49 -94 L45 -46 L40 -10 L43 0 H31 L32 -10 L37 -46Z';
  const hind = 'M-88 -104 L-62 -98 L-66 -62 L-74 -38 L-71 -10 L-67 0 H-79 L-81 -10 L-84 -38 L-80 -62Z';
  const hind2 = 'M-76 -102 L-52 -96 L-56 -62 L-60 -38 L-56 -10 L-52 0 H-64 L-66 -10 L-70 -38 L-68 -62Z';
  const hooves = `<path d="M55 -6 H66 L67 0 H55Z M-79 -6 H-68 L-67 0 H-79Z" fill="${darker(coat, 0.6)}"/>`;
  const body = `
    <path d="M-92 -114 Q-118 -104 -120 -52 Q-110 -80 -98 -98Z" fill="${maneC}"/>
    <path d="M-98 -118 Q-66 -136 -4 -132 Q34 -130 50 -140 Q66 -170 84 -192 Q92 -206 102 -203 L105 -214 L110 -203 Q124 -188 144 -156 Q150 -142 138 -139 Q122 -141 110 -148 Q100 -142 94 -126 Q86 -100 68 -88 Q28 -78 -24 -82 Q-74 -80 -94 -94 Q-104 -106 -98 -118Z" fill="${coat}"/>
    <path d="M-94 -94 Q-74 -80 -24 -82 Q28 -78 68 -88 Q40 -98 -20 -98 Q-72 -100 -94 -94Z" fill="#000" opacity=".16"/>
    <path d="M110 -148 Q124 -144 138 -139 Q148 -142 144 -156 Q136 -150 124 -152Z" fill="#000" opacity=".14"/>
    <path d="M50 -142 Q62 -176 86 -196 Q74 -170 68 -144 Z" fill="${maneC}"/>
    <circle cx="119" cy="-184" r="2.2" fill="#140C08"/>
    ${tack ? `<path d="M-30 -134 Q-6 -141 16 -133 L14 -114 Q-6 -108 -28 -116Z" fill="#5A2E18"/><path d="M-26 -116 Q-6 -110 14 -116" stroke="#C9A060" stroke-width="1.6" fill="none"/>
      <path d="M100 -196 L132 -158 M110 -150 Q128 -170 136 -160" stroke="#3A2214" stroke-width="2" fill="none"/>` : ''}`;
  const all = `${leg('w-gait-b', hind2, far)}${leg('w-gait-a', front2, far)}${body}${leg('w-gait-a', hind, coat)}${leg('w-gait-b', front, coat)}${gait ? '' : hooves}`;
  return rear ? `<g transform="rotate(-26 -72 0)">${all}</g>` : all;
}

// A rider seated on a horse. o: hat, hold, crest, flag, cape, horse (coat colour), mane, rear, gait, wear, tint.
const COATS = ['#6B4428', '#4A2E1E', '#8A5A34', '#2A2420', '#B8AEA0'];
function rider(c, o = {}) {
  const w = dress(o);
  const t = o.tint ?? 0.3;
  const k = x => mix(x === 'skin' ? w.skin : x, c, t);
  const skin = k('skin'), top = k(w.top), bottom = k(w.bottom), shoes = k(w.shoes || '#2A2420');
  const pose = o.hold === 'lance' ? 'forward' : o.hold ? 'raise' : 'reins';
  const hand = pose === 'forward' ? [28, -66] : pose === 'raise' ? [18, -106] : [28, -62];
  const armR = pose === 'raise' ? 'M10 -77 Q16 -92 18 -106' : pose === 'forward' ? 'M10 -77 Q20 -68 28 -66' : 'M10 -77 Q18 -64 28 -62';
  const man = `
    ${o.cape ? `<path d="M-11 -80 Q-30 -60 -34 -30 L-12 -40Z" fill="${k('#8E2A2A')}"/>` : ''}
    <path d="M-8 -50 H6 Q15 -46 15 -37 L13 -14 L19 -12 V-8 H6 L6 -32 Q0 -38 -8 -40Z" fill="${bottom}"/><path d="M6 -14 H19 V-8 H6Z" fill="${shoes}"/>
    ${limb('M-10 -77 Q0 -64 14 -62', darker(top, 0.2))}
    <path d="M-10.5 -80 C-6 -83 6 -83 10.5 -80 L12.2 -66 L10.2 -50 L9 -45 H-9 L-10.2 -50 L-12.2 -66Z" fill="${top}"/>
    <path d="M1 -82.6 C6 -82.6 8 -82 10.5 -80 L12.2 -66 L10.2 -50 L9 -45 H1Z" fill="#000" opacity=".13"/>
    ${w.belt ? `<rect x="-10" y="-50" width="20" height="3" fill="${k(w.belt)}"/>` : ''}
    <rect x="-2.4" y="-86" width="4.8" height="7" fill="${darker(skin, 0.12)}"/><ellipse cx="1" cy="-91" rx="6.6" ry="7.6" fill="${skin}"/>
    ${o.hat ? '' : `<path d="M-5.8 -94 Q1 -102 7.8 -94 Q8.6 -90 7.4 -87 Q2 -94 -5.2 -88 Q-6.6 -91 -5.8 -94Z" fill="${k(w.hairC)}"/>`}
    ${limb(armR, k(w.sleeves || w.top))}<circle cx="${hand[0]}" cy="${hand[1]}" r="2.4" fill="${skin}"/>
    ${hatSVG(o.hat, k(w.hat || w.top), o.crest)}${o.hold ? holdSVG(o.hold, k('#4A3A2A'), hand, o.flag) : ''}`;
  const caparison = Boolean(o.horse);
  const coat = o.horse || mix(COATS[figN % COATS.length], c, t + 0.1);
  const seated = `<g transform="translate(-4 -70) scale(1.25)">${man}</g>`;
  const reins = pose === 'reins' ? `<path d="M31 -147 Q80 -150 122 -160" stroke="#2A1810" stroke-width="1.6" fill="none"/>` : '';
  const all = `<ellipse cx="-6" cy="0" rx="96" ry="7" fill="#000" opacity=".16"/>${horse(coat, { gait: o.gait !== false, mane: o.mane, tack: !caparison })}${seated}${reins}`;
  return o.rear ? `<g transform="rotate(-26 -72 0)">${all}</g>` : all;
}

P.crowd = (x0, x1, y, n, c, seed = 1, h = 46) => {
  const r = seeded(seed);
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + (x1 - x0) * (i + r() * 0.8) / n, hh = h * (0.8 + r() * 0.35);
    out += `<g transform="translate(${x.toFixed(0)} ${(y + r() * 6).toFixed(0)})">${S.person(hh, c, { walk: r() < 0.3, tint: h < 40 ? 0.6 : 0.45, noShadow: true })}</g>`;
  }
  return out;
};

// ---------- Animals ----------

function camel(c) {
  const leg = (cls, d) => anim(cls, `<path d="${d}" fill="${c}"/>`);
  return `${leg('w-gait-b', 'M-64 -84 L-54 -84 L-56 -40 L-60 0 H-68 L-64 -40Z')}${leg('w-gait-a', 'M34 -86 L44 -86 L46 -40 L50 0 H42 L36 -40Z')}
    <path d="M-86 -96 Q-92 -128 -64 -130 Q-48 -172 -22 -134 Q-4 -170 22 -132 Q50 -128 60 -108 L78 -158 Q86 -178 104 -174 Q118 -168 112 -156 L98 -152 L82 -100 Q74 -84 58 -86 Q10 -78 -40 -80 Q-80 -80 -86 -96Z" fill="${c}"/>
    <path d="M-86 -108 Q-100 -96 -96 -70" stroke="${c}" stroke-width="3" fill="none"/>
    ${leg('w-gait-a', 'M-80 -86 L-70 -86 L-72 -40 L-76 0 H-84 L-80 -40Z')}${leg('w-gait-b', 'M48 -88 L58 -88 L58 -40 L62 0 H54 L50 -40Z')}`;
}

function elephant(c) {
  const leg = (x, cls) => anim(cls, `<path d="M${x - 13} -70 H${x + 13} L${x + 12} 0 H${x - 12}Z" fill="${c}"/>`);
  return `${leg(-58, 'w-gait-b')}${leg(46, 'w-gait-a')}
    <path d="M-96 -76 Q-104 -146 -30 -152 Q36 -158 66 -134 Q86 -150 108 -134 Q128 -114 120 -82 Q116 -56 122 -22 Q124 -6 116 -2 L110 -6 Q108 -30 100 -52 L92 -64 Q60 -60 20 -62 Q-40 -60 -80 -56 Q-98 -60 -96 -76Z" fill="${c}"/>
    <path d="M70 -132 Q44 -112 54 -76 Q78 -70 88 -100Z" fill="#fff" opacity=".08"/>
    <path d="M102 -66 Q118 -50 132 -58" stroke="#EDE6D6" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M-96 -86 Q-110 -76 -108 -50" stroke="${c}" stroke-width="3" fill="none"/>
    ${leg(-80, 'w-gait-a')}${leg(26, 'w-gait-b')}`;
}

// Plug the new figures into the existing libraries.
S.person = (h, c, o = {}) => figure(h, c, {
  ...o,
  hat: o.helmet ? 'space' : o.hat,
  pose: o.pose || (o.walk ? 'walk' : 'stand'),
  outfit: o.outfit || (o.robe ? 'robe' : o.dress ? 'dress' : ''),
});
S.horseRider = (c, hat = 'cowboy', o = {}) => rider(c, { hat, ...o });
S.camel = camel;
P.elephant = elephant;
P.mammoth = c => `${elephant(c)}<path d="M-96 -120 Q-60 -168 40 -152" stroke="${c}" stroke-width="12" fill="none"/><path d="M102 -66 Q130 -40 142 -72" stroke="#EDE6D6" stroke-width="6" fill="none" stroke-linecap="round"/>`;
P.horse = c => horse(c);
