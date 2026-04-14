"use client";

import { useEffect, useMemo, useState } from "react";

const TIPS = [
  "tip: ublock origin + firefox = browsing nirvana",
  "your ad blocker is protecting the puppies 🐶",
  "fun fact: surah al-kahf has 110 ayat",
  "tip: JetBrains Mono is the only monospace font that matters",
  "status: ad-free zone. you're safe here",
  "local LLMs > cloud surveillance models"
];

export function AdBanner() {
  const [adBlocked, setAdBlocked] = useState<boolean | null>(null);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const el = document.createElement("div");
    el.className = "ad-detect pub_300x250 pub_300x250m adsbox";
    el.style.cssText = "position:absolute;left:-9999px;height:1px;width:1px;";
    document.body.appendChild(el);

    const timer = window.setTimeout(() => {
      if (el.offsetHeight === 0 || el.offsetParent === null) {
        setAdBlocked(true);
      } else {
        setAdBlocked(false);
      }
      if (document.body.contains(el)) {
        document.body.removeChild(el);
      }
    }, 100);

    return () => {
      window.clearTimeout(timer);
      if (document.body.contains(el)) {
        document.body.removeChild(el);
      }
    };
  }, []);

  useEffect(() => {
    if (adBlocked !== true) {
      return;
    }
    const interval = window.setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, [adBlocked]);

  const tip = useMemo(() => TIPS[tipIndex], [tipIndex]);

  if (adBlocked === null) {
    return (
      <div className="banner-base banner-tip section-fade" aria-live="polite">
        checking ad blocker...
      </div>
    );
  }

  if (adBlocked) {
    return (
      <div className="banner-base banner-tip section-fade" aria-live="polite">
        <p key={tip} className="tip-fade">
          {tip}
        </p>
      </div>
    );
  }

  return (
    <div className="banner-base banner-warning section-fade" aria-live="polite">
      <p>
        you are not using an ad blocker (which is making these puppies sad) 🐶
        {" → "}please enable one. uBlock Origin is free and open source.{" "}
        <a
          href="https://ublockorigin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          get uBlock Origin →
        </a>
      </p>
    </div>
  );
}
