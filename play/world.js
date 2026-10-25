// rulez — the world behind the game, drawn as layered illustrated landscapes.
// Climbing is also travelling through time: the ocean floor is the deep past,
// then antiquity, the Wild West, 1920s Paris, Shanghai today, Everest tomorrow,
// and space ever further into the future, until Infinity.
//
// Each scene is one SVG (viewBox 1200×900, anchored to the bottom, cropped to fill).
// Phones see roughly x 390–810, and during play mostly the lower part (y > 680),
// so every scene keeps something alive down there.

function seeded(seed) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

// ---------- Shared paint: glows, light rays, blur ----------

const GLOWS = {
  white: '#FFFFFF', warm: '#FFE2A0', sun: '#FFB45A', teal: '#7FFFE0', cyan: '#7FE7FF',
  amber: '#FFC266', ember: '#FF8A3D', lime: '#C8FF7A', violet: '#B9A6FF', blue: '#8EC5FF',
};
document.body.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  ${Object.entries(GLOWS).map(([k, c]) => `<radialGradient id="glow-${k}"><stop offset="0" stop-color="${c}" stop-opacity=".95"/><stop offset=".3" stop-color="${c}" stop-opacity=".4"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`).join('')}
  <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8FF7A" stop-opacity=".55"/><stop offset="1" stop-color="#C8FF7A" stop-opacity="0"/></linearGradient>
  <linearGradient id="tower" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3D5BA8"/><stop offset=".55" stop-color="#7FA6E8"/><stop offset="1" stop-color="#2B3F7E"/></linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDF3FF" stop-opacity=".55"/><stop offset="1" stop-color="#9FD3F0" stop-opacity=".15"/></linearGradient>
  <linearGradient id="planet" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6DDA3"/><stop offset=".6" stop-color="#D9A75E"/><stop offset="1" stop-color="#8E6534"/></linearGradient>
  <linearGradient id="earth" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6FB6FF"/><stop offset=".7" stop-color="#2A64C4"/><stop offset="1" stop-color="#0F2D6B"/></linearGradient>
  <linearGradient id="disk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FF7A1A" stop-opacity="0"/><stop offset=".2" stop-color="#FF9B3D"/><stop offset=".5" stop-color="#FFF1C8"/><stop offset=".8" stop-color="#FF9B3D"/><stop offset="1" stop-color="#FF7A1A" stop-opacity="0"/></linearGradient>
  <filter id="blur-s" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>
  <filter id="blur-l" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>
</defs></svg>`);

// ---------- Building blocks ----------

const at = (x, y, inner, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
const anim = (cls, inner, style = '') => `<g class="${cls}"${style ? ` style="${style}"` : ''}>${inner}</g>`;
const glow = (x, y, r, name = 'warm', cls = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#glow-${name})"${cls ? ` class="${cls}"` : ''}/>`;

// A landscape layer: a smooth (or peaked) skyline filled down to the bottom.
function ridge(seed, base, amp, color, { freq = 1, sharp = false, step = 12 } = {}) {
  const r = seeded(seed);
  const waves = Array.from({ length: 4 }, (_, i) => ({
    f: (0.0035 + r() * 0.004) * (i + 1) * freq, p: r() * Math.PI * 2, a: amp / (i + 1.4),
  }));
  const y = x => base - waves.reduce((s, w) => {
    const v = Math.sin(w.f * x + w.p);
    return s + w.a * (sharp ? 1 - Math.abs(v) * 1.6 : v);
  }, 0);
  let d = `M-30 920 L-30 ${y(-30).toFixed(1)}`;
  for (let x = -30; x <= 1230; x += step) d += ` L${x} ${y(x).toFixed(1)}`;
  return `<path d="${d} L1230 920Z" fill="${color}"/>`;
}

function stars(count, seed, { top = 0, bottom = 700 } = {}) {
  const r = seeded(seed);
  let out = '';
  for (let i = 0; i < count; i++) {
    const x = r() * 1200, y = top + r() * (bottom - top), s = 0.6 + r() * 1.8;
    out += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${s.toFixed(1)}" fill="#fff" opacity="${(0.4 + r() * 0.6).toFixed(2)}" class="w-twinkle" style="animation-delay:-${(r() * 3).toFixed(2)}s"/>`;
  }
  return out;
}

function rays(opacity = 1) {
  return `<g opacity="${opacity}" class="w-rays">
    <polygon points="380,-40 460,-40 640,900 300,900" fill="url(#ray)"/>
    <polygon points="610,-40 650,-40 860,900 660,900" fill="url(#ray)"/>
    <polygon points="760,-40 830,-40 1120,900 920,900" fill="url(#ray)"/>
    <polygon points="150,-40 200,-40 260,900 60,900" fill="url(#ray)"/></g>`;
}

function bubbles(seed, n = 10, x0 = 380, x1 = 840) {
  const r = seeded(seed);
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * (x1 - x0), s = 2 + r() * 5;
    out += `<circle cx="${x.toFixed(0)}" cy="880" r="${s.toFixed(1)}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.5" class="w-rise" style="animation-duration:${(8 + r() * 8).toFixed(1)}s;animation-delay:-${(r() * 14).toFixed(1)}s"/>`;
  }
  return out;
}

function drift(seed, n, color = '#fff', size = 1.6, op = 0.6) {
  const r = seeded(seed);
  let out = '';
  for (let i = 0; i < n; i++) {
    out += at((r() * 1200).toFixed(0), -20, anim('w-fall', `<circle r="${(size * (0.5 + r())).toFixed(1)}" fill="${color}" opacity="${op}"/>`, `animation-duration:${(12 + r() * 14).toFixed(1)}s;animation-delay:-${(r() * 24).toFixed(1)}s`));
  }
  return out;
}

function softCloud(x, y, w, color = '#fff', op = 0.9, dur = 60) {
  const h = w * 0.28;
  return at(x, y, anim('w-drift', `<path d="M0 ${h} Q${w * 0.05} ${h * 0.2} ${w * 0.22} ${h * 0.35} Q${w * 0.3} ${-h * 0.4} ${w * 0.52} 0 Q${w * 0.7} ${-h * 0.5} ${w * 0.82} ${h * 0.3} Q${w} ${h * 0.25} ${w} ${h}Z" fill="${color}" opacity="${op}"/>`, `animation-duration:${dur}s`));
}

function birds(x, y, n, color, seed = 1) {
  const r = seeded(seed);
  let out = '';
  for (let i = 0; i < n; i++) {
    const bx = x + r() * 120, by = y + r() * 50, s = 0.6 + r() * 0.6;
    out += `<path d="M${bx} ${by} q${6 * s} ${-6 * s} ${12 * s} 0 q${6 * s} ${-6 * s} ${12 * s} 0" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`;
  }
  return anim('w-drift', out, 'animation-duration:30s');
}

// Water surface glints.
function glints(seed, y0, y1, n, color = '#fff') {
  const r = seeded(seed);
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = r() * 1200, y = y0 + r() * (y1 - y0), w = 10 + r() * 40 * (y - y0 + 40) / (y1 - y0 + 40);
    out += `<path d="M${x.toFixed(0)} ${y.toFixed(0)} h${w.toFixed(0)}" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity=".7" class="w-twinkle" style="animation-delay:-${(r() * 3).toFixed(1)}s"/>`;
  }
  return out;
}

// ---------- Silhouettes ----------
// Drawn in a single fill (the layer's color), with the odd lit detail.

