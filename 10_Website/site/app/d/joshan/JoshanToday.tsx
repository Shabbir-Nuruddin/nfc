"use client";

import { useEffect } from "react";
import { DAYS } from "@/lib/duas";

export function JoshanToday() {
  useEffect(() => {
    const day = DAYS[new Date().getDay()].toLowerCase();
    location.replace(`/d/joshan-${day}${location.search}`);
  }, []);
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-umber text-ivory">
      <p className="arabic text-4xl font-bold text-gold-bright">دعاء الجوشن</p>
    </main>
  );
}
