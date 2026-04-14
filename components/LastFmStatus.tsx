"use client";

import { useEffect, useState } from "react";
import { formatTimeAgo } from "@/lib/timeAgo";

type LastFmTrack = {
  name: string;
  artist: string;
  album: string;
  url: string | null;
  image: string | null;
  playedAt: number | null;
};

type LastFmPayload = {
  ok: boolean;
  listening?: LastFmTrack | null;
  recent?: LastFmTrack | null;
  reason?: string;
};

function useLastFmStatus() {
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState<LastFmPayload | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    let mounted = true;

    async function loadLastFm() {
      try {
        const response = await fetch("/api/lastfm");
        const data = (await response.json()) as LastFmPayload;

        if (mounted) {
          setPayload(data);
        }
      } catch {
        if (mounted) {
          setPayload({ ok: false, reason: "request_failed" });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadLastFm();
    const refreshTimer = window.setInterval(() => {
      void loadLastFm();
    }, 60_000);
    const clockTimer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 60_000);

    return () => {
      mounted = false;
      window.clearInterval(refreshTimer);
      window.clearInterval(clockTimer);
    };
  }, []);

  return { loading, payload, nowMs };
}

function TrackLink({
  track,
  fallback
}: {
  track: LastFmTrack | null | undefined;
  fallback: string;
}) {
  if (!track) {
    return <span>{fallback}</span>;
  }

  const label = `${track.name} - ${track.artist}`;

  if (!track.url) {
    return <span>{label}</span>;
  }

  return (
    <a href={track.url} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}

export function LastFmNowPlaying() {
  const { loading, payload } = useLastFmStatus();

  if (loading) {
    return <span className="muted">checking last.fm...</span>;
  }

  if (!payload?.ok && payload?.reason === "not_configured") {
    return <span className="muted">not wired yet</span>;
  }

  if (!payload?.ok || !payload.listening) {
    return <span className="muted">not listening right now</span>;
  }

  return <TrackLink track={payload.listening} fallback="not listening right now" />;
}

export function LastFmLastListened() {
  const { loading, payload, nowMs } = useLastFmStatus();

  if (loading) {
    return <span className="muted">checking last.fm...</span>;
  }

  if (!payload?.ok && payload?.reason === "not_configured") {
    return <span className="muted">not wired yet</span>;
  }

  if (!payload?.recent) {
    return <span className="muted">nothing recent yet</span>;
  }

  const timeLabel = payload.recent.playedAt
    ? formatTimeAgo(payload.recent.playedAt, nowMs)
    : "a while ago";

  return (
    <span>
      <TrackLink track={payload.recent} fallback="nothing recent yet" />
      <span className="muted ml-1">, {timeLabel}</span>
    </span>
  );
}
