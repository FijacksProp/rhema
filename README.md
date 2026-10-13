# Rhema Chapel Stadium Church Website

An initial blueprint and UI foundation for the public website of Rhema Chapel Stadium Church, Ilorin.

## Stack direction

- `frontend/`: Next.js App Router, TypeScript, Tailwind CSS.
- `backend/`: Django + Wagtail content management, with PostgreSQL in deployed environments.
- Public church content will be managed in Wagtail and consumed by the Next.js frontend. Event registration and check-in will be added as Django features when the committee confirms requirements.

See [the site blueprint](docs/site-blueprint.md) for the page map, content model, and delivery sequence.

## Current milestone

The frontend contains the first visual direction for the homepage and African Praise event page. It uses local draft content; no Django API connection or registration form is active yet.
