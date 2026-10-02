import type { Metadata } from "next";
import { JoshanToday } from "./JoshanToday";

export const metadata: Metadata = {
  title: "Dua-e-Joshan · NFC Dua",
  robots: { index: false, follow: false },
};

/** A Joshan tag carries one link. The phone's own day picks the part. */
export default function JoshanPage() {
  return <JoshanToday />;
}
