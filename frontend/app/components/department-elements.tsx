import Image from "next/image";
import Link from "next/link";
import { UserRound } from "lucide-react";
import type { Department, DepartmentLeader } from "../../lib/departments";

function LeaderCard({ role, leader }: { role: string; leader?: DepartmentLeader | null }) {
  return <article className="department-leader">
    {leader?.portrait ? <div className="leader-portrait"><Image {...leader.portrait} unoptimized={leader.portrait.src.startsWith("http")} fill sizes="(max-width:760px) 100vw, 30vw" /></div> : <div className="leader-symbol" aria-hidden="true"><UserRound size={28} strokeWidth={1.4} /></div>}
    <span className="eyebrow">{role}</span><h3>{leader?.name ?? "Details coming soon"}</h3>
    {leader?.biographyHtml ? <div className="prose cms-rich-text" dangerouslySetInnerHTML={{ __html: leader.biographyHtml }} /> : <p>{leader?.biography ?? (leader ? "Profile details will be shared here." : "The church will share the confirmed name and introduction here.")}</p>}
    {leader?.href && <Link href={leader.href} className="text-link">View profile</Link>}
  </article>;
}

export function DepartmentTeam({ department }: { department: Department }) {
  return <div className="department-team"><LeaderCard role="Head of department" leader={department.hod} />
    {department.assistantHods.length ? department.assistantHods.map(leader => <LeaderCard key={leader.name} role="Assistant HOD" leader={leader} />) : <LeaderCard role="Assistant HODs" />}
  </div>;
}

export function DepartmentGallery({ department }: { department: Department }) {
  if (!department.photos.length) return <div className="department-photo-notice"><span className="eyebrow">IN PICTURES</span><h3>Photos are on the way.</h3><p>Photographs from {department.name} will be added here.</p></div>;
  return <div className="department-gallery">{department.photos.map(photo => <figure key={photo.src}><Image src={photo.src} alt={photo.alt} unoptimized={photo.src.startsWith("http")} width={1200} height={800} sizes="(max-width:760px) 100vw, 50vw" />{photo.caption && <figcaption>{photo.caption}</figcaption>}</figure>)}</div>;
}
