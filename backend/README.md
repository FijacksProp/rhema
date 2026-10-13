# Django/Wagtail backend

Python 3.12+ is required for the selected Django/Wagtail release line. Local development uses SQLite unless `POSTGRES_DB` is configured.

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
py -m pip install -r requirements.txt
py manage.py makemigrations content
py manage.py migrate
py manage.py createsuperuser
py manage.py runserver
```

Wagtail editor: `/cms/`  
Read-only public page API: `/api/v2/pages/`

Create the initial page tree in Wagtail after setup. Add a HomePage at the site root, then EventIndexPage, ServiceIndexPage, PeopleIndexPage, MinistryIndexPage, MessageIndexPage, and NewsIndexPage under it. Do not create public registration write endpoints until the event fields and data-handling rules have been approved.
