"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play } from "@phosphor-icons/react";
import { getDua } from "@/lib/duas";

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

/**
 * The tap page in miniature, inside a phone: the night view of the real player,
 * with the real recitation and the hafti pages turning in time.
 */
export function PhonePlayer({ slug, start = false, label }: { slug: string; start?: boolean; label?: string }) {
  const dua = getDua(slug);
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const pages = useMemo(() => dua?.pages ?? [], [dua]);

  const index = useMemo(() => {
    let i = 0;
    for (let k = 0; k < pages.length; k++) if (pages[k].t <= time) i = k;
    return i;
  }, [pages, time]);

  useEffect(() => {
    if (!start || !audio.current) return;
    audio.current.play().catch(() => setPlaying(false));
  }, [start]);

  useEffect(() => {
    const next = pages[index + 1];
    if (next) new Image().src = next.src;
  }, [pages, index]);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => null);
    else a.pause();
  };

  const seek = (e: React.PointerEvent<HTMLDivElement>) => {
    const a = audio.current;
    if (!a || !duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * duration;
  };

  const progress = duration ? time / duration : 0;
  const page = pages[index];

  return (
    <div className="relative flex h-full flex-col bg-umber-2 text-ivory">
      <div className="relative overflow-hidden bg-umber px-4 pt-9 pb-3 text-center">
        <div className="lattice text-gold/[0.14]" aria-hidden />
        <p className="caps relative text-[8px] text-sand-2/70">{label ?? "Before sleep"}</p>
        {dua?.arabicTitle ? (
          <p className="arabic relative mt-1 text-[1.55rem] leading-tight font-bold text-gold-bright">{dua.arabicTitle}</p>
        ) : null}
        <p className="caps relative mt-0.5 text-[8.5px] text-ivory/85">{dua?.tag}</p>
      </div>
      <div className="h-px bg-gold/60" />
      <div className="mt-[2px] h-px bg-gold/25" />

      <div className="relative min-h-0 flex-1 px-3 pt-3">
        {page ? (
          <div className="relative h-full overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.img
                key={page.src}
                src={page.src}
                alt=""
                className="absolute inset-0 size-full object-contain mix-blend-screen [filter:invert(1)_hue-rotate(180deg)_sepia(0.22)_brightness(0.9)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                draggable={false}
              />
            </AnimatePresence>
          </div>
        ) : (
          <div className="grid h-full place-items-center border border-gold/20 px-4 text-center">
            <p className="text-[11px] leading-relaxed text-sand-2/75">The recitation for this dua is being added.</p>
          </div>
        )}
      </div>

      <div className="px-4 pt-3 pb-5">
        <div className="relative h-4 cursor-pointer touch-none" onPointerDown={seek} aria-hidden>
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ivory/20" />
          <div className="absolute top-1/2 left-0 h-px -translate-y-1/2 bg-gold-bright" style={{ width: `${progress * 100}%` }} />
          <div
            className="absolute top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gold-bright"
            style={{ left: `${progress * 100}%` }}
          />
        </div>
        <div className="tabular flex justify-between text-[9px] text-sand-2/70">
          <span>{fmt(time)}</span>
          <span>{pages.length ? `Page ${index + 1} of ${pages.length}` : ""}</span>
          <span>{fmt(duration)}</span>
        </div>
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={toggle}
            disabled={!dua?.audio}
            aria-label={playing ? `Pause ${dua?.title}` : `Play ${dua?.title}`}
            className="grid size-11 place-items-center rounded-full bg-gold-bright text-umber transition-transform active:scale-95 disabled:opacity-40"
          >
            {playing ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" className="translate-x-px" />}
          </button>
        </div>
      </div>

      {dua?.audio ? (
        <audio
          ref={audio}
          src={dua.audio}
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        />
      ) : null}
    </div>
  );
}

/** A plain phone body: umber glass, a fine gold edge, the island. */
export function PhoneFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[2.4rem] bg-[#1a120b] p-[7px] shadow-[0_40px_70px_-30px_rgb(58_36_18/0.55),0_0_0_1px_rgb(171_129_47/0.35)] ${className}`}
    >
      <div className="relative aspect-[9/19] overflow-hidden rounded-[2rem]">
        <div className="absolute top-2.5 left-1/2 z-10 h-[18px] w-[32%] -translate-x-1/2 rounded-full bg-black" />
        {children}
      </div>
    </div>
  );
}
