import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ALLOWED_ICONS } from "@/lib/guestbook";

const RATE_LIMIT_MS = 60_000;
const postCooldownByIp = new Map<string, number>();

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

function hasUrl(value: string): boolean {
  return /(https?:\/\/|www\.)/i.test(value);
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isAllowedIcon(icon: string): boolean {
  return (ALLOWED_ICONS as readonly string[]).includes(icon);
}

function pruneRateMap() {
  const now = Date.now();
  postCooldownByIp.forEach((timestamp, ip) => {
    if (now - timestamp > RATE_LIMIT_MS * 2) {
      postCooldownByIp.delete(ip);
    }
  });
}

export async function GET() {
  try {
    const entries = await prisma.guestbookEntry.findMany({
      where: { isPrivate: false },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        icon: true,
        message: true,
        createdAt: true
      }
    });

    return NextResponse.json({ entries });
  } catch {
    return NextResponse.json(
      { error: "failed to load guestbook" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json body" }, { status: 400 });
  }

  const rawName = typeof (body as { name?: unknown })?.name === "string"
    ? (body as { name: string }).name
    : "";
  const rawIcon = typeof (body as { icon?: unknown })?.icon === "string"
    ? (body as { icon: string }).icon
    : "";
  const rawMessage = typeof (body as { message?: unknown })?.message === "string"
    ? (body as { message: string }).message
    : "";
  const isPrivate = Boolean((body as { isPrivate?: unknown })?.isPrivate);

  const name = stripHtml(rawName);
  const icon = rawIcon.trim();
  const message = rawMessage.replace(/<[^>]*>/g, "").trim();

  if (name.length < 1 || name.length > 30) {
    return NextResponse.json(
      { error: "name must be between 1 and 30 characters" },
      { status: 400 }
    );
  }

  if (hasUrl(name)) {
    return NextResponse.json(
      { error: "name cannot include urls" },
      { status: 400 }
    );
  }

  if (!isAllowedIcon(icon)) {
    return NextResponse.json({ error: "invalid icon" }, { status: 400 });
  }

  if (message.length < 1 || message.length > 280) {
    return NextResponse.json(
      { error: "message must be between 1 and 280 characters" },
      { status: 400 }
    );
  }

  const ip = getClientIp(request);
  const now = Date.now();
  const lastPostAt = postCooldownByIp.get(ip) ?? 0;
  if (now - lastPostAt < RATE_LIMIT_MS) {
    return NextResponse.json({ error: "slow down :)" }, { status: 429 });
  }

  postCooldownByIp.set(ip, now);
  pruneRateMap();

  try {
    const entry = await prisma.guestbookEntry.create({
      data: {
        name,
        icon,
        message,
        isPrivate
      },
      select: {
        id: true,
        name: true,
        icon: true,
        message: true,
        createdAt: true
      }
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "failed to create entry" },
      { status: 500 }
    );
  }
}
