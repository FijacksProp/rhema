import { CmsDetail } from "../../components/cms-detail";
import { getChurchContent, cmsMetadata } from "../../../lib/cms";
import { africanPraise } from "../../../lib/african-praise";
import Link from "next/link";
import { EventPoster, TextLink } from "../../components/page-elements";
const fallbackMetadata = { title: "Save the date: African Praise 2026", description: "African Praise returns on 25 October 2026 at Rhema Chapel Stadium Church, Ilorin." };
export async function generateMetadata() { return cmsMetadata((await getChurchContent())?.news.find(item => item.slug === "african-praise-save-the-date"), fallbackMetadata); }
export default async function StoryPage() {
 const managed = await CmsDetail({ kind: "news", slug: "african-praise-save-the-date", allowLocalFallback: true });
 if (managed) return managed;
 return <article className="wrap article-page"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/news">News & stories</Link></div><header><span className="eyebrow">PROGRAMME ANNOUNCEMENT</span><h1>Mark your calendar.<br /><em>African Praise returns.</em></h1><p className="article-standfirst">25 October 2026. Rhema Chapel Stadium Church. A date for our church family and everyone joining us in Ilorin.</p></header><div className="article-poster"><EventPoster /></div><div className="article-body prose"><h2>Looking ahead to African Praise</h2><p>Preparations are underway for this year’s African Praise programme, following last year’s gathering. The service will take place on Sunday, 25 October 2026 at 8:00 AM (West Africa Time), hosted by Pastor Jonathan Tobin.</p><h2>Where we’ll gather</h2><p>Join us at Rhema Chapel Stadium Church, Stadium Second Gate, Ilorin, Kwara State, Nigeria.</p><h2>Register your attendance</h2><p>Registration is available through the church’s Google Form. Complete the form to register your attendance. Additional programme highlights and arrival arrangements will be shared on the event page as they are confirmed.</p><p>For now, save the date and share the event page with someone you’d like to invite.</p><a className="button button-red" href={africanPraise.registrationUrl} target="_blank" rel="noreferrer">Open the registration form ↗</a><br /><TextLink href="/events/african-praise">Go to the African Praise event page</TextLink></div></article>;
}
