"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Search, X, Camera, Wrench, Monitor, Music, Handshake, HeartHandshake, Heart, UsersRound, DoorOpen, ShieldCheck, Baby } from "lucide-react";
import { useState } from "react";
import { departmentHref, type Department } from "../../lib/departments";

const icons: Record<string, typeof BookOpen> = {
  "audio-visual": Camera, technical: Wrench, it: Monitor, choir: Music,
  welcoming: Handshake, welfare: HeartHandshake, intercessory: Heart,
  visitation: UsersRound, ushering: DoorOpen, security: ShieldCheck,
  "children-department": Baby, library: BookOpen,
};

export function DepartmentsDirectory({ departments }: { departments: Department[] }) {
  const [query, setQuery] = useState("");
  const matches = departments.filter(item => `${item.name} ${item.summary}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <>
    <div className="directory-search"><label htmlFor="department-search">Find a department</label><div><Search size={19} aria-hidden="true" /><input id="department-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by department name" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear department search"><X size={18} /></button>}</div></div>
    <p className="directory-result" role="status">{query && `${matches.length} ${matches.length === 1 ? "result" : "results"}`}</p>
    <div className="departments-grid">{matches.map(department => {
      const Icon = icons[department.slug] ?? BookOpen;
      return <Link className="department-directory-card" href={departmentHref(department)} key={department.slug}>
      {department.photos[0] ? <div className="department-card-image"><Image {...department.photos[0]} fill sizes="(max-width:760px) 100vw, 33vw" /></div> : <div className={`department-card-art department-art-${department.slug}`}><Icon size={48} strokeWidth={1.3} aria-hidden="true" /><span>{department.dedicatedPage === "/children" ? "Little hearts. Big faith." : department.name}</span></div>}
      <div className="department-card-copy"><h3>{department.name}</h3><p>{department.summary}</p><span className="text-link">Explore {department.name} <ArrowUpRight size={18} /></span></div>
    </Link>; })}</div>
    {!matches.length && <div className="directory-no-results"><h3>No matching departments</h3><p>Try another name or clear your search.</p><button className="button button-ink" onClick={() => setQuery("")}>Show all departments</button></div>}
  </>;
}
