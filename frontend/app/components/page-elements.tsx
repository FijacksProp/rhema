import Link from "next/link";
import Image from "next/image";
import { africanPraise } from "../../lib/african-praise";
import { churchLinks } from "../../lib/church-links";
import { imagery } from "../../lib/imagery";
import { ArrowUpRight, Plus } from "lucide-react";
import type { ReactNode } from "react";

export const mapUrl = churchLinks.maps;

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link className="text-link" href={href}>{children}<ArrowUpRight size={19} aria-hidden="true" /></Link>;
}

export function PageIntro({ label, title, accent, children }: { label: string; title: string; accent: string; children: ReactNode }) {
  const photos: Record<string, typeof imagery.gathering> = {
    "Our church": imagery.gathering, Leadership: imagery.teaching,
    Departments: imagery.choir, Messages: imagery.teaching,
    Services: imagery.hero, Events: imagery.celebration,
    "Get involved": imagery.community, "Plan your visit": imagery.welcome,
    Contact: imagery.reflection,
    Intercessory: { src: "/images/church/intercessory.jpg", alt: "Rhema Chapel members praying together during a church gathering", style: { objectPosition: "58% 44%" } },
  };
  const photo = photos[label] ?? imagery.gathering;
  return <section className="page-intro"><div className="intro-photo"><Image {...photo} fill sizes="(max-width: 760px) 100vw, 55vw" priority /></div><div className="wrap"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>{label}</span></div><div className="intro-grid"><div><p className="eyebrow">Rhema Chapel · Stadium Church</p><h1>{title}<br /><em>{accent}</em></h1></div><div className="intro-description">{children}</div></div></div></section>;
}

export function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <p className="section-label"><span>{number}</span>{children}</p>;
}

export function FAQ({ items }: { items: { question: string; answer: ReactNode }[] }) {
  return <div className="faq-list">{items.map(item => <details key={item.question}><summary>{item.question}<Plus size={20} aria-hidden="true" /></summary><div className="faq-answer">{item.answer}</div></details>)}</div>;
}

export function EventPoster({ compact = false, variant = "main" }: { compact?: boolean; variant?: "main" | "host" | "registration" }) {
  const flyers = {
    main: { src: africanPraise.mainFlyer, height: 720, alt: "African Praise Service 2026. Sunday, 25 October at 8:00 AM, Rhema Chapel Stadium, beside Stadium Second Gate, Stadium Road, Ilorin." },
    host: { src: africanPraise.hostFlyer, height: 721, alt: "African Praise Service host Pastor Jonathan Tobin. Sunday, 25 October 2026 at 8:00 AM, Rhema Chapel Stadium Road, Ilorin." },
    registration: { src: africanPraise.registrationFlyer, height: 721, alt: "African Praise registration flyer with a QR code and the Google Forms registration link. Use the registration button below to open the same form." },
  };
  return <div className={`official-event-flyer${compact ? " flyer-compact" : ""}`}><Image {...flyers[variant]} width={1280} sizes="(max-width: 760px) 100vw, 55vw" /></div>;
}

export function VisitBand() {
  return <section className="visit-band" data-reveal><Image {...imagery.gathering} fill sizes="100vw" className="visit-band-photo" /><div className="wrap"><span className="eyebrow">Make yourself at home</span><h2>Your next chapter<br />could start <em>here.</em></h2><Link className="button button-paper" href="/visit">Plan your first visit <ArrowUpRight size={18} /></Link></div></section>;
}
