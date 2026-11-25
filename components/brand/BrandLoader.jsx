// Branded loader built from the Orbeetal spiral: the six spiral segments light up
// in sequence around the mark (a sweep that follows the logo's own curl) while a
// comet orbits it. Pure SVG + CSS, so it renders on the server with no JS.

const OUTLINE =
  "M300 38 C444.7 38 562 155.3 562 300 S444.7 562 300 562 C157 562 40 448 38 306 C45 403 113 479 202 481 C312 483 402 401 402 300 C402 243.7 356.3 198 300 198 S198 243.7 198 300 S243.7 402 300 402 C323 402 343 396 358 383 C327 412 281 425 241 425 C142 425 61 346 61 248 C61 132 166 38 300 38 Z";

const SEGMENTS = [
  ["a", "M300 38 C198 38 118 122 118 222 C118 319 194 399 300 402 C323 402 343 396 358 383 C310 442 170 454 95 369 C-4 257 80 38 300 38Z"],
  ["b", "M300 38 C198 38 118 122 118 222 C118 319 194 399 300 402 C224 387 174 320 174 244 C174 143 253 61 354 61 C411 61 457 85 496 127 C445 65 375 38 300 38Z"],
  ["b", "M496 127 C457 85 411 61 354 61 C253 61 174 143 174 244 C174 286 189 323 210 350 C188 311 197 269 216 238 C249 163 313 118 383 118 C481 118 561 200 562 300 C562 230 539 175 496 127Z"],
  ["c", "M562 300 C561 200 481 118 383 118 C298 118 228 176 204 258 C235 202 296 174 359 174 C458 174 538 254 538 354 C538 411 513 460 472 499 C529 451 562 380 562 300Z"],
  ["d", "M472 499 C513 460 538 411 538 354 C538 254 458 174 359 174 C315 174 276 189 246 215 C277 198 304 194 335 202 C419 222 481 292 481 380 C481 480 401 561 300 562 C364 562 427 540 472 499Z"],
  ["e", "M300 562 C401 561 481 480 481 380 C481 292 419 222 335 202 C377 216 425 274 425 357 C425 457 344 539 242 539 C184 539 133 514 98 473 C146 531 219 562 300 562Z"],
  ["f", "M98 473 C133 514 184 539 242 539 C344 539 425 457 425 357 C425 274 377 216 335 202 C377 217 402 254 402 300 C402 401 312 483 202 481 C113 479 45 403 38 306 C38 372 58 428 98 473Z"],
];

const GRADIENTS = {
  a: { x1: 0, y1: 0, x2: 0.75, y2: 1, to: "#197cba" },
  b: { x1: 0.6, y1: 0, x2: 0.1, y2: 1, to: "#167cb8" },
  c: { x1: 1, y1: 0.15, x2: 0, y2: 0.5, to: "#227bb9" },
  d: { x1: 1, y1: 0.8, x2: 0, y2: 0, to: "#247bb6" },
  e: { x1: 0.5, y1: 1, x2: 0.5, y2: 0, to: "#217ab6" },
  f: { x1: 0, y1: 1, x2: 1, y2: 0.1, to: "#216eae" },
};

export default function BrandLoader({ id = "bl", label = "Loading", className = "" }) {
  const ref = (key) => `${id}-${key}`;
  return (
    <div className={`brand-loader ${className}`} role="status" aria-live="polite">
      <div className="brand-loader-stage">
        <svg className="brand-loader-orbit" viewBox="0 0 100 100" aria-hidden>
          <defs>
            <linearGradient id={ref("trail")} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#22d3ee" stopOpacity="0" />
              <stop offset="1" stopColor="#22d3ee" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <circle className="brand-loader-ring" cx="50" cy="50" r="47" />
          <g className="brand-loader-comet">
            <circle cx="50" cy="50" r="47" stroke={`url(#${ref("trail")})`} />
            <circle className="brand-loader-head" cx="97" cy="50" r="1.6" />
          </g>
        </svg>

        <svg className="brand-loader-mark" viewBox="0 0 600 600" aria-hidden>
          <defs>
            <linearGradient id={ref("base")} x1="0" y1="0" x2="0.4" y2="1">
              <stop stopColor="#30318b" />
              <stop offset=".55" stopColor="#216bad" />
              <stop offset="1" stopColor="#30318b" />
            </linearGradient>
            {Object.entries(GRADIENTS).map(([key, g]) => (
              <linearGradient key={key} id={ref(key)} x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2}>
                <stop stopColor="#30318b" />
                <stop offset="1" stopColor={g.to} />
              </linearGradient>
            ))}
            <clipPath id={ref("clip")}>
              <path d={OUTLINE} />
            </clipPath>
          </defs>
          <path d={OUTLINE} fill={`url(#${ref("base")})`} className="brand-loader-base" />
          <g clipPath={`url(#${ref("clip")})`} stroke="#91b9dd" strokeOpacity=".55" strokeWidth=".48" strokeLinejoin="round">
            {SEGMENTS.map(([grad, d], index) => (
              <path
                key={index}
                d={d}
                fill={`url(#${ref(grad)})`}
                className="brand-loader-seg"
                style={{ "--seg": index }}
              />
            ))}
          </g>
        </svg>
      </div>
      <p className="brand-loader-word" aria-hidden>
        Orbeetal
      </p>
      <span className="sr-only">{label}</span>
    </div>
  );
}
