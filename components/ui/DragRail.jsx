"use client";

import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDragRail } from "@/hooks/useDragRail";

export default function DragRail({
  items = [],
  getKey,
  renderItem,
  label = "carousel",
  size = "feature",
  autoplay = false,
  className = "",
}) {
  const reduce = useReducedMotion();
  const count = items.length;
  const { scrollerRef, dragging, gliding, edges, scrollByCard, consumeSuppressedClick } =
    useDragRail({
      count,
      reduceMotion: Boolean(reduce),
      autoplay,
    });

  if (!count) return null;

  const classes = [
    "drag-rail",
    `drag-rail--${size}`,
    count < 2 ? "drag-rail--solo" : "",
    dragging ? "is-dragging" : "",
    gliding ? "is-gliding" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={(event) => {
        if (count < 2) return;
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        if (event.target.closest("input, textarea, select")) return;
        event.preventDefault();
        scrollByCard(event.key === "ArrowRight" ? 1 : -1);
      }}
    >
      <div
        ref={scrollerRef}
        className="drag-rail-scroller"
        onClickCapture={consumeSuppressedClick}
        onDragStart={(event) => event.preventDefault()}
      >
        {items.map((item, index) => (
          <div
            key={getKey(item)}
            className="drag-rail-item"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}`}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            className="icon-btn drag-rail-arrow drag-rail-arrow--prev"
            aria-label={`Previous ${label}`}
            disabled={!edges.prev}
            onClick={() => scrollByCard(-1)}
          >
            <ChevronLeft size={20} aria-hidden />
          </button>
          <button
            type="button"
            className="icon-btn drag-rail-arrow drag-rail-arrow--next"
            aria-label={`Next ${label}`}
            disabled={!edges.next}
            onClick={() => scrollByCard(1)}
          >
            <ChevronRight size={20} aria-hidden />
          </button>
        </>
      ) : null}
    </div>
  );
}
