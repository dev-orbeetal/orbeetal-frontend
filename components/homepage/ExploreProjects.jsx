"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, LayoutGrid } from "lucide-react";
import { PROJECT_CATEGORIES, categoryLabel } from "@/redux/features/cms/projectsApi";

export default function ExploreProjects({ projects = [] }) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);

  const filters = useMemo(() => {
    const groups = PROJECT_CATEGORIES.map((item) => ({
      value: item.value,
      label: item.label,
      count: projects.filter((project) => project.category === item.value).length,
    })).filter((item) => item.count > 0);
    return [{ value: "all", label: "All Projects", count: projects.length }, ...groups];
  }, [projects]);

  const visible = projects.filter((project) => filter === "all" || project.category === filter);

  if (!projects.length) return null;

  return (
    <div className="mt-16">
      {expanded ? null : (
        <div className="flex justify-center">
          <button
            type="button"
            className="explore-launch btn btn-primary"
            aria-expanded="false"
            onClick={() => setExpanded(true)}
          >
            <LayoutGrid size={16} aria-hidden />
            <span>Explore all projects</span>
            <span className="explore-launch-count">{projects.length}</span>
            <ChevronDown size={16} className="explore-launch-arrow" aria-hidden />
          </button>
        </div>
      )}

      {expanded ? (
        <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
          Explore all <span className="text-gradient">projects</span>
        </h3>
        <p className="text-sm font-semibold text-ink-500">
          {projects.length} {projects.length === 1 ? "Project" : "Projects"}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {filters.map((item) => {
          const selected = filter === item.value;
          return (
            <button
              key={item.value}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(item.value)}
              className={`btn btn-sm ${selected ? "btn-primary" : "btn-ghost"}`}
            >
              {item.value === "all" ? <LayoutGrid size={15} aria-hidden /> : null}
              {item.label}
              <span className="opacity-70">({item.count})</span>
            </button>
          );
        })}
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {visible.map((project) => {
          const title = project.title || project.name;
          const summary = project.subtitle || project.description;
          const href = project.link || "/portfolio";
          const external = Boolean(project.link);
          const card = (
            <>
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="7rem"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-cyan-ink">
                    {categoryLabel(project.category)}
                  </p>
                  <ArrowUpRight size={16} className="shrink-0 text-ink-400" aria-hidden />
                </div>
                <p className="mt-1 line-clamp-2 text-sm font-bold text-ink-900">{title}</p>
                {summary ? (
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-500">{summary}</p>
                ) : null}
              </div>
            </>
          );
          return (
            <li key={project.id}>
              {external ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="card card-hover flex h-full gap-3 p-3"
                >
                  {card}
                </a>
              ) : (
                <Link href={href} className="card card-hover flex h-full gap-3 p-3">
                  {card}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          className="btn btn-ghost"
          aria-expanded="true"
          onClick={() => setExpanded(false)}
        >
          Show less
          <ChevronDown size={16} className="rotate-180" aria-hidden />
        </button>
        <Link href="/portfolio" className="btn btn-ghost">
          View all projects
          <ArrowUpRight size={16} className="btn-icon" />
        </Link>
      </div>
        </>
      ) : null}
    </div>
  );
}
