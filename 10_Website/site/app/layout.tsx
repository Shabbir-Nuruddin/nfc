import type { Metadata, Viewport } from "next";
import { Amiri, Cinzel, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-cinzel", display: "swap" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const jost = Jost({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jost", display: "swap" });
const amiri = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-amiri", display: "swap" });

export const metadata: Metadata = {
  title: "Bedside NFC Tag: before sleep, one tap",
  description:
    "A bedside tag with your dua's name in Arabic. Tap it with your phone and the recitation plays, with the words beside it. No app, no battery.",
};

export const viewport: Viewport = {
  themeColor: "#24180f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${jost.variable} ${amiri.variable}`}>
      <body>{children}</body>
    </html>
  );
}
