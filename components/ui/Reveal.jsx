"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, fadeLeft, fadeRight, scaleIn, EASE, viewportOnce } from "./motion";

const VARIANTS = {
  up: fadeUp,
  left: fadeLeft,
  right: fadeRight,
  scale: scaleIn,
  none: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
  },
};

export default function Reveal({
  children,
  as = "div",
  direction = "up",
  delay = 0,
  duration,
  amount = 0.2,
  className = "",
  once = true,
  ...rest
}) {
  const MotionTag = motion[as] ?? motion.div;
  const reduceMotion = useReducedMotion();
  // Always render the same motion element. The server can't know the reduced-motion
  // preference, so swapping in a plain tag made hydration keep the server's
  // `opacity: 0` style and left the content invisible. Reduced motion now means an
  // instant, movement-free reveal instead.
  const variants = reduceMotion ? VARIANTS.none : VARIANTS[direction] ?? fadeUp;
  const transition = reduceMotion ? { duration: 0 } : { delay, duration, ease: EASE };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={transition}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

export { viewportOnce };
