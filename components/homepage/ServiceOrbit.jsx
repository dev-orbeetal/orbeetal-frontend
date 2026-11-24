"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

const CATALOG = [
  { title: "App Development", color: "#246FCB", description: "Build intuitive mobile experiences for iOS and Android, designed for speed, usability and growth.", features: ["Cross-platform apps", "Native experiences", "App optimization"] },
  { title: "UI/UX Design", color: "#159EAE", description: "Create elegant, human-centered digital experiences that make complex products feel effortless.", features: ["Design systems", "Prototyping", "User research"] },
  { title: "Web Development", color: "#1976C9", description: "Build fast, secure and scalable websites and applications tailored to your business goals.", features: ["High performance", "Responsive design", "Scalable architecture"] },
  { title: "Cyber Security", color: "#188B79", description: "Protect your digital assets with security-focused architecture, assessments and proactive defense.", features: ["Security audits", "Data protection", "Threat prevention"] },
  { title: "Digital Marketing", color: "#76A923", description: "Reach the right audience and drive measurable growth through data-informed digital campaigns.", features: ["SEO & content", "Paid campaigns", "Growth analytics"] },
  { title: "AI Powered Solutions", color: "#5165D5", description: "Transform your workflows with intelligent automation, AI integrations and actionable insights.", features: ["AI integrations", "Automation", "Intelligent analytics"] },
];

