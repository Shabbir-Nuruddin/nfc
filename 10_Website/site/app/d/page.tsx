import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { FACES, getDua } from "@/lib/duas";

export const metadata: Metadata = {
  title: "Before sleep · NFC Dua",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#24180f", viewportFit: "cover" };

/** For a tag set to open the list rather than one dua. */
export default function ChooseDua() {
  return (
    <div className="min-h-[100dvh] bg-paper text-ink">
      <header className="relative overflow-hidden bg-umber px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-8 text-center text-ivory">
        <div className="lattice text-gold/[0.13]" aria-hidden />
        <p className="arabic relative text-[2.6rem] leading-tight font-bold text-gold-bright">دعاء</p>
        <h1 className="caps relative mt-1 text-[15px]">Before sleep</h1>
      </header>
      <div className="h-px bg-gold/70" aria-hidden />
      <div className="mt-[3px] h-px bg-gold/30" aria-hidden />

      <main className="mx-auto max-w-[560px] px-5 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <h2 className="caps text-[13px] text-bark">Choose your dua</h2>
        <ul className="mt-4 divide-y divide-sand-2 border-y border-sand-2">
          {FACES.map((f) => {
            const d = f.slug === "joshan" ? undefined : getDua(f.slug);
            const ready = f.slug === "joshan" ? false : Boolean(d?.audio);
            return (
              <li key={f.id}>
                <Link href={`/d/${f.slug}`} className="group flex items-center gap-4 py-4 transition-colors hover:bg-ivory">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[17px]">{f.title}</span>
                    <span className="mt-0.5 block text-[13px] text-bark">
                      {f.slug === "joshan" ? "Today's part" : ready ? "Recitation and pages" : "Recitation to be added"}
                    </span>
                  </span>
                  {f.arabic ? <span className="arabic text-2xl font-bold text-gold-deep">{f.arabic}</span> : null}
                  <CaretRight size={18} className="text-bark transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
