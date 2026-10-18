# Church CMS guide

The public site uses Next.js. Church staff manage its editorial content in Wagtail at `http://127.0.0.1:8000/cms/` during local development.

## What is editable

| Area | Content |
| --- | --- |
| Church details & links (Settings) | Church name, address, approved phone/email/office hours, map, social channels, streaming destinations, announcement text/link |
| Home | Animated welcome wording, introductory text, hero image, featured event/message/news selections, photo stories with captions |
| About, Children’s Church, Get involved, Visit, Contact | Heading, accent, introduction, cover image, ordered sections, photo/caption blocks, cards and FAQs |
| Leadership | Public name, role, category, biography, portrait and publication approval |
| Departments | Purpose, introduction, activities, ordered photos, HOD, ordered assistant HODs, meeting and joining details |
| Events | Date, times in WAT, venue, summary, body, flyer, extra sections and an external registration link/state |
| Services | Name, recurring schedule, location and summary |
| Messages | Title, speaker, date, series, topic, summary, image, viewing/listening links and transcript |
| News & stories | Date, category, summary, body, image and additional sections |

The existing templates, navigation structure and visual design are maintained in Next.js. Wagtail's Promote tab provides search titles/descriptions; those are used for information pages and content detail pages. The main section pages also use their published index introductions and search metadata.

## First setup

From `backend`:

```powershell
.venv\Scripts\python.exe manage.py migrate
.venv\Scripts\python.exe manage.py setup_church
.venv\Scripts\python.exe manage.py createsuperuser
.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```

`setup_church` is repeatable. It preserves existing records and edits. It creates the page tree, five information-page drafts, twelve department drafts, editor/publisher groups and a review workflow. Supplied Choir and Intercessory photos are imported if available in `frontend/public/images`. Descriptions remain drafts requiring church review. It adds the supplied official channels to Church details & links.

The Home page is published with the existing welcome wording. Collection indexes and information pages begin as drafts. The existing public UI continues to appear until those areas are ready.

Create `frontend/.env.local` with:

```text
DJANGO_API_BASE_URL=http://127.0.0.1:8000
```

Then run `npm.cmd run dev` from `frontend`. With the API URL configured, Django must be available during builds and page requests. An API outage is surfaced as an error rather than silently returning potentially outdated local records. Without the API URL, the standalone frontend preview remains usable.

## Adopt a section

1. Open Pages → Rhema Chapel Stadium Church.
2. Open a section such as Departments. Its children contain the draft records.
3. Review descriptions and supply confirmed information. Add approved images with descriptive alternative text.
4. Publish the reviewed child records, then publish their section index when the section is ready for visitors.
5. The section now displays CMS records. New records get public routes automatically; a frontend code edit or rebuild is unnecessary.

Each collection switches independently. Publishing News does not switch Departments. Once a section has been published, unpublishing it produces an empty public collection; the old local preview list does not return. An individual information page replaces its current template content when published. Unpublishing that information page returns its original basic public information rather than exposing any CMS draft.

To keep a section visible but remove one record, unpublish the record and leave the index published. Homepage highlights appear only when the selected record and its containing section are publicly published. Publish the events section before selecting a CMS event for the homepage.

## Roles and review

- **Administrator:** manages users, roles, church settings and the site structure. Site settings take effect directly; limit that permission to administrators.
- **Church Editors:** create/edit content and submit drafts to the assigned review workflow. They cannot publish pages directly.
- **Church Publishers:** review and publish church content. The Church content review workflow applies to the church page tree.

Assign users to these groups in Wagtail Settings → Users. Named staff accounts should be used for editorial work. The initial local administrator is for setup; the deployed environment needs its own accounts and secret configuration.

Save Draft preserves unpublished edits. Preview displays the draft's text, images and sections inside Wagtail. This is a content preview, not an exact copy of every Next.js layout. The live website applies its own templates after publication. Revisions, approval and scheduled publication use Wagtail's native page editing tools.

For leadership profiles, check **Publication approved** only after the church has confirmed the profile and permission to publish. An unchecked profile is excluded from the leadership list, direct API access, HOD fields and assistant HOD fields even if its page was published. Drafts, private pages, and descendants of private or unpublished sections are excluded from public APIs.

## Publishing details

- Keep Home at the site root. Each collection allows one index per parent.
- Information-page slugs match the existing routes: `about`, `children`, `get-involved`, `visit`, `contact`.
- Children Department uses slug `children-department` and points to `/children`. Its HODs and gallery are displayed on the CMS-managed Children’s Church page.
- Order departments, leaders and services using the Wagtail page order. News/messages are shown newest first; events are listed by date.
- Images come from Wagtail's shared image library and use generated WebP renditions. Production media must have a persistent, publicly accessible URL.
- The canonical public content endpoint is `GET /api/church/`. It exposes public editorial content only, accepts no submissions, and returns no staff details.
- During local development, CMS requests bypass both the persistent fetch cache and the HMR cache. After publishing, refresh the public page to load the current published content. An already-open browser page does not update itself automatically.
- In a production build, Next.js revalidates content approximately every minute. Publication is reflected on a subsequent request after cache expiry; it is not an instant browser push.
- No event registration or attendance database has been added. Event buttons can point to a church-approved external form.

## Deployment configuration

Set Django's `PUBLIC_SITE_URL` to the final Next.js origin so View live and rich-text page links open the public website. Set `WAGTAILADMIN_BASE_URL` to the backend origin. `PUBLIC_MEDIA_BASE_URL` is an optional media origin; when omitted, image URLs use the request origin. `DJANGO_API_BASE_URL` is private server configuration in Next.js and must point to the backend origin accessible to the Next.js server.

Use PostgreSQL in the deployed environment, supply `DJANGO_SECRET_KEY`, disable debug, configure allowed hosts/HTTPS, and provide persistent media storage. See [the Vercel preview guide](vercel-preview.md) for the project layout and environment setup.

Reference: [Wagtail page models](https://docs.wagtail.org/en/stable/topics/pages.html), [Wagtail settings](https://docs.wagtail.org/en/stable/reference/contrib/settings.html).