const S = {
  person(h, c, { hat = '', robe = false, dress = false, walk = false } = {}) {
    const r = h * 0.075;
    let legs = walk
      ? `<path d="M${-h * 0.05} ${-h * 0.46} L${-h * 0.13} 0 L${-h * 0.08} 0 L0 ${-h * 0.36} L${h * 0.08} 0 L${h * 0.13} 0 L${h * 0.05} ${-h * 0.46}Z" fill="${c}"/>`
      : `<path d="M${-h * 0.06} ${-h * 0.46} L${-h * 0.06} 0 L${-h * 0.015} 0 L0 ${-h * 0.36} L${h * 0.015} 0 L${h * 0.06} 0 L${h * 0.06} ${-h * 0.46}Z" fill="${c}"/>`;
    if (robe) legs = `<path d="M${-h * 0.09} ${-h * 0.5} L${-h * 0.16} 0 H${h * 0.16} L${h * 0.09} ${-h * 0.5}Z" fill="${c}"/>`;
    if (dress) legs = `<path d="M${-h * 0.08} ${-h * 0.62} L${-h * 0.16} ${-h * 0.3} H${h * 0.16} L${h * 0.08} ${-h * 0.62}Z M${-h * 0.06} ${-h * 0.3} L${-h * 0.1} 0 M${h * 0.06} ${-h * 0.3} L${h * 0.12} ${-h * 0.04}" fill="${c}" stroke="${c}" stroke-width="${h * 0.035}" stroke-linecap="round"/>`;
    const hats = {
      cowboy: `<path d="M${-r * 2.6} ${-h + r * 0.6} Q0 ${-h + r * 1.2} ${r * 2.6} ${-h + r * 0.6} L${r * 1.3} ${-h + r * 0.4} Q${r * 1.2} ${-h - r * 1.4} 0 ${-h - r * 1.2} Q${-r * 1.2} ${-h - r * 1.4} ${-r * 1.3} ${-h + r * 0.4}Z" fill="${c}"/>`,
      laurel: `<path d="M${-r * 1.2} ${-h + r * 0.4} Q0 ${-h - r * 0.8} ${r * 1.2} ${-h + r * 0.4}" fill="none" stroke="#7BA05B" stroke-width="${r * 0.5}"/>`,
      nemes: `<path d="M${-r * 1.6} ${-h + r * 3} L${-r * 1.2} ${-h + r * 0.2} Q0 ${-h - r * 0.9} ${r * 1.2} ${-h + r * 0.2} L${r * 1.6} ${-h + r * 3}Z" fill="${c}"/><path d="M${-r * 1.1} ${-h + r * 0.4} Q0 ${-h - r * 0.4} ${r * 1.1} ${-h + r * 0.4}" fill="none" stroke="#E5B94E" stroke-width="${r * 0.35}"/>`,
      feather: `<path d="M${r * 0.6} ${-h} q${r * 1.5} ${-r * 3} ${r * 2.4} ${-r * 2.4}" fill="none" stroke="${c}" stroke-width="${r * 0.5}" stroke-linecap="round"/>`,
      helmet: `<circle cx="0" cy="${-h + r * 1.1}" r="${r * 1.7}" fill="${c}"/>`,
      bowler: `<path d="M${-r * 1.8} ${-h + r * 0.5} H${r * 1.8} M${-r * 1.1} ${-h + r * 0.5} Q${-r * 1.1} ${-h - r * 1.3} 0 ${-h - r * 1.3} Q${r * 1.1} ${-h - r * 1.3} ${r * 1.1} ${-h + r * 0.5}Z" fill="${c}" stroke="${c}" stroke-width="${r * 0.4}"/>`,
    };
    return `<circle cx="0" cy="${-h + r * 1.1}" r="${r}" fill="${c}"/>
      <path d="M${-h * 0.1} ${-h * 0.8} Q0 ${-h * 0.85} ${h * 0.1} ${-h * 0.8} L${h * 0.075} ${-h * 0.44} H${-h * 0.075}Z" fill="${c}"/>
      ${legs}${hat ? hats[hat] : ''}`;
  },
  pine(h, c) {
    return `<path d="M0 ${-h} L${h * 0.16} ${-h * 0.62} H${h * 0.08} L${h * 0.26} ${-h * 0.28} H${h * 0.12} L${h * 0.32} ${-h * 0.05} H${h * 0.04} V0 H${-h * 0.04} V${-h * 0.05} H${-h * 0.32} L${-h * 0.12} ${-h * 0.28} H${-h * 0.26} L${-h * 0.08} ${-h * 0.62} H${-h * 0.16}Z" fill="${c}"/>`;
  },
  palm(h, c, lean = 1) {
    const tx = 0.25 * h * lean, ty = -h;
    const leaf = a => {
      const ex = tx + Math.cos(a) * h * 0.42, ey = ty + Math.sin(a) * h * 0.42 + h * 0.08;
      const mx = tx + Math.cos(a) * h * 0.22, my = ty + Math.sin(a) * h * 0.22 - h * 0.08;
      return `<path d="M${tx} ${ty} Q${mx} ${my} ${ex} ${ey} Q${mx} ${my + h * 0.07} ${tx} ${ty}Z" fill="${c}"/>`;
    };
    return anim('w-sway', `<path d="M0 0 Q${tx * 0.2} ${-h * 0.6} ${tx} ${ty}" fill="none" stroke="${c}" stroke-width="${h * 0.05}" stroke-linecap="round"/>
      ${[-2.9, -2.3, -1.8, -1.3, -0.8, -0.25].map(leaf).join('')}`);
  },
  saguaro(h, c) {
    const w = h * 0.12;
    return `<path d="M0 0 V${-h}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>
      <path d="M0 ${-h * 0.45} H${-h * 0.2} V${-h * 0.75} M0 ${-h * 0.55} H${h * 0.18} V${-h * 0.82}" fill="none" stroke="${c}" stroke-width="${w * 0.8}" stroke-linecap="round" stroke-linejoin="round"/>`;
  },
  horseRider(c, hat = 'cowboy') {
    return `<path d="M-70 -60 Q-80 -95 -40 -100 L30 -100 Q60 -102 72 -128 L86 -150 Q96 -156 100 -146 L104 -126 Q100 -116 90 -114 L78 -96 Q74 -70 60 -64 L56 -60Z" fill="${c}"/>
      <path d="M-70 -78 Q-100 -70 -96 -30" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/>
      ${anim('w-legs', `<path d="M-56 -66 L-62 0 M-36 -64 L-30 0 M34 -64 L40 0 M54 -64 L48 0" stroke="${c}" stroke-width="9" stroke-linecap="round"/>`)}
      <g transform="translate(-6 -58)">${S.person(110, c, { hat })}</g>
      <path d="M-20 -100 L-28 -64 M8 -100 L14 -64" stroke="${c}" stroke-width="9" stroke-linecap="round"/>`;
  },
  camel(c) {
    return `<path d="M-70 -70 Q-74 -96 -50 -100 Q-36 -132 -14 -104 Q4 -138 26 -104 Q50 -102 56 -84 L74 -122 Q82 -138 98 -132 Q106 -126 98 -120 L88 -116 L70 -64 Q60 -56 50 -60 H-60Z" fill="${c}"/>
      ${anim('w-legs', `<path d="M-52 -64 L-56 0 M-34 -62 L-30 0 M30 -62 L26 0 M48 -62 L52 0" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`)}`;
  },
  dolphin(c) {
    return `<path d="M-60 10 Q-30 -36 30 -28 Q58 -24 70 -6 Q60 -2 52 -6 Q40 10 10 14 L-4 30 L-10 12 Q-40 12 -60 10Z M-60 10 L-84 -8 L-78 24Z" fill="${c}"/>`;
  },
  trireme(c, sail = '#EFE3C7') {
    return `${anim('w-row', `<path d="M-150 10 l-20 40 M-110 12 l-20 40 M-70 13 l-20 40 M-30 13 l-20 40 M10 13 l-20 40 M50 12 l-20 40 M90 10 l-20 40" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`)}
      <path d="M-200 -8 L170 -8 Q205 -12 232 -44 L214 6 Q200 24 168 24 L-170 24 Q-200 20 -214 -16Z" fill="${c}"/>
      <path d="M0 -8 V-170" stroke="${c}" stroke-width="5"/>
      <path d="M-78 -160 H78 Q84 -95 78 -32 H-78 Q-84 -95 -78 -160Z" fill="${sail}"/>
      <path d="M-80 -120 H80 M-80 -80 H80" stroke="#B5462F" stroke-width="9" opacity=".75"/>`;
  },
  car1925(c, lamp = true) {
    return `<path d="M-110 -20 Q-110 -46 -84 -48 L-56 -50 L-44 -88 H36 L48 -50 H96 Q114 -48 114 -26 V-10 H-110Z" fill="${c}"/>
      ${lamp ? glow(116, -34, 40, 'amber') : ''}
      ${[-70, 70].map(x => `<g transform="translate(${x} -8)">${anim('w-roll', `<circle r="22" fill="${c}"/><circle r="12" fill="none" stroke="#6E6A8E" stroke-width="2"/><path d="M-12 0 H12 M0 -12 V12" stroke="#6E6A8E" stroke-width="2"/>`)}</g>`).join('')}`;
  },
  train(c) {
    return `${[0, 1, 2].map(i => anim('w-puff', `<circle cx="70" cy="-96" r="${16 + i * 6}" fill="#F3E6D6" opacity=".75"/>`, `animation-delay:-${i * 0.5}s`)).join('')}
      <path d="M-260 -10 V-56 H-180 V-10Z M-170 -10 V-56 H-90 V-10Z M-80 -10 V-72 H50 V-90 H80 V-60 H100 L120 -10Z" fill="${c}"/>
      ${[-240, -200, -150, -110, -60, -20, 30, 80].map(x => `<circle cx="${x}" cy="-8" r="11" fill="${c}"/>`).join('')}
      ${glow(116, -46, 30, 'amber')}`;
  },
  ufo(c) {
    return `<path d="M-60 26 L-130 380 H130 L60 26Z" fill="url(#beam)" class="w-twinkle"/>
      <ellipse rx="110" ry="26" fill="${c}"/><path d="M-50 -8 Q-46 -56 0 -58 Q46 -56 50 -8Z" fill="#9FEFFF" opacity=".8"/>
      ${[-70, -35, 0, 35, 70].map((x, i) => `<circle cx="${x}" cy="8" r="5" fill="#E9FFB8" class="w-blink" style="animation-delay:-${i * 0.1}s"/>`).join('')}`;
  },
  // Little lost objects that end up in space. Still a bit silly.
  sock: c => `<path d="M-15 -40 H15 V10 Q15 30 35 30 Q50 32 48 45 Q45 58 20 55 L-5 52 Q-15 50 -15 30Z" fill="${c}"/>`,
  duck: c => `<path d="M-50 0 Q-55 -40 -10 -35 L30 -30 Q60 -30 55 0 Q50 25 0 25 Q-45 25 -50 0Z" fill="${c}"/><circle cx="25" cy="-50" r="24" fill="${c}"/><path d="M45 -52 Q70 -50 66 -40 Q55 -36 44 -42Z" fill="${c}"/>`,
  cow: c => `<rect x="-70" y="-40" width="130" height="70" rx="30" fill="${c}"/><rect x="45" y="-70" width="62" height="56" rx="24" fill="${c}"/><path d="M50 -66 L40 -84 M100 -66 L110 -84 M-55 25 V60 M30 25 V60" stroke="${c}" stroke-width="14" stroke-linecap="round"/>`,
};

