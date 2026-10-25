// rulez — every level of the climb, in order. 101 distinct places, then Infinity.
// The climb is a timeline: deep past under the sea, history on land (oldest first),
// the sky, then space ever further into the future and finally beyond time.
// New places use the same layered-landscape method as the classic ones in world.js.

// ---------- Props: silhouettes with the odd lit detail ----------

const P = {
  columns(w, h, n, c, cap = c) {
    const gap = w / n;
    let cols = '';
    for (let i = 0; i < n; i++) cols += `<rect x="${(-w / 2 + gap * i + gap * 0.25).toFixed(1)}" y="${-h}" width="${(gap * 0.5).toFixed(1)}" height="${h}" fill="${c}"/>`;
    return `<rect x="${-w / 2 - 10}" y="-8" width="${w + 20}" height="8" fill="${c}"/>${cols}<rect x="${-w / 2 - 10}" y="${-h - 14}" width="${w + 20}" height="14" fill="${cap}"/>`;
  },
  temple(w, h, c, roof = c) {
    return `${P.columns(w, h, 8, c)}<path d="M${-w / 2 - 16} ${-h - 14} L0 ${-h - 14 - w * 0.18} L${w / 2 + 16} ${-h - 14}Z" fill="${roof}"/>`;
  },
  crenWall(x0, x1, y, h, c, step = 22) {
    let d = `M${x0} ${y} V${y - h}`;
    for (let x = x0; x < x1; x += step) d += ` H${x + step / 2} V${y - h - step / 2} H${x + step} V${y - h}`;
    return `<path d="${d} H${x1} V${y}Z" fill="${c}"/>`;
  },
  tower(w, h, c, roof = '') {
    return `<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="${c}"/>${roof === 'cone' ? `<path d="M${-w / 2 - 6} ${-h} L0 ${-h - w * 1.1} L${w / 2 + 6} ${-h}Z" fill="${c}"/>` : P.crenWall(-w / 2, w / 2, -h, 0, c, w / 4)}`;
  },
  dome(r, c) { return `<path d="M${-r} 0 A${r} ${r * 1.05} 0 0 1 ${r} 0Z" fill="${c}"/><path d="M0 ${-r * 1.05} V${-r * 1.35}" stroke="${c}" stroke-width="${r * 0.08}"/>`; },
  onionDome(r, c) { return `<path d="M${-r} 0 Q${-r * 1.15} ${-r * 0.9} 0 ${-r * 1.6} Q${r * 1.15} ${-r * 0.9} ${r} 0Z" fill="${c}"/><path d="M0 ${-r * 1.6} V${-r * 2}" stroke="${c}" stroke-width="${r * 0.08}"/>`; },
  minaret(h, c) { return `<rect x="-7" y="${-h}" width="14" height="${h}" fill="${c}"/><rect x="-11" y="${-h * 0.7}" width="22" height="6" fill="${c}"/><g transform="translate(0 ${-h})">${P.onionDome(10, c)}</g>`; },
  horse(c) { return S.horseRider(c, '').replace(/<g transform="translate\(-6 -58\)">[\s\S]*$/, ''); },
  stepPyramid(w, h, steps, c, light) {
    let out = '';
    for (let i = 0; i < steps; i++) {
      const sw = w * (1 - i / steps * 0.75), sh = h / steps;
      out += `<rect x="${-sw / 2}" y="${-(i + 1) * sh}" width="${sw}" height="${sh}" fill="${c}"/><rect x="${-sw / 2}" y="${-(i + 1) * sh}" width="${sw}" height="3" fill="${light}"/>`;
    }
    return `${out}<rect x="${-w * 0.08}" y="${-h - h * 0.18}" width="${w * 0.16}" height="${h * 0.18}" fill="${c}"/><rect x="-6" y="${-h}" width="12" height="${h}" fill="${light}" opacity=".35"/>`;
  },
  roundTree(r, c) { return `<rect x="${-r * 0.1}" y="${-r * 1.4}" width="${r * 0.2}" height="${r * 1.4}" fill="${c}"/><circle cy="${-r * 1.6}" r="${r}" fill="${c}"/><circle cx="${-r * 0.6}" cy="${-r * 1.3}" r="${r * 0.7}" fill="${c}"/><circle cx="${r * 0.6}" cy="${-r * 1.35}" r="${r * 0.7}" fill="${c}"/>`; },
  cypress(h, c) { return `<path d="M0 0 Q${-h * 0.12} ${-h * 0.5} 0 ${-h} Q${h * 0.12} ${-h * 0.5} 0 0Z" fill="${c}"/>`; },
  crowd(x0, x1, y, n, c, seed = 1, h = 46) {
    const r = seeded(seed);
    let out = '';
    for (let i = 0; i < n; i++) {
      const x = x0 + (x1 - x0) * (i + r() * 0.8) / n, hh = h * (0.8 + r() * 0.35);
      out += `<g transform="translate(${x.toFixed(0)} ${(y + r() * 6).toFixed(0)})">${S.person(hh, c, { walk: r() < 0.3 })}</g>`;
    }
    return out;
  },
  skyline(seed, y, hMin, hMax, c, lit = '#FFE29A', density = 0.5) {
    const r = seeded(seed);
    let out = '', x = -40;
    while (x < 1240) {
      const w = 40 + r() * 50, h = hMin + r() * (hMax - hMin);
      out += `<rect x="${x.toFixed(0)}" y="${(y - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${c}"/>`;
      for (let wy = y - h + 10; wy < y - 10; wy += 16) for (let wx = x + 6; wx < x + w - 8; wx += 12) {
        if (r() < density * 0.3) out += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="4" height="6" fill="${lit}" opacity=".85"/>`;
      }
      x += w + 2;
    }
    return out;
  },
  house(w, h, c, lit) { return `<path d="M${-w / 2} 0 V${-h} L0 ${-h - w * 0.45} L${w / 2} ${-h} V0Z" fill="${c}"/>${lit ? `<rect x="${-w * 0.25}" y="${-h * 0.7}" width="${w * 0.18}" height="${h * 0.3}" fill="${lit}"/><rect x="${w * 0.08}" y="${-h * 0.7}" width="${w * 0.18}" height="${h * 0.3}" fill="${lit}"/>` : ''}`; },
  smoke(x, y, color = '#E8E2DA', n = 3) {
    return Array.from({ length: n }, (_, i) => anim('w-puff', `<circle cx="${x}" cy="${y}" r="${14 + i * 6}" fill="${color}" opacity=".7"/>`, `animation-delay:-${(i * 0.6).toFixed(1)}s;animation-duration:2.4s`)).join('');
  },
  flag(h, c, cloth) { return `<path d="M0 0 V${-h}" stroke="${c}" stroke-width="3"/>${anim('w-flag', `<path d="M0 ${-h} h${h * 0.45} v${h * 0.28} h${-h * 0.45}Z" fill="${cloth}"/>`)}`; },
  firework(x, y, r, color, delay = 0) {
    const rays = Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<path d="M${(Math.cos(a) * r * 0.3).toFixed(1)} ${(Math.sin(a) * r * 0.3).toFixed(1)} L${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`; }).join('');
    return at(x, y, anim('w-burst', `${rays}${glow(0, 0, r * 0.8, 'warm')}`, `animation-delay:-${delay}s`));
  },
  // Vehicles
  sailboat(c, sail = '#F3EEE2') { return `<path d="M-50 0 H50 Q40 18 0 20 Q-40 18 -50 0Z" fill="${c}"/><path d="M0 0 V-80 L44 -8Z" fill="${sail}"/><path d="M-4 -6 V-70 L-36 -8Z" fill="${sail}" opacity=".85"/>`; },
  caravel(c, sail = '#EFE4CC', cross = '#B5302B') {
    return `<path d="M-120 -10 H110 Q130 -16 140 -40 L126 10 Q110 30 0 32 Q-100 30 -122 14 L-140 -30Z" fill="${c}"/>
      ${[-60, 10, 70].map((x, i) => `<path d="M${x} -10 V${-150 + i * 20}" stroke="${c}" stroke-width="5"/><path d="M${x - 36} ${-136 + i * 20} Q${x} ${-150 + i * 20} ${x + 36} ${-136 + i * 20} Q${x + 42} ${-90 + i * 10} ${x + 36} ${-50} Q${x} ${-60} ${x - 36} ${-50} Q${x - 42} ${-90 + i * 10} ${x - 36} ${-136 + i * 20}Z" fill="${sail}"/><path d="M${x} ${-120 + i * 18} v40 M${x - 16} ${-100 + i * 14} h32" stroke="${cross}" stroke-width="5"/>`).join('')}`;
  },
  longship(c, shields = ['#C0392B', '#E9C46A', '#2A6F97']) {
    return `<path d="M-170 -20 Q-150 20 0 22 Q150 20 170 -20 Q190 -60 176 -90 Q166 -60 150 -24 H-150 Q-166 -60 -176 -90 Q-190 -60 -170 -20Z" fill="${c}"/>
      ${Array.from({ length: 9 }, (_, i) => `<circle cx="${-120 + i * 30}" cy="-20" r="12" fill="${shields[i % 3]}"/>`).join('')}
      <path d="M0 -24 V-170" stroke="${c}" stroke-width="6"/><path d="M-70 -160 H70 V-50 H-70Z" fill="#E9DCC0"/><path d="M-70 -140 H70 M-70 -110 H70 M-70 -80 H70" stroke="#A8322D" stroke-width="12" opacity=".8"/>`;
  },
  pirateShip(c) {
    return `<path d="M-150 -20 H140 Q160 -30 170 -60 L150 10 Q130 34 0 36 Q-120 34 -150 14 L-170 -50Z" fill="${c}"/>
      ${[-60, 30].map((x, i) => `<path d="M${x} -20 V${-200 + i * 20}" stroke="${c}" stroke-width="6"/><path d="M${x - 50} ${-180 + i * 20} H${x + 50} Q${x + 56} ${-130} ${x + 50} ${-70} H${x - 50} Q${x - 56} -130 ${x - 50} ${-180 + i * 20}Z" fill="#D9CFB8"/>`).join('')}
      <path d="M-60 -200 h44 v28 h-44Z" fill="#111"/><circle cx="-38" cy="-190" r="6" fill="#EEE"/><path d="M-46 -180 l16 6 M-30 -180 l-16 6" stroke="#EEE" stroke-width="2"/>
      ${[-100, -60, -20, 20, 60, 100].map(x => `<rect x="${x - 6}" y="-6" width="12" height="8" fill="#111"/>`).join('')}`;
  },
  liner(c, lit = '#FFE29A', funnel = '#C8482C') {
    return `<path d="M-300 -40 H290 Q310 -40 320 -70 L300 20 H-290Z" fill="${c}"/>
      <rect x="-230" y="-80" width="420" height="40" fill="#E9E4DA"/>
      ${[-150, -60, 30, 120].map(x => `<path d="M${x - 18} -80 L${x - 14} -150 H${x + 14} L${x + 18} -80Z" fill="${funnel}"/><path d="M${x - 14} -150 H${x + 14} V-136 H${x - 14}Z" fill="#111"/>`).join('')}
      ${Array.from({ length: 30 }, (_, i) => `<circle cx="${-270 + i * 18}" cy="-20" r="2.6" fill="${lit}"/>`).join('')}`;
  },
  battleship(c) {
    return `<path d="M-260 -20 H240 Q262 -24 276 -50 L256 16 H-250Z" fill="${c}"/>
      <path d="M-120 -20 V-60 H-60 V-100 H-20 V-140 H10 V-100 H60 V-60 H120 V-20Z" fill="${c}"/>
      <path d="M-200 -36 h60 M-180 -32 h-60 M150 -36 h60 M170 -32 h60" stroke="${c}" stroke-width="6"/><path d="M-6 -140 V-190" stroke="${c}" stroke-width="4"/>`;
  },
  landingCraft(c) { return `<path d="M-60 0 H60 V-30 H-50 Z M60 0 L72 -34 H60Z" fill="${c}"/>${P.crowd(-40, 40, -24, 6, c, 4, 24)}`; },
  freighter(c, cargo = '#55606E') { return `<path d="M-200 -20 H190 Q210 -24 220 -50 L200 14 H-190Z" fill="${c}"/><rect x="-170" y="-60" width="60" height="40" fill="${c}"/><path d="M-80 -24 L-20 -34 H60 L120 -24Z M-40 -34 L-36 -58 H20 L24 -34Z" fill="${cargo}"/>`; },
  biplane(c, wing = c) {
    return `<path d="M-60 0 Q-60 -12 -40 -12 H50 Q70 -10 74 0 Q70 8 50 8 H-40 Q-60 10 -60 0Z" fill="${c}"/><rect x="-30" y="-30" width="70" height="7" rx="3" fill="${wing}"/><rect x="-30" y="10" width="70" height="7" rx="3" fill="${wing}"/>
      <path d="M-20 -24 V12 M28 -24 V12" stroke="${c}" stroke-width="3"/><path d="M-60 0 L-74 -16 V12Z" fill="${c}"/>${anim('w-blink', `<path d="M76 -14 V14" stroke="${c}" stroke-width="3"/>`)}`;
  },
  warplane(c) { return `<path d="M-70 0 Q-60 -10 -30 -8 H60 Q80 -6 84 0 Q80 6 60 8 H-30 Q-60 10 -70 0Z M-10 -6 L30 -60 H46 L30 -6Z M-10 6 L30 60 H46 L30 6Z M-66 0 L-80 -22 H-70 L-56 -4Z" fill="${c}"/>`; },
  airliner(c) { return `<path d="M-120 0 Q-120 -14 -96 -14 H100 Q130 -12 140 0 Q130 10 100 12 H-96 Q-120 12 -120 0Z M-10 -10 L40 -70 H60 L30 -10Z M-10 8 L40 60 H60 L30 8Z M-110 -6 L-130 -44 H-112 L-90 -10Z" fill="${c}"/>${Array.from({ length: 12 }, (_, i) => `<circle cx="${-80 + i * 14}" cy="-4" r="2.4" fill="#9FC7EA"/>`).join('')}`; },
  jet(c) { return `<path d="M-100 0 L100 -4 Q130 0 100 4 Z M-30 -2 L20 -50 H34 L14 -2Z M-30 2 L20 50 H34 L14 2Z M-96 0 L-112 -26 H-100 L-84 -2Z" fill="${c}"/>${anim('w-flame', `<path d="M-100 -3 Q-130 0 -100 3Z" fill="#FFB45A"/>`)}`; },
  hotAirBalloon(c1, c2) { return `<path d="M-50 -60 Q-50 -130 0 -130 Q50 -130 50 -60 Q46 -20 14 0 H-14 Q-46 -20 -50 -60Z" fill="${c1}"/><path d="M-16 -128 Q-24 -60 -14 0 H14 Q24 -60 16 -128Z" fill="${c2}"/><path d="M-12 0 L-10 22 M12 0 L10 22" stroke="#4A3828" stroke-width="2"/><rect x="-12" y="22" width="24" height="16" fill="#6B4A2E"/>`; },
  rocket(c, h = 260, flame = true) {
    return `<path d="M-22 0 V${-h * 0.8} Q-22 ${-h} 0 ${-h * 1.05} Q22 ${-h} 22 ${-h * 0.8} V0Z" fill="${c}"/><path d="M-22 0 L-44 26 V-50Z M22 0 L44 26 V-50Z" fill="${c}"/>
      <rect x="-22" y="${-h * 0.62}" width="44" height="8" fill="#222"/><rect x="-22" y="${-h * 0.3}" width="44" height="8" fill="#222"/>
      ${flame ? `${glow(0, 40, 120, 'sun')}${anim('w-flame', `<path d="M-20 0 Q-26 70 0 130 Q26 70 20 0Z" fill="#FFB45A"/><path d="M-10 0 Q-12 40 0 80 Q12 40 10 0Z" fill="#FFF1C8"/>`)}` : ''}`;
  },

  bus(c = '#C8312C') { return `<rect x="-90" y="-110" width="180" height="104" rx="10" fill="${c}"/>${[-70, -36, -2, 32].map(x => `<rect x="${x}" y="-100" width="26" height="22" fill="#CFE3F2"/><rect x="${x}" y="-60" width="26" height="22" fill="#CFE3F2"/>`).join('')}${[-56, 56].map(x => `<circle cx="${x}" cy="-6" r="14" fill="#1A1A1A"/>`).join('')}`; },
  van(c, body = '#E9A23B') { return `<path d="M-80 -10 V-70 Q-80 -96 -50 -96 H60 Q80 -96 80 -70 V-10Z" fill="${body}"/><path d="M-80 -50 H80" stroke="#fff" stroke-width="14"/><rect x="-60" y="-84" width="40" height="22" fill="#CFE3F2"/><rect x="0" y="-84" width="56" height="22" fill="#CFE3F2"/>${[-46, 46].map(x => `<circle cx="${x}" cy="-8" r="14" fill="${c}"/>`).join('')}`; },
  // Animals
  elephant(c) { return `<path d="M-70 -50 Q-74 -110 -10 -112 Q50 -114 60 -80 Q84 -84 90 -50 Q96 -10 84 20 L76 18 Q82 -10 74 -40 L60 -40 Q56 -20 50 -10 V0 H34 V-24 H-34 V0 H-50 V-24 Q-70 -30 -70 -50Z" fill="${c}"/>`; },
  mammoth(c) { return `${P.elephant(c)}<path d="M84 -40 Q120 -30 110 10 Q104 -10 84 -20Z" fill="#E9E1D2"/>`; },
  bison(c) { return `<path d="M-60 -30 Q-64 -60 -30 -62 Q0 -96 40 -80 Q70 -70 72 -40 L80 -20 L66 -16 V0 H54 V-20 H-30 V0 H-44 V-24 Q-60 -20 -60 -30Z" fill="${c}"/>`; },
  llama(c) { return `<path d="M-40 -40 H20 V-90 Q20 -110 36 -110 L44 -126 L46 -108 Q50 -100 44 -94 V-40 Q44 -20 30 -20 V0 H22 V-20 H-26 V0 H-34 V-20 Q-40 -26 -40 -40Z" fill="${c}"/>`; },
  deer(c) { return `<path d="M-50 -40 Q-50 -60 -20 -60 H30 L46 -96 Q56 -100 60 -90 L50 -60 Q50 -40 40 -36 V0 H32 V-30 H-34 V0 H-42 V-30 Q-50 -34 -50 -40Z" fill="${c}"/><path d="M50 -96 L44 -130 M50 -96 L66 -126 M46 -116 L34 -124 M58 -112 L70 -118" stroke="${c}" stroke-width="3"/>`; },
  turtle(c, shell) { return `<ellipse rx="54" ry="28" fill="${shell}"/><path d="M50 -4 Q76 -14 80 0 Q74 12 50 6Z M-20 22 L-50 50 L-10 28Z M20 22 L50 46 L24 26Z M-20 -22 L-56 -50 L-10 -28Z M20 -22 L60 -44 L24 -26Z" fill="${c}"/>`; },
  whale(c) { return `<path d="M-160 0 Q-150 -60 -20 -64 Q120 -66 160 -10 Q180 6 200 -30 Q206 10 190 30 Q160 50 130 20 Q60 50 -40 40 Q-150 40 -160 0Z" fill="${c}"/><path d="M-120 20 Q-60 34 0 30" stroke="#fff" stroke-opacity=".25" stroke-width="10" fill="none"/>`; },
  mosasaur(c) { return `<path d="M-200 0 Q-120 -40 40 -30 Q120 -26 170 -10 L210 -20 Q206 -4 214 6 L170 10 Q120 30 30 26 Q-80 24 -200 0Z M-200 0 L-260 -40 L-240 0 L-260 36Z M-20 20 L-60 60 L0 28Z M80 20 L60 56 L100 24Z" fill="${c}"/>`; },
  seal(c) { return `<path d="M-50 0 Q-40 -26 0 -26 Q40 -28 54 -10 Q60 0 50 4 Q20 12 -10 10 L-50 20 L-44 4Z" fill="${c}"/>`; },
  eagle(c) { return `<path d="M0 0 Q-40 -26 -90 -14 Q-50 -8 -20 6 Q0 12 20 6 Q50 -8 90 -14 Q40 -26 0 0Z" fill="${c}"/>`; },
  // Space
  planet(r, a, b, ring = '') {
    return `${ring ? `<ellipse rx="${r * 1.9}" ry="${r * 0.42}" fill="none" stroke="${ring}" stroke-width="${r * 0.18}" opacity=".8"/>` : ''}
      <circle r="${r}" fill="${a}"/><path d="M${-r} 0 A${r} ${r} 0 0 0 ${r} 0 A${r} ${r * 0.6} 0 0 1 ${-r} 0Z" fill="${b}" opacity=".45"/>
      <path d="M${r * 0.2} ${-r} A${r} ${r} 0 0 1 ${r * 0.2} ${r} A${r * 0.85} ${r} 0 0 0 ${r * 0.2} ${-r}Z" fill="#000" opacity=".35"/>
      ${ring ? `<path d="M${-r * 1.9} 0 A${r * 1.9} ${r * 0.42} 0 0 0 ${r * 1.9} 0" fill="none" stroke="${ring}" stroke-width="${r * 0.18}"/>` : ''}`;
  },
  starship(c, glowName = 'blue') {
    return `<path d="M200 0 L-120 -46 L-160 -46 L-140 -12 L-184 -12 L-184 12 L-140 12 L-160 46 L-120 46Z" fill="${c}"/>
      <path d="M200 0 L-120 -46 L-62 0 L-120 46Z" fill="#000" opacity=".12"/>
      <path d="M40 -7 H124 L150 0 L124 7 H40Z" fill="#2A3048"/><rect x="-66" y="-72" width="64" height="24" rx="7" fill="${c}"/>
      ${glow(-190, 0, 46, glowName)}${glow(-154, -40, 22, glowName)}${glow(-154, 40, 22, glowName)}
      ${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${-90 + i * 30}" cy="-16" r="2.4" fill="#FFE29A" class="w-twinkle" style="animation-delay:-${i * 0.3}s"/>`).join('')}`;
  },

  robot(h, c, eye = '#FF6B6B') { return `<rect x="${-h * 0.18}" y="${-h * 0.5}" width="${h * 0.36}" height="${h * 0.3}" rx="6" fill="${c}"/><rect x="${-h * 0.14}" y="${-h * 0.82}" width="${h * 0.28}" height="${h * 0.26}" rx="8" fill="${c}"/><rect x="${-h * 0.09}" y="${-h * 0.74}" width="${h * 0.18}" height="${h * 0.05}" fill="${eye}" class="w-blink"/><path d="M${-h * 0.1} ${-h * 0.2} V0 M${h * 0.1} ${-h * 0.2} V0 M${-h * 0.18} ${-h * 0.45} L${-h * 0.3} ${-h * 0.2} M${h * 0.18} ${-h * 0.45} L${h * 0.3} ${-h * 0.2}" stroke="${c}" stroke-width="${h * 0.07}" stroke-linecap="round"/>`; },
  hero(c, cape) { return `<path d="M-6 -60 Q-60 -40 -80 10 Q-40 -10 -10 -20Z" fill="${cape}"/><g transform="rotate(-70)">${S.person(90, c)}</g><path d="M30 -70 L66 -96" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`; },
  crystal(h, c, light) { return `<path d="M0 0 L${-h * 0.18} ${-h * 0.7} L0 ${-h} L${h * 0.18} ${-h * 0.7}Z" fill="${c}"/><path d="M0 ${-h} L${h * 0.18} ${-h * 0.7} L0 0Z" fill="${light}" opacity=".5"/>`; },
};

const sky = (top, bottom) => [top, bottom];
const sun = (x, y, r, color = '#FFF4D6', g = 'sun') => `${glow(x, y, r * 6, g)}<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
const moon = (x, y, r, color = '#F3EEDD') => `${glow(x, y, r * 3, 'warm')}<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
const sea = (y, c1, c2, glintColor = '#fff', seed = 1) => `<rect x="-40" y="${y}" width="1280" height="${960 - y}" fill="${c1}"/>${glints(seed, y + 8, y + 140, 30, glintColor)}<rect x="-40" y="${y + 150}" width="1280" height="400" fill="${c2}"/>`;
const F = (family, weight = 400, axis = '') => ({ family, q: `${family.replace(/ /g, '+')}${axis || (weight !== 400 ? `:wght@${weight}` : '')}`, weight });

// ---------- New places ----------

const NEW = {
  jurassic: {
    name: 'Jurassic Sea', era: '150 million years ago', zone: 'sea',
    font: F('Rubik Wet Paint'), theme: { mode: 'dark', accent: '#8FD6A8' }, sky: sky('#0F4A6B', '#03141F'),
    art: () => `${rays(0.45)}${drift(31, 30, '#CFEFFF', 1.3, 0.4)}
      ${at(-200, 360, anim('w-cross', P.mosasaur('#0A2E45'), 'animation-duration:36s;animation-delay:-10s'), 0.9)}
      ${at(0, 220, anim('w-cross', `${P.mosasaur('#123A55')}`, 'animation-duration:60s;animation-delay:-40s'), 0.5)}
      ${at(560, 500, anim('w-float', `${[0, 70, 140].map((x, i) => at(x, i * 30, S.dolphin('#0E3550'), 0.8)).join('')}`, 'animation-duration:12s'))}
      ${[[330, 300, 'teal'], [880, 420, 'violet'], [700, 260, 'teal']].map(([x, y, g], i) => at(x, y, anim('w-float', `${glow(0, 0, 40, g, 'w-twinkle')}<circle r="5" fill="#E9FFFA"/>`, `animation-duration:${7 + i * 2}s`))).join('')}
      ${ridge(32, 720, 40, '#0A2638', { sharp: true, freq: 1.3 })}${ridge(33, 800, 18, '#061A28')}
      ${[[450, 830], [760, 850], [600, 870]].map(([x, y], i) => at(x, y, anim('w-pace', `<circle r="26" fill="#03111C"/><path d="M0 0 m-4 0 a4 4 0 1 1 8 0 a10 10 0 1 1 -18 0 a16 16 0 1 1 30 0" fill="none" stroke="#2B6B8A" stroke-width="2"/>`, `--pace:${i % 2 ? -60 : 60}px;animation-duration:${8 + i * 2}s`))).join('')}
      ${bubbles(34, 8)}`,
  },
  ice: {
    name: 'Under the Ice', era: '20,000 BC', zone: 'sea',
    font: F('Snowburst One'), theme: { mode: 'dark', accent: '#BFE3FF' }, sky: sky('#9CC9E6', '#0B2B47'),
    art: () => `<rect x="-40" y="-20" width="1280" height="180" fill="#DCEEFA"/><path d="M-40 160 Q200 190 420 168 T860 176 T1240 166 V-20 H-40Z" fill="#C6E2F5"/>
      ${at(-100, 110, anim('w-cross', `${P.mammoth('#7E97AC')}${at(-220, 0, P.mammoth('#7E97AC'), 0.8)}`, 'animation-duration:70s;animation-delay:-30s'), 0.7)}
      ${rays(0.5)}
      ${at(0, 420, anim('w-cross', P.seal('#123651'), 'animation-duration:16s'))}${at(0, 560, anim('w-cross', P.seal('#0F2E46'), 'animation-duration:22s;animation-delay:-9s'), 0.8)}
      ${ridge(35, 800, 26, '#0A2238')}${bubbles(36, 10)}`,
  },
  reef: {
    name: 'The Coral Reef', era: '10,000 BC', zone: 'sea',
    font: F('Gochi Hand'), theme: { mode: 'dark', accent: '#FFB38A' }, sky: sky('#1C8EC2', '#0A3B5C'),
    art: () => `${rays(0.7)}
      ${at(0, 300, anim('w-cross', P.turtle('#1E5A44', '#3F7C5A'), 'animation-duration:30s;animation-delay:-12s'), 0.9)}
      ${ridge(37, 740, 30, '#0E4A66')}
      ${Array.from({ length: 14 }, (_, i) => { const r = seeded(i + 70); const x = 300 + r() * 600, h = 40 + r() * 70; const c = ['#FF8A6B', '#F2C14E', '#B98AF2', '#FF6B8A'][i % 4]; return `<path d="M${x.toFixed(0)} 820 q-10 ${-h * 0.6} ${(r() * 30 - 15).toFixed(0)} ${-h} M${x.toFixed(0)} 820 q14 ${-h * 0.5} 26 ${-h * 0.8}" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round" opacity=".85" class="w-sway"/>`; }).join('')}
      ${ridge(38, 830, 14, '#0A3550')}
      ${at(0, 700, anim('w-cross', Array.from({ length: 14 }, (_, i) => `<path transform="translate(${i * 18} ${Math.sin(i) * 20})" d="M0 0 Q10 -6 20 0 Q10 6 0 0Z M0 0 L-6 -4 L-6 4Z" fill="#FFD66B"/>`).join(''), 'animation-duration:18s'))}
      ${bubbles(39, 8)}`,
  },
  troy: {
    name: 'Troy', era: '1180 BC', zone: 'land',
    font: F('Cinzel', 700), theme: { mode: 'light', accent: '#B9783A' }, sky: sky('#E39A62', '#F9DFB8'),
    art: () => `${sun(260, 230, 40)}${birds(620, 170, 4, '#6A3A22', 11)}
      ${ridge(41, 540, 30, '#C99A72', { freq: 0.5 })}
      ${at(140, 560, anim('w-bob', `<path d="M-90 0 H80 Q100 -10 106 -40 L94 6 Q80 20 0 20 Q-80 20 -96 8Z" fill="#5A3A22"/><path d="M-10 0 V-90" stroke="#5A3A22" stroke-width="4"/><path d="M-50 -84 H30 V-30 H-50Z" fill="#E9DCC0"/>`, 'animation-duration:5s'), 0.6)}
      <path d="M520 600 Q560 460 760 440 Q960 450 1040 600Z" fill="#B8865A"/>
      <path d="M560 470 H1010 L1030 560 H540Z" fill="#9A6E48"/>
      ${P.crenWall(560, 1010, 470, 70, '#A9784E')}${[580, 700, 860, 990].map((x, i) => at(x, 470, P.tower(54, 120 + (i % 2) * 30, '#946640'))).join('')}
      <path d="M760 470 V420 Q785 396 810 420 V470Z" fill="#4A2E18"/>
      ${P.crowd(600, 960, 400, 9, '#5A3A22', 12, 26)}
      ${ridge(42, 690, 12, '#D6A877', { freq: 0.6 })}
      ${at(560, 820, `<rect x="-150" y="-16" width="300" height="16" fill="#4A2E18"/>${[-120, -50, 50, 120].map(x => `<circle cx="${x}" cy="4" r="14" fill="#3A2412"/><circle cx="${x}" cy="4" r="4" fill="#8A6A44"/>`).join('')}
        <g transform="translate(10 -16) scale(1.5)">${horse('#8A5E36', { gait: false, mane: '#6E4626' })}<path d="M-90 -112 H40 M-90 -100 H60 M-80 -92 H66" stroke="#6E4626" stroke-width="1.6" opacity=".7"/><circle cx="118" cy="-182" r="3" fill="#2A1A0E"/></g>`, 0.95)}
      <path d="M700 760 L900 600" stroke="#5A3A22" stroke-width="2"/>
      ${[740, 790, 840, 890].map((x, i) => at(x, 860 - i * 6, figure(110, '#3A2414', { pose: 'walk', hat: 'hoplite', crest: '#A8322D', shield: true, shieldColor: '#B8862E' }))).join('')}
      ${at(390, 870, figure(120, '#3A2414', { hat: 'hoplite', crest: '#A8322D', hold: 'spear', shield: true, shieldColor: '#B8862E' }))}
      ${ridge(43, 850, 8, '#BE8C5C')}`,
  },
  stonehenge: {
    name: 'Stonehenge', era: '1000 BC', zone: 'land',
    font: F('Uncial Antiqua'), theme: { mode: 'dark', accent: '#F2C27B' }, sky: sky('#2E3A6B', '#F2A36B'),
    art: () => `${stars(30, 44, { bottom: 260 })}${sun(600, 640, 50, '#FFE2A8')}
      ${ridge(45, 640, 20, '#4B4466', { freq: 0.5 })}
      ${[[-260, 120], [-170, 140], [-80, 130], [10, 150], [100, 135], [190, 140], [270, 120]].map(([x, h], i) => `<rect x="${600 + x - 26}" y="${700 - h}" width="52" height="${h}" fill="#2B2440"/>${i % 2 ? `<rect x="${600 + x - 70}" y="${700 - h - 24}" width="110" height="24" fill="#2B2440"/>` : ''}`).join('')}
      ${ridge(46, 720, 10, '#2F2A48')}${P.crowd(420, 780, 800, 7, '#1A1630', 46, 60)}`,
  },
  olympia: {
    name: 'Olympia', era: '776 BC', zone: 'land',
    font: F('Marcellus SC'), theme: { mode: 'light', accent: '#3E7BC9' }, sky: sky('#62AEE4', '#E6F4FB'),
    art: () => `${sun(250, 160, 34)}${softCloud(640, 140, 240, '#fff', 0.8)}
      ${ridge(47, 520, 60, '#9DB6A0', { freq: 0.7 })}
      ${at(860, 590, P.temple(300, 120, '#EFE8D8', '#E2D8C2'), 0.85)}${[700, 1010].map(x => at(x, 600, P.roundTree(26, '#5E7A44'))).join('')}
      <path d="M-40 640 Q600 590 1240 640 V700 Q600 660 -40 700Z" fill="#8EAE6A"/>
      ${P.crowd(-20, 1220, 650, 46, '#4A5A34', 48, 34)}
      <path d="M-40 700 Q600 670 1240 700 V800 Q600 770 -40 800Z" fill="#D9BF8A"/>
      <path d="M-40 742 Q600 716 1240 742" stroke="#C4A774" stroke-width="2" fill="none" stroke-dasharray="14 10"/>
      ${at(-200, 790, anim('w-cross', [0, 70, 150, 230].map((x, i) => at(-x, (i % 2) * 6, figure(120, '#5A3A22', { pose: 'run' }))).join(''), 'animation-duration:9s'))}
      <path d="M-40 800 Q600 784 1240 800 V960 H-40Z" fill="#B9A06A"/>
      ${at(470, 880, `<rect x="-26" y="-56" width="52" height="56" fill="#E9E2D0"/><rect x="-32" y="-64" width="64" height="10" fill="#D9D0BA"/>${glow(0, -84, 60, 'ember', 'w-twinkle')}${anim('w-flame', `<path d="M-14 -64 Q-16 -96 0 -118 Q16 -96 14 -64Z" fill="#FF9A3D"/><path d="M-6 -64 Q-6 -84 0 -96 Q6 -84 6 -64Z" fill="#FFE07A"/>`)}`)}
      ${at(640, 900, figure(130, '#3A2A1A', { outfit: 'robe', hat: 'laurel', pose: 'raise', hold: 'scroll' }))}
      ${at(760, 896, figure(124, '#4A3220', { pose: 'hips' }))}`,
  },
  babylon: {
    name: 'Babylon', era: '600 BC', zone: 'land',
    font: F('Federo'), theme: { mode: 'light', accent: '#2F5FB3' }, sky: sky('#E9A24E', '#FBE5B8'),
    art: () => `${sun(300, 220, 44)}${birds(700, 180, 4, '#7A4A2A', 2)}
      ${ridge(51, 600, 12, '#D9B278')}
      ${at(760, 640, P.stepPyramid(360, 300, 7, '#C79A5E', '#E2BD82'))}
      ${at(760, 640, Array.from({ length: 7 }, (_, i) => `<path d="M${-170 + i * 22} ${-i * 43 - 4} q20 30 0 44 M${170 - i * 22} ${-i * 43 - 4} q-20 30 0 44" stroke="#4E8A3E" stroke-width="10" fill="none" stroke-linecap="round"/>`).join(''))}
      ${at(420, 720, `<rect x="-90" y="-150" width="180" height="150" fill="#2F5FB3"/><path d="M-40 0 V-90 A40 40 0 0 1 40 -90 V0Z" fill="#14244A"/>${P.crenWall(-90, 90, -150, 0, '#2F5FB3', 20)}${[-60, -20, 20, 60].map(x => `<rect x="${x - 8}" y="-130" width="16" height="10" fill="#E9C46A"/>`).join('')}`)}
      ${ridge(52, 740, 10, '#C99E62')}${at(600, 800, S.palm(200, '#4A3A22', 0.4))}${P.crowd(640, 820, 860, 4, '#4A3020', 52, 64)}`,
  },
  athens: {
    name: 'Athens', era: '432 BC', zone: 'land',
    font: F('Cinzel Decorative', 700), theme: { mode: 'light', accent: '#2E6FDB' }, sky: sky('#5FA9DE', '#E3F1FA'),
    art: () => `${sun(940, 160, 36)}
      ${ridge(53, 600, 30, '#A9BFCF', { freq: 0.5 })}
      <path d="M300 640 L340 470 Q600 430 860 470 L900 640Z" fill="#C9B48E"/><path d="M600 450 Q860 470 900 640 H700Z" fill="#AE9870"/>
      ${at(600, 470, P.temple(300, 120, '#F3EEE1', '#E5DCC6'))}
      ${ridge(54, 700, 14, '#9AA96E')}${[380, 460, 760, 840].map((x, i) => at(x, 740, P.roundTree(26 + i % 2 * 6, '#5E6B3A'))).join('')}
      ${ridge(55, 790, 8, '#7F8E54')}${at(520, 860, S.person(110, '#3E3A26', { robe: true }))}${at(600, 862, S.person(104, '#3E3A26', { robe: true, hat: 'laurel' }))}`,
  },
  hannibal: {
    name: 'Crossing the Alps', era: '218 BC', zone: 'land',
    font: F('Cormorant SC', 700), theme: { mode: 'light', accent: '#5A79A8' }, sky: sky('#8FB6DA', '#EEF5FB'),
    art: () => `${ridge(56, 500, 140, '#CAD7E6', { sharp: true, freq: 1.3 })}${ridge(57, 600, 100, '#9FB2CB', { sharp: true, freq: 1.1 })}
      ${ridge(58, 720, 40, '#F4F8FC', { freq: 0.8 })}
      ${at(-200, 760, anim('w-cross', [0, 170, 340].map(x => at(-x, 0, P.elephant('#4A4A58'), 0.8)).join('') + at(-470, 0, S.person(80, '#3A3A48', { walk: true, hat: 'helmet' })), 'animation-duration:50s;animation-delay:-22s'))}
      ${ridge(59, 820, 14, '#E6EEF7')}${drift(57, 30, '#fff', 2.4, 0.8)}`,
  },
  greatWall: {
    name: 'The Great Wall', era: '210 BC', zone: 'land',
    font: F('Cormorant Garamond', 700), theme: { mode: 'light', accent: '#B23A2E' }, sky: sky('#D9C7A8', '#F3E9D6'),
    art: () => `${sun(260, 200, 40, '#FFF4DE', 'warm')}
      ${ridge(61, 520, 120, '#B9B49A', { sharp: true, freq: 1.2 })}${ridge(62, 620, 90, '#8E8C6E', { sharp: true, freq: 1.4 })}
      <path d="M-40 640 Q120 560 260 600 T520 560 T800 610 T1060 560 T1240 600" fill="none" stroke="#6E6450" stroke-width="22"/>
      <path d="M-40 640 Q120 560 260 600 T520 560 T800 610 T1060 560 T1240 600" fill="none" stroke="#9C8F70" stroke-width="10" stroke-dasharray="8 8"/>
      ${[[260, 600], [520, 560], [800, 610], [1060, 560]].map(([x, y]) => at(x, y, P.tower(46, 60, '#6E6450'))).join('')}
      ${ridge(63, 760, 30, '#5E6A42', { freq: 1 })}${[420, 480, 760].map(x => at(x, 800, P.roundTree(22, '#3E4A2A'))).join('')}
      ${ridge(64, 840, 10, '#4A5634')}`,
  },
  pompeii: {
    name: 'Pompeii', era: '79 AD', zone: 'land',
    font: F('Cinzel', 700), theme: { mode: 'dark', accent: '#FF8A3D' }, sky: sky('#2E2230', '#B8613E'),
    art: () => `
      <path d="M470 330 Q440 120 520 -40 Q560 -120 640 -60 Q760 -140 820 -40 Q900 60 820 160 Q760 260 700 330Z" fill="#3A2C32" class="w-drift" style="animation-duration:60s"/>
      <path d="M560 340 Q550 200 600 80 Q640 20 680 90 Q720 200 700 340Z" fill="#4A3A40"/>
      ${anim('w-blink', `<path d="M720 40 L700 110 L730 100 L705 180" stroke="#E9E2FF" stroke-width="3" fill="none"/>`, 'animation-duration:2.6s')}
      <path d="M330 580 L560 300 Q630 270 700 300 L940 580Z" fill="#4E3A38"/><path d="M630 290 L700 300 L940 580 H760Z" fill="#3E2E2E"/>
      ${glow(630, 320, 160, 'ember', 'w-twinkle')}<path d="M590 310 Q610 380 600 440 M660 306 Q680 380 700 450" stroke="#FF8A3D" stroke-width="5" fill="none" opacity=".8"/>
      ${ridge(65, 620, 14, '#6A4A40')}
      <path d="M-40 698 Q600 690 1240 698 V770 H-40Z" fill="#5E4238"/>${Array.from({ length: 30 }, (_, i) => `<path d="M${i * 44 - 30} ${710 + (i % 3) * 18} h30" stroke="#4E3630" stroke-width="3"/>`).join('')}
      <rect x="300" y="696" width="640" height="8" rx="4" fill="#000" opacity=".18"/>
      ${at(600, 700, `${[-280, -200, -120].map(x => `<g transform="translate(${x} 0)">${P.house(70, 60, '#A8765A')}<path d="M-38 -60 L0 -94 L38 -60Z" fill="#B5543A"/></g>`).join('')}<g transform="translate(40 0)">${P.columns(220, 110, 7, '#C9AE90')}</g><g transform="translate(260 0)">${P.temple(140, 90, '#B89A7E')}</g>`)}
      ${ridge(66, 760, 8, '#4A3430')}
      ${at(1300, 860, anim('w-cross-rev', `${figure(120, '#1E1414', { pose: 'run', outfit: 'tunic', facing: -1 })}${at(60, 0, figure(110, '#1E1414', { pose: 'run', outfit: 'robe', facing: -1 }))}${at(130, 6, figure(70, '#1E1414', { pose: 'run', facing: -1 }))}${at(300, 0, `<path d="M-50 -40 H40 V-10 H-50Z" fill="#2A1E1A"/><circle cx="-30" cy="-6" r="14" fill="#1E1414"/><circle cx="20" cy="-6" r="14" fill="#1E1414"/><g transform="translate(-110 0) scale(-0.6 0.6)">${horse('#1E1414')}</g>`)}`, 'animation-duration:16s'))}
      ${drift(67, 60, '#8A7A74', 2.4, 0.7)}`,
  },
  rome: {
    name: 'Rome', era: '80 AD', zone: 'land',
    font: F('Cinzel', 700), theme: { mode: 'light', accent: '#A8322D' }, sky: sky('#E7A866', '#F8E7C6'),
    art: () => `${sun(900, 200, 40)}
      ${ridge(71, 600, 16, '#C9A06E')}
      ${at(600, 640, `<path d="M-260 0 V-200 Q0 -240 260 -200 V0Z" fill="#D9B27E"/><path d="M-260 -200 Q0 -240 260 -200 V-180 Q0 -220 -260 -180Z" fill="#C49A62"/>
        ${[0, 1, 2].map(row => Array.from({ length: 11 }, (_, i) => `<path d="M${-240 + i * 46} ${-20 - row * 60} V${-50 - row * 60} a12 12 0 0 1 24 0 V${-20 - row * 60}Z" fill="#8E6A42"/>`).join('')).join('')}
        <path d="M120 -230 V-200 L260 -170 V-200Z" fill="#E9CFA0"/>`)}
      ${ridge(72, 700, 8, '#D8BC8A')}${[330, 370, 860, 900].map(x => at(x, 720, P.cypress(170, '#3E4A2A'))).join('')}
      <path d="M-40 760 H1240 V800 H-40Z" fill="#C9A672"/>
      ${at(-200, 800, anim('w-cross', `<path d="M-60 -10 Q-60 -40 -30 -40 H10 V-10Z" fill="#6A2A20"/><circle cx="-30" cy="-6" r="18" fill="#3A1A10"/>${at(-90, -10, S.person(60, '#3A1A10'))}${at(60, 0, P.horse('#3A1A10'), 0.6)}`, 'animation-duration:10s'))}
      ${ridge(73, 840, 8, '#B8925C')}`,
  },
  petra: {
    name: 'Petra', era: '100 AD', zone: 'land',
    font: F('Marcellus'), theme: { mode: 'light', accent: '#C0603F' }, sky: sky('#E9B48A', '#F6DCC3'),
    art: () => `<path d="M-40 900 V0 H380 Q400 300 420 900Z M820 900 Q800 300 830 0 H1240 V900Z" fill="#B25E46"/>
      <path d="M420 900 Q420 300 460 0 H780 Q800 300 800 900Z" fill="#D88A6A"/>
      ${at(610, 640, `<rect x="-150" y="-260" width="300" height="260" fill="#E6A07E"/>${P.columns(260, 160, 6, '#C77F5E')}<g transform="translate(0 -180)">${P.temple(160, 60, '#C77F5E')}</g><rect x="-30" y="-110" width="60" height="110" fill="#5A2A1E"/>`)}
      ${ridge(74, 720, 6, '#C27654')}${at(-100, 800, anim('w-cross', `${S.camel('#5A2E1E')}${at(-180, 0, S.person(90, '#5A2E1E', { robe: true, walk: true }))}`, 'animation-duration:40s;animation-delay:-20s'))}
      ${ridge(75, 830, 6, '#A9573C')}`,
  },
  chichen: {
    name: 'Chichén Itzá', era: '900', zone: 'land',
    font: F('Macondo'), theme: { mode: 'light', accent: '#2F8F5B' }, sky: sky('#7FC1E0', '#EAF6EC'),
    art: () => `${sun(260, 170, 36)}${birds(800, 160, 5, '#2E4A3A', 9)}
      ${ridge(81, 620, 30, '#3E7A4E', { freq: 1.6 })}
      ${at(620, 650, P.stepPyramid(420, 290, 9, '#B9AE90', '#D6CDB0'))}
      ${ridge(82, 720, 26, '#2E6A3E', { freq: 1.8 })}${[380, 440, 820, 880].map((x, i) => at(x, 780, S.palm(160 + i * 10, '#1E4A2A', i % 2 ? 0.6 : -0.6))).join('')}
      ${ridge(83, 820, 10, '#1E4A2A')}`,
  },
  vikings: {
    name: 'The Vikings', era: '900', zone: 'land',
    font: F('Pirata One'), theme: { mode: 'dark', accent: '#8FD0FF' }, sky: sky('#0C1A33', '#3A4A6B'),
    art: () => `${stars(60, 84, { bottom: 380 })}
      <path d="M-40 160 Q300 80 600 180 T1240 140" fill="none" stroke="#6BF2B0" stroke-width="60" opacity=".22" class="w-twinkle" filter="url(#blur-s)"/>
      <path d="M-40 230 Q400 160 700 250 T1240 210" fill="none" stroke="#8FB6FF" stroke-width="40" opacity=".18" class="w-twinkle" filter="url(#blur-s)"/>
      <path d="M-40 620 V300 L120 280 L260 400 L330 620Z M880 620 L960 360 L1100 300 L1240 340 V620Z" fill="#1A2A44"/>
      ${sea(600, '#1C3456', '#122640', '#8FB6FF', 85)}
      ${at(-260, 700, anim('w-cross', `${P.longship('#0A1222')}${[-110, -60, -10, 40, 90].map((x, i) => at(x, -22, figure(64, '#0A1222', { hat: 'viking', hold: i % 2 ? 'axe' : '' }))).join('')}`, 'animation-duration:44s;animation-delay:-18s'), 0.8)}
      <path d="M-40 780 Q300 740 600 760 T1240 750 V960 H-40Z" fill="#141E30"/>
      ${at(940, 780, `<path d="M-120 0 V-60 Q0 -110 120 -60 V0Z" fill="#2A2420"/><path d="M-130 -58 Q0 -118 130 -58 Q0 -96 -130 -58Z" fill="#3E5A36"/><rect x="-14" y="-40" width="28" height="40" fill="#FF9A3D" opacity=".85"/>${glow(0, -20, 70, 'ember', 'w-twinkle')}`)}${P.smoke(960, 680, '#6A7286', 3)}
      ${[[420, '#B5302B', 'axe'], [500, '#E9C46A', 'spear'], [590, '#2A6F97', 'axe'], [680, '#B5302B', 'sword']].map(([x, sc, h], i) => at(x, 880 - (i % 2) * 6, figure(150 - (i % 2) * 10, '#05080F', { hat: 'viking', hold: h, shield: true, shieldColor: sc, pose: i === 3 ? 'raise' : 'stand' }))).join('')}
      ${at(780, 878, figure(120, '#05080F', { outfit: 'dress', hold: 'torch' }))}`,
  },
  angkor: {
    name: 'Angkor Wat', era: '1150', zone: 'land',
    font: F('Kavoon'), theme: { mode: 'light', accent: '#D9822B' }, sky: sky('#F2A86A', '#FBE3C2'),
    art: () => `${sun(600, 420, 60, '#FFE9C2')}
      ${ridge(86, 600, 10, '#C98E5E')}
      ${at(600, 620, `${[-220, -110, 0, 110, 220].map((x, i) => `<path transform="translate(${x} 0)" d="M-40 0 V-80 Q-36 -${i === 2 ? 260 : 190} 0 -${i === 2 ? 300 : 220} Q36 -${i === 2 ? 260 : 190} 40 -80 V0Z" fill="#6A4A3A"/>`).join('')}<rect x="-300" y="-60" width="600" height="60" fill="#5A3E30"/>`)}
      <rect x="-40" y="620" width="1280" height="160" fill="#E6B07E"/>
      <g transform="translate(0 1240) scale(1 -1)" opacity=".35">${at(600, 620, `${[-220, -110, 0, 110, 220].map((x, i) => `<path transform="translate(${x} 0)" d="M-40 0 V-80 Q-36 -${i === 2 ? 260 : 190} 0 -${i === 2 ? 300 : 220} Q36 -${i === 2 ? 260 : 190} 40 -80 V0Z" fill="#6A4A3A"/>`).join('')}`)}</g>
      ${glints(87, 640, 770, 20, '#FFF1D8')}${ridge(88, 790, 8, '#5A6A34')}${at(470, 860, S.person(100, '#4A2A10', { robe: true }))}${at(540, 862, S.person(96, '#C2611E', { robe: true, walk: true }))}`,
  },
  knights: {
    name: 'The Knights', era: '1200', zone: 'land',
    font: F('MedievalSharp'), theme: { mode: 'light', accent: '#B0302B' }, sky: sky('#7FB2DE', '#EAF3FA'),
    art: () => `${softCloud(150, 150, 260, '#fff', 0.85)}${softCloud(760, 110, 200, '#fff', 0.7)}
      ${ridge(91, 500, 60, '#8AA8B8', { freq: 0.6 })}
      ${at(900, 520, `${P.crenWall(-160, 160, 0, 120, '#8A8E98')}${at(-160, 0, P.tower(60, 200, '#7A7E8A', 'cone'))}${at(160, 0, P.tower(60, 200, '#7A7E8A', 'cone'))}${at(0, -120, P.tower(80, 140, '#7A7E8A', 'cone'))}${at(0, -260, P.flag(60, '#444', '#B0302B'))}`, 0.8)}
      ${ridge(92, 620, 20, '#6E9A4E')}
      ${at(260, 650, `<path d="M-180 0 V-70 H180 V0Z" fill="#7A5A3A"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${-180 + i * 40} -70 h40 l-20 -26Z" fill="${['#B0302B', '#E9C46A', '#2A4FA8'][i % 3]}"/>`).join('')}${P.crowd(-170, 170, -70, 14, '#3A2A1A', 93, 30)}`)}
      <path d="M-40 700 Q600 680 1240 700 V960 H-40Z" fill="#5E8A3E"/>
      <rect x="-40" y="790" width="1280" height="14" fill="#7A5A3A"/>${Array.from({ length: 14 }, (_, i) => `<rect x="${i * 92 - 10}" y="770" width="8" height="34" fill="#5A3E26"/>`).join('')}
      ${at(160, 830, anim('w-joust', S.horseRider('#3A3A44', 'knight', { hold: 'lance', crest: '#B0302B', horse: '#B0302B', mane: '#7A1E1A' }), '--joust:300px'), 0.85)}
      ${at(1040, 760, `<g transform="scale(-1 1)">${anim('w-joust', S.horseRider('#3A3A44', 'knight', { hold: 'lance', crest: '#2A4FA8', horse: '#2A4FA8', mane: '#1A2E66' }), '--joust:300px')}</g>`, 0.75)}
      ${at(600, 900, figure(110, '#2A2018', { hold: 'flag', pose: 'raise', flag: ['#B0302B', '#E9C46A', '#B0302B'] }))}`,
  },
  genghis: {
    name: 'The Mongol Steppe', era: '1206', zone: 'land',
    font: F('Kelly Slab'), theme: { mode: 'light', accent: '#4E7FB0' }, sky: sky('#6FA6D6', '#EAF1E2'),
    art: () => `${sun(900, 180, 34)}${at(0, 220, anim('w-cross', P.eagle('#3A3A3A'), 'animation-duration:40s'), 0.8)}
      ${ridge(94, 560, 50, '#A9B8C8', { freq: 0.5 })}${ridge(95, 640, 20, '#B9B884')}
      ${[420, 520, 840].map(x => at(x, 660, `<path d="M-46 0 V-40 Q0 -76 46 -40 V0Z" fill="#EDE6D6"/><path d="M-46 -40 Q0 -76 46 -40" stroke="#B5302B" stroke-width="5" fill="none"/>`)).join('')}
      ${ridge(96, 740, 14, '#9C9C66')}
      ${at(-200, 820, anim('w-cross', [0, 150, 300, 450].map(x => at(-x, 0, S.horseRider('#2A2418'), 0.75)).join(''), 'animation-duration:18s'))}
      ${ridge(97, 850, 6, '#86864F')}
      ${at(560, 900, S.horseRider('#2A2418', 'viking', { hold: 'spear', horse: '#3A2A1C', gait: false }), 1.1)}
      ${at(420, 900, figure(120, '#2A2418', { hat: 'viking', hold: 'flag', pose: 'raise', flag: ['#E9E2D2', '#2A2418', '#E9E2D2'] }))}`,
  },
  easter: {
    name: 'Easter Island', era: '1250', zone: 'land',
    font: F('Bungee Hairline'), theme: { mode: 'light', accent: '#6B5A4A' }, sky: sky('#5BA3D9', '#E6F2F8'),
    art: () => `${sun(260, 180, 34)}${softCloud(700, 160, 240, '#fff', 0.8)}
      ${sea(560, '#2E7FB3', '#236A99', '#fff', 98)}
      ${ridge(99, 700, 30, '#6E9A5A')}
      ${[400, 500, 600, 700, 800].map((x, i) => at(x, 720, `<path d="M-30 0 V-120 Q-34 -170 -10 -180 L24 -176 Q34 -150 30 -120 V0Z" fill="#4A4038"/><rect x="-26" y="-130" width="52" height="10" fill="#3A322A"/>`, 0.9 + (i % 2) * 0.1)).join('')}
      ${ridge(100, 820, 12, '#557A42')}`,
  },
  forbidden: {
    name: 'The Forbidden City', era: '1420', zone: 'land',
    font: F('Cormorant SC', 700), theme: { mode: 'light', accent: '#C0392B' }, sky: sky('#D9A06A', '#F6E2C4'),
    art: () => `${sun(260, 200, 40)}
      ${ridge(101, 600, 10, '#C9A27A')}
      ${at(600, 640, `<rect x="-280" y="-90" width="560" height="90" fill="#A8322D"/><path d="M-320 -90 Q-300 -110 -260 -130 H260 Q300 -110 320 -90Z" fill="#C9962E"/><rect x="-200" y="-200" width="400" height="70" fill="#A8322D"/><path d="M-240 -200 Q-220 -222 -180 -240 H180 Q220 -222 240 -200Z" fill="#D9A23A"/>${[-150, -90, -30, 30, 90, 150].map(x => `<rect x="${x - 6}" y="-80" width="12" height="80" fill="#7A1E18"/>`).join('')}`)}
      ${ridge(102, 720, 6, '#D9BE96')}${[300, 900].map(x => at(x, 760, `<path d="M0 0 V-60" stroke="#5A2A1E" stroke-width="4"/><ellipse cx="0" cy="-70" rx="16" ry="20" fill="#E0402F"/>${glow(0, -70, 40, 'amber')}`)).join('')}
      ${P.crowd(420, 800, 840, 6, '#4A2A1E', 103, 60)}`,
  },
  machu: {
    name: 'Machu Picchu', era: '1450', zone: 'land',
    font: F('Cinzel', 700), theme: { mode: 'light', accent: '#4E8A4A' }, sky: sky('#8DB8D6', '#EEF4EC'),
    art: () => `${softCloud(100, 360, 400, '#fff', 0.7, 80)}
      ${ridge(104, 480, 120, '#9EB6A6', { sharp: true, freq: 1 })}
      <path d="M560 640 Q600 180 700 200 Q780 260 820 640Z" fill="#4A6E4A"/>
      ${ridge(105, 640, 30, '#6E8E5A')}
      ${Array.from({ length: 6 }, (_, i) => `<path d="M${300 + i * 20} ${660 + i * 22} H${900 - i * 20}" stroke="#8A7E62" stroke-width="10"/>`).join('')}
      ${[440, 520, 600, 680].map(x => at(x, 650, P.house(50, 40, '#8A8270'))).join('')}
      ${ridge(106, 800, 14, '#557A42')}${at(560, 860, P.llama('#EDE6D6'))}${at(660, 864, P.llama('#7A5A3A'), 0.8)}`,
  },
  columbus: {
    name: 'The New World', era: '1492', zone: 'land',
    font: F('IM Fell English'), theme: { mode: 'light', accent: '#B5302B' }, sky: sky('#E98A5A', '#FBD8A8'),
    art: () => `${sun(600, 520, 70, '#FFE6B8')}${birds(800, 220, 3, '#6A3A2A', 4)}
      ${sea(560, '#3B6E95', '#2A5478', '#FFD8A8', 107)}
      ${at(-200, 660, anim('w-cross', `${P.caravel('#2A1E1A')}${at(-330, 20, P.caravel('#2A1E1A'), 0.7)}${at(-560, 30, P.caravel('#2A1E1A'), 0.55)}`, 'animation-duration:60s;animation-delay:-30s'), 0.9)}`,
  },
  florence: {
    name: 'Florence', era: '1503', zone: 'land',
    font: F('Cormorant Garamond', 700), theme: { mode: 'light', accent: '#B8743A' }, sky: sky('#E9B07A', '#F9EBD6'),
    art: () => `${sun(260, 200, 36)}
      ${at(0, 220, anim('w-cross', `<path d="M-90 0 Q-50 -30 0 -6 Q50 -30 90 0 Q50 -10 0 6 Q-50 -10 -90 0Z" fill="#6A4A2E"/><path d="M0 0 V30" stroke="#6A4A2E" stroke-width="3"/>${S.person(30, '#6A4A2E')}`, 'animation-duration:30s'))}
      ${ridge(108, 600, 30, '#A8B48A', { freq: 0.6 })}
      ${at(600, 660, `<rect x="-140" y="-120" width="280" height="120" fill="#D9C6A8"/><path d="M-110 -120 Q-110 -320 0 -330 Q110 -320 110 -120Z" fill="#B85A3A"/><path d="M-60 -120 Q-60 -300 0 -330 M60 -120 Q60 -300 0 -330" stroke="#F2E6D2" stroke-width="5" fill="none"/><rect x="-14" y="-370" width="28" height="40" fill="#E9DCC6"/>`)}
      ${at(860, 660, `<rect x="-26" y="-320" width="52" height="320" fill="#D9C6A8"/><rect x="-30" y="-340" width="60" height="22" fill="#B85A3A"/>`)}
      ${P.skyline(109, 700, 30, 90, '#C9AE86', '#C9AE86', 0)}
      ${[360, 420].map(x => at(x, 760, P.cypress(160, '#3E4A2A'))).join('')}${ridge(110, 800, 8, '#8E7A56')}`,
  },
  samurai: {
    name: 'The Samurai', era: '1600', zone: 'land',
    font: F('Kaisei Decol', 700), theme: { mode: 'light', accent: '#B5302B' }, sky: sky('#F2C6A8', '#FBEEE4'),
    art: () => `${sun(300, 220, 56, '#E64A3A', 'warm')}
      ${ridge(111, 600, 40, '#C8B4B4', { freq: 0.6 })}
      ${at(780, 640, `${[0, 1, 2, 3].map(i => `<rect x="${-120 + i * 24}" y="${-60 - i * 70}" width="${240 - i * 48}" height="50" fill="#F2EEE6"/><path d="M${-150 + i * 24} ${-60 - i * 70} Q${-130 + i * 24} ${-80 - i * 70} ${-110 + i * 24} ${-90 - i * 70} H${110 - i * 24} Q${130 - i * 24} ${-80 - i * 70} ${150 - i * 24} ${-60 - i * 70}Z" fill="#3A4A5A"/>`).join('')}<path d="M-140 0 V-60 H140 V0Z" fill="#7A746A"/>`)}
      ${ridge(112, 740, 10, '#B9A890')}${at(380, 760, `<path d="M0 0 Q-10 -80 30 -150" stroke="#3A2A2A" stroke-width="10" fill="none"/>${[[-20, -140], [40, -170], [70, -130], [10, -110]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="34" fill="#F2B8C6" opacity=".9"/>`).join('')}`)}
      ${at(560, 860, S.person(130, '#1E1A1E', { robe: true }))}<path d="M570 760 L650 700" stroke="#1E1A1E" stroke-width="4"/>
      ${drift(113, 20, '#F2B8C6', 3, 0.85)}`,
  },
  taj: {
    name: 'The Taj Mahal', era: '1648', zone: 'land',
    font: F('Yeseva One'), theme: { mode: 'light', accent: '#C27A9A' }, sky: sky('#E9A88A', '#FBE6D8'),
    art: () => `${sun(940, 220, 34)}
      ${ridge(114, 600, 8, '#D9B8A0')}
      ${at(600, 600, `<rect x="-160" y="-160" width="320" height="160" fill="#F6F0EA"/><path d="M-50 0 V-100 A50 50 0 0 1 50 -100 V0Z" fill="#D9CCC0"/><g transform="translate(0 -160)">${P.onionDome(110, '#F6F0EA')}</g>${[-120, 120].map(x => `<g transform="translate(${x} -160)">${P.onionDome(34, '#F6F0EA')}</g>`).join('')}${[-230, 230].map(x => at(x, 0, P.minaret(280, '#F2ECE4'))).join('')}`)}
      <rect x="560" y="600" width="80" height="300" fill="#7FB0D6"/>${glints(115, 610, 880, 14, '#fff')}
      ${[360, 440, 760, 840].map(x => at(x, 800, P.cypress(150, '#4A6A3A'))).join('')}<path d="M-40 800 H560 M640 800 H1240" stroke="#B9C9A0" stroke-width="2"/>`,
  },
  pirates: {
    name: 'Pirate Cove', era: '1715', zone: 'land',
    font: F('Pirata One'), theme: { mode: 'light', accent: '#C8962E' }, sky: sky('#4FA6D6', '#E2F3F8'),
    art: () => `${sun(260, 170, 36)}${softCloud(640, 150, 240, '#fff', 0.8)}
      <path d="M760 600 Q860 480 980 520 Q1100 500 1240 560 V600Z" fill="#3E8A5A"/>${[880, 960].map((x, i) => at(x, 540, S.palm(150, '#2E4A2A', i ? 0.6 : -0.4))).join('')}
      ${sea(600, '#2B8FB8', '#1E7099', '#fff', 116)}
      ${at(-260, 720, anim('w-cross', P.pirateShip('#3A2418'), 'animation-duration:44s;animation-delay:-18s'), 0.9)}
      ${at(560, 860, `<rect x="-40" y="-40" width="80" height="40" fill="#6B4A2E"/><path d="M-40 -40 Q0 -64 40 -40Z" fill="#7A5634"/>${glow(0, -40, 50, 'warm', 'w-twinkle')}`)}`,
  },
  boston: {
    name: 'The Boston Tea Party', era: '1773', zone: 'land',
    font: F('IM Fell English SC'), theme: { mode: 'dark', accent: '#E9B44C' }, sky: sky('#141C3A', '#3A4A7A'),
    art: () => `${stars(50, 117, { bottom: 300 })}${moon(900, 170, 34)}
      ${P.skyline(118, 600, 40, 120, '#1E2648', '#FFD27A', 0.5)}
      ${sea(600, '#1C2A52', '#141F40', '#FFD27A', 119)}
      ${at(600, 700, `${P.caravel('#0E1226', '#3A4060', '#3A4060')}`, 0.9)}
      ${P.crowd(500, 700, 676, 5, '#0E1226', 120, 50)}
      ${[0, 1, 2].map(i => at(540 + i * 50, 720, anim('w-fall-short', `<rect x="-12" y="-12" width="24" height="24" fill="#8A5A2E"/>`, `animation-delay:-${i * 0.6}s`))).join('')}
      ${[380, 820].map(x => `${glow(x, 640, 40, 'amber')}`).join('')}`,
  },
  bastille: {
    name: 'The French Revolution', era: '1789', zone: 'land',
    font: F('Playfair Display SC', 700), theme: { mode: 'light', accent: '#2A4FA8' }, sky: sky('#8E96A8', '#E8E0D2'),
    art: () => `${softCloud(160, 140, 320, '#F2F0EC', 0.8)}${softCloud(700, 100, 260, '#E6E2DA', 0.8)}
      ${at(640, 620, `${P.crenWall(-260, 260, 0, 210, '#5E5E66')}${[-250, -150, -50, 50, 150, 250].map(x => at(x, 0, P.tower(78, 280, '#50505A'))).join('')}<path d="M-30 0 V-70 Q0 -96 30 -70 V0Z" fill="#26262C"/>`)}
      ${P.smoke(820, 380, '#C9C2B6', 4)}${P.smoke(460, 400, '#B9B2A6', 3)}
      ${ridge(121, 680, 8, '#9A9080')}
      ${P.crowd(-20, 1220, 760, 30, '#2E2A28', 122, 76)}
      ${[200, 340, 860, 1000].map((x, i) => at(x, 770, figure(96, '#2E2A28', { hold: 'pike', pose: 'raise', hat: i % 2 ? 'phrygian' : 'tricorne' }))).join('')}
      <path d="M-40 800 Q600 780 1240 800 V960 H-40Z" fill="#7A7064"/>
      ${at(430, 880, `<rect x="-50" y="-22" width="70" height="22" fill="#2A2420"/><circle cx="-30" cy="0" r="20" fill="none" stroke="#2A2420" stroke-width="6"/><path d="M10 -18 L90 -46" stroke="#2A2420" stroke-width="14" stroke-linecap="round"/>`)}
      ${at(620, 900, figure(150, '#1E1A18', { outfit: 'dress', hold: 'flag', pose: 'raise', hat: 'phrygian' }))}
      ${at(730, 900, figure(130, '#1E1A18', { hat: 'tricorne', hold: 'musket', outfit: 'coat' }))}
      ${at(800, 904, figure(90, '#1E1A18', { hold: 'drum', hat: 'phrygian' }))}`,
  },
  napoleon: {
    name: 'Napoleon', era: '1805', zone: 'land',
    font: F('Bodoni Moda', 700), theme: { mode: 'light', accent: '#2A4FA8' }, sky: sky('#D9A86A', '#F6E6C6'),
    art: () => `${sun(380, 300, 54, '#FFF0CC')}
      ${ridge(124, 560, 50, '#B8A07A', { freq: 0.6 })}
      ${[[760, 540], [900, 560], [1040, 540]].map(([x, y]) => `${P.smoke(x, y, '#EFE6D6', 4)}${glow(x, y + 10, 30, 'ember', 'w-blink')}`).join('')}
      ${ridge(125, 640, 16, '#9A946A')}
      ${at(700, 650, Array.from({ length: 3 }, (_, r) => Array.from({ length: 9 }, (_, i) => at(i * 24 + r * 8, r * 10, figure(44, '#2A3A6A', { hat: 'shako', hold: 'musket' }))).join('')).join('') + at(110, -6, figure(50, '#2A3A6A', { hold: 'flag', pose: 'raise' })))}
      ${ridge(126, 740, 18, '#7E7A4E')}
      ${at(360, 760, `<rect x="-70" y="-26" width="90" height="26" fill="#3A3226"/><circle cx="-46" cy="0" r="26" fill="none" stroke="#3A3226" stroke-width="7"/><path d="M-46 -26 V26 M-72 0 H-20" stroke="#3A3226" stroke-width="3"/><path d="M14 -20 L120 -52" stroke="#2A241C" stroke-width="16" stroke-linecap="round"/>${figure(110, '#2A3A6A', { hat: 'shako', pose: 'hips' })}`, 0.9)}
      <path d="M360 960 Q400 840 560 820 Q720 810 800 850 Q880 890 900 960Z" fill="#5A5A50"/>
      ${at(620, 860, S.horseRider('#1E2238', 'bicorne', { hold: 'sword', rear: true, horse: '#F2EEE6', mane: '#B9B2A2', cape: true, gait: false }), 1.35)}
      ${at(880, 890, figure(110, '#1E2238', { hold: 'drum', hat: 'shako' }))}
      ${at(960, 896, figure(130, '#1E2238', { hold: 'flag', pose: 'raise', hat: 'shako' }))}`,
  },
  industrial: {
    name: 'The Industrial Revolution', era: '1830', zone: 'land',
    font: F('Abril Fatface'), theme: { mode: 'light', accent: '#B9572E' }, sky: sky('#9C988E', '#E2DACB'),
    art: () => `${sun(260, 200, 30, '#F6EBD6', 'warm')}
      ${[240, 330, 860, 960].map((x, i) => `<path d="M${x - 18} ${560} L${x - 14} ${300 + (i % 2) * 40} H${x + 14} L${x + 18} 560Z" fill="#7A4A3A"/><rect x="${x - 18}" y="${300 + (i % 2) * 40}" width="36" height="10" fill="#5A3428"/>${P.smoke(x, 290 + (i % 2) * 40, '#7E7A74', 4)}`).join('')}
      ${at(600, 560, `<path d="M-340 0 V-140 L-280 -180 V-140 L-220 -180 V-140 L-160 -180 V-140 L-100 -180 V-140 L-40 -180 V-140 L20 -180 V-140 L80 -180 V-140 L140 -180 V-140 L200 -180 V-140 L260 -180 V-140 L320 -180 V-140 L340 -140 V0Z" fill="#8E4E3A"/>${Array.from({ length: 11 }, (_, i) => `<path d="M${-310 + i * 60} -20 V-90 a14 14 0 0 1 28 0 V-20Z" fill="#FFD27A" opacity=".85"/>`).join('')}<text x="0" y="-150" text-anchor="middle" font-family="Abril Fatface, serif" font-size="26" fill="#E9DCC6">COTTON MILL</text>`)}
      <rect x="-40" y="560" width="1280" height="40" fill="#6A5A50"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${-20 + i * 130} 680 V600 Q${45 + i * 130} 560 ${110 + i * 130} 600 V680Z" fill="#6A5A50"/>`).join('')}
      ${at(-200, 560, anim('w-cross', S.train('#1E1A1A'), 'animation-duration:18s'), 0.75)}
      <rect x="-40" y="680" width="1280" height="50" fill="#5E7A8A"/>${glints(127, 686, 724, 16, '#C9D6DE')}
      ${at(-200, 708, anim('w-cross', `<path d="M-100 0 H100 L90 14 H-90Z M-70 0 V-20 H40 V0Z" fill="#4A3020"/>`, 'animation-duration:40s'))}
      <rect x="-40" y="730" width="1280" height="240" fill="#4A4440"/>${Array.from({ length: 40 }, (_, i) => `<rect x="${(i % 20) * 62 - 20}" y="${750 + Math.floor(i / 20) * 40}" width="54" height="30" rx="6" fill="#55504A"/>`).join('')}
      ${at(380, 860, `<path d="M0 0 V-130" stroke="#2A2420" stroke-width="6"/><path d="M-14 -130 H14 L10 -152 H-10Z" fill="#2A2420"/>${glow(0, -142, 50, 'amber')}`)}
      ${at(500, 880, figure(130, '#1E1A18', { hat: 'tophat', outfit: 'coat', pose: 'walk' }))}
      ${at(640, 884, figure(118, '#2A2420', { hat: 'flatcap', pose: 'walk' }))}
      ${at(720, 886, figure(76, '#2A2420', { hat: 'flatcap' }))}
      ${at(840, 880, figure(124, '#2A2420', { outfit: 'dress' }))}`,
  },
  goldRush: {
    name: 'The Gold Rush', era: '1849', zone: 'land',
    font: F('Smokum'), theme: { mode: 'light', accent: '#D9A21E' }, sky: sky('#7FB4DE', '#EFF4E6'),
    art: () => `${sun(900, 170, 36)}
      ${ridge(128, 520, 120, '#8FA4B4', { sharp: true, freq: 1.1 })}${ridge(129, 620, 60, '#5E7A54', { freq: 1 })}
      ${[400, 470, 820, 880].map(x => at(x, 660, S.pine(150, '#2E4A2E'))).join('')}
      <path d="M-40 760 Q300 720 600 760 T1240 750 V820 Q600 790 -40 820Z" fill="#5E9AC2"/>${glints(130, 750, 810, 18, '#fff')}
      ${ridge(131, 830, 8, '#8A7A5A')}
      ${at(560, 790, `${S.person(110, '#3A2A1E', { hat: 'cowboy' })}<ellipse cx="34" cy="-30" rx="30" ry="8" fill="#5A4A3A"/>${glow(34, -34, 24, 'warm', 'w-twinkle')}`)}
      ${at(700, 800, `<path d="M-40 0 V-40 H40 V0Z" fill="#7A5A3A"/><circle cx="-24" cy="0" r="14" fill="#3A2A1E"/><circle cx="24" cy="0" r="14" fill="#3A2A1E"/>`)}`,
  },
  plains: {
    name: 'The Great Plains', era: '1850', zone: 'land',
    font: F('Spectral SC', 700), theme: { mode: 'light', accent: '#B9682E' }, sky: sky('#E9A06A', '#F8DFB8'),
    art: () => `${sun(300, 460, 60, '#FFE6B4')}
      ${ridge(132, 560, 60, '#B98A7A', { sharp: true, freq: 0.8 })}${ridge(133, 640, 12, '#C9A06A')}
      ${[760, 860].map((x, i) => at(x, 660, `<path d="M-50 0 L0 -130 L50 0Z" fill="#EDE0C6"/><path d="M-10 -110 L0 -150 M10 -110 L0 -150 M0 -130 L-16 -156 M0 -130 L18 -158" stroke="#6A4A2E" stroke-width="3"/><path d="M-16 0 L0 -40 L16 0Z" fill="#6A4A2E"/><path d="M-30 -50 H30" stroke="#B9572E" stroke-width="6"/>`, 1 - i * 0.2)).join('')}
      ${ridge(134, 740, 10, '#B48E54')}
      ${at(-200, 800, anim('w-cross', [0, 130, 260, 390, 520].map(x => at(-x, 0, P.bison('#3A2618'), 0.9)).join(''), 'animation-duration:36s;animation-delay:-10s'))}
      ${at(520, 820, S.horseRider('#2A1A10', ''), 0.85)}`,
  },
  liberty: {
    name: 'The Statue of Liberty', era: '1886', zone: 'land',
    font: F('Old Standard TT', 700), theme: { mode: 'light', accent: '#3E8E7A' }, sky: sky('#8DBBE0', '#EEF5FA'),
    art: () => `${softCloud(160, 150, 280, '#fff', 0.8)}${P.skyline(135, 600, 30, 110, '#9AA8B8', '#9AA8B8', 0)}
      ${sea(600, '#4A86B0', '#3A729C', '#fff', 136)}
      <path d="M440 690 Q500 640 620 644 Q740 640 800 690Z" fill="#6E8A5A"/><path d="M500 668 L560 640 H680 L740 668Z" fill="#A8A090"/>
      ${at(620, 660, `<path d="M-90 0 V-60 H90 V0Z M-60 -60 V-130 H60 V-60Z" fill="#8E8A80"/>
        <path d="M-28 -130 L-34 -300 Q-30 -330 0 -334 Q30 -330 34 -300 L28 -130Z" fill="#6FA898"/>
        <circle cy="-354" r="22" fill="#6FA898"/><path d="M-26 -370 L-40 -392 M-12 -376 L-14 -402 M0 -378 L0 -406 M12 -376 L14 -402 M26 -370 L40 -392" stroke="#6FA898" stroke-width="5"/>
        <path d="M24 -300 L40 -430" stroke="#6FA898" stroke-width="14" stroke-linecap="round"/>${glow(42, -456, 50, 'warm', 'w-twinkle')}${anim('w-flame', `<path transform="translate(42 -436)" d="M-10 0 Q-12 -24 0 -40 Q12 -24 10 0Z" fill="#F2B84A"/>`)}`)}
      ${at(-100, 800, anim('w-cross', P.sailboat('#2E3A4A'), 'animation-duration:40s'))}`,
  },
  cola: {
    name: 'The First Cola', era: '1886', zone: 'land',
    font: F('Lobster'), theme: { mode: 'light', accent: '#8E4A1E' }, sky: sky('#D9B48A', '#F6E6CC'),
    art: () => `<rect x="-40" y="-40" width="1280" height="700" fill="#E6CFA8"/>
      ${Array.from({ length: 4 }, (_, r) => `<rect x="-40" y="${120 + r * 130}" width="1280" height="10" fill="#8A5A34"/>${Array.from({ length: 22 }, (_, i) => `<rect x="${i * 56 - 20 + (r % 2) * 20}" y="${70 + r * 130}" width="${26 + (i % 3) * 6}" height="${50 - (i % 2) * 12}" rx="5" fill="${['#C9B48A', '#9AB6A0', '#C98A5A', '#A8B8C8'][(i + r) % 4]}" opacity=".8"/>`).join('')}`).join('')}
      ${glow(600, 380, 420, 'warm')}
      <rect x="-40" y="640" width="1280" height="320" fill="#6A3E22"/><rect x="-40" y="640" width="1280" height="16" fill="#8A5A34"/>
      ${at(600, 880, `<ellipse cx="0" cy="0" rx="190" ry="26" fill="#000" opacity=".18"/>
        <path d="M-80 0 V-300 Q-80 -350 -40 -380 V-470 H40 V-380 Q80 -350 80 -300 V0 Q80 12 60 12 H-60 Q-80 12 -80 0Z" fill="#2A1408"/>
        <path d="M-80 -300 Q-80 -350 -40 -380 V-470 H40 V-380 Q80 -350 80 -300 V0 Q80 12 60 12 H-60 Q-80 12 -80 0Z" fill="#5A2A10" opacity=".55"/>
        <path d="M-56 -320 Q-58 -200 -56 -20" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".28" fill="none"/>
        <rect x="-44" y="-492" width="88" height="26" rx="4" fill="#B8B8C0"/><path d="M-44 -488 h88 M-44 -480 h88 M-44 -472 h88" stroke="#8A8A94" stroke-width="2"/>
        <rect x="-80" y="-250" width="160" height="120" fill="#F2E6C6"/><rect x="-80" y="-250" width="160" height="10" fill="#8E4A1E"/><rect x="-80" y="-140" width="160" height="10" fill="#8E4A1E"/>
        <text x="0" y="-172" text-anchor="middle" font-family="Lobster, cursive" font-size="54" fill="#5A2A10">Cola</text>
        <text x="0" y="-148" text-anchor="middle" font-family="-apple-system, Inter, sans-serif" font-weight="700" font-size="11" letter-spacing="3" fill="#8E4A1E">SINCE 1886</text>
        ${Array.from({ length: 14 }, (_, i) => { const r = seeded(i + 300); return `<circle cx="${(-50 + r() * 100).toFixed(0)}" cy="-20" r="${(2 + r() * 3).toFixed(1)}" fill="#E9C49A" opacity=".7" class="w-fizz" style="animation-delay:-${(r() * 3).toFixed(2)}s;animation-duration:${(2 + r() * 2).toFixed(1)}s"/>`; }).join('')}
        ${Array.from({ length: 10 }, (_, i) => { const r = seeded(i + 320); return `<ellipse cx="${(-70 + r() * 140).toFixed(0)}" cy="${(-360 + r() * 300).toFixed(0)}" rx="3" ry="4" fill="#fff" opacity=".45"/>`; }).join('')}`)}
      ${[[400, 860, 12], [470, 876, -8], [770, 868, 20], [830, 880, -14]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-26" y="-26" width="52" height="52" rx="8" fill="#DDEEF6" opacity=".85"/><path d="M-18 -18 L10 -10" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>`).join('')}`,
  },
  kittyHawk: {
    name: 'First Flight', era: '1903', zone: 'land',
    font: F('Special Elite'), theme: { mode: 'light', accent: '#6A7A8A' }, sky: sky('#9CC2DE', '#F2F2EA'),
    art: () => `${softCloud(200, 180, 300, '#fff', 0.8)}${softCloud(760, 120, 220, '#fff', 0.7)}
      ${sea(560, '#7FA6BE', '#6A92AE', '#fff', 138)}
      <path d="M-40 640 Q300 580 600 620 T1240 600 V960 H-40Z" fill="#E6D6B0"/>
      ${at(-200, 420, anim('w-cross', `<rect x="-90" y="-30" width="180" height="8" fill="#5A4A3A"/><rect x="-90" y="0" width="180" height="8" fill="#5A4A3A"/><path d="M-80 -22 V0 M-40 -22 V0 M0 -22 V0 M40 -22 V0 M80 -22 V0" stroke="#5A4A3A" stroke-width="2"/><path d="M90 -14 H140 M140 -26 V0" stroke="#5A4A3A" stroke-width="4"/>${S.person(30, '#2A2018')}`, 'animation-duration:26s'))}
      ${ridge(139, 760, 16, '#D9C59A')}${P.crowd(440, 760, 840, 5, '#3A3026', 139, 80)}`,
  },
  titanic: {
    name: 'The Unsinkable Ship', era: '1912', zone: 'land',
    font: F('Playfair Display', 700), theme: { mode: 'dark', accent: '#D9B26A' }, sky: sky('#03050F', '#13204A'),
    art: () => `${stars(140, 140, { bottom: 600 })}
      ${sea(600, '#0C1430', '#070C22', '#8EA8FF', 141)}
      <path d="M980 620 L1040 470 L1100 520 L1160 450 L1240 620Z" fill="#DDEBF6" opacity=".9"/>
      ${at(-300, 640, anim('w-cross', P.liner('#0A0A12'), 'animation-duration:70s;animation-delay:-36s'), 0.85)}`,
  },
  westernFront: {
    name: 'The Great War', era: '1916', zone: 'land',
    font: F('Stardos Stencil', 700), theme: { mode: 'light', accent: '#B5302B' }, sky: sky('#8E9494', '#D8D4C8'),
    art: () => `${softCloud(100, 160, 360, '#B9B6AE', 0.9, 90)}${softCloud(700, 120, 300, '#AEABA4', 0.9, 70)}
      ${at(-200, 260, anim('w-cross', P.biplane('#B5302B', '#9A2620'), 'animation-duration:14s'))}${at(-520, 220, anim('w-cross', P.biplane('#5A6A4A'), 'animation-duration:14s'))}
      ${ridge(142, 560, 16, '#8E8A7A')}${[[300, 560], [700, 548], [1000, 566]].map(([x, y]) => glow(x, y, 40, 'ember', 'w-blink')).join('')}
      ${[220, 520, 900].map((x, i) => `<path d="M${x} 640 V${560 - i * 10} M${x} ${590 - i * 6} l-20 -16 M${x} ${600 - i * 6} l16 -18" stroke="#3A3830" stroke-width="5" fill="none"/>`).join('')}
      <path d="M-40 640 Q300 610 600 630 T1240 620 V720 H-40Z" fill="#6E6A54"/>
      ${[[300, 670, 50], [760, 660, 70], [1000, 690, 40]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.24}" fill="#4E4A3C"/>`).join('')}
      ${Array.from({ length: 14 }, (_, i) => `<path d="M${-40 + i * 100} 720 V690 M${-40 + i * 100} 700 L${10 + i * 100} 694 M${-40 + i * 100} 708 L${10 + i * 100} 712" stroke="#2E2C26" stroke-width="2"/>`).join('')}
      <path d="M-40 760 Q600 740 1240 760 V960 H-40Z" fill="#5A4A36"/>
      ${Array.from({ length: 26 }, (_, i) => `<rect x="${i * 50 - 40}" y="${742 + (i % 2) * 6}" width="56" height="26" rx="10" fill="#9A8A64"/>`).join('')}
      ${[420, 520, 640, 760].map((x, i) => at(x, 900, figure(150, '#2A2A22', { hat: 'brodie', pose: i % 2 ? 'stand' : 'aim', hold: 'rifle' }))).join('')}
      ${Array.from({ length: 24 }, (_, i) => { const r = seeded(i + 144); return `<circle cx="${(r() * 1200).toFixed(0)}" cy="${(700 + r() * 30).toFixed(0)}" r="${(4 + r() * 3).toFixed(1)}" fill="#C8202A"/>`; }).join('')}`,
  },
  newYork: {
    name: 'New York', era: '1932', zone: 'land',
    font: F('Poiret One'), theme: { mode: 'light', accent: '#3A3A3A' }, sky: sky('#C9D6DE', '#F2EEE6'),
    art: () => `${P.skyline(145, 760, 120, 300, '#A9B0B8', '#A9B0B8', 0)}
      ${at(840, 760, `<rect x="-50" y="-420" width="100" height="420" fill="#8A9098"/><rect x="-34" y="-500" width="68" height="80" fill="#8A9098"/><rect x="-16" y="-560" width="32" height="60" fill="#8A9098"/><path d="M0 -560 V-640" stroke="#8A9098" stroke-width="5"/>`)}
      ${at(380, 760, `<rect x="-44" y="-380" width="88" height="380" fill="#9AA0A8"/><path d="M-44 -380 Q0 -480 44 -380Z" fill="#B9BEC4"/><path d="M0 -470 V-560" stroke="#9AA0A8" stroke-width="4"/>`)}
      <rect x="-40" y="700" width="1280" height="20" fill="#3A3A3A"/>${P.crowd(420, 820, 700, 8, '#2A2A2A', 146, 56)}
      <rect x="-40" y="760" width="1280" height="200" fill="#6E747C"/>${P.skyline(147, 960, 80, 180, '#5A6068', '#FFE29A', 0.4)}`,
  },
  hollywood: {
    name: 'Golden Age of Film', era: '1939', zone: 'land',
    font: F('Limelight'), theme: { mode: 'dark', accent: '#E9C46A' }, sky: sky('#120E2E', '#5A3A6E'),
    art: () => `${stars(80, 147, { bottom: 380 })}
      ${[[260, -24], [460, -8], [760, 10], [960, 26]].map(([x, a], i) => `<polygon points="${x},700 ${x - 34},0 ${x + 34},0" fill="url(#ray)" transform="rotate(${a} ${x} 700)" class="w-sweep" style="animation-delay:-${i * 1.4}s"/>`).join('')}
      ${ridge(148, 520, 90, '#2A2246', { freq: 0.6 })}${Array.from({ length: 30 }, (_, i) => { const r = seeded(i + 160); return `<circle cx="${(r() * 1200).toFixed(0)}" cy="${(480 + r() * 80).toFixed(0)}" r="2" fill="#FFE29A" class="w-twinkle" style="animation-delay:-${(r() * 3).toFixed(1)}s"/>`; }).join('')}
      ${[140, 230, 980, 1070].map((x, i) => at(x, 700, S.palm(240 + (i % 2) * 30, '#140E24', i < 2 ? 0.5 : -0.5))).join('')}
      ${at(600, 700, `<rect x="-280" y="-230" width="560" height="230" fill="#2A1E3E"/><path d="M-300 -230 H300 L270 -260 H-270Z" fill="#3A2A52"/>
        <rect x="-220" y="-200" width="440" height="70" fill="#E9C46A"/><text x="0" y="-152" text-anchor="middle" font-family="Limelight, serif" font-size="38" fill="#2A1E3E">GALA PREMIERE</text>
        ${Array.from({ length: 22 }, (_, i) => `<circle cx="${-210 + i * 20}" cy="-212" r="4.5" fill="#FFE29A" class="w-chase" style="animation-delay:-${(i * 0.08).toFixed(2)}s"/><circle cx="${-210 + i * 20}" cy="-118" r="4.5" fill="#FFE29A" class="w-chase" style="animation-delay:-${(i * 0.08 + 0.4).toFixed(2)}s"/>`).join('')}
        <rect x="-60" y="-100" width="120" height="100" fill="#FFD27A" opacity=".85"/>${glow(0, -50, 140, 'warm')}`)}
      <rect x="-40" y="700" width="1280" height="260" fill="#120E20"/><path d="M540 700 H660 L720 960 H480Z" fill="#A8202A"/>
      <path d="M380 760 H520 M680 760 H820" stroke="#E9C46A" stroke-width="3"/>${[380, 450, 520, 680, 750, 820].map(x => `<rect x="${x - 3}" y="740" width="6" height="30" fill="#E9C46A"/>`).join('')}
      ${P.crowd(-20, 380, 800, 9, '#05040C', 149, 80)}${P.crowd(820, 1220, 800, 9, '#05040C', 150, 80)}
      ${[330, 420, 780, 870].map((x, i) => at(x, 830, figure(110, '#05040C', { hold: 'camera', pose: 'raise', hat: 'bowler', facing: i < 2 ? 1 : -1 }))).join('')}
      ${at(590, 880, figure(130, '#05040C', { hat: 'tophat', outfit: 'coat' }))}${at(632, 884, figure(124, '#05040C', { outfit: 'robe', hat: 'feather' }))}
      ${at(-200, 900, anim('w-cross', S.car1925('#0A0814'), 'animation-duration:20s;animation-delay:-4s'), 0.8)}`,
  },
  pearlHarbor: {
    name: 'Pearl Harbor', era: '1941', zone: 'land',
    font: F('Black Ops One'), theme: { mode: 'light', accent: '#4A6A8A' }, sky: sky('#E9B48A', '#F6E2C8'),
    art: () => `${sun(260, 260, 40, '#FFF0D6', 'warm')}
      ${at(-200, 220, anim('w-cross', [0, 90, 180].map((x, i) => at(-x, i * 24, P.warplane('#3A3A44'), 0.6)).join(''), 'animation-duration:20s'))}
      <path d="M-40 600 Q100 520 260 560 L380 600Z M900 600 Q1000 500 1240 540 V600Z" fill="#4E6A4A"/>
      ${sea(600, '#5A86A8', '#4A7496', '#fff', 150)}
      ${at(480, 680, P.battleship('#4A505A'), 0.8)}${at(900, 700, P.battleship('#4A505A'), 0.6)}
      ${P.smoke(980, 560, '#5A5A5A', 4)}`,
  },
  dday: {
    name: 'D-Day', era: '1944', zone: 'land',
    font: F('Allerta Stencil'), theme: { mode: 'light', accent: '#5A6A3A' }, sky: sky('#9AA6AE', '#E2E2DC'),
    art: () => `${softCloud(100, 140, 360, '#C9CCCE', 0.9)}${softCloud(700, 100, 300, '#BFC2C4', 0.9)}
      ${[[300, 300], [520, 250], [880, 280]].map(([x, y]) => at(x, y, anim('w-bob', `<ellipse rx="34" ry="14" fill="#7A7E84"/><path d="M0 14 V140" stroke="#7A7E84" stroke-width="1"/>`, 'animation-duration:5s'))).join('')}
      ${sea(560, '#6E8494', '#5A7080', '#fff', 151)}
      ${at(260, 600, P.battleship('#4A4E54'), 0.45)}${at(940, 590, P.battleship('#4A4E54'), 0.4)}
      ${[0, 1, 2].map(i => at(380 + i * 180, 700 + i * 12, anim('w-bob', P.landingCraft('#3A4030'), `animation-delay:-${i}s;animation-duration:3s`), 0.9)).join('')}
      <path d="M-40 800 Q300 770 600 790 T1240 780 V960 H-40Z" fill="#C9B88E"/>${Array.from({ length: 8 }, (_, i) => `<path d="M${200 + i * 110} 830 l-14 -24 m14 24 l14 -24 m-14 24 v-30" stroke="#4A4A44" stroke-width="5"/>`).join('')}`,
  },
  vday: {
    name: 'Victory Day', era: '1945', zone: 'land',
    font: F('Bebas Neue'), theme: { mode: 'light', accent: '#2A4FA8' }, sky: sky('#9CC0DC', '#EEF2F4'),
    art: () => `${P.skyline(152, 720, 120, 340, '#8E98A8', '#8E98A8', 0)}
      ${drift(153, 60, '#fff', 3.4, 0.95)}${drift(154, 30, '#E9C46A', 3, 0.9)}
      <rect x="-40" y="720" width="1280" height="240" fill="#6A7280"/>
      ${P.crowd(-20, 1220, 830, 34, '#2A2E38', 155, 70)}
      ${at(600, 840, `${S.person(120, '#1E222C', { hat: 'bowler' })}<g transform="translate(24 0) rotate(-12)">${S.person(110, '#1E222C', { dress: true })}</g>`)}`,
  },
  sputnik: {
    name: 'The Space Race', era: '1957', zone: 'land',
    font: F('Russo One'), theme: { mode: 'dark', accent: '#E0402F' }, sky: sky('#060A1E', '#26325E'),
    art: () => `${stars(160, 156, { bottom: 560 })}
      ${at(-100, 190, anim('w-cross', `<circle r="12" fill="#D9DCE4"/><path d="M-6 6 L-60 50 M0 8 L-30 70 M6 6 L40 60 M-8 0 L-70 20" stroke="#D9DCE4" stroke-width="2"/>${glow(0, 0, 34, 'white', 'w-blink')}`, 'animation-duration:20s'))}
      ${ridge(157, 660, 12, '#1A2038')}
      ${at(330, 690, `<path d="M-60 0 L-34 -300 H-24 L-46 0Z M60 0 L34 -300 H24 L46 0Z" fill="#2E3450"/>${anim('w-launch', `${P.smoke(-30, 110, '#E9ECF2', 4)}${P.smoke(30, 110, '#E9ECF2', 4)}${P.rocket('#DCE0E8', 280)}`)}`, 0.85)}
      ${at(850, 690, `<path d="M-40 0 V-360 H-28 V0Z M-40 -100 H-10 M-40 -200 H-10 M-40 -300 H-10" stroke="#3A4060" stroke-width="5" fill="#3A4060"/>${P.rocket('#F2F2F2', 300, false)}<path d="M-22 -150 H22" stroke="#C0392B" stroke-width="6"/>`, 0.85)}
      ${at(1060, 690, `<path d="M0 0 V-110" stroke="#2A3048" stroke-width="8"/><g transform="translate(0 -120) rotate(-24)"><path d="M-90 0 Q0 70 90 0 Q0 30 -90 0Z" fill="#3A425E"/></g>${glow(0, -130, 30, 'white', 'w-blink')}`, 0.9)}
      <path d="M-40 720 Q600 700 1240 720 V960 H-40Z" fill="#0E1428"/>
      ${P.crowd(380, 820, 860, 12, '#04060F', 162, 92)}
      ${at(560, 870, figure(120, '#04060F', { pose: 'raise' }))}`,
  },
  cuba: {
    name: 'Missiles at Sea', era: '1962', zone: 'land',
    font: F('Saira Stencil One'), theme: { mode: 'light', accent: '#B5302B' }, sky: sky('#7FB8DA', '#EEF5F2'),
    art: () => `${sun(260, 180, 34)}
      ${at(-200, 220, anim('w-cross', P.jet('#3A4250'), 'animation-duration:12s'))}
      <path d="M800 600 Q900 520 1040 540 Q1140 520 1240 560 V600Z" fill="#3E7A4A"/>
      ${sea(600, '#2E7EAE', '#236899', '#fff', 159)}
      ${at(-300, 700, anim('w-cross', `${P.freighter('#3A3A40')}<path d="M-40 -34 L-36 -40 H60 L64 -34Z M-30 -40 L-26 -46 H50 L54 -40Z" fill="#C9C2B0"/>`, 'animation-duration:60s;animation-delay:-26s'), 0.85)}
      ${at(1300, 800, anim('w-cross-rev', P.battleship('#4A5260'), 'animation-duration:44s;animation-delay:-20s'), 0.6)}`,
  },
  apollo: {
    name: 'Launch to the Moon', era: '1969', zone: 'land',
    font: F('Teko', 600), theme: { mode: 'light', accent: '#E07A1E' }, sky: sky('#5A9AD6', '#EAF2F8'),
    art: () => `${moon(900, 150, 24, '#F6F2E6')}
      ${at(600, 600, anim('w-launch', `${P.smoke(-40, 120, '#F2EEE6', 4)}${P.smoke(40, 120, '#F2EEE6', 4)}${P.rocket('#F2F2F2', 360)}`))}
      ${at(760, 640, `<path d="M-20 0 V-400 H20 V0" fill="none" stroke="#B53A2A" stroke-width="8"/><path d="M-20 -100 H20 M-20 -200 H20 M-20 -300 H20" stroke="#B53A2A" stroke-width="5"/>`)}
      ${ridge(160, 636, 6, '#7A8E6A')}<rect x="640" y="630" width="160" height="14" fill="#8E8E86"/>
      ${ridge(161, 680, 8, '#6A8A5A')}<rect x="-40" y="720" width="1280" height="60" fill="#5E86A8"/>
      ${ridge(161, 800, 6, '#4E6E44')}${P.crowd(380, 820, 860, 12, '#1E2A1E', 162, 64)}`,
  },
  woodstock: {
    name: 'Woodstock', era: '1969', zone: 'land',
    font: F('Monoton'), theme: { mode: 'light', accent: '#E07A1E' }, sky: sky('#F2A86A', '#FBE8C6'),
    art: () => `${sun(300, 200, 44, '#FFE6A8')}
      ${ridge(163, 600, 40, '#8EA46A', { freq: 0.7 })}
      <path d="M600 660 Q700 636 840 632 Q980 636 1080 660 V730 H600Z" fill="#8EA46A"/>
      ${at(840, 640, `<rect x="-120" y="-160" width="240" height="160" fill="#3A2A2A"/><path d="M-140 -160 L0 -230 L140 -160Z" fill="#E0402F"/>${glow(0, -80, 90, 'warm')}`)}
      ${ridge(164, 720, 14, '#6E8A4A')}${P.crowd(-20, 1220, 800, 40, '#2E2A1E', 165, 56)}
      ${at(-200, 880, anim('w-cross', P.van('#1E1E1E'), 'animation-duration:40s'))}`,
  },
  london: {
    name: 'Swinging London', era: '1966', zone: 'land',
    font: F('Bungee'), theme: { mode: 'light', accent: '#C8312C' }, sky: sky('#9AB0C4', '#E8ECEE'),
    art: () => `${softCloud(100, 140, 360, '#fff', 0.7)}
      ${P.skyline(166, 700, 60, 160, '#8E949C', '#8E949C', 0)}
      ${at(820, 700, `<rect x="-36" y="-420" width="72" height="420" fill="#6E6A5E"/><circle cx="0" cy="-330" r="26" fill="#F2EEDE"/><path d="M0 -330 V-348 M0 -330 H12" stroke="#2A2A2A" stroke-width="3"/><path d="M-40 -420 L0 -500 L40 -420Z" fill="#5A564C"/>`)}
      <rect x="-40" y="700" width="1280" height="260" fill="#5A5E66"/><path d="M-40 790 H1240" stroke="#E9E2C6" stroke-width="4" stroke-dasharray="40 30"/>
      ${at(400, 760, `<rect x="-26" y="-110" width="52" height="110" fill="#C8312C"/><rect x="-18" y="-96" width="36" height="70" fill="#E9D0C0"/>`)}
      ${at(-200, 860, anim('w-cross', P.bus(), 'animation-duration:18s'))}`,
  },
  backToTheFuture: {
    name: 'The Neon Eighties', era: '1985', zone: 'land',
    font: F('Righteous'), theme: { mode: 'dark', accent: '#FF8A3D' }, sky: sky('#1E1446', '#E8705A'),
    art: () => `${stars(40, 167, { bottom: 260 })}
      ${at(600, 470, `<circle r="130" fill="#FFB45A"/>${[20, 48, 74, 98, 120].map((y, i) => `<rect x="-140" y="${y}" width="280" height="${4 + i * 3}" fill="#B9504A"/>`).join('')}${glow(0, 0, 260, 'sun')}`)}
      ${P.skyline(167, 600, 60, 200, '#2A1A44', '#FF8A6B', 0.25)}
      ${[200, 300, 960, 1060].map((x, i) => at(x, 640, S.palm(220 + (i % 2) * 30, '#1A0E2E', i < 2 ? 0.5 : -0.5))).join('')}
      ${at(620, 660, `<rect x="-200" y="-180" width="400" height="180" fill="#2A1A40"/><rect x="-170" y="-150" width="340" height="56" rx="10" fill="none" stroke="#7FE7FF" stroke-width="5" class="w-chase"/>
        <text x="0" y="-108" text-anchor="middle" font-family="Righteous, sans-serif" font-size="46" fill="#FFD36B" class="w-chase" style="animation-delay:-.4s">ARCADE</text>${glow(0, -122, 160, 'cyan')}
        ${[-140, -70, 70, 140].map(x => `<rect x="${x - 26}" y="-80" width="52" height="74" rx="4" fill="#120A24"/><rect x="${x - 18}" y="-72" width="36" height="26" fill="#3BD6FF" opacity=".8" class="w-twinkle"/>`).join('')}
        <rect x="-26" y="-80" width="52" height="80" fill="#FFD27A" opacity=".85"/>`)}
      <path d="M-40 660 H1240 V960 H-40Z" fill="#160E2C"/>
      ${Array.from({ length: 13 }, (_, i) => `<path d="M600 660 L${-600 + i * 200} 960" stroke="#B94AC9" stroke-width="2" opacity=".55"/>`).join('')}
      ${[690, 730, 790, 870].map(y => `<path d="M-40 ${y} H1240" stroke="#B94AC9" stroke-width="2" opacity=".55"/>`).join('')}
      ${at(-260, 840, anim('w-cross', `<path d="M-110 -14 L-104 -44 L-50 -50 L-26 -80 H50 L76 -50 L112 -44 L116 -14Z" fill="#E9EEF6"/><path d="M-20 -76 H46 L66 -50 H-38Z" fill="#7FA6C9"/><path d="M-110 -30 H116" stroke="#E0402F" stroke-width="5"/>${[-70, 70].map(x => `<circle cx="${x}" cy="-10" r="18" fill="#1A1A1A"/><circle cx="${x}" cy="-10" r="7" fill="#9AA0AE"/>`).join('')}${glow(118, -32, 40, 'warm')}`, 'animation-duration:9s'))}
      ${at(430, 880, figure(118, '#160E2C', { pose: 'walk', wear: { top: '#2BB5A0', bottom: '#3A4E72', shoes: '#F2F2F2' } }))}<rect x="440" y="826" width="26" height="16" rx="3" fill="#2A2A30"/><circle cx="447" cy="834" r="4" fill="#9AA0AE"/><circle cx="459" cy="834" r="4" fill="#9AA0AE"/>
      ${at(780, 884, anim('w-pace', `${figure(120, '#160E2C', { pose: 'run', wear: { top: '#FFD36B', bottom: '#E0402F', shoes: '#F2F2F2' } })}<rect x="-6" y="-2" width="22" height="5" rx="2" fill="#E0402F"/><circle cx="-2" cy="4" r="3" fill="#1A1A1A"/><circle cx="12" cy="4" r="3" fill="#1A1A1A"/>`, '--pace:-160px;animation-duration:5s'))}`,
  },
  berlinWall: {
    name: 'The Wall Falls', era: '1989', zone: 'land',
    font: F('Permanent Marker'), theme: { mode: 'dark', accent: '#F2C14E' }, sky: sky('#0E1230', '#2E3A6E'),
    art: () => `${P.firework(320, 200, 70, '#F2C14E')}${P.firework(860, 170, 80, '#8EC5FF', 1)}${P.firework(620, 120, 60, '#FF8A6B', 2)}
      ${P.skyline(168, 640, 60, 200, '#1A2046', '#FFD27A', 0.3)}
      <rect x="-40" y="640" width="1280" height="110" fill="#C9C2B4"/>
      ${Array.from({ length: 10 }, (_, i) => `<path d="M${i * 130 - 20} ${700 + (i % 3) * 10} q30 -30 60 0 t60 0" stroke="${['#E0402F', '#2F7DF6', '#F2C14E', '#2BB24C'][i % 4]}" stroke-width="10" fill="none"/>`).join('')}
      ${P.crowd(-20, 1220, 640, 24, '#0A0C1E', 169, 60)}<rect x="-40" y="750" width="1280" height="220" fill="#12142A"/>${P.crowd(300, 900, 860, 14, '#05060F', 170, 70)}`,
  },
  millennium: {
    name: 'The Millennium', era: '2000', zone: 'land',
    font: F('Syncopate', 700), theme: { mode: 'dark', accent: '#FFD36B' }, sky: sky('#050A22', '#1A2A5A'),
    art: () => `${P.firework(260, 180, 80, '#FFD36B')}${P.firework(600, 120, 100, '#FF8A6B', 1)}${P.firework(940, 200, 80, '#8EC5FF', 2)}${P.firework(420, 300, 60, '#B9F27C', 1.5)}
      <path d="M200 640 Q600 360 1000 640" fill="none" stroke="#2A3050" stroke-width="20"/><path d="M200 640 Q600 400 1000 640" fill="none" stroke="#2A3050" stroke-width="4"/>
      ${at(420, 640, `<path d="M-120 0 Q-110 -90 -40 -110 Q-60 -40 -40 0Z M-50 0 Q-40 -110 30 -130 Q10 -50 30 0Z M20 0 Q40 -90 100 -100 Q80 -40 90 0Z" fill="#E9EEF6"/>`)}
      ${sea(640, '#0E1A40', '#0A1230', '#FFD36B', 171)}`,
  },
  beijing: {
    name: 'The Summer Games', era: '2008', zone: 'land',
    font: F('Anton'), theme: { mode: 'dark', accent: '#FFB000' }, sky: sky('#070B26', '#1E2A5E'),
    art: () => {
      const r = seeded(808);
      // Tiers of seats curving round the bowl, filled with a colourful crowd.
      const tier = (y, h, rows, depth) => {
        let out = `<path d="M-60 ${y + h} Q600 ${y + h - 60} 1260 ${y + h} V${y} Q600 ${y - 60} -60 ${y}Z" fill="${mix('#2A3060', '#000000', depth)}"/>`;
        for (let row = 0; row < rows; row++) {
          const ry = y + 8 + row * (h / rows);
          for (let x = -40; x < 1240; x += 9 + depth * 6) {
            const sag = ((x - 600) / 660) ** 2 * 60;
            const c = ['#E0402F', '#2F7DF6', '#F2C14E', '#F2F2F2', '#2BB24C', '#E98A3A', '#9A6AE0'][Math.floor(r() * 7)];
            out += `<rect x="${x}" y="${(ry - 60 + sag).toFixed(0)}" width="${(5 - depth * 2).toFixed(1)}" height="${(5 - depth * 2).toFixed(1)}" rx="1" fill="${mix(c, '#1A1E40', 0.35 + depth * 0.3)}"/>`;
          }
        }
        return out;
      };
      const flashes = Array.from({ length: 26 }, () => `<circle cx="${(r() * 1200).toFixed(0)}" cy="${(300 + r() * 260).toFixed(0)}" r="3" fill="#fff" class="w-flash" style="animation-delay:-${(r() * 3.2).toFixed(2)}s;animation-duration:${(2 + r() * 3).toFixed(1)}s"/>`).join('');
      const flags = ['#E0402F', '#2F7DF6', '#F2C14E', '#2BB24C', '#F2F2F2', '#E98A3A', '#9A6AE0', '#1A1A1A'];
      const runner = (x, wear, lane) => at(x, 880 - lane * 22, figure(150 - lane * 10, '#0A0E26', { pose: 'run', wear, tint: 0.15 }));
      return `
      ${stars(40, 801, { bottom: 160 })}
      ${P.firework(200, 120, 70, '#FFD36B', 0.2)}${P.firework(980, 100, 80, '#8EC5FF', 1.3)}${P.firework(620, 70, 56, '#FF8A6B', 2.1)}
      ${[90, 1110].map(x => `<path d="M${x} 330 V140" stroke="#3A4070" stroke-width="10"/><rect x="${x - 40}" y="110" width="80" height="34" rx="4" fill="#2A3060"/>${Array.from({ length: 6 }, (_, i) => `<circle cx="${x - 30 + i * 12}" cy="127" r="4" fill="#FFF6DA"/>`).join('')}<polygon points="${x - 40},140 ${x + 40},140 ${x > 600 ? x - 420 : x + 420},620 ${x > 600 ? x - 160 : x + 160},620" fill="url(#ray)" opacity=".55"/>`).join('')}
      <path d="M-60 250 Q600 160 1260 250 V290 Q600 210 -60 290Z" fill="#141A3E"/>
      ${flags.map((c, i) => { const x = 180 + i * 120; const y = 252 - Math.sin((x / 1200) * Math.PI) * 46; return `<path d="M${x} ${y} V${y - 46}" stroke="#8E94A8" stroke-width="2"/>${anim('w-flag', `<path d="M${x} ${y - 46} h26 v16 h-26Z" fill="${c}"/>`)}`; }).join('')}
      ${tier(300, 110, 6, 0.6)}${tier(400, 120, 6, 0.35)}${tier(510, 110, 5, 0.1)}
      ${flashes}
      ${at(600, 290, `<rect x="-130" y="-70" width="260" height="96" rx="6" fill="#0A0C18" stroke="#3A4070" stroke-width="4"/>
        <text x="0" y="-34" text-anchor="middle" font-family="Anton, sans-serif" font-size="30" fill="#FFB000" letter-spacing="2">100 M FINAL</text>
        <text x="0" y="8" text-anchor="middle" font-family="Anton, sans-serif" font-size="24" fill="#E9EEF6" class="w-chase">9.69</text>`)}
      ${at(1060, 330, `<path d="M-34 0 L-46 -40 H46 L34 0Z" fill="#C9CCD6"/>${glow(0, -70, 90, 'ember', 'w-twinkle')}${anim('w-flame', `<path d="M-30 -40 Q-34 -96 0 -132 Q34 -96 30 -40Z" fill="#FF8A3D"/><path d="M-14 -40 Q-14 -76 0 -96 Q14 -76 14 -40Z" fill="#FFE07A"/>`)}`, 0.8)}
      <path d="M-60 620 Q600 560 1260 620 V960 H-60Z" fill="#2E7A3E"/>
      <path d="M-60 650 Q600 594 1260 650 V960 H-60Z" fill="#B8402E"/>
      ${[662, 690, 722, 760, 806, 860].map((y, i) => `<path d="M-60 ${y} Q600 ${y - 56 + i * 4} 1260 ${y}" stroke="#F4E6DC" stroke-width="${2 + i * 0.6}" fill="none" opacity=".85"/>`).join('')}
      <path d="M760 618 L800 960" stroke="#fff" stroke-width="7"/><path d="M752 618 L790 960" stroke="#1A1A1A" stroke-width="3" stroke-dasharray="10 10"/>
      ${at(-260, 0, anim('w-cross', `
        ${runner(0, { top: '#F2C14E', bottom: '#2BB24C', shoes: '#F2F2F2' }, 3)}
        ${runner(-70, { top: '#E0402F', bottom: '#F2F2F2', shoes: '#1A1A1A' }, 2)}
        ${runner(-150, { top: '#2F7DF6', bottom: '#F2F2F2', shoes: '#F2F2F2' }, 1)}
        ${runner(-40, { top: '#1A1A1A', bottom: '#F2C14E', shoes: '#E0402F' }, 0)}`, 'animation-duration:6s'))}`;
    },
  },
  brainrot: {
    name: 'Meme Beach', era: '2025', zone: 'land',
    font: F('Luckiest Guy'), theme: { mode: 'light', accent: '#2BB24C' }, sky: sky('#5FB8E6', '#E9F6FA'),
    art: () => {
      // Doge: a Shiba Inu giving the side-eye, sitting, facing left.
      const shiba = `
        <path d="M30 -40 Q76 -56 56 -96 Q44 -74 30 -62Z" fill="#F4E6CE"/>
        <path d="M-36 0 Q-46 -62 -16 -88 Q12 -98 32 -80 Q48 -50 42 0Z" fill="#D9944A"/>
        <path d="M-24 -6 Q-28 -62 -6 -80 Q6 -50 8 -6Z" fill="#F4E6CE"/>
        <rect x="-30" y="-30" width="14" height="30" rx="6" fill="#D9944A"/><rect x="-6" y="-30" width="14" height="30" rx="6" fill="#D9944A"/>
        <ellipse cx="-23" cy="-2" rx="9" ry="5" fill="#F4E6CE"/><ellipse cx="1" cy="-2" rx="9" ry="5" fill="#F4E6CE"/>
        <path d="M-52 -118 Q-54 -150 -32 -160 L-28 -188 L-10 -164 Q4 -168 14 -164 L28 -186 L32 -156 Q48 -140 40 -114 Q28 -94 -6 -94 Q-42 -96 -52 -118Z" fill="#D9944A"/>
        <path d="M-24 -184 L-14 -166 L-28 -164Z M24 -182 L16 -165 L28 -160Z" fill="#B8703A"/>
        <path d="M-58 -116 Q-40 -98 -6 -98 Q26 -98 36 -114 Q20 -128 -6 -124 Q-34 -128 -58 -116Z" fill="#F4E6CE"/>
        <ellipse cx="-58" cy="-118" rx="7" ry="5" fill="#2A1A10"/>
        <ellipse cx="-30" cy="-138" rx="5" ry="4" fill="#2A1A10"/><ellipse cx="2" cy="-138" rx="5" ry="4" fill="#2A1A10"/>
        <circle cx="-33" cy="-139" r="1.6" fill="#fff"/><circle cx="-1" cy="-139" r="1.6" fill="#fff"/>
        <ellipse cx="-30" cy="-150" rx="5" ry="3" fill="#F4E6CE"/><ellipse cx="4" cy="-150" rx="5" ry="3" fill="#F4E6CE"/>
        <path d="M-50 -108 Q-40 -102 -30 -106" stroke="#2A1A10" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
      const doge = [['such wow', -80, -250, '#E0402F'], ['much beach', 60, -200, '#2F7DF6'], ['very rule', -70, -205, '#2BB24C'], ['wow', 70, -140, '#B94AC9']]
        .map(([t, x, y, c], i) => `<text x="${x}" y="${y}" font-family="Gochi Hand, cursive" font-size="34" fill="${c}" class="w-twinkle" style="animation-delay:-${i * 0.7}s;animation-duration:3.6s">${t}</text>`).join('');
      // Capybara: unbothered, an orange on its head, drifting in a swim ring.
      const capybara = `
        <ellipse cx="0" cy="-6" rx="96" ry="22" fill="none" stroke="#F2F2F2" stroke-width="22"/>
        <path d="M-96 -6 A96 22 0 0 1 -30 -27 M30 -27 A96 22 0 0 1 96 -6" fill="none" stroke="#E0402F" stroke-width="22"/>
        <path d="M-70 -10 Q-80 -70 -10 -76 Q40 -80 56 -60 Q86 -70 106 -50 Q118 -30 102 -18 Q80 -10 60 -16 Q20 -6 -70 -10Z" fill="#8A5A3A"/>
        <path d="M86 -40 Q110 -40 106 -24 Q96 -18 84 -24Z" fill="#5E3A22"/>
        <path d="M70 -50 q8 4 14 0" stroke="#2A1A10" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="54" cy="-64" r="6" fill="#6E4428"/>
        <circle cx="78" cy="-82" r="16" fill="#F2A23A"/><path d="M78 -98 q8 -10 16 -6 q-6 8 -16 6Z" fill="#3E8A4A"/>
        <path d="M-110 -2 Q-60 6 0 2 Q60 6 110 -2" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/>`;
      return `${sun(940, 150, 36)}
      <path d="M410 420 L490 350 L550 380 L630 270 L700 310 L780 190" fill="none" stroke="#1F9D57" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M800 166 L752 176 L790 214Z" fill="#1F9D57"/>
      <text x="420" y="250" font-family="Anton, sans-serif" font-size="56" fill="#1F9D57" letter-spacing="2">STONKS</text>
      <path d="M-40 560 V380 L80 360 L120 300 H220 L260 360 L330 370 L360 560Z" fill="#C9A06A"/>
      ${[[0, 380, '#E9A23B'], [70, 360, '#D9682E'], [140, 320, '#F2D06A'], [210, 330, '#8FB6C9'], [280, 380, '#E98A6A']].map(([x, y, c]) => `<rect x="${x}" y="${y}" width="66" height="${560 - y}" fill="${c}"/><rect x="${x + 14}" y="${y + 24}" width="14" height="20" fill="#4A6E8A"/><rect x="${x + 38}" y="${y + 24}" width="14" height="20" fill="#4A6E8A"/><path d="M${x - 4} ${y} H${x + 70}" stroke="#B5543A" stroke-width="8"/>`).join('')}
      ${sea(560, '#2E9AD0', '#2585BB', '#fff', 173)}
      ${at(690, 642, anim('w-bob', capybara, 'animation-duration:3.4s'), 0.68)}
      <path d="M-40 690 Q600 650 1240 690 V960 H-40Z" fill="#F2DDB0"/>
      ${at(600, 740, `<rect x="-140" y="0" width="280" height="40" fill="#C9B494"/><rect x="-140" y="0" width="280" height="8" fill="#B8A07E"/>
        <g transform="translate(-110 -2) rotate(-90)">${figure(120, '#C9B494', { wear: { top: '#2F7DF6', bottom: '#1A1A1A', shoes: '#F2F2F2' }, noShadow: true })}</g>`, 0.7)}
      ${at(480, 900, `${shiba}${doge}`, 0.9)}
      ${at(700, 900, figure(150, '#C9B494', { pose: 'dab', wear: { top: '#E0402F', bottom: '#2E3A52', shoes: '#F2F2F2' } }))}`;
    },
  },
  spring: {
    name: 'Spring', era: 'this spring', zone: 'land',
    font: F('Kaisei Decol', 700), theme: { mode: 'light', accent: '#D96A8E' }, sky: sky('#9CC8E8', '#F4F0F2'),
    art: () => `<path d="M300 640 L600 220 L900 640Z" fill="#8E9EB8"/><path d="M600 220 L520 330 L560 316 L600 350 L640 316 L680 330Z" fill="#fff"/>
      ${ridge(174, 660, 20, '#9CB48A')}
      ${at(840, 700, `<rect x="-36" y="-40" width="72" height="40" fill="#A8322D"/>${[0, 1, 2, 3].map(i => `<rect x="${-30 + i * 6}" y="${-80 - i * 46}" width="${60 - i * 12}" height="36" fill="#A8322D"/><path d="M${-50 + i * 6} ${-80 - i * 46} Q0 ${-96 - i * 46} ${50 - i * 6} ${-80 - i * 46}Z" fill="#3A3A44"/>`).join('')}`)}
      ${[360, 460, 560].map((x, i) => at(x, 760, `<path d="M0 0 Q-10 -80 20 -140" stroke="#4A3434" stroke-width="10" fill="none"/>${[[-30, -130], [30, -160], [60, -120], [0, -100], [-50, -100]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="${30 + i * 2}" fill="#F6C2D0"/>`).join('')}`)).join('')}
      ${ridge(175, 820, 8, '#7EA06A')}${drift(176, 34, '#F6C2D0', 3.2, 0.95)}`,
  },
  summer: {
    name: 'Summer', era: 'this summer', zone: 'land',
    font: F('Pacifico'), theme: { mode: 'light', accent: '#F2A23A' }, sky: sky('#3FA6E6', '#E2F4FB'),
    art: () => `${sun(900, 160, 44, '#FFF6D2')}
      ${ridge(177, 520, 130, '#9AB6CE', { sharp: true, freq: 1.1 })}${ridge(178, 600, 50, '#4E8A5A', { freq: 1 })}
      ${[400, 450, 820].map(x => at(x, 620, S.pine(130, '#2E5A3A'))).join('')}
      <rect x="-40" y="620" width="1280" height="340" fill="#3AA0D2"/>${glints(179, 630, 900, 40, '#fff')}
      ${at(-100, 700, anim('w-cross', P.sailboat('#2A3A4A', '#fff'), 'animation-duration:36s;animation-delay:-10s'))}${at(-100, 800, anim('w-cross', P.sailboat('#2A3A4A', '#F2A23A'), 'animation-duration:28s'), 0.8)}
      ${at(600, 860, `<path d="M-60 0 H60 V-10 H-60Z" fill="#7A5A3A"/>${S.person(70, '#2A2A2A')}`)}`,
  },
  autumn: {
    name: 'Autumn', era: 'this autumn', zone: 'land',
    font: F('Sacramento'), theme: { mode: 'light', accent: '#D9682E' }, sky: sky('#E9B48A', '#F6E6D2'),
    art: () => `${sun(300, 220, 36, '#FFF0D6', 'warm')}
      ${ridge(180, 560, 60, '#C99A7A', { freq: 0.8 })}
      ${Array.from({ length: 10 }, (_, i) => at(80 + i * 120, 680 + (i % 2) * 20, P.roundTree(40 + (i % 3) * 8, ['#D9682E', '#E9A23A', '#B9452E', '#C9822E'][i % 4]))).join('')}
      ${ridge(181, 740, 10, '#8E6A3E')}
      ${at(820, 760, `${P.house(110, 70, '#6A4A34', '#FFD27A')}`)}${P.smoke(850, 640, '#E6DED6', 3)}
      ${at(500, 840, P.deer('#5A3A22'))}${drift(182, 30, '#D9682E', 3.6, 0.95)}`,
  },
  winter: {
    name: 'Winter', era: 'this winter', zone: 'land',
    font: F('Mountains of Christmas', 700), theme: { mode: 'dark', accent: '#BFD8FF' }, sky: sky('#1E2A4E', '#5A6E9A'),
    art: () => `${stars(40, 183, { bottom: 300 })}${moon(900, 160, 30)}
      ${ridge(184, 540, 120, '#C9D6E6', { sharp: true, freq: 1.1 })}${ridge(185, 640, 30, '#E6EEF8')}
      ${[400, 480, 560, 720, 800].map((x, i) => at(x, 700 - (i % 2) * 10, P.house(80, 54, '#4A3A44', '#FFD27A'))).join('')}
      ${[360, 640, 880].map(x => at(x, 720, S.pine(140, '#2A3A4A'))).join('')}
      ${ridge(186, 790, 14, '#F2F6FC')}${at(-100, 840, anim('w-cross', `${S.person(70, '#2A2A3A')}<path d="M-30 4 H40" stroke="#B5302B" stroke-width="4"/>`, 'animation-duration:14s'))}
      ${drift(187, 50, '#fff', 2.6, 0.95)}`,
  },
  aboveClouds: {
    name: 'Above the Clouds', era: '2030', zone: 'sky',
    font: F('Baloo 2', 800), theme: { mode: 'light', accent: '#3A86FF' }, sky: sky('#3E8EDB', '#CFE8FA'),
    art: () => `${sun(260, 180, 40)}
      ${at(-200, 300, anim('w-cross', P.airliner('#F2F4F8'), 'animation-duration:24s'))}
      ${[[800, 360, '#E0402F', '#F2C14E'], [420, 460, '#2F7DF6', '#fff']].map(([x, y, a, b], i) => at(x, y, anim('w-bob', P.hotAirBalloon(a, b), `animation-duration:${5 + i}s`))).join('')}
      ${softCloud(-80, 640, 640, '#fff', 0.95, 80)}${softCloud(400, 690, 560, '#F2F8FF', 0.95, 70)}${softCloud(800, 640, 600, '#fff', 0.95, 90)}
      ${ridge(188, 760, 24, '#FFFFFF', { freq: 1.6 })}${ridge(189, 840, 16, '#EEF5FD', { freq: 1.2 })}`,
  },
  stratosphere: {
    name: 'The Stratosphere', era: '2040', zone: 'sky',
    font: F('Michroma'), theme: { mode: 'dark', accent: '#8EA8FF' }, sky: sky('#050C2A', '#3A6AB8'),
    art: () => `${stars(40, 190, { bottom: 300 })}
      <circle cx="600" cy="1800" r="1120" fill="#8EC5FF" opacity=".3" filter="url(#blur-s)"/><circle cx="600" cy="1800" r="1100" fill="url(#earth)"/>
      ${at(-200, 380, anim('w-cross', P.jet('#E6EAF2'), 'animation-duration:10s'))}
      ${at(760, 420, anim('w-bob', `<ellipse cy="-60" rx="60" ry="74" fill="#F2F4F8"/><path d="M0 14 V90" stroke="#C9CCD6" stroke-width="2"/><rect x="-16" y="90" width="32" height="24" fill="#E9A23B"/>`, 'animation-duration:6s'))}`,
  },
  lowOrbit: {
    name: 'Low Orbit', era: '2050', zone: 'space',
    font: F('Exo 2', 800), theme: { mode: 'dark', accent: '#A9C1FF' }, sky: sky('#02040F', '#0B1640'),
    art: () => `${stars(120, 191)}<circle cx="600" cy="1500" r="860" fill="url(#earth)"/>
      ${Array.from({ length: 10 }, (_, i) => at(0, 140 + i * 40, anim('w-cross', `<rect x="-6" y="-4" width="12" height="8" fill="#C7D0E6"/><rect x="-22" y="-2" width="12" height="4" fill="#3557A8"/><rect x="10" y="-2" width="12" height="4" fill="#3557A8"/>`, `animation-duration:${14 + i * 3}s;animation-delay:-${i * 2}s`))).join('')}
      ${at(560, 460, anim('w-float', `<path d="M-40 30 Q-40 -50 0 -70 Q40 -50 40 30Z" fill="#E9EDF6"/><circle cy="-20" r="14" fill="#1C2B55"/><circle cx="-18" cy="0" r="6" fill="#7FD3F5"/><circle cx="18" cy="0" r="6" fill="#7FD3F5"/>${glow(0, 40, 50, 'blue')}`, 'animation-duration:8s'))}`,
  },
  asteroid: {
    name: 'Asteroid Mines', era: '2350', zone: 'space',
    font: F('Quantico', 700), theme: { mode: 'dark', accent: '#F2B84A' }, sky: sky('#05040F', '#1E1A30'),
    art: () => `${stars(140, 192)}
      ${Array.from({ length: 8 }, (_, i) => { const r = seeded(i + 193); return at((r() * 1200).toFixed(0), (100 + r() * 500).toFixed(0), anim('w-float', `<path d="M-30 -10 Q-20 -35 10 -30 Q35 -20 30 5 Q20 30 -10 25 Q-35 15 -30 -10Z" fill="#5A5468"/>`, `animation-duration:${8 + i}s`), (0.5 + r() * 1.5).toFixed(2)); }).join('')}
      ${at(600, 900, `<path d="M-420 0 Q-380 -180 -120 -200 Q60 -260 240 -190 Q400 -170 440 0Z" fill="#3A3448"/>${[[-200, -190], [60, -230], [260, -180]].map(([x, y]) => `<path d="M${x} ${y} V${y - 80}" stroke="#8E89AE" stroke-width="6"/><rect x="${x - 30}" y="${y - 110}" width="60" height="30" fill="#5A5470"/>${glow(x, y - 96, 40, 'amber', 'w-twinkle')}`).join('')}`)}
      ${at(560, 760, anim('w-pace', `<rect x="-40" y="-30" width="80" height="30" rx="6" fill="#C9C2B0"/><circle cx="-24" cy="0" r="10" fill="#2A2638"/><circle cx="24" cy="0" r="10" fill="#2A2638"/><path d="M30 -30 L70 -60" stroke="#C9C2B0" stroke-width="6"/>`, '--pace:120px;animation-duration:7s'))}`,
  },
  jupiter: {
    name: 'Jupiter', era: '2700', zone: 'space',
    font: F('Audiowide'), theme: { mode: 'dark', accent: '#E9A86A' }, sky: sky('#0A0614', '#2A1A2E'),
    art: () => `${stars(100, 194)}
      ${at(600, 900, `<circle r="620" fill="#D9A878"/>${[-520, -440, -350, -260, -170, -80].map((y, i) => `<path d="M-620 ${y} Q0 ${y + 30} 620 ${y}" stroke="${['#B9784A', '#F2D6B0', '#A8683E', '#E9C49A', '#C98A5A', '#F2D6B0'][i]}" stroke-width="${30 + i * 6}" fill="none"/>`).join('')}<ellipse cx="160" cy="-300" rx="80" ry="40" fill="#B9452E"/>`)}
      ${at(420, 330, anim('w-float', `<ellipse rx="110" ry="26" fill="#C9CCD6"/><path d="M-70 -10 Q-60 -80 0 -90 Q60 -80 70 -10Z" fill="url(#glass)" stroke="#E6EAF2"/>${[-50, -26, -4, 18, 40].map((x, i) => `<rect x="${x}" y="${-10 - (20 + (i * 13) % 30)}" width="16" height="${20 + (i * 13) % 30}" fill="#8E94A8"/><rect x="${x + 5}" y="${-6 - (16 + (i * 13) % 30)}" width="5" height="6" fill="#FFE29A"/>`).join('')}${glow(0, 30, 50, 'cyan')}`, 'animation-duration:10s'), 0.9)}`,
  },
  europa: {
    name: 'Europa', era: '2750', zone: 'space',
    font: F('Snowburst One'), theme: { mode: 'dark', accent: '#8FD6FF' }, sky: sky('#0A2A4A', '#020A18'),
    art: () => `<rect x="-40" y="-20" width="1280" height="160" fill="#C9DCEC"/><path d="M-40 140 Q300 170 600 146 T1240 150 V-20 H-40Z" fill="#AFC9DF"/>
      <path d="M200 0 L240 140 M700 20 L660 150 M980 0 L1010 140" stroke="#7FA2C0" stroke-width="2"/>${rays(0.4)}
      ${at(0, 420, anim('w-cross', `<path d="M-80 0 Q-40 -40 40 -30 Q80 -20 90 0 Q80 20 40 30 Q-40 40 -80 0Z" fill="#0F3A5A"/>${[-40, -10, 20, 50].map(x => `<circle cx="${x}" cy="0" r="5" fill="#8FD6FF" class="w-twinkle"/>`).join('')}`, 'animation-duration:24s'))}
      ${ridge(196, 780, 30, '#06223A', { sharp: true, freq: 1.4 })}
      ${[420, 520, 780].map((x, i) => `<path d="M${x} 790 q-8 -60 4 -110" stroke="#0A3050" stroke-width="7" fill="none" class="w-sway"/>${glow(x + 4, 680, 22, i % 2 ? 'violet' : 'cyan', 'w-twinkle')}`).join('')}${bubbles(197, 8)}`,
  },
  titan: {
    name: 'Titan', era: '3000', zone: 'space',
    font: F('Orbitron', 800), theme: { mode: 'light', accent: '#D9822B' }, sky: sky('#C98A4A', '#E9C48A'),
    art: () => `${at(900, 200, P.planet(90, '#E9D6A8', '#C9A66A', '#D9C69A'), 1)}
      ${ridge(198, 600, 40, '#A8683A', { freq: 0.7 })}
      <path d="M-40 680 Q300 650 600 670 T1240 660 V780 Q600 760 -40 780Z" fill="#6A4A2E"/>${glints(199, 680, 760, 16, '#E9C48A')}
      ${ridge(200, 800, 12, '#8E5A30')}${at(560, 870, `${S.person(90, '#3A2418', { helmet: true })}${at(60, 0, S.person(84, '#3A2418', { helmet: true, walk: true }))}`)}`,
  },
  neptune: {
    name: 'Neptune', era: '3100', zone: 'space',
    font: F('Rajdhani', 700), theme: { mode: 'dark', accent: '#6E9BFF' }, sky: sky('#02040C', '#0A1430'),
    art: () => `${stars(160, 201)}${at(780, 360, P.planet(200, '#3E6AE0', '#1E3A9A', '#7A94C8'))}${at(360, 220, P.planet(30, '#D9D2C6', '#A89E90'))}
      ${at(-200, 560, anim('w-cross', `<rect x="-20" y="-10" width="40" height="20" fill="#C9C2B0"/><path d="M-20 0 L-80 -10 M20 0 L60 -30" stroke="#C9C2B0" stroke-width="3"/><path d="M-30 -30 Q0 -60 30 -30" fill="none" stroke="#C9C2B0" stroke-width="4"/>`, 'animation-duration:40s'))}`,
  },
  comet: {
    name: 'Comet Highway', era: '3150', zone: 'space',
    font: F('Rajdhani', 700), theme: { mode: 'dark', accent: '#BFE3FF' }, sky: sky('#03030C', '#141E3A'),
    art: () => `${stars(160, 202)}
      ${[[200, 0, 0], [600, 120, 3], [900, 60, 6]].map(([x, y, d]) => at(x, y, anim('w-comet', `<path d="M0 0 L-260 -120" stroke="#BFE3FF" stroke-width="10" stroke-linecap="round" opacity=".5" filter="url(#blur-s)"/>${glow(0, 0, 40, 'white')}<circle r="10" fill="#fff"/>`, `animation-delay:-${d}s`))).join('')}
      ${at(560, 760, anim('w-float', `<path d="M-30 -10 Q-20 -35 10 -30 Q35 -20 30 5 Q20 30 -10 25 Q-35 15 -30 -10Z" fill="#7A7488" transform="scale(4)"/>${S.person(40, '#2A2638', { helmet: true })}${P.flag(50, '#2A2638', '#E0402F')}`, 'animation-duration:9s'))}`,
  },
  ark: {
    name: 'The Interstellar Ark', era: '3200', zone: 'space',
    font: F('Exo 2', 800), theme: { mode: 'dark', accent: '#8EE0A8' }, sky: sky('#020308', '#0E1630'),
    art: () => `${stars(200, 203)}
      ${at(600, 420, anim('w-float', `<rect x="-360" y="-40" width="720" height="80" rx="40" fill="#5E6680"/>${Array.from({ length: 5 }, (_, i) => `<g transform="translate(${-240 + i * 120} 0)"><ellipse rx="56" ry="56" fill="url(#glass)" stroke="#C9D0E6" stroke-width="2"/><circle cx="-10" cy="10" r="20" fill="#4E9A5A"/><circle cx="16" cy="0" r="16" fill="#5FB06A"/></g>`).join('')}${glow(-380, 0, 90, 'blue')}`, 'animation-duration:14s'))}`,
  },
  frontier: {
    name: 'Warp Speed', era: '3300', zone: 'space',
    font: F('Antonio', 700), theme: { mode: 'dark', accent: '#E9C46A' }, sky: sky('#000006', '#0A0E26'),
    art: () => `${Array.from({ length: 60 }, (_, i) => { const r = seeded(i + 204); const y = r() * 900; const x = r() * 1200; return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} h${(60 + r() * 200).toFixed(0)}" stroke="#fff" stroke-width="1.5" opacity=".6" class="w-warp" style="animation-delay:-${(r() * 2).toFixed(2)}s"/>`; }).join('')}
      ${at(560, 460, anim('w-float', P.starship('#C9CED9'), 'animation-duration:8s'))}`,
  },
  heroes: {
    name: 'Planet of Heroes', era: '3600', zone: 'space',
    font: F('Bangers'), theme: { mode: 'dark', accent: '#E0402F' }, sky: sky('#1A1046', '#5A3A8E'),
    art: () => `${stars(60, 205, { bottom: 300 })}${at(900, 180, P.planet(60, '#E9A86A', '#B9682E'))}
      ${P.skyline(206, 760, 140, 420, '#2A1E5A', '#FFE29A', 0.5)}
      ${at(-200, 300, anim('w-cross', P.hero('#1E1440', '#E0402F'), 'animation-duration:9s'))}${at(-400, 420, anim('w-cross', P.hero('#1E1440', '#2F7DF6'), 'animation-duration:11s;animation-delay:-3s'), 0.8)}
      <rect x="-40" y="760" width="1280" height="200" fill="#140C30"/>${P.crowd(380, 820, 860, 10, '#05030F', 207, 66)}`,
  },
  market: {
    name: 'The Alien Market', era: '3700', zone: 'space',
    font: F('Fredericka the Great'), theme: { mode: 'dark', accent: '#F2B84A' }, sky: sky('#2A0E3A', '#6A3A5A'),
    art: () => `${at(300, 200, P.planet(70, '#7AE0C0', '#3A9A80'))}${at(980, 140, P.planet(40, '#F2B84A', '#B9782E'))}
      ${ridge(208, 600, 60, '#4A1E4A', { sharp: true })}
      ${[380, 520, 680, 840].map((x, i) => at(x, 740, `<path d="M-60 0 V-80 H60 V0Z" fill="#3A1A3A"/><path d="M-70 -80 Q0 -${120 + i * 10} 70 -80Z" fill="${['#F2B84A', '#7AE0C0', '#E9806A', '#B9A6FF'][i]}"/>${glow(0, -50, 50, ['amber', 'teal', 'ember', 'violet'][i])}`)).join('')}
      <rect x="-40" y="740" width="1280" height="220" fill="#2A0E2A"/>
      ${[420, 500, 600, 700, 790].map((x, i) => at(x, 860, anim('w-bob', `<path d="M-14 0 V-60 M14 0 V-60" stroke="#140614" stroke-width="10"/><ellipse cy="-90" rx="${26 + i % 3 * 6}" ry="40" fill="#140614"/>${[-1, 1].map(k => `<circle cx="${k * 8}" cy="-100" r="4" fill="#C8FF7A"/>`).join('')}<path d="M0 -130 V-150" stroke="#140614" stroke-width="3"/>`, `animation-duration:${2 + i * 0.3}s`), 0.9 + (i % 2) * 0.2)).join('')}`,
  },
  galacticGames: {
    name: 'The Galactic Games', era: '3800', zone: 'space',
    font: F('Bungee Shade'), theme: { mode: 'dark', accent: '#F2C14E' }, sky: sky('#050620', '#22205A'),
    art: () => `${stars(80, 209)}
      ${at(600, 900, `<ellipse cy="-200" rx="600" ry="200" fill="#1E1E3A"/><ellipse cy="-260" rx="520" ry="120" fill="#2E8A4A"/><ellipse cy="-260" rx="440" ry="90" fill="none" stroke="#E9E2C6" stroke-width="4"/>${glow(-500, -420, 160, 'white')}${glow(500, -420, 160, 'white')}`)}
      ${[0, 1, 2].map(i => at(-200, 380 + i * 60, anim('w-cross', `<ellipse rx="24" ry="34" fill="#140F30"/>${[-1, 0, 1].map(k => `<circle cx="${k * 8}" cy="-10" r="3" fill="#C8FF7A"/>`).join('')}${anim('w-flame', `<path d="M-10 30 Q0 70 10 30Z" fill="#7FE7FF"/>`)}`, `animation-duration:${6 + i}s;animation-delay:-${i * 1.5}s`))).join('')}`,
  },
  highway: {
    name: 'The Galactic Highway', era: '3900', zone: 'space',
    font: F('Teko', 600), theme: { mode: 'dark', accent: '#FF8A3D' }, sky: sky('#030212', '#1A1440'),
    art: () => `${stars(140, 210)}
      ${[220, 360, 500, 640].map((y, i) => at(0, y, anim(i % 2 ? 'w-cross-rev' : 'w-cross', `${P.starship(['#C9CED9', '#E9A86A', '#8EA8FF', '#B9F27C'][i], ['blue', 'ember', 'violet', 'lime'][i])}`, `animation-duration:${10 + i * 3}s;animation-delay:-${i * 4}s`), 0.4 + i * 0.12)).join('')}`,
  },
  dyson: {
    name: 'The Dyson Sphere', era: '4000', zone: 'space',
    font: F('Major Mono Display'), theme: { mode: 'dark', accent: '#FFD36B' }, sky: sky('#020206', '#1A1206'),
    art: () => `${stars(140, 211)}
      ${at(600, 420, `${glow(0, 0, 360, 'sun')}<circle r="150" fill="#FFE6A8"/>${anim('w-spin-slow', Array.from({ length: 16 }, (_, i) => `<path d="M0 -230 L40 -200 L40 -160 L0 -190Z" fill="#2A2418" transform="rotate(${i * 22.5})"/>`).join(''))}${anim('w-spin-slow', `<circle r="300" fill="none" stroke="#3A3020" stroke-width="16" stroke-dasharray="80 40"/>`, 'animation-direction:reverse')}`)}`,
  },
  crystal: {
    name: 'The Crystal Planet', era: '4200', zone: 'space',
    font: F('Cinzel Decorative', 700), theme: { mode: 'dark', accent: '#B9A6FF' }, sky: sky('#140A3A', '#3A2A7A'),
    art: () => `${stars(80, 212, { bottom: 400 })}${at(300, 200, P.planet(50, '#B9A6FF', '#6A5AB8'))}
      ${ridge(213, 640, 40, '#2A1E5A', { sharp: true })}
      ${[[380, 760, 220], [460, 770, 150], [560, 760, 300], [700, 770, 180], [800, 760, 260]].map(([x, y, h], i) => `${glow(x, y - h / 2, h * 0.5, i % 2 ? 'violet' : 'cyan')}${at(x, y, P.crystal(h, ['#8E7CFF', '#7FD3F5'][i % 2], '#fff'))}`).join('')}
      ${ridge(214, 800, 10, '#1A1240')}`,
  },
  oceanPlanet: {
    name: 'The Ocean Planet', era: '4400', zone: 'space',
    font: F('Gochi Hand'), theme: { mode: 'dark', accent: '#7FD3F5' }, sky: sky('#0A1A4A', '#2A6AA8'),
    art: () => `${at(300, 200, P.planet(80, '#E9E2C6', '#B9A88A'))}${at(900, 140, P.planet(40, '#B9A6FF', '#6A5AB8'))}
      ${sea(600, '#1A5A9A', '#0E4078', '#BFE3FF', 215)}
      ${at(-300, 660, anim('w-cross', `${P.whale('#0A2A50')}<path d="M180 -40 Q200 -100 220 -40" fill="none" stroke="#fff" stroke-width="5" class="w-twinkle"/>`, 'animation-duration:50s;animation-delay:-20s'), 0.9)}
      ${at(560, 860, anim('w-bob', `<path d="M-60 0 H60 Q50 16 0 18 Q-50 16 -60 0Z" fill="#E9EEF6"/><path d="M0 0 V-70 L36 -6Z" fill="#7FD3F5"/>`, 'animation-duration:3s'))}`,
  },
  twinSuns: {
    name: 'The Twin Suns', era: '4600', zone: 'space',
    font: F('Poller One'), theme: { mode: 'light', accent: '#E9822E' }, sky: sky('#E9A86A', '#FBE6C2'),
    art: () => `${sun(500, 380, 46, '#FFF2D2')}${sun(640, 420, 32, '#FFE0B0')}
      ${ridge(216, 620, 30, '#D9A672', { freq: 0.5 })}
      ${at(820, 690, `<path d="M-100 0 L-40 -90 L20 0Z" fill="#C9603E"/><path d="M-40 -90 L20 0 H-14Z" fill="#000" opacity=".16"/><path d="M10 0 L60 -66 L110 0Z" fill="#E9C27A"/><path d="M60 -66 L110 0 H80Z" fill="#000" opacity=".14"/>`)}
      ${at(-200, 760, anim('w-cross', `<path d="M-70 0 H70 L58 14 H-58Z" fill="#7A4A2E"/><path d="M0 0 V-130" stroke="#5A3A22" stroke-width="4"/><path d="M5 -126 L76 -8 H5Z" fill="#F2E6C6"/><circle cx="-50" cy="16" r="9" fill="#3A2418"/><circle cx="50" cy="16" r="9" fill="#3A2418"/>`, 'animation-duration:30s;animation-delay:-12s'), 0.8)}
      ${ridge(217, 720, 10, '#C9945E')}${at(500, 820, S.person(110, '#3A2418', { robe: true }))}`,
  },
  floating: {
    name: 'The Floating Mountains', era: '4800', zone: 'space',
    font: F('Kavoon'), theme: { mode: 'light', accent: '#3E9A5A' }, sky: sky('#5FA6C9', '#DDF0E8'),
    art: () => `${at(900, 160, P.planet(60, '#E9E2C6', '#B9A88A'))}
      ${[[300, 300, 1], [640, 220, 1.4], [980, 340, 0.9]].map(([x, y, s], i) => at(x, y, anim('w-float', `<path d="M-90 0 Q-80 -40 -40 -50 Q0 -90 50 -50 Q90 -40 90 0 Q40 120 0 150 Q-40 120 -90 0Z" fill="#6A7A6A"/><path d="M-90 0 Q-80 -40 -40 -50 Q0 -90 50 -50 Q90 -40 90 0Z" fill="#3E8A4A"/><path d="M-20 0 Q-24 60 -30 140" stroke="#8EC5FF" stroke-width="4" opacity=".7" fill="none"/>`, `animation-duration:${9 + i * 2}s`), s)).join('')}
      ${ridge(218, 760, 40, '#2E6A3E', { freq: 1.4 })}${at(-200, 520, anim('w-cross', P.eagle('#1E3A2A'), 'animation-duration:22s'))}${ridge(219, 840, 10, '#1E4A2A')}`,
  },
  robots: {
    name: 'The Robot Planet', era: '5000', zone: 'space',
    font: F('Press Start 2P'), theme: { mode: 'dark', accent: '#FF6B6B' }, sky: sky('#0E0E14', '#3A2A2A'),
    art: () => `${stars(60, 220, { bottom: 300 })}${at(900, 180, P.planet(70, '#E06A4A', '#9A3A2A'))}
      ${P.skyline(221, 720, 100, 380, '#2A2A34', '#FF6B6B', 0.4)}
      <rect x="-40" y="720" width="1280" height="240" fill="#1A1A22"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 110} 760 h60" stroke="#FF6B6B" stroke-width="3" class="w-twinkle" style="animation-delay:-${i * 0.2}s"/>`).join('')}
      ${[460, 560, 700].map((x, i) => at(x, 880, anim('w-pace', P.robot(140 - i * 20, '#3E3E4C'), `--pace:${i % 2 ? -80 : 80}px;animation-duration:${4 + i}s`))).join('')}`,
  },
  whales: {
    name: 'The Space Whales', era: '5500', zone: 'space',
    font: F('Cormorant Garamond', 700), theme: { mode: 'dark', accent: '#B9A6FF' }, sky: sky('#0A0628', '#2A1A5A'),
    art: () => `${stars(160, 222)}<circle cx="300" cy="600" r="300" fill="#8E7CFF" opacity=".18" filter="url(#blur-l)"/>
      ${at(-300, 380, anim('w-cross', P.whale('#2A2060'), 'animation-duration:60s;animation-delay:-20s'), 1.2)}
      ${at(-300, 660, anim('w-cross', P.whale('#1E1848'), 'animation-duration:80s;animation-delay:-50s'), 0.7)}`,
  },
  pulsar: {
    name: 'The Pulsar', era: '6000', zone: 'space',
    font: F('Syncopate', 700), theme: { mode: 'dark', accent: '#8EC5FF' }, sky: sky('#02020A', '#0A0E26'),
    art: () => `${stars(180, 223)}
      ${at(600, 420, `${anim('w-spin', `<polygon points="-30,0 30,0 140,-700 -140,-700" fill="url(#ray)"/><polygon points="-30,0 30,0 140,700 -140,700" fill="url(#ray)"/>`)}${glow(0, 0, 200, 'blue', 'w-blink')}<circle r="24" fill="#fff"/>`)}`,
  },
  supernova: {
    name: 'The Supernova', era: '7000', zone: 'space',
    font: F('Bungee'), theme: { mode: 'dark', accent: '#FF8A3D' }, sky: sky('#08020A', '#2A0A1A'),
    art: () => `${stars(120, 224)}
      ${at(600, 420, `<circle r="380" fill="#FF6A3D" opacity=".18" filter="url(#blur-l)"/><circle r="260" fill="#FFB45A" opacity=".25" filter="url(#blur-l)"/>${anim('w-pulse', `<circle r="190" fill="none" stroke="#FFD36B" stroke-width="6" opacity=".7"/><circle r="120" fill="none" stroke="#FF8A3D" stroke-width="10" opacity=".7"/>`)}${glow(0, 0, 140, 'warm')}<circle r="30" fill="#fff"/>`)}`,
  },
  andromeda: {
    name: 'Andromeda', era: '4 billion years from now', zone: 'space',
    font: F('Michroma'), theme: { mode: 'dark', accent: '#B9A6FF' }, sky: sky('#03020C', '#100C2A'),
    art: () => `${stars(220, 225)}
      ${[[420, 400, 1, -20, 'violet'], [800, 360, 0.8, 30, 'blue']].map(([x, y, s, rot, g]) => at(x, y, `<g transform="rotate(${rot}) scale(1 0.4)">${glow(0, 0, 260, g)}${anim('w-spin-slow', Array.from({ length: 4 }, (_, i) => `<path d="M0 0 Q120 -40 220 60" fill="none" stroke="#fff" stroke-width="6" opacity=".35" transform="rotate(${i * 90})"/>`).join(''))}<circle r="40" fill="#FFF2D2"/></g>`, s)).join('')}`,
  },
  wormhole: {
    name: 'The Wormhole', era: 'outside time', zone: 'space',
    font: F('Major Mono Display'), theme: { mode: 'dark', accent: '#8EC5FF' }, sky: sky('#020208', '#0A0A20'),
    art: () => `${stars(160, 226)}
      ${at(600, 420, Array.from({ length: 9 }, (_, i) => `<ellipse rx="${340 - i * 36}" ry="${(340 - i * 36) * 0.9}" fill="none" stroke="${i % 2 ? '#8EC5FF' : '#B9A6FF'}" stroke-width="3" opacity="${(0.15 + i * 0.08).toFixed(2)}" class="w-pulse" style="animation-delay:-${(i * 0.3).toFixed(1)}s"/>`).join('') + `<circle r="40" fill="#000"/>${glow(0, 0, 80, 'white')}`)}`,
  },
  multiverse: {
    name: 'The Multiverse', era: 'every time at once', zone: 'space',
    font: F('Monoton'), theme: { mode: 'dark', accent: '#FFD36B' }, sky: sky('#05030F', '#1A0E2A'),
    art: () => `${stars(120, 227)}
      ${[[300, 260, 140, 'violet'], [800, 220, 110, 'blue'], [560, 560, 170, 'warm'], [1000, 560, 90, 'lime'], [180, 620, 80, 'ember']].map(([x, y, r, g], i) => at(x, y, anim('w-float', `<circle r="${r}" fill="url(#glow-${g})" opacity=".6"/><circle r="${r * 0.6}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>${stars(14, 228 + i, { top: -r * 0.5, bottom: r * 0.5 }).replace(/cx="(\d+)"/g, (m, x) => `cx="${((Number(x) / 1200 - 0.5) * r).toFixed(0)}"`)}`, `animation-duration:${10 + i * 2}s`))).join('')}`,
  },
  edge: {
    name: 'The Edge of the Universe', era: 'the very end', zone: 'space',
    font: F('Cormorant Garamond', 700), theme: { mode: 'dark', accent: '#FFFFFF' }, sky: sky('#000000', '#08080C'),
    art: () => `${stars(60, 230, { bottom: 450 })}<path d="M-40 460 Q600 420 1240 460 V960 H-40Z" fill="#000"/>
      <path d="M-40 460 Q600 420 1240 460" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none"/>${glow(600, 440, 300, 'white')}
      ${at(600, 440, S.person(60, '#000'))}`,
  },
  beginning: {
    name: 'The Beginning', era: 'time zero', zone: 'space',
    font: F('Unbounded', 800), theme: { mode: 'dark', accent: '#FFD36B' }, sky: sky('#000000', '#1A0A04'),
    art: () => `${at(600, 420, `<circle r="420" fill="#FF8A3D" opacity=".18" filter="url(#blur-l)"/>${anim('w-pulse', `<circle r="280" fill="url(#glow-warm)"/>`)}${glow(0, 0, 160, 'white')}<circle r="20" fill="#fff"/>`)}${stars(80, 231)}`,
  },
};

// ---------- The order of the climb ----------

const classic = name => CLASSIC.find(s => s.name === name);
const ZONES = { 'The Abyss': 'sea', 'The Shipwreck': 'sea', 'Mount Everest': 'land', 'Orbital Station': 'space', 'Moon Base': 'space', 'Mars City': 'space', "Saturn's Rings": 'space', 'Planet Zorb': 'space', 'The Space Armada': 'space', 'The Black Hole': 'space' };
CLASSIC.forEach(s => { s.zone = ZONES[s.name] || 'land'; });

const STAGES = [
  classic('The Abyss'), NEW.jurassic, NEW.ice, NEW.reef, classic('The Shipwreck'),
  classic('The Aegean Sea'), NEW.troy, NEW.stonehenge, NEW.olympia, NEW.babylon, NEW.athens,
  classic('Alexandria'), NEW.hannibal, NEW.greatWall, classic('The Pyramids'), NEW.pompeii, NEW.rome, NEW.petra,
  NEW.chichen, NEW.vikings, NEW.angkor, NEW.knights, NEW.genghis, NEW.easter, NEW.forbidden, NEW.machu, NEW.columbus,
  NEW.florence, NEW.samurai, NEW.taj, NEW.pirates, NEW.boston, NEW.bastille, NEW.napoleon, NEW.industrial,
  NEW.goldRush, NEW.plains, classic('The Wild West'), NEW.liberty, NEW.cola, NEW.kittyHawk, NEW.titanic,
  NEW.westernFront, classic('Paris'), NEW.newYork, NEW.hollywood, NEW.pearlHarbor, NEW.dday, NEW.vday,
  NEW.sputnik, NEW.cuba, NEW.london, NEW.apollo, NEW.woodstock, NEW.backToTheFuture, NEW.berlinWall,
  NEW.millennium, NEW.beijing, NEW.brainrot, classic('Shanghai'), NEW.spring, NEW.summer, NEW.autumn, NEW.winter,
  classic('Mount Everest'), NEW.aboveClouds, NEW.stratosphere,
  NEW.lowOrbit, classic('Orbital Station'), classic('Moon Base'), NEW.asteroid, classic('Mars City'), NEW.jupiter,
  NEW.europa, classic("Saturn's Rings"), NEW.titan, NEW.neptune, NEW.comet, NEW.ark, NEW.frontier,
  classic('Planet Zorb'), NEW.heroes, NEW.market, NEW.galacticGames, NEW.highway, NEW.dyson, NEW.crystal,
  NEW.oceanPlanet, NEW.twinSuns, NEW.floating, NEW.robots, NEW.whales, classic('The Space Armada'),
  NEW.pulsar, NEW.supernova, NEW.andromeda, classic('The Black Hole'), NEW.wormhole, NEW.multiverse,
  NEW.edge, NEW.beginning,
];

// ---------- Heights: always rising, from the ocean floor to the edge of everything ----------

const fmt = n => Math.round(n).toLocaleString('en-US');
function distance(km) {
  const LY = 9.46e12;
  if (km < 1e6) return `${fmt(km)} km`;
  if (km < 1e9) return `${(km / 1e6).toFixed(km < 1e7 ? 1 : 0)} million km`;
  if (km < 1e12) return `${(km / 1e9).toFixed(1)} billion km`;
  const ly = km / LY;
  if (ly < 1e6) return `${fmt(ly)} light-years`;
  if (ly < 1e9) return `${(ly / 1e6).toFixed(1)} million light-years`;
  return `${(ly / 1e9).toFixed(1)} billion light-years`;
}

(function assignHeights() {
  const by = zone => STAGES.filter(s => s.zone === zone);
  const seaLv = by('sea'), land = by('land'), skyLv = by('sky'), space = by('space');
  seaLv.forEach((s, i) => { s.alt = `−${fmt(Math.round(4000 * ((seaLv.length - i) / seaLv.length) ** 1.6 / 10) * 10)} m`; });
  land.forEach((s, i) => { s.alt = i === land.length - 1 ? '8,849 m' : `${fmt(i === 0 ? 0 : 5 * (1770 ** (i / (land.length - 1))))} m`; });
  skyLv.forEach((s, i) => { s.alt = `${fmt(12 * (6 ** (i / Math.max(1, skyLv.length - 1))))} km`; });
  const start = 400, end = 4.35e23; // low orbit to the edge of the observable universe
  space.forEach((s, i) => {
    if (s.fixedAlt) return;
    s.alt = distance(start * (end / start) ** (i / (space.length - 1)));
  });
}());
