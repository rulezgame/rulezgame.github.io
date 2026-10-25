// rulez — swipe each card left or right, crack the hidden rule, climb to infinity.

const COLORS = { red: '#E63946', blue: '#2F7DF6', green: '#2BB24C', yellow: '#FFC300' };
const COLOR_NAMES = Object.keys(COLORS);
const SHAPES = ['circle', 'square', 'triangle', 'diamond'];
const PATTERNS = ['solid', 'striped', 'hollow'];

const MAX_LIVES = 3;
const CRACK_STREAK = 5;   // correct answers in a row that count as "cracked"
const MAX_MULT = 8;
const RUNS_KEY = 'rulez-runs';
const NAME_KEY = 'rulez-name';
const KEEP_RUNS = 50;  // stored on this device; the leaderboard shows the top MAX_RUNS
const MAX_RUNS = 10;

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

function randomItem() {
  return { color: pick(COLOR_NAMES), shape: pick(SHAPES), pattern: pick(PATTERNS), num: 1 + Math.floor(Math.random() * 9) };
}

// ---------- Rules ----------
// A rule's test(item, prev) returns true when the item belongs LEFT.

const atom = (text, key, test) => ({ text, key, test });

const ATOMS = [
  ...COLOR_NAMES.map(c => atom(`it's ${c}`, 'color', i => i.color === c)),
  ...SHAPES.map(s => atom(`it's a ${s}`, 'shape', i => i.shape === s)),
  atom('it has corners', 'shape', i => i.shape !== 'circle'),
  atom('the number is even', 'num', i => i.num % 2 === 0),
  atom('the number is above 5', 'num', i => i.num > 5),
  ...PATTERNS.map(p => atom(`it's ${p}`, 'pattern', i => i.pattern === p)),
];

const RELATIONAL = [
  atom('same color as the last one', 'rel', (i, p) => !!p && i.color === p.color),
  atom('same shape as the last one', 'rel', (i, p) => !!p && i.shape === p.shape),
  atom('higher number than the last one', 'rel', (i, p) => !!p && i.num > p.num),
  atom('same fill as the last one', 'rel', (i, p) => !!p && i.pattern === p.pattern),
];

// tier 0: single facts · tier 1: adds AND/OR · tier 2: adds "compared to the last one"
function makeRule(tier) {
  if (tier === 0) return pick(ATOMS);
  const kind = pick(tier === 1 ? ['simple', 'and', 'or'] : ['simple', 'and', 'or', 'rel', 'rel']);
  if (kind === 'simple') return pick(ATOMS);
  if (kind === 'rel') return pick(RELATIONAL);
  const a = pick(ATOMS);
  let b;
  do { b = pick(ATOMS); } while (b.key === a.key);
  return kind === 'and'
    ? atom(`${a.text} AND ${b.text}`, 'and', (i, p) => a.test(i, p) && b.test(i, p))
    : atom(`${a.text} OR ${b.text}`, 'or', (i, p) => a.test(i, p) || b.test(i, p));
}

// Share of random items where two rules give different answers.
function disagreement(a, b) {
  let diff = 0;
  let prev = randomItem();
  for (let n = 0; n < 60; n++) {
    const it = randomItem();
    if (a.test(it, prev) !== b.test(it, prev)) diff++;
    prev = it;
  }
  return diff / 60;
}

function chooseRule() {
  const tier = rulesFaced < 3 ? 0 : rulesFaced < 6 ? 1 : 2;
  const recent = history.slice(-4).map(h => h.rule.text);
  let rule;
  for (let tries = 0; tries < 50; tries++) {
    rule = makeRule(tier);
    if (recent.includes(rule.text)) continue;
    // The new rule must differ noticeably from the old one, or nobody feels the shift.
    if (!current || disagreement(rule, current.rule) >= 0.3) break;
  }
  // Fake-out: for the first few items, only show items where a second rule agrees too.
  let decoy = null;
  if (rulesFaced >= 2 && Math.random() < 0.4) {
    for (let tries = 0; tries < 20; tries++) {
      const d = makeRule(tier);
      if (d.text !== rule.text && disagreement(d, rule) >= 0.3) { decoy = d; break; }
    }
  }
  return { rule, decoy };
}

