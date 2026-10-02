import { WHATSAPP_DISPLAY, whatsappLink } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="relative grid min-h-[100dvh] place-items-center overflow-hidden bg-umber px-6 text-center text-ivory">
      <div className="lattice text-gold/[0.1]" aria-hidden />
      <div className="relative">
        <p className="arabic text-5xl font-bold text-gold-bright">دعاء</p>
        <h1 className="caps mt-6 text-lg">This tag isn&apos;t linked yet</h1>
        <p className="mx-auto mt-3 max-w-[40ch] leading-relaxed text-sand-2/80">
          Message us on WhatsApp with a photo of the tag and we will link it to its dua.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={whatsappLink("Salaam. My tag opens a page saying it isn't linked yet.")}
            className="bg-gold-bright px-5 py-3 text-umber transition-colors hover:bg-ivory"
          >
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
          <a href="/" className="border border-gold-bright/60 px-5 py-3 text-gold-bright transition-colors hover:border-gold-bright">
            About the tag
          </a>
        </div>
      </div>
    </main>
  );
}
