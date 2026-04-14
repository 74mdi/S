import { NextResponse } from "next/server";

type GitHubEvent = {
  type?: string;
  created_at?: string;
  repo?: {
    name?: string;
  };
};

export const revalidate = 300;

function stripOwner(repoName: string): string {
  return repoName.replace(/^74mdi\//, "");
}

function describeEvent(type: string | undefined, repoName: string): string {
  if (!type) {
    return "did something on github";
  }

  switch (type) {
    case "PushEvent":
      return `pushed to ${repoName}`;
    case "CreateEvent":
      return `created ${repoName}`;
    case "WatchEvent":
      return `starred ${repoName}`;
    case "ForkEvent":
      return `forked ${repoName}`;
    case "IssuesEvent":
      return `opened issue in ${repoName}`;
    default:
      return "did something on github";
  }
}

export async function GET() {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json"
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch("https://api.github.com/users/74mdi/events/public", {
      headers,
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      return NextResponse.json({ ok: false });
    }

    const events = (await response.json()) as GitHubEvent[];
    const latest = Array.isArray(events) ? events[0] : undefined;

    if (!latest?.repo?.name) {
      return NextResponse.json({ ok: false });
    }

    const cleanRepoName = stripOwner(latest.repo.name);

    return NextResponse.json({
      ok: true,
      action: describeEvent(latest.type, cleanRepoName),
      repoName: cleanRepoName,
      repoUrl: `https://github.com/${latest.repo.name}`,
      createdAt: latest.created_at ?? null
    });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
