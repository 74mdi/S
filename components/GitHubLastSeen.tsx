"use client";

import { useEffect, useState } from "react";
import { formatTimeAgo } from "@/lib/timeAgo";

type GitHubPayload = {
  ok: boolean;
  action?: string;
  repoName?: string;
  repoUrl?: string;
  createdAt?: string | null;
};

export function GitHubLastSeen() {
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState<GitHubPayload | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    let mounted = true;

    async function loadLastSeen() {
      try {
        const response = await fetch("/api/github");
        const data = (await response.json()) as GitHubPayload;
        if (!mounted) {
          return;
        }
        setPayload(data);
      } catch {
        if (mounted) {
          setPayload({ ok: false });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadLastSeen();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 60000);
    return () => window.clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <span className="inline-flex min-h-[1.25rem] items-center text-[var(--muted)]">
        <span className="animate-pulse">--</span>
      </span>
    );
  }

  if (!payload?.ok || !payload.repoUrl || !payload.action) {
    return (
      <span className="inline-flex min-h-[1.25rem] items-center">
        last seen: somewhere on github
      </span>
    );
  }

  const timeLabel = payload.createdAt
    ? formatTimeAgo(payload.createdAt, nowMs)
    : "a while ago";

  return (
    <span className="inline-flex min-h-[1.25rem] items-center">
      <a href={payload.repoUrl} target="_blank" rel="noopener noreferrer">
        {payload.action}
      </a>
      <span className="muted ml-1">, {timeLabel}</span>
    </span>
  );
}
