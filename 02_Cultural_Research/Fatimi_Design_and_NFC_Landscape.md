# Fatimi design sources and the NFC dua product landscape

This research sits behind the NFC Dua website (`10_Website/site`). Verify every claim against its source before you use it in marketing. Nothing here is religious guidance. Dua text, translation and recitation must come from the client or a qualified source, never from this file.

## 1. Fatimi (Fatimid) design: what the tag borrows

### Al-Aqmar Mosque, Cairo
- A small Fatimid mosque on al-Mu'izz Street, completed in 1125 under the Fatimi Imam al-Amir.
- It is known for the carved stone facade, one of the earliest in Cairo with decorated stone. The main features are a large central medallion pierced with an inscription and keel-arched niches with ribbed hoods.
- Our community restored it in the 1990s (Wikipedia). The widely covered 2023 reopening after our restoration on al-Mu'izz Street was of the **al-Hakim** Mosque, not al-Aqmar, so do not attach that date to al-Aqmar.
- Sources: Wikipedia, "Al-Aqmar Mosque"; The National and Egypt Independent (al-Hakim reopening, for context).

### Keel arch
- A pointed arch with full shoulders. It is characteristic of Fatimid Cairo and appears on al-Aqmar's niches.
- On the tag it is the outline of the body.

### Pierced medallion
- The round medallion at the centre of al-Aqmar's facade.
- On the tag it is the tap target, where the NFC chip sits behind the inlay ring. The tag copies no inscription from the mosque. Its only Arabic is the word دعاء (dua).

### Tiraz
- Tiraz was textile, often linen with silk, woven or embroidered with a band of inscription. Fatimid Egypt made it, and it is well represented in museum collections.
- On the tag it is a band of lattice pattern with no lettering.
- Source: The Met, Heilbrunn Timeline essay on Fatimid art.

### Saifee Masjid, Mumbai
- A Dawoodi Bohra mosque in Mumbai, kept as context for the community's architectural vocabulary. No design element was taken from it.
- Source: Wikipedia, "Saifee Masjid".

### What we did not claim
- That the colour names (Indigo, Madder, Kohl, Linen) are historical Fatimid dye names. They are descriptive only.
- Any rule about when or how the dua is recited.
- Any endorsement by the community or its leadership.

## 2. NFC and bedside dua products seen in the market

| Product | What it does | Note |
|---|---|---|
| mwm.ai Adhkar NFC | NFC tags that open adhkar content on a tap | Closest functional competitor. App-led. |
| furqaanbookstore | Islamic gift retailer with dua and adhkar products | Reference for the gifting price tier and packaging. |
| MakerWorld NFC keyring | Printable NFC keyring models | Shows how cheap a printed housing with an embedded chip can be. Useful for prototyping. |
| Logos Tap | Branded NFC tap products | Reference for how a URL is encoded and managed. |
| Tapogram | NFC gift tags that link to media | Reference for the "tap to play a message" gifting idea. |

### Gaps NFC Dua fills
- **No app or account.** The tag holds only a URL to `/d/<slug>`. iPhones read it in the background; Android needs NFC turned on.
- **Built for a bedside.** It stands upright (the keel-arch body) and the player is dark, large-type and autoplaying.
- **Recognisably Fatimi.** It takes its forms from al-Aqmar rather than the generic eight-point star found on most Islamic gifts.

## 3. Technical notes
- **Chip:** NTAG213 (144 bytes) is enough for `https://<domain>/d/before-sleep?t=<tagId>`. Lock the tag after writing it.
- **Housing:** metal or a dense resin body under the chip will block reads. The medallion inlay must be non-metallic, or the chip must sit in front of any metal.
- **Autoplay:** browsers can block autoplay with sound, so the player falls back to one large Begin button.