function generateItem() {
  const wantLeft = Math.random() < 0.5;
  const useDecoy = current.decoy && current.seen < 5;
  let item;
  for (let tries = 0; tries < 100; tries++) {
    item = randomItem();
    const left = current.rule.test(item, prevItem);
    if (left !== wantLeft) continue;
    if (useDecoy && current.decoy.test(item, prevItem) !== left) continue;
    break;
  }
  return item;
}

// ---------- Sound ----------

const sound = {
  ctx: null,
  out: null,
  muted: false,
  // Called from a tap or click: browsers (iPhones especially) only allow audio after one.
  init() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        const comp = this.ctx.createDynamicsCompressor();
        comp.threshold.value = -10;
        this.out = this.ctx.createGain();
        this.out.gain.value = 2.4;   // the compressor keeps this loud mix from clipping
        this.out.connect(comp).connect(this.ctx.destination);
      } catch { this.ctx = null; }
    }
    if (!this.ctx) return;
    if (this.ctx.state !== 'running') this.ctx.resume();
    // iPhones: count as media playback (plays even with the ring/silent switch on silent),
    // and play one silent sample inside the tap so the audio really starts.
    if (navigator.audioSession) navigator.audioSession.type = 'playback';
    if (!this.unlocked) {
      const src = this.ctx.createBufferSource();
      src.buffer = this.ctx.createBuffer(1, 1, this.ctx.sampleRate);
      src.connect(this.ctx.destination);
      src.start(0);
      this.unlocked = true;
    }
  },
  // One note. slideTo bends the pitch over the note's length.
  tone(freq, dur, { type = 'sine', vol = 0.15, delay = 0, slideTo = 0 } = {}) {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(this.out);
    osc.start(t);
    osc.stop(t + dur + 0.03);
  },
  // A breath of filtered noise, for whooshes.
  whoosh(dur = 0.6, { from = 400, to = 3000, vol = 0.12, delay = 0 } = {}) {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const buf = this.ctx.createBuffer(1, Math.ceil(this.ctx.sampleRate * dur), this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    src.buffer = buf;
    filter.type = 'bandpass';
    filter.Q.value = 1.2;
    filter.frequency.setValueAtTime(from, t);
    filter.frequency.exponentialRampToValueAtTime(to, t + dur);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + dur * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter).connect(gain).connect(this.out);
    src.start(t);
    src.stop(t + dur + 0.02);
  },

  // Right answer: a bright pluck that climbs with the streak.
  right(streak) {
    const f = 523.25 * Math.pow(2, Math.min(streak, 14) / 12);
    this.tone(f, 0.16, { type: 'triangle', vol: 0.16 });
    this.tone(f * 2, 0.2, { vol: 0.06, delay: 0.04 });
  },
  // Wrong answer: a short, dull thud.
  wrong() {
    this.tone(160, 0.28, { type: 'triangle', vol: 0.24, slideTo: 80 });
    this.tone(110, 0.22, { type: 'square', vol: 0.03, slideTo: 70 });
  },
  // New map: a rising fanfare on top of a whoosh.
  newMap() {
    this.whoosh(0.9, { from: 300, to: 4000, vol: 0.1 });
    [523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, 0.32, { type: 'triangle', vol: 0.1, delay: 0.12 + i * 0.09 }));
    this.tone(1568, 0.6, { vol: 0.06, delay: 0.6 });
  },
  // New heart: a heartbeat, then a sparkle.
  newLife() {
    this.tone(90, 0.16, { vol: 0.32, slideTo: 60 });
    this.tone(90, 0.2, { vol: 0.26, slideTo: 60, delay: 0.17 });
    [1175, 1568, 2093].forEach((f, i) => this.tone(f, 0.22, { vol: 0.07, delay: 0.42 + i * 0.07 }));
  },
  // Rule cracked while hearts are already full.
  cracked() { [880, 1175, 1568].forEach((f, i) => this.tone(f, 0.2, { vol: 0.08, delay: i * 0.06 })); },
  // New rule: a swooping, slightly mysterious sweep.
  newRule() {
    this.tone(660, 0.5, { vol: 0.09, slideTo: 220 });
    this.tone(990, 0.5, { vol: 0.05, slideTo: 330, delay: 0.05 });
    this.whoosh(0.5, { from: 3000, to: 500, vol: 0.06 });
  },
  // Game over: a slow descending fall.
  gameOver() {
    [392, 311, 262].forEach((f, i) => this.tone(f, 0.55, { type: 'triangle', vol: 0.16, delay: i * 0.32 }));
    this.tone(131, 1.2, { vol: 0.12, delay: 0.96, slideTo: 98 });
  },
};

