"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SocialLinks } from "./social-links";

const links = [["Our church", "/about"], ["Leadership", "/leadership"], ["Departments", "/departments"], ["What's on", "/events"], ["Messages", "/messages"]];
const mobileLinks = [...links, ["Children’s Church", "/children"], ["Services", "/services"], ["News & stories", "/news"], ["Get involved", "/get-involved"], ["Contact", "/contact"]];

export function SiteHeader() {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  function closeMenu(restoreFocus = false) {
    if (menu.current) menu.current.open = false;
    setOpen(false);
    if (restoreFocus) summary.current?.focus();
  }

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function sizeMenu() {
      const bottom = menu.current?.closest("header")?.getBoundingClientRect().bottom;
      if (bottom !== undefined) menu.current?.style.setProperty("--mobile-menu-top", `${bottom}px`);
    }
    sizeMenu();
    window.addEventListener("resize", sizeMenu);
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); closeMenu(true); }
      if (event.key === "Tab" && menu.current) {
        const items = Array.from(menu.current.querySelectorAll<HTMLElement>("summary, a[href], button"));
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }
    const desktop = window.matchMedia("(min-width: 961px)");
    const onResize = () => { if (desktop.matches) closeMenu(); };
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("resize", sizeMenu);
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="announcement"><div className="wrap announcement-inner"><span>African Praise is coming <span className="announcement-dot">•</span> 25 October 2026</span><Link href="/events/african-praise">Save the date <ArrowUpRight size={14} /></Link></div></div>
    <header className="site-header">
      <div className="wrap header-inner">
        <Link className="brand" href="/" onClick={() => closeMenu()} aria-label="Rhema Chapel Stadium Church home"><Image src="/images/rhema-logo.png" width={609} height={410} alt="Rhema Chapel" priority /><span>STADIUM CHURCH<small>ILORIN, NIGERIA</small></span></Link>
        <nav className="desktop-nav" aria-label="Main navigation">{links.map(([label, href]) => <Link key={href} href={href} aria-current={pathname.startsWith(href) ? "page" : undefined}>{label}</Link>)}</nav>
        <Link className="button button-ink header-cta" href="/visit">Plan your visit <ArrowUpRight size={16} /></Link>
        <details className="mobile-menu" ref={menu} onToggle={event => setOpen(event.currentTarget.open)}>
          <summary ref={summary} className="menu-toggle" aria-controls="mobile-navigation"><Menu className="menu-open-icon" size={22} /><X className="menu-close-icon" size={22} /><span className="sr-only">Toggle navigation menu</span></summary>
          <div className="mobile-menu-sheet">
            <div className="mobile-menu-intro"><span className="eyebrow">WELCOME TO RHEMA</span><p>Make yourself <em>at home.</em></p></div>
            <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
              {mobileLinks.map(([label, href], index) => <Link key={href} href={href} onClick={() => closeMenu()} aria-current={pathname.startsWith(href) ? "page" : undefined}><span className="menu-link-number">{String(index + 1).padStart(2, "0")}</span><span>{label}</span><ArrowUpRight size={19} /></Link>)}
            </nav>
            <div className="mobile-menu-bottom"><Link className="button button-red" href="/visit" onClick={() => closeMenu()}>Come worship with us <ArrowUpRight size={19} /></Link><SocialLinks compact /></div>
          </div>
        </details>
      </div>
    </header>
  </>;
}
