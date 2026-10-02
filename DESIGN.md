---
name: NFC Dua
description: A bedside tag drawn from al-Aqmar. Tap it and the dua plays with its hafti pages.
colors:
  ivory: "#f3ede2"
  paper: "#f9f5ed"
  sand: "#e7ddcc"
  sand-2: "#d8cab3"
  umber: "#24180f"
  umber-2: "#362517"
  umber-3: "#4a3421"
  bark: "#6a5038"
  ink: "#2a2017"
  gold: "#ab812f"
  gold-deep: "#85621f"
  gold-bright: "#d0aa5a"
  leaf: "#1f3b2b"
typography:
  display:
    fontFamily: "Cinzel, serif"
    fontSize: "clamp(2.3rem, 4.7vw, 4.1rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Cinzel, serif"
    fontSize: "clamp(1.9rem, 3.6vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "0.005em"
  title:
    fontFamily: "Cormorant Garamond, serif"
    fontSize: "1.55rem"
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
  caps:
    fontFamily: "Cinzel, serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    letterSpacing: "0.14em"
  arabic:
    fontFamily: "Amiri, serif"
    fontSize: "2.4rem"
    fontWeight: 700
    lineHeight: 1
rounded:
  none: "0px"
  full: "9999px"
spacing:
  gutter: "16px"
  gutter-sm: "32px"
  band-y: "96px"
  band-y-sm: "128px"
  container: "1320px"
components:
  button-primary:
    backgroundColor: "{colors.umber}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.none}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.umber-3}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.umber}"
    rounded: "{rounded.none}"
    padding: "14px 24px"
  nav-preorder:
    backgroundColor: "{colors.gold-bright}"
    textColor: "{colors.umber}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
  choice-chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.umber}"
    rounded: "{rounded.none}"
    padding: "10px 16px"
  choice-chip-selected:
    backgroundColor: "{colors.umber}"
    textColor: "{colors.ivory}"
  player-play:
    backgroundColor: "{colors.gold-bright}"
    textColor: "{colors.umber}"
    rounded: "{rounded.full}"
    size: "72px"
---

# Design System: NFC Dua

## Overview

**Creative North Star: "The Hafti by the Bed"**

The site is the cream page and the carved wood of a Fatimi doorway: ivory and paper grounds, umber bands cut through with the star-and-cross lattice, and one gold line that runs around the tag and down the page. It follows the client's five mockups, which set the palette (white, beige, cream, brown) and the intricate lattice at the top, bottom and behind content.

The tag is the hero. A rotatable 3D model, painted at runtime from the same SVG the page draws, sits on a faded lattice. Everything else supports it: calm ruled lists, a few full-width bands, and the real player shown in a phone, with the real hafti pages turning to the real recitation.

The voice is written from inside the community. It never describes "the Bohras" from outside.

**Key Characteristics:**
- Ivory, paper and sand grounds; umber bands with lattice; gold as the only accent.
- Square corners everywhere except round play buttons, colour swatches and phone frames.
- Lattice is a CSS mask of one SVG tile (`/lattice.svg`) filled with `currentColor`, so its strength is set by text colour and alpha.
- The Frieze (umber lattice strip between two gold hairlines) marks the edges of major bands.
- Arabic is set in Amiri and only from verified dua titles, plus the word دعاء.

## Colors

### Primary
- **Gold** (gold): rules, focus, small accents on light grounds. **Deep Gold** (gold-deep) for Arabic and italic subtitles on ivory. **Bright Gold** (gold-bright) for accents on umber: Arabic titles, the play button, the selected dua pill, the header Pre-order button.

### Neutral
- **Ivory** (ivory): hero, duas list, FAQ.
- **Paper** (paper): How it works, Specs, the order summary panel.
- **Sand / Sand 2** (sand, sand-2): the Design and Order bands; sand-2 is the hairline colour on light grounds.
- **Umber / Umber 2 / Umber 3** (umber, umber-2, umber-3): header, player band, Gifting, footer, primary buttons, and the player's night ground.
- **Bark** (bark): secondary copy on light grounds. **Ink** (ink): long-form text.

### Named Rules
**The Mockup Palette Rule.** White, beige, cream and brown, with gold. No indigo, no madder, no new hues. Leaf green (leaf) is used only as the focus ring and in the Deep Green colourway.

**The Tag Colours Stay On The Tag Rule.** Colourway bodies (Ivory, Deep Green, Navy, Matte Black) render the tag, swatches and drawings only. They never become page grounds.

## Typography

**Display:** Cinzel 600, small caps feel, for h1 and every band heading.
**Serif:** Cormorant Garamond, for titles in lists, the hero's italic "Before sleep" and lead lines.
**Body:** Jost 400 and 500.
**Arabic:** Amiri 400 and 700, right to left.

