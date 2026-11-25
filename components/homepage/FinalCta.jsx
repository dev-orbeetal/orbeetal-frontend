"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionShell from "@/components/layouts/SectionShell";
import { LOGO_MARK } from "@/components/brand/BrandLogo";

// Closing call to action behind a pair of metallic doors that swing open the first
// time the section scrolls into view. Server markup has no doors, so the content is
// always reachable without JS or with reduced motion.
export default function FinalCta({ surface = "bg-sage" }) {
  const ref = useRef(null);
  const [phase, setPhase] = useState("static"); // static → closed → open

  useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    setPhase("closed");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPhase("open");
        observer.disconnect();
      },
      { threshold: 0.45 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const animated = phase !== "static";

  return (
    <section
      ref={ref}
      className={`section door-cta ${surface}${animated ? " is-armed" : ""}${
        phase === "open" ? " is-open" : ""
      }`}
      // Keyboard users tabbing into the closed section get it opened immediately.
      onFocus={() => setPhase((current) => (current === "closed" ? "open" : current))}
    >
      <div className="door-cta-grid" aria-hidden />
      <div className="door-cta-glow" aria-hidden />

      <SectionShell className="door-cta-content">
        <h2 className="door-cta-title section-title mx-auto max-w-2xl text-[clamp(1.8rem,1.2rem+2.3vw,2.85rem)] font-extrabold leading-[1.12] tracking-tight">
          Ready to build something great?
        </h2>
        <p className="door-cta-subtitle mt-4 text-lg font-semibold text-accent-ink sm:text-xl">
          Let’s Turn Your Ideas Into Impact
        </p>
        <div className="door-cta-action mt-8">
          <Link href="/contact" className="btn btn-primary door-cta-button">
            Get Started
            <ArrowRight size={16} className="btn-icon" />
          </Link>
        </div>
      </SectionShell>

      {animated ? (
        <>
          {["left", "right"].map((side) => (
            <div key={side} className={`door-cta-door door-cta-door--${side}`} aria-hidden>
              <span className="door-cta-pattern" />
              <span className="door-cta-light" />
              <span className="door-cta-hinge" />
            </div>
          ))}
          <div className="door-cta-lock" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_MARK} alt="" width={44} height={44} />
          </div>
        </>
      ) : null}

      {["tl", "tr", "bl", "br"].map((corner) => (
        <span key={corner} className={`door-cta-corner door-cta-corner--${corner}`} aria-hidden />
      ))}
    </section>
  );
}
