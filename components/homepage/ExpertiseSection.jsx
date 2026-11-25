"use client";

import { Loader2 } from "lucide-react";
import { useGetPublishedHomepageQuery } from "@/redux/features/cms/homepageApi";
import SectionShell from "@/components/layouts/SectionShell";
import ServiceOrbit from "@/components/homepage/ServiceOrbit";

export default function ExpertiseSection({ surface = "bg-cream" }) {
  const { data, isLoading, isError, refetch } = useGetPublishedHomepageQuery();
  const expertise = data?.expertise;
  const services = expertise?.items || [];

  return (
    <section className={`section ${surface}`}>
      <SectionShell>
        {isLoading && (
          <p className="section-stack flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin text-accent" aria-hidden />
            Loading…
          </p>
        )}

        {isError && (
          <div className="card section-stack mx-auto max-w-lg p-8 text-center">
            <p className="font-semibold text-ink-900">Could not load this section.</p>
            <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="section-stack">
            <ServiceOrbit
              items={services}
              eyebrow={expertise?.eyebrow || "Our Services"}
              title={expertise?.title || "Our"}
              highlight={expertise?.highlight || "Expertise"}
              subtitle={
                expertise?.subtitle ||
                "A full spectrum of digital capabilities — combined under one roof to take your product from idea to impact."
              }
            />
          </div>
        )}
      </SectionShell>
    </section>
  );
}
