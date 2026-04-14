import { NextResponse } from "next/server";

type LastFmTrackImage = {
  "#text"?: string;
  size?: string;
};

type LastFmTrack = {
  name?: string;
  url?: string;
  artist?: {
    "#text"?: string;
  };
  album?: {
    "#text"?: string;
  };
  image?: LastFmTrackImage[];
  date?: {
    uts?: string;
  };
  "@attr"?: {
    nowplaying?: string;
  };
};

type LastFmRecentTracksResponse = {
  recenttracks?: {
    track?: LastFmTrack[] | LastFmTrack;
  };
};

function getTrackImage(images: LastFmTrackImage[] | undefined): string | null {
  if (!images?.length) {
    return null;
  }

  const preferred =
    images.find((image) => image.size === "medium" && image["#text"]) ??
    images.find((image) => image.size === "small" && image["#text"]) ??
    images.find((image) => image["#text"]);

  return preferred?.["#text"] ?? null;
}

function normalizeTrack(track: LastFmTrack) {
  return {
    name: track.name?.trim() || "unknown track",
    artist: track.artist?.["#text"]?.trim() || "unknown artist",
    album: track.album?.["#text"]?.trim() || "",
    url: track.url?.trim() || null,
    image: getTrackImage(track.image),
    playedAt: track.date?.uts ? Number(track.date.uts) * 1000 : null
  };
}

export const revalidate = 60;

export async function GET() {
  const username = process.env.LASTFM_USERNAME?.trim();
  const apiKey = process.env.LASTFM_API_KEY?.trim();

  if (!username || !apiKey) {
    return NextResponse.json({
      ok: false,
      reason: "not_configured"
    });
  }

  const search = new URLSearchParams({
    method: "user.getrecenttracks",
    user: username,
    api_key: apiKey,
    format: "json",
    limit: "5"
  });

  try {
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?${search.toString()}`, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      return NextResponse.json({ ok: false, reason: "upstream_failed" });
    }

    const data = (await response.json()) as LastFmRecentTracksResponse;
    const rawTracks = data.recenttracks?.track;
    const tracks = Array.isArray(rawTracks) ? rawTracks : rawTracks ? [rawTracks] : [];

    if (tracks.length === 0) {
      return NextResponse.json({ ok: false, reason: "no_tracks" });
    }

    const nowPlayingTrack = tracks.find((track) => track["@attr"]?.nowplaying === "true") ?? null;
    const mostRecentFinishedTrack =
      tracks.find((track) => track["@attr"]?.nowplaying !== "true") ?? null;

    return NextResponse.json({
      ok: true,
      username,
      listening: nowPlayingTrack ? normalizeTrack(nowPlayingTrack) : null,
      recent: mostRecentFinishedTrack ? normalizeTrack(mostRecentFinishedTrack) : null
    });
  } catch {
    return NextResponse.json({ ok: false, reason: "request_failed" });
  }
}