// ---------- Icons (inline SVG, stroke follows currentColor) ----------

const ICONS = {
  left: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  right: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  home: '<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
  sound: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
  muted: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6M16 9l6 6"/>',
};
const icon = (name, cls = '') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
const heart = lost =>
  `<svg viewBox="0 0 24 24" class="${lost ? 'lost' : ''}" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3.3 5 6.8 5c2 0 3.6 1.1 5.2 3 1.6-1.9 3.2-3 5.2-3 3.5 0 5.6 3.6 4.3 6.8C19.5 16.4 12 21 12 21z" fill="${lost ? 'none' : '#F0524A'}" stroke="${lost ? 'currentColor' : '#F0524A'}" stroke-width="2" stroke-linejoin="round"/></svg>`;

// ---------- Rendering ----------

const $ = id => document.getElementById(id);
const card = $('card');
const stage = $('stage');
const binLeft = $('bin-left');
const binRight = $('bin-right');

binLeft.innerHTML = icon('left', 'arrow') + icon('check', 'mark mark-good') + icon('x', 'mark mark-bad');
binRight.innerHTML = icon('right', 'arrow') + icon('check', 'mark mark-good') + icon('x', 'mark mark-bad');
$('quit').innerHTML = icon('home');
$('mute').innerHTML = icon('sound');

// Stripe fills, one per color, shared by every card.
document.body.insertAdjacentHTML('beforeend',
  `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${COLOR_NAMES.map(c =>
    `<pattern id="stripe-${c}" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
       <rect width="20" height="20" fill="#fff"/><rect width="10" height="20" fill="${COLORS[c]}"/></pattern>`).join('')}</defs></svg>`);

function shapeMarkup(shape, attrs) {
  switch (shape) {
    case 'circle': return `<circle cx="100" cy="100" r="72" ${attrs}/>`;
    case 'square': return `<rect x="32" y="32" width="136" height="136" rx="14" ${attrs}/>`;
    case 'triangle': return `<polygon points="100,22 180,166 20,166" stroke-linejoin="round" ${attrs}/>`;
    case 'diamond': return `<polygon points="100,16 184,100 100,184 16,100" stroke-linejoin="round" ${attrs}/>`;
  }
}

// Cartoon double outline: ink first, the item's color on top, so hollow shapes keep their color.
function renderItem(it) {
  const c = COLORS[it.color];
  const fill = it.pattern === 'solid' ? c : it.pattern === 'striped' ? `url(#stripe-${it.color})` : 'none';
  const ty = it.shape === 'triangle' ? 120 : 100;
  return `<svg viewBox="0 0 200 200">
    ${shapeMarkup(it.shape, `fill="${fill}" stroke="${c}" stroke-width="${it.pattern === 'hollow' ? 12 : 6}"`)}
    <text class="num${it.pattern === 'hollow' ? ' on-white' : ''}" x="100" y="${ty}">${it.num}</text></svg>`;
}

// Five pips fill towards the next bonus step.
function pipsMarkup(n) {
  const filled = multiplier() === MAX_MULT ? 5 : n % 5;
  return Array.from({ length: 5 }, (_, i) => `<i${i < filled ? ' class="on"' : ''}></i>`).join('');
}

// ---------- Climbing ----------
// Points needed to leave place k grow exponentially: easy at first, steep later.
const CLIMB_BASE = 150;
const CLIMB_GROWTH = 1.15;
const stepCost = k => Math.round(CLIMB_BASE * CLIMB_GROWTH ** k / 10) * 10;

