import { WelcomeHeading } from "./components/welcome-heading";
import { getChurchContent, contentLinks, cmsMetadata, formatChurchDate } from "../lib/cms";
import { ContentCards, CmsSections, StreamingLinks } from "./components/cms-content";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { PhotoStories } from "./components/photo-stories";
import { imagery } from "../lib/imagery";
import { EventPoster, SectionLabel, TextLink } from "./components/page-elements";

export async function generateMetadata() { const home = (await getChurchContent())?.home; return { ...cmsMetadata(home ?? undefined, {}), title: { absolute: home?.seo_title || "Rhema Chapel Stadium Church | Ilorin" } }; }
export default async function HomePage() {
  const content = await getChurchContent();
  const home = content?.home;
  const churchLinks = contentLinks(content);
  const event = content?.managed.events ? content.events.find(item => item.id === home?.featured_event) : undefined;
  const message = content?.managed.messages ? content.messages.find(item => item.id === home?.featured_message) : undefined;
  const news = content?.managed.news ? content.news.find(item => item.id === home?.featured_news) : undefined;
  return <>
    <section className="home-hero">
      <div className="hero-photo"><Image {...(home?.hero ? { src: home.hero.src, alt: home.hero.alt } : imagery.hero)} unoptimized={Boolean(home?.hero)} fill sizes="100vw" priority /></div>
      <div className="wrap hero-content">
        <div className="hero-location"><span className="live-dot" />A CHURCH FAMILY IN ILORIN, NIGERIA</div>
        <WelcomeHeading heading={home?.heading} accent={home?.accent} />
        <p className="cms-lines">{home?.intro || "A place to know God.\nA people to do life with.\nA welcome with your name on it."}</p>
        <Link className="button button-red" href="/visit">Find your place here <ArrowUpRight size={19} /></Link>
        <div className="hero-streaming">
          <span className="eyebrow">JOIN US ONLINE</span>
          <StreamingLinks links={churchLinks} />
        </div>
        <a href="#welcome" className="hero-scroll"><ArrowDown size={16} /> A little more about us</a>
      </div>
      <div className="hero-photo-caption">FAITH FINDS A VOICE.<br />COMMUNITY FINDS A HOME.</div>
      {content?.managed.events ? event && <Link className="hero-event-ticket" href={event.path}><span><small>COMING TO RHEMA</small><strong>{event.title}</strong><span>{formatChurchDate(event.event_date)}</span></span><ArrowUpRight size={26} /></Link> : <Link className="hero-event-ticket" href="/events/african-praise"><span className="ticket-date">25<small>OCT ’26</small></span><span><small>COMING TO RHEMA</small><strong>African Praise</strong><span>Save the date. Bring someone.</span></span><ArrowUpRight size={26} /></Link>}
    </section>
    <div className="wrap quick-paths" data-reveal><Link href="/visit"><span>NEW TO RHEMA?</span><strong>Your first visit <ArrowUpRight size={20} /></strong></Link><Link href="/events"><span>MAKE ROOM IN YOUR DIARY</span><strong>Find a gathering <ArrowUpRight size={20} /></strong></Link><Link href="/get-involved"><span>THERE IS A PLACE FOR YOU</span><strong>Grow with us <ArrowUpRight size={20} /></strong></Link></div>
    <section data-reveal className="wrap welcome-section" id="welcome"><SectionLabel number="01">THIS IS RHEMA</SectionLabel><div className="welcome-content"><div><h2>More than a place.<br /><em>A people.</em></h2><div className="welcome-photo-stack"><div><Image {...imagery.welcome} fill sizes="(max-width: 760px) 80vw, 35vw" /></div><div><Image {...imagery.prayer} fill sizes="(max-width: 760px) 40vw, 18vw" /></div><span>WORSHIP. GROW. BELONG.</span></div></div><div><p className="large-copy">Life is better when we walk together.</p><p>Welcome to Rhema Chapel Stadium Church. Whether Ilorin has always been home or you’re just finding your feet, we’d love to welcome you into our church family.</p><p>Come with your questions, your story, and your hopes. There’s a place for you to worship, grow, and belong.</p><TextLink href="/about">Get to know our church</TextLink></div></div></section>
    {content?.managed.events ? event && <section className="wrap cms-home-highlights"><h2>Coming together.</h2><ContentCards items={[event]} empty="" /></section> : <>
    <section data-reveal className="home-event"><div className="wrap"><div className="section-heading"><SectionLabel number="02">ON THE HORIZON</SectionLabel><TextLink href="/events">All events & programmes</TextLink></div><div className="feature-event-grid"><Link className="poster-link" href="/events/african-praise" aria-label="Discover African Praise 2026"><EventPoster /></Link><div className="event-editorial"><span className="pill">A date to look forward to</span><h2>Many voices.<br />One great<br /><em>celebration.</em></h2><p>African Praise returns to Rhema Chapel Stadium Church on 25 October. A day to gather, lift our voices, and celebrate together.</p><dl className="event-facts"><div><dt>WHEN</dt><dd>Sunday, 25 October 2026 at 8:00 AM</dd></div><div><dt>WHERE</dt><dd>Stadium Second Gate, Ilorin</dd></div></dl><Link className="button button-ink" href="/events/african-praise">Explore African Praise <ArrowUpRight size={18} /></Link><small className="muted-note">Sunday, 25 October at 8:00 AM. Register on the event page.</small></div></div></div></section>
    </>}
    <section data-reveal className="wrap church-life"><SectionLabel number="03">A LIFE SHARED</SectionLabel><div className="life-heading"><h2>Find your people.<br /><em>Bring your gifts.</em></h2><p>Get to know the people, the gatherings, and the opportunities that make up life at Rhema.</p></div><div className="life-links">{[{n:"01",title:"The people who lead",text:"Meet our pastors, ministers, deacons, and department heads.",href:"/leadership",photo:imagery.teaching},{n:"02",title:"A place to serve",text:"Discover our departments and find your next step in church life.",href:"/departments",photo:imagery.choir},{n:"03",title:"Room to grow",text:"Make space for worship, fellowship, and the Word.",href:"/services",photo:imagery.worship}].map(item => <Link href={item.href} key={item.n}><div className="life-card-photo"><Image {...item.photo} fill sizes="(max-width: 760px) 100vw, 33vw" /><span className="life-number">{item.n}</span></div><div><h3>{item.title}</h3><p>{item.text}</p></div><ArrowUpRight aria-hidden="true" /></Link>)}</div></section>
    {content?.managed.messages ? message && <section className="wrap cms-home-highlights"><h2>A word for your week.</h2><ContentCards items={[message]} empty="" /></section> : <>
    <section data-reveal className="word-section"><div className="wrap word-grid"><div className="word-art" aria-hidden="true"><Image src={imagery.singer.src} style={imagery.singer.style} alt="" fill sizes="(max-width: 760px) 100vw, 45vw" /><span>THE</span><strong>WORD.</strong><em>For everyday life.</em><div className="word-rule" /></div><div><span className="eyebrow">LISTEN. REFLECT. GROW.</span><h2>Carry the Word<br />into your <em>week.</em></h2><p>A space for messages and teachings from Rhema Chapel Stadium Church. Our message library is being prepared, with recordings to follow.</p><a className="button button-paper" href={churchLinks.youtube} target="_blank" rel="noreferrer">Watch on YouTube <ArrowUpRight size={18} /></a><br /><TextLink href="/messages">Visit the message library</TextLink></div></div></section>
    </>}
    <section className="wrap home-children-teaser" data-reveal><div><span className="eyebrow">CHILDREN’S CHURCH</span><h2>Little hearts.<br /><em>Big faith.</em></h2><p>A place in our church family for its youngest members.</p></div><Link className="button button-ink" href="/children">Explore Children’s Church <ArrowUpRight size={18} /></Link></section>
    {news && <section className="wrap cms-home-highlights"><h2>From the church.</h2><ContentCards items={[news]} empty="" /></section>}
    {home?.photo_stories.length ? <CmsSections sections={home.photo_stories} /> : <PhotoStories instagram={churchLinks.instagram} />}
    <section data-reveal className="wrap home-visit"><div><SectionLabel number="04">SEE YOU AT RHEMA</SectionLabel><h2>New here?<br /><em>You’re welcome.</em></h2><p>You don’t have to figure everything out before you arrive. Start with our visitor guide, find the church, and take your first step.</p><Link className="button button-ink" href="/visit">Plan your visit <ArrowUpRight size={18} /></Link></div><div className="address-card"><MapPin size={32} strokeWidth={1.4} /><span className="eyebrow">RIGHT HERE IN ILORIN</span><h3>Stadium<br />Second Gate.</h3><p className="cms-lines">{content?.settings.church_name ?? "Rhema Chapel Stadium Church"}<br />{content?.settings.address ?? "Ilorin, Kwara State, Nigeria"}</p><TextLink href="/visit#directions">Find your way to us</TextLink><span className="address-watermark" aria-hidden="true">RHEMA</span></div></section>
  </>;
}