// ---------- The climb, bottom to top ----------
// theme: mode (light/dark panels) and the accent used for buttons, bonus and progress.

// The original hand-drawn places; levels.js puts them in order with all the others.
const CLASSIC = [
  {
    name: 'The Abyss', alt: '−4,000 m', era: '500 million years ago',
    font: { family: 'Creepster', q: 'Creepster', weight: 400 },
    theme: { mode: 'dark', accent: '#9DB8FF' },
    sky: ['#0A2D52', '#01060F'],
    art: () => `
      ${rays(0.3)}${drift(3, 40, '#BFE9FF', 1.4, 0.5)}
      ${at(0, 330, anim('w-cross', `<g fill="#0E2E52"><ellipse rx="130" ry="40"/><path d="M100 -18 Q190 -120 270 -128 Q300 -126 294 -108 Q270 -98 250 -102 Q190 -88 120 10Z M-120 -4 Q-210 10 -250 40 Q-190 30 -110 20Z M-40 28 L-90 88 L-20 38Z M50 28 L20 92 L80 32Z"/></g>`, 'animation-duration:46s;animation-delay:-14s'))}
      ${at(860, 360, anim('w-float', `${glow(0, -20, 90, 'violet')}<path d="M-40 0 Q-42 -54 0 -56 Q42 -54 40 0 Q20 8 0 2 Q-20 8 -40 0Z" fill="#B9A6FF" opacity=".75"/>${anim('w-sway', `<path d="M-24 2 Q-30 50 -18 100 M-6 4 Q-12 60 -2 120 M12 4 Q18 60 6 110 M28 2 Q34 46 22 90" fill="none" stroke="#B9A6FF" stroke-opacity=".6" stroke-width="2.5"/>`)}`, 'animation-duration:9s'))}
      ${at(330, 250, anim('w-float', `${glow(0, -20, 70, 'teal')}<path d="M-30 0 Q-32 -40 0 -42 Q32 -40 30 0 Q15 6 0 2 Q-15 6 -30 0Z" fill="#7FFFE0" opacity=".7"/>${anim('w-sway', `<path d="M-16 2 Q-20 40 -10 80 M0 3 Q-4 50 4 96 M16 2 Q20 40 10 76" fill="none" stroke="#7FFFE0" stroke-opacity=".55" stroke-width="2"/>`)}`, 'animation-duration:11s;animation-delay:-4s'))}
      ${ridge(11, 700, 50, '#071B33', { sharp: true, freq: 1.4 })}
      ${[[400, 760], [430, 770], [790, 760], [812, 768]].map(([x, y], i) => `<path d="M${x} ${y} q-6 -50 4 -90" fill="none" stroke="#0B2742" stroke-width="7" stroke-linecap="round" class="w-sway"/>${glow(x + 4, y - 92, 16, i % 2 ? 'violet' : 'teal', 'w-twinkle')}`).join('')}
      ${ridge(12, 790, 26, '#030E1D', { freq: 0.8 })}
      ${at(470, 770, anim('w-bob', `<path d="M60 0 Q60 -62 -10 -62 Q-70 -62 -80 -14 L-116 -46 L-110 0 L-116 46 L-80 14 Q-70 62 -10 62 Q60 62 60 0Z" fill="#02070F"/><path d="M60 0 L20 26 L28 10 L36 24 L44 8 L52 20Z" fill="#9FB7C9" opacity=".7"/><circle cx="18" cy="-22" r="5" fill="#9FE8FF"/><path d="M5 -60 Q25 -140 85 -118" fill="none" stroke="#02070F" stroke-width="4"/>${glow(85, -118, 46, 'teal', 'w-twinkle')}<circle cx="85" cy="-118" r="7" fill="#E9FFFA"/>`, 'animation-duration:4s'), 0.85)}
      ${at(760, 860, anim('w-pace', `<circle r="34" fill="#02070F"/><path d="M0 0 m-5 0 a5 5 0 1 1 10 0 a12 12 0 1 1 -22 0 a19 19 0 1 1 36 0 a26 26 0 1 1 -50 0" fill="none" stroke="#123456" stroke-width="2.5"/>`, '--pace:-80px;animation-duration:9s'), 0.8)}
      ${bubbles(5, 9)}`,
  },
  {
    name: 'The Shipwreck', alt: '−300 m', era: '1500 BC',
    font: { family: 'Pirata One', q: 'Pirata+One', weight: 400 },
    theme: { mode: 'dark', accent: '#F2C14E' },
    sky: ['#17639A', '#06203B'],
    art: () => `
      ${rays(0.6)}${drift(8, 26, '#D6F0FF', 1.2, 0.45)}
      ${at(0, 260, anim('w-cross', Array.from({ length: 22 }, (_, i) => { const r = seeded(i * 7 + 40); return `<path transform="translate(${(i * 16 + r() * 30).toFixed(0)} ${(Math.sin(i * 0.9) * 40 + r() * 30).toFixed(0)}) scale(1.4)" d="M0 0 Q12 -7 24 0 Q12 7 0 0Z M0 0 L-8 -5 L-8 5Z" fill="#0D3C63"/>`; }).join(''), 'animation-duration:30s;animation-delay:-14s'))}
      ${ridge(21, 690, 40, '#0F3D60', { freq: 0.7 })}
      ${at(760, 690, `<g transform="rotate(-13)" fill="#082742">
        <path d="M-8 -10 V-340 H6 V-10Z"/><path d="M6 -310 L130 -290 L96 -220 L136 -170 L6 -160Z" fill="#0B3253"/>
        <path d="M-240 -10 Q-220 96 0 100 Q220 96 250 -22 L196 -32 Q0 -16 -196 -26Z"/>
        <path d="M-200 26 Q0 40 220 18" stroke="#1A5C86" stroke-width="2" fill="none"/></g>`)}
      ${ridge(22, 770, 22, '#0A2B47', { freq: 0.9 })}
      ${[[880, 790], [910, 800], [360, 800]].map(([x, y]) => `<path d="M${x} ${y} q-24 -70 6 -150 q16 46 -6 90 q20 -30 10 -70" fill="none" stroke="#123F5E" stroke-width="8" stroke-linecap="round" class="w-sway"/>`).join('')}
      ${at(620, 845, `${glow(0, -20, 70, 'warm', 'w-twinkle')}<path d="M-50 0 V-40 Q-50 -64 0 -64 Q50 -64 50 -40 V0Z" fill="#06182B"/><circle cx="-14" cy="-50" r="5" fill="#F2C14E"/><circle cx="8" cy="-54" r="4" fill="#F2C14E"/>`)}
      ${at(470, 850, `<path d="M-8 -50 h16 v10 Q28 -26 26 6 Q22 40 0 48 Q-22 40 -26 6 Q-28 -26 -8 -40Z M-8 -40 Q-26 -42 -24 -18 M8 -40 Q26 -42 24 -18" fill="#06182B" stroke="#06182B" stroke-width="4"/>`, 0.9)}
      ${at(780, 860, `<g transform="rotate(75)"><path d="M-8 -50 h16 v10 Q28 -26 26 6 Q22 40 0 48 Q-22 40 -26 6 Q-28 -26 -8 -40Z" fill="#06182B"/></g>`, 0.8)}
      ${bubbles(13, 10)}`,
  },
  {
    name: 'The Aegean Sea', alt: '0 m', era: '1190 BC',
    font: { family: 'Cinzel Decorative', q: 'Cinzel+Decorative:wght@700', weight: 700 },
    theme: { mode: 'light', accent: '#2E6FDB' },
    sky: ['#3F96D6', '#D7EEFA'],
    art: () => `
      ${glow(900, 180, 220, 'warm')}<circle cx="900" cy="180" r="40" fill="#FFF6DA"/>
      ${softCloud(120, 160, 260, '#fff', 0.8, 70)}${softCloud(620, 110, 180, '#fff', 0.6, 50)}
      ${ridge(31, 555, 30, '#9DBFD8', { freq: 0.8 })}
      <path d="M200 560 L210 420 Q280 384 390 392 L490 430 L530 560Z" fill="#D8CDB2"/><path d="M390 392 L490 430 L530 560 H440Z" fill="#B9AA88"/>
      ${at(350, 395,`<path d="M-120 0 H120 V-12 H-120Z M-112 -12 V-96 M-72 -12 V-96 M-32 -12 V-96 M8 -12 V-96 M48 -12 V-96 M88 -12 V-96" fill="#F3EEE1" stroke="#F3EEE1" stroke-width="12"/><path d="M-126 -96 H126 V-110 H-126Z M-132 -110 L0 -150 L132 -110Z" fill="#F3EEE1"/><path d="M-112 -12 V-96 M-32 -12 V-96 M48 -12 V-96" stroke="#D8D0BC" stroke-width="5"/>`, 0.7)}
      <rect x="-40" y="555" width="1280" height="400" fill="#2C7DBA"/>
      ${glints(32, 570, 700, 40)}
      ${at(0, 600, anim('w-cross', S.trireme('#2C2530'), 'animation-duration:40s;animation-delay:-18s'), 0.7)}
      ${at(560, 740, anim('w-dolphin', S.dolphin('#1E4E73')))}
      ${at(720, 770, anim('w-dolphin', S.dolphin('#1E4E73'), 'animation-delay:-1.4s'), 0.8)}
      <rect x="-40" y="720" width="1280" height="240" fill="#1F639A"/>
      ${glints(33, 730, 880, 30, '#BFE3FF')}
      <path d="M700 900 Q720 820 790 812 Q840 800 880 830 Q920 850 940 900Z" fill="#2E3B44"/><path d="M790 812 Q840 800 880 830 Q840 820 800 826Z" fill="#4A5963"/>
      ${at(820, 812, `${S.person(70, '#1C252C')}<path d="M10 -40 L90 -110" stroke="#1C252C" stroke-width="3"/><path d="M90 -110 Q100 -40 96 20" fill="none" stroke="#1C252C" stroke-width="1" opacity=".7"/>`)}
      ${at(-100, 830, anim('w-cross', `<path d="M-60 0 H60 Q50 22 0 24 Q-50 22 -60 0Z" fill="#3A2C25"/><path d="M0 0 V-70 L40 -6Z" fill="#E9DCC0"/>${S.person(40, '#3A2C25')}`, 'animation-duration:50s;animation-delay:-30s'), 0.9)}
      ${birds(420, 210, 5, '#2B4A63', 3)}`,
  },
  {
    name: 'Alexandria', alt: '2 m', era: '280 BC',
    font: { family: 'Philosopher', q: 'Philosopher:wght@700', weight: 700 },
    theme: { mode: 'light', accent: '#D98A2B' },
    sky: ['#EE9A55', '#FBE3B4'],
    art: () => `
      ${glow(430, 300, 260, 'sun')}<circle cx="430" cy="300" r="46" fill="#FFF0CC"/>
      ${birds(620, 170, 6, '#7A4A2A', 7)}
      ${ridge(41, 560, 16, '#C9926A', { freq: 0.6 })}
      <rect x="-40" y="560" width="1280" height="100" fill="#4B87A8"/>${glints(42, 566, 640, 26, '#FFE6B8')}
      ${at(500, 600, anim('w-cross', `<path d="M-30 0 H30 L20 12 H-20Z M0 0 V-50 L26 -6Z" fill="#5A4636"/>`, 'animation-duration:60s;animation-delay:-30s'), 0.8)}
      <path d="M720 668 Q760 610 860 606 Q980 610 1020 668Z" fill="#9A8A6E"/><path d="M860 606 Q980 610 1020 668 H900Z" fill="#7E6E54"/>
      ${at(860, 640, `<path d="M-80 0 L-70 -200 H70 L80 0Z" fill="#E9D6B0"/><path d="M20 -200 H70 L80 0 H30Z" fill="#C9AE84"/>
        <path d="M-48 -200 L-42 -330 H42 L48 -200Z" fill="#E3CDA3"/><path d="M14 -330 H42 L48 -200 H18Z" fill="#C2A57A"/>
        <path d="M-28 -330 L-24 -400 H24 L28 -330Z" fill="#E9D6B0"/>
        ${glow(0, -440, 120, 'ember', 'w-twinkle')}${anim('w-flame', `<path d="M-16 -404 Q-20 -436 0 -462 Q20 -436 16 -404Z" fill="#FF9A3D"/><path d="M-7 -406 Q-7 -426 0 -438 Q7 -426 7 -406Z" fill="#FFE07A"/>`)}
        <path d="M-12 -150 h24 v-30 h-24Z M-8 -280 h16 v-24 h-16Z" fill="#7A5C3C"/>`, 0.9)}
      ${ridge(43, 650, 12, '#E7C38A', { freq: 0.5 })}
      ${at(380, 720, S.palm(260, '#3E3A2A', -0.8))}${at(450, 740, S.palm(200, '#4A4431', 0.6))}
      ${ridge(44, 760, 10, '#D5A86A', { freq: 0.7 })}
      ${at(560, 850, S.person(110, '#3A2A1E', { robe: true, hat: 'laurel' }))}
      ${at(640, 852, anim('w-pace', S.person(96, '#3A2A1E', { robe: true, walk: true }), '--pace:120px;animation-duration:10s'))}`,
  },
  {
    name: 'The Pyramids', alt: '146 m', era: '40 BC',
    font: { family: 'Marcellus', q: 'Marcellus', weight: 400 },
    theme: { mode: 'light', accent: '#C98A1E' },
    sky: ['#F2B65E', '#FDEFCF'],
    art: () => `
      ${glow(900, 170, 260, 'sun')}<circle cx="900" cy="170" r="40" fill="#FFF4D6"/>
      ${ridge(51, 640, 18, '#EDCB8C', { freq: 0.5 })}
      <path d="M390 640 L480 480 L570 640Z" fill="#E7BC6E"/><path d="M480 480 L570 640 H505Z" fill="#B88A45"/>
      <path d="M700 640 L815 430 L930 640Z" fill="#E7BC6E"/><path d="M815 430 L930 640 H850Z" fill="#B88A45"/>
      <path d="M455 652 L620 340 L785 652Z" fill="#EEC678"/><path d="M620 340 L785 652 H675Z" fill="#C2924A"/>
      ${Array.from({ length: 10 }, (_, i) => { const y = 370 + i * 28; const half = (y - 340) * 0.53; return `<path d="M${620 - half} ${y} H${620 + half}" stroke="#D2A55C" stroke-width="1.5" opacity=".6"/>`; }).join('')}
      ${at(300, 650, `<path d="M-70 0 V-40 Q-60 -50 -30 -50 L20 -54 L30 -80 Q46 -96 62 -80 L70 -50 Q72 -30 70 0Z" fill="#C79A55"/>`, 0.8)}
      ${ridge(52, 700, 14, '#E2B56C', { freq: 0.6 })}
      <path d="M1000 700 V560 L1010 548 L1020 560 V700Z" fill="#C69447"/>
      ${at(-100, 780, anim('w-cross', `${S.camel('#5C3E22')}${at(-200, 0, S.camel('#5C3E22'))}${at(-330, 2, S.person(100, '#5C3E22', { robe: true, walk: true }))}`, 'animation-duration:60s;animation-delay:-28s'), 0.9)}
      ${ridge(53, 800, 12, '#CF9E55', { freq: 0.7 })}
      ${at(460, 880, S.person(130, '#4A2F18', { robe: true, hat: 'nemes' }))}`,
  },
  {
    name: 'The Wild West', alt: '200 m', era: '1880',
    font: { family: 'Rye', q: 'Rye', weight: 400 },
    theme: { mode: 'light', accent: '#C65A2E' },
    sky: ['#E9783F', '#FDD39A'],
    art: () => `
      ${glow(620, 470, 340, 'sun')}<circle cx="620" cy="470" r="70" fill="#FFE6B0"/>
      ${birds(780, 170, 3, '#7A3A22', 5)}
      <path d="M-40 600 V480 Q-10 466 60 470 L150 478 V600Z M880 600 V440 Q920 426 1010 432 L1060 440 V600Z M1080 600 V500 H1240 V600Z" fill="#C46A45"/>
      ${ridge(61, 600, 10, '#B2573A', { freq: 0.4 })}
      ${at(-40, 618, anim('w-cross', S.train('#4A2418'), 'animation-duration:34s;animation-delay:-14s'), 0.55)}
      ${ridge(62, 640, 14, '#8E4129', { freq: 0.6 })}
      ${at(830, 660, S.saguaro(160, '#5A2A1A'))}${at(900, 670, S.saguaro(100, '#5A2A1A'))}
      ${ridge(63, 760, 22, '#4A2016', { freq: 0.8 })}
      ${at(560, 790, S.horseRider('#2A120C'), 0.9)}
      ${at(380, 800, S.saguaro(210, '#2A120C'))}
      ${at(0, 860, anim('w-cross', anim('w-roll', `<circle r="22" fill="none" stroke="#2A120C" stroke-width="3"/><path d="M-14 -6 Q0 -20 14 -2 Q2 14 -10 6 Q-2 -2 8 2" fill="none" stroke="#2A120C" stroke-width="3"/>`), 'animation-duration:9s'))}`,
  },
  {
    name: 'Paris', alt: '330 m', era: '1925',
    font: { family: 'Limelight', q: 'Limelight', weight: 400 },
    theme: { mode: 'dark', accent: '#E7C46A' },
    sky: ['#232659', '#E0946A'],
    art: () => `
      ${stars(40, 19, { bottom: 300 })}
      ${glow(900, 160, 120, 'warm')}<circle cx="900" cy="160" r="34" fill="#FFF3D6"/>
      <path d="M-40 700 V600 L10 572 L60 600 V556 L120 528 L180 556 V600 L250 584 V560 L300 540 L350 560 V700Z M820 700 V588 L880 556 L940 588 V566 L1000 536 L1060 566 V596 L1120 580 L1240 590 V700Z" fill="#3A3460"/>
      ${Array.from({ length: 16 }, (_, i) => { const r = seeded(i + 90); const x = r() < 0.5 ? 20 + r() * 300 : 840 + r() * 360; return `<rect x="${x.toFixed(0)}" y="${(590 + r() * 90).toFixed(0)}" width="8" height="12" fill="#FFD27A" opacity=".8" class="w-twinkle" style="animation-duration:${(3 + r() * 4).toFixed(1)}s"/>`; }).join('')}
      <path d="M600 70 V130" stroke="#1E1A36" stroke-width="5"/>
      <path fill-rule="evenodd" fill="#1E1A36" d="M462 706 Q545 534 578 330 L590 130 H610 L622 330 Q655 534 738 706 H668 Q632 604 600 604 Q568 604 532 706Z M570 450 Q600 430 630 450 L640 540 H560Z M586 260 H614 L618 320 H582Z"/>
      <path d="M518 572 H682 M548 456 H652 M574 330 H626 M584 240 H616" stroke="#1E1A36" stroke-width="10"/>
      ${Array.from({ length: 14 }, (_, i) => { const t = i / 13; const y = 150 + t * 540; const half = 10 + t * t * 128; return `<circle cx="${600 - half}" cy="${y}" r="2.5" fill="#FFE29A" class="w-twinkle" style="animation-delay:-${i * 0.2}s"/><circle cx="${600 + half}" cy="${y}" r="2.5" fill="#FFE29A" class="w-twinkle" style="animation-delay:-${i * 0.2 + 0.1}s"/>`; }).join('')}
      <rect x="-40" y="700" width="1280" height="70" fill="#2B2A55"/>${glints(71, 708, 760, 24, '#FFD27A')}
      <rect x="-40" y="770" width="1280" height="200" fill="#15122A"/>
      ${[400, 800].map(x => `<path d="M${x} 860 V770 M${x - 14} 770 H${x + 14}" stroke="#0B0918" stroke-width="5"/>${glow(x, 766, 50, 'amber')}<circle cx="${x}" cy="766" r="5" fill="#FFE6B0"/>`).join('')}
      ${at(-100, 830, anim('w-cross', S.car1925('#0B0918'), 'animation-duration:16s;animation-delay:-6s'), 0.8)}
      ${at(560, 870, anim('w-dance', S.person(120, '#0B0918', { dress: true, hat: 'feather' })))}
      ${at(610, 872, anim('w-dance', S.person(130, '#0B0918', { hat: 'bowler' }), 'animation-delay:-.4s'))}`,
  },
  {
    name: 'Shanghai', alt: '632 m', era: 'today',
    font: { family: 'Exo 2', q: 'Exo+2:wght@800', weight: 800 },
    theme: { mode: 'dark', accent: '#8EA8FF' },
    sky: ['#070C2A', '#33296A'],
    art: () => {
      const r = seeded(77);
      const towers = Array.from({ length: 22 }, (_, i) => {
        const x = -40 + i * 60 + r() * 20, h = 80 + r() * 160, w = 40 + r() * 30;
        return `<rect x="${x.toFixed(0)}" y="${(720 - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="#1A2154"/>`;
      }).join('');
      const windows = Array.from({ length: 70 }, () => `<rect x="${(r() * 1200).toFixed(0)}" y="${(420 + r() * 290).toFixed(0)}" width="4" height="6" fill="#FFE29A" opacity="${(0.4 + r() * 0.6).toFixed(2)}" class="w-twinkle" style="animation-duration:${(2 + r() * 5).toFixed(1)}s;animation-delay:-${(r() * 4).toFixed(1)}s"/>`).join('');
      return `
      ${stars(30, 31, { bottom: 260 })}
      ${towers}
      <path d="M420 720 V420 M410 720 L420 300 L430 720" stroke="#2A2F6A" stroke-width="6"/><circle cx="420" cy="560" r="36" fill="#A8344A"/><circle cx="420" cy="340" r="24" fill="#A8344A"/><path d="M420 316 V220" stroke="#2A2F6A" stroke-width="4"/>
      ${glow(420, 560, 60, 'ember')}
      <path d="M690 720 V360 L700 340 V300 L710 280 V250 L720 230 L730 250 V280 L740 300 V340 L750 360 V720Z" fill="#26306A"/>
      <path d="M800 720 V260 Q830 200 860 260 V720Z M816 280 h28 v26 h-28Z" fill="#2B3672" fill-rule="evenodd"/>
      <path d="M556 720 Q536 400 588 70 L612 70 Q664 400 644 720Z" fill="url(#tower)"/>
      <path d="M566 680 Q610 520 590 400 Q575 260 600 90" fill="none" stroke="#BFE8FF" stroke-width="2" opacity=".6"/>
      ${glow(600, 80, 40, 'cyan', 'w-blink')}
      ${windows}
      <rect x="-40" y="720" width="1280" height="110" fill="#0B1236"/>
      ${Array.from({ length: 30 }, () => { const x = r() * 1200; return `<path d="M${x.toFixed(0)} ${(730 + r() * 90).toFixed(0)} v${(6 + r() * 20).toFixed(0)}" stroke="${['#FFE29A', '#7FE7FF', '#FF9A6B'][Math.floor(r() * 3)]}" stroke-width="3" opacity=".55" class="w-twinkle" style="animation-delay:-${(r() * 3).toFixed(1)}s"/>`; }).join('')}
      ${at(-100, 790, anim('w-cross', `<path d="M-70 0 H70 L56 16 H-56Z M-40 0 V-22 H30 V0Z" fill="#05081C"/>${[-30, -10, 10].map(x => `<rect x="${x}" y="-16" width="8" height="6" fill="#FFE29A"/>`).join('')}`, 'animation-duration:30s;animation-delay:-10s'))}
      <rect x="-40" y="830" width="1280" height="120" fill="#04061A"/>
      ${at(470, 900, S.person(100, '#04061A', { walk: true }))}${at(520, 900, S.person(90, '#04061A'))}
      ${[380, 780].map(x => `<path d="M${x} 900 V832" stroke="#04061A" stroke-width="4"/>${glow(x, 830, 36, 'cyan')}`).join('')}
      ${at(0, 300, anim('w-cross', `<path d="M-20 0 H20 M-28 -6 H-12 M12 -6 H28" stroke="#0B1236" stroke-width="4"/><circle cx="-20" cy="-6" r="3" fill="#7FE7FF" class="w-blink"/><circle cx="20" cy="-6" r="3" fill="#FF6B6B" class="w-blink"/>`, 'animation-duration:20s;animation-delay:-4s'))}`;
    },
  },
  {
    name: 'Mount Everest', alt: '8,849 m', era: 'tomorrow',
    font: { family: 'Bungee', q: 'Bungee', weight: 400 },
    theme: { mode: 'light', accent: '#3A86FF' },
    sky: ['#4D93DD', '#E6F2FC'],
    art: () => `
      ${glow(260, 160, 200, 'white')}
      ${ridge(81, 520, 120, '#C7D6EA', { sharp: true, freq: 1.2 })}
      <path d="M90 840 L600 150 L1110 840Z" fill="#7487AB"/>
      <path d="M600 150 L1110 840 H760 L640 520 L700 420Z" fill="#5A6C91"/>
      <path d="M600 150 L520 262 L556 250 L586 284 L616 246 L652 280 L690 262Z" fill="#F6FAFF"/>
      <path d="M600 150 L690 262 L700 300 L640 280Z" fill="#D9E4F2"/>
      <path d="M600 150 Q700 196 790 280" fill="none" stroke="#3B4766" stroke-width="1.5"/>
      ${[0, 1, 2, 3, 4, 5, 6].map(i => { const x = 612 + i * 24, y = 156 + i * 17; const c = ['#2F7DF6', '#fff', '#E63946', '#2BB24C', '#FFD23F', '#2F7DF6', '#fff'][i]; return anim('w-flag', `<path d="M${x} ${y} l12 3 l-9 13Z" fill="${c}"/>`, `animation-delay:-${i * 0.15}s`); }).join('')}
      ${[0, 1, 2, 3, 4].map(i => at(460 + i * 30, 470 + i * 42, `${S.person(40, '#1F2433', { walk: true })}<rect x="-5" y="-30" width="10" height="12" fill="${['#FF7A1A', '#FFD23F', '#E63946', '#2BB24C', '#2F7DF6'][i]}"/>`)).join('')}
      ${softCloud(-80, 700, 600, '#FFFFFF', 0.95, 80)}${softCloud(420, 740, 520, '#F3F8FF', 0.95, 70)}${softCloud(820, 690, 560, '#FFFFFF', 0.95, 90)}
      ${ridge(84, 780, 24, '#FFFFFF', { freq: 1.6 })}
      ${ridge(85, 840, 16, '#EEF5FD', { freq: 1.2 })}
      ${drift(17, 30, '#fff', 2.2, 0.8)}`,
  },
  {
    name: 'Orbital Station', alt: '400 km', era: '2150',
    font: { family: 'Orbitron', q: 'Orbitron:wght@800', weight: 800 },
    theme: { mode: 'dark', accent: '#A9C1FF' },
    sky: ['#02040F', '#0B1640'],
    art: () => `
      ${stars(110, 11)}
      <circle cx="600" cy="1560" r="930" fill="#8EC5FF" opacity=".25" filter="url(#blur-s)"/>
      <circle cx="600" cy="1560" r="900" fill="url(#earth)"/>
      <path d="M180 760 Q300 700 430 740 Q470 800 360 820 Q250 820 180 760Z M720 720 Q860 690 960 750 Q930 810 820 800 Q720 780 720 720Z" fill="#3E8E5A" opacity=".75"/>
      ${anim('w-drift', `<ellipse cx="380" cy="720" rx="150" ry="22" fill="#fff" opacity=".45" filter="url(#blur-s)"/><ellipse cx="820" cy="700" rx="120" ry="18" fill="#fff" opacity=".4" filter="url(#blur-s)"/><ellipse cx="600" cy="790" rx="200" ry="26" fill="#fff" opacity=".3" filter="url(#blur-s)"/>`, 'animation-duration:90s')}
      ${at(840, 300, `${anim('w-spin-slow', `<circle r="150" fill="none" stroke="#C7D0E6" stroke-width="16" stroke-dasharray="36 10"/><path d="M-150 0 H150 M0 -150 V150" stroke="#8E98B4" stroke-width="5"/>`)}<circle r="36" fill="#DCE3F2"/><circle r="14" fill="#7CF0FF"/>${glow(0, 0, 60, 'cyan', 'w-twinkle')}`, 0.75)}
      ${at(0, 230, anim('w-cross', `<rect x="-14" y="-8" width="28" height="16" fill="#C7D0E6"/><rect x="-56" y="-6" width="38" height="12" fill="#3557A8"/><rect x="18" y="-6" width="38" height="12" fill="#3557A8"/>`, 'animation-duration:30s'))}
      ${at(470, 560, anim('w-float', `<rect x="-26" y="-6" width="52" height="58" rx="20" fill="#E9EDF6"/><circle cy="-30" r="28" fill="#E9EDF6"/><ellipse cx="4" cy="-30" rx="19" ry="14" fill="#1C2B55"/><path d="M-6 -36 Q2 -42 12 -36" stroke="#7CF0FF" stroke-width="3" fill="none"/><rect x="-40" y="0" width="16" height="40" rx="5" fill="#AEB6CC"/>${anim('w-flame', `<path d="M-36 40 Q-32 76 -28 40Z" fill="#7CF0FF"/>`)}<path d="M26 10 Q90 60 200 20" fill="none" stroke="#AEB6CC" stroke-width="2" stroke-dasharray="6 6"/>`, 'animation-duration:9s'), 0.9)}`,
  },
  {
    name: 'Moon Base', alt: '384,400 km', era: '2300',
    font: { family: 'Quantico', q: 'Quantico:wght@700', weight: 700 },
    theme: { mode: 'dark', accent: '#B9F27C' },
    sky: ['#000207', '#0D1230'],
    art: () => `
      ${stars(120, 23)}
      ${glow(900, 200, 90, 'blue')}<circle cx="900" cy="200" r="42" fill="url(#earth)"/><path d="M878 186 Q896 172 910 190 Q900 206 884 202Z" fill="#3E8E5A"/>
      ${ridge(101, 640, 30, '#4E5160', { freq: 0.5 })}
      ${ridge(102, 700, 24, '#7C7F8E', { freq: 0.7 })}
      ${at(800, 710, `<path d="M-130 0 Q-130 -118 0 -118 Q130 -118 130 0Z" fill="url(#glass)" stroke="#C9D3E6" stroke-width="2"/><path d="M-60 0 V-40 M40 0 V-60" stroke="#3E5A3A" stroke-width="5"/><circle cx="-60" cy="-48" r="18" fill="#5FA35A"/><circle cx="40" cy="-70" r="24" fill="#5FA35A"/>${glow(0, -40, 140, 'warm')}`)}
      ${at(990, 712, `<path d="M-70 0 Q-70 -66 0 -66 Q70 -66 70 0Z" fill="url(#glass)" stroke="#C9D3E6" stroke-width="2"/>${glow(0, -20, 80, 'warm')}`)}
      <path d="M690 712 V560" stroke="#9EA2B3" stroke-width="4"/><circle cx="690" cy="556" r="4" fill="#FF6B6B" class="w-blink"/>
      ${ridge(103, 790, 14, '#ABAEBB', { freq: 0.9 })}
      <ellipse cx="320" cy="840" rx="70" ry="14" fill="#8E91A0"/><ellipse cx="880" cy="860" rx="50" ry="10" fill="#8E91A0"/>
      ${at(470, 860, anim('w-pace', `<rect x="-50" y="-44" width="100" height="30" rx="6" fill="#DCE1EC"/><rect x="-60" y="-56" width="120" height="10" fill="#3557A8"/><path d="M30 -56 V-90" stroke="#DCE1EC" stroke-width="4"/><circle cx="30" cy="-94" r="6" fill="#DCE1EC"/>${[-36, 0, 36].map(x => `<circle cx="${x}" cy="-8" r="12" fill="#3A3D4C"/>`).join('')}${glow(54, -30, 30, 'warm')}`, '--pace:170px;animation-duration:12s'))}
      ${at(240, 590, anim('w-jump', S.cow('#E9EBF2'), 'animation-duration:7s'), 0.32)}`,
  },
  {
    name: 'Mars City', alt: '225 million km', era: '2500',
    font: { family: 'Russo One', q: 'Russo+One', weight: 400 },
    theme: { mode: 'light', accent: '#E8682E' },
    sky: ['#C9673F', '#F3B989'],
    art: () => `
      ${glow(320, 190, 120, 'warm')}<circle cx="320" cy="190" r="22" fill="#FFF0DA"/><circle cx="420" cy="140" r="6" fill="#FFE7C8"/>
      ${ridge(111, 590, 70, '#BF6343', { sharp: true, freq: 0.6 })}
      ${ridge(112, 660, 22, '#A44A2C', { freq: 0.7 })}
      ${at(820, 690, `<path d="M-170 0 Q-170 -150 0 -150 Q170 -150 170 0Z" fill="url(#glass)" stroke="#F3D6C2" stroke-width="2"/><path d="M-100 0 V-60 H-70 V-90 H-40 V0Z M10 0 V-110 H50 V0Z M80 0 V-70 H110 V0Z" fill="#7E3A26"/>${Array.from({ length: 10 }, (_, i) => `<rect x="${-96 + i * 20}" y="${-50 - (i % 3) * 18}" width="5" height="7" fill="#FFE29A" class="w-twinkle" style="animation-delay:-${i * 0.3}s"/>`).join('')}`)}
      ${at(380, 690, `<path d="M-90 0 Q-90 -84 0 -84 Q90 -84 90 0Z" fill="url(#glass)" stroke="#F3D6C2" stroke-width="2"/><circle cx="-20" cy="-30" r="22" fill="#5FA35A"/><circle cx="26" cy="-40" r="26" fill="#5FA35A"/>`)}
      ${at(-150, 330, anim('w-cross', `<path d="M-80 0 Q-80 -34 -30 -40 L10 -60 Q56 -62 74 -34 Q96 -30 96 -8 Q96 10 66 10 H-60 Q-80 10 -80 0Z" fill="#E9ECF3"/><path d="M-14 -42 L14 -56 Q46 -56 58 -34Z" fill="#7FD3F5"/>${glow(-80, 4, 60, 'cyan')}`, 'animation-duration:18s;animation-delay:-5s'), 0.8)}
      ${ridge(113, 770, 16, '#7E3520', { freq: 0.9 })}
      ${at(560, 880, `${S.person(150, '#4A1E12', { helmet: true })}`)}${at(620, 884, anim('w-pace', S.person(130, '#4A1E12', { helmet: true, walk: true }), '--pace:140px;animation-duration:11s'))}
      ${drift(19, 18, '#F6C9A3', 2, 0.5)}`,
  },
  {
    name: "Saturn's Rings", alt: '1.4 billion km', era: '2900',
    font: { family: 'Audiowide', q: 'Audiowide', weight: 400 },
    theme: { mode: 'dark', accent: '#FFD36B' },
    sky: ['#0A061E', '#271752'],
    art: () => `
      ${stars(110, 41)}
      ${at(620, 340, `<ellipse rx="270" ry="64" fill="none" stroke="#C9B48A" stroke-width="26" opacity=".55"/><ellipse rx="236" ry="56" fill="none" stroke="#E8D9A6" stroke-width="10" opacity=".8"/>
        <circle r="140" fill="url(#planet)"/><path d="M-134 -36 Q0 -14 134 -36 M-138 24 Q0 46 138 24 M-120 70 Q0 86 120 70" fill="none" stroke="#B9884A" stroke-width="10" opacity=".55"/>
        <path d="M-270 0 A270 64 0 0 0 270 0" fill="none" stroke="#C9B48A" stroke-width="26" opacity=".85"/><path d="M-236 0 A236 56 0 0 0 236 0" fill="none" stroke="#F1E3B7" stroke-width="10"/>`)}
      <circle cx="260" cy="180" r="18" fill="#D9D2C2"/><circle cx="1000" cy="520" r="10" fill="#BDB6A6"/>
      ${at(-100, 560, anim('w-cross', `<path d="M-30 0 L40 -10 L60 0 L40 10Z" fill="#DCE1EC"/>${glow(-36, 0, 30, 'cyan')}`, 'animation-duration:14s'))}
      ${at(600, 920, `<path d="M-360 0 Q-320 -140 -120 -150 Q0 -190 160 -146 Q330 -136 370 0Z" fill="#2E2A45"/><path d="M-120 -150 Q0 -190 160 -146 Q60 -160 -40 -150Z" fill="#4A4568"/>
        <g transform="translate(-30 -160)"><path d="M-80 0 Q-80 -70 0 -70 Q80 -70 80 0Z" fill="url(#glass)" stroke="#C9D3E6" stroke-width="2"/>${glow(0, -20, 90, 'warm')}${S.person(50, '#1B1830')}${at(30, 0, S.person(46, '#1B1830'))}</g>
        <g transform="translate(200 -150)"><path d="M0 0 V-60" stroke="#8E89AE" stroke-width="3"/><rect x="-46" y="-96" width="92" height="36" rx="6" fill="#1B1830" stroke="#FFD36B" stroke-width="2"/><text x="0" y="-72" text-anchor="middle" font-family="Audiowide, sans-serif" font-size="13" fill="#FFD36B">RING VIEW</text></g>`)}`,
  },
  {
    name: 'Planet Zorb', alt: '40 light-years', era: '3500',
    font: { family: 'Righteous', q: 'Righteous', weight: 400 },
    theme: { mode: 'dark', accent: '#9CFF57' },
    sky: ['#140B3A', '#0C5A5A'],
    art: () => `
      ${stars(60, 61, { bottom: 400 })}
      ${glow(260, 180, 110, 'warm')}<circle cx="260" cy="180" r="48" fill="#F7B26B"/><circle cx="370" cy="118" r="20" fill="#C8FF7A"/>
      ${ridge(131, 600, 90, '#173C5E', { sharp: true, freq: 1.4 })}
      ${at(880, 230, anim('w-bob', `${S.ufo('#8E98B4')}${at(0, 260, anim('w-beam', S.cow('#E9EBF2')), 0.3)}`, 'animation-duration:4s'), 0.75)}
      ${ridge(132, 690, 26, '#0F4A4E', { freq: 0.8 })}
      ${[[360, 700, 200, 'lime'], [440, 700, 140, 'cyan'], [990, 700, 230, 'lime'], [1060, 700, 150, 'violet']].map(([x, y, h, g]) => `<path d="M${x} ${y} Q${x - 10} ${y - h * 0.6} ${x} ${y - h}" fill="none" stroke="#0A3236" stroke-width="10" stroke-linecap="round"/><path d="M${x - h * 0.3} ${y - h + 10} Q${x} ${y - h - h * 0.3} ${x + h * 0.3} ${y - h + 10}Z" fill="#0A3236"/>${glow(x, y - h, h * 0.4, g, 'w-twinkle')}`).join('')}
      ${ridge(133, 790, 14, '#082F33', { freq: 0.9 })}
      ${[[520, 880, 190], [600, 884, 150], [670, 882, 110]].map(([x, y, h], i) => at(x, y, anim('w-bob', `<path d="M${-h * 0.06} 0 L${-h * 0.04} ${-h * 0.6} M${h * 0.06} 0 L${h * 0.04} ${-h * 0.6}" stroke="#041C1F" stroke-width="${h * 0.04}" stroke-linecap="round"/><path d="M${-h * 0.08} ${-h * 0.58} Q0 ${-h * 0.9} ${h * 0.08} ${-h * 0.58}Z" fill="#041C1F"/><ellipse cx="0" cy="${-h * 0.92}" rx="${h * 0.12}" ry="${h * 0.15}" fill="#041C1F"/>${[-1, 0, 1].map(k => `<circle cx="${k * h * 0.05}" cy="${-h * 0.94}" r="${h * 0.018}" fill="#C8FF7A"/>`).join('')}`, `animation-duration:${2 + i * 0.4}s`))).join('')}`,
  },
  {
    name: 'The Space Armada', alt: '', era: '6500',
    font: { family: 'Pathway Gothic One', q: 'Pathway+Gothic+One', weight: 400 },
    theme: { mode: 'dark', accent: '#FFB45A' },
    sky: ['#000004', '#0A0620'],
    art: () => {
      const fighter = (c, g) => `<path d="M40 0 L-30 -16 L-18 0 L-30 16Z" fill="${c}"/><path d="M-10 -10 L-28 -30 L-16 -30 L4 -6Z M-10 10 L-28 30 L-16 30 L4 6Z" fill="${c}"/>${glow(-30, 0, 20, g)}`;
      return `
      ${stars(200, 77, { bottom: 900 })}
      <circle cx="300" cy="320" r="260" fill="#6A4AB8" opacity=".16" filter="url(#blur-l)"/>
      ${at(820, 250, `
        ${anim('w-spin-slow', `<circle r="124" fill="none" stroke="#4E5466" stroke-width="24"/><circle r="124" fill="none" stroke="#8E94A3" stroke-width="10" stroke-dasharray="26 14"/>`)}
        <path d="M0 -156 L18 -40 L156 0 L18 40 L0 156 L-18 40 L-156 0 L-18 -40Z" fill="#3E4456"/>
        <circle r="48" fill="#2E3242"/>${glow(0, 0, 100, 'sun', 'w-twinkle')}<circle r="22" fill="#FFB45A"/>
        ${[0, 90, 180, 270].map(a => `<circle cx="${(Math.cos(a * Math.PI / 180) * 124).toFixed(0)}" cy="${(Math.sin(a * Math.PI / 180) * 124).toFixed(0)}" r="6" fill="#FFE2A0" class="w-blink"/>`).join('')}`, 0.9)}
      ${at(0, 430, anim('w-cross', `${fighter('#C9CED9', 'blue')}${at(-90, 34, fighter('#C9CED9', 'blue'), 0.8)}<path d="M50 -2 H110" stroke="#7FE7FF" stroke-width="4" stroke-linecap="round" class="w-blink"/>
        <g transform="translate(-300 6)">${fighter('#8E7468', 'ember')}<path d="M50 -2 H100" stroke="#FF8A3D" stroke-width="4" stroke-linecap="round" class="w-blink"/></g>`, 'animation-duration:7s'))}
      ${at(-400, 700, anim('w-cross', P.starship('#7A8094', 'ember'), 'animation-duration:46s;animation-delay:-20s'), 0.8)}`;
    },
  },
  {
    name: 'The Black Hole', alt: '26,000 light-years', era: '10 billion years from now',
    font: { family: 'Michroma', q: 'Michroma', weight: 400 },
    theme: { mode: 'dark', accent: '#FF9F1C' },
    sky: ['#05000C', '#1D0836'],
    art: () => `
      ${stars(140, 91)}
      ${at(600, 380, `
        ${glow(0, 0, 360, 'ember')}
        <ellipse rx="330" ry="70" fill="none" stroke="url(#disk)" stroke-width="30" opacity=".85"/>
        <ellipse rx="260" ry="54" fill="none" stroke="#FFE6B0" stroke-width="6" stroke-dasharray="50 30" class="w-dash" opacity=".7"/>
        <circle r="128" fill="none" stroke="#FFD9A0" stroke-width="6" opacity=".7"/>
        <circle r="118" fill="#000"/>
        <path d="M-330 0 A330 70 0 0 0 330 0" fill="none" stroke="url(#disk)" stroke-width="30"/>`)}
      ${[[S.sock('#7AD3FF'), 0, 0.8], [S.duck('#FFD23F'), -2.6, 0.5], [S.cow('#E9EBF2'), -5.2, 0.4]].map(([art, d, s]) => `<g class="w-spiral" style="animation-delay:${d}s">${at(1000, 380, art, s)}</g>`).join('')}
      ${at(460, 800, `<path d="M0 0 V80" stroke="#3A2A4A" stroke-width="6"/><rect x="-92" y="-60" width="184" height="66" rx="6" fill="#120A1E" stroke="#FF9F1C" stroke-width="2"/><text x="0" y="-30" text-anchor="middle" font-family="Michroma, sans-serif" font-size="17" fill="#FF9F1C">NO U-TURNS</text><text x="0" y="-8" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="700" font-size="13" fill="#FFD9A0">beyond this point</text>`)}`,
  },
];

