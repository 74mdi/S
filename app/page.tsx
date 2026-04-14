import { AdBanner } from "@/components/AdBanner";
import { GitHubLastSeen } from "@/components/GitHubLastSeen";
import { Guestbook } from "@/components/Guestbook";
import { LastFmLastListened, LastFmNowPlaying } from "@/components/LastFmStatus";
import type { GuestbookEntryItem } from "@/components/GuestbookEntry";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getInitialEntries(): Promise<{
  entries: GuestbookEntryItem[];
  available: boolean;
}> {
  if (!process.env.DATABASE_URL) {
    return {
      entries: [],
      available: false
    };
  }

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

    return {
      entries: entries.map((entry: (typeof entries)[number]) => ({
        ...entry,
        createdAt: entry.createdAt.toISOString()
      })),
      available: true
    };
  } catch {
    return {
      entries: [],
      available: false
    };
  }
}

export default async function HomePage() {
  const guestbookState = await getInitialEntries();

  return (
    <main>
      <AdBanner />

      <section className="greeting section-fade fade-delay-1">
        <p>salam~</p>
        <p>
          ana <span className="name">mohamed</span> aka <span className="aka">7amdi</span>
          i build web stuff and break linux 3lah? diha fmok
          <br />
        </p>
      </section>

      <section className="section-fade fade-delay-2">
        <h2>tiny facts about me:</h2>
        <div className="info-table">
          <span className="info-label">location</span>
          <span className="info-value">lhih</span>

          <span className="info-label">langs</span>
          <span className="info-value">
            <span className="tag">darija</span>
            <span className="tag">en</span>
            <span className="tag">chel7a</span>
          </span>

          <span className="info-label">last seen</span>
          <span className="info-value min-h-[1.25rem]">
            <GitHubLastSeen />
          </span>

          <span className="info-label">current mood</span>
          <span className="info-value">diha fmok</span>

          <span className="info-label">listening</span>
          <span className="info-value min-h-[1.25rem]">
            <LastFmNowPlaying />
          </span>

          <span className="info-label">last listened</span>
          <span className="info-value min-h-[1.25rem]">
            <LastFmLastListened />
          </span>

          <span className="info-label">tokens wasted</span>
          <span className="info-value">
            past 30d: bzff 
            <br />
            all time: bzf mn bzfff(agodii)
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
          <span className="info-value">fedora linux (gnome)</span>

          <span className="info-label">fav editor</span>
          <span className="info-value">cursor</span>

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
        <h2>find me here:</h2>
        <div className="contact-table">
          <span className="contact-label">github</span>
          <a href="https://github.com/74mdi" target="_blank" rel="noopener noreferrer">
            @7amdi
          </a>

          <span className="contact-label">telegram</span>
          <span>ask first</span>

          <span className="contact-label">X</span>
          <span>i forget to check it, but yes</span>

          <span className="contact-label">email</span>
          <span>7amdi [at] tuta [dot] io</span>

          <span className="contact-label">carrier pigeon</span>
          <span>wrong continent</span>

          <span className="contact-label">post pigeons</span>
          <span>they are on strike</span>
        </div>
      </section>

      <section className="section-fade fade-delay-4">
        <h2>guestbook</h2>
        <p className="guestbook-title">{"// entries are pre-moderated, vibes only."}</p>
        <Guestbook
          initialEntries={guestbookState.entries}
          available={guestbookState.available}
        />
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
              {"// saas platform, huge feature list, still cooking"}
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
        <span>7amdi © 2026</span>
      </footer>
    </main>
  );
}
