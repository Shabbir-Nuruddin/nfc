# The first five duas: names, spellings and sources

These are the five duas the first tags carry. This file holds names and sources only. **It contains no dua text.** The Arabic text, transliteration, translation and recitation audio for each one must come from our own trusted hafti or a recording we have permission to use. Never copy them from this file or from a search result.

Status key:
- **Verified**: the spelling matches at least one community source listed below, and the mockup where it shows one.
- **Check**: a source shows a spelling, but it looks unusual or only one source has it. Confirm against your own hafti before printing.

| Dua | Arabic used on the site | Status | Notes |
|---|---|---|---|
| Dua-e-Kamil | دعاء كامل | Verified | The mockup front reads دعاء كامل. The dawoodibohraapp list writes دعاء الكامل. Both forms are correct Arabic. The tag uses the mockup's form. |
| Dua-e-Hayat-e-Qaaf | (not shown yet) | **Check** | The dawoodibohraapp list writes it as دعاء حياط قاف. The second word is spelled with ط, which is unusual, and no second source was found. The site shows the English name only until you confirm the Arabic from your hafti. |
| Dua-e-Nasr-ul-Mahaba | دعاء النصر والمهابة | Verified | Dawoodibohraapp lists it under this spelling. Darul Kutub sells a hafti titled "Dua-o-Nasr wal Mahaba". One web page says it was composed for Imam Ali; that is unconfirmed and is not used on the site. |
| Dua-e-Kumail | دعاء كميل | Verified | Dawoodibohraapp lists it under this spelling. It is widely recited on Thursday night (the eve of Friday). The site does not state a recitation time. |
| Dua-e-Joshan | دعاء الجوشن | Verified | Dawoodibohraapp shows it split into seven parts, one for each day, Sunday to Saturday. The site has one page per day: `/d/joshan-sunday` to `/d/joshan-saturday`. |

## What the site does with this

- `lib/duas.ts` has one entry per dua, and one per Joshan day. A dua plays only when it has audio. Otherwise its page says the recitation is being added.
- `arabicTitle` is set only for the duas marked Verified above.
- Where there are page images, the player turns the hafti pages in step with the recitation. The timings are in each dua's `pages.json`.

## Media on the site (October 2026)

| Dua | Audio | Pages | Taken from |
|---|---|---|---|
| Dua-e-Kamil | `public/media/dua-e-kamil.m4a` (14:17), from the MP3 | 72 | `vidssave.com Dua Kamil UPDATED _ Channel53`: the 128 kbps MP3 for audio, the 480p video for pages. Credited on the player as "Recording: Channel53". |
| Dua-e-Kumail | `public/media/dua-e-kumail.m4a` (6:47), extracted from the video | 43 | `DUA E KUMAIL ( DAWOODI BHORA ) ONLY 6 minutes. FAST.mp4`. Channel unknown. |
| Dua-e-Nasr-ul-Mahaba | `public/media/nasr-ul-mahaba.m4a` (16:20), extracted from the video | 46 | `vidssave.com Dua Nasrul Mahaba _ Fast Track _ Dawoodi Bohra Dua's _ Clear Voice With Pdf 480P.mp4`. Channel unknown. |
| Dua-e-Hayat-e-Qaaf | none | none | No file found. |
| Dua-e-Joshan (7 parts) | none | none | No file found. |

The page images are frames taken from each video at every page change, cropped to the page and saved as WebP. The red YouTube title card at the start of the Kamil video was dropped.

**Before selling:**
- These recordings were downloaded from YouTube. Get written permission from each channel (Channel53, and whoever published the Kumail and Nasr videos), or replace them with recordings you own.
- The Kumail and Nasr videos are labelled "fast", so they may be quicker than a normal recitation. Listen through and confirm they suit bedtime.

## What still needs you

1. The Arabic spelling of Hayat-e-Qaaf, from your hafti.
2. Recitation audio for Hayat-e-Qaaf and for each of the seven Joshan parts, plus page scans or a video with pages if you want the pages to turn.
3. Permission for, or replacements of, the three recordings above.

## Sources

- Dawoodi Bohra App, dua index: https://dawoodibohraapp.com/Duas.html
- Dawoodi Bohra App, Dua-e-Joshan by day: https://dawoodibohraapp.com/joshan.html
- Dawoodi Bohra App, daily ibadaat: https://dawoodibohraapp.com/Daily%20Ibadaat.html
- Darul Kutub, Dua-o-Nasr wal Mahaba hafti: https://darulkutub.org/products/dua-o-nasr-wal-mahaba
- Joshan, Sunday portion (recording): https://www.youtube.com/watch?v=JE_c5BmGjbI