function Illustration({ index, uid }) {
  const illustrations = [
    (<g transform="translate(0 -5)"><rect x="-23" y="-36" width="46" height="73" rx="10" fill="#16364D" /><rect x="-19" y="-31" width="38" height="62" rx="7" fill="#F0FAFF" /><rect x="-9" y="-28" width="18" height="3" rx="1.5" fill="#16364D" /><rect x="-14" y="-19" width="28" height="17" rx="4" fill="#A7E4E9" /><path d="M-10 -6l7-7 5 5 5-6 4 8" fill="none" stroke="#167C9A" strokeWidth="2" /><rect x="-14" y="3" width="12" height="11" rx="3" fill="#286DC5" /><rect x="2" y="3" width="12" height="11" rx="3" fill="#8BD13F" /><path d="M-12 20h24M-12 24h16" stroke="#9CB8C8" strokeWidth="2" /><rect x="18" y="-12" width="24" height="23" rx="7" fill="#29BFC6" stroke="white" strokeWidth="2" /><path d="M25 0l4 4 7-9" fill="none" stroke="white" strokeWidth="2.5" /></g>),
    (<g transform="translate(0 -5)"><rect x="-41" y="-29" width="72" height="55" rx="7" fill="white" stroke="#B7A9E7" /><path d="M-41 -19h72" stroke="#D8CFF4" strokeWidth="2" /><circle cx="-34" cy="-24" r="2" fill="#8259D5" /><circle cx="-28" cy="-24" r="2" fill="#29BFC6" /><rect x="-35" y="-13" width="26" height="30" rx="4" fill="#E7DFFC" /><path d="M-32 12l8-12 6 7 5-5" fill="none" stroke="#8259D5" strokeWidth="2" /><rect x="-4" y="-13" width="28" height="5" rx="2" fill="#8259D5" /><path d="M-4 -2h25M-4 4h19M-4 10h24" stroke="#C1B9DB" strokeWidth="2" /><rect x="-31" y="-9" width="19" height="23" fill="none" stroke="#8259D5" strokeDasharray="2 2" /><path d="M13 9l8 29 7-10 12-2z" fill="#8259D5" stroke="white" strokeWidth="2" /><circle cx="-32" cy="31" r="5" fill="#29BFC6" /><circle cx="-19" cy="31" r="5" fill="#8BD13F" /><circle cx="-6" cy="31" r="5" fill="#8259D5" /></g>),
    (<g transform="translate(0 -5)"><rect x="-43" y="-30" width="86" height="58" rx="7" fill="#16364D" /><path d="M-43 -18h86" stroke="#35566B" /><g fill="#8BD13F"><circle cx="-35" cy="-24" r="2" /><circle cx="-28" cy="-24" r="2" /><circle cx="-21" cy="-24" r="2" /></g><path d="M-29 -7l-8 6 8 6M-13 -7l8 6-8 6M-19 -10l-4 18" fill="none" stroke="#8BD13F" strokeWidth="2.5" /><path d="M3 -8h29M3 -2h20M3 4h26M-35 13h22M-9 13h38M-35 20h47" stroke="#5CCBD5" strokeWidth="2.5" strokeLinecap="round" /><path d="M-13 28v8h26v-8M-23 36h46" fill="none" stroke="#386477" strokeWidth="4" strokeLinecap="round" /><rect x="22" y="12" width="24" height="24" rx="7" fill="#159EAE" stroke="white" strokeWidth="2" /><circle cx="34" cy="24" r="7" fill="none" stroke="white" /><path d="M27 24h14M34 17q-7 7 0 14M34 17q7 7 0 14" fill="none" stroke="white" /></g>),
    (<g transform="translate(0 -5)"><circle r="35" fill="#C6F0E6" /><circle r="40" fill="none" stroke="#188B79" strokeDasharray="3 5" opacity=".6" /><path d="M0 -36L29 -25v25q0 22-29 36Q-29 22-29 0v-25z" fill={`url(#${uid}-shield)`} stroke="white" strokeWidth="2" /><path d="M0 -27l21 8v19q0 15-21 27Q-21 15-21 0v-19z" fill="none" stroke="#B9F4DC" opacity=".65" /><rect x="-11" y="-3" width="22" height="19" rx="4" fill="white" /><path d="M-7 -3v-7a7 7 0 0 1 14 0v7" fill="none" stroke="white" strokeWidth="3" /><circle cy="5" r="2.8" fill="#188B79" /><path d="M0 7v4" stroke="#188B79" strokeWidth="2" /></g>),
    (<g transform="translate(0 -5)"><rect x="-40" y="-26" width="74" height="57" rx="8" fill="white" stroke="#C9DFB1" /><path d="M-32 20h55" stroke="#C5D8D2" /><g fill="#87C742"><rect x="-30" y="7" width="9" height="13" rx="2" /><rect x="-17" y="0" width="9" height="20" rx="2" /><rect x="-4" y="-8" width="9" height="28" rx="2" /><rect x="9" y="-17" width="9" height="37" rx="2" /></g><path d="M-31 0l15-10 12 2 20-15" stroke="#148DAB" strokeWidth="2.5" fill="none" /><path d="M9 -23h8v8" stroke="#148DAB" strokeWidth="2.5" fill="none" /><g transform="translate(26 -7) rotate(-18)"><path d="M-13 -5h10l17-9v28L-3 5h-10z" fill="#159EAE" stroke="white" strokeWidth="1.5" /><path d="M-8 5l4 12h7L-1 5" fill="#16364D" /><path d="M19 -10l6-4M21 0h8M19 10l6 4" stroke="#76A923" strokeWidth="2" strokeLinecap="round" /></g></g>),
    (<g transform="translate(0 -5)"><g stroke="#697DE1" strokeWidth="2" fill="none"><path d="M-24 -19h-12v-12M24 -19h12v-12M-24 19h-12v12M24 19h12v12M0 -25v-13M0 25v13M-25 0h-15M25 0h15" /><g fill="#8BD13F" stroke="white"><circle cx="-36" cy="-31" r="4" /><circle cx="36" cy="-31" r="4" /><circle cx="-36" cy="31" r="4" /><circle cx="36" cy="31" r="4" /><circle cy="-38" r="4" /><circle cy="38" r="4" /><circle cx="-40" r="4" /><circle cx="40" r="4" /></g></g><rect x="-26" y="-26" width="52" height="52" rx="12" fill="#263D87" stroke="#8C9FF0" strokeWidth="2" /><rect x="-20" y="-20" width="40" height="40" rx="8" fill="#5165D5" /><text y="7" textAnchor="middle" fill="white" fontSize="21" fontWeight="700">AI</text><path d="M-13 -12h7M6 12h7" stroke="#A5F0E9" strokeWidth="2" strokeLinecap="round" /></g>)
  ];
  return illustrations[index];
}

function resolveServices(items) {
  const source = items?.length ? items : CATALOG;
  return source.map((item, index) => {
    const title = item.title || CATALOG[index % CATALOG.length].title;
    const known = CATALOG.find(
      (entry) => entry.title.toLowerCase() === String(title).trim().toLowerCase()
    ) || CATALOG[index % CATALOG.length];
    return {
      title,
      color: known.color,
      description: item.description || known.description,
      features: item.features?.length ? item.features : known.features,
      art: CATALOG.indexOf(known),
    };
  });
}

