# Django/Wagtail backend

Python 3.12+ is required for the selected Django/Wagtail release line. Local development uses SQLite unless `POSTGRES_DB` is configured.

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
py -m pip install -r requirements.txt
py manage.py migrate
py manage.py setup_church
py manage.py createsuperuser
py manage.py runserver
```

Wagtail editor: `/cms/`  
Canonical public content API for Next.js: `/api/church/`

Additional read-only page API: `/api/v2/pages/`

`setup_church` creates the page tree, drafts for the twelve supplied departments, editor/publisher groups and a review workflow. It preserves existing content. Publish each section after reviewing its records to connect that section to the public site. See [the CMS editor guide](../docs/cms-editor-guide.md).

Environment variables are read from the process environment; `.env.example` documents them and is not loaded automatically. `PUBLIC_SITE_URL` is the Next.js origin, `WAGTAILADMIN_BASE_URL` is this backend's origin, and `PUBLIC_MEDIA_BASE_URL` optionally sets a separate public media origin. Defaults support local development.

The publication checks can be run with `.venv\Scripts\python.exe manage.py test content`. No registration write endpoints or check-in system are included.
