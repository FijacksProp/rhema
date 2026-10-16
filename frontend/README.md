# Next.js frontend

The first milestone is a server-rendered Next.js App Router site using TypeScript and Tailwind CSS. Content is currently local presentation data; use `lib/content.ts` as the seam for connecting the server-side Django/Wagtail API client.

```powershell
npm install
npm run dev
```

## Public pages

Home, About, Leadership, Departments, Events, African Praise, Services, Messages, News, the African Praise announcement, Get Involved, Visit, and Contact are implemented as separate routes. The shared layout provides the church logo, responsive navigation, and footer. FAQs use native keyboard-accessible disclosures.

The visual design uses warm ivory, navy, and red, with editorial typography and official African Praise flyers. The original supplied church logo is in `public/images/rhema-logo.png`.

The stock photographs have been replaced with owner-supplied FIRST SUNDAY church photography (see `public/images/README.md`). The draft welcome copy still needs approval. Leadership profiles, department names, service times, contact channels and recordings are awaiting confirmed content. These pages do not invent that information or collect form submissions.

The frontend connects to Django/Wagtail through the server-side `DJANGO_API_BASE_URL` setting and `GET /api/church/`. Collections adopt CMS content independently when their index is first published. Existing UI content appears while initial CMS sections remain drafts. Draft/private pages never become published-content records. Registration and check-in are deferred unless requested by the church.

## October visual refresh

`app/experience.css` extends the base styles with photographic headers, photo cards, a homepage mosaic, and responsive navigation. `lib/imagery.ts` centralises replaceable photo assets. The supplied Instagram profile is linked from the gallery, mobile menu, and footer; the church photographs now come from the owner’s FIRST SUNDAY folder. The three African Praise flyers are integrated from the owner’s Telegram Desktop folder.

The mobile navigation uses native `details`/`summary`, so its toggle works before hydration. Once hydrated, it supports Escape, focus cycling, scroll locking, and closing after a route or breakpoint change. `ScrollMotion` progressively adds one-time reveals and reading progress; content remains visible without JavaScript and reduced-motion preferences disable movement. No autoplay carousel or video was added.

African Praise now shows its confirmed 8:00 AM start, host Pastor Jonathan Tobin, and external Google Forms registration. The general, host, and QR flyers are used in distinct sections without cropping. Local event information is centralised in `lib/african-praise.ts`.

## Departments and Children’s Church

The department directory includes the 12 names supplied by the owner, search, and generated detail routes. Add further confirmed records to `lib/departments.ts`; each record supports purpose, activities, images, an HOD profile, multiple assistant HOD profiles, meeting details, and joining information. Description and activity text is draft copy for review. Personnel and meeting fields remain pending.

`/children` is the dedicated Children’s Church page, with its own visual treatment, parent guide, team section, and FAQs. Photographs and operational details are pending. `/departments/children-department` redirects to this page.

Official map and social destinations come from Wagtail Church details & links when connected; `lib/church-links.ts` supplies the standalone preview defaults.

## CMS integration

Copy `.env.example` to `.env.local`, run Django on `127.0.0.1:8000`, and run `npm.cmd run dev`. The API origin is server-only. Configured API failures are surfaced rather than silently restoring old content. New department, event, news, message and leadership routes work without a code change. Content revalidates approximately every minute. Uploaded images use Wagtail-generated renditions directly.

Local development bypasses CMS fetch/HMR caching so a refreshed page shows the latest publication. Production retains approximately one-minute revalidation.

See [the CMS editor guide](../docs/cms-editor-guide.md) for page types, staff roles, section adoption, previews and deployment configuration.
