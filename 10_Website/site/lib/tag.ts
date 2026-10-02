/**
 * One source of truth for the tag, in millimetres, taken from the design sheets.
 * 2D coordinates: x runs -17.5..17.5, y runs 0 (top of the arch) .. 70 (base).
 * The SVG drawings and the 3D model's face are both built from these numbers.
 */
export const TAG = {
  width: 35,
  height: 70,
  depth: 5,
  /** Radius of the two bottom corners. The top is a full semicircle. */
  foot: 4.5,
  hole: { y: 5.4, r: 2.25, boss: 3.9 },
  /** Inset of the gold rim line from the outer edge. */
  rim: 1.3,
  /** Inset of the pierced field from the outer edge. */
  field: 1.9,
  /** The arch panel: pointed top, straight sides, hexagonal point below. */
  panel: { w: 14, apex: 16.8, top: 28.5, sideEnd: 58.5, point: 66.6 },
  /** Above this line the lattice sits over a light well; below it, the dark well. */
  split: 42,
  /** The NFC sticker: 25 mm round, sealed behind "TAP HERE". */
  chip: { y: 52, r: 12.5 },
};

export type Pt = [number, number];

const R = TAG.width / 2;

function arc(cx: number, cy: number, r: number, a0: number, a1: number, n: number): Pt[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
}

/** The stadium outline, offset inward by `inset`, as a closed point list (clockwise on screen). */
export function outlinePoints(inset = 0): Pt[] {
  const r = R - inset;
  const f = TAG.foot - inset;
  const H = TAG.height;
  return [
    ...arc(0, R, r, Math.PI, Math.PI * 2, 48),
    ...arc(R - TAG.foot, H - TAG.foot, f, 0, Math.PI / 2, 10),
    ...arc(-R + TAG.foot, H - TAG.foot, f, Math.PI / 2, Math.PI, 10),
  ];
}

function cubic(p0: Pt, p1: Pt, p2: Pt, p3: Pt, n: number): Pt[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const u = 1 - t;
    return [
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ];
  });
}

/** The arch panel, offset inward by `inset`. */
export function panelPoints(inset = 0): Pt[] {
  const { w: pw, apex, top, sideEnd, point } = TAG.panel;
  const w = pw - inset;
  const a = apex + inset * 1.4;
  const t = top + inset * 0.3;
  const e = sideEnd - inset * 0.2;
  const p = point - inset * 1.6;
  const left = cubic([-w, t], [-w, t - 5.5], [-w * 0.45, a + 2.8], [0, a], 24);
  const right = cubic([0, a], [w * 0.45, a + 2.8], [w, t - 5.5], [w, t], 24);
  return [...left, ...right.slice(1), [w, e], [0, p], [-w, e]];
}

export function pathOf(pts: Pt[], close = true) {
  return pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(3)} ${p[1].toFixed(3)}`).join("") + (close ? "Z" : "");
}

export function circlePath(cx: number, cy: number, r: number) {
  const f = (n: number) => n.toFixed(3);
  return `M${f(cx + r)} ${f(cy)}A${f(r)} ${f(r)} 0 1 0 ${f(cx - r)} ${f(cy)}A${f(r)} ${f(r)} 0 1 0 ${f(cx + r)} ${f(cy)}Z`;
}

export const outlinePath = () => pathOf(outlinePoints());

/**
 * The region the lattice is pierced through: the field, minus the panel, minus the
 * solid boss round the hanging hole. One path, filled even-odd.
 */
export function fieldPath() {
  return pathOf(outlinePoints(TAG.field)) + pathOf(panelPoints(-0.5)) + circlePath(0, TAG.hole.y, TAG.hole.boss);
}

function star(cx: number, cy: number, r: number, inner: number, turn = 0): Pt[] {
  return Array.from({ length: 16 }, (_, k) => {
    const a = (k * Math.PI) / 8 + turn;
    const rr = k % 2 ? r * inner : r;
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
  });
}

/**
 * Star-and-cross strapwork: eight-point stars on a square grid, tips touching,
 * each with an octagon ring inside it, and a small cross star where four meet.
 * Returned as one stroke path; the caller clips it to fieldPath().
 */
export function latticePath(s = 7.2) {
  const parts: string[] = [];
  const keep = (y: number) => y < TAG.panel.top + 2 || y > TAG.panel.sideEnd - 4;
  for (let gy = -s; gy <= TAG.height + s; gy += s) {
    for (let gx = -Math.ceil(R / s) * s; gx <= R + s; gx += s) {
      const cy = gy + 1.2;
      if (!keep(cy) && !keep(cy - s / 2) && !keep(cy + s / 2)) continue;
      parts.push(pathOf(star(gx, cy, s / 2, 0.765, 0)));
      parts.push(pathOf(star(gx, cy, s * 0.24, 0.84, Math.PI / 8)));
      parts.push(pathOf(star(gx + s / 2, cy + s / 2, s * 0.2, 0.55, Math.PI / 4)));
    }
  }
  return parts.join("");
}

/** The interlaced eight-point rosette: two squares, an inner octagon and a round centre. */
export function rosette(cx: number, cy: number, r: number) {
  const square = (turn: number): Pt[] =>
    Array.from({ length: 4 }, (_, k) => {
      const a = turn + (k * Math.PI) / 2;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    });
  const oct: Pt[] = Array.from({ length: 8 }, (_, k) => {
    const a = Math.PI / 8 + (k * Math.PI) / 4;
    return [cx + Math.cos(a) * r * 0.5, cy + Math.sin(a) * r * 0.5];
  });
  return {
    lines: pathOf(square(0)) + pathOf(square(Math.PI / 4)) + pathOf(oct),
    centre: { cx, cy, r: r * 0.3 },
    stroke: r * 0.12,
  };
}

/** NFC waves for the back face: three arcs either side of a dot. */
export function wavesPath(cx: number, cy: number, s: number) {
  const parts: string[] = [];
  const f = (n: number) => n.toFixed(3);
  for (const k of [1, 2, 3]) {
    const r = s * 0.28 * k;
    const a = (Math.PI / 180) * 42;
    for (const side of [-1, 1]) {
      const x0 = cx + side * Math.cos(a) * r;
      const y0 = cy - Math.sin(a) * r;
      const y1 = cy + Math.sin(a) * r;
      parts.push(`M${f(x0)} ${f(y0)}A${f(r)} ${f(r)} 0 0 ${side > 0 ? 1 : 0} ${f(x0)} ${f(y1)}`);
    }
  }
  return parts.join("");
}

/** Font size that keeps a line of text inside `width` mm. `em` is the average advance per character. */
export function fitSize(text: string, max: number, width: number, em: number) {
  return Math.min(max, width / Math.max(1, text.length * em));
}
