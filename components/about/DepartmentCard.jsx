"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { departmentVisual } from "./departmentVisuals";
import { CardWatermark } from "@/components/illustrations";

function useHoverDetail(text) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const pointerType = useRef("mouse");

  useEffect(() => {
    if (!open) {
      setCount(0);
      return undefined;
    }
    if (reduce || !text) {
      setCount(text.length);
      return undefined;
    }
    setCount(0);
    const id = window.setInterval(() => {
      setCount((current) => {
        if (current >= text.length) {
          window.clearInterval(id);
          return current;
        }
        return current + 1;
      });
    }, 16);
    return () => window.clearInterval(id);
  }, [open, reduce, text]);

  const guardClick = (event) => {
    if (pointerType.current !== "mouse" && !open) {
      event.preventDefault();
      setOpen(true);
      return true;
    }
    return false;
  };

  return {
    open,
    shown: text.slice(0, count),
    typing: open && count < text.length,
    guardClick,
    bind: {
      onPointerDown: (event) => {
        pointerType.current = event.pointerType;
      },
      onPointerEnter: (event) => {
        if (event.pointerType === "mouse") setOpen(true);
      },
      onPointerLeave: (event) => {
        if (event.pointerType === "mouse") setOpen(false);
      },
      onFocus: () => setOpen(true),
      onBlur: () => setOpen(false),
    },
  };
}

function DetailLine({ text, shown, typing, className }) {
  if (!text) return null;
  return (
    <>
      <p className="sr-only">{text}</p>
      {shown || typing ? (
        <p className={className} aria-hidden>
          {shown}
          {typing ? (
            <span className="ml-0.5 inline-block h-[1em] w-px translate-y-[2px] animate-pulse bg-cyan-ink align-middle" />
          ) : null}
        </p>
      ) : null}
    </>
  );
}

function ProductImpactCopy() {
  return (
    <div className="dept-impact" aria-hidden>
      <div className="dept-impact__copy">
        <span>Ideas</span>
        <span>Products</span>
        <span>Real Impact</span>
        <i className="dept-impact__rule" />
      </div>
    </div>
  );
}

export default function DepartmentCard({
  dept,
  index = 0,
  featured = false,
  onClick,
  href,
}) {
  const { Icon, tone } = departmentVisual(dept, index);
  const number = String(index + 1).padStart(2, "0");
  const text = dept.description || "";
  const { open, shown, typing, bind, guardClick } = useHoverDetail(text);
  const className = `dept-card${featured ? " dept-card--featured" : ""}${open ? " is-open" : ""}`;
  const watermarkTone = tone === "navy" || tone === "lime" ? "navy" : "cyan";

  const body = (
    <>
      <CardWatermark
        topic={dept}
        tone={watermarkTone}
        size={featured ? "lg" : "md"}
        placement={featured ? "right" : "corner"}
      />
      {featured ? (
        <>
          <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5">
            <span className={`dept-icon dept-icon--${tone}`} style={{ height: "3.1rem", width: "3.1rem" }}>
              <Icon size={22} strokeWidth={2.1} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-[0.8rem] font-semibold tracking-[0.12em] text-ink-400">
                  {number}
                </span>
                <h3 className="text-[1.35rem] font-extrabold leading-tight text-ink-900">
                  {dept.name}
                </h3>
              </div>
              <DetailLine
                text={text}
                shown={shown}
                typing={typing}
                className="mt-1 max-w-sm text-[0.9rem] leading-relaxed text-ink-500"
              />
            </div>
          </div>
          <span className="dept-arrow">
            <ArrowRight size={16} strokeWidth={2.2} />
          </span>
          <ProductImpactCopy />
        </>
      ) : (
        <>
          <div className="relative flex items-center gap-3">
            <span className={`dept-icon dept-icon--${tone}`}>
              <Icon size={20} strokeWidth={2.1} />
            </span>
            <span className="text-[0.8rem] font-semibold tracking-[0.12em] text-ink-400">
              {number}
            </span>
            <span className="dept-arrow ml-auto">
              <ArrowRight size={16} strokeWidth={2.2} />
            </span>
          </div>
          <h3 className="relative mt-4 text-[1.12rem] font-extrabold text-ink-900">{dept.name}</h3>
          <DetailLine
            text={text}
            shown={shown}
            typing={typing}
            className="relative mt-1.5 max-w-[16.5rem] text-[0.9rem] leading-relaxed text-ink-500"
          />
        </>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        aria-label={`${dept.name} department`}
        {...bind}
        onClick={(event) => {
          guardClick(event);
        }}
      >
        {body}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      aria-label={`${dept.name} department`}
      {...bind}
      onClick={(event) => {
        if (guardClick(event)) return;
        onClick?.();
      }}
    >
      {body}
    </button>
  );
}
