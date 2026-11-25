"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetPublishedSlidesQuery } from "@/redux/features/cms/slidesApi";
import {
  EASE,
  carouselCopy,
  carouselCopyReduce,
} from "@/components/ui/motion";
import { getHeroTheme } from "@/components/banner/hero/heroThemes";
import HeroCircuit from "@/components/banner/hero/HeroCircuit";
import HeroVisual from "@/components/banner/hero/HeroVisual";
import TrustRow from "@/components/banner/hero/TrustRow";
import SectionShell from "@/components/layouts/SectionShell";

const SLIDE_DURATION = 5500;
const INTERACT_RESUME = 4000;
const SERVICE_LABEL = {
  web: "Web",
  mobile: "Mobile",
  cloud: "Cloud",
  growth: "Marketing",
  ai: "AI",
  cyber: "Security",
};

function ServiceIcon({ id }) {
  const props = {
    width: 21,
    height: 21,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  if (id === "mobile") {
    return (
      <svg {...props}>
        <rect x="7" y="2.5" width="10" height="19" rx="2" />
        <path d="M11 18.5h2" />
      </svg>
    );
  }
  if (id === "cloud") {
    return (
      <svg {...props}>
        <path d="M7 18h9a4 4 0 0 0 .4-8 5.5 5.5 0 0 0-10.6 1.6A3.5 3.5 0 0 0 7 18z" />
      </svg>
    );
  }
  if (id === "growth") {
    return (
      <svg {...props}>
        <path d="M4 16l5-5 3.5 3.5L20 7" />
        <path d="M14 7h6v6" />
      </svg>
    );
  }
  if (id === "ai") {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="2.2" />
        <path d="M12 4.5v2.2M12 17.3V19.5M4.5 12h2.2M17.3 12H19.5M6.6 6.6l1.6 1.6M15.8 15.8l1.6 1.6M17.4 6.6l-1.6 1.6M8.2 15.8l-1.6 1.6" />
      </svg>
    );
  }
  if (id === "cyber") {
    return (
      <svg {...props}>
        <path d="M12 3.5l7 2.4v5.2c0 4.2-2.8 7.2-7 8.9-4.2-1.7-7-4.7-7-8.9V5.9z" />
        <path d="M9 12.1l2 2 4-4.2" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <rect x="3.5" y="4.5" width="17" height="12" rx="2" />
      <path d="M8 20h8M12 16.5V20" />
    </svg>
  );
}

export default function BannerSlider({ surface = "bg-sage" }) {
  const reduceMotion = useReducedMotion();
  const { data: slides = [], isLoading, isError, refetch } =
    useGetPublishedSlidesQuery();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [interacted, setInteracted] = useState(false);
  const [compact, setCompact] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const [controlsHover, setControlsHover] = useState(false);
  const resumeRef = useRef(null);
  const sectionRef = useRef(null);
  const primed = useRef(false);
  const count = slides.length;
  const paused = interacted || pageHidden || offscreen || controlsHover;

  const markInteract = useCallback(() => {
    setInteracted(true);
    window.clearTimeout(resumeRef.current);
    resumeRef.current = window.setTimeout(() => setInteracted(false), INTERACT_RESUME);
  }, []);

  const goTo = useCallback(
    (index, dir, fromUser = false) => {
      if (!count) return;
      setDirection(dir);
      setCurrent((index + count) % count);
      if (fromUser) markInteract();
    },
    [count, markInteract]
  );

  const nextSlide = useCallback(
    (fromUser = false) => goTo(current + 1, 1, fromUser),
    [current, goTo]
  );
  const prevSlide = useCallback(
    (fromUser = false) => goTo(current - 1, -1, fromUser),
    [current, goTo]
  );

  useEffect(() => {
    if (!count) return;
    if (!primed.current) {
      primed.current = true;
      setCurrent(0);
      return;
    }
    if (current >= count) setCurrent(0);
  }, [count, current]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const onVis = () => setPageHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setOffscreen(!entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || count < 2 || reduceMotion) return undefined;
    const timer = setInterval(() => nextSlide(false), SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [paused, nextSlide, count, reduceMotion]);

  useEffect(() => () => window.clearTimeout(resumeRef.current), []);

  useEffect(() => {
    const active = sectionRef.current?.querySelector(".hero-service-item.is-active");
    active?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", inline: "center", block: "nearest" });
  }, [current, reduceMotion]);

  const slide = slides[current] || {
    tag: isLoading ? "Loading" : "Orbeetal",
    headline: isLoading
      ? "Loading slides"
      : isError
        ? "Could not load slides"
        : "Custom Software",
    accent: isLoading || isError ? "" : "Amazing IT Services",
    description: isLoading
      ? ""
      : isError
        ? "Retry to load the latest hero content."
        : "Check back soon for the latest work from our team.",
    primary_cta: isError ? null : { label: "Get a Quote", href: "/contact" },
    secondary_cta: isError
      ? null
      : { label: "View Portfolio", href: "/portfolio" },
    image: "",
  };

  const theme = getHeroTheme(slide.tag);
  const copyVariants = reduceMotion ? carouselCopyReduce : carouselCopy(compact);

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextSlide(true);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prevSlide(true);
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden ${surface}`}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Featured services"
    >
      <HeroCircuit paused={pageHidden || offscreen} reduce={Boolean(reduceMotion)} />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-8 h-72 w-72 rounded-full blur-3xl lg:h-96 lg:w-96"
        style={{ backgroundColor: theme.glowA }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 bottom-0 h-56 w-56 rounded-full blur-3xl lg:h-72 lg:w-72"
        style={{ backgroundColor: theme.glowB }}
      />

      <p className="sr-only" aria-live="polite">
        {count
          ? `Slide ${current + 1} of ${count}: ${slide.tag}`
          : slide.headline}
      </p>

      <SectionShell className="relative grid min-h-[36rem] grid-cols-1 items-center gap-8 pb-12 pt-28 sm:gap-10 sm:pb-14 sm:pt-32 lg:min-h-[40rem] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10 lg:pb-16 lg:pt-36">
        <div className="min-w-0">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={current}
              custom={direction}
              variants={copyVariants}
              initial={reduceMotion ? false : "enter"}
              animate="center"
              exit={reduceMotion ? undefined : "exit"}
              transition={{ duration: reduceMotion ? 0.3 : 0.62, ease: EASE }}
            >
              <span
                className="eyebrow"
                style={{ background: theme.pillBg, borderColor: theme.pillBorder }}
              >
                {slide.tag}
              </span>

              <h1 className="hero-title mt-5 max-w-xl">
                {slide.headline}{" "}
                {slide.accent ? (
                  <span className="hero-accent-clip">{slide.accent}</span>
                ) : null}
              </h1>

              <p className="lead mt-5 max-w-lg">
                {slide.description}
              </p>

              <div className="hero-actions mt-7 flex flex-wrap items-center gap-3">
                {isError && (
                  <button type="button" className="btn btn-primary" onClick={() => refetch()}>
                    Retry
                  </button>
                )}
                {slide.primary_cta?.href && slide.primary_cta?.label && (
                  <Link href={slide.primary_cta.href} className="btn btn-primary">
                    {slide.primary_cta.label}
                    <ArrowRight size={16} className="btn-icon" />
                  </Link>
                )}
                {slide.secondary_cta?.href && slide.secondary_cta?.label && (
                  <Link href={slide.secondary_cta.href} className="btn btn-ghost">
                    {slide.secondary_cta.label}
                    <ArrowRight size={16} className="btn-icon" />
                  </Link>
                )}
              </div>

              <div className="mt-6">
                <TrustRow />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative mx-auto w-full min-w-0 max-w-xl lg:row-span-2 lg:mt-0 lg:max-w-none">
          <HeroVisual
            theme={theme}
            direction={direction}
            compact={compact}
            slideKey={current}
          />
        </div>

        {count > 1 && (
          <div
            className={`hero-service-nav lg:col-span-2${paused ? " is-paused" : ""}${
              reduceMotion ? " is-reduced" : ""
            }`}
            onMouseEnter={() => setControlsHover(true)}
            onMouseLeave={() => setControlsHover(false)}
          >
            <div className="hero-service-list" role="tablist" aria-label="Services">
              {slides.map((item, i) => {
                const themeId = getHeroTheme(item.tag).id;
                const label = SERVICE_LABEL[themeId] || item.tag || item.headline;
                return (
                  <button
                    key={item.id || i}
                    type="button"
                    role="tab"
                    aria-selected={i === current}
                    onClick={() => goTo(i, i > current ? 1 : -1, true)}
                    className={`hero-service-item${i === current ? " is-active" : ""}`}
                    aria-label={item.tag || label}
                    title={item.tag || label}
                  >
                    <ServiceIcon id={themeId} />
                  </button>
                );
              })}
            </div>
            <div className="hero-service-arrows">
              <button
                type="button"
                onClick={() => prevSlide(true)}
                aria-label="Previous service"
                className="hero-service-arrow"
              >
                <ChevronLeft size={14} strokeWidth={2.25} />
              </button>
              <button
                type="button"
                onClick={() => nextSlide(true)}
                aria-label="Next service"
                className="hero-service-arrow"
              >
                <ChevronRight size={14} strokeWidth={2.25} />
              </button>
            </div>
          </div>
        )}
      </SectionShell>
    </section>
  );
}