// Total score needed to reach place i.
function pointsFor(i) {
  let total = 0;
  for (let k = 0; k < i; k++) total += stepCost(k);
  return total;
}

function restartAnim(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

// ---------- Screens ----------

const SCREENS = ['home', 'game', 'help', 'board', 'over'];
function showScreen(name) {
  SCREENS.forEach(s => $(s).classList.toggle('hidden', s !== name));
}

// ---------- Game state ----------

let state = 'menu';         // menu | playing | over
let score, lives, streak, itemsSeen, rulesFaced, history, place;
let continued = false;      // one reward-video continue per game
let current = null;         // the active rule and its stats
let item = null, prevItem = null;
let itemShownAt = 0, timeLimit = 5000, timerRaf = 0;
let busy = false;
let tilt = 0;               // each card is dealt slightly askew
let shiftTimer = 0;
let runId = 0;          // bumps every game, so late timers from an old game do nothing
let hiddenAt = 0;       // when the app went into the background

function safeGet(k) { try { return localStorage.getItem(k); } catch { return null; } }
function safeSet(k, v) { try { localStorage.setItem(k, v); } catch {} }

function loadRuns() {
  try { return JSON.parse(safeGet(RUNS_KEY)) || []; } catch { return []; }
}

const multiplier = () => Math.min(MAX_MULT, 1 + Math.floor(streak / 5));

function updateHUD() {
  $('score').textContent = score.toLocaleString('en-US');
  $('pips').innerHTML = pipsMarkup(streak);
  const m = multiplier();
  const multEl = $('mult');
  multEl.classList.toggle('hot', m > 1);
  if (multEl.textContent !== `×${m}`) {
    multEl.textContent = `×${m}`;
    if (m > 1) restartAnim(multEl, 'bump');
  }
  $('lives').innerHTML = Array.from({ length: MAX_LIVES }, (_, i) => heart(i >= lives)).join('');
  updateProgress();
}

function updatePlace() {
  const s = stageAt(place);
  $('place-name').textContent = s.name;
  $('place-era').textContent = s.era;
  $('place-alt').textContent = s.alt;
  updateProgress();
}

function updateProgress() {
  const from = pointsFor(place), to = pointsFor(place + 1);
  const pct = Math.min(100, ((score - from) / (to - from)) * 100);
  $('next-fill').style.width = `${pct}%`;
  $('next-pts').textContent = `${(to - score).toLocaleString('en-US')} pts`;
}

function startGame() {
  sound.init();
  runId++;
  $('arrival').classList.remove('show');
  score = 0; lives = MAX_LIVES; streak = 0; itemsSeen = 0; rulesFaced = 0; place = 0;
  continued = false;
  history = []; current = null; prevItem = null; busy = false;
  state = 'playing';
  showStage(0);
  showScreen('game');
  updatePlace();
  updateHUD();
  startRule();
  showNext();
}

function startRule() {
  const { rule, decoy } = chooseRule();
  current = { rule, decoy, start: performance.now(), seen: 0, streak: 0, crackedItems: null, crackedTime: null, changeAfter: null };
  history.push(current);
  rulesFaced++;
  if (rulesFaced > 1) {
    // The card wobbles, but the new rule stays secret.
    restartAnim(stage, 'shifting');
    clearTimeout(shiftTimer);
    shiftTimer = setTimeout(() => stage.classList.remove('shifting'), 700);
    sound.newRule();
  }
}

// Enough points lift you to the next place (or several, after a big run).
function climbIfReady() {
  if (score < pointsFor(place + 1)) return;
  while (score >= pointsFor(place + 1)) place++;
  const s = showStage(place, true);
  updatePlace();
  const a = $('arrival');
  a.innerHTML = `<span class="a-label">You reached</span><span class="a-name">${s.name}</span><span class="a-meta">${s.era}, ${s.alt}</span>`;
  restartAnim(a, 'show');
  sound.newMap();
}

function showNext() {
  item = generateItem();
  timeLimit = Math.max(2000, 5000 - itemsSeen * 20);
  card.innerHTML = renderItem(item);
  tilt = (Math.random() * 6 - 3).toFixed(1);
  card.style.transition = 'none';
  card.style.transform = `translateY(-28px) rotate(${tilt * 2}deg)`;
  card.style.opacity = '0';
  void card.offsetWidth;
  card.style.transition = 'transform 0.18s cubic-bezier(.3,1.6,.5,1), opacity 0.12s';
  card.style.transform = `rotate(${tilt}deg)`;
  card.style.opacity = '1';
  itemShownAt = performance.now();
  busy = false;
  cancelAnimationFrame(timerRaf);
  timerRaf = requestAnimationFrame(tick);
}

function tick() {
  if (state !== 'playing' || busy) return;
  const t = performance.now() - itemShownAt;
  const left = Math.max(0, 1 - t / timeLimit);
  $('timer-fill').style.transform = `scaleX(${left})`;
  $('timer-fill').classList.toggle('low', left < 0.3);
  if (t >= timeLimit) return resolve(null);
  timerRaf = requestAnimationFrame(tick);
}

function answer(side) {
  if (state !== 'playing' || busy) return;
  resolve(side);
}

// side is 'left', 'right', or null when time ran out.
function resolve(side) {
  busy = true;
  cancelAnimationFrame(timerRaf);
  const now = performance.now();
  const correct = current.rule.test(item, prevItem) ? 'left' : 'right';
  const ok = side === correct;
  itemsSeen++;
  current.seen++;

  if (ok) {
    streak++;
    current.streak++;
    const bonus = Math.max(0, Math.round(10 * (1 - (now - itemShownAt) / timeLimit)));
    const pts = (10 + bonus) * multiplier();
    score += pts;
    $('points').textContent = `+${pts}`;
    restartAnim($('points'), 'show');
    sound.right(streak);

    if (current.streak === CRACK_STREAK && current.crackedItems === null) {
      current.crackedItems = current.seen;
      current.crackedTime = now - current.start;
      current.changeAfter = CRACK_STREAK + 4 + Math.floor(Math.random() * 5);
      // Every cracked rule earns a heart back, up to the maximum.
      if (lives < MAX_LIVES) {
        lives++;
        showStamp('Cracked! +1 heart');
        sound.newLife();
        updateHUD();
        $('lives').children[lives - 1].classList.add('gain');
      } else {
        showStamp('Cracked!');
        sound.cracked();
      }
    }
  } else {
    lives--;
    streak = 0;
    current.streak = 0;
    sound.wrong();
    restartAnim(stage, 'oops');
  }

  flashBin(correct === 'left' ? binLeft : binRight, ok ? 'good' : 'bad');
  flyCard(side);
  prevItem = item;
  updateHUD();
  climbIfReady();

  const run = runId;
  setTimeout(() => {
    if (state !== 'playing' || run !== runId) return;
    if (lives <= 0) return gameOver();
    if (current.changeAfter && current.streak >= current.changeAfter) startRule();
    showNext();
  }, ok ? 170 : 450);
}

function flashBin(bin, cls) {
  bin.classList.remove('good', 'bad');
  void bin.offsetWidth;
  bin.classList.add(cls);
  setTimeout(() => bin.classList.remove(cls), 380);
}

function flyCard(side) {
  card.style.transition = 'transform 0.16s ease-in, opacity 0.16s';
  card.style.transform = side === 'left' ? 'translateX(-180px) scale(0.5) rotate(-16deg)'
    : side === 'right' ? 'translateX(180px) scale(0.5) rotate(16deg)'
    : `translateY(80px) scale(0.7) rotate(${tilt}deg)`;
  card.style.opacity = '0';
}

function showStamp(text) {
  const s = $('stamp');
  s.textContent = text;
  restartAnim(s, 'show');
}

function stopRun() {
  state = 'menu';
  busy = true;
  cancelAnimationFrame(timerRaf);
}

function gameOver() {
  state = 'over';
  cancelAnimationFrame(timerRaf);
  ads.gameEnded();
  $('arrival').classList.remove('show');
  sound.gameOver();
  const s = stageAt(place);

  const runs = loadRuns();
  const prevBest = runs.length ? runs[0].score : 0;
  const isBest = score > prevBest;
  lastRunId = Date.now();
  runs.push({ id: lastRunId, name: safeGet(NAME_KEY) || '', score, place, date: new Date().toISOString() });
  runs.sort((a, b) => b.score - a.score);
  safeSet(RUNS_KEY, JSON.stringify(runs.slice(0, KEEP_RUNS)));
  $('player-name').value = safeGet(NAME_KEY) || '';
  $('name-saved').textContent = '';

  $('final-score').textContent = score.toLocaleString('en-US');
  const note = $('final-note');
  const isNew = isBest && score > 0;
  note.textContent = isNew ? 'New best!' : `Best ${prevBest.toLocaleString('en-US')}`;
  note.classList.toggle('new', isNew);
  $('reached').innerHTML = `You climbed to <span class="place-in-font display">${s.name}</span> (${s.era}, ${s.alt}).`;

  // Reveal the answer to the rule that was live when the last heart went.
  const last = current;
  $('last-rule').innerHTML =
    `<span class="side">Left</span> if ${last.rule.text}, <span class="side">right</span> otherwise.
     <small>${last.crackedItems !== null
       ? `You cracked this one after ${last.crackedItems} cards.`
       : `You saw ${last.seen} card${last.seen === 1 ? '' : 's'} with this rule.`}</small>`;

  $('replay').innerHTML = history.map(h => {
    const cracked = h.crackedItems !== null;
    const result = cracked
      ? `Cracked after ${h.crackedItems} cards in ${(h.crackedTime / 1000).toFixed(1)}s`
      : `Not cracked after ${h.seen} card${h.seen === 1 ? '' : 's'}`;
    return `<li${h === last ? ' class="final-row"' : ''}>
      <span class="rule-text">Left if ${h.rule.text}, right otherwise.</span>
      <span class="rule-result">${result}</span></li>`;
  }).join('');

  $('continue').classList.toggle('hidden', continued || !ads.canReward);
  showScreen('over');
}

// Watching a reward video brings you back with one heart, same rule, same score.
// The run saved at game over is taken back off the board; it is saved again when this one ends.
async function continueGame() {
  $('continue').classList.add('hidden');
  if (!(await ads.showReward())) return;
  safeSet(RUNS_KEY, JSON.stringify(loadRuns().filter(r => r.id !== lastRunId)));
  continued = true;
  lives = 1;
  state = 'playing';
  showScreen('game');
  updateHUD();
  showNext();
}

// Every few games a full-screen ad plays before the next one starts (app only).
async function newGame() {
  await ads.beforeGame();
  startGame();
}

// ---------- Names on the leaderboard ----------
// Each game is saved straight away; the name bubble just labels it (and is remembered for next time).

let lastRunId = null;
const escapeHTML = t => t.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

function nameRun(name) {
  const runs = loadRuns();
  const run = runs.find(r => r.id === lastRunId);
  if (run) run.name = name;
  safeSet(RUNS_KEY, JSON.stringify(runs));
  safeSet(NAME_KEY, name);
  return runs.indexOf(run) + 1;
}

$('player-name').addEventListener('input', e => nameRun(e.target.value.trim()));
$('name-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('player-name').value.trim();
  const rank = nameRun(name);
  $('player-name').blur();
  $('name-saved').textContent = rank && rank <= MAX_RUNS
    ? `Saved for ${name || 'Player'}: #${rank} on this device.`
    : `Saved for ${name || 'Player'}. Not in the top ${MAX_RUNS} yet.`;
});

