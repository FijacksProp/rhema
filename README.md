# Rhema Chapel Stadium Church Website

A public website and editorial CMS for Rhema Chapel Stadium Church, Ilorin.

## Stack direction

- `frontend/`: Next.js App Router, TypeScript, Tailwind CSS.
- `backend/`: Django + Wagtail content management, with PostgreSQL in deployed environments.
- Public church content is managed in Wagtail and consumed by the Next.js frontend. Event registration and check-in are deferred unless requested by the church.

See [the site blueprint](docs/site-blueprint.md) for the page map, content model, and delivery sequence.

## Current milestone

The multipage frontend includes the church, departments, leadership, services, messages, news, visitor and contact pages. The connected CMS supports those areas, published-content APIs, staff roles and editorial review. Existing UI content remains available while the first CMS section drafts are prepared.

See the [CMS editor guide](docs/cms-editor-guide.md) for setup, editing and publication. Django must be running when the frontend's `DJANGO_API_BASE_URL` is configured. The CMS does not collect event registration or attendance data.