// Past the black hole the climb goes on forever: Infinity +1, +2, …
const INFINITY_FONTS = [
  { family: 'Orbitron', q: 'Orbitron:wght@800', weight: 800 },
  { family: 'Audiowide', q: 'Audiowide', weight: 400 },
  { family: 'Righteous', q: 'Righteous', weight: 400 },
  { family: 'Michroma', q: 'Michroma', weight: 400 },
];
const INFINITY_ACCENTS = ['#7CF0FF', '#B9F27C', '#FFD36B', '#9CFF57', '#FF9F1C'];

function infinityStage(n) {
  const hue = (n * 47) % 360;
  const r = seeded(n * 97 + 3);
  const floaters = [S.duck('#FFD23F'), S.sock('#7AD3FF'), S.cow('#E9EBF2')];
  const things = Array.from({ length: 2 }, (_, i) =>
    at(400 + r() * 400, 400 + r() * 400, anim('w-float', floaters[(n + i) % floaters.length], `animation-duration:${8 + i * 3}s`), 0.35)).join('');
  return {
    name: `Infinity +${n}`,
    alt: `${(n * 50).toLocaleString('en-US')} billion light-years`,
    era: 'beyond time',
    font: INFINITY_FONTS[n % INFINITY_FONTS.length],
    theme: { mode: 'dark', accent: INFINITY_ACCENTS[n % INFINITY_ACCENTS.length] },
    sky: [`hsl(${hue} 55% 6%)`, `hsl(${(hue + 40) % 360} 55% 18%)`],
    art: () => `
      ${stars(180, n * 13 + 5, { bottom: 900 })}
      <circle cx="${300 + r() * 600}" cy="${200 + r() * 400}" r="${200 + r() * 80}" fill="hsl(${(hue + 120) % 360} 80% 60%)" opacity=".3" filter="url(#blur-l)"/>
      <circle cx="${300 + r() * 600}" cy="${200 + r() * 400}" r="${160 + r() * 80}" fill="hsl(${(hue + 200) % 360} 80% 60%)" opacity=".26" filter="url(#blur-l)"/>
      ${things}`,
  };
}

