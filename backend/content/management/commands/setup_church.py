import json
from pathlib import Path
from django.conf import settings
from django.contrib.auth.models import Group, Permission
from django.core.files import File
from django.core.management.base import BaseCommand
from django.db import transaction
from wagtail.images import get_image_model
from wagtail.models import Page, Site, GroupPagePermission, GroupCollectionPermission, Collection, Workflow, WorkflowTask, WorkflowPage, GroupApprovalTask
from content.models import HomePage, InformationPage, EventIndexPage, ServiceIndexPage, PeopleIndexPage, MinistryIndexPage, MessageIndexPage, NewsIndexPage, MinistryPage, ChurchSettings


class Command(BaseCommand):
    help = "Create the church page tree, draft department records, and editorial roles without overwriting existing content."

    def photo(self, source):
        path = settings.BASE_DIR.parent / "frontend" / "public" / source.lstrip("/")
        if not path.is_file():
            return None
        title = f"Website · {path.stem}"
        image = get_image_model().objects.filter(title=title).first()
        if not image:
            with path.open("rb") as stream:
                image = get_image_model()(title=title, file=File(stream, name=path.name))
                image.save()
        return image

    def draft(self, parent, model, slug, title, **fields):
        existing = parent.get_children().filter(slug=slug).first()
        if existing:
            return existing.specific
        page = parent.add_child(instance=model(title=title, slug=slug, live=False, **fields))
        page.save_revision()
        return page

    @transaction.atomic
    def handle(self, *args, **options):
        home = HomePage.objects.first()
        if not home:
            home = Page.get_first_root_node().add_child(instance=HomePage(title="Rhema Chapel Stadium Church", slug="rhema", intro="A place to know God.\nA people to do life with.\nA welcome with your name on it."))
            home.save_revision().publish()
        site = Site.objects.filter(is_default_site=True).first()
        if site and site.root_page.specific_class is not HomePage:
            site.root_page = home
            site.site_name = "Rhema Chapel Stadium Church"
            site.save()
        elif not site:
            Site.objects.create(hostname="localhost", port=8000, root_page=home, is_default_site=True, site_name=home.title)

        indexes = {}
        for key, model, title in [("events", EventIndexPage, "Events & programmes"), ("services", ServiceIndexPage, "Services"), ("leadership", PeopleIndexPage, "Leadership"), ("departments", MinistryIndexPage, "Departments"), ("messages", MessageIndexPage, "Messages"), ("news", NewsIndexPage, "News & stories")]:
            indexes[key] = self.draft(home, model, key, title)

        for slug, title, heading, accent in [("about", "Our church", "A church.", "A family."), ("children", "Children’s Church", "Little hearts.", "Big faith."), ("get-involved", "Get involved", "Find your people.", "Bring your gifts."), ("visit", "Plan your visit", "Your first Sunday.", "A new beginning."), ("contact", "Contact", "Let’s start", "a conversation.")]:
            self.draft(home, InformationPage, slug, title, heading=heading, accent=accent)

        entries = json.loads((Path(__file__).resolve().parents[2] / "seed_departments.json").read_text(encoding="utf-8"))
        for entry in entries:
            parent = indexes["departments"]
            if parent.get_children().filter(slug=entry["slug"]).exists():
                continue
            photos = []
            for source in entry["photos"]:
                image = self.photo(source["src"])
                if image:
                    photos.append(("photo", {"image": image, "alt": source["alt"], "caption": ""}))
            from django.utils.html import format_html_join
            body = format_html_join("", "<p>{}</p>", ((paragraph,) for paragraph in entry["description"]))
            self.draft(parent, MinistryPage, entry["slug"], entry["name"], summary=entry["summary"], body=str(body), activities=[("activity", item) for item in entry["activities"]], photos=photos)

        values = {"maps_url": "https://maps.app.goo.gl/32ZvnHCdD3g8yZWr5", "youtube_url": "https://youtube.com/@rhemachapelgracechurch", "youtube_live_url": "https://www.youtube.com/@rhemachapelgracechurch/live", "facebook_url": "https://web.facebook.com/people/Rhema-Chapel-Grace-Church/100089782507012/", "facebook_live_url": "https://www.facebook.com/100089782507012/live/", "instagram_url": "https://www.instagram.com/rhemagracechurch/", "announcement": "African Praise is coming · 25 October 2026", "announcement_url": "/events/african-praise"}
        if not ChurchSettings.objects.exists():
            ChurchSettings.objects.create(**values)

        for name, can_publish in [("Church Editors", False), ("Church Publishers", True)]:
            group, _ = Group.objects.get_or_create(name=name)
            permissions = Permission.objects.filter(codename="access_admin", content_type__app_label="wagtailadmin") | Permission.objects.filter(content_type__app_label__in=["wagtailimages", "wagtaildocs"], codename__in=["add_image", "change_image", "add_document", "change_document"])
            group.permissions.add(*permissions)
            for permission in permissions.filter(content_type__app_label__in=["wagtailimages", "wagtaildocs"]):
                GroupCollectionPermission.objects.get_or_create(group=group, collection=Collection.get_first_root_node(), permission=permission)
            codes = ["add_page", "change_page"] + (["publish_page", "lock_page", "unlock_page"] if can_publish else [])
            for permission in Permission.objects.filter(content_type__app_label="wagtailcore", content_type__model="page", codename__in=codes):
                GroupPagePermission.objects.get_or_create(group=group, page=home, permission=permission)
        publishers = Group.objects.get(name="Church Publishers")
        if not WorkflowPage.objects.filter(page=home).exists():
            workflow, _ = Workflow.objects.get_or_create(name="Church content review")
            task, _ = GroupApprovalTask.objects.get_or_create(name="Church publisher review")
            task.groups.add(publishers)
            WorkflowTask.objects.get_or_create(workflow=workflow, task=task, defaults={"sort_order": 0})
            WorkflowPage.objects.create(page=home, workflow=workflow)
        self.stdout.write(self.style.SUCCESS("Church CMS ready. All sections and department records are drafts. Review and publish a section to switch that area to CMS content. Existing records were preserved."))
