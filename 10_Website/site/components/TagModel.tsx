"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, PresentationControls } from "@react-three/drei";
import type { Colourway } from "@/lib/site";
import { TAG, outlinePoints } from "@/lib/tag";
import { TagDrawing, tagTexts, type TagFace } from "./TagDrawing";

const S = 0.05; // millimetres to scene units
const BEVEL = 0.45;
const PX = 24; // texture pixels per millimetre
// The drawing's viewBox: -18.5 -1 37 72
const VB = { x: -18.5, y: -1, w: 37, h: 72 };

/** The stadium, shrunk by the bevel so the finished piece measures 35 x 70. Scene y runs up. */
function buildShape() {
  const pts = outlinePoints(BEVEL).map(([x, y]) => new THREE.Vector2(x, TAG.height / 2 - y));
  const shape = new THREE.Shape(pts.reverse());
  const hole = new THREE.Path();
  hole.absarc(0, TAG.height / 2 - TAG.hole.y, TAG.hole.r + BEVEL, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  return shape;
}

/** Everything black except the gold, which is white: drives the metalness of the line work. */
function maskOf(c: Colourway): Colourway {
  const k = "#000000";
  return { ...c, body: k, lattice: k, wellTop: k, wellBottom: k, ink: k, gold: "#ffffff" };
}

function loadSvg(markup: string) {
  const svg = markup.replace("<svg ", `<svg width="${VB.w * PX}" height="${VB.h * PX}" `);
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return img.decode().then(() => img);
}

/**
 * Draws one face to a canvas: the shapes from the same SVG the page uses, then the
 * lettering with the page's own fonts, so the Arabic is shaped by the browser.
 */
async function paintFace(c: Colourway, face: TagFace, side: "front" | "back") {
  const cv = document.createElement("canvas");
  cv.width = VB.w * PX;
  cv.height = VB.h * PX;
  const g = cv.getContext("2d")!;
  const img = await loadSvg(renderToStaticMarkup(<TagDrawing colourway={c} face={face} side={side} text={false} />));
  g.drawImage(img, 0, 0, cv.width, cv.height);

  const root = getComputedStyle(document.documentElement);
  const display = root.getPropertyValue("--font-cinzel").trim() || "Cinzel";
  const arabic = root.getPropertyValue("--font-amiri").trim() || "Amiri";
  await Promise.all([document.fonts.load(`600 40px ${display}`), document.fonts.load(`700 40px ${arabic}`)]).catch(() => null);

  g.textAlign = "center";
  g.textBaseline = "alphabetic";
  for (const l of tagTexts(c, face, side)) {
    const size = l.size * PX;
    g.font = l.font === "arabic" ? `700 ${size}px ${arabic}` : `600 ${size}px ${display}`;
    g.direction = l.font === "arabic" ? "rtl" : "ltr";
    (g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${l.spacing * size}px`;
    g.fillStyle = l.fill;
    // letterSpacing adds a trailing gap; shift by half of it to stay centred
    const nudge = l.spacing ? (l.spacing * size) / 2 : 0;
    g.fillText(l.text, (0 - VB.x) * PX + nudge, (l.y - VB.y) * PX);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

type Faces = { front: THREE.Texture; frontMetal: THREE.Texture; back: THREE.Texture; backMetal: THREE.Texture };

function useFaces(c: Colourway, face: TagFace) {
  const [faces, setFaces] = useState<Faces | null>(null);
  useEffect(() => {
    let live = true;
    const m = maskOf(c);
    Promise.all([paintFace(c, face, "front"), paintFace(m, face, "front"), paintFace(c, face, "back"), paintFace(m, face, "back")])
      .then(([front, frontMetal, back, backMetal]) => {
        if (live) setFaces({ front, frontMetal, back, backMetal });
        else [front, frontMetal, back, backMetal].forEach((t) => t.dispose());
      })
      .catch(() => null);
    return () => {
      live = false;
    };
  }, [c, face]);
  useEffect(
    () => () => {
      if (faces) Object.values(faces).forEach((t) => t.dispose());
    },
    [faces],
  );
  return faces;
}

function Tag({ c, face, tapping }: { c: Colourway; face: TagFace; tapping: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const tapStart = useRef(-1);
  const faces = useFaces(c, face);

  const bodyGeo = useMemo(() => {
    const depth = TAG.depth - BEVEL * 2;
    const g = new THREE.ExtrudeGeometry(buildShape(), {
      depth,
      bevelEnabled: true,
      bevelThickness: BEVEL,
      bevelSize: BEVEL,
      bevelSegments: 4,
      curveSegments: 12,
    });
    g.translate(0, 0, -depth / 2);
    return g;
  }, []);

  const front = TAG.depth / 2 + 0.02;
  const planeY = TAG.height / 2 - (VB.y + VB.h / 2);
  const chipY = TAG.height / 2 - TAG.chip.y;

  useEffect(() => {
    if (tapping) tapStart.current = -2;
  }, [tapping]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.33) * 0.3;
      group.current.rotation.x = Math.sin(t * 0.25) * 0.05 - 0.03;
      group.current.position.y = Math.sin(t * 0.55) * 0.03;
    }
    if (tapStart.current === -2) tapStart.current = t;
    if (pulse.current) {
      const m = pulse.current.material as THREE.MeshBasicMaterial;
      if (tapStart.current > 0) {
        const k = (t - tapStart.current) / 1.5;
        if (k > 1) {
          tapStart.current = -1;
          m.opacity = 0;
        } else {
          const e = 1 - Math.pow(1 - k, 3);
          pulse.current.scale.setScalar(0.4 + e * 1.2);
          m.opacity = (1 - k) * 0.9;
        }
      }
    }
  });

  const faceMat = (map: THREE.Texture, metal: THREE.Texture) => (
    <meshPhysicalMaterial
      map={map}
      metalnessMap={metal}
      metalness={1}
      roughness={0.42}
      clearcoat={0.35}
      clearcoatRoughness={0.4}
      transparent
      alphaTest={0.5}
    />
  );

  return (
    <group ref={group} scale={S}>
      <mesh geometry={bodyGeo} castShadow>
        <meshPhysicalMaterial color={c.body} roughness={0.5} clearcoat={0.3} clearcoatRoughness={0.45} />
      </mesh>
      {faces ? (
        <>
          <mesh position={[0, planeY, front]}>
            <planeGeometry args={[VB.w, VB.h]} />
            {faceMat(faces.front, faces.frontMetal)}
          </mesh>
          <mesh position={[0, planeY, -front]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[VB.w, VB.h]} />
            {faceMat(faces.back, faces.backMetal)}
          </mesh>
        </>
      ) : null}
      <mesh ref={pulse} position={[0, chipY, front + 0.5]}>
        <ringGeometry args={[TAG.chip.r - 0.35, TAG.chip.r + 0.35, 96]} />
        <meshBasicMaterial color="#d0aa5a" transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function TagModel({ colourway, face, tapping = false }: { colourway: Colourway; face: TagFace; tapping?: boolean }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.1, 8.2], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
      aria-label="3D model of the tag. Drag to turn it over."
      role="img"
    >
      <ambientLight intensity={0.5} color="#fff4e2" />
      <directionalLight position={[2.5, 4, 5]} intensity={1.5} color="#fff1dc" castShadow />
      <pointLight position={[-3, 1, 2.5]} intensity={5} color="#f1cf8a" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.2} color="#fff3e0" position={[0, 3, 4]} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#f0dcc0" position={[-4, 0, 2]} scale={[2, 6, 1]} />
        <Lightformer form="ring" intensity={1.4} color="#d9b066" position={[4, 1, -2]} scale={2} />
      </Environment>
      <PresentationControls
        global={false}
        cursor
        snap
        speed={1.4}
        rotation={[0, 0, 0]}
        polar={[-0.4, 0.4]}
        azimuth={[-Math.PI, Math.PI]}
      >
        <Tag c={colourway} face={face} tapping={tapping} />
      </PresentationControls>
      <ContactShadows position={[0, -1.95, 0]} opacity={0.4} scale={6} blur={2.6} far={3} color="#3a2412" />
    </Canvas>
  );
}
