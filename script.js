// FROZEN LAKE · Temporality × Possibility
// Built on the IMA Lab experiment shell (engine.js, shell.js, runner.js, style.css by Mert Seven).
// You are a penguin collecting fish on a frozen lake. Every ice tile you step on starts a clock (Temporality):
// a few seconds later it breaks and turns to water, and water is no longer a place you can go (Possibility).
// Your past steps decide which future steps are still possible.
// Input: arrows / WASD / click a tile · Rule: stepped ice breaks after crackSec · State: tiles[ ], fish, lives · Output: cracks, holes, splash
window.OYUNLAR = window.OYUNLAR || {};
window.KUTUPHANE = window.KUTUPHANE || {};
window.KUTUPHANE.karakterler = window.KUTUPHANE.karakterler || [];
window.KUTUPHANE.mekanlar = window.KUTUPHANE.mekanlar || [];

const LAKE_KEY = '04 × 05';

/* ---- Character: a penguin made from the lab engine's parts ---- */
window.KUTUPHANE.karakterler.push(
  { id: 'char.penguin', version: 1, kind: 'character', name: 'Penguin', role: 'player · you', place: LAKE_KEY,
    parts: { body: { shape: 'pear', paint: { pattern: 'apron', colors: ['ink', 'paper', 'paper'] } }, neck: { height: 0.02, paint: { color: 'ink' } },
             head: { shape: 'ball', paint: { color: 'ink' } },
             face: { eyes: 'ring', brows: false, mouth: 'beak' },
             arms: { type: 'wings', paint: { color: 'ink' } },
             extras: [{ type: 'scarf', paint: { color: 'hot' } }] },
    motion: { personality: 'bouncy' } }
);

/* ---- The place: a snowy shore around the lake ---- */
(function () {
  const pine = (a, r, h) => ({ type: 'group', at: [Math.cos(a) * r, 0, Math.sin(a) * r], parts: [
    { type: 'cyl', r: 0.06, rTop: 0.045, h: 0.4, at: [0, 0.2, 0], paint: { color: 'wood' } },
    { type: 'cone', r: h * 0.3, h, at: [0, 0.38 + h / 2, 0], paint: { pattern: 'diag', colors: ['paper', 'green'], repeat: [3, 2] } }] });
  window.KUTUPHANE.mekanlar.push({
    id: 'place.frozenlake', version: 1, kind: 'place', place: LAKE_KEY, name: 'Frozen Lake', premise: 'Temporality × Possibility',
    promise: 'Design time as much as space. Design the space of possibilities, not the object.', game: 'Frozen Lake', footprint: 2.7, height: 2.0,
    parts: [
      { type: 'cyl', r: 2.75, h: 0.08, at: [0, 0.04, 0], paint: { pattern: 'stars', colors: ['gray', 'paper'], repeat: [5, 5] }, shadow: false },
      ...[[-2.2, 0.6, 0.32], [-1.9, 1.3, 0.22], [2.05, 1.2, 0.28], [1.5, 1.95, 0.2], [-1.2, 2.05, 0.25]].map(([x, z, r]) =>   // snow mounds
        ({ type: 'sphere', r, at: [x, 0.08, z], scale: [1.3, 0.55, 1], paint: { color: 'paper' } })),
      pine(Math.PI * 1.12, 2.45, 1.2), pine(Math.PI * 1.25, 2.55, 1.6), pine(Math.PI * 1.75, 2.5, 1.4), pine(Math.PI * 1.88, 2.45, 1.1), pine(Math.PI * 1.98, 2.55, 1.3),
      { type: 'group', at: [-1.95, 0.08, -1.25], parts: [            // igloo
        { type: 'lathe', profile: [[0, 0], [0.5, 0], [0.48, 0.18], [0.36, 0.38], [0.18, 0.48], [0, 0.5]], paint: { pattern: 'bricks', colors: ['paper', 'gray'], repeat: [3, 2] } },
        { type: 'box', size: [0.26, 0.24, 0.3], at: [0.36, 0.12, 0.12], rot: [0, -0.6, 0], paint: { color: 'paper' } }] },
      { type: 'char', id: 'char.snowman', at: [2.15, 0.08, 0.35], rot: [0, -1.2, 0], scale: 0.8 }
    ]
  });
})();

