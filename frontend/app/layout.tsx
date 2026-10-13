import type { Metadata } from "next";
import "./globals.css";
import "./experience.css";
import "./ministries.css";
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
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><ScrollMotion /><SiteHeader /><main id="main-content">{children}</main><SiteFooter /></body>
    </html>
  );
}
