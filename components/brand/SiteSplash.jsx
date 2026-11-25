"use client";

import { useEffect, useState } from "react";
import BrandLoader from "@/components/brand/BrandLoader";

// First-visit splash. It is server-rendered so it covers the page from the first
// paint, then fades out once the window has loaded. A CSS fallback hides it after
// a few seconds even if this script never runs.
export default function SiteSplash() {
  const [state, setState] = useState("shown");

  useEffect(() => {
    let fadeTimer;
    const hide = () => {
      setState("leaving");
      fadeTimer = window.setTimeout(() => setState("gone"), 650);
    };
    const cap = window.setTimeout(hide, 3500);
    if (document.readyState === "complete") hide();
    else window.addEventListener("load", hide, { once: true });
    return () => {
      window.clearTimeout(cap);
      window.clearTimeout(fadeTimer);
      window.removeEventListener("load", hide);
    };
  }, []);

  if (state === "gone") return null;

  return (
    <div className={`site-splash${state === "leaving" ? " is-leaving" : ""}`}>
      <BrandLoader id="splash" />
    </div>
  );
}
