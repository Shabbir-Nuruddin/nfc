"use client";

import { useState } from "react";
import { Minus, Plus, WhatsappLogo } from "@phosphor-icons/react";
import { COLOURWAYS, WHATSAPP_DISPLAY, orderMessage, whatsappLink } from "@/lib/site";
import { FACES } from "@/lib/duas";
import { useColourway } from "./ColourProvider";
import { TagDrawing } from "./TagDrawing";

export function OrderBuilder() {
  const { colourway, setColourway, face, setFace } = useColourway();
  const [qty, setQty] = useState(1);
  const [gift, setGift] = useState(false);
  const dua = face.id === "joshan" ? `${face.title} (opens each day's part)` : face.title;
  const message = orderMessage({ colourway: colourway.name, dua, qty, gift });

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-20">
      <div className="space-y-10">
        <fieldset>
          <legend className="caps text-[13px] text-umber">Colourway</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {COLOURWAYS.map((c) => (
              <Choice key={c.id} on={c.id === colourway.id} onClick={() => setColourway(c.id)}>
                <span className="inline-block size-3.5 rounded-full" style={{ background: `linear-gradient(135deg, ${c.body} 58%, ${c.gold} 58%)` }} />
                {c.name}
              </Choice>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="caps text-[13px] text-umber">Which dua</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {FACES.map((f) => (
              <Choice key={f.id} on={f.id === face.id} onClick={() => setFace(f.id)}>
                {f.title}
              </Choice>
            ))}
          </div>
          <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-bark">
            We confirm the text and the recitation with you before your tag is made.
          </p>
        </fieldset>

        <div className="flex flex-wrap items-end gap-x-12 gap-y-8">
          <div>
            <p className="caps text-[13px] text-umber" id="qty-label">
              Quantity
            </p>
            <div className="mt-4 inline-flex items-center border border-umber/30 bg-paper" role="group" aria-labelledby="qty-label">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="One fewer"
                className="grid size-11 place-items-center text-umber transition-colors hover:bg-sand disabled:opacity-35 disabled:hover:bg-transparent"
              >
                <Minus size={16} />
              </button>
              <span className="tabular w-12 text-center text-lg text-umber" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(50, q + 1))}
                disabled={qty >= 50}
                aria-label="One more"
                className="grid size-11 place-items-center text-umber transition-colors hover:bg-sand disabled:opacity-35"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-3 pb-3 text-umber">
            <input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} className="size-5 accent-[#6a5038]" />
            It&apos;s a gift
          </label>
        </div>
      </div>

      <div className="flex flex-col border border-sand-2 bg-paper p-6 sm:p-8">
        <div className="flex items-start gap-6">
          <TagDrawing colourway={colourway} face={face} className="w-20 shrink-0 drop-shadow-[0_14px_16px_rgb(74_52_33/0.25)]" />
          <div className="min-w-0">
            <p className="text-sm text-bark">Your message</p>
            <pre className="mt-2 font-sans text-[15px] leading-relaxed whitespace-pre-wrap text-umber">{message}</pre>
          </div>
        </div>
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center gap-2.5 bg-umber px-6 py-4 text-lg text-ivory transition-[transform,background-color] duration-200 hover:bg-umber-3 active:translate-y-px"
        >
          <WhatsappLogo size={22} weight="fill" className="text-gold-bright" />
          Send pre-order on WhatsApp
        </a>
        <p className="mt-3 text-sm leading-relaxed text-bark">
          Opens WhatsApp to {WHATSAPP_DISPLAY} with this message filled in. You can edit it before sending.
        </p>
      </div>
    </div>
  );
}

function Choice({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`inline-flex items-center gap-2 border px-4 py-2.5 text-[15px] transition-colors duration-150 ${
        on ? "border-umber bg-umber text-ivory" : "border-umber/25 bg-paper/60 text-umber hover:border-umber"
      }`}
    >
      {children}
    </button>
  );
}
