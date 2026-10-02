import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { DUAS, getDua } from "@/lib/duas";
import { Player } from "@/components/Player";

export const viewport: Viewport = {
  themeColor: "#24180f",
  viewportFit: "cover",
};

export function generateStaticParams() {
  return DUAS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const dua = getDua(slug);
  return {
    title: dua ? `${dua.title} · NFC Dua` : "NFC Dua",
    // Reached only from an NFC tag. Never linked from the site, never indexed.
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  };
}

export default async function TapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dua = getDua(slug);
  if (!dua) notFound();
  return <Player dua={dua} />;
}
