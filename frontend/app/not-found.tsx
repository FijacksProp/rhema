import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function NotFound() { return <section className="wrap not-found"><span className="eyebrow">404 / PAGE NOT FOUND</span><h1>Let’s find<br /><em>your way home.</em></h1><p>This page may have moved, or the address may be incomplete.</p><Link className="button button-ink" href="/">Back to Rhema <ArrowUpRight size={18} /></Link></section>; }
