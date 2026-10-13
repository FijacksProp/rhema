export type ChurchEvent = {
  slug: string;
  title: string;
  category: string;
  dateLabel: string;
  dateDay: string;
  dateMonth: string;
  location: string;
  summary: string;
  registrationState: "coming-soon" | "open" | "closed";
};

// Local presentation data for the first UI milestone. Replace with a server-side
// Django/Wagtail API client after the backend content models are approved.
export const featuredEvents: ChurchEvent[] = [
  {
    slug: "african-praise",
    title: "African Praise 2026",
    category: "Special programme",
    dateLabel: "Sunday, October 25, 2026",
    dateDay: "25",
    dateMonth: "OCT",
    location: "Rhema Chapel Stadium Church, Stadium Second Gate, Ilorin",
    summary: "A day of praise and celebration. Hosted by Pastor Jonathan Tobin. Starts at 8:00 AM; register through the church’s Google Form.",
    registrationState: "open",
  },
];
