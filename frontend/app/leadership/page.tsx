import { PageIntro, SectionLabel, TextLink, VisitBand } from "../components/page-elements";
import { getChurchContent, cmsMetadata } from "../../lib/cms";
import { ContentCards } from "../components/cms-content";
const fallbackMetadata = { title: "Our leadership", description: "Pastors, ministers, deacons and department heads at Rhema Chapel Stadium Church, Ilorin." };
const roles = [
 {number:"01",title:"Pastors",description:"Get to know the pastoral leadership of Rhema Chapel Stadium Church.",detail:"Pastoral profiles and biographies will be published here."},
 {number:"02",title:"Ministers",description:"Meet the ministers who are part of our church community.",detail:"Names, ministry responsibilities, and introductions are coming soon."},
 {number:"03",title:"Deacons",description:"Discover the people serving in the church’s diaconate.",detail:"The deacons’ directory will be shared here once confirmed."},
 {number:"04",title:"Department heads",description:"Meet the people leading the teams that contribute to church life.",detail:"Department head profiles will be linked to their respective departments."},
];
export async function generateMetadata() { return cmsMetadata((await getChurchContent())?.indexes.people, fallbackMetadata); }
export default async function LeadershipPage() {
 const content = await getChurchContent();
 if (content?.managed.people) return <><PageIntro label="Leadership" title="People with" accent="a heart to serve."><p>{content?.indexes.people?.intro || "Meet the people serving our church family."}</p></PageIntro><section className="wrap editorial-section"><SectionLabel number="01">OUR LEADERSHIP</SectionLabel><ContentCards items={content.people.map(person => ({ ...person, cover: person.portrait, summary: person.role }))} empty="Leadership profiles are being prepared" /></section><VisitBand /></>;
 return <><PageIntro label="Leadership" title="People with" accent="a heart to serve."><p>Behind every welcome, gathering, and shared moment are people. Get to know our pastors, ministers, deacons, and department heads.</p><span className="pill">Leadership profiles coming soon</span></PageIntro><section data-reveal className="wrap editorial-section"><SectionLabel number="01">OUR LEADERSHIP</SectionLabel><div className="role-list">{roles.map(role => <article key={role.number} className="role-row"><span className="role-number">{role.number}</span><h2>{role.title}</h2><div><p>{role.description}</p><p className="muted-note">{role.detail}</p></div></article>)}</div></section><section data-reveal className="paper-section"><div className="wrap editorial-grid"><h2>A conversation<br /><em>starts here.</em></h2><div className="prose"><p>Looking to speak with someone or learn more about a department? Visit our contact page for the latest available contact information.</p><TextLink href="/contact">Contact the church</TextLink><TextLink href="/departments">Explore departments</TextLink></div></div></section><VisitBand /></>;
}
