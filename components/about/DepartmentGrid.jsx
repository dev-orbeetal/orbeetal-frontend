"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";

function DeptIcon({ src, wide }) {
  const animatedSvg = src.startsWith("/images/departments/") && src.endsWith(".svg");
  const [markup, setMarkup] = useState("");

  useEffect(() => {
    if (!animatedSvg) return undefined;
    let live = true;
    fetch(src, { cache: "no-cache" })
      .then((response) => response.text())
      .then((text) => {
        if (live) setMarkup(text);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [src, animatedSvg]);

  if (animatedSvg) {
    return markup ? (
      <span className="board-photo-svg" dangerouslySetInnerHTML={{ __html: markup }} />
    ) : null;
  }

  return (
    <Image
      src={src}
      alt=""
      fill
      unoptimized={/\.gif(?:$|\?)/.test(src)}
      sizes={wide ? "220px" : "200px"}
      className="board-photo-img board-photo-img--contain"
    />
  );
}

const SLOTS = [
  { area: "h1", shape: "wide" },
  { area: "v1", shape: "tall" },
  { area: "h2", shape: "wide" },
  { area: "v2", shape: "tall" },
  { area: "h3", shape: "wide" },
  { area: "v3", shape: "tall" },
  { area: "v4", shape: "tall" },
];

function DeptCard({ dept, slot, href, onClick }) {
  const icon = dept.icon || "";
  const photo = dept.director?.photo || "";
  const image = icon || photo;
  const isIcon = Boolean(icon);
  const role = Array.isArray(dept.roles) ? dept.roles[0] : "";
  const Tag = href ? Link : "button";
  const linkProps = href ? { href } : { type: "button", onClick };

  return (
    <li className={`board-slot board-slot--${slot.area}`}>
      <Tag
        className={`board-card board-card--${slot.shape}`}
        aria-label={`${dept.name} department`}
        {...linkProps}
      >
        <div className={`board-photo${isIcon ? " board-photo--icon" : ""}`}>
          {image ? (
            isIcon ? (
              <DeptIcon src={image} wide={slot.shape === "wide"} />
            ) : (
              <Image
                src={image}
                alt=""
                fill
                sizes={slot.shape === "wide" ? "220px" : "200px"}
                className="board-photo-img"
              />
            )
          ) : (
            <span className="board-initials" aria-hidden>
              {String(dept.name || "D").slice(0, 1)}
            </span>
          )}
        </div>
        <div className="board-copy">
          <h3 className="board-name">{dept.name}</h3>
          {dept.director?.name ? <p className="board-title">{dept.director.name}</p> : null}
          <span className="board-rule" aria-hidden />
          {role ? <p className="board-detail">{role}</p> : null}
          {dept.description ? <p className="board-detail">{dept.description}</p> : null}
        </div>
      </Tag>
    </li>
  );
}

function CenterTile() {
  return (
    <li className="board-slot board-slot--logo" aria-hidden>
      <div className="board-logo">
        <span className="board-logo-frame">
          <BrandLogo size={34} className="board-logo-img" alt="" />
        </span>
        <span className="board-logo-title">
          Our
          <br />
          Departments
        </span>
        <span className="board-logo-foot">People · Ideas · Impact</span>
      </div>
    </li>
  );
}

export default function DepartmentGrid({
  departments,
  onSelect,
  hrefFor,
  ctaHref = "/contact",
  ctaLabel = "Work With Our Team",
}) {
  const complete = departments.length === SLOTS.length;

  return (
    <div className="relative z-[1]">
      <ul className={`board-grid section-stack ${complete ? "" : "board-grid--simple"}`}>
        {departments.map((dept, index) => (
          <DeptCard
            key={dept.id}
            dept={dept}
            slot={complete ? SLOTS[index] : { area: "auto", shape: "tall" }}
            href={hrefFor ? hrefFor(dept) : undefined}
            onClick={onSelect ? () => onSelect(dept) : undefined}
          />
        ))}
        {complete ? <CenterTile /> : null}
      </ul>

      <div className="relative z-[1] mt-10 flex justify-center">
        <Link href={ctaHref} className="btn btn-primary">
          {ctaLabel}
          <ArrowRight size={16} className="btn-icon" />
        </Link>
      </div>
    </div>
  );
}
