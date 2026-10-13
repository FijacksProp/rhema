import { churchLinks } from "../../lib/church-links";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { imagery } from "../../lib/imagery";
import { BookOpen } from "lucide-react";
import { PageIntro, SectionLabel, TextLink } from "../components/page-elements";
export const metadata = { title: "Messages & teachings", description: "The message library of Rhema Chapel Stadium Church, Ilorin. Recordings and teachings coming soon." };
export default function MessagesPage() {
 return <><PageIntro label="Messages" title="A word for" accent="your everyday."><p>Return to a message. Take a moment to reflect. Discover teachings from Rhema Chapel Stadium Church as our library grows.</p></PageIntro><section className="word-section"><div className="wrap word-grid"><div className="word-art" aria-hidden="true"><Image src={imagery.teaching.src} style={imagery.teaching.style} alt="" fill sizes="(max-width: 760px) 100vw, 45vw" /><span>MAKE ROOM FOR</span><strong>THE WORD.</strong><em>Listen. Reflect. Live.</em><div className="word-rule" /></div><div><SectionLabel number="01">THE MESSAGE LIBRARY</SectionLabel><BookOpen size={32} strokeWidth={1.3} /><h2>Good things<br /><em>are on the way.</em></h2><p>There are no recordings available on this website yet. Messages will be added with their speaker, date, and available listening or viewing options.</p><a className="button button-paper" href={churchLinks.youtube} target="_blank" rel="noreferrer">Visit our YouTube channel <ArrowUpRight size={18} /></a><br /><TextLink href="/services">Join us for a service</TextLink></div></div></section><section data-reveal className="wrap editorial-section"><div className="editorial-grid"><h2>Stay close<br /><em>to church life.</em></h2><div className="link-stack"><TextLink href="/events">See what’s coming up</TextLink><TextLink href="/news">Read church updates</TextLink><TextLink href="/visit">Join us in person</TextLink></div></div></section></>;
}
