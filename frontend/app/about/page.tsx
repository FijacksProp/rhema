import { imagery } from "../../lib/imagery";
import Image from "next/image";
import { PageIntro, SectionLabel, TextLink, VisitBand } from "../components/page-elements";
export const metadata = { title: "Our church", description: "Get to know Rhema Chapel Stadium Church, a church family at Stadium Second Gate, Ilorin." };
export default function AboutPage() {
 return <>
  <PageIntro label="Our church" title="A church." accent="A family."><p>We are Rhema Chapel Stadium Church, Ilorin. A place to come together in faith, make meaningful connections, and find your place in church life.</p><TextLink href="/visit">Come and meet us</TextLink></PageIntro>
  <section data-reveal className="wrap editorial-section"><SectionLabel number="01">GET TO KNOW US</SectionLabel><div className="editorial-grid"><h2>Here in Ilorin.<br /><em>Here for you.</em></h2><div className="prose"><p className="large-copy">A church is more than its address. It is the people who gather there.</p><p>Our branch is Rhema Chapel Stadium Church, located at Stadium Second Gate in Ilorin, Kwara State. This website is a place to discover our gatherings, get to know our leadership, and stay connected with the life of the church.</p><p>Whether you’re exploring faith, visiting with a friend, or looking for a church home, we look forward to meeting you.</p></div></div></section>
  <section className="about-photo"><Image {...imagery.gathering} fill sizes="100vw" /><div className="wrap"><p>Together in worship.<br /><em>Together in life.</em></p></div></section>
  <section data-reveal className="wrap editorial-section"><SectionLabel number="02">OUR STORY IS STILL BEING TOLD</SectionLabel><div className="editorial-grid"><h2>Get a little<br /><em>closer.</em></h2><div><div className="content-note"><h3>Our story & beliefs</h3><p>The church’s history, vision, mission, and statement of faith will be shared here once the official wording is available.</p></div><div className="link-stack"><TextLink href="/leadership">Meet the leadership</TextLink><TextLink href="/departments">Discover our departments</TextLink><TextLink href="/services">Explore our gatherings</TextLink></div></div></div></section><VisitBand />
 </>;
}
