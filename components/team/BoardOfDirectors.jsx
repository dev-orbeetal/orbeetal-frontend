"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import SectionShell from "@/components/layouts/SectionShell";
import SectionHeading from "@/components/ui/SectionHeading";
import { useGetPublishedTeamQuery } from "@/redux/features/cms/teamApi";
import { teamPath } from "@/lib/slug";

// Asymmetric board layout: seven director slots around a central logo tile.
// Members fill the slots in sort order; slot names map to grid areas in globals.css.
const SLOTS = [
  { area: "h1", shape: "wide" },
  { area: "v1", shape: "tall" },
  { area: "h2", shape: "wide" },
  { area: "v2", shape: "tall" },
  { area: "h3", shape: "wide" },
  { area: "v3", shape: "tall" },
  { area: "v4", shape: "tall" },
];

function initials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function departmentName(member) {
  const dept = member?.department;
  return (typeof dept === "object" ? dept?.name : dept) || "";
}

function titleOf(member) {
  const dept = departmentName(member);
  const role = member?.role || "Director";
  return dept ? `${dept} ${role}` : role;
}

function track(member) {
  const parts = [];
  if (member?.experience) parts.push(`${member.experience}+ yrs`);
  if (member?.projects) parts.push(`${member.projects} projects`);
  return parts.join(" · ");
}

function Portrait({ member, sizes, priority }) {
  return (
    <div className="board-photo">
      {member.image ? (
        <Image
          src={member.image}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="board-photo-img"
        />
      ) : (
        <span className="board-initials" aria-hidden>
          {initials(member.name)}
        </span>
      )}
    </div>
  );
}

function DirectorCard({ member, slot, index }) {
  const focus = (member.expertise || [])[0];
  const dept = departmentName(member);
  const stats = track(member);

  return (
    <li className={`board-slot board-slot--${slot.area}`}>
      <Link
        href={teamPath(member)}
        className={`board-card board-card--${slot.shape}`}
        aria-label={`${member.name}, ${titleOf(member)} — view profile`}
      >
        <Portrait
          member={member}
          priority={index < 2}
          sizes={slot.shape === "wide" ? "(max-width: 640px) 40vw, 12rem" : "(max-width: 640px) 46vw, 16rem"}
        />
        <div className="board-copy">
          <h3 className="board-name">{member.name}</h3>
          <p className="board-title">{titleOf(member)}</p>
          <span className="board-rule" aria-hidden />
          {dept && <p className="board-detail">{dept} department</p>}
          {focus && <p className="board-detail">{focus}</p>}
          {stats && <p className="board-meta">{stats}</p>}
        </div>
      </Link>
    </li>
  );
}

function LogoTile() {
  return (
    <li className="board-slot board-slot--logo" aria-hidden>
      <div className="board-logo">
        <span className="board-logo-frame">
          <BrandLogo size={34} className="board-logo-img" alt="" />
        </span>
        <span className="board-logo-title">
          Board of
          <br />
          Directors
        </span>
        <span className="board-logo-foot">Vision · Leadership</span>
      </div>
    </li>
  );
}

export default function BoardOfDirectors({ showHeading = true, surface = "bg-cream" }) {
  const { data: members = [], isLoading, isError, refetch } = useGetPublishedTeamQuery();
  const board = members.slice(0, SLOTS.length);
  const extra = members.slice(SLOTS.length);
  const complete = board.length === SLOTS.length;

  return (
    <section className={`section board-section ${surface}`} aria-labelledby="board-heading">
      <SectionShell>
        {showHeading ? (
          <div id="board-heading">
            <SectionHeading
              eyebrow="Leadership"
              title={
                <>
                  Meet the <span className="text-gradient">Directors</span>
                </>
              }
              subtitle="The people behind Orbeetal — a multidisciplinary leadership team driving every project with expertise and care."
            />
          </div>
        ) : (
          <h2 id="board-heading" className="sr-only">
            Board of Directors
          </h2>
        )}

        {isLoading && (
          <p className="section-stack flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
            Loading directors…
          </p>
        )}

        {isError && (
          <div className="card section-stack mx-auto max-w-lg p-8 text-center">
            <p className="font-semibold text-ink-900">Could not load the board.</p>
            <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && members.length === 0 && (
          <p className="section-stack text-center text-sm font-semibold text-ink-500">
            Director profiles will appear here once they are published.
          </p>
        )}

        {board.length > 0 && (
          <ul className={`board-grid ${showHeading ? "section-stack" : ""} ${complete ? "" : "board-grid--simple"}`}>
            {board.map((member, i) => (
              <DirectorCard
                key={member.id}
                member={member}
                index={i}
                slot={complete ? SLOTS[i] : { area: "auto", shape: "tall" }}
              />
            ))}
            {complete && <LogoTile />}
          </ul>
        )}

        {extra.length > 0 && (
          <ul className="board-grid board-grid--simple mt-4">
            {extra.map((member, i) => (
              <DirectorCard
                key={member.id}
                member={member}
                index={SLOTS.length + i}
                slot={{ area: "auto", shape: "tall" }}
              />
            ))}
          </ul>
        )}
      </SectionShell>
    </section>
  );
}
