import { ColourProvider } from "@/components/ColourProvider";
import { Hero } from "@/components/Hero";
import { Colourways } from "@/components/Colourways";
import { OrderBuilder } from "@/components/OrderBuilder";
import { PlayerShowcase } from "@/components/PlayerShowcase";
import { TagDrawing } from "@/components/TagDrawing";
import { Frieze, Lattice } from "@/components/Lattice";
import { COLOURWAYS, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/site";
import { DAYS, FACES, getDua } from "@/lib/duas";

const H2 = "font-display text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.08] font-semibold tracking-[0.005em] text-balance";

export default function Home() {
  return (
    <ColourProvider>
      <Header />
      <main>
        <Hero />
        <Frieze />
        <HowItWorks />
        <PlayerBand />
        <Duas />
        <Design />
        <ColourBand />
        <Specs />
        <Gifting />
        <Faq />
        <Order />
      </main>
      <Footer />
    </ColourProvider>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div className="relative overflow-hidden bg-umber">
        <Lattice className="text-gold/[0.16]" />
        <div className="relative mx-auto flex h-[4.25rem] max-w-[1320px] items-center justify-between px-4 sm:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="NFC Dua, back to top">
            <span className="arabic text-[1.7rem] leading-none font-bold text-gold-bright">دعاء</span>
            <span className="caps text-[13px] text-ivory">NFC Dua</span>
          </a>
          <nav className="flex items-center gap-1 text-[14px] sm:gap-7">
            <a href="#player" className="hidden text-sand-2 transition-colors hover:text-ivory md:inline">
              The player
            </a>
            <a href="#duas" className="hidden text-sand-2 transition-colors hover:text-ivory md:inline">
              Duas
            </a>
            <a href="#design" className="hidden text-sand-2 transition-colors hover:text-ivory md:inline">
              The design
            </a>
            <a href="#specs" className="hidden text-sand-2 transition-colors hover:text-ivory md:inline">
              Details
            </a>
            <a href="#order" className="bg-gold-bright px-4 py-2 text-umber transition-colors hover:bg-ivory">
              Pre-order
            </a>
          </nav>
        </div>
      </div>
      <div className="h-px bg-gold/70" />
    </header>
  );
}

function Band({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative scroll-mt-20 ${className}`}>
      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-8">{children}</div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      t: "Tap",
      d: "Hold the top of your phone to the tag, where it says Tap here. iPhones read it with the screen on. On Android, NFC needs to be switched on, as it is for tap-to-pay.",
    },
    {
      t: "Open",
      d: "The page for your dua opens and the recitation starts. No app, no account, no scrolling through videos. If the phone holds the sound back, one Begin button is waiting.",
    },
    {
      t: "Listen and reflect",
      d: "Read along as the pages turn, or lock the screen and lie back. It keeps playing. Slow it down, repeat it, or skip to a page.",
    },
  ];
  return (
    <Band id="how" className="bg-paper py-24 sm:py-32">
      <div className="max-w-2xl">
        <h2 className={`${H2} text-umber`}>One tap at the bedside. Then nothing else to do.</h2>
        <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-bark">
          A small NFC sticker is sealed inside the tag as it is printed. It holds one link: no battery, no data about you. Your phone does the rest.
        </p>
      </div>
      <ol className="mt-16 grid gap-y-12 md:grid-cols-3 md:gap-x-0">
        {steps.map((s, i) => (
          <li key={s.t} className={`relative md:px-10 ${i ? "md:border-l md:border-sand-2" : "md:pl-0"}`}>
            <div className="border-b border-sand-2 pb-4">
              <h3 className="caps text-[15px] text-umber">
                <span className="tabular mr-3 text-gold-deep">{String(i + 1).padStart(2, "0")}</span>
                {s.t}
              </h3>
            </div>
            <p className="mt-5 max-w-[40ch] leading-relaxed text-bark">{s.d}</p>
          </li>
        ))}
      </ol>
    </Band>
  );
}

function PlayerBand() {
  const features: [string, string][] = [
    ["Starts by itself", "Where the phone allows it. Otherwise one large Begin button, and nothing else to find."],
    ["The pages turn with it", "The hafti pages, in step with the recitation. Swipe to turn back a page and the audio follows."],
    ["Night and day", "A dark page with warm, inverted pages for a dark room. Paper and ink in the morning. It picks by the hour."],
    ["Speed and repeat", "Slower for learning, faster for review, pitch kept natural. Repeat loops the whole dua."],
    ["Skip", "Ten seconds back or forward, or straight to the next page."],
    ["Joshan by the day", "A Joshan tag opens the part for today, Sunday to Saturday, on its own."],
  ];
  return (
    <section id="player" className="relative scroll-mt-20 overflow-hidden bg-umber py-24 text-ivory sm:py-32">
      <Lattice className="text-gold/[0.09]" fade="linear-gradient(90deg, black, transparent 55%)" />
      <div className="relative mx-auto grid max-w-[1320px] items-center gap-16 px-4 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-24">
        <PlayerShowcase />
        <div>
          <h2 className={`${H2} text-ivory`}>What opens when you tap</h2>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-sand-2/85">
            A page made for a dark room and one hand. Large controls, no feed, no suggestions, nothing to scroll past.
          </p>
          <dl className="mt-12 divide-y divide-ivory/12 border-y border-ivory/12">
            {features.map(([t, d]) => (
              <div key={t} className="grid gap-1 py-5 sm:grid-cols-[12rem_1fr] sm:gap-6">
                <dt className="font-serif text-xl text-gold-bright">{t}</dt>
                <dd className="leading-relaxed text-sand-2/85">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Duas() {
  return (
    <Band id="duas" className="bg-ivory py-24 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-24">
        <div>
          <h2 className={`${H2} text-umber`}>The duas</h2>
          <p className="mt-5 max-w-[42ch] leading-relaxed text-bark">
            One dua per tag, engraved on its face. Recitations are added as each one is checked, and a tag already on your nightstand picks them up without being changed.
          </p>
        </div>
        <ul className="border-t border-sand-2">
          {FACES.map((f) => {
            const d = f.slug === "joshan" ? undefined : getDua(f.slug);
            const status =
              f.slug === "joshan"
                ? `Seven parts, ${DAYS[0]} to ${DAYS[6]}. The tag opens today's.`
                : d?.audio
                  ? `Recitation with ${d.pages?.length ?? 0} pages`
                  : "Recitation being added";
            return (
              <li key={f.id} className="flex items-center gap-5 border-b border-sand-2 py-6">
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-[1.6rem] leading-tight text-umber">{f.title}</p>
                  <p className="mt-1 text-sm text-bark">{status}</p>
                </div>
                {f.arabic ? (
                  <span className="arabic shrink-0 text-[1.9rem] leading-none font-bold text-gold-deep" lang="ar">
                    {f.arabic}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </Band>
  );
}

function Design() {
  const notes = [
    {
      t: "The keel arch",
      d: "The panel at the centre takes the pointed, full-shouldered arch of Fatimi Cairo, the arch of al-Aqmar's niches.",
    },
    {
      t: "Star-and-cross lattice",
      d: "Eight-point stars and the small crosses between them, raised over a darker ground, as in the carved and inlaid woodwork of old Cairo.",
    },
    {
      t: "Rosettes and gold line",
      d: "An interlaced eight-point rosette above the name and a smaller one at the foot, joined by a single gold line around the edge.",
    },
    {
      t: "The back",
      d: "Tap here, with phone. Before sleep, remember Allah. Set in gold, so the tag explains itself to anyone who picks it up.",
    },
  ];
  const ivory = COLOURWAYS[0];
  const green = COLOURWAYS[1];
  return (
    <section id="design" className="relative scroll-mt-20 overflow-hidden bg-sand py-24 sm:py-32">
      <Lattice className="text-umber/[0.06]" fade="radial-gradient(ellipse 60% 70% at 50% 50%, transparent 35%, black 90%)" />
      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="max-w-3xl">
          <h2 className={`${H2} text-umber`}>Drawn from al-Aqmar</h2>
          <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-umber-3">
            Al-Aqmar is the small Fatimi masjid on al-Mu&apos;izz Street in Cairo, completed in 1125 in the time of Imam al-Amir and restored by our community in the 1990s. The tag takes its arch and its line work from there, not from a pattern book.
          </p>
        </div>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-14">
          <div className="space-y-10 lg:text-right">
            {notes.slice(0, 2).map((n) => (
              <Note key={n.t} {...n} right />
            ))}
          </div>
          <div className="order-first mx-auto flex items-end gap-5 lg:order-none">
            <TagDrawing colourway={ivory} side="front" className="w-[min(38vw,190px)] drop-shadow-[0_26px_30px_rgb(74_52_33/0.3)]" title="Front of the tag" />
            <TagDrawing colourway={green} side="back" className="w-[min(30vw,150px)] drop-shadow-[0_22px_26px_rgb(74_52_33/0.3)]" title="Back of the tag" />
          </div>
          <div className="space-y-10">
            {notes.slice(2).map((n) => (
              <Note key={n.t} {...n} />
            ))}
          </div>
        </div>

        <p className="mt-16 max-w-[70ch] text-sm leading-relaxed text-bark">
          An interpretation for a modern object. No inscription is copied from the masjid. Further reading:{" "}
          <a className="underline hover:text-umber" href="https://en.wikipedia.org/wiki/Al-Aqmar_Mosque" target="_blank" rel="noopener noreferrer">
            al-Aqmar
          </a>
          ,{" "}
          <a className="underline hover:text-umber" href="https://www.metmuseum.org/essays/the-fatimid-caliphate-909-1171" target="_blank" rel="noopener noreferrer">
            The Met on Fatimi art
          </a>
          .
        </p>
      </div>
    </section>
  );
}

function Note({ t, d, right }: { t: string; d: string; right?: boolean }) {
  return (
    <div className={`lg:max-w-[34ch] ${right ? "lg:ml-auto" : ""}`}>
      <h3 className="font-serif text-[1.6rem] leading-tight text-umber">{t}</h3>
      <p className="mt-2 leading-relaxed text-umber-3">{d}</p>
    </div>
  );
}

function ColourBand() {
  return (
    <Band id="colours" className="bg-ivory py-24 sm:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className={`${H2} text-umber`}>Four colourways</h2>
        <p className="max-w-[44ch] leading-relaxed text-bark">
          Each with gold line work. Choose one and the tag at the top of the page turns to match, with the dua you picked.
        </p>
      </div>
      <div className="mt-10 mb-16 h-px bg-sand-2" />
      <Colourways />
    </Band>
  );
}

function Specs() {
  const rows: [string, string][] = [
    ["Size", "70 × 35 × 5 mm"],
    ["Hanging hole", "4.5 mm, for a cord or a hook by the lamp"],
    ["Inside", "A 25 mm NFC sticker, sealed in partway through printing"],
    ["Reading distance", "About 1 to 4 cm"],
    ["Phones", "iPhone XS and newer. Android phones with NFC switched on"],
    ["Power", "None. Nothing to charge, nothing to replace"],
    ["Material", "3D printed in PLA or PETG"],
    ["Keep it away from", "Metal directly behind it, which blocks the signal"],
    ["Price", "Shared on WhatsApp when you pre-order"],
  ];
  return (
    <Band id="specs" className="bg-paper py-24 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-24">
        <div>
          <h2 className={`${H2} text-umber`}>The details</h2>
          <p className="mt-5 max-w-[40ch] leading-relaxed text-bark">These are pre-order pieces. Where something is not final yet, it says so.</p>
        </div>
        <dl className="divide-y divide-sand-2 border-y border-sand-2">
          {rows.map(([k, v]) => (
            <div key={k} className="grid gap-1 py-5 sm:grid-cols-[13rem_1fr] sm:gap-6">
              <dt className="text-bark">{k}</dt>
              <dd className="text-umber">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Band>
  );
}

function Gifting() {
  const [ivory, green, navy] = COLOURWAYS;
  const kamil = FACES[0];
  return (
    <section id="gifting" className="relative overflow-hidden bg-umber-2 py-24 text-ivory sm:py-32">
      <Lattice className="text-gold/[0.08]" fade="linear-gradient(270deg, black, transparent 60%)" />
      <div className="relative mx-auto grid max-w-[1320px] items-center gap-14 px-4 sm:px-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <h2 className={`${H2} text-ivory`}>For a new home, a nikah, or an elder who listens more than reads.</h2>
          <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-sand-2/85">
            Whoever you give it to needs nothing set up. They hold their phone to it and it plays. Because the tag holds a link and not the audio, a better recording can replace the old one later and the tag on their nightstand keeps working.
          </p>
          <a
            href={whatsappLink("Salaam. I'd like to ask about the bedside NFC tag as a gift.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex items-center gap-2 border-b border-gold-bright pb-1 text-gold-bright transition-colors hover:text-ivory"
          >
            Ask about gifting several
          </a>
        </div>
        <div className="relative mx-auto flex w-full max-w-[400px] items-end justify-center" aria-hidden>
          <TagDrawing colourway={green} face={kamil} className="w-[32%] -rotate-[8deg] drop-shadow-[0_24px_24px_rgb(0_0_0/0.45)]" />
          <TagDrawing colourway={ivory} face={kamil} className="relative z-10 -mx-3 w-[38%] drop-shadow-[0_30px_30px_rgb(0_0_0/0.5)]" />
          <TagDrawing colourway={navy} face={kamil} className="w-[32%] rotate-[7deg] drop-shadow-[0_24px_24px_rgb(0_0_0/0.45)]" />
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const items = [
    {
      q: "Does it work on my phone?",
      a: "iPhone XS and later read NFC tags without opening any app; the screen just needs to be on. Most Android phones from the last several years have NFC; it must be switched on in settings and the phone unlocked.",
    },
    {
      q: "Why didn't the sound start by itself?",
      a: "Some browsers only allow sound after you touch the screen once. The page shows one large Begin button for this. One touch and it plays.",
    },
    {
      q: "Whose recitation is it, and who checked the text?",
      a: "Each dua's text and recitation are confirmed with you before your tag is made, and the page names the recording's source where we have it.",
    },
    {
      q: "Can I change which dua my tag opens?",
      a: "Yes. The tag holds a link, so what plays can be changed on our side without touching the tag. Message us on WhatsApp.",
    },
    {
      q: "Does it need charging or Wi-Fi?",
      a: "The tag needs no power at all. Your phone needs an internet connection to load the page and the recitation.",
    },
    {
      q: "When will it ship?",
      a: "We are taking pre-orders to decide how many to make. You get a date on WhatsApp before you pay anything.",
    },
  ];
  return (
    <Band id="faq" className="bg-ivory py-24 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-24">
        <h2 className={`${H2} text-umber`}>Questions</h2>
        <div className="divide-y divide-sand-2 border-y border-sand-2">
          {items.map((it) => (
            <details key={it.q} className="group py-1">
              <summary className="flex items-center justify-between gap-6 py-5 font-serif text-[1.35rem] text-umber transition-colors hover:text-gold-deep">
                {it.q}
                <span className="relative size-3.5 shrink-0 text-gold-deep" aria-hidden>
                  <span className="absolute top-1/2 left-0 h-px w-full bg-current" />
                  <span className="absolute top-0 left-1/2 h-full w-px bg-current transition-transform duration-300 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="max-w-[64ch] pb-6 leading-relaxed text-bark">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Band>
  );
}

function Order() {
  return (
    <section id="order" className="relative scroll-mt-20 bg-sand">
      <Frieze />
      <div className="mx-auto max-w-[1320px] px-4 py-24 sm:px-8 sm:py-28">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.04] font-semibold text-umber">Pre-order yours</h2>
          <p className="max-w-[46ch] leading-relaxed text-umber-3">
            Choose below and WhatsApp opens with your order written out. We reply with the price and a date. Nothing is charged until you agree.
          </p>
        </div>
        <OrderBuilder />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-umber text-sand-2">
      <div className="h-px bg-gold/70" />
      <Lattice className="text-gold/[0.12]" />
      <div className="relative mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-6 px-4 py-14 text-sm sm:px-8">
        <span className="flex items-center gap-3">
          <span className="arabic text-3xl leading-none font-bold text-gold-bright">دعاء</span>
          <span className="caps text-[13px] text-ivory">NFC Dua</span>
        </span>
        <a href={whatsappLink("Salaam. I have a question about the bedside NFC tag.")} className="transition-colors hover:text-ivory" target="_blank" rel="noopener noreferrer">
          WhatsApp {WHATSAPP_DISPLAY}
        </a>
      </div>
    </footer>
  );
}
