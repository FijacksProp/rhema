# Rhema Chapel Stadium Church — Site Blueprint

## Product

A welcoming, content-rich public website and community hub for Rhema Chapel Stadium Church, Ilorin. The site serves visitors, members, ministry teams, and event attendees. African Praise is the first featured event, not the entire product.

## Information architecture

- **Home** — welcome, next service, featured events, latest message, ministries, news, and visitor call to action.
- **About** — church story, vision, mission, beliefs, and what to expect. Publish only church-approved copy.
- **Leadership** — pastors, ministers, deacons, and department heads, with approved profiles and contact paths.
- **Departments & Ministries** — directory and individual pages with purpose, activities, meeting details, and join/contact actions.
- **Events & Services** — event calendar, event detail pages, recurring services, conventions, and announcements.
- **Messages & Media** — sermon archive with optional audio, video, transcript, speaker, date, and series.
- **News & Stories** — announcements, church updates, testimonies, newsletters, and photo stories.
- **Get Involved** — serving, joining a department, and prayer/contact routes.
- **Give** — optional page, to be enabled only when the church confirms giving methods and wording.
- **Visit & Contact** — location, visitor information, verified map link, and approved contact details.

## First release sequence

1. Establish the shared brand system, responsive shell, homepage, event index, and African Praise detail page.
2. Add the remaining public templates: About, Leadership, Ministries, Services, Media, News, Get Involved, and Visit.
3. Build Wagtail page types and editor roles so approved church staff can manage content.
4. Connect the Next.js server-rendered pages to the Django/Wagtail API.
5. Prepare content, editorial accounts, hosting and production configuration for the church site. Event registration and staff check-in are deferred unless the church requests them; the existing African Praise coverage is sufficient for this milestone.

## Public UI implementation — September 2026

The website now has dedicated routes for:

| Page | Route |
| --- | --- |
| Home | `/` |
| Our church | `/about` |
| Leadership | `/leadership` |
| Departments | `/departments` |
| Department details | `/departments/[slug]` |
| Children’s Church | `/children` |
| Events | `/events` |
| African Praise | `/events/african-praise` |
| Services | `/services` |
| Messages | `/messages` |
| News & stories | `/news` |
| African Praise announcement | `/news/african-praise-save-the-date` |
| Get involved | `/get-involved` |
| Visit | `/visit` |
| Contact | `/contact` |

The supplied logo is integrated. The redesign uses a shared responsive navigation, editorial page layouts, an original event poster treatment, native FAQ disclosures, map search links, and a custom not-found page. The site now uses owner-supplied FIRST SUNDAY photographs in its hero, cards, gallery, and page headers.

Missing church details remain explicitly pending. Individual leader and department pages should be populated from confirmed records rather than fabricated profiles. The later CMS milestone below adds content management; registration and check-in remain deferred.

## Content entities

- **Service:** title, recurring schedule, location, summary, visibility state.
- **Event:** title, date/time, location, summary, highlights, image, registration state, FAQs.
- **Person:** display name, ministry role, approved biography, portrait, ordering, publication consent.
- **Department:** name, purpose, activities, leader, contact route, image, meeting details.
- **Message:** title, speaker, date, series, topic, audio/video URL, transcript.
- **News story:** title, type, publication date, summary, body, image.
- **Registration:** event, attendee fields selected by the committee, registration status, unique reference.
- **Check-in:** registration, arrival status/time, band issued status, staff operator.

## CMS implementation — October 2026

Wagtail now manages church settings, the homepage, five information pages, departments and their teams/photos, services, leadership, events, messages and news. A published-content API connects those records to Next.js with independently adopted sections and approximately one-minute revalidation. Existing frontend content remains available while initial section drafts are prepared. After adoption, unpublishing a section or record does not restore its old local list.

The setup command creates the twelve confirmed department names as drafts and preserves existing edits on reruns. Church Editors and Church Publishers groups and a page-review workflow are included. Staff login, draft previews, image management and revisions use Wagtail. Profile publication approval is enforced in public APIs and department team relations.

See [CMS editor guide](cms-editor-guide.md) for setup, section adoption, account roles, publishing, preview limitations and deployment configuration.

## Editorial and privacy rules

- Treat church-approved content as the source of truth. Do not infer service times, leadership, ministry names, contact details, doctrine, or event details.
- Keep unpublished drafts out of public pages. Empty sections should be hidden or use a polished “details coming soon” state.
- Collect only attendee information required for the event. Restrict access to registration and check-in data to assigned staff.
- Obtain permission before publishing identifiable people’s profiles or photos.

## Technical shape

`Next.js (server-rendered public site) → Django/Wagtail content API → PostgreSQL`

- Wagtail owns editorial content and media records.
- Django owns custom forms, registration records, and check-in workflow.
- Next.js fetches public, published content server-side. Interactive pieces stay small and progressively enhanced.
- The Wagtail editing area is the real content dashboard; do not create a fake admin interface in the public frontend.
- Hosting and media storage provider remain open until budget and operational needs are known.

## Confirmed event information

- **African Praise:** October 25, 2026.
- **Venue:** Rhema Chapel Stadium Church, Stadium Second Gate, Ilorin.
- **Time:** 8:00 AM (Africa/Lagos / West Africa Time), confirmed by the supplied flyers.
- **Host:** Pastor Jonathan Tobin, named on the supplied host flyer.
- **Registration:** The flyer links to `https://forms.gle/aqqJcbjSpxWXpd7M7`. The public form is titled “AFRICAN PRAISE 2026.” The website links attendees to this external form.
- Additional programme highlights, expected attendance, and check-in / band arrangements remain pending committee confirmation.

## Department directory and church links

The owner confirmed 12 department names: Audio Visual, Technical, IT, Choir, Welcoming, Welfare, Intercessory, Visitation, Ushering, Security, Children Department, and Library. The directory is searchable; each department has a detail route. Children Department opens the dedicated `/children` page, and `/departments/children-department` redirects there.

Names, summaries, descriptions, activities, photos, HODs, assistant HODs, meeting details, and joining information are stored in `frontend/lib/departments.ts` until CMS integration. Descriptions and activity copy are editorial drafts based on the department names and require church review. HOD and assistant names remain pending. Choir photographs come from the supplied FIRST SUNDAY collection; other department photos and children’s photos await supply. Children’s age groups, schedule, room, and arrival / collection arrangements remain pending.

Official map and social destinations are centralised in `frontend/lib/church-links.ts`. Map links use the owner’s exact Google Maps destination with the trailing comma removed. YouTube, Facebook, and Instagram appear in contact information, the footer, and mobile navigation. The message page links to the supplied YouTube channel.
