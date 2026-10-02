import type { Colourway } from "@/lib/site";
import { TAG, circlePath, fieldPath, fitSize, latticePath, outlinePath, outlinePoints, panelPoints, pathOf, rosette, wavesPath } from "@/lib/tag";

export type TagFace = { tag: string; arabic?: string };

const KAMIL: TagFace = { tag: "DUA-E-KAMIL", arabic: "دعاء كامل" };

type Props = {
  colourway: Colourway;
  face?: TagFace;
  side?: "front" | "back";
  className?: string;
  title?: string;
  /** Off for the 3D model, which sets the lettering itself so the browser shapes the Arabic. */
  text?: boolean;
};

export type TagText = {
  text: string;
  y: number;
  size: number;
  fill: string;
  font: "display" | "arabic";
  spacing: number;
};

/** Every line of lettering on a face, in tag millimetres. Shared by the drawing and the 3D model. */
export function tagTexts(c: Colourway, face: TagFace, side: "front" | "back"): TagText[] {
  if (side === "back") {
    const l = (text: string, y: number, size: number): TagText => ({ text, y, size, fill: c.gold, font: "display", spacing: 0.12 });
    return [l("TAP HERE", 37.4, 2.3), l("WITH PHONE", 40.7, 2.3), l("BEFORE SLEEP", 50.2, 2.15), l("REMEMBER ALLAH", 53.4, 2.15)];
  }
  const out: TagText[] = [];
  if (face.arabic) {
    out.push({ text: face.arabic, y: 41.4, size: fitSize(face.arabic, 6.6, 25, 0.37), fill: c.ink, font: "arabic", spacing: 0 });
  }
  out.push({
    text: face.tag,
    y: face.arabic ? 46.1 : 43.2,
    size: fitSize(face.tag, face.arabic ? 2.5 : 3.1, 24, 0.78),
    fill: c.gold,
    font: "display",
    spacing: 0.08,
  });
  out.push({ text: "TAP HERE", y: 54.4, size: 2.05, fill: c.gold, font: "display", spacing: 0.12 });
  return out;
}

const DISPLAY = { fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontWeight: 600 } as const;
const ARABIC = { fontFamily: "var(--font-amiri), 'Amiri', serif", fontWeight: 700 } as const;

// Computed once: the geometry never changes, only the colours.
const OUTLINE = outlinePath();
const BODY = OUTLINE + circlePath(0, TAG.hole.y, TAG.hole.r);
const RIM = pathOf(outlinePoints(TAG.rim));
const FIELD = fieldPath();
const LATTICE = latticePath();
const PANEL = pathOf(panelPoints());
const PANEL_IN = pathOf(panelPoints(0.7));

/** Elevation of the tag, front or back, drawn from the shared geometry. */
export function TagDrawing({ colourway: c, face = KAMIL, side = "front", className, title, text = true }: Props) {
  const uid = `${c.id}-${side}-${face.tag.replace(/[^A-Z]/g, "")}`;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-18.5 -1 37 72" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <defs>
        <clipPath id={`field-${uid}`}>
          <path d={FIELD} clipRule="evenodd" />
        </clipPath>
      </defs>

      <path d={BODY} fill={c.body} fillRule="evenodd" />
      <path d={BODY} fill="none" fillRule="evenodd" stroke="rgb(0 0 0 / 0.16)" strokeWidth="0.25" />
      <path d={RIM} fill="none" stroke={c.gold} strokeWidth="0.32" />

      {side === "front" ? <Front c={c} uid={uid} /> : <Back c={c} />}
      {text
        ? tagTexts(c, face, side).map((l) => (
            <text
              key={l.text + l.y}
              x="0"
              y={l.y}
              textAnchor="middle"
              fontSize={l.size}
              letterSpacing={l.spacing || undefined}
              fill={l.fill}
              direction={l.font === "arabic" ? "rtl" : undefined}
              style={l.font === "arabic" ? ARABIC : DISPLAY}
            >
              {l.text}
            </text>
          ))
        : null}
    </svg>
  );
}

function Front({ c, uid }: { c: Colourway; uid: string }) {
  const top = rosette(0, 31.4, 3.7);
  const small = rosette(0, 58.7, 1.9);
  return (
    <>
      <g clipPath={`url(#field-${uid})`}>
        <rect x="-18" y="0" width="36" height={TAG.split} fill={c.wellTop} />
        <rect x="-18" y={TAG.split} width="36" height={TAG.height - TAG.split} fill={c.wellBottom} />
        <path d={LATTICE} fill="none" stroke="rgb(0 0 0 / 0.28)" strokeWidth="0.7" transform="translate(0.15 0.28)" strokeLinejoin="round" />
        <path d={LATTICE} fill="none" stroke={c.lattice} strokeWidth="0.62" strokeLinejoin="round" />
      </g>
      <circle cx="0" cy={TAG.hole.y} r={TAG.hole.r + 0.55} fill="none" stroke="rgb(0 0 0 / 0.14)" strokeWidth="0.3" />

      <path d={PANEL} fill={c.body} stroke={c.gold} strokeWidth="0.6" strokeLinejoin="round" />
      <path d={PANEL_IN} fill="none" stroke="rgb(0 0 0 / 0.08)" strokeWidth="0.2" />

      <Rosette r={top} gold={c.gold} body={c.body} centre={c.ink} />
      <Divider y={49.7} gold={c.gold} />
      <Rosette r={small} gold={c.gold} body={c.body} centre={c.ink} />
    </>
  );
}

function Back({ c }: { c: Colourway }) {
  const r = rosette(0, 60.2, 2.5);
  return (
    <>
      <circle cx="0" cy="27" r="1.05" fill={c.gold} />
      <path d={wavesPath(0, 27, 7)} fill="none" stroke={c.gold} strokeWidth="0.55" strokeLinecap="round" />
      <Divider y={45} gold={c.gold} />
      <Rosette r={r} gold={c.gold} body={c.body} centre={c.body} />
    </>
  );
}

function Rosette({ r, gold, body, centre }: { r: ReturnType<typeof rosette>; gold: string; body: string; centre: string }) {
  return (
    <g>
      <path d={r.lines} fill={body} fillRule="nonzero" stroke={gold} strokeWidth={r.stroke} strokeLinejoin="round" />
      <circle cx={r.centre.cx} cy={r.centre.cy} r={r.centre.r} fill={centre} stroke={gold} strokeWidth={r.stroke * 0.6} />
    </g>
  );
}

function Divider({ y, gold }: { y: number; gold: string }) {
  return (
    <g stroke={gold} strokeWidth="0.22" fill="none">
      <path d={`M-7.4 ${y}H-1.6M1.6 ${y}H7.4`} />
      <path d={`M0 ${y - 0.85}L0.85 ${y}L0 ${y + 0.85}L-0.85 ${y}Z`} fill={gold} />
      <circle cx="-1.25" cy={y} r="0.22" fill={gold} stroke="none" />
      <circle cx="1.25" cy={y} r="0.22" fill={gold} stroke="none" />
    </g>
  );
}
