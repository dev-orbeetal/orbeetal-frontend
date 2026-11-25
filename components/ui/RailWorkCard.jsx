"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import CardGallery from "@/components/ui/CardGallery";

function ClampedDescription({ text, onMore }) {
  const clampRef = useRef(null);
  const fullRef = useRef(null);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    const clamp = clampRef.current;
    const full = fullRef.current;
    if (!clamp || !full) return undefined;
    const measure = () => setOverflows(full.scrollHeight > clamp.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(clamp);
    return () => observer.disconnect();
  }, [text]);

  if (!text) return null;

  return (
    <div className="relative">
      <p
        ref={fullRef}
        className="pointer-events-none invisible absolute inset-x-0 top-0 text-sm leading-relaxed"
        aria-hidden
      >
        {text}
      </p>
      <p ref={clampRef} className="line-clamp-2 min-h-[2.7em] text-sm leading-relaxed text-ink-500">
        {text}
      </p>
      {overflows && onMore ? (
        <button
          type="button"
          onClick={onMore}
          className="mt-1 inline-flex min-h-11 items-center text-sm font-bold text-cyan-ink transition-colors hover:text-white"
        >
          See more
        </button>
      ) : null}
    </div>
  );
}

export default function RailWorkCard({
  images = [],
  title,
  description,
  tags = [],
  href,
  external = false,
  linkLabel,
  onMore,
  phase = 0,
  priority = false,
}) {
  const [hovered, setHovered] = useState(false);
  const gallery = images.filter(Boolean);

  return (
    <article
      className="drag-rail-card"
      onMouseEnter={(event) => {
        if (event.currentTarget.closest(".drag-rail")?.classList.contains("is-dragging")) return;
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false);
      }}
    >
      <CardGallery
        key={gallery.join("|")}
        images={gallery}
        alt=""
        phase={phase}
        paused={hovered}
        priority={priority}
        sizes="(max-width: 768px) 84vw, 26rem"
      />
      <div className="drag-rail-copy">
        <h3 className="line-clamp-2 text-lg font-bold text-ink-900">{title}</h3>
        <ClampedDescription text={description} onMore={onMore} />
        <div className="mt-auto flex flex-col gap-3 pt-3">
          {tags.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <li key={tag} className="drag-rail-tag">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
          {href ? (
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="inline-flex min-h-11 items-center gap-1 self-start text-sm font-bold text-accent-ink transition-colors hover:text-cyan-ink"
            >
              {linkLabel}
              <ArrowUpRight size={15} aria-hidden />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
