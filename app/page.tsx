import { AdBanner } from "@/components/AdBanner";
import { GitHubLastSeen } from "@/components/GitHubLastSeen";
import { Guestbook } from "@/components/Guestbook";
import type { GuestbookEntryItem } from "@/components/GuestbookEntry";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getInitialEntries(): Promise<GuestbookEntryItem[]> {
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

    return entries.map((entry) => ({
      ...entry,
      createdAt: entry.createdAt.toISOString()
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const initialEntries = await getInitialEntries();

  return (
    <main>
      <AdBanner />

      <section className="greeting section-fade fade-delay-1">
        <p>mrhba~</p>
        <p>
          i am <span className="name">7amdi</span> aka <span className="aka">koko</span>{" "}
          <span className="arabic">ⵎⵓⵃⴰⵎⵎⴷ</span>
          <br />
          full-time web dev, part-time linux-breaker
          <br />
          most of the stuff i&apos;m proud of lives on my{" "}
          <a href="https://github.com/74mdi" target="_blank" rel="noopener noreferrer">
            github
          </a>
          , the rest is still in my head
        </p>
      </section>

      <section className="section-fade fade-delay-2">
        <h2>extremely interesting info (no):</h2>
        <div className="info-table">
          <span className="info-label">location</span>
          <span className="info-value">🇲🇦 morocco, always</span>

          <span className="info-label">langs</span>
          <span className="info-value">
            <span className="tag">darija</span>
            <span className="tag">fr</span>
            <span className="tag">en</span>
            <span className="tag">tamazight</span>
          </span>

          <span className="info-label">last seen</span>
          <span className="info-value min-h-[1.25rem]">
            <GitHubLastSeen />
          </span>

          <span className="info-label">current mood</span>
          <span className="info-value">debugging something i wrote yesterday</span>

          <span className="info-label">tokens wasted</span>
          <span className="info-value">
            past 30d: uncountable
            <br />
            all time: astronomical
          </span>

          <span className="info-label">fav color</span>
          <span className="info-value inline-flex items-center">
            <span
              className="inline-block h-3 w-3 rounded-[2px]"
              style={{ background: "#c97a3a" }}
            />
            <span className="ml-1.5">#c97a3a (terracotta)</span>
          </span>

          <span className="info-label">fav os</span>
          <span className="info-value">fedora linux (gnome) — always</span>

          <span className="info-label">fav editor</span>
          <span className="info-value">windsurf ide w/ claude inside</span>

          <span className="info-label">fav font</span>
          <span className="info-value">EB Garamond + JetBrains Mono</span>

          <span className="info-label">interests</span>
          <span className="info-value">
            quran, minecraft, music, local AI, hardware tinkering, linux sysadmin
            rabbit holes
          </span>

          <span className="info-label">stack</span>
          <span className="info-value">
            <span className="tag">next.js 14</span>
            <span className="tag">ts</span>
            <span className="tag">tailwind</span>
            <span className="tag">prisma</span>
            <span className="tag">shadcn</span>
          </span>
        </div>
      </section>

      <section className="section-fade fade-delay-3">
        <h2>contact me (in order of preference):</h2>
        <div className="contact-table">
          <span className="contact-label">github</span>
          <a href="https://github.com/74mdi" target="_blank" rel="noopener noreferrer">
            @7amdi
          </a>

          <span className="contact-label">telegram</span>
          <span>ask nicely first</span>

          <span className="contact-label">matrix</span>
          <span>somewhere out there</span>

          <span className="contact-label">email</span>
          <span>koko [at] 7amdi [dot] dev</span>

          <span className="contact-label">carrier pigeon</span>
          <span>please don&apos;t</span>

          <span className="contact-label">post pigeons</span>
          <span>absolutely not</span>
        </div>
      </section>

      <section className="section-fade fade-delay-4">
        <h2>guestbook</h2>
        <p className="guestbook-title">{"// entries are pre-moderated, vibes only."}</p>
        <Guestbook initialEntries={initialEntries} />
      </section>

      <section className="section-fade fade-delay-5">
        <h2>active projects:</h2>
        <ul className="project-list">
          <li>
            - <a href="#">koko quran</a>
            <div className="sub-comment">
              {"// full quran reader + 74 reciters, animated, audio player"}
            </div>
          </li>
          <li>
            - <a href="#">koko tools</a>
            <div className="sub-comment">
              {"// 300+ browser tools, no external apis, always offline-safe"}
            </div>
          </li>
          <li>
            - <a href="#">nexahub</a>
            <div className="sub-comment">
              {"// saas platform, 500+ features, still cooking 👨‍🍳"}
            </div>
          </li>
          <li>
            - <a href="#">dot files</a>
            <div className="sub-comment">
              {"// fedora configs, rEFInd theme, gnome tweaks"}
            </div>
          </li>
        </ul>
      </section>

      <footer className="section-fade fade-delay-6">
        <span>7amdi © 2026 — built with next.js, caffeine, and claude </span>
        <br />
        <span className="arabic" style={{ color: "var(--accent2)" }}>
          ⵎⵓⵃⴰⵎⵎⴷ ⴰⵎⴰⵍⵃⴰⵏⵏⴰ
        </span>{" "}
        — morocco 🌍
      </footer>
    </main>
  );
}
