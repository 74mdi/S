"use client";

import { useEffect, useMemo, useState } from "react";
import { formatTimeAgo } from "@/lib/timeAgo";

export type GuestbookEntryItem = {
  id: number | string;
  name: string;
  icon: string;
  message: string;
  createdAt: string;
  pending?: boolean;
};

type GuestbookEntryProps = {
  entry: GuestbookEntryItem;
  entryNumber: number;
  onRegister?: (id: number | string, element: HTMLElement | null) => void;
};

export function GuestbookEntry({
  entry,
  entryNumber,
  onRegister
}: GuestbookEntryProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 60000);
    return () => window.clearInterval(timer);
  }, []);

  const timeAgo = useMemo(
    () => formatTimeAgo(entry.createdAt, now),
    [entry.createdAt, now]
  );
  const numberLabel = `#${String(entryNumber).padStart(3, "0")}`;

  return (
    <article
      className={`entry ${entry.pending ? "pending" : ""}`}
      ref={(element) => onRegister?.(entry.id, element)}
    >
      <div className="entry-header">
        <span aria-hidden="true">{entry.icon}</span>
        <span className="entry-user">{entry.name}</span>
        <span className="entry-num">{numberLabel}</span>
        <span className="entry-date">
          {timeAgo}
          {entry.pending ? " · pending" : ""}
        </span>
      </div>
      <p className="entry-body">{entry.message}</p>
    </article>
  );
}
