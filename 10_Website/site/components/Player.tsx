"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  BookOpenText,
  CaretLeft,
  CaretRight,
  FilmStrip,
  MoonStars,
  Pause,
  Play,
  Repeat,
  SpeakerHigh,
  SunHorizon,
  TextAa,
} from "@phosphor-icons/react";
import { DAYS, type Dua } from "@/lib/duas";
import { outlinePoints, panelPoints, pathOf, rosette } from "@/lib/tag";

type View = "listen" | "read" | "watch";
type Status = "loading" | "blocked" | "playing" | "paused" | "ended" | "error" | "missing";

const SPEEDS = [0.75, 1, 1.25, 1.5];
const EASE = [0.16, 1, 0.3, 1] as const;
const NIGHT_KEY = "nfcdua:night";

const PANEL = pathOf(panelPoints());
const OUTLINE = pathOf(outlinePoints(1.3));
const ROSE = rosette(0, 31.4, 3.7);

function fmt(t: number) {
  if (!isFinite(t) || t < 0) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const THEMES = {
  day: {
    bg: "bg-paper",
    ink: "text-ink",
    dim: "text-bark",
    line: "border-sand-2",
    accent: "text-gold-deep",
    btn: "bg-umber text-ivory",
    rail: "bg-sand-2",
    fill: "bg-gold",
    tick: "bg-bark/35",
    gold: "#ab812f",
    faint: "#d8cab3",
    card: "bg-paper border-sand-2 shadow-[0_28px_50px_-30px_rgb(36_24_15/0.45)]",
    rule: "border-gold/45",
    page: "mix-blend-multiply",
    veil: "bg-paper/94",
  },
  night: {
    bg: "bg-umber",
    ink: "text-ivory",
    dim: "text-sand-2/75",
    line: "border-umber-3",
    accent: "text-gold-bright",
    btn: "bg-gold-bright text-umber",
    rail: "bg-umber-3",
    fill: "bg-gold-bright",
    tick: "bg-sand-2/30",
    gold: "#d0aa5a",
    faint: "#4a3421",
    card: "bg-umber-2 border-umber-3 shadow-[0_28px_50px_-30px_rgb(0_0_0/0.7)]",
    rule: "border-gold-bright/30",
    // The hafti is printed black on white. At night it reads as light text on the umber ground.
    page: "mix-blend-screen [filter:invert(1)_hue-rotate(180deg)_sepia(0.22)_brightness(0.9)]",
    veil: "bg-umber/94",
  },
};
type Theme = (typeof THEMES)["day"];

export function Player({ dua }: { dua: Dua }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  const pages = dua.pages ?? [];
  const hasPages = pages.length > 0;
  const hasAudio = Boolean(dua.audio);
  const hasVideo = Boolean(dua.video);
  const hasMedia = hasAudio || hasVideo;
  const hasText = dua.lines.some((l) => l.arabic || l.translation);
  const timedLines = dua.lines.some((l) => typeof l.start === "number");

  const [view, setView] = useState<View>(hasPages || hasText ? "read" : hasAudio || !hasVideo ? "listen" : "watch");
  const [night, setNight] = useState(false);
  const [status, setStatus] = useState<Status>(hasMedia ? "loading" : "missing");
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);
  const [textSize, setTextSize] = useState(1);
  const [showTranslation, setShowTranslation] = useState(true);

  // Night unless the reader chose otherwise: the tag lives by the bed.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(NIGHT_KEY);
    } catch {}
    const h = new Date().getHours();
    setNight(saved ? saved === "1" : h >= 18 || h < 6);
  }, []);
  const toggleNight = () =>
    setNight((n) => {
      try {
        localStorage.setItem(NIGHT_KEY, n ? "0" : "1");
      } catch {}
      return !n;
    });

  const usingVideo = view === "watch" && hasVideo ? true : !hasAudio && hasVideo;
  const media = useCallback(
    () => (usingVideo ? videoRef.current : audioRef.current) as HTMLMediaElement | null,
    [usingVideo],
  );

  // Count the tap once per page open.
  useEffect(() => {
    try {
      const key = `nfcdua:visits:${dua.slug}`;
      const visit = (Number(localStorage.getItem(key)) || 0) + 1;
      localStorage.setItem(key, String(visit));
      const tag = new URLSearchParams(location.search).get("t") ?? "";
      const body = JSON.stringify({ slug: dua.slug, tag, visit });
      if (navigator.sendBeacon) navigator.sendBeacon("/api/tap", new Blob([body], { type: "application/json" }));
    } catch {
      // Storage blocked: the tap still plays.
    }
  }, [dua.slug]);

  // Try to start on open. Browsers that need a gesture reject this.
  useEffect(() => {
    const el = media();
    if (!el) return;
    const p = el.play();
    if (p) p.catch(() => setStatus((s) => (s === "error" ? s : "blocked")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = media();
    if (!el) return;
    const on = {
      play: () => setStatus("playing"),
      pause: () => setStatus((s) => (s === "ended" ? s : "paused")),
      ended: () => setStatus("ended"),
      error: () => setStatus("error"),
      timeupdate: () => setTime(el.currentTime),
      loadedmetadata: () => setDuration(el.duration),
      durationchange: () => setDuration(el.duration),
    };
    (Object.keys(on) as (keyof typeof on)[]).forEach((k) => el.addEventListener(k, on[k]));
    if (el.readyState >= 1) setDuration(el.duration);
    return () => (Object.keys(on) as (keyof typeof on)[]).forEach((k) => el.removeEventListener(k, on[k]));
  }, [media]);

  useEffect(() => {
    [audioRef.current, videoRef.current].forEach((el) => {
      if (!el) return;
      el.playbackRate = speed;
      el.loop = loop;
      (el as HTMLMediaElement & { preservesPitch?: boolean }).preservesPitch = true;
    });
  }, [speed, loop]);

  const toggle = () => {
    const el = media();
    if (!el) return;
    if (el.paused) {
      if (status === "ended") el.currentTime = 0;
      el.play().catch(() => setStatus("blocked"));
    } else el.pause();
  };

  const seekTo = (t: number) => {
    const el = media();
    if (!el) return;
    el.currentTime = Math.max(0, Math.min(t, el.duration || t));
    setTime(el.currentTime);
  };
  const seekBy = (d: number) => {
    const el = media();
    if (el) seekTo(el.currentTime + d);
  };

  // Lock-screen and headphone controls.
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: dua.title,
      artist: dua.reciter ?? "NFC Dua",
      album: "NFC Dua",
    });
    const ms = navigator.mediaSession;
    ms.setActionHandler("play", () => media()?.play());
    ms.setActionHandler("pause", () => media()?.pause());
    ms.setActionHandler("seekbackward", () => seekBy(-10));
    ms.setActionHandler("seekforward", () => seekBy(10));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dua, media]);

  const switchView = (v: View) => {
    if (v === view) return;
    const wasPlaying = status === "playing";
    const from = media();
    const toVideo = v === "watch" && hasVideo;
    const to = toVideo ? videoRef.current : hasAudio ? audioRef.current : videoRef.current;
    if (from && to && from !== to) {
      from.pause();
      to.currentTime = from.currentTime;
      if (wasPlaying) to.play().catch(() => setStatus("blocked"));
    }
    setView(v);
  };

  // The audio is the clock. Pages and lines follow it, and moving either one moves the audio.
  const marks = useMemo(
    () => (hasPages ? pages.map((p) => p.t) : timedLines ? dua.lines.map((l) => l.start ?? -1) : []),
    [hasPages, pages, timedLines, dua.lines],
  );
  const current = useMemo(() => {
    let idx = marks.length ? 0 : -1;
    marks.forEach((m, i) => {
      if (m >= 0 && time >= m - 0.05) idx = i;
    });
    return idx;
  }, [marks, time]);

  const step = (dir: 1 | -1) => {
    if (!marks.length) return seekBy(dir * 10);
    const target = marks[current + dir];
    if (typeof target === "number" && target >= 0) seekTo(target);
    else if (dir === -1) seekTo(0);
  };

  // Have the next page decoded before it is needed.
  useEffect(() => {
    const next = pages[current + 1];
    if (next) new Image().src = next.src;
  }, [current, pages]);

  const progress = duration > 0 ? time / duration : 0;
  const t = night ? THEMES.night : THEMES.day;
  const disabled = !hasMedia || status === "error";
  const stepLabel = hasPages ? "page" : "line";

  const tabs = [
    ["read", "Read", BookOpenText],
    ["listen", "Listen", SpeakerHigh],
    ...(hasVideo ? ([["watch", "Watch", FilmStrip]] as const) : []),
  ] as const;

  return (
    <div className={`${t.bg} ${t.ink} min-h-[100dvh] transition-colors duration-700`}>
      {hasAudio ? <audio ref={audioRef} src={dua.audio} preload="auto" playsInline /> : null}

      {/* The brown band from the tag's packaging: title in gold over the lattice. */}
      <header className="relative overflow-hidden bg-umber text-ivory">
        <div className="lattice text-gold/[0.13]" aria-hidden />
        <div className="relative mx-auto flex max-w-[720px] items-center justify-between px-5 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <span className="caps text-[11px] text-sand-2/80">Before sleep</span>
          <button
            type="button"
            onClick={toggleNight}
            className="-mr-2 inline-flex items-center gap-2 px-2 py-2 text-[13px] text-sand-2 transition-colors hover:text-ivory"
            aria-label={`${night ? "Night" : "Day"} page. Switch to ${night ? "day" : "night"}`}
          >
            {night ? <MoonStars size={17} /> : <SunHorizon size={17} />}
            {night ? "Night" : "Day"}
          </button>
        </div>
        <div className="relative mx-auto max-w-[720px] px-5 pt-1 pb-5 text-center">
          {dua.arabicTitle ? (
            <p className="arabic text-[2.6rem] leading-[1.25] font-bold text-gold-bright">{dua.arabicTitle}</p>
          ) : null}
          <h1 className={`caps text-[15px] text-ivory ${dua.arabicTitle ? "mt-0.5" : "mt-3"}`}>{dua.tag}</h1>
          {dua.day !== undefined ? <p className="mt-1.5 text-[13px] text-sand-2/80">{DAYS[dua.day]}&apos;s part</p> : null}
        </div>
        <div className="relative h-px bg-gold/70" aria-hidden />
        <div className="relative mt-[3px] h-px bg-gold/30" aria-hidden />
      </header>

      <div className="mx-auto flex min-h-[calc(100dvh-9.5rem)] w-full max-w-[720px] flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <div className="mt-4 flex items-center justify-between gap-3">
          <div role="tablist" aria-label="View" className={`flex border ${t.line}`}>
            {tabs.map(([v, label, Icon]) => (
              <button
                key={v}
                role="tab"
                aria-selected={view === v}
                onClick={() => switchView(v)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm transition-colors duration-300 ${
                  view === v ? t.btn : `${t.dim} hover:opacity-80`
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
          {view === "read" && hasPages ? (
            <p className={`tabular text-sm ${t.dim}`} aria-live="polite">
              Page {current + 1} of {pages.length}
            </p>
          ) : view === "read" && hasText ? (
            <div className="flex items-center">
              <button
                type="button"
                aria-pressed={showTranslation}
                onClick={() => setShowTranslation((s) => !s)}
                className={`px-2.5 py-1.5 text-sm ${showTranslation ? t.accent : t.dim}`}
              >
                English
              </button>
              <button
                type="button"
                aria-label={`Text size ${Math.round(textSize * 100)}%. Change size`}
                onClick={() => setTextSize((s) => (s >= 1.4 ? 0.9 : +(s + 0.25).toFixed(2)))}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-sm ${t.dim}`}
              >
                <TextAa size={18} />
                <span className="tabular">{Math.round(textSize * 100)}%</span>
              </button>
            </div>
          ) : null}
        </div>

        {dua.test ? (
          <p className={`mt-4 border ${t.line} px-3 py-2 text-[13px] ${t.dim}`}>Tag test. You are hearing a plain tone, not a recitation.</p>
        ) : null}

        <div className="relative flex flex-1 flex-col py-5">
          <AnimatePresence mode="wait" initial={false}>
            {view === "read" ? (
              <motion.div
                key="read"
                className="flex flex-1 flex-col"
                initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {hasPages ? (
                  <Pages
                    t={t}
                    pages={pages}
                    current={current}
                    onStep={step}
                    disabled={disabled}
                    reduce={!!reduce}
                  />
                ) : hasText ? (
                  <ol className="max-h-[56dvh] flex-1 space-y-1 overflow-y-auto pr-1" style={{ fontSize: `${textSize}rem` }}>
                    {dua.lines.map((l, i) => {
                      const on = i === current;
                      return (
                        <li key={i}>
                          <button
                            type="button"
                            disabled={typeof l.start !== "number" || disabled}
                            onClick={() => typeof l.start === "number" && seekTo(l.start)}
                            className={`w-full py-3 text-left transition-opacity duration-300 ${timedLines && !on ? "opacity-45" : "opacity-100"} disabled:cursor-default`}
                          >
                            {l.arabic ? <span className={`arabic block text-[1.6em] leading-[1.9] ${on ? t.accent : ""}`}>{l.arabic}</span> : null}
                            {l.transliteration ? <span className={`mt-1 block text-[0.9em] italic ${t.dim}`}>{l.transliteration}</span> : null}
                            {showTranslation && l.translation ? <span className="mt-1 block leading-relaxed">{l.translation}</span> : null}
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <Empty
                    t={t}
                    title="The pages aren't added yet"
                    body="They appear here once the text has been checked against the hafti."
                  />
                )}
              </motion.div>
            ) : view === "listen" ? (
              <motion.div
                key="listen"
                className="flex flex-1 flex-col items-center justify-center text-center"
                initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <ArchProgress t={t} progress={progress} title={dua.arabicTitle} />
                <p className={`mt-5 text-[15px] ${t.dim}`}>
                  {dua.reciter ? `Recited by ${dua.reciter}` : dua.test ? dua.source : hasMedia ? `${fmt(duration)} recitation` : ""}
                </p>
              </motion.div>
            ) : (
              <motion.div key="watch" className="flex-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            )}
          </AnimatePresence>
          {hasVideo ? (
            <video
              ref={videoRef}
              src={dua.video}
              poster={dua.poster}
              playsInline
              preload="metadata"
              onClick={toggle}
              className={`w-full bg-umber ${view === "watch" ? "absolute inset-x-0 top-1/2 -translate-y-1/2" : "pointer-events-none absolute h-0 w-0 opacity-0"}`}
            />
          ) : null}
        </div>

        {/* Transport */}
        <div>
          {status === "missing" ? (
            <p className={`mb-5 text-center text-[15px] leading-relaxed ${t.dim}`}>The recitation for this dua hasn&apos;t been added yet.</p>
          ) : status === "error" ? (
            <p className={`mb-5 text-center text-[15px] leading-relaxed ${t.dim}`}>The recording didn&apos;t load. Check your connection and tap the tag again.</p>
          ) : null}

          <div className={disabled ? "opacity-50" : ""}>
            <Scrubber t={t} time={time} duration={duration} marks={hasPages ? marks : []} onSeek={seekTo} disabled={disabled} />

            <div className="mt-3 grid grid-cols-5 items-center justify-items-center">
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={disabled}
                aria-label={marks.length ? `Previous ${stepLabel}` : "Back 10 seconds"}
                className="grid size-12 place-items-center disabled:opacity-40"
              >
                {marks.length ? <CaretLeft size={24} /> : <ArrowCounterClockwise size={24} />}
              </button>
              <button
                type="button"
                onClick={() => seekBy(-10)}
                disabled={disabled}
                aria-label="Back 10 seconds"
                className={`grid size-12 place-items-center disabled:opacity-40 ${marks.length ? "" : "invisible"}`}
              >
                <ArrowCounterClockwise size={22} />
              </button>
              <button
                type="button"
                onClick={toggle}
                disabled={disabled}
                aria-label={status === "playing" ? "Pause" : "Play"}
                className={`grid size-[4.25rem] place-items-center rounded-full ${t.btn} transition-[transform,background-color] duration-300 active:scale-95`}
              >
                {status === "playing" ? <Pause size={28} weight="fill" /> : <Play size={28} weight="fill" className="translate-x-px" />}
              </button>
              <button
                type="button"
                onClick={() => seekBy(10)}
                disabled={disabled}
                aria-label="Forward 10 seconds"
                className={`grid size-12 place-items-center disabled:opacity-40 ${marks.length ? "" : "invisible"}`}
              >
                <ArrowClockwise size={22} />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={disabled}
                aria-label={marks.length ? `Next ${stepLabel}` : "Forward 10 seconds"}
                className="grid size-12 place-items-center disabled:opacity-40"
              >
                {marks.length ? <CaretRight size={24} /> : <ArrowClockwise size={24} />}
              </button>
            </div>

            <div className={`mt-3 flex items-center justify-between border-t ${t.line} pt-3.5 text-sm`}>
              <button
                type="button"
                onClick={() => setSpeed((s) => SPEEDS[(SPEEDS.indexOf(s) + 1) % SPEEDS.length])}
                disabled={disabled}
                aria-label={`Speed ${speed} times. Change speed`}
                className={`tabular min-w-[4.5rem] border px-3 py-2 ${speed === 1 ? `${t.line} ${t.dim}` : `border-current ${t.accent}`}`}
              >
                {speed}×
              </button>
              <span className={t.dim} aria-live="polite">
                {status === "playing" ? "Playing" : status === "paused" ? "Paused" : status === "ended" ? "Finished" : status === "loading" ? "Loading" : status === "blocked" ? "Waiting for you" : ""}
              </span>
              <button
                type="button"
                aria-pressed={loop}
                onClick={() => setLoop((l) => !l)}
                disabled={disabled}
                className={`inline-flex items-center gap-1.5 border px-3 py-2 ${loop ? `border-current ${t.accent}` : `${t.line} ${t.dim}`}`}
              >
                <Repeat size={16} />
                {loop ? "Repeating" : "Repeat"}
              </button>
            </div>
          </div>

          {dua.credit ? <p className={`mt-4 text-center text-xs ${t.dim}`}>{dua.credit}</p> : null}
        </div>
      </div>

      {/* Autoplay was refused: one large, unmissable start. */}
      <AnimatePresence>
        {status === "blocked" ? (
          <motion.button
            type="button"
            onClick={toggle}
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-7 ${t.veil} ${t.ink} backdrop-blur-sm`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            aria-label={`Begin ${dua.title}`}
          >
            <span className="relative grid w-[min(52vw,210px)] place-items-center">
              <svg viewBox="-18 -0.5 36 71" className="w-full" aria-hidden>
                <path d={OUTLINE} fill="none" stroke={t.gold} strokeWidth="0.4" />
                <path d={PANEL} fill="none" stroke={t.gold} strokeWidth="0.5" />
              </svg>
              <span className={`absolute top-[60%] grid size-20 -translate-y-1/2 place-items-center rounded-full ${t.btn}`}>
                <Play size={34} weight="fill" className="translate-x-0.5" />
              </span>
            </span>
            <span className="max-w-[30ch] px-6 text-center text-balance">
              <span className="caps block text-2xl">Begin</span>
              <span className={`mt-2 block text-[15px] ${t.dim}`}>Your phone needs one touch before it plays sound.</span>
            </span>
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** The hafti page the recitation is on, as a page on the table rather than a video frame. */
function Pages({
  t,
  pages,
  current,
  onStep,
  disabled,
  reduce,
}: {
  t: Theme;
  pages: NonNullable<Dua["pages"]>;
  current: number;
  onStep: (dir: 1 | -1) => void;
  disabled: boolean;
  reduce: boolean;
}) {
  const page = pages[Math.max(0, current)];
  return (
    <motion.div
      className={`relative flex min-h-[44dvh] flex-1 touch-pan-y border p-2.5 transition-colors duration-700 ${t.card}`}
      drag={disabled ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.18}
      onDragEnd={(_, info) => {
        // Hafti pages turn right to left: pulling the page rightward brings the next one.
        if (info.offset.x > 60) onStep(1);
        else if (info.offset.x < -60) onStep(-1);
      }}
    >
      <div className={`relative flex-1 border ${t.rule}`}>
        <AnimatePresence initial={false}>
          <motion.img
            key={page.src}
            src={page.src}
            alt={`Page ${current + 1} of the dua as recited`}
            draggable={false}
            className={`absolute inset-0 h-full w-full object-contain p-3 select-none ${t.page}`}
            initial={{ opacity: 0, x: reduce ? 0 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduce ? 0 : 10 }}
            transition={{ duration: 0.7, ease: EASE }}
          />
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/** The tag's arch panel, its gold line drawn round as the recitation goes. */
function ArchProgress({ t, progress, title }: { t: Theme; progress: number; title?: string }) {
  return (
    <div className="relative w-[min(58vw,230px,34dvh)]">
      <svg viewBox="-18 -0.5 36 71" className="w-full" aria-hidden>
        <path d={OUTLINE} fill="none" stroke={t.faint} strokeWidth="0.3" />
        <path d={PANEL} fill="none" stroke={t.faint} strokeWidth="0.6" />
        <path
          d={PANEL}
          fill="none"
          stroke={t.gold}
          strokeWidth="0.9"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - progress}
          style={{ transition: "stroke-dashoffset 400ms linear" }}
        />
        <g>
          <path d={ROSE.lines} fill="none" stroke={t.gold} strokeWidth={ROSE.stroke} strokeLinejoin="round" />
          <circle cx={ROSE.centre.cx} cy={ROSE.centre.cy} r={ROSE.centre.r} fill={t.gold} />
        </g>
      </svg>
      <div className="absolute inset-x-0 top-[55%] -translate-y-1/2 px-[22%] text-center">
        <span className={`arabic block text-[clamp(1.6rem,8vw,2.1rem)] leading-tight font-bold ${t.accent}`}>{title || "دعاء"}</span>
      </div>
    </div>
  );
}

function Scrubber({
  t,
  time,
  duration,
  marks,
  onSeek,
  disabled,
}: {
  t: Theme;
  time: number;
  duration: number;
  marks: number[];
  onSeek: (t: number) => void;
  disabled: boolean;
}) {
  const pct = duration > 0 ? (time / duration) * 100 : 0;
  return (
    <div>
      <div className="relative h-7">
        <div className={`absolute top-1/2 h-[3px] w-full -translate-y-1/2 ${t.rail}`} />
        {duration > 0
          ? marks.map((m, i) =>
              i === 0 ? null : (
                <span key={i} className={`absolute top-1/2 h-2 w-px -translate-y-1/2 ${t.tick}`} style={{ left: `${(m / duration) * 100}%` }} aria-hidden />
              ),
            )
          : null}
        <div className={`absolute top-1/2 h-[3px] -translate-y-1/2 ${t.fill}`} style={{ width: `${pct}%` }} />
        <div className={`absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 ${t.fill}`} style={{ left: `${pct}%` }} />
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(time, duration || 0)}
          disabled={disabled || !duration}
          onChange={(e) => onSeek(Number(e.target.value))}
          aria-label="Position"
          aria-valuetext={`${fmt(time)} of ${fmt(duration)}`}
          className="absolute inset-0 w-full cursor-pointer opacity-0 disabled:cursor-default"
        />
      </div>
      <div className={`tabular flex justify-between text-xs ${t.dim}`}>
        <span>{fmt(time)}</span>
        <span>{duration ? `-${fmt(duration - time)}` : "0:00"}</span>
      </div>
    </div>
  );
}

function Empty({ t, title, body }: { t: Theme; title: string; body: string }) {
  return (
    <div className={`my-auto border-y ${t.line} py-10 text-center`}>
      <p className="caps text-[15px]">{title}</p>
      <p className={`mx-auto mt-3 max-w-[34ch] text-[15px] leading-relaxed ${t.dim}`}>{body}</p>
    </div>
  );
}