// ---------- Home, help, leaderboard ----------

function goHome() {
  stopRun();
  $('arrival').classList.remove('show');
  showHome();
  showScreen('home');
}

const nameStyle = s => `style="font-family:${fontStack(s.font)};font-weight:${s.font.weight}"`;

// Only places you have actually reached ever show up here; the rest stays a surprise.
function openBoard() {
  const runs = loadRuns().slice(0, MAX_RUNS);
  $('runs').innerHTML = runs.length
    ? runs.map((r, i) => {
      const s = stageAt(r.place);
      loadFont(s.font);
      const date = new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `<li><span class="rank">${i + 1}</span>
        <span><span class="who">${escapeHTML(r.name || 'Player')}</span>
        <span class="where" ${nameStyle(s)}>${s.name}</span>
        <span class="when">${s.era}, ${s.alt}. Played ${date}</span></span>
        <span class="pts">${r.score.toLocaleString('en-US')}</span></li>`;
    }).join('')
    : '<li class="empty">No climbs yet. Press Play to start your first one.</li>';
  showScreen('board');
}

// ---------- Input ----------

// Any tap, click or key wakes the audio (browsers only allow sound after one).
['pointerdown', 'touchend', 'click', 'keydown'].forEach(ev => document.addEventListener(ev, () => sound.init(), { passive: true }));
$('play').addEventListener('click', newGame);
$('again').addEventListener('click', newGame);
$('continue').addEventListener('click', continueGame);
$('open-help').addEventListener('click', () => {
  $('privacy-choices').classList.toggle('hidden', !ads.privacyRequired);
  showScreen('help');
});
$('privacy-choices').addEventListener('click', () => ads.privacyOptions());
$('open-board').addEventListener('click', openBoard);
$('to-menu').addEventListener('click', goHome);
$('quit').addEventListener('click', goHome);
document.querySelectorAll('.back').forEach(b => b.addEventListener('click', () => showScreen('home')));
binLeft.addEventListener('click', () => answer('left'));
binRight.addEventListener('click', () => answer('right'));
sound.muted = safeGet('rulez-muted') === '1';
$('mute').innerHTML = icon(sound.muted ? 'muted' : 'sound');
$('mute').addEventListener('click', e => {
  sound.muted = !sound.muted;
  safeSet('rulez-muted', sound.muted ? '1' : '0');
  e.currentTarget.innerHTML = icon(sound.muted ? 'muted' : 'sound');
  e.currentTarget.setAttribute('aria-label', sound.muted ? 'Turn sound on' : 'Turn sound off');
});