function stageAt(i) {
  return i < STAGES.length ? STAGES[i] : infinityStage(i - STAGES.length + 1);
}

// The home screen: calm deep water, life only at the edges and the bottom.
const HOME_STAGE = {
  font: { family: 'Inter', q: 'Inter:wght@800', weight: 800 },
  theme: { mode: 'dark', accent: '#FFFFFF' },
  sky: ['#0E3D72', '#020A16'],
  art: () => `
    ${rays(0.45)}${drift(21, 34, '#BFE9FF', 1.3, 0.5)}
    ${at(170, 330, anim('w-float', `${glow(0, -20, 80, 'violet')}<path d="M-36 0 Q-38 -48 0 -50 Q38 -48 36 0 Q18 7 0 2 Q-18 7 -36 0Z" fill="#B9A6FF" opacity=".7"/>${anim('w-sway', `<path d="M-20 2 Q-26 44 -14 90 M0 3 Q-4 54 4 104 M20 2 Q26 44 14 84" fill="none" stroke="#B9A6FF" stroke-opacity=".55" stroke-width="2"/>`)}`, 'animation-duration:9s'), 0.9)}
    ${at(1040, 260, anim('w-float', `${glow(0, -20, 60, 'teal')}<path d="M-28 0 Q-30 -38 0 -40 Q30 -38 28 0 Q14 6 0 2 Q-14 6 -28 0Z" fill="#7FFFE0" opacity=".65"/>`, 'animation-duration:11s;animation-delay:-4s'), 0.8)}
    ${at(0, 160, anim('w-cross', `<g fill="#0E3560" opacity=".8"><ellipse rx="130" ry="40"/><path d="M100 -18 Q190 -120 270 -128 Q300 -126 294 -108 Q270 -98 250 -102 Q190 -88 120 10Z M-120 -4 Q-210 10 -250 40 Q-190 30 -110 20Z"/></g>`, 'animation-duration:50s;animation-delay:-24s'), 0.8)}
    ${ridge(201, 820, 30, '#061529', { sharp: true, freq: 1.2 })}
    ${ridge(202, 860, 14, '#030C18', { freq: 0.8 })}
    ${bubbles(29, 12, 120, 1080)}`,
};

