import { notFound } from "next/navigation";
import { getChurchContent, formatChurchDate, formatChurchTime, cmsMetadata } from "../../lib/cms";
import { PageIntro, TextLink } from "./page-elements";
import { CmsImage, CmsSections, RichText } from "./cms-content";

export type DetailKind = "events" | "messages" | "news" | "people";
const labels = { events: "Events", messages: "Messages", news: "News & stories", people: "Leadership" };
const paths = { events: "/events", messages: "/messages", news: "/news", people: "/leadership" };

export async function detailMetadata(kind: DetailKind, slug: string) {
  const content = await getChurchContent();
  return cmsMetadata(content?.[kind].find(item => item.slug === slug), { title: "Page not found" });
}

export async function CmsDetail({ kind, slug, allowLocalFallback = false }: { kind: DetailKind; slug: string; allowLocalFallback?: boolean }) {
  const content = await getChurchContent();
  if (!content?.managed[kind]) {
    if (allowLocalFallback) return null;
    notFound();
  }
  const entry = content[kind].find(item => item.slug === slug);
  if (!entry) notFound();
  return <>
    <PageIntro label={labels[kind]} title={entry.title} accent="" photo={"cover" in entry ? entry.cover ?? undefined : "portrait" in entry ? entry.portrait ?? undefined : undefined}>
      {"summary" in entry && <p>{entry.summary}</p>}
      {"role" in entry && <p>{entry.role}</p>}
      <TextLink href={paths[kind]}>Back to {labels[kind].toLowerCase()}</TextLink>
    </PageIntro>
    <section className="wrap editorial-section">
      {"event_date" in entry && <><dl className="event-facts"><div><dt>DATE</dt><dd>{formatChurchDate(entry.event_date)}</dd></div><div><dt>TIME</dt><dd>{formatChurchTime(entry.start_time)}{entry.end_time && ` – ${formatChurchTime(entry.end_time)}`} (WAT)</dd></div><div><dt>VENUE</dt><dd>{entry.location || "Venue to be announced"}</dd></div></dl>{entry.registration_state === "open" && entry.registration_url && <a className="button button-ink" href={entry.registration_url} target="_blank" rel="noopener noreferrer">Register for this event <span className="sr-only">(opens in a new tab)</span></a>}{entry.registration_state === "closed" && <p>Registration is closed.</p>}</>}
      {"publish_date" in entry && <p>{entry.category} · {formatChurchDate(entry.publish_date)}</p>}
      {"message_date" in entry && <><p>{entry.speaker}{entry.message_date && ` · ${formatChurchDate(entry.message_date)}`}</p>{entry.series && <p>Series: {entry.series}</p>}{entry.topic && <p>Topic: {entry.topic}</p>}<div className="cms-channel-links">{entry.media_url && <a className="button button-ink" href={entry.media_url} target="_blank" rel="noopener noreferrer">Watch message <span className="sr-only">(opens in a new tab)</span></a>}{entry.audio_url && <a className="text-link" href={entry.audio_url} target="_blank" rel="noopener noreferrer">Listen to message <span className="sr-only">(opens in a new tab)</span></a>}</div><RichText html={entry.transcript} /></>}
      {"biography" in entry ? <div className="cms-profile">{entry.portrait && <CmsImage photo={entry.portrait} />}<RichText html={entry.biography} /></div> : <>{entry.cover && <figure className="cms-photo"><CmsImage photo={entry.cover} /></figure>}{"body" in entry && <RichText html={entry.body} />}</>}
    </section>
    {"sections" in entry && <CmsSections sections={entry.sections} />}
  </>;
}