document.addEventListener('keydown', e => {
  if (e.target.matches('input')) return;
  if (e.key === 'Escape' && state !== 'playing') return goHome();
  if (state === 'over' && e.key === 'Enter') {
    e.preventDefault();
    return newGame();
  }
  if (state !== 'playing') return;
  if (e.key === 'ArrowLeft' || e.key === 'a') answer('left');
  else if (e.key === 'ArrowRight' || e.key === 'd') answer('right');
});

// Locking the phone or switching apps pauses the card timer instead of costing a heart.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    hiddenAt = performance.now();
    return;
  }
  if (sound.ctx && sound.ctx.state !== 'running') sound.ctx.resume();
  if (!hiddenAt) return;
  const away = performance.now() - hiddenAt;
  hiddenAt = 0;
  itemShownAt += away;
  if (current) current.start += away;
  if (state === 'playing' && !busy) {
    cancelAnimationFrame(timerRaf);
    timerRaf = requestAnimationFrame(tick);
  }
});

// Swipe anywhere on the stage.
let drag = null;
stage.addEventListener('pointerdown', e => {
  if (state !== 'playing' || busy || e.target.closest('.bin')) return;
  drag = { x: e.clientX };
  stage.setPointerCapture(e.pointerId);
  card.style.transition = 'none';
});
stage.addEventListener('pointermove', e => {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  card.style.transform = `translateX(${dx}px) rotate(${Number(tilt) + dx / 18}deg)`;
  binLeft.classList.toggle('hover', dx < -60);
  binRight.classList.toggle('hover', dx > 60);
});
stage.addEventListener('pointerup', e => {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  drag = null;
  binLeft.classList.remove('hover');
  binRight.classList.remove('hover');
  if (dx < -60) answer('left');
  else if (dx > 60) answer('right');
  else {
    card.style.transition = 'transform 0.15s';
    card.style.transform = `rotate(${tilt}deg)`;
  }
});
stage.addEventListener('pointercancel', () => {
  drag = null;
  card.style.transform = `rotate(${tilt}deg)`;
});

showHome();
showScreen('home');
