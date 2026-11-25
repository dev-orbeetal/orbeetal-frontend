"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useGetPublishedHomepageQuery } from "@/redux/features/cms/homepageApi";
import SectionShell from "@/components/layouts/SectionShell";
import { resolveMethodSteps } from "./methodSteps";

// Smooth rising line through the centres of the step cards, extended a little
// before the first card and past the last one (where the arrow head sits).
function useStairLine(stageRef, cardRefs, count) {
  const [line, setLine] = useState(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || !count) return undefined;
    const measure = () => {
      const base = stage.getBoundingClientRect();
      const points = cardRefs.current
        .slice(0, count)
        .map((node) => node?.getBoundingClientRect())
        .filter(Boolean)
        .map((box) => [box.left + box.width / 2 - base.left, box.top + box.height / 2 - base.top]);
      if (points.length < 2) return;
      const first = points[0];
      const second = points[1];
      const last = points[points.length - 1];
      const beforeLast = points[points.length - 2];
      const lead = [first[0] - (second[0] - first[0]) * 0.55, first[1] - (second[1] - first[1]) * 0.55];
      // Run past the last card toward the arrow, but keep the arrow inside the stage.
      const dx = last[0] - beforeLast[0];
      const room = dx > 0 ? (base.width - 4 - last[0]) / dx : 0.62;
      const reach = Math.max(0.25, Math.min(0.62, room));
      const tail = [last[0] + dx * reach, last[1] + (last[1] - beforeLast[1]) * reach];
      const all = [lead, ...points, tail].map(([x, y]) => [Math.round(x), Math.round(y)]);
      // Catmull-Rom → cubic Bézier for a gentle, continuous curve.
      let d = `M${all[0][0]} ${all[0][1]}`;
      for (let i = 0; i < all.length - 1; i += 1) {
        const p0 = all[i - 1] || all[i];
        const p1 = all[i];
        const p2 = all[i + 1];
        const p3 = all[i + 2] || p2;
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
        const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
        d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
      }
      const end = all[all.length - 1];
      const prev = all[all.length - 2];
      const angle = (Math.atan2(end[1] - prev[1], end[0] - prev[0]) * 180) / Math.PI;
      const width = Math.round(base.width);
      const height = Math.round(base.height);
      setLine((current) =>
        current && current.d === d && current.width === width && current.height === height
          ? current
          : { width, height, d, end, angle, centers: all.slice(1, -1) }
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    cardRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [stageRef, cardRefs, count]);

  return line;
}

const LEG_MS = 1500; // pulse travel time per step
const REST_MS = 1100; // pause after the last step before the next run
const DRAW_MS = 2600; // matches the CSS draw-in (2.4s + 0.2s delay)

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Drives one bright pulse (and its glowing head) along the path, and reports which
// step it has most recently reached so that card can light up and open.
function useTravellingLight({ line, live, pathRef, headRef, stageRef, paused, onReach }) {
  const onReachRef = useRef(onReach);
  onReachRef.current = onReach;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  // Survives re-measures (e.g. a resize) so the pulse continues instead of restarting.
  const elapsedRef = useRef(-DRAW_MS);

  useEffect(() => {
    const path = pathRef.current;
    const head = headRef.current;
    const stage = stageRef.current;
    if (!line || !live || !path || !head || !stage || prefersReducedMotion()) return undefined;

    // Where along the path (0..1) each card centre sits.
    const total = path.getTotalLength();
    const samples = 400;
    const stops = line.centers.map(([cx, cy]) => {
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i <= samples; i += 1) {
        const point = path.getPointAtLength((i / samples) * total);
        const dist = (point.x - cx) ** 2 + (point.y - cy) ** 2;
        if (dist < bestDist) {
          bestDist = dist;
          best = i / samples;
        }
      }
      return best;
    });

    const travel = LEG_MS * (stops.length + 0.6);
    const cycle = travel + REST_MS;
    let visible = true;
    let frame = 0;
    let last = performance.now();
    let reached = -1;

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(stage);

    const report = (index) => {
      if (index === reached) return;
      reached = index;
      onReachRef.current(index);
    };

    const tick = (now) => {
      const delta = Math.min(64, now - last);
      last = now;
      if (visible && !document.hidden && !pausedRef.current) elapsedRef.current += delta;
      const elapsed = elapsedRef.current; // negative until the line has finished drawing

      if (elapsed < 0) {
        path.style.opacity = "0";
        head.style.opacity = "0";
      } else {
        const local = elapsed % cycle;
        const t = Math.min(1, local / travel);
        const running = local < travel;
        const fade = running ? Math.min(1, t * 12, (1 - t) * 12) : 0;
        path.style.strokeDashoffset = String(0.06 - t);
        path.style.opacity = String(fade);
        const point = path.getPointAtLength(t * total);
        head.setAttribute("cx", point.x.toFixed(1));
        head.setAttribute("cy", point.y.toFixed(1));
        head.style.opacity = String(fade);

        let index = -1;
        if (running) {
          for (let i = 0; i < stops.length; i += 1) if (t >= stops[i] - 0.012) index = i;
        }
        report(pausedRef.current ? -1 : index);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      onReachRef.current(-1);
    };
  }, [line, live, pathRef, headRef, stageRef]);
}

export default function WhatWeDo({ surface = "bg-cream" }) {
  const { data, isLoading, isError, refetch } = useGetPublishedHomepageQuery();
  const methodology = data?.methodology;
  const steps = resolveMethodSteps(methodology?.steps);

  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const pulseRef = useRef(null);
  const headRef = useRef(null);
  const [live, setLive] = useState(false);
  const [active, setActive] = useState(-1);
  const [paused, setPaused] = useState(false);
  const line = useStairLine(stageRef, cardRefs, steps.length);
  useTravellingLight({
    line,
    live,
    pathRef: pulseRef,
    headRef,
    stageRef,
    paused,
    onReach: setActive,
  });

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
  }, [steps.length]);

  return (
    <section className={`section method-section ${surface}`}>
      <SectionShell>
        <div
          ref={stageRef}
          className={`stairs${live ? " is-live" : ""}`}
          style={{ "--steps": steps.length || 6 }}
        >
          {line ? (
            <svg
              className="stairs-line"
              width={line.width}
              height={line.height}
              viewBox={`0 0 ${line.width} ${line.height}`}
              aria-hidden
            >
              <defs>
                <linearGradient id="stairs-stroke" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#0891b2" />
                  <stop offset="0.7" stopColor="#22d3ee" />
                  <stop offset="1" stopColor="#a3e635" />
                </linearGradient>
              </defs>
              <path className="stairs-line-band" d={line.d} pathLength="1" />
              <path className="stairs-line-main" d={line.d} pathLength="1" stroke="url(#stairs-stroke)" />
              <path ref={pulseRef} className="stairs-line-pulse" d={line.d} pathLength="1" />
              <circle ref={headRef} className="stairs-line-head" r="5" cx="0" cy="0" />
              <g
                className="stairs-line-arrow"
                transform={`translate(${line.end[0]} ${line.end[1]}) rotate(${line.angle})`}
              >
                <path d="M-14 -9 L0 0 L-14 9" />
              </g>
            </svg>
          ) : null}

          <div className="stairs-head">
            <span className="eyebrow">{methodology?.eyebrow || "How We Work"}</span>
            <h2 className="section-title mt-4">
              {methodology?.title || "Our IT"}{" "}
              <span className="text-gradient">{methodology?.highlight || "Methodology"}</span>
            </h2>
            <p className="stairs-subtitle">
              {methodology?.subtitle ||
                "A proven, transparent process that takes your idea from concept to a polished, scalable product — on time and on budget."}
            </p>
          </div>

          {isLoading && (
            <p className="stairs-status flex items-center gap-2 text-sm font-semibold text-ink-500">
              <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
              Loading…
            </p>
          )}

          {isError && (
            <div className="stairs-status card max-w-lg p-8 text-center">
              <p className="font-semibold text-ink-900">Could not load this section.</p>
              <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
                Retry
              </button>
            </div>
          )}

          {steps.length > 0 && (
            <ol
              className={`stairs-steps${paused ? " is-paused" : ""}`}
              // Pointing at or tabbing into a step hands control to the visitor.
              onPointerEnter={(event) => event.pointerType === "mouse" && setPaused(true)}
              onPointerLeave={(event) => event.pointerType === "mouse" && setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
              }}
            >
              {steps.map((step, index) => {
                const Icon = step.Icon;
                return (
                  <li
                    key={`${step.title}-${index}`}
                    className={`stairs-step${index === active ? " is-active" : ""}`}
                    style={{ "--i": index }}
                  >
                    <div
                      ref={(node) => {
                        cardRefs.current[index] = node;
                      }}
                      className="stairs-card"
                      tabIndex={0}
                    >
                      <span className="stairs-dot" aria-hidden />
                      <span className="stairs-num" aria-hidden>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="stairs-icon" aria-hidden>
                        <Icon size={18} strokeWidth={2.1} />
                      </span>
                      <h3 className="stairs-title">{step.title}</h3>
                      {step.points?.length ? (
                        <ul className="stairs-points">
                          {step.points.map((point, pointIndex) => (
                            <li key={point} style={{ "--p": pointIndex }}>
                              {point}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </SectionShell>
    </section>
  );
}
