"use client";

import { Loader2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import DragRail from "@/components/ui/DragRail";
import FeatureTile, { projectKicker } from "@/components/ui/FeatureTile";
import { projectImages } from "@/lib/projectImages";
import { useGetPublishedProjectsQuery } from "@/redux/features/cms/projectsApi";
import ExploreProjects from "@/components/homepage/ExploreProjects";
import SectionShell from "@/components/layouts/SectionShell";

export default function PortfolioPreview({ surface = "bg-cream" }) {
  const { data: projects = [], isLoading, isError, refetch } =
    useGetPublishedProjectsQuery();
  return (
    <section className={`section showcase-section ${surface}`}>
      <SectionShell>
        <SectionHeading
          eyebrow="Our Portfolio"
          title={
            <>
              From Ideas to <span className="text-gradient">Impact</span>
            </>
          }
          subtitle="Platforms we have designed, engineered and launched — each one built around a real purpose."
        />

        {isLoading && (
          <p className="section-stack flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
            Loading portfolio…
          </p>
        )}

        {isError && (
          <div className="card section-stack mx-auto max-w-lg p-6 text-center">
            <p className="font-semibold text-ink-900">Could not load projects.</p>
            <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {projects.length > 0 && (
          <DragRail
            className="section-stack"
            items={projects}
            getKey={(item) => item.id}
            label="projects"
            size="feature"
            autoplay
            renderItem={(project, index) => {
              const title = project.title || project.name;
              return (
                <FeatureTile
                  image={projectImages(project)[0]}
                  title={title}
                  badge={`${String(index + 1).padStart(2, "0")} / Featured`}
                  kicker={projectKicker(project)}
                  description={project.subtitle}
                  features={project.features}
                  href={project.link || "/portfolio"}
                  external={Boolean(project.link)}
                  priority={index === 0}
                />
              );
            }}
          />
        )}

        <ExploreProjects projects={projects} />
      </SectionShell>
    </section>
  );
}
