import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

export default function BasisBadge({ className = "", compact = false }) {
  return (
    <Link
      href={SITE.basis}
      target="_blank"
      rel="noreferrer"
      className={`basis-badge${compact ? " basis-badge--compact" : ""} ${className}`.trim()}
    >
      {compact ? null : (
        <>
          <span className="basis-badge-orb basis-badge-orb--lg" aria-hidden />
          <span className="basis-badge-orb basis-badge-orb--sm" aria-hidden />
          <span className="basis-badge-dot" aria-hidden />
        </>
      )}

      <Image
        src="/images/basis-logo.png"
        alt="BASIS — Bangladesh Association of Software & Information Services"
        width={316}
        height={130}
        className="basis-badge-logo"
      />
      {compact ? null : <span className="basis-badge-rule" aria-hidden />}
      <span className="basis-badge-copy">
        <span className="basis-badge-title">Proud Member of BASIS</span>
      </span>
    </Link>
  );
}
