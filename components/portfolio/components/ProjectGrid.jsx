"use client";

import { motion, AnimatePresence } from "framer-motion";
import FeatureTile, { projectKicker } from "@/components/ui/FeatureTile";

export default function ProjectGrid({ projects, onOpen, isDisabled }) {
  const gridVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
    hidden: {
      opacity: 0,
      y: 12,
      transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isDisabled ? "grid-hidden" : "grid-visible"}
        initial={isDisabled ? "hidden" : "visible"}
        animate={isDisabled ? "hidden" : "visible"}
        variants={gridVariants}
        className="feature-grid"
      >
        {projects.map((p, index) => (
          <FeatureTile
            key={p.id}
            image={p.image || "/images/web.png"}
            title={p.title}
            badge={String(index + 1).padStart(2, "0")}
            kicker={projectKicker(p)}
            description={p.subtitle}
            features={p.features}
            onClick={(event) => onOpen(p, event.currentTarget)}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
