"use client";

import { useLayoutEffect, useRef } from "react";
import { MOTIFS } from "./motifs";
import { resolveMotifName } from "./resolveIllustration";

export default function SectionSketch({ topic, motif, tone = "navy" }) {
  const ref = useRef(null);
  const Art = MOTIFS[motif] || MOTIFS[resolveMotifName(topic)] || MOTIFS.orbit;

  useLayoutEffect(() => {
    const svg = ref.current?.querySelector("svg");
    if (!svg) return;
    svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
  }, [Art]);

  return (
    <div ref={ref} className={`section-sketch section-sketch--${tone}`} aria-hidden>
      <Art />
    </div>
  );
}
