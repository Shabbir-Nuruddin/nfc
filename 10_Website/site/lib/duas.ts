/**
 * Tap-player content. Each NFC tag points at /d/<slug>, or at /d for the list.
 *
 * HARD RULE: nothing in here may be invented. Arabic text, translation,
 * transliteration and recitation come from our own hafti or a recording we
 * have permission to use, added by the owner. Leave a field empty until it is
 * checked; the player shows an honest "not added yet" state for every empty one.
 * Arabic titles are set only where a source confirms the spelling. See
 * 03_Religious_Content/Duas_Research.md.
 *
 * To add a recitation: put the file in /public/media and set `audio` (or
 * `video` for an MP4). `start` on each line is the second that line begins,
 * which drives read-along highlighting. Omit `start` and lines just list.
 *
 * `pages` are the hafti pages as they appear in the source recording, taken
 * from its scene cuts. The player shows them in time with the audio, so the
 * page turns as the recitation does.
 */

import kamilPages from "@/public/media/dua-e-kamil/pages.json";
import kumailPages from "@/public/media/dua-e-kumail/pages.json";
import nasrPages from "@/public/media/nasr-ul-mahaba/pages.json";

/** One page of the hafti as shown in the recording, from the second it comes on. */
export type DuaPage = { t: number; src: string };

export type DuaLine = {
  arabic: string;
  transliteration?: string;
  translation?: string;
  start?: number;
};

export type Dua = {
  slug: string;
  title: string;
  /** Short name in capitals, as engraved on the tag. */
  tag: string;
  arabicTitle?: string;
  /** Joshan is recited in seven parts, one per day. 0 is Sunday. */
  day?: number;
  reciter?: string;
  source?: string;
  audio?: string;
  video?: string;
  poster?: string;
  pages?: DuaPage[];
  /** Who made the recording. Shown under the player. */
  credit?: string;
  lines: DuaLine[];
  /** Marks wiring/test entries so the page labels them as such. */
  test?: boolean;
};

export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const JOSHAN: Dua[] = DAYS.map((d, i) => ({
  slug: `joshan-${d.toLowerCase()}`,
  title: "Dua-e-Joshan",
  tag: "DUA-E-JOSHAN",
  arabicTitle: "دعاء الجوشن",
  day: i,
  lines: [],
}));

export const DUAS: Dua[] = [
  {
    slug: "dua-e-kamil",
    title: "Dua-e-Kamil",
    tag: "DUA-E-KAMIL",
    arabicTitle: "دعاء كامل",
    audio: "/media/dua-e-kamil.m4a",
    pages: kamilPages,
    credit: "Recording: Channel53",
    lines: [],
  },
  // Arabic spelling not yet confirmed. Add arabicTitle once checked against the hafti.
  { slug: "hayat-e-qaaf", title: "Dua-e-Hayat-e-Qaaf", tag: "HAYAT-E-QAAF", lines: [] },
  {
    slug: "nasr-ul-mahaba",
    title: "Dua-e-Nasr-ul-Mahaba",
    tag: "NASR-UL-MAHABA",
    arabicTitle: "دعاء النصر والمهابة",
    audio: "/media/nasr-ul-mahaba.m4a",
    pages: nasrPages,
    lines: [],
  },
  {
    slug: "dua-e-kumail",
    title: "Dua-e-Kumail",
    tag: "DUA-E-KUMAIL",
    arabicTitle: "دعاء كميل",
    audio: "/media/dua-e-kumail.m4a",
    pages: kumailPages,
    lines: [],
  },
  ...JOSHAN,
  {
    // Wiring check for new tags: a plain two-note tone, not a recitation.
    slug: "test",
    title: "Tag test",
    tag: "TAG TEST",
    test: true,
    audio: "/media/test-tone.mp3",
    source: "Test tone generated for checking tags. Not a recitation.",
    lines: [
      { arabic: "", translation: "Line one of the checked text appears here.", start: 0 },
      { arabic: "", translation: "Each line lights up as the recitation reaches it.", start: 8 },
      { arabic: "", translation: "Tap any line to jump the audio to it.", start: 16 },
      { arabic: "", translation: "Speed, repeat and skip work the same with real audio.", start: 24 },
      { arabic: "", translation: "Replace this entry in lib/duas.ts once the text is checked.", start: 34 },
    ],
  },
];

export function getDua(slug: string) {
  return DUAS.find((d) => d.slug === slug);
}

/** One entry per dua for lists and pickers: Joshan appears once, not seven times. */
export type Face = { id: string; title: string; tag: string; arabic?: string; slug: string };

export const FACES: Face[] = DUAS.filter((d) => !d.test && (d.day === undefined || d.day === 0)).map((d) => ({
  id: d.day === undefined ? d.slug : "joshan",
  title: d.title,
  tag: d.tag,
  arabic: d.arabicTitle,
  slug: d.day === undefined ? d.slug : "joshan",
}));