// ---------- Fonts: each place has its own display face ----------

// All fonts live in fonts/ (declared in fonts/fonts.css), so this only warms one up
// before it's needed. No internet connection required.
function loadFont(font) {
  if (document.fonts && document.fonts.load) document.fonts.load(`${font.weight} 1em "${font.family}"`).catch(() => {});
}

const fontStack = font => `'${font.family}', 'Nunito', system-ui, sans-serif`;

// The UI follows the place you're in: display font, accent and light or dark panels.
function applyTheme(stage) {
  loadFont(stage.font);
  const root = document.documentElement;
  root.style.setProperty('--display', fontStack(stage.font));
  root.style.setProperty('--display-weight', stage.font.weight);
  root.style.setProperty('--accent', stage.theme.accent);
  root.style.setProperty('--on-accent', isLight(stage.theme.accent) ? '#14182B' : '#fff');
  root.dataset.mode = stage.theme.mode;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', stage.sky[0]);
}

// Whether dark text reads better than white on this color.
function isLight(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.25;
}

// ---------- Showing a stage ----------

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let currentScene = null;

function renderScene(stage) {
  const el = document.createElement('div');
  el.className = 'scene';
  el.style.background = `linear-gradient(${stage.sky[0]}, ${stage.sky[1]})`;
  el.innerHTML = `<svg viewBox="0 0 1200 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${stage.art()}</svg>${stage.html ? stage.html() : ''}`;
  return el;
}

// Climbing: the new place drops in from above while the old one sinks away below.
function setScene(stage, climb) {
  const world = document.getElementById('world');
  const el = renderScene(stage);
  if (!climb || !currentScene || reducedMotion.matches) {
    world.replaceChildren(el);
  } else {
    // Fast climbs: drop scenes still sliding away so they never pile up.
    world.querySelectorAll('.scene.to-below').forEach(n => n.remove());
    const old = currentScene;
    el.classList.add('from-above');
    world.appendChild(el);
    void el.offsetWidth;
    el.classList.remove('from-above');
    old.classList.add('to-below');
    setTimeout(() => old.remove(), 1500);
  }
  currentScene = el;
}

function showStage(i, climb = false) {
  const stage = stageAt(i);
  applyTheme(stage);
  loadFont(stageAt(i + 1).font); // warm up the next one
  setScene(stage, climb);
  return stage;
}

function showHome() {
  applyTheme(HOME_STAGE);
  setScene(HOME_STAGE, false);
}
