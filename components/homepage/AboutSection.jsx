"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { fadeUp, stagger, viewportOnce } from "@/components/ui/motion";
import { useGetPublishedHomepageQuery } from "@/redux/features/cms/homepageApi";
import SectionShell from "@/components/layouts/SectionShell";
import FeatureCardArt, { featureKind, featureStyles } from "@/components/homepage/FeatureCardArt";

export default function AboutSection({ surface = "bg-cream" }) {
  const { data, isLoading, isError, refetch } = useGetPublishedHomepageQuery();
  const about = data?.about;
  const reduce = useReducedMotion();

  return (
    <section className={`section ${surface}`}>
      <SectionShell>
        {isLoading && (
          <p className="flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
            Loading about…
          </p>
        )}

        {isError && (
          <div className="card mx-auto max-w-lg p-8 text-center">
            <p className="font-semibold text-ink-900">Could not load about content.</p>
            <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {about && (
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
            <Reveal direction="left">
              <span className="eyebrow">{about.eyebrow}</span>
              <h2 className="section-title mt-4 max-w-xl">
                {about.title}{" "}
                {about.highlight ? (
                  <span className="text-gradient">{about.highlight}</span>
                ) : null}
              </h2>
              <p className="mt-4 max-w-xl text-[0.98rem] leading-[1.75] text-ink-500 sm:text-[1.02rem]">
                {about.body}
              </p>

              {about.cta_label ? (
                <Link href={about.cta_href || "/contact"} className="btn btn-primary mt-8">
                  {about.cta_label}
                  <ArrowRight size={18} className="btn-icon" />
                </Link>
              ) : null}
            </Reveal>

            <motion.ul
              className={featureStyles.triangle}
              initial={reduce ? false : "hidden"}
              whileInView="visible"
              viewport={viewportOnce}
              variants={stagger(0.05, 0.1)}
            >
              {(about.highlights || []).map(({ label, text }, index) => (
                  <motion.li key={`${label}-${index}`} variants={fadeUp}>
                    <div className={featureStyles.card}>
                      <div className={featureStyles.content}>
                        <p className={featureStyles.title}>{label}</p>
                        {text ? <p className={featureStyles.text}>{text}</p> : null}
                      </div>
                      <FeatureCardArt kind={featureKind(label, text, index)} />
                    </div>
                  </motion.li>
                ))}
            </motion.ul>
          </div>
        )}
      </SectionShell>
    </section>
  );
}
