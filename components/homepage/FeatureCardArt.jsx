import styles from "./feature-cards.module.css";

function cx(...names) {
  return names.filter(Boolean).join(" ");
}

export function NetworkArt() {
  return (
    <svg className={styles.art} viewBox="0 0 240 200" fill="none" aria-hidden>
      <defs>
        <linearGradient id="value-chip" x2="1" y2="1">
          <stop stopColor="#1e4660" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
        <radialGradient id="value-halo">
          <stop stopColor="#67e8f9" stopOpacity="0.65" />
          <stop offset="1" stopColor="#67e8f9" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="100" r="96" fill="url(#value-halo)" />
      <circle cx="120" cy="100" r="68" stroke="#a8b8cc" strokeDasharray="3 6" />
      <circle className={styles.ripple} cx="120" cy="100" r="62" stroke="#22d3ee" />
      <g className={styles.orbit}>
        <circle cx="120" cy="32" r="5" fill="#22d3ee" />
        <circle cx="120" cy="168" r="4" fill="#a3e635" />
        <circle cx="52" cy="100" r="3" fill="#60a5fa" />
      </g>
      <g stroke="#a8b8cc" strokeWidth="1.5">
        <path d="M120 100L55 48H30M120 100L185 48H210M120 100L55 152H30M120 100L185 152H210" />
        <path className={styles.flow} stroke="#22d3ee" strokeWidth="2.5" d="M30 48H55L120 100L185 152H210M210 48H185L120 100L55 152H30" />
      </g>
      <g className={styles.float}>
        <rect x="83" y="63" width="74" height="74" rx="18" fill="url(#value-chip)" stroke="#22d3ee" strokeWidth="2" />
        <g stroke="#67e8f9" strokeWidth="2">
          <path d="M98 57v-9m15 9v-9m15 9v-9m15 9v-9M98 143v9m15-9v9m15-9v9m15-9v9M77 78h-9m9 15h-9m9 15h-9m9 15h-9M163 78h9m-9 15h9m-9 15h9m-9 15h9" />
        </g>
        <rect x="97" y="77" width="46" height="46" rx="10" fill="#173056" stroke="#67e8f9" />
        <path d="m113 91-10 9 10 9m14-18 10 9-10 9" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M123 87l-6 26" stroke="#a3e635" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <g fill="#112240" stroke="#a8b8cc">
        <rect x="15" y="34" width="34" height="28" rx="7" />
        <rect x="191" y="34" width="34" height="28" rx="7" />
        <rect x="15" y="138" width="34" height="28" rx="7" />
        <rect x="191" y="138" width="34" height="28" rx="7" />
      </g>
      <g stroke="#0891b2" strokeWidth="2" strokeLinecap="round">
        <path d="m28 42-6 6 6 6m8-12 6 6-6 6M200 43h16m-16 5h16m-16 5h10M24 151h16m-8-8v16M201 152l5 5 10-10" />
      </g>
    </svg>
  );
}

export function ShieldArt() {
  return (
    <svg className={styles.art} viewBox="0 0 240 200" fill="none" aria-hidden>
      <defs>
        <linearGradient id="value-shield" x2="1" y2="1">
          <stop stopColor="#0891b2" />
          <stop offset="1" stopColor="#173056" />
        </linearGradient>
        <clipPath id="value-shield-clip">
          <path d="M120 35L173 55V101Q173 143 120 169Q67 143 67 101V55Z" />
        </clipPath>
      </defs>
      <circle cx="120" cy="100" r="78" stroke="#c5d0de" />
      <circle cx="120" cy="100" r="89" stroke="#c5d0de" strokeDasharray="3 7" />
      <g className={styles.orbit}>
        <circle cx="120" cy="11" r="4" fill="#a3e635" />
        <circle cx="209" cy="100" r="4" fill="#60a5fa" />
      </g>
      <g className={styles.float}>
        <path d="M120 27L181 50V101Q181 150 120 178Q59 150 59 101V50Z" fill="#173056" stroke="#22d3ee" strokeWidth="2" />
        <path d="M120 35L173 55V101Q173 143 120 169Q67 143 67 101V55Z" fill="url(#value-shield)" stroke="#67e8f9" strokeWidth="2" />
        <g clipPath="url(#value-shield-clip)">
          <g className={styles.scan}>
            <rect x="60" y="55" width="120" height="35" fill="#67e8f9" opacity="0.22" />
            <path d="M60 90H180" stroke="#22d3ee" strokeWidth="3" />
          </g>
        </g>
        <circle cx="120" cy="98" r="28" fill="#1e4660" stroke="#67e8f9" />
        <path className={styles.check} d="m104 98 11 11 23-25" stroke="#a3e635" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className={styles.pulse}>
        <rect x="161" y="133" width="61" height="30" rx="8" fill="#112240" stroke="#c5d0de" />
        <circle cx="173" cy="148" r="4" fill="#a3e635" />
        <text x="183" y="152" fontSize="9" fill="#e8eef6">Verified</text>
      </g>
      <g className={cx(styles.float, styles.delay)}>
        <rect x="25" y="55" width="42" height="32" rx="8" fill="#112240" stroke="#c5d0de" />
        <path d="M40 68v-3a6 6 0 0 1 12 0v3" stroke="#0891b2" strokeWidth="2" />
        <rect x="37" y="68" width="18" height="12" rx="3" fill="#60a5fa" />
      </g>
    </svg>
  );
}

