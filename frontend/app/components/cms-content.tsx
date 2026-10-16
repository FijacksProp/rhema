import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Youtube, Facebook, BookOpen, Heart, Sparkles } from "lucide-react";
import type { CmsBlock, CmsPhoto, CmsInfo, CmsContent, CmsBase } from "../../lib/cms-types";
import { contentLinks, formatChurchDate, getDepartments, type ChurchLinks } from "../../lib/cms";
import { PageIntro, FAQ, TextLink } from "./page-elements";
import { DepartmentTeam, DepartmentGallery } from "./department-elements";

export function CmsImage({ photo, className = "" }: { photo: CmsPhoto; className?: string }) {
  return <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} className={className} unoptimized sizes="(max-width:760px) 100vw, 60vw" />;
}

export function RichText({ html }: { html: string | undefined }) {
  return html ? <div className="prose cms-rich-text" dangerouslySetInnerHTML={{ __html: html }} /> : null;
}

export function CmsSections({ sections }: { sections: CmsBlock[] }) {
  return <>{sections.map(block => <section className="wrap editorial-section cms-section" key={block.id}>
    {block.type === "section" && <div className="editorial-grid"><h2>{block.value.heading}</h2><RichText html={block.value.body} /></div>}
    {block.type === "photo" && <figure className="cms-photo"><CmsImage photo={block.value.photo} />{block.value.caption && <figcaption>{block.value.caption}</figcaption>}</figure>}
    {block.type === "cards" && <div className="department-activities">{block.value.map(card => <article key={card.title}><h3>{card.title}</h3><p>{card.description}</p></article>)}</div>}
    {block.type === "questions" && <FAQ items={block.value.map(item => ({ question: item.question, answer: <RichText html={item.answer} /> }))} />}
  </section>)}</>;
}

export function StreamingLinks({ links }: { links: ChurchLinks }) {
  return <div className="streaming-actions">{links.youtubeLive && <a className="streaming-button streaming-youtube" href={links.youtubeLive} target="_blank" rel="noopener noreferrer"><Youtube size={20} aria-hidden="true" /><span>YouTube Live</span><ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span></a>}{links.facebookLive && <a className="streaming-button streaming-facebook" href={links.facebookLive} target="_blank" rel="noopener noreferrer"><Facebook size={20} aria-hidden="true" /><span>Facebook Live</span><ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span></a>}</div>;
}

export function ContactDetails({ content }: { content: CmsContent }) {
  const settings = content.settings;
  return <section className="wrap editorial-section"><div className="contact-grid"><article><h2>Find us.</h2><p className="cms-lines">{settings.church_name}<br />{settings.address}</p>{settings.maps_url && <a className="text-link" href={settings.maps_url} target="_blank" rel="noopener noreferrer">Open church location <ArrowUpRight size={18} /></a>}</article><article><h2>Let’s connect.</h2>{settings.phone && <p><a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}>{settings.phone}</a></p>}{settings.email && <p><a href={`mailto:${settings.email}`}>{settings.email}</a></p>}{settings.office_hours && <p>Office hours: {settings.office_hours}</p>}<div className="cms-channel-links">{[["YouTube", settings.youtube_url], ["Facebook", settings.facebook_url], ["Instagram", settings.instagram_url]].filter(([, url]) => url).map(([label, url]) => <a className="text-link" key={label} href={url} target="_blank" rel="noopener noreferrer">{label}<ArrowUpRight size={16} /></a>)}</div></article></div></section>;
}

export async function InformationContent({ page, content }: { page: CmsInfo; content: CmsContent }) {
  const children = page.slug === "children" ? (await getDepartments()).find(department => department.slug === "children-department") : undefined;
  const hero = page.slug === "children" ? <section className="children-hero"><div className="wrap"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/departments">Departments</Link><span>/</span><span>{page.title}</span></div><div className="children-hero-grid"><div><span className="eyebrow">FOR OUR YOUNGEST CHURCH FAMILY</span><h1>{page.heading}<br /><em>{page.accent}</em></h1><p className="cms-lines">{page.intro}</p><a className="button button-ink" href="#parents">Information for parents <ArrowUpRight size={18} /></a></div>{page.cover ? <CmsImage photo={page.cover} className="children-cover" /> : <div className="children-art" aria-hidden="true"><span className="children-orbit" /><Sparkles className="children-spark" size={35} strokeWidth={1.3} /><div className="children-book"><BookOpen size={125} strokeWidth={1} /></div><Heart className="children-heart" size={42} strokeWidth={1.4} /><span className="children-art-type">GROW.<br />WONDER.<br /><em>Belong.</em></span></div>}</div></div></section> : <PageIntro label={page.title} title={page.heading} accent={page.accent} photo={page.cover ?? undefined} className={page.slug === "about" ? "about-intro" : ""}><p className="cms-lines">{page.intro}</p>{page.slug === "about" && <div className="about-streaming"><span className="eyebrow">WORSHIP WITH US ONLINE</span><p>Join our services wherever you are.</p><StreamingLinks links={contentLinks(content)} /></div>}</PageIntro>;
  return <>{hero}<div id={page.slug === "children" ? "parents" : page.slug === "visit" ? "directions" : undefined}><CmsSections sections={page.sections} /></div>{["visit", "contact"].includes(page.slug) && <ContactDetails content={content} />}{children && <><section className="wrap editorial-section"><h2>Meet the team.</h2><DepartmentTeam department={children} /></section><section className="wrap editorial-section"><DepartmentGallery department={children} /></section></>}{page.slug === "children" && <section className="wrap editorial-section"><TextLink href="/departments">Explore our departments</TextLink><TextLink href="/visit">Plan a family visit</TextLink></section>}</>;
}

type Card = CmsBase & { summary?: string; cover?: CmsPhoto | null; event_date?: string | null; publish_date?: string | null; message_date?: string | null; category?: string; speaker?: string };
export function ContentCards({ items, empty }: { items: Card[]; empty: string }) {
  return items.length ? <div className="cms-cards">{items.map(item => <Link href={item.path} className="cms-card" key={item.id}>{item.cover && <div className="cms-card-photo"><CmsImage photo={item.cover} /></div>}<div className="cms-card-copy"><span className="eyebrow">{item.category || item.speaker || "RHEMA CHAPEL"}</span><h2>{item.title}</h2>{(item.event_date || item.publish_date || item.message_date) && <p className="cms-card-date">{formatChurchDate(item.event_date || item.publish_date || item.message_date)}</p>}<p>{item.summary}</p><span className="text-link">Explore <ArrowUpRight size={17} /></span></div></Link>)}</div> : <div className="content-note"><h3>{empty}</h3><p>Updates will be shared here as they become available.</p></div>;
}
