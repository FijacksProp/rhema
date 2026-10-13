import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SocialLinks } from "./social-links";
import { churchLinks } from "../../lib/church-links";

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="wrap footer-invitation"><p>There’s room for you here.</p><Link href="/visit">Let’s meet.<ArrowUpRight aria-hidden="true" /></Link></div>
    <div className="wrap footer-grid">
      <div><Link className="footer-brand" href="/"><Image src="/images/rhema-logo.png" width={609} height={410} alt="Rhema Chapel" /></Link><p>Stadium Church, Ilorin.<br />Faith. Fellowship. A place to belong.</p></div>
      <div className="footer-links"><h2>Discover</h2><Link href="/about">Our church</Link><Link href="/leadership">Our leadership</Link><Link href="/departments">Departments</Link><Link href="/children">Children’s Church</Link><Link href="/get-involved">Get involved</Link></div>
      <div className="footer-links"><h2>Church life</h2><Link href="/events">Events & programmes</Link><Link href="/services">Services</Link><Link href="/messages">Messages</Link><Link href="/news">News & stories</Link></div>
      <div className="footer-links"><h2>We’d love to see you</h2><p>Rhema Chapel Stadium Church<br />Stadium Second Gate<br />Ilorin, Kwara State, Nigeria</p><a href={churchLinks.maps} target="_blank" rel="noreferrer">Open church location <ArrowUpRight size={14} /></a><Link href="/visit">Plan your visit <ArrowUpRight size={14} /></Link><Link href="/contact">Contact information <ArrowUpRight size={14} /></Link></div>
    </div>
    <div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Rhema Chapel Stadium Church.</span><SocialLinks compact /></div>
  </footer>;
}
