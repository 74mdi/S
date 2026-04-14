"use client";

import { useEffect, useMemo, useState } from "react";

const TIPS = [
  "tip: ublock origin + firefox = clean internet",
  "your ad blocker just blocked 14 weird trackers",
  "fun fact: surah al-kahf has 110 ayat",
  "tip: close 32 tabs, open one terminal",
  "status: ad-free zone. you are safe here",
  "local llms on old hardware feel like magic"
];

export function AdBanner() {
  const [adBlocked, setAdBlocked] = useState<boolean | null>(null);
  const [tipIndex, setTipIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
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
    const interval = window.setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, []);

  const tip = useMemo(() => TIPS[tipIndex], [tipIndex]);

  if (!ready) {
    return (
      <div className="banner-base banner-tip section-fade" aria-live="polite">
        loading silly banner...
      </div>
    );
  }

  if (adBlocked !== false) {
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
        i detected ads in your browser. install uBlock Origin, then come back cleaner.{" "}
        <a
          href="https://github.com/gorhill/uBlock"
          target="_blank"
          rel="noopener noreferrer"
        >
          get uBlock Origin
        </a>
      </p>
    </div>
  );
}
