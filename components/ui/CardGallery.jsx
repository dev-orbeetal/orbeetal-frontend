"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { imageFit } from "@/lib/projectImages";

const INTERVAL_MS = 3600;

function shouldHold(node, paused) {
  if (!paused) return false;
  const rail = node?.closest(".drag-rail");
  if (!rail) return true;
  return !rail.classList.contains("is-dragging") && !rail.classList.contains("is-gliding");
}

export default function CardGallery({
  images = [],
  alt = "",
  sizes = "(max-width: 768px) 84vw, 26rem",
  phase = 0,
  paused = false,
  priority = false,
}) {
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const signature = images.join("|");
  const [index, setIndex] = useState(0);
  const count = images.length;

  useEffect(() => {
    const motionOff =
      reduce || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (count < 2 || motionOff) return undefined;
    const delay = 900 + (phase % 6) * 480;
    let intervalId = 0;
    const timeoutId = window.setTimeout(() => {
      const tick = () => {
        if (shouldHold(rootRef.current, pausedRef.current)) return;
        setIndex((current) => (current + 1) % count);
      };
      tick();
      intervalId = window.setInterval(tick, INTERVAL_MS);
    }, delay);
    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [count, phase, reduce, signature]);

  if (!count) {
    return <div className="drag-rail-media" ref={rootRef} />;
  }

  const active = index % count;

  return (
    <div className="drag-rail-media" ref={rootRef} aria-hidden={alt ? undefined : true}>
      {images.map((src, imageIndex) => {
        const fit = imageFit(src);
        const selected = imageIndex === active;
        return (
          <Image
            key={src}
            src={src}
            alt={selected ? alt : ""}
            fill
            sizes={sizes}
            draggable={false}
            priority={priority && imageIndex === 0}
            unoptimized={src.split("?")[0].toLowerCase().endsWith(".svg")}
            className={`drag-rail-photo is-${fit}${selected ? " is-active" : ""}`}
          />
        );
      })}
      {count > 1 ? (
        <div className="drag-rail-dots" aria-hidden>
          {images.map((src, imageIndex) => (
            <span
              key={src}
              className={`drag-rail-dot${imageIndex === active ? " is-active" : ""}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
