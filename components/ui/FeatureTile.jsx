"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const CATEGORY_LABELS = {
  own: "Own Product",
  partnership: "Partnership",
  client: "Client Project",
};

export function projectKicker(project) {
  return [CATEGORY_LABELS[project?.category], project?.project_type]
    .map((part) => String(part || "").trim())
    .filter(Boolean)
    .join(" · ");
}

/**
 * Project showcase card. At rest it shows the image, category and title; on hover
 * or keyboard focus a glass panel rises from the bottom and reveals the description,
 * feature tags and call to action in a staggered sequence.
 */
export default function FeatureTile({
  image,
  title,
  badge,
  kicker,
  description,
  features = [],
  cta,
  href,
  external = false,
  onClick,
  priority = false,
}) {
  const points = (features || [])
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .slice(0, 4);
  const summary = String(description || "").trim();
  const action = cta || (href ? (external ? "Visit live site" : "View project") : onClick ? "View details" : "");
  const inner = (
    <>
      <span className="feature-tile-media">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 768px) 84vw, 24rem"
            className="feature-tile-img"
          />
        ) : null}
      </span>
      <span className="feature-tile-shade" aria-hidden />

      <span className="feature-tile-top" aria-hidden>
        {badge ? <span className="feature-tile-badge">{badge}</span> : <span />}
        {action ? (
          <span className="feature-tile-go">
            <ArrowUpRight size={18} />
          </span>
        ) : null}
      </span>

      <span className="feature-tile-body">
        {kicker ? <span className="feature-tile-kicker">{kicker}</span> : null}
        <span className="feature-tile-title">{title}</span>
        <span className="feature-tile-reveal">
          <span className="feature-tile-reveal-inner">
            {summary ? <span className="feature-tile-desc">{summary}</span> : null}
            {points.length > 0 ? (
              <span className="feature-tile-tags">
                {points.map((point, index) => (
                  <span key={point} className="feature-tile-tag" style={{ "--i": index }}>
                    {point}
                  </span>
                ))}
              </span>
            ) : null}
            {action ? <span className="feature-tile-cta">{action}</span> : null}
          </span>
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <a
        className="feature-tile"
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-label={external ? `${title} (opens live site in a new tab)` : title}
      >
        {inner}
      </a>
    );
  }

  if (onClick) {
    return (
      <button type="button" className="feature-tile" onClick={onClick} aria-label={title}>
        {inner}
      </button>
    );
  }

  return <div className="feature-tile">{inner}</div>;
}
