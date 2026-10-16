export type CmsPhoto = { src: string; alt: string; width: number; height: number; caption?: string };
export type CmsBlock =
  | { id: string; type: "section"; value: { heading: string; body: string } }
  | { id: string; type: "photo"; value: { photo: CmsPhoto; caption: string } }
  | { id: string; type: "cards"; value: { title: string; description: string }[] }
  | { id: string; type: "questions"; value: { question: string; answer: string }[] };
export type CmsBase = { id: number; slug: string; title: string; path: string; seo_title: string; search_description: string };
export type CmsInfo = CmsBase & { heading: string; accent: string; intro: string; cover: CmsPhoto | null; sections: CmsBlock[] };
export type CmsEvent = CmsBase & { event_date: string | null; start_time: string | null; end_time: string | null; location: string; summary: string; body: string; cover: CmsPhoto | null; registration_state: string; registration_url: string; sections: CmsBlock[] };
export type CmsPerson = CmsBase & { name: string; role: string; category: string; biography: string; portrait: CmsPhoto | null };
export type CmsDepartment = CmsBase & { summary: string; body: string; meeting_details: string; joining_information: string; head: CmsPerson | null; assistants: CmsPerson[]; activities: { title: string; description: string }[]; photos: CmsPhoto[] };
export type CmsMessage = CmsBase & { speaker: string; message_date: string | null; series: string; topic: string; summary: string; media_url: string; audio_url: string; transcript: string; cover: CmsPhoto | null };
export type CmsNews = CmsBase & { publish_date: string | null; category: string; summary: string; body: string; cover: CmsPhoto | null; sections: CmsBlock[] };
export type CmsService = CmsBase & { schedule: string; location: string; summary: string };
export type CmsHome = CmsBase & { heading: string; accent: string; intro: string; hero: CmsPhoto | null; featured_event: number | null; featured_message: number | null; featured_news: number | null; photo_stories: CmsBlock[] };
export type CmsSettings = { church_name: string; address: string; phone: string; email: string; office_hours: string; maps_url: string; youtube_url: string; youtube_live_url: string; facebook_url: string; facebook_live_url: string; instagram_url: string; announcement: string; announcement_url: string };
export type Collection = "events" | "people" | "departments" | "messages" | "services" | "news";
export type CmsContent = { version: 1; settings: CmsSettings; home: CmsHome | null; pages: CmsInfo[]; events: CmsEvent[]; people: CmsPerson[]; departments: CmsDepartment[]; messages: CmsMessage[]; services: CmsService[]; news: CmsNews[]; managed: Record<Collection, boolean>; indexes: Partial<Record<Collection, CmsBase & { intro: string }>> };
