"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { HandTap, WhatsappLogo } from "@phosphor-icons/react";
import { COLOURWAYS, whatsappLink } from "@/lib/site";
import { DAYS, FACES } from "@/lib/duas";
import { useColourway } from "./ColourProvider";
import { TagDrawing } from "./TagDrawing";
import { Lattice } from "./Lattice";
import { PhoneFrame, PhonePlayer } from "./PhonePlayer";

const TagModel = dynamic(() => import("./TagModel"), { ssr: false });

type Phase = "idle" | "approach" | "tapped";

/** If the 3D scene throws, the drawing underneath simply stays. */
class Quiet extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Hero() {
  const { colourway, setColourway, face, setFace } = useColourway();
  const [phase, setPhase] = useState<Phase>("idle");
  const [ready, setReady] = useState(false);
  const [shown, setShown] = useState(false);
  const onModelReady = useCallback(() => setShown(true), []);
  const [tap, setTap] = useState(0);
  const timers = useRef<number[]>([]);
  const stage = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    setReady(hasWebGL());
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const slug = face.slug === "joshan" ? `joshan-${DAYS[new Date().getDay()].toLowerCase()}` : face.slug;

  const runTap = () => {
    timers.current.forEach(clearTimeout);
    const box = stage.current?.getBoundingClientRect();
    if (box && box.top > window.innerHeight * 0.45) {
      stage.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    }
    setTap((n) => n + 1);
    setPhase("approach");
    timers.current = [window.setTimeout(() => setPhase("tapped"), reduce ? 0 : 850)];
  };

  return (
    <section id="top" className="relative isolate overflow-hidden bg-ivory">
      <Lattice className="text-bark/[0.075]" fade="radial-gradient(ellipse 55% 75% at 72% 45%, black 20%, transparent 75%)" />
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-y-4 px-4 pt-10 pb-16 sm:px-8 lg:min-h-[calc(100dvh-4.5rem)] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:grid-rows-[1fr_auto] lg:gap-x-10 lg:py-12">
        <div className="relative z-10 max-w-[34rem] lg:self-end">
          <p className="arabic w-fit text-[2.4rem] leading-none font-bold text-gold-deep" lang="ar">
            دعاء
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.3rem,4.7vw,4.1rem)] leading-[1.02] font-semibold tracking-[0.01em] text-umber">
            Bedside NFC Tag
            <span className="mt-2 block font-serif text-[0.78em] font-medium tracking-normal text-gold-deep italic">Before sleep</span>
          </h1>
          <p className="mt-7 font-serif text-[1.55rem] leading-snug text-umber-3">Your nightly dua, one tap away.</p>
          <p className="mt-4 max-w-[46ch] text-[17px] leading-relaxed text-bark">
            Hold your phone to the tag on your nightstand. The recitation begins and the hafti pages turn with it. No app, no battery, nothing to search for at midnight.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={whatsappLink("Salaam. I'd like to pre-order the bedside NFC tag. Please share the price and timeline.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-umber px-6 py-3.5 text-ivory transition-[transform,background-color] duration-200 hover:bg-umber-3 active:translate-y-px"
            >
              <WhatsappLogo size={20} weight="fill" className="text-gold-bright" />
              Pre-order on WhatsApp
            </a>
            <button
              type="button"
              onClick={runTap}
              className="inline-flex items-center gap-2.5 border border-umber/35 px-6 py-3.5 text-umber transition-colors duration-200 hover:border-umber active:translate-y-px"
            >
              <HandTap size={20} />
              {phase === "idle" ? "Watch a tap" : "Tap again"}
            </button>
          </div>

        </div>

        <div ref={stage} className="relative mx-auto -mt-2 aspect-[5/6] w-full max-w-[600px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:aspect-auto lg:h-[min(calc(100dvh-8rem),760px)] lg:max-w-none">
          <div className="absolute inset-0 bottom-12">
            <div
              className={`flex h-full items-center justify-center transition-opacity duration-700 ${shown ? "opacity-0" : "opacity-100"}`}
              aria-hidden={shown}
            >
              <TagDrawing colourway={colourway} face={face} className="h-[62%] drop-shadow-[0_24px_30px_rgb(58_36_18/0.25)]" />
            </div>
            {ready ? (
              <div className={`absolute inset-0 transition-opacity duration-700 ${shown ? "opacity-100" : "opacity-0"}`}>
                <Quiet>
                  <TagModel colourway={colourway} face={face} tapping={phase === "tapped"} onReady={onModelReady} />
                </Quiet>
              </div>
            ) : null}
          </div>

          <motion.div
            className="absolute top-[14%] left-[60%] z-20 w-[34%] max-w-[230px] min-w-[150px]"
            initial={false}
            animate={
              phase === "idle"
                ? { x: "30%", y: "18%", rotate: 6, opacity: 0 }
                : phase === "approach"
                  ? { x: "-10%", y: "-4%", rotate: -12, opacity: 1 }
                  : { x: "4%", y: "0%", rotate: -6, opacity: 1 }
            }
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 70, damping: 17 }}
            style={{ pointerEvents: phase === "idle" ? "none" : "auto" }}
            aria-hidden={phase === "idle"}
          >
            <PhoneFrame>
              <AnimatePresence>
                {phase === "tapped" ? (
                  <motion.div
                    key={`${slug}-${tap}`}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <PhonePlayer slug={slug} start />
                  </motion.div>
                ) : (
                  <div className="absolute inset-0 bg-umber" />
                )}
              </AnimatePresence>
            </PhoneFrame>
          </motion.div>

          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-x-5 gap-y-1" role="radiogroup" aria-label="Colourway">
            {COLOURWAYS.map((c) => {
              const on = c.id === colourway.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setColourway(c.id)}
                  className={`inline-flex items-center gap-2 py-2 text-sm transition-colors ${on ? "text-umber" : "text-bark hover:text-umber"}`}
                >
                  <span
                    className={`inline-block size-4 rounded-full ring-1 ring-offset-2 ring-offset-ivory transition-shadow ${on ? "ring-gold" : "ring-sand-2"}`}
                    style={{ background: `linear-gradient(135deg, ${c.body} 58%, ${c.gold} 58%)` }}
                  />
                  {c.name}
                </button>
              );
            })}
          </div>
          {shown ? <p className="pointer-events-none absolute top-1 right-1 text-xs text-bark/80">Drag to turn it over</p> : null}
        </div>

        <div className="relative z-10 w-full max-w-[34rem] border-t border-sand-2 pt-6 lg:col-start-1 lg:row-start-2 lg:mt-6 lg:self-start">
          <p className="text-sm text-bark" id="face-label">
            The dua on your tag
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5" role="radiogroup" aria-labelledby="face-label">
            {FACES.map((f) => {
              const on = f.id === face.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    setFace(f.id);
                    setPhase("idle");
                  }}
                  className={`border px-3 py-1.5 text-[13px] transition-colors ${
                    on ? "border-umber bg-umber text-ivory" : "border-sand-2 text-umber-3 hover:border-bark"
                  }`}
                >
                  {f.title.replace("Dua-e-", "")}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
