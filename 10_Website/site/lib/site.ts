export const WHATSAPP_NUMBER = "917977226834";
export const WHATSAPP_DISPLAY = "+91 79772 26834";

export type Colourway = {
  id: string;
  name: string;
  /** Smooth body and the arch panel. */
  body: string;
  /** The raised strapwork of the lattice. */
  lattice: string;
  /** What shows through the lattice above and below the panel. */
  wellTop: string;
  wellBottom: string;
  /** Gold lines, rosettes and lettering. */
  gold: string;
  /** The Arabic name and the rosette centre. */
  ink: string;
  note: string;
};

// The four finishes from the design sheets. Tag colours only, never page grounds.
export const COLOURWAYS: Colourway[] = [
  {
    id: "ivory",
    name: "Ivory & Gold",
    body: "#efe6d3",
    lattice: "#f3ebda",
    wellTop: "#cdbd9f",
    wellBottom: "#1f3b2b",
    gold: "#b48a32",
    ink: "#1f3b2b",
    note: "Ivory with gold lines and a deep green ground showing through the lower lattice.",
  },
  {
    id: "green",
    name: "Deep Green & Gold",
    body: "#1f3b2b",
    lattice: "#27493a",
    wellTop: "#11241a",
    wellBottom: "#11241a",
    gold: "#c9a24e",
    ink: "#efe6d3",
    note: "Deep green with gold. The Arabic name is cut in ivory.",
  },
  {
    id: "navy",
    name: "Navy & Gold",
    body: "#1c2540",
    lattice: "#26304f",
    wellTop: "#10162a",
    wellBottom: "#10162a",
    gold: "#c9a24e",
    ink: "#efe6d3",
    note: "Navy with gold. Quiet on a dark wood nightstand.",
  },
  {
    id: "black",
    name: "Matte Black & Gold",
    body: "#1f1d1b",
    lattice: "#2b2926",
    wellTop: "#121110",
    wellBottom: "#121110",
    gold: "#c9a24e",
    ink: "#efe6d3",
    note: "Matte black with gold. The most understated of the four.",
  },
];

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function orderMessage(opts: { colourway: string; dua: string; qty: number; gift: boolean }) {
  const lines = [
    "Salaam. I'd like to pre-order the bedside NFC tag.",
    `Colourway: ${opts.colourway}`,
    `Dua: ${opts.dua}`,
    `Quantity: ${opts.qty}`,
  ];
  if (opts.gift) lines.push("This is a gift.");
  lines.push("Please share the price and timeline.");
  return lines.join("\n");
}
