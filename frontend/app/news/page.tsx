import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EventPoster, PageIntro, SectionLabel } from "../components/page-elements";
import { getChurchContent, cmsMetadata } from "../../lib/cms";
import { ContentCards } from "../components/cms-content";
const fallbackMetadata = { title: "News & stories", description: "Updates, announcements, and stories from Rhema Chapel Stadium Church, Ilorin." };
export async function generateMetadata() { return cmsMetadata((await getChurchContent())?.indexes.news, fallbackMetadata); }
export default async function NewsPage() {
 const content = await getChurchContent();
 if (content?.managed.news) return <><PageIntro label="News & stories" title="Life here." accent="Shared with you."><p>{content?.indexes.news?.intro || "Announcements, church updates, and stories from our community."}</p></PageIntro><section className="wrap editorial-section"><SectionLabel number="01">FROM THE CHURCH</SectionLabel><ContentCards items={[...content.news].sort((a, b) => (b.publish_date ?? "").localeCompare(a.publish_date ?? ""))} empty="Our next story is on its way" /></section></>;
 return <><PageIntro label="News & stories" title="Life here." accent="Shared with you."><p>Announcements, church updates, and stories from our community. A place to stay connected to what’s happening at Rhema.</p></PageIntro><section data-reveal className="wrap editorial-section"><SectionLabel number="01">FROM THE CHURCH</SectionLabel><Link className="news-feature" href="/news/african-praise-save-the-date"><EventPoster compact /><div><span className="eyebrow">PROGRAMME ANNOUNCEMENT</span><h2>Mark your calendar.<br /><em>African Praise returns.</em></h2><p>Save 25 October 2026 for African Praise at Rhema Chapel Stadium Church, Ilorin. Here’s what we know so far.</p><span className="text-link">Read the announcement <ArrowUpRight size={19} /></span></div></Link><p className="news-endnote">More church news and community stories will be shared here as they become available.</p></section></>;
}
