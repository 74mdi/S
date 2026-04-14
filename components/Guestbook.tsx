"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ALLOWED_ICONS, SHUFFLE_NAMES } from "@/lib/guestbook";
import { IconPicker } from "@/components/IconPicker";
import { NameInput } from "@/components/NameInput";
import { GuestbookEntry, GuestbookEntryItem } from "@/components/GuestbookEntry";

type GuestbookProps = {
  initialEntries: GuestbookEntryItem[];
  available?: boolean;
};

const MAX_NAME = 30;
const MAX_MESSAGE = 280;

function randomItem(list: readonly string[]): string {
  return list[Math.floor(Math.random() * list.length)] ?? list[0];
}

export function Guestbook({ initialEntries, available = true }: GuestbookProps) {
  const [entries, setEntries] = useState<GuestbookEntryItem[]>(initialEntries);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<string>(ALLOWED_ICONS[0]);
  const [message, setMessage] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const entryRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const fallbackIcon = randomItem(ALLOWED_ICONS);

    try {
      const raw = window.localStorage.getItem("gb_identity");
      if (!raw) {
        setIcon(fallbackIcon);
        setReady(true);
        return;
      }

      const parsed = JSON.parse(raw) as { name?: string; icon?: string };
      const nextName =
        typeof parsed.name === "string"
          ? parsed.name.replace(/<[^>]*>/g, "").trim().slice(0, MAX_NAME)
          : "";
      const nextIcon =
        typeof parsed.icon === "string" &&
        (ALLOWED_ICONS as readonly string[]).includes(parsed.icon)
          ? parsed.icon
          : fallbackIcon;

      setName(nextName);
      setIcon(nextIcon);
    } catch {
      setIcon(fallbackIcon);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    window.localStorage.setItem("gb_identity", JSON.stringify({ name, icon }));
  }, [name, icon, ready]);

  const messageCountClass = useMemo(() => {
    if (message.length >= 260) {
      return "text-[#e05a5a]";
    }
    if (message.length >= 200) {
      return "text-[var(--accent)]";
    }
    return "text-[var(--muted)]";
  }, [message.length]);

  const canSubmit =
    available && name.trim().length > 0 && message.trim().length > 0 && !submitting;

  function handleNameChange(value: string) {
    setName(value.slice(0, MAX_NAME));
  }

  function handleShuffleName() {
    setName(randomItem(SHUFFLE_NAMES));
  }

  function registerEntryRef(id: number | string, element: HTMLElement | null) {
    entryRefs.current[String(id)] = element;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setSubmitting(true);
    setError(null);
    setNotice(null);

    const payload = {
      name: name.trim(),
      icon,
      message: message.trim(),
      isPrivate
    };

    let optimisticId: string | null = null;
    if (!isPrivate) {
      optimisticId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const optimisticEntry: GuestbookEntryItem = {
        id: optimisticId,
        name: payload.name,
        icon: payload.icon,
        message: payload.message,
        createdAt: new Date().toISOString(),
        pending: true
      };
      setEntries((current) => [optimisticEntry, ...current]);

      window.setTimeout(() => {
        entryRefs.current[String(optimisticId)]?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 50);
    }

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = (await response.json()) as {
        entry?: GuestbookEntryItem;
        error?: string;
      };

      if (!response.ok || !data.entry) {
        throw new Error(data.error ?? "could not send message");
      }

      if (isPrivate) {
        setNotice("private message sent.");
      } else if (optimisticId) {
        setEntries((current) =>
          current.map((entry) =>
            entry.id === optimisticId
              ? { ...data.entry!, pending: false, createdAt: data.entry!.createdAt }
              : entry
          )
        );
      }

      setMessage("");
    } catch (submitError) {
      if (optimisticId) {
        setEntries((current) => current.filter((entry) => entry.id !== optimisticId));
      }
      setError(submitError instanceof Error ? submitError.message : "could not send message");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="gb-panel gb-panel-identity">
        <p className="muted mb-2 text-[12px] italic">{"// identity card"}</p>
        <div className="rounded-[2px] border border-[var(--border)] bg-[#1a1713] p-2">
          <div className="sm:flex sm:items-start">
            <button
              type="button"
              className="mr-0 inline-flex h-11 w-11 items-center justify-center border border-[var(--accent)] text-[20px] sm:mr-2"
              onClick={() => setIcon(randomItem(ALLOWED_ICONS))}
              aria-label="pick random icon"
            >
              {icon}
            </button>
            <div className="mt-2 min-w-0 flex-1 sm:mt-0">
              <NameInput
                name={name}
                maxLength={MAX_NAME}
                onNameChange={handleNameChange}
                onShuffle={handleShuffleName}
              />
            </div>
          </div>
          <IconPicker icons={ALLOWED_ICONS} selectedIcon={icon} onSelect={setIcon} />
        </div>
      </div>

      <form className="gb-panel gb-panel-compose" onSubmit={handleSubmit}>
        <textarea
          rows={3}
          className="textarea"
          placeholder={available ? "leave a message~" : "guestbook is offline right now"}
          value={message}
          onChange={(event) => setMessage(event.target.value.slice(0, MAX_MESSAGE))}
          maxLength={MAX_MESSAGE}
          aria-label="leave a message"
          disabled={!available}
        />
        <div className="mt-2 sm:flex sm:items-center">
          <label className="muted inline-flex min-h-11 cursor-pointer items-center text-[12px]">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(event) => setIsPrivate(event.target.checked)}
              className="mr-2 h-4 w-4 accent-[var(--accent)]"
              disabled={!available}
            />
            as private message
          </label>
          <span className={`mt-2 block text-[11px] sm:ml-3 sm:mt-0 ${messageCountClass}`}>
            {message.length}/{MAX_MESSAGE}
          </span>
          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 min-h-11 min-w-[92px] border-none bg-[var(--accent)] px-3 text-[12px] text-black disabled:cursor-not-allowed disabled:opacity-45 sm:ml-auto sm:mt-0"
          >
            {submitting ? "sending..." : "send"}
          </button>
        </div>

        {error ? <p className="mt-2 text-[12px] text-[#e05a5a]">{error}</p> : null}
        {notice ? <p className="mt-2 text-[12px] text-[var(--accent2)]">{notice}</p> : null}
        {!available ? (
          <p className="mt-2 text-[12px] text-[var(--muted)]">
            guestbook backend is not configured yet. add your Neon `DATABASE_URL` and it will
            work again.
          </p>
        ) : null}
      </form>

      <div className="mt-2 min-h-[120px]">
        {entries.length === 0 ? (
          <article className="entry">
            <p className="muted">no public entries yet. be the first.</p>
          </article>
        ) : (
          entries.map((entry, index) => (
            <GuestbookEntry
              key={entry.id}
              entry={entry}
              entryNumber={index + 1}
              onRegister={registerEntryRef}
            />
          ))
        )}
      </div>
    </div>
  );
}
