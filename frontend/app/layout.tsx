import type { Metadata } from "next";
import "./globals.css";
import "./experience.css";
import "./ministries.css";
import "./cms.css";
import { getChurchContent, contentLinks } from "../lib/cms";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { ScrollMotion } from "./components/scroll-motion";

export const metadata: Metadata = {
  title: {
    default: "Rhema Chapel Stadium Church | Ilorin",
    template: "%s | Rhema Chapel Stadium Church",
  },
  description:
    "Welcome to Rhema Chapel Stadium Church, Ilorin. Find upcoming events, church information, and ways to connect.",
  robots: {
    index: process.env.PUBLIC_SITE_INDEXABLE === "true",
    follow: process.env.PUBLIC_SITE_INDEXABLE === "true",
  },
};

export const revalidate = 60;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const content = await getChurchContent();
  const links = contentLinks(content);
  return (
    <html lang="en">
      <body><ScrollMotion /><SiteHeader links={links} announcement={content ? { text: content.settings.announcement, url: content.settings.announcement_url } : undefined} /><main id="main-content">{children}</main><SiteFooter links={links} settings={content?.settings} /></body>
    </html>
  );
}