window.OYUNLAR[LAKE_KEY] = {
  key: LAKE_KEY, title: 'Frozen Lake', premise: 'Temporality × Possibility',
  premiseText: 'Interaction happens in time. A system makes some actions possible and others impossible.',
  promise: 'Design time as much as space. Design the space of possibilities, not the object.',
  source: 'thin ice puzzles; Sand Box (IMA Lab) without undo',
  caption: 'Collect every fish.',
  hint: 'arrows / WASD or click a tile = hop · T = breaking on/off · C = code · shift+N = notes',
  anat: ['hop · arrows · click', 'stepped ice breaks after N s', 'tiles[ ] · fish · lives', 'cracks · holes · splash'], hot: 1,
  hud: [['FISH', 'hFish'], ['ICE LEFT', 'hIce', 'ghosts'], ['LIVES', 'hLives'], ['TIME', 'hTime']],

  // 1) DESIGN PARAMETERS — every number and rule of the game lives here
  design: {
    crackSec: 3,          // TEMPORALITY: seconds between your first step on a tile and the tile breaking
    breaking: true,       // comparison mode: if false, the ice never breaks (T)
    warn: true,           // feedback: show cracks and the countdown before a tile breaks
    refreezeSec: 0,       // seconds until water freezes again · 0 = never
    size: 7,              // tiles per side (new game)
    fish: 5,              // fish to collect (new game)
    lives: 3,             // falls allowed
    hopTime: 0.22,        // seconds one hop takes
    penguinSize: 0.62,    // how big the penguin looks
    iceColor: 'paper'     // colour of the ice
  },
  knobs: [
    { key: 'crackSec', step: 0.5, min: 0.5, max: 12, note: 'seconds · step → break' },
    { key: 'breaking', type: 'bool', note: 'off = ice never breaks (T)' },
    { key: 'warn', type: 'bool', note: 'cracks + countdown before breaking' },
    { key: 'refreezeSec', step: 1, min: 0, max: 30, note: 'seconds · 0 = water stays' },
    { key: 'size', step: 1, min: 4, max: 9, note: 'tiles per side · new game (RESTART)' },
    { key: 'fish', step: 1, min: 1, max: 12, note: 'new game (RESTART)' },
    { key: 'lives', step: 1, min: 1, max: 9, note: 'falls allowed · new game' },
    { key: 'hopTime', step: 0.02, min: 0.08, max: 1, note: 'seconds per hop' },
    { key: 'penguinSize', step: 0.05, min: 0.25, max: 1, note: 'scale' },
    { key: 'iceColor', type: 'choice', options: ['paper', 'pink', 'warm', 'green', 'gray'], note: 'ice colour' }
  ],
  code: [
    '<span class="c">// 2) RULES: the ice remembers every step</span>',
    '<span class="k">if</span> (tile.ice && !tile.clock) tile.clock = now;            <span class="c">// 1) your step starts a clock</span>',
    '<span class="k">if</span> (now - tile.clock > DESIGN.crackSec) tile.water = true; <span class="c">// 2) time turns it into water</span>',
    'canHop(to) = !to.water;                                  <span class="c">// 3) water is no longer possible</span>',
    '<span class="k">if</span> (DESIGN.refreezeSec) refreeze(after DESIGN.refreezeSec); <span class="c">// 4) optional: the lake forgets</span>',
    '<span class="c">// your past steps decide which future steps exist</span>'
  ],
  tasks: [
    'Set <b>crackSec</b> to 6, then to 1. Which routes become possible, and which impossible?',
    'Turn <b>warn</b> off: the ice breaks with no cracks and no countdown. How does that change the way you step?',
    'Give the lake a short memory: <b>refreezeSec</b> 5. Is it still the same game?'
  ],
  question: 'If every step you take removes a future step, how do you plan a path?',
  overlay: { title: 'Frozen Lake', text: 'You are a penguin on a frozen lake. Collect every fish. But the ice remembers you: every tile you step on cracks and breaks a few seconds later, and the path behind you turns to water.', cta: 'CLICK TO START' },
  view: { at: [0, 0.25, 0.25], zoom: 2.3, pitch: 0.95 },

  make(ctx) {
    const { THREE, D, group } = ctx;
    const T = 0.46, ZC = -0.2, TOP = 0.16;                  // tile spacing, grid centre (z), tile top height
    let S = 0;                                              // grid size of the current game
    let tiles = [], fishes = [], water = null, pen = null;
    let lives = 0, caught = 0, steps = 0, startT = 0, endT = 0, running = false, finished = false, needReset = false;
    let iceMat = null, splashes = [];
    let now = 0;                                            // the game clock, set every frame
    const queue = [];

    // ---------- crack textures (three stages), drawn once ----------
    const crackMats = [1, 2, 3].map((stage) => {
      const cv = document.createElement('canvas'); cv.width = cv.height = 128; const x = cv.getContext('2d');
      let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      x.strokeStyle = '#1d1c1a'; x.lineCap = 'round';
      for (let k = 0; k < stage * 3; k++) {
        x.lineWidth = 2 + stage; x.beginPath();
        let px = 64, py = 64; x.moveTo(px, py);
        const a = rnd() * Math.PI * 2;
        for (let j = 0; j < 5; j++) { px += Math.cos(a + (rnd() - 0.5) * 1.2) * 14; py += Math.sin(a + (rnd() - 0.5) * 1.2) * 14; x.lineTo(px, py); }
        x.stroke();
      }
      const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
      const m = ctx.flat('#ffffff', { map: tex, transparent: true, depthWrite: false }); return m;
    });

    const tileAt = (c, r) => tiles.find((t) => t.c === c && t.r === r);
    const posOf = (c, r) => ({ x: (c - (S - 1) / 2) * T, z: ZC + (r - (S - 1) / 2) * T });   // row S = the wooden dock

    // ---------- building a new game ----------
    function build() {
      [...tiles.map((t) => t.mesh), ...tiles.map((t) => t.crack), ...fishes.map((f) => f.root), water].forEach((o) => o && group.remove(o));
      S = D.size; tiles = []; fishes = [];
      const w = S * T + 0.3;
      water = ctx.mesh(new THREE.BoxGeometry(w, 0.06, (S + 1) * T + 0.3), ctx.toon('cool'), 0, 0.07, ZC + T / 2, false);
      group.add(water);
      iceMat = ctx.toon(D.iceColor);
      const geo = new THREE.BoxGeometry(T * 0.92, 0.08, T * 0.92), cg = new THREE.PlaneGeometry(T * 0.86, T * 0.86);
      for (let r = 0; r <= S; r++) for (let c = 0; c < S; c++) {
        const dock = r === S, p = posOf(c, r);
        const mesh = ctx.mesh(geo, dock ? ctx.toon('wood') : iceMat, p.x, TOP - 0.04, p.z);
        const crack = ctx.mesh(cg, crackMats[0], p.x, TOP + 0.003, p.z, false);
        crack.rotation.x = -Math.PI / 2; crack.visible = false; crack.userData.noOutline = true;
        group.add(mesh, crack);
        tiles.push({ c, r, dock, mesh, crack, x: p.x, z: p.z, clock: -1, water: false, wetAt: 0 });
      }
      // fish on random ice tiles, not right next to the start
      const free = tiles.filter((t) => !t.dock && t.r < S - 1);
      for (let i = 0; i < Math.min(D.fish, free.length); i++) {
        const t = free.splice(Math.floor(Math.random() * free.length), 1)[0];
        const root = new THREE.Group();
        const body = ctx.mesh(new THREE.SphereGeometry(0.07, 16, 10), ctx.toon('hot')); body.scale.set(1.5, 0.8, 0.6);
        const tail = ctx.mesh(new THREE.ConeGeometry(0.05, 0.08, 4), ctx.toon('hot'), -0.12, 0, 0); tail.rotation.z = Math.PI / 2;
        const eye = ctx.mesh(new THREE.SphereGeometry(0.012, 8, 6), ctx.toon('ink'), 0.07, 0.02, 0.035, false);
        root.add(body, tail, eye); root.position.set(t.x, TOP + 0.1, t.z); root.rotation.y = Math.random() * 6;
        group.add(root);
        fishes.push({ tile: t, root, caught: false, phase: Math.random() * 6 });
      }
      ctx.patch(group);
    }

    function spawnPenguin() {
      if (!pen) { const o = ctx.char('char.penguin'); group.add(o.root); ctx.patch(o.root); pen = { o }; }
      const c = Math.floor(S / 2), p = posOf(c, S);
      Object.assign(pen, { c, r: S, x: p.x, z: p.z, from: null, hopT: 1, face: Math.PI, falling: -1, y: TOP, nope: -9 });
      pen.o.root.visible = true;
      queue.length = 0;
    }

    function reset() {
      build(); spawnPenguin();
      lives = D.lives; caught = 0; steps = 0; running = false; finished = false;
    }

    // ---------- POSSIBILITY: where can the penguin go? ----------
    function canStand(t) { return !!t && (t.dock || !t.water); }

    function hop(dc, dr) {
      if (!pen || pen.falling >= 0 || finished) return;
      if (pen.hopT < 1) { if (queue.length < 2) queue.push([dc, dr]); return; }
      const to = tileAt(pen.c + dc, pen.r + dr);
      pen.face = Math.atan2(dc, dr);
      if (!canStand(to)) { pen.nope = now; sound('nope'); ctx.flash(1); return; }   // water or the edge: not possible
      pen.from = { x: pen.x, z: pen.z }; pen.c = to.c; pen.r = to.r; pen.hopT = 0; steps++;
      sound('hop'); ctx.flash(0);
    }

    function landed() {
      const t = tileAt(pen.c, pen.r);
      if (t && !t.dock && t.water) { fall(now); return; }         // the tile broke while you were in the air
      if (t && !t.dock && t.clock < 0 && !t.water) { t.clock = now; }       // TEMPORALITY: your step starts this tile's clock
      for (const f of fishes) if (!f.caught && f.tile === t) {
        f.caught = true; caught++; f.root.visible = false; sound('fish'); ctx.bump('hFish'); ctx.flash(3);
      }
      if (running && caught === fishes.length) win();
      if (queue.length) { const [dc, dr] = queue.shift(); hop(dc, dr); }
    }

    // ---------- TEMPORALITY: every stepped tile counts down, then breaks ----------
    function updateIce(t, dt) {
      for (const tile of tiles) {
        if (tile.dock) continue;
        if (tile.water) {
          if (D.refreezeSec > 0 && t - tile.wetAt > D.refreezeSec) {       // the lake forgets: water freezes again
            tile.water = false; tile.clock = -1; tile.mesh.visible = true; tile.mesh.scale.set(1, 1, 1);
            tile.mesh.position.set(tile.x, TOP - 0.04, tile.z);
          } else if (tile.mesh.visible) {                                    // sinking animation
            const k = Math.min(1, (t - tile.wetAt) / 0.4);
            tile.mesh.position.y = TOP - 0.04 - k * 0.12; tile.mesh.scale.setScalar(1 - k * 0.5);
            if (k >= 1) tile.mesh.visible = false;
          }
          tile.crack.visible = false;
          continue;
        }
        if (tile.clock < 0) { tile.crack.visible = false; continue; }
        const age = t - tile.clock;
        if (!D.breaking) { tile.crack.visible = false; continue; }
        const p = age / D.crackSec;
        tile.crack.visible = D.warn && p > 0.05;
        if (tile.crack.visible) tile.crack.material = crackMats[Math.min(2, Math.floor(p * 3))];
        const shake = D.warn && p > 0.7 ? Math.sin(t * 70) * 0.012 * (p - 0.7) / 0.3 : 0;
        tile.mesh.position.set(tile.x + shake, TOP - 0.04, tile.z);
        tile.crack.position.x = tile.x + shake;
        if (age >= D.crackSec) breakTile(tile, t);
      }
    }

    function breakTile(tile, t) {
      tile.water = true; tile.wetAt = t; tile.crack.visible = false;
      splashes.push({ x: tile.x, z: tile.z, t0: t });
      sound('crack');
      // was the penguin standing on it (and not already hopping away)?
      if (pen.falling < 0 && pen.c === tile.c && pen.r === tile.r && pen.hopT >= 0.5) fall(t);
    }

    function fall(t) {
      pen.falling = t; queue.length = 0; lives--; sound('splash'); ctx.bump('hLives');
      ctx.schedule(() => {
        if (lives <= 0) { lose(); return; }
        spawnPenguin();
      }, 1100);
    }

    // splash rings on the water
    const ringGeo = new THREE.RingGeometry(0.85, 1, 32);
    function drawSplashes(t) {
      splashes = splashes.filter((s) => {
        const k = (t - s.t0) / 0.7;
        if (!s.mesh) { s.mesh = ctx.mesh(ringGeo, ctx.flat('paper', { transparent: true, depthWrite: false }), s.x, 0.105, s.z, false); s.mesh.rotation.x = -Math.PI / 2; s.mesh.userData.noOutline = true; group.add(s.mesh); }
        if (k >= 1) { group.remove(s.mesh); return false; }
        s.mesh.scale.setScalar(0.08 + k * 0.28); s.mesh.material.opacity = 1 - k;
        return true;
      });
    }

    // can the penguin still reach the remaining fish? (only on ice that has not broken yet)
    function reachable() {
      const left = fishes.filter((f) => !f.caught);
      if (!left.length || D.refreezeSec > 0 || !D.breaking) return true;
      const start = tileAt(pen.c, pen.r), seen = new Set([start]), st = [start];
      while (st.length) {
        const a = st.pop();
        for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const b = tileAt(a.c + dc, a.r + dr);
          if (b && !seen.has(b) && (b.dock || (!b.water && b.clock < 0))) { seen.add(b); st.push(b); }
        }
      }
      return left.some((f) => seen.has(f.tile));
    }

    function win() {
      finished = true; running = false; endT = now; sound('win');
      const lost = tiles.filter((t) => t.water).length;
      ctx.overlay({ kick: 'ALL FISH', title: 'Full and dry.', text: 'Every fish in ' + Math.round(endT - startT) + ' seconds and ' + steps + ' hops. Behind you, ' + lost + ' tiles of ice are now water: your path decided what was still possible. Try crackSec 1, or warn off.', cta: 'PLAY AGAIN' });
    }
    function lose() {
      finished = true; running = false; endT = now; sound('lose');
      pen.o.root.visible = false;
      ctx.overlay({ kick: 'SPLASH', title: 'The lake took you.', text: caught + ' of ' + fishes.length + ' fish. Every tile you step on starts a clock; plan the route before the ice behind you is gone.', cta: 'TRY AGAIN' });
    }

    // ---------- sound ----------
    let noiseBuf = null;
    function sound(kind) {
      const A = ctx.audio(); if (!A) return;
      const t = A.currentTime, out = A.createGain(); out.gain.value = 0.5; out.connect(A.destination);
      const tone = (type, f0, f1, at, dur, vol) => {
        const o = A.createOscillator(), g = A.createGain(); o.type = type;
        o.frequency.setValueAtTime(f0, t + at); o.frequency.exponentialRampToValueAtTime(f1, t + at + dur);
        g.gain.setValueAtTime(0, t + at); g.gain.linearRampToValueAtTime(vol, t + at + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + at + dur);
        o.connect(g).connect(out); o.start(t + at); o.stop(t + at + dur + 0.05);
      };
      const noise = (at, dur, vol, freq, type = 'bandpass') => {
        if (!noiseBuf) { noiseBuf = A.createBuffer(1, A.sampleRate, A.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
        const s = A.createBufferSource(), f = A.createBiquadFilter(), g = A.createGain(); s.buffer = noiseBuf;
        f.type = type; f.frequency.value = freq; f.Q.value = 0.8;
        g.gain.setValueAtTime(vol, t + at); g.gain.exponentialRampToValueAtTime(0.0001, t + at + dur);
        s.connect(f).connect(g).connect(out); s.start(t + at); s.stop(t + at + dur + 0.05);
      };
      if (kind === 'hop') tone('sine', 520, 780, 0, 0.09, 0.1);
      if (kind === 'nope') { tone('square', 160, 140, 0, 0.1, 0.06); tone('square', 160, 140, 0.12, 0.1, 0.06); }
      if (kind === 'crack') { noise(0, 0.08, 0.4, 3000, 'highpass'); tone('sine', 120, 60, 0.03, 0.25, 0.25); noise(0.05, 0.4, 0.25, 600); }
      if (kind === 'splash') { noise(0, 0.6, 0.5, 900); tone('sine', 400, 90, 0, 0.5, 0.2); }
      if (kind === 'fish') { tone('triangle', 880, 880, 0, 0.18, 0.12); tone('triangle', 1318.5, 1318.5, 0.08, 0.3, 0.1); }
      if (kind === 'win') [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone('triangle', f, f, i * 0.12, 0.5, 0.15));
      if (kind === 'lose') [392, 330, 262].forEach((f, i) => tone('triangle', f, f, i * 0.18, 0.5, 0.13));
    }

    // ---------- drawing the penguin, fish and countdown ----------
    function pose(t, dt) {
      let n = 0;
      if (pen.hopT < 1) {                                                  // hop between tiles
        pen.hopT = Math.min(1, pen.hopT + dt / D.hopTime);
        const to = posOf(pen.c, pen.r), k = pen.hopT;
        pen.x = pen.from.x + (to.x - pen.from.x) * k; pen.z = pen.from.z + (to.z - pen.from.z) * k;
        pen.y = TOP + Math.sin(Math.PI * k) * 0.14;
        if (pen.hopT >= 1) { pen.y = TOP; landed(); }
      }
      let y = pen.y;
      if (pen.falling >= 0) y = TOP - Math.min(1, (t - pen.falling) / 0.6) * 0.6;    // sinking
      if (pen.hopT >= 1 && pen.falling < 0) {                              // standing still: slowly turn to face you
        pen.still = (pen.still || 0) + dt;
        if (pen.still > 0.35) { const d = 0 - pen.face; pen.face += Math.atan2(Math.sin(d), Math.cos(d)) * Math.min(1, dt * 5); }
      } else pen.still = 0;
      const nope = t - pen.nope < 0.3 ? Math.sin((t - pen.nope) * 60) * 0.25 : 0;    // shakes its head at water
      ctx.animChar(pen.o, t);
      pen.o.root.position.set(pen.x, y, pen.z);
      pen.o.root.rotation.y = pen.face + nope;
      pen.o.root.scale.setScalar(D.penguinSize);

      fishes.forEach((f) => { if (!f.caught) { f.root.position.y = TOP + 0.08 + Math.sin(t * 3 + f.phase) * 0.03; f.root.rotation.y += dt * 1.2; } });

      const here = tileAt(pen.c, pen.r);                                    // countdown on the tile under you
      if (D.warn && D.breaking && here && !here.dock && here.clock >= 0 && !here.water && pen.falling < 0) {
        const left = Math.max(0, D.crackSec - (t - here.clock));
        ctx.tag(n++, left.toFixed(1) + 's', new THREE.Vector3(pen.x, TOP + D.penguinSize * 1.9, pen.z), left < 1, 0);
      }
      if (t - pen.nope < 0.6) ctx.tag(n++, 'can’t go there', new THREE.Vector3(pen.x, TOP + D.penguinSize * 2.4, pen.z), true, 0);
      ctx.tagsFrom(n);
    }

    let stuck = false;
    return {
      start() { if (!tiles.length || needReset) reset(); needReset = false; },
      stop() { needReset = true; queue.length = 0; },
      begin() { if (finished || !tiles.length) reset(); running = true; startT = ctx.now(); },
      pointer(type, e) {
        if (type !== 'down' || !pen) return;
        const p = ctx.toLocal(e, TOP); if (!p) return;
        let best = null, bd = 1e9;
        for (const t of tiles) { const d = Math.hypot(t.x - p.x, t.z - p.z); if (d < bd) { bd = d; best = t; } }
        if (!best || bd > T) return;
        const dc = best.c - pen.c, dr = best.r - pen.r;
        if (!dc && !dr) return;
        if (Math.abs(dc) >= Math.abs(dr)) hop(Math.sign(dc), 0); else hop(0, Math.sign(dr));   // one hop towards the clicked tile
      },
      key(e, down) {
        const k = e.key.toLowerCase();
        const dirs = { arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0], arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1] };
        if (dirs[k]) { e.preventDefault(); if (down) hop(...dirs[k]); return true; }
        if (k === 't') { if (down && !e.repeat) { D.breaking = !D.breaking; ctx.flash(1); ctx.renderTexts(); } return true; }
        return false;
      },
      frame(t, dt) {
        now = t;
        if (!pen) return;
        if (running) updateIce(t, dt);
        drawSplashes(t);
        pose(t, dt);
        stuck = running && !reachable();
      },
      hud: () => ({
        hFish: caught + '/' + fishes.length,
        hIce: Math.round(100 * tiles.filter((t) => !t.dock && !t.water).length / Math.max(1, tiles.filter((t) => !t.dock).length)) + '%',
        hLives: '●'.repeat(Math.max(0, lives)) + '○'.repeat(Math.max(0, D.lives - lives)),
        hTime: running ? Math.floor(ctx.now() - startT) + 's' : finished ? Math.round(endT - startT) + 's' : '–'
      }),
      rule: () => D.breaking ? 'stepped ice breaks after ' + D.crackSec + ' s' : 'ice never breaks',
      caption: () => {
        if (!running && !finished) return 'Click to start. Then hop with the arrow keys or by clicking a tile.';
        if (!D.breaking) return 'Breaking is off: every path stays possible.';
        if (stuck) return 'No ice path leads to the last fish. Press RESTART.';
        return 'Every step starts a clock. The path behind you will be water.';
      },
      status: () => 'fish: ' + caught + '/' + fishes.length + ' · water tiles: ' + tiles.filter((t) => t.water).length + ' · lives: ' + lives,
      knob(key) {
        if (key === 'iceColor') { iceMat = ctx.toon(D.iceColor); tiles.forEach((t) => { if (!t.dock) t.mesh.material = iceMat; }); ctx.patch(group); }
      },
      // narrow screens (phones): zoom out so the whole place fits
      view() { const a = innerWidth / Math.max(1, innerHeight); return a < 1 ? { zoom: Math.max(1.1, 2.25 * a * 1.55) } : {}; },
      demo() { ctx.playing(true); },
      inspect: () => ({ tiles, fishes, pen })   // read-only peek for testing in the browser console
    };
  }
};
