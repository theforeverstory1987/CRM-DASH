// Country flags drawn inline (30×20), so they show without any outside image service.
// Simplified: at 20px wide the fine detail isn't visible anyway.
const FLAG_W = 30;
const FLAG_H = 20;

function flagRect(fill, x = 0, y = 0, w = FLAG_W, h = FLAG_H) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
}

// Three equal stripes, top to bottom or left to right.
function hStripes(...colors) {
  const h = FLAG_H / colors.length;
  return colors.map((c, i) => flagRect(c, 0, i * h, FLAG_W, h)).join('');
}

function vStripes(...colors) {
  const w = FLAG_W / colors.length;
  return colors.map((c, i) => flagRect(c, i * w, 0, w, FLAG_H)).join('');
}

// Five-point star; `rot` is the direction of the first point, in degrees.
function flagStar(cx, cy, r, fill, rot = -90) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 ? r * 0.382 : r;
    const a = ((rot + i * 36) * Math.PI) / 180;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}"/>`;
}

// Nordic cross, off-centre towards the hoist.
function nordic(field, cross, border = '') {
  const lines = 'M11 0v20M0 10h30';
  return flagRect(field)
    + (border ? `<path d="${lines}" stroke="${border}" stroke-width="4.4"/>` : '')
    + `<path d="${lines}" stroke="${cross}" stroke-width="${border ? 2.2 : 3.2}"/>`;
}

const UNION_JACK = flagRect('#012169')
  + '<path d="M0 0L30 20M30 0L0 20" stroke="#fff" stroke-width="4"/>'
  + '<path d="M0 0L30 20M30 0L0 20" stroke="#c8102e" stroke-width="1.4"/>'
  + '<path d="M15 0v20M0 10h30" stroke="#fff" stroke-width="6"/>'
  + '<path d="M15 0v20M0 10h30" stroke="#c8102e" stroke-width="3.4"/>';

function usFlag() {
  let out = '';
  for (let i = 0; i < 13; i++) out += flagRect(i % 2 ? '#fff' : '#b22234', 0, (i * FLAG_H) / 13, FLAG_W, FLAG_H / 13 + 0.05);
  out += flagRect('#3c3b6e', 0, 0, 12, (FLAG_H * 7) / 13);
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 6; col++) out += `<circle cx="${1.1 + col * 1.96}" cy="${1.1 + row * 2.05}" r="0.38" fill="#fff"/>`;
  }
  return out;
}

function greekFlag() {
  const s = FLAG_H / 9;
  let out = flagRect('#0d5eaf');
  for (let i = 1; i < 9; i += 2) out += flagRect('#fff', 0, i * s, FLAG_W, s);
  out += flagRect('#0d5eaf', 0, 0, 5 * s, 5 * s);
  out += flagRect('#fff', 2 * s, 0, s, 5 * s) + flagRect('#fff', 0, 2 * s, 5 * s, s);
  return out;
}

function qatarFlag() {
  const teeth = 9;
  const step = FLAG_H / teeth;
  let d = 'M0 0H7';
  for (let i = 0; i < teeth; i++) d += `L10 ${(i + 0.5) * step}L7 ${(i + 1) * step}`;
  d += 'H0Z';
  return flagRect('#8a1538') + `<path d="${d}" fill="#fff"/>`;
}

function koreaFlag() {
  const bars = (x, y, angle) => `<g transform="translate(${x} ${y}) rotate(${angle})" fill="#000">`
    + '<rect x="-2.2" y="-1.7" width="4.4" height="0.8"/><rect x="-2.2" y="-0.4" width="4.4" height="0.8"/><rect x="-2.2" y="0.9" width="4.4" height="0.8"/></g>';
  return flagRect('#fff')
    + '<g transform="rotate(33.7 15 10)"><circle cx="15" cy="10" r="5" fill="#0047a0"/>'
    + '<path d="M10 10a5 5 0 0 1 10 0a2.5 2.5 0 0 1-5 0a2.5 2.5 0 0 0-5 0z" fill="#cd2e3a"/></g>'
    + bars(6, 4.6, 33.7) + bars(24, 15.4, 33.7) + bars(24, 4.6, -33.7) + bars(6, 15.4, -33.7);
}

