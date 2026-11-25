"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { useGetPublishedHomepageQuery } from "@/redux/features/cms/homepageApi";
import SectionShell from "@/components/layouts/SectionShell";
import FeatureCardArt, { featureKind } from "@/components/homepage/FeatureCardArt";

// Orthogonal route with 45° chamfers between two points: down, across, down.
function circuitSegment(from, to) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  if (Math.abs(x1 - x2) < 2) return `M${x1} ${y1}V${y2}`;
  const midY = (y1 + y2) / 2;
  const dir = x2 < x1 ? -1 : 1;
  const r = Math.max(0, Math.min(22, (y2 - y1) / 2 - 2, Math.abs(x2 - x1) / 2));
  return [
    `M${x1} ${y1}`,
    `V${midY - r}`,
    `L${x1 + dir * r} ${midY}`,
    `H${x2 - dir * r}`,
    `L${x2} ${midY + r}`,
    `V${y2}`,
  ].join("");
}

function useCircuit(stageRef, cardRefs, ready) {
  const [circuit, setCircuit] = useState(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || !ready) return undefined;
    const measure = () => {
      const base = stage.getBoundingClientRect();
      const boxes = cardRefs.current.map((node) => node?.getBoundingClientRect());
      if (boxes.length < 2 || boxes.some((box) => !box)) return;
      const segments = [];
      const nodes = [];
      for (let i = 0; i < boxes.length - 1; i += 1) {
        const a = boxes[i];
        const b = boxes[i + 1];
        const from = [Math.round(a.left + a.width / 2 - base.left), Math.round(a.bottom - base.top)];
        const to = [Math.round(b.left + b.width / 2 - base.left), Math.round(b.top - base.top)];
        segments.push(circuitSegment(from, to));
        nodes.push(from, to);
      }
      setCircuit({
        width: Math.round(base.width),
        height: Math.round(base.height),
        d: segments.join(""),
        nodes,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    cardRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [stageRef, cardRefs, ready]);

  return circuit;
}

export default function AboutSection({ surface = "bg-cream" }) {
  const { data, isLoading, isError, refetch } = useGetPublishedHomepageQuery();
  const about = data?.about;
  const highlights = (about?.highlights || []).slice(0, 3);

  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const [live, setLive] = useState(false);
  const circuit = useCircuit(stageRef, cardRefs, Boolean(about));

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLive(true);
        observer.disconnect();
      },
      { threshold: 0.3 }
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, [about]);

  return (
    <section className={`section about-circuit-section ${surface}`}>
      <SectionShell>
        {isLoading && (
          <p className="flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
            Loading about…
          </p>
        )}

        {isError && (
          <div className="card mx-auto max-w-lg p-8 text-center">
            <p className="font-semibold text-ink-900">Could not load about content.</p>
            <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {about && (
          <div ref={stageRef} className={`about-circuit${live ? " is-live" : ""}`}>
            {circuit ? (
              <svg
                className="about-circuit-path"
                width={circuit.width}
                height={circuit.height}
                viewBox={`0 0 ${circuit.width} ${circuit.height}`}
                aria-hidden
              >
                <path className="about-circuit-track" d={circuit.d} pathLength="1" />
                <path className="about-circuit-draw" d={circuit.d} pathLength="1" />
                <path className="about-circuit-pulse" d={circuit.d} pathLength="1" />
                {circuit.nodes.map(([x, y], index) => (
                  <g key={index} className="about-circuit-node" style={{ "--node": index }}>
                    <circle cx={x} cy={y} r="7" className="about-circuit-node-halo" />
                    <circle cx={x} cy={y} r="3.2" />
                  </g>
                ))}
              </svg>
            ) : null}

            <div className="about-circuit-head">
              <span className="eyebrow">{about.eyebrow}</span>
              <h2 className="section-title mt-4">
                {about.title}{" "}
                {about.highlight ? <span className="text-gradient">{about.highlight}</span> : null}
              </h2>
            </div>

            {highlights.map(({ label, text }, index) => {
              return (
                <article
                  key={`${label}-${index}`}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  className={`about-circuit-card about-circuit-card--${index + 1}`}
                  style={{ "--step": index }}
                >
                  <span className="about-circuit-index">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="about-circuit-title">{label}</h3>
                  {text ? <p className="about-circuit-text">{text}</p> : null}
                  <span className="about-circuit-art">
                    <FeatureCardArt kind={featureKind(label, text, index)} />
                  </span>
                </article>
              );
            })}

            <div className="about-circuit-story">
              {about.badge_value ? (
                <p className="about-circuit-badge">
                  <strong>{about.badge_value}</strong>
                  <span>{about.badge_label}</span>
                </p>
              ) : null}
              <p className="about-circuit-body">{about.body}</p>
              {about.cta_label ? (
                <Link href={about.cta_href || "/contact"} className="btn btn-primary mt-6">
                  {about.cta_label}
                  <ArrowRight size={18} className="btn-icon" />
                </Link>
              ) : null}
            </div>
          </div>
        )}
      </SectionShell>
    </section>
  );
}
