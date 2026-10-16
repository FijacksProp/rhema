import "server-only";
import { cache } from "react";
import type { Metadata } from "next";
import type { CmsBase, CmsContent, CmsPerson } from "./cms-types";
import { departments as localDepartments, type Department, type DepartmentLeader } from "./departments";
import { churchLinks } from "./church-links";

// This module is used by server components only. No editor credentials are sent
// to the browser. The backend exposes only published, publicly visible records.
export const getChurchContent = cache(async (): Promise<CmsContent | null> => {
  const base = process.env.DJANGO_API_BASE_URL;
  if (!base) return null;
  const response = await fetch(`${base.replace(/\/$/, "")}/api/church/?version=1`, {
    // Editors should see their latest publication on every local page request.
    // Keep the short production cache for the deployed public site.
    ...(process.env.NODE_ENV === "development"
      ? { cache: "no-store" as const }
      : { next: { revalidate: 60 } }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Church content is unavailable (${response.status}).`);
  const data: CmsContent = await response.json();
  if (data.version !== 1 || !data.managed || !data.indexes || !data.settings || ![data.pages, data.events, data.services, data.people, data.departments, data.messages, data.news].every(Array.isArray)) throw new Error("Unsupported church content response.");
  return data;
});

export function cmsMetadata(page: CmsBase | undefined, fallback: Metadata): Metadata {
  return page ? { title: page.seo_title, description: page.search_description || fallback.description } : fallback;
}

export function contentLinks(content: CmsContent | null) {
  if (!content) return churchLinks;
  const settings = content.settings;
  return { maps: settings.maps_url, youtube: settings.youtube_url, youtubeLive: settings.youtube_live_url, facebook: settings.facebook_url, facebookLive: settings.facebook_live_url, instagram: settings.instagram_url };
}

export type ChurchLinks = { [K in keyof typeof churchLinks]: string };

function leader(person: CmsPerson | null): DepartmentLeader | null {
  return person ? { name: person.name, biographyHtml: person.biography, portrait: person.portrait ? { src: person.portrait.src, alt: person.portrait.alt } : undefined, href: person.path } : null;
}

export async function getDepartments(): Promise<Department[]> {
  const content = await getChurchContent();
  if (!content?.managed.departments) return localDepartments;
  return content.departments.map(item => ({
    slug: item.slug, name: item.title, summary: item.summary,
    description: [], descriptionHtml: item.body, activities: item.activities,
    photos: item.photos.map(photo => ({ src: photo.src, alt: photo.alt, caption: photo.caption })),
    hod: leader(item.head), assistantHods: item.assistants.map(person => leader(person)!),
    meetingDetails: item.meeting_details || null, joiningInformation: item.joining_information || null,
    ...(item.slug === "children-department" ? { dedicatedPage: "/children" } : {}),
  }));
}

export function formatChurchDate(value: string | null | undefined) {
  return value ? new Intl.DateTimeFormat("en-NG", { dateStyle: "long", timeZone: "Africa/Lagos" }).format(new Date(`${value}T12:00:00+01:00`)) : "Date to be announced";
}

export function formatChurchTime(value: string | null | undefined) {
  if (!value) return "Time to be announced";
  return new Intl.DateTimeFormat("en-NG", { hour: "numeric", minute: "2-digit", timeZone: "Africa/Lagos" }).format(new Date(`2000-01-01T${value}+01:00`));
}
