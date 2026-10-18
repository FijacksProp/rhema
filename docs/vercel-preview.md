# Vercel church review deployment

This repository has two deployable apps. Create two Vercel projects from the same GitHub repository so each app keeps its own runtime and environment variables:

| Vercel project | Root Directory | Framework |
| --- | --- | --- |
| Public website | `frontend` | Next.js (automatic detection) |
| CMS and API | `backend` | Django (automatic detection) |

Vercel currently recognizes Django projects and serves collected static files through its CDN. Python 3.14 is selected in `backend/.python-version`. Separate projects avoid depending on Vercel Services while it is still in public beta. Keep build settings on their detected defaults.

## Required hosted services

- **PostgreSQL:** Use a managed PostgreSQL provider and set its connection string as `DATABASE_URL` in the CMS project's Vercel environment. The local SQLite database is ignored by Git and must not be used for a hosted CMS.
- **Persistent public media:** Configure an S3-compatible object bucket, such as Cloudflare R2, for Wagtail uploads and image renditions. Set `AWS_STORAGE_BUCKET_NAME`, `AWS_S3_ENDPOINT_URL`, `AWS_S3_REGION_NAME`, `AWS_S3_CUSTOM_DOMAIN`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` in the CMS project. Keep the bucket credentials private. The custom domain must serve approved church images over HTTPS. This bucket is public, so upload only media approved for the public website. Without this storage, Wagtail uploads would use local disk and would not be durable across serverless deployments.
- **Django signing key:** Generate a new random `DJANGO_SECRET_KEY` for the hosted CMS. Do not reuse the local key or commit the value.

## Configure the CMS project first

1. Import the repository in Vercel and set the Root Directory to `backend`.
2. Provision PostgreSQL and the public media bucket, then add the CMS environment variables in Vercel. Set `DJANGO_DEBUG=false`.
3. Choose the CMS project's stable `.vercel.app` domain and set `WAGTAILADMIN_BASE_URL` to its HTTPS URL. `VERCEL_URL` and Vercel's branch URLs are added to Django's allowed hosts and CSRF origins automatically.
4. Deploy the CMS project. From the local `backend` directory, install the Vercel CLI if needed (`npm install --global vercel`), sign in with `vercel login`, install the listed Python dependencies, and connect this directory to the CMS Vercel project with `vercel link`. Run migrations and the idempotent bootstrap command using the project's production environment:

   ```powershell
   .\.venv\Scripts\python.exe -m pip install -r requirements.txt
   vercel link
   vercel env run -e production -- .\.venv\Scripts\python.exe manage.py migrate
   vercel env run -e production -- .\.venv\Scripts\python.exe manage.py setup_church
   vercel env run -e production -- .\.venv\Scripts\python.exe manage.py createsuperuser
   ```

   The commands run locally with secrets injected for the command; they do not put database credentials in the repository or a local env file. `setup_church` also imports the supplied Choir and Intercessory photos from the repository into the persistent bucket.

5. Open `/cms/` on the CMS domain and confirm an administrator can sign in. Add named church editors and publishers; do not use the local `rhema-admin` account or its ignored password file.

## Configure the public website

1. Create the second Vercel project from the same repository with Root Directory `frontend`.
2. Set `DJANGO_API_BASE_URL` to the CMS project's stable HTTPS origin, for example `https://rhema-chapel-cms.vercel.app`. This is a server-side variable; it is not exposed to visitors' browsers.
3. Set `PUBLIC_SITE_INDEXABLE=false` while the church is reviewing the site. This adds `noindex` and `nofollow` metadata; anyone with the link can still view the site.
4. Set the CMS project's `PUBLIC_SITE_URL` to the website's stable Vercel URL and redeploy the CMS so Wagtail's “View live” links open the public site.
5. Deploy the website and check the home page, CMS API connection, department pages, image renditions, and mobile navigation using the Vercel URL. Share that URL with the church team for review.

When the church approves the public launch, set `PUBLIC_SITE_INDEXABLE=true` in the website project and redeploy. Add the church's domain to the website project and update `PUBLIC_SITE_URL` if that domain is to be canonical.

## Existing local CMS edits

The local SQLite database and `backend/.tmp/cms-login.txt` are intentionally ignored by Git. The changes made in local Wagtail do not deploy with the source commit. The first hosted `setup_church` run creates a clean content tree and seeded department drafts; recreate or copy over any approved local edits—such as the Children's Church and Contact headings—in the hosted CMS before sharing the preview. Review the seeded department descriptions with the church before publishing them.

Keep the review URL, database, and media bucket in the church's Vercel and storage accounts. This lets church administrators retain access when project ownership changes.
