"use client";

import { useState } from "react";
import { DUAS } from "@/lib/duas";
import { PhoneFrame, PhonePlayer } from "./PhonePlayer";

const READY = DUAS.filter((d) => !d.test && d.audio && d.pages?.length);

/** The phone in the player band: switch between the duas that have a recitation and pages. */
export function PlayerShowcase() {
  const [slug, setSlug] = useState(READY[0]?.slug ?? "");
  return (
    <figure className="mx-auto w-full max-w-[300px]">
      <PhoneFrame>
        <PhonePlayer key={slug} slug={slug} />
      </PhoneFrame>
      <figcaption className="mt-6">
        <div className="flex flex-wrap justify-center gap-1.5" role="group" aria-label="Choose a dua to hear">
          {READY.map((d) => {
            const on = d.slug === slug;
            return (
              <button
                key={d.slug}
                type="button"
                aria-pressed={on}
                onClick={() => setSlug(d.slug)}
                className={`border px-3 py-1.5 text-[13px] transition-colors ${
                  on ? "border-gold-bright bg-gold-bright text-umber" : "border-ivory/20 text-sand-2 hover:border-ivory/50"
                }`}
              >
                {d.title.replace("Dua-e-", "")}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-center text-[13px] leading-relaxed text-sand-2/70">The real page and the real recitation. Press play.</p>
      </figcaption>
    </figure>
  );
}
