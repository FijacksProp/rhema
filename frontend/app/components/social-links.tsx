import { Facebook, Instagram, Youtube, ArrowUpRight } from "lucide-react";
import { churchLinks } from "../../lib/church-links";

const channels = [
  { name: "YouTube", href: churchLinks.youtube, Icon: Youtube },
  { name: "Facebook", href: churchLinks.facebook, Icon: Facebook },
  { name: "Instagram", href: churchLinks.instagram, Icon: Instagram },
];

export function SocialLinks({ compact = false }: { compact?: boolean }) {
  return <div className={`social-links${compact ? " social-links-compact" : ""}`}>
    {channels.map(({ name, href, Icon }) => <a key={name} href={href} target="_blank" rel="noreferrer" aria-label={`Visit Rhema Chapel on ${name} (opens in a new tab)`}><Icon size={19} aria-hidden="true" /><span>{name}</span>{!compact && <ArrowUpRight size={16} aria-hidden="true" />}</a>)}
  </div>;
}
