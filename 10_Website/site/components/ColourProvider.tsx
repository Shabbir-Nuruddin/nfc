"use client";

import { createContext, useContext, useState } from "react";
import { COLOURWAYS, type Colourway } from "@/lib/site";
import { FACES, type Face } from "@/lib/duas";

type Ctx = {
  colourway: Colourway;
  setColourway: (id: string) => void;
  /** The dua engraved on the tag. Shared by the 3D tag, the drawings and the order. */
  face: Face;
  setFace: (id: string) => void;
};

const ColourContext = createContext<Ctx | null>(null);

export function ColourProvider({ children }: { children: React.ReactNode }) {
  const [id, setId] = useState(COLOURWAYS[0].id);
  const [faceId, setFaceId] = useState(FACES[0].id);
  const colourway = COLOURWAYS.find((c) => c.id === id) ?? COLOURWAYS[0];
  const face = FACES.find((f) => f.id === faceId) ?? FACES[0];
  return (
    <ColourContext.Provider value={{ colourway, setColourway: setId, face, setFace: setFaceId }}>{children}</ColourContext.Provider>
  );
}

export function useColourway() {
  const ctx = useContext(ColourContext);
  if (!ctx) throw new Error("useColourway must be used inside ColourProvider");
  return ctx;
}