const FLAG_SVGS = {
  AE: flagRect('#fff') + flagRect('#00732f', 0, 0, 30, 6.67) + flagRect('#000', 0, 13.33, 30, 6.67) + flagRect('#ff0000', 0, 0, 7.5, 20),
  AT: hStripes('#c8102e', '#fff', '#c8102e'),
  AU: flagRect('#012169') + `<svg width="15" height="10" viewBox="0 0 30 20">${UNION_JACK}</svg>`
    + flagStar(7.5, 15, 2.4, '#fff') + flagStar(22.5, 16.8, 1.2, '#fff') + flagStar(19.2, 9, 1.2, '#fff')
    + flagStar(22.5, 3.6, 1.2, '#fff') + flagStar(25.8, 8, 1.2, '#fff'),
  BE: vStripes('#000', '#fdda24', '#ef3340'),
  BR: flagRect('#009c3b') + '<path d="M15 2.5L27.5 10L15 17.5L2.5 10Z" fill="#ffdf00"/>'
    + '<circle cx="15" cy="10" r="4.2" fill="#002776"/><path d="M11 9.3q4-1.3 8 .9" stroke="#fff" stroke-width=".8" fill="none"/>',
  CA: flagRect('#fff') + flagRect('#d80621', 0, 0, 7.5, 20) + flagRect('#d80621', 22.5, 0, 7.5, 20)
    + '<path d="M15 4L16.2 6.4L17.6 5.8L17.2 8.6L19.4 7.2L19 8.6L20.6 8.8L19.8 10.4L20.4 11L17.4 13L17.8 14.2L15.4 13.8V16H14.6V13.8L12.2 14.2L12.6 13L9.6 11L10.2 10.4L9.4 8.8L11 8.6L10.6 7.2L12.8 8.6L12.4 5.8L13.8 6.4Z" fill="#d80621"/>',
  CH: flagRect('#da291c') + '<path d="M13 4h4v4h4v4h-4v4h-4v-4h-4v-4h4z" fill="#fff"/>',
  CN: flagRect('#de2910') + flagStar(5, 5, 3, '#ffde00')
    + flagStar(10, 2, 1, '#ffde00', -60) + flagStar(12, 4, 1, '#ffde00', -80) + flagStar(12, 7, 1, '#ffde00', -100) + flagStar(10, 9, 1, '#ffde00', -120),
  CY: flagRect('#fff') + '<path d="M8 9Q11 6.5 15 7.2L22.5 5.2Q21 8 18.5 9.6Q13 11.6 8 9Z" fill="#d57800"/>'
    + '<path d="M11 13.2q4 2.2 8 0" stroke="#4e5b31" stroke-width="1.2" fill="none"/>',
  DE: hStripes('#000', '#dd0000', '#ffce00'),
  DK: nordic('#c8102e', '#fff'),
  ES: flagRect('#aa151b') + flagRect('#f1bf00', 0, 5, 30, 10) + '<rect x="7" y="7.5" width="3" height="5" rx=".8" fill="#aa151b"/>',
  FR: vStripes('#002395', '#fff', '#ed2939'),
  GB: UNION_JACK,
  GR: greekFlag(),
  HK: flagRect('#de2910') + [0, 1, 2, 3, 4].map(i => `<ellipse cx="15" cy="6.6" rx="1.7" ry="3.1" fill="#fff" transform="rotate(${i * 72} 15 10)"/>`).join(''),
  IE: vStripes('#169b62', '#fff', '#ff883e'),
  IL: flagRect('#fff') + flagRect('#0038b8', 0, 2, 30, 3) + flagRect('#0038b8', 0, 15, 30, 3)
    + '<path d="M15 6.8L17.8 11.6H12.2ZM15 13.2L17.8 8.4H12.2Z" fill="none" stroke="#0038b8" stroke-width=".8"/>',
  IN: hStripes('#ff9933', '#fff', '#138808')
    + '<circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" stroke-width=".6"/><circle cx="15" cy="10" r=".6" fill="#000080"/>',
  IT: vStripes('#009246', '#fff', '#ce2b37'),
  JP: flagRect('#fff') + '<circle cx="15" cy="10" r="6" fill="#bc002d"/>',
  KR: koreaFlag(),
  MC: flagRect('#fff') + flagRect('#ce1126', 0, 0, 30, 10),
  MX: vStripes('#006847', '#fff', '#ce1126')
    + '<ellipse cx="15" cy="9.6" rx="2.1" ry="2.4" fill="#8c5a2b"/><path d="M12.8 12.2q2.2 1.6 4.4 0" stroke="#006847" stroke-width=".8" fill="none"/>',
  NL: hStripes('#ae1c28', '#fff', '#21468b'),
  NO: nordic('#ba0c2f', '#00205b', '#fff'),
  PT: flagRect('#046a38', 0, 0, 12, 20) + flagRect('#da291c', 12, 0, 18, 20)
    + '<circle cx="12" cy="10" r="3.6" fill="#ffe900"/><path d="M10.4 8.2h3.2v3.2a1.6 1.6 0 0 1-3.2 0z" fill="#fff" stroke="#da291c" stroke-width=".6"/>',
  QA: qatarFlag(),
  RU: hStripes('#fff', '#0039a6', '#d52b1e'),
  SA: flagRect('#006c35') + '<path d="M9 8.5q1.5-1.6 3 0t3 0t3 0t3 0" stroke="#fff" stroke-width=".9" fill="none"/>'
    + '<path d="M9 13h12M20.2 12v2" stroke="#fff" stroke-width=".8"/>',
  SE: nordic('#006aa7', '#fecc02'),
  SG: flagRect('#fff') + flagRect('#ef3340', 0, 0, 30, 10)
    + '<circle cx="7" cy="5" r="3.4" fill="#fff"/><circle cx="8.3" cy="5" r="3.1" fill="#ef3340"/>'
    + [0, 1, 2, 3, 4].map(i => {
      const a = ((-90 + i * 72) * Math.PI) / 180;
      return `<circle cx="${(10.6 + 1.5 * Math.cos(a)).toFixed(2)}" cy="${(5 + 1.5 * Math.sin(a)).toFixed(2)}" r=".45" fill="#fff"/>`;
    }).join(''),
  TH: flagRect('#a51931') + flagRect('#f4f5f8', 0, 3.33, 30, 13.34) + flagRect('#2d2a4a', 0, 6.67, 30, 6.66),
  TR: flagRect('#e30a17') + '<circle cx="11" cy="10" r="5" fill="#fff"/><circle cx="12.3" cy="10" r="4" fill="#e30a17"/>' + flagStar(17.2, 10, 2.3, '#fff', 180),
  US: usFlag(),
  ZA: flagRect('#e03c31', 0, 0, 30, 10) + flagRect('#001489', 0, 10, 30, 10)
    + '<path d="M0 0L12 10L0 20M12 10H30" fill="none" stroke="#fff" stroke-width="6.6"/>'
    + '<path d="M0 0L12 10L0 20M12 10H30" fill="none" stroke="#007749" stroke-width="4"/>'
    + '<path d="M0 2.6L8.9 10L0 17.4Z" fill="#ffb81c"/><path d="M0 4.4L6.8 10L0 15.6Z" fill="#000"/>',
};
