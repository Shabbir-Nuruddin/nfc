/**
 * The star-and-cross strapwork as a ground. `fade` softens it into the page with a
 * mask on a wrapper, so the pattern sits behind content instead of competing with it.
 */
export function Lattice({ className = "", fade }: { className?: string; fade?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0" style={fade ? { maskImage: fade, WebkitMaskImage: fade } : undefined} aria-hidden>
      <div className={`lattice ${className}`} />
    </div>
  );
}

/** A band of umber strapwork between gold hairlines, as on the head and foot of the sheets. */
export function Frieze({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden>
      <div className="h-px bg-gold/60" />
      <div className="relative mt-[3px] h-9 overflow-hidden bg-umber sm:h-11">
        <div className="lattice text-gold/[0.32]" />
      </div>
      <div className="mt-[3px] h-px bg-gold/60" />
    </div>
  );
}
