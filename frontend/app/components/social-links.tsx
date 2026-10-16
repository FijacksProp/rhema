import { Facebook, Instagram, Youtube, ArrowUpRight } from "lucide-react";
import { churchLinks } from "../../lib/church-links";
import type { ChurchLinks } from "../../lib/cms";

export function SocialLinks({ compact = false, links = churchLinks }: { compact?: boolean; links?: ChurchLinks }) {
  const channels = [{ name: "YouTube", href: links.youtube, Icon: Youtube }, { name: "Facebook", href: links.facebook, Icon: Facebook }, { name: "Instagram", href: links.instagram, Icon: Instagram }].filter(channel => channel.href);
  return <div className={`social-links${compact ? " social-links-compact" : ""}`}>
    {channels.map(({ name, href, Icon }) => <a key={name} href={href} target="_blank" rel="noreferrer" aria-label={`Visit Rhema Chapel on ${name} (opens in a new tab)`}><Icon size={19} aria-hidden="true" /><span>{name}</span>{!compact && <ArrowUpRight size={16} aria-hidden="true" />}</a>)}
  </div>;
}