function indexAtTop(rotation, count) {
  if (!count) return 0;
  const step = 360 / count;
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < count; i += 1) {
    const screen = (((-90 + i * step + rotation) % 360) + 360) % 360;
    let delta = screen - 270;
    delta = ((delta % 360) + 360) % 360;
    if (delta > 180) delta -= 360;
    const dist = Math.abs(delta);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

export default function ServiceOrbit({ items, duration = 64, maxWidth = 920 }) {
  const services = useMemo(() => resolveServices(items), [items]);
  const uid = "orbit" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const rootRef = useRef(null);
  const rotationRef = useRef(0);
  const [hovered, setHovered] = useState(null);
  const [focused, setFocused] = useState(null);
  const [selected, setSelected] = useState(null);
  const [topIndex, setTopIndex] = useState(0);
  const pinned = hovered ?? focused ?? selected;
  const active = pinned ?? topIndex;
  const service = services[active] || null;
  const stopped = pinned !== null;
  const speed = Math.max(1, Number(duration) || 64);

  useEffect(() => {
    const root = rootRef.current;
    const count = services.length;
    if (!root || !count) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const apply = (rotation) => {
      root.style.setProperty("--ob-angle", `${rotation}deg`);
      const next = indexAtTop(rotation, count);
      setTopIndex((current) => (current === next ? current : next));
    };
    apply(rotationRef.current);
    if (stopped || reduced) return undefined;
    let frame = 0;
    let last = performance.now();
    const tick = (now) => {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      rotationRef.current = (rotationRef.current + (360 / speed) * delta) % 360;
      apply(rotationRef.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [services.length, speed, stopped]);
  return (
    <div ref={rootRef} className="ob-orbit" style={{ maxWidth, margin: "auto", width: "100%" }} onKeyDown={e => { if (e.key === "Escape") { setSelected(null); setHovered(null); setFocused(null); } }}>
      <style>{`
        .ob-orbit { font-family: Inter, system-ui, sans-serif; color: #15364a; }
        .ob-orbit svg { display: block; width: 100%; height: auto; overflow: visible; }
        .ob-orbit .ob-spin { transform-origin: 0px 0px; transform: rotate(var(--ob-angle)); }
        .ob-orbit .ob-upright { transform-origin: 0px 0px; transform: rotate(calc(var(--ob-angle) * -1)); }
        .ob-orbit .ob-node { cursor: pointer; outline: none; }
        .ob-orbit .ob-face { transition: transform .22s ease; transform-origin: 0px 0px; }
        .ob-orbit .ob-node:hover .ob-face, .ob-orbit .ob-node:focus-visible .ob-face, .ob-orbit .ob-active .ob-face { transform: scale(1.08); }
        .ob-orbit .ob-node:focus-visible .ob-focus { stroke-width: 4; opacity: 1; }
        .ob-orbit .ob-card { height: 100%; box-sizing: border-box; border: 1px solid #dcebed; border-radius: 24px; padding: 23px; background: linear-gradient(140deg, #fff, #edf9f9); display: flex; flex-direction: column; justify-content: center; box-shadow: 0 12px 28px #15364a13; }
        .ob-orbit .ob-card h3 { font-size: 24px; line-height: 1.1; margin: 0 0 10px; letter-spacing: -.7px; }
        .ob-orbit .ob-card p { font-size: 15px; line-height: 1.55; color: #526d80; margin: 0 0 13px; }
        .ob-orbit .ob-tags { display: flex; flex-wrap: wrap; gap: 5px; }
        .ob-orbit .ob-tags span { background: white; border: 1px solid #dcebed; border-radius: 20px; padding: 5px 9px; font-size: 11px; font-weight: 600; }
        .ob-orbit .ob-control { border: 1px solid #dcebed; background: white; color: #15364a; padding: 8px 15px; border-radius: 20px; cursor: pointer; font: inherit; font-size: 13px; }
        @media (prefers-reduced-motion: reduce) { .ob-orbit .ob-face { transition: none; } }
        @media (max-width: 560px) { .ob-orbit .ob-desktop-card { display: none; } .ob-orbit .ob-mobile-card { display: block !important; } }
      `}</style>
      <svg viewBox="0 0 900 860" role="group" aria-label="Interactive technology services orbit">
        <defs>
          <linearGradient id={`${uid}-glass`} x2=".8" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#eaf5f8"/></linearGradient>
          <linearGradient id={`${uid}-shield`} x2="1" y2="1"><stop stopColor="#8bd13f"/><stop offset="1" stopColor="#087c83"/></linearGradient>
          <linearGradient id={`${uid}-ring`}><stop stopColor="#29c4ca"/><stop offset=".5" stopColor="#c5e8e7"/><stop offset="1" stopColor="#8bd13f"/></linearGradient>
          <filter id={`${uid}-shadow`} x="-50%" y="-50%" width="200%" height="220%"><feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#16364d" floodOpacity=".15"/></filter>
        </defs>
        <g transform="translate(450 420)">
          <circle r="337" fill="none" stroke="#b7dde0" strokeDasharray="2 9"/>
          <circle r="320" fill="none" stroke={`url(#${uid}-ring)`} strokeWidth="2"/>
          <circle r="307" fill="none" stroke="#a9dcdd" strokeDasharray="2 7"/>
          <circle cx="320" r="4" fill="#8bd13f"/><circle cy="-320" r="4" fill="#29c4ca"/>
          {service && <foreignObject className="ob-desktop-card" x="-177" y="-105" width="354" height="210" pointerEvents="none"><div className="ob-card"><h3 style={{ color: service.color }}>{service.title}</h3><p>{service.description}</p><div className="ob-tags">{service.features.map(f => <span key={f}>{f}</span>)}</div></div></foreignObject>}
          <g className="ob-spin">
            {services.map((s, i) => {
              const angle = (-90 + i * (360 / services.length)) * Math.PI / 180;
              return <g key={s.title} transform={`translate(${320 * Math.cos(angle)} ${320 * Math.sin(angle)})`}>
                <g className="ob-upright"><g role="button" tabIndex={0} aria-label={s.title} aria-pressed={selected === i} className={`ob-node ${active === i ? "ob-active" : ""}`}
                  onPointerEnter={e => { if(e.pointerType !== "touch") setHovered(i); }} onPointerLeave={() => setHovered(null)} onFocus={() => setFocused(i)} onBlur={() => setFocused(null)}
                  onClick={() => setSelected(v => v === i ? null : i)} onKeyDown={e => { if(e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(v => v === i ? null : i); } }}>
                  <g className="ob-face">
                    <circle r="73" fill={s.color} opacity={active === i ? .18 : .06}/>
                    <circle r="65" fill={`url(#${uid}-glass)`} stroke="white" strokeWidth="2" filter={`url(#${uid}-shadow)`}/>
                    <circle className="ob-focus" r="60" fill="none" stroke={s.color} opacity={active === i ? 1 : .3}/>
                    <path d="M-58 -15 A60 60 0 0 1 -15 -58" fill="none" stroke={s.color} strokeWidth="3" strokeLinecap="round"/>
                    <Illustration index={s.art} uid={uid}/>
                    <circle cx="48" cy="-46" r="12" fill={s.color} stroke="white" strokeWidth="2"/>
                    <text x="48" y="-42" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">{String(i+1).padStart(2,"0")}</text>
                    <rect x="-88" y="49" width="176" height="32" rx="16" fill="white" stroke={s.color} strokeOpacity={active === i ? .8 : .25}/>
                    <text y="69" textAnchor="middle" fontSize="12" fontWeight="700" fill="#15364a">{s.title}</text>
                  </g>
                </g></g>
              </g>;
            })}
          </g>
        </g>
      </svg>
      <div className="ob-mobile-card" style={{ display: "none", padding: "0 12px 16px" }}>{service && <div className="ob-card"><h3>{service.title}</h3><p>{service.description}</p><div className="ob-tags">{service.features.map(f => <span key={f}>{f}</span>)}</div></div>}</div>
      <div role="status" aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }}>{service ? `${service.title}. ${service.description}` : "Choose a service"}</div>
      {selected !== null && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button type="button" className="ob-control" onClick={() => setSelected(null)}>Clear selection</button>
        </div>
      )}
    </div>
  );
}
