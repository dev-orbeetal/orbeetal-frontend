"use client";

import Image from "next/image";
import { useSiteBrand } from "@/lib/useSiteBrand";

export const LOGO_MARK = "/images/logo-mark.svg";

/**
 * Spiral mark + "Orbeetal" wordmark. `size` is the mark's height in px; the
 * wordmark scales with it. A logo uploaded in the CMS still takes precedence.
 */
export default function BrandLogo({
  className = "",
  size = 40,
  wordmark = true,
  priority = false,
  alt = "Orbeetal",
}) {
  const { logo } = useSiteBrand();

  if (logo) {
    return (
      <Image
        src={logo}
        alt={alt}
        width={Math.round(size * 3.6)}
        height={size}
        priority={priority}
        className={`object-contain ${className}`}
        style={{ height: size, width: "auto" }}
      />
    );
  }

  return (
    <span
      className={`brand-logo ${className}`}
      style={{ "--logo-size": `${size}px` }}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      <Image
        src={LOGO_MARK}
        alt=""
        width={size}
        height={size}
        priority={priority}
        unoptimized
        className="brand-logo-mark"
      />
      {wordmark ? (
        <span className="brand-logo-word" aria-hidden>
          Orbeetal
        </span>
      ) : null}
    </span>
  );
}
