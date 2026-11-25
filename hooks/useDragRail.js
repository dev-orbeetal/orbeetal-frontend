"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DRAG_THRESHOLD = 6;
const AUTOPLAY_MS = 3600;
// After someone drags, swipes, scrolls or clicks an arrow, wait this long before moving again.
const RESUME_MS = 6000;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function railItems(el) {
  return [...el.querySelectorAll(":scope > .drag-rail-item")];
}

function indexFromScroll(el) {
  const items = railItems(el);
  if (!items.length) return 0;
  const left = el.getBoundingClientRect().left;
  let best = 0;
  let bestDist = Infinity;
  items.forEach((item, index) => {
    const dist = Math.abs(item.getBoundingClientRect().left - left);
    if (dist < bestDist) {
      bestDist = dist;
      best = index;
    }
  });
  return best;
}

function offsetForIndex(el, index) {
  const items = railItems(el);
  const item = items[index];
  if (!item) return 0;
  const delta = item.getBoundingClientRect().left - el.getBoundingClientRect().left;
  const max = Math.max(0, el.scrollWidth - el.clientWidth);
  return Math.max(0, Math.min(max, el.scrollLeft + delta));
}

export function useDragRail({ count = 0, reduceMotion = false, autoplay = false } = {}) {
  const scrollerRef = useRef(null);
  const dragRef = useRef(null);
  const glideRef = useRef(0);
  const suppressClickRef = useRef(false);
  const mountedRef = useRef(true);
  const [dragging, setDragging] = useState(false);
  const [gliding, setGliding] = useState(false);
  const [edges, setEdges] = useState({ prev: false, next: count > 1 });

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || !mountedRef.current) return;
    const max = el.scrollWidth - el.clientWidth;
    const prev = el.scrollLeft > 4;
    const next = max > 4 && el.scrollLeft < max - 4;
    setEdges((current) =>
      current.prev === prev && current.next === next ? current : { prev, next }
    );
  }, []);

  const markGliding = useCallback((el, on) => {
    el?.parentElement?.classList.toggle("is-gliding", on);
    if (mountedRef.current) setGliding(on);
  }, []);

  const cancelGlide = useCallback(() => {
    cancelAnimationFrame(glideRef.current);
    glideRef.current = 0;
    const el = scrollerRef.current;
    if (el) markGliding(el, false);
  }, [markGliding]);

  const glideTo = useCallback(
    (target) => {
      const el = scrollerRef.current;
      if (!el) return;
      cancelAnimationFrame(glideRef.current);
      const max = Math.max(0, el.scrollWidth - el.clientWidth);
      const dest = Math.max(0, Math.min(max, target));
      if (reduceMotion || prefersReducedMotion() || Math.abs(el.scrollLeft - dest) < 0.5) {
        el.scrollLeft = dest;
        markGliding(el, false);
        updateEdges();
        return;
      }
      markGliding(el, true);
      const start = el.scrollLeft;
      const distance = dest - start;
      const duration = 420;
      const t0 = performance.now();
      const step = (now) => {
        if (!mountedRef.current) return;
        const t = Math.min(1, (now - t0) / duration);
        const eased = 1 - (1 - t) ** 3;
        el.scrollLeft = start + distance * eased;
        if (t < 1) {
          glideRef.current = requestAnimationFrame(step);
          return;
        }
        glideRef.current = 0;
        markGliding(el, false);
        updateEdges();
      };
      glideRef.current = requestAnimationFrame(step);
    },
    [markGliding, reduceMotion, updateEdges]
  );

  const settle = useCallback(
    (velocity) => {
      const el = scrollerRef.current;
      if (!el) return;
      if (reduceMotion || prefersReducedMotion() || Math.abs(velocity) < 0.05) {
        glideTo(offsetForIndex(el, indexFromScroll(el)));
        return;
      }
      let vx = velocity * 16.67;
      markGliding(el, true);
      const tick = () => {
        if (!mountedRef.current || !scrollerRef.current) return;
        const node = scrollerRef.current;
        const max = Math.max(0, node.scrollWidth - node.clientWidth);
        if (Math.abs(vx) >= 0.55) {
          vx *= 0.945;
          const next = Math.max(0, Math.min(max, node.scrollLeft + vx));
          if (next <= 0 || next >= max) vx = 0;
          node.scrollLeft = next;
          glideRef.current = requestAnimationFrame(tick);
          return;
        }
        glideRef.current = 0;
        glideTo(offsetForIndex(node, indexFromScroll(node)));
      };
      glideRef.current = requestAnimationFrame(tick);
    },
    [glideTo, markGliding, reduceMotion]
  );

  const scrollByCard = useCallback(
    (direction) => {
      const el = scrollerRef.current;
      if (!el) return;
      cancelGlide();
      const next = Math.min(
        railItems(el).length - 1,
        Math.max(0, indexFromScroll(el) + direction)
      );
      const left = offsetForIndex(el, next);
      if (reduceMotion || prefersReducedMotion()) {
        el.scrollLeft = left;
        updateEdges();
        return;
      }
      el.scrollTo({ left, behavior: "smooth" });
    },
    [cancelGlide, reduceMotion, updateEdges]
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(glideRef.current);
    };
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;
    updateEdges();
    const onScroll = () => updateEdges();
    el.addEventListener("scroll", onScroll, { passive: true });
    const observer = new ResizeObserver(() => updateEdges());
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [count, updateEdges]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || count < 2) return undefined;

    const onPointerDown = (event) => {
      if (event.button !== 0 || event.pointerType === "touch") return;
      cancelGlide();
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startScroll: el.scrollLeft,
        lastX: event.clientX,
        lastT: performance.now(),
        velocity: 0,
        moved: false,
      };
    };

    const onPointerMove = (event) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      const dx = event.clientX - drag.startX;
      if (!drag.moved) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        drag.moved = true;
        suppressClickRef.current = true;
        el.parentElement?.classList.add("is-dragging");
        if (mountedRef.current) setDragging(true);
      }
      event.preventDefault();
      el.scrollLeft = drag.startScroll - dx;
      const now = performance.now();
      const dt = now - drag.lastT;
      if (dt > 0 && dt < 48) {
        const instant = Math.max(-2.2, Math.min(2.2, (drag.lastX - event.clientX) / dt));
        drag.velocity = drag.velocity * 0.55 + instant * 0.45;
      } else if (dt >= 48) {
        drag.velocity = 0;
      }
      drag.lastX = event.clientX;
      drag.lastT = now;
    };

    const finish = (event) => {
      const drag = dragRef.current;
      if (!drag || (event && event.pointerId !== drag.pointerId)) return;
      dragRef.current = null;
      el.parentElement?.classList.remove("is-dragging");
      if (mountedRef.current) setDragging(false);
      if (!drag.moved) return;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 400);
      const stale = performance.now() - drag.lastT > 50;
      settle(stale ? 0 : drag.velocity);
    };

    const onSelectStart = (event) => {
      if (dragRef.current?.moved) event.preventDefault();
    };

    const onWheel = () => {
      if (dragRef.current?.moved) return;
      cancelGlide();
    };

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
    el.addEventListener("selectstart", onSelectStart);
    el.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
      el.removeEventListener("selectstart", onSelectStart);
      el.removeEventListener("wheel", onWheel);
      el.parentElement?.classList.remove("is-dragging");
      cancelAnimationFrame(glideRef.current);
    };
  }, [cancelGlide, count, settle]);

  // Autoplay: step one card at a time and rewind at the end. Pauses while the rail is
  // hovered, focused, off-screen or the tab is hidden, and for a while after any
  // manual interaction.
  useEffect(() => {
    const el = scrollerRef.current;
    const root = el?.parentElement;
    if (!autoplay || !el || !root || count < 2 || reduceMotion || prefersReducedMotion()) {
      return undefined;
    }
    let visible = false;
    let hovered = false;
    let lastInteraction = 0;
    const touched = () => {
      lastInteraction = performance.now();
    };
    const onEnter = (event) => {
      if (event.pointerType === "mouse") hovered = true;
    };
    const onLeave = (event) => {
      if (event.pointerType === "mouse") hovered = false;
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
      },
      { threshold: [0, 0.35, 0.7] }
    );
    observer.observe(root);
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointerdown", touched);
    root.addEventListener("touchstart", touched, { passive: true });
    root.addEventListener("wheel", touched, { passive: true });
    root.addEventListener("keydown", touched);

    const timer = window.setInterval(() => {
      if (!visible || hovered || document.hidden) return;
      if (root.contains(document.activeElement)) return;
      if (dragRef.current || glideRef.current) return;
      if (performance.now() - lastInteraction < RESUME_MS) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 4) return;
      if (el.scrollLeft >= max - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      const next = Math.min(railItems(el).length - 1, indexFromScroll(el) + 1);
      el.scrollTo({ left: offsetForIndex(el, next), behavior: "smooth" });
    }, AUTOPLAY_MS);

    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerdown", touched);
      root.removeEventListener("touchstart", touched);
      root.removeEventListener("wheel", touched);
      root.removeEventListener("keydown", touched);
    };
  }, [autoplay, count, reduceMotion]);

  const consumeSuppressedClick = useCallback((event) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  }, []);

  return {
    scrollerRef,
    dragging,
    gliding,
    edges,
    scrollByCard,
    consumeSuppressedClick,
  };
}
