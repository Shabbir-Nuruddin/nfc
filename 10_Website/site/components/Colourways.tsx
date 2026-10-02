"use client";

import { motion } from "motion/react";
import { COLOURWAYS } from "@/lib/site";
import { useColourway } from "./ColourProvider";
import { TagDrawing } from "./TagDrawing";

export function Colourways() {
  const { colourway, setColourway, face } = useColourway();
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-4" role="radiogroup" aria-label="Choose a colourway">
      {COLOURWAYS.map((c) => {
        const on = c.id === colourway.id;
        return (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => setColourway(c.id)}
            className="group flex flex-col items-center text-center"
          >
            <motion.span
              className="relative block w-[60%] max-w-[148px]"
              animate={{ y: on ? -10 : 0 }}
              whileHover={{ y: on ? -10 : -5 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
            >
              <TagDrawing
                colourway={c}
                face={face}
                className="w-full drop-shadow-[0_18px_20px_rgb(74_52_33/0.28)]"
                title={`${c.name} tag, ${face.title}`}
              />
            </motion.span>
            <span className={`mt-7 h-px w-10 transition-colors ${on ? "bg-gold" : "bg-sand-2"}`} />
            <span className={`caps mt-4 text-[13px] ${on ? "text-gold-deep" : "text-umber"}`}>{c.name}</span>
            <span className="mt-2 max-w-[28ch] text-sm leading-relaxed text-bark">{c.note}</span>
          </button>
        );
      })}
    </div>
  );
}