export function ChartArt() {
  return (
    <svg className={styles.art} viewBox="0 0 240 200" fill="none" aria-hidden>
      <defs>
        <linearGradient id="value-bars" x2="0" y2="1">
          <stop stopColor="#22d3ee" />
          <stop offset="1" stopColor="#0e7490" />
        </linearGradient>
      </defs>
      <g className={styles.float}>
        <rect x="37" y="47" width="185" height="131" rx="14" fill="#112240" stroke="#c5d0de" />
        <path d="M37 69H222" stroke="#e8eef6" />
        <circle cx="50" cy="58" r="3" fill="#60a5fa" />
        <circle cx="60" cy="58" r="3" fill="#a3e635" />
        <g stroke="#e8eef6" strokeDasharray="3 4">
          <path d="M53 92H207M53 113H207M53 134H207" />
        </g>
        <path d="M53 158H207" stroke="#c5d0de" />
        <g fill="url(#value-bars)">
          <rect className={styles.bar} x="62" y="132" width="18" height="26" rx="3" />
          <rect className={styles.bar} x="90" y="118" width="18" height="40" rx="3" style={{ animationDelay: "0.12s" }} />
          <rect className={styles.bar} x="118" y="103" width="18" height="55" rx="3" style={{ animationDelay: "0.24s" }} />
          <rect className={styles.bar} x="146" y="91" width="18" height="67" rx="3" style={{ animationDelay: "0.36s" }} />
          <rect className={styles.bar} x="174" y="78" width="18" height="80" rx="3" fill="#a3e635" style={{ animationDelay: "0.48s" }} />
        </g>
        <path className={styles.trend} d="M59 126L86 111L111 116L140 89L163 96L201 56m-15 1 15-1-1 15" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className={cx(styles.float, styles.delay)}>
        <rect x="13" y="81" width="64" height="39" rx="9" fill="#1e4660" />
        <path d="m23 105 9-9 7 4 12-12m-8 0h8v8" stroke="#a3e635" strokeWidth="2" />
        <text x="23" y="113" fontSize="7" fill="#c5d0de">SCALABLE</text>
      </g>
      <g className={styles.pulse}>
        <circle cx="204" cy="42" r="18" fill="#173056" stroke="#22d3ee" />
        <path d="M204 51V33m-7 7 7-7 7 7" stroke="#0891b2" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

const ARTS = {
  network: NetworkArt,
  shield: ShieldArt,
  chart: ChartArt,
};

export function featureKind(label, text, index) {
  const blob = `${label || ""} ${text || ""}`.toLowerCase();
  if (/trust|secure|reliab|deliver/.test(blob)) return "shield";
  if (/growth|scale/.test(blob)) return "chart";
  if (/innov|stack|architect/.test(blob)) return "network";
  return ["network", "shield", "chart"][index % 3];
}

export default function FeatureCardArt({ kind }) {
  const Art = ARTS[kind] || NetworkArt;
  return <Art />;
}

export { styles as featureStyles };