### Hierarchy
- **Display** (Cinzel 600, clamp 2.3rem to 4.1rem, 1.02): the hero h1 only, with "Before sleep" beneath in Cormorant italic at 0.78em in deep gold.
- **Headline** (Cinzel 600, clamp 1.9rem to 3rem, 1.08, balanced): every band heading.
- **Title** (Cormorant 1.4rem to 1.55rem): list terms, dua names, Design notes.
- **Body** (Jost 17px, relaxed, max about 60ch).
- **Caps** (Cinzel, 0.14em tracking, 13px): fieldset legends and the player's header labels only. Never above a heading.

### Named Rules
**The Verified Arabic Rule.** The only Arabic set on the site's own authority is دعاء. Every other Arabic string is a verified dua title from `lib/duas.ts` and renders only when present (Hayat-e-Qaaf has none until its spelling is confirmed).

## Layout

One centred container (max 1320px) with 16px gutters on mobile and 32px from the small breakpoint. Bands pad 96px, rising to 128px. Section order: Header, Hero, Frieze, How it works, Player band, Duas, Design, Colourways, Specs, Gifting, FAQ, Order (Frieze and builder), Footer.

At the large breakpoint bands split into asymmetric two-column grids: heading and lead on the narrow side, ruled list on the wide side. The hero is one viewport tall with copy at 0.92fr and the 3D stage at 1.08fr. The Design band centres both faces of the tag between two columns of notes that face it.

## Elevation & Depth

Flat. Bands are separated by tone and by the Frieze. Only physical objects cast shadows: the 3D tag's contact shadow (#3a2412), tag drawings (a soft umber drop) and phone frames.

## Shapes

All corners square, except play controls, colour swatches (split body over gold at 135deg) and phone frames. The tag outline (a stadium with a hanging hole, 35 by 70 mm, in `lib/tag.ts`) and its inner keel-arch panel are drawn from one shared geometry, so the 3D model, the SVG drawings and the player's Begin arch match.

## Components

### Buttons
- **Primary:** umber ground, ivory text, gold-bright leading icon, 14px by 24px. Hover to umber-3, press nudges 1px.
- **Secondary:** transparent, umber text, umber border at 35%; hover to full umber.
- **Header Pre-order:** gold-bright ground, umber text; hover to ivory.

### Chips and pills
Square, 1px border. On light grounds sand-2 or umber at 25%, selected fills umber with ivory text. On umber, ivory at 20%, selected fills gold-bright with umber text. Exposed as radios or pressed toggles.

### Header and Footer
Umber with lattice at gold 14%, a gold hairline below. Wordmark: دعاء in gold-bright beside "NFC Dua" in Cinzel caps.

### Phone Player (marketing)
A phone frame holding the night player: umber lattice header with the Arabic title and tag name, the hafti page inverted to warm light on dark (`invert(1) hue-rotate(180deg) sepia(0.22) brightness(0.9)` with screen blend), a hairline rail with a diamond thumb, "Page n of N" and times, and a round gold play button. The audio is the clock; pages switch at the timestamps in each dua's `pages.json` and crossfade over 700ms. The player band lets the visitor switch between every dua that has both a recitation and pages.

### Hero Tap Demo
The 3D tag (drag to turn it over, gentle idle sway). "Watch a tap" springs a phone in (stiffness 70, damping 17); on contact a gold ring pulses from the chip and the phone fades into the Phone Player, which starts the recitation. Reduced motion places the phone without travel.

### Tap Player (`/d/[slug]`)
The page the tag opens. Night by default (umber ground, inverted pages), day by the hour or by toggle. Audio first, with pages turning in step, a video view where a source video exists, speed, repeat, skip 10s and next page. When autoplay is blocked a Begin overlay frames the play disc inside the keel arch. `/d/joshan` redirects to today's part.

## Do's and Don'ts

### Do:
- **Do** write from inside the community.
- **Do** keep gold as the only accent, and use gold-bright only on umber.
- **Do** use lattice at the top, bottom and behind content, faded by a mask so text stays clean.
- **Do** draw every tag rendering from `lib/tag.ts` and `TagDrawing`.
- **Do** honour reduced motion.
- **Do** show missing media plainly ("The recitation for this dua is being added.").

### Don't:
- **Don't** fabricate dua text, Arabic, translation, recitation, reciter attribution or history.
- **Don't** use urgency marketing, invented prices or testimonials.
- **Don't** put eyebrows or kickers above headings.
- **Don't** use gradient text, em-dashes or emoji.
- **Don't** give interface elements shadows or rounded cards.
- **Don't** present recitations as a video feed. Pages and audio are the product; the video view is secondary.
