# NFC Dua — Master Context

Status date: 2026-09-28
Owner: Shabbir
Agent: NFC (OpenMausBot)

Every line below carries a label. Unlabelled content is a bug.

Label key: VERIFIED | USER PREFERENCE | HYPOTHESIS | ESTIMATE | UNKNOWN | ASSUMPTION | DECISION | REJECTED

---

## 1. Business identity

- VERIFIED — Business name: NFC Dua.
- VERIFIED — Core concept: a physical NFC product that a user taps with a smartphone to reach verified religious audio/content.
- VERIFIED — Target community: Dawoodi Bohra specifically. Not "generic Muslim, labelled Bohra."
- DECISION — Do not assume "Islamic = Dawoodi Bohra." Generic Muslim product + Bohra label is a failure mode, not a shortcut.
- DECISION — No fear-based religious marketing. No unsupported religious promises. Never imply buying the product makes someone more religious. Never manufacture urgency from religious sentiment.

## 2. Use case

- HYPOTHESIS (UNTESTED) — Strongest use case is BEFORE SLEEP and/or AFTER WAKING.
- HYPOTHESIS (UNTESTED) — A physical object can anchor a real daily routine: object -> tap -> content -> repeat daily use.
- UNKNOWN — Whether users will actually use it nightly/reliably. This is the single largest unvalidated assumption in the business. Nothing in the charter assumes it.
- UNKNOWN — Whether the community already satisfies this need through existing apps, audio, masjids, or family practice.

## 3. Content direction

- HYPOTHESIS — Initial content directions: Dua Kamil, Nasrul Mahaba, Hayat-e-Qaaf.
- UNKNOWN — Whether these are the right three. Prioritised by no user evidence yet.
- UNKNOWN — Which authoritative Dawoodi Bohra source owns/authorises each text, translation, transliteration and recitation.
- UNKNOWN — Whether any licence or permission is required to distribute the audio commercially.

## 4. Product direction

- HYPOTHESIS — MVP is a low-cost physical NFC product. A keychain was selected as the early lower-cost MVP direction.
- HYPOTHESIS — A bedside NFC product fits the sleep/waking use case better long-term.
- HYPOTHESIS — Future premium line: bedside object / multi-Dua product. A tray was considered as a future scalable/premium bundle.
- UNKNOWN — Final physical form. No shape is decided. It must be validated against cultural relevance, use case, manufacturing, cost, durability, NFC reliability, user behaviour, aesthetics, giftability.
- REJECTED — Generic Bohra medallion / necklace concept. Do not return to it unless Shabbir explicitly asks.
- REJECTED — "Generic Islamic geometry" used merely to look culturally appropriate.
- REJECTED — A plastic tag with an NFC sticker stuck on it. The object must have a reason to exist even though its function is digital.
- DECISION — 3D printing is a prototyping method, not an assumed production method.

## 5. Resources (VERIFIED)

- VERIFIED — Shabbir has NFC tags in hand.
- VERIFIED — Access to university 3D printing.
- VERIFIED — Ability to build a custom landing page / website.
- DECISION — Prototype fast with these. Do not assume production tooling.

## 6. Religious accuracy — HARD RULE

- DECISION — Never fabricate Dua text, Arabic, translation, transliteration, audio, recitation, religious attribution, rulings, authority, historical claims, or community practices.
- DECISION — If religious content is uncertain: mark it UNKNOWN and research it.
- DECISION — Do not rely on a generic Islamic website just because it contains similar material. Prioritise authoritative sources relevant to Dawoodi Bohra.
- DECISION — Never present an interpretation as religious fact.

## 7. Agent team — HONEST STATUS

- VERIFIED — The charter names 18 specialist roles.
- VERIFIED — The currently reachable OpenMausBot team is 3 general assistants: D2C, CoolVest CEO, Opal Jewelry. None are scoped to Bohra cultural research, religious verification, NFC hardware, or unit economics.
- UNKNOWN — Whether a Chief of Staff is reachable to stand up the 18 named specialist bots.
- ASSUMPTION — Until real specialists exist, specialist-level analysis is done by me and labelled HYPOTHESIS, never presented as a validated specialist opinion.

## 8. Validation discipline

- DECISION — "People liked the idea" is not demand. Record actual evidence per experiment.
- DECISION — Every experiment: hypothesis -> test -> metric -> result -> continue/modify/reject.
- DECISION — Never convert an experiment result into a permanent fact.

---

## Open questions, ranked by how much they block the MVP

1. Do Dawoodi Bohra users actually want a physical object for this, or is a free app enough? (demand)
2. Will they use it repeatedly, or is the first tap the last tap? (retention)
3. Is bedside the right form, or is a portable object (keychain) the honest one? (product)
4. Who authorises the Dua text and recitation commercially? (blocking, legal/religious)
5. What is the target price band the community will actually pay? (economics)

## Current priority

Cheapest test that answers #1 and #2 together: a single-page landing page with a redirect-NFC tag in a rough 3D-printed form, tracking taps and repeat scans, run against a small real sample of community members. Do not manufacture inventory first.
