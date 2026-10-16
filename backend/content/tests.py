from io import StringIO, BytesIO
from pathlib import Path
from contextlib import contextmanager
from uuid import uuid4
from shutil import rmtree
from unittest.mock import patch
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.test import TestCase, RequestFactory, override_settings
from wagtail.models import Page, Site, PageViewRestriction, GroupPagePermission, WorkflowPage
from .models import HomePage, EventIndexPage, EventPage, PeopleIndexPage, PersonPage, MinistryIndexPage, MinistryPage, InformationPage
from PIL import Image
from wagtail.images import get_image_model
from wagtail.permissions import policy_registry


@contextmanager
def isolated_media():
    root = (settings.BASE_DIR / ".tmp").resolve()
    path = root / f"cms-media-test-{uuid4().hex}"
    path.mkdir(parents=True)
    try:
        yield path
    finally:
        if not path.resolve().is_relative_to(root):
            raise RuntimeError("Unexpected test media directory.")
        rmtree(path)


@override_settings(ALLOWED_HOSTS=["testserver"])
class PublicContentTests(TestCase):
    def setUp(self):
        self.home = Page.get_first_root_node().add_child(instance=HomePage(title="Church", slug="church"))
        Site.objects.filter(is_default_site=True).update(root_page=self.home)
        self.events = self.home.add_child(instance=EventIndexPage(title="Events", slug="events"))

    def snapshot(self):
        response = self.client.get("/api/church/")
        self.assertEqual(response.status_code, 200)
        return response.json()

    def test_drafts_never_appear_and_unpublished_sections_hide_children(self):
        self.events.add_child(instance=EventPage(title="Draft", slug="draft", live=False))
        public = self.events.add_child(instance=EventPage(title="Published", slug="published"))
        self.assertEqual([entry["id"] for entry in self.snapshot()["events"]], [public.pk])
        self.events.save_revision().publish()
        self.events.refresh_from_db()
        self.events.live = False
        self.events.save()
        data = self.snapshot()
        self.assertEqual(data["events"], [])
        self.assertTrue(data["managed"]["events"])

    def test_private_ancestor_hides_descendants_in_both_apis(self):
        secret = self.events.add_child(instance=EventPage(title="Private gathering", slug="private"))
        PageViewRestriction.objects.create(page=self.events, restriction_type="password", password="private")
        self.assertEqual(self.snapshot()["events"], [])
        response = self.client.get("/api/v2/pages/", {"type": "content.EventPage"})
        self.assertEqual(response.status_code, 200)
        self.assertNotIn(secret.pk, [item["id"] for item in response.json()["items"]])

    def test_unapproved_and_draft_leaders_are_excluded_from_department_relations(self):
        people = self.home.add_child(instance=PeopleIndexPage(title="People", slug="leadership"))
        person = people.add_child(instance=PersonPage(title="A leader", slug="leader", publication_approved=False))
        ministries = self.home.add_child(instance=MinistryIndexPage(title="Departments", slug="departments"))
        department = ministries.add_child(instance=MinistryPage(title="Choir", slug="choir", head=person))
        department.assistants.create(person=person)
        data = self.snapshot()
        self.assertEqual(data["people"], [])
        self.assertIsNone(data["departments"][0]["head"])
        self.assertEqual(data["departments"][0]["assistants"], [])
        response = self.client.get(f"/api/v2/pages/{person.pk}/")
        self.assertEqual(response.status_code, 404)
        person.publication_approved = True
        person.save()
        self.assertEqual(self.snapshot()["departments"][0]["head"]["id"], person.pk)
        person.live = False
        person.save()
        self.assertIsNone(self.snapshot()["departments"][0]["head"])

    def test_featured_draft_is_not_exposed(self):
        draft = self.events.add_child(instance=EventPage(title="Not ready", slug="not-ready", live=False))
        self.home.featured_event = draft
        self.home.save()
        self.assertIsNone(self.snapshot()["home"]["featured_event"])

    def test_unpublished_site_root_is_unavailable(self):
        self.home.live = False
        self.home.save()
        self.assertEqual(self.client.get("/api/church/").status_code, 503)

    def test_uploaded_gallery_renditions_and_rich_text_links(self):
        temporary_root = settings.BASE_DIR / ".tmp"
        temporary_root.mkdir(exist_ok=True)
        with isolated_media() as media_root, override_settings(MEDIA_ROOT=media_root):
            self.assertTrue(Path(media_root).resolve().is_relative_to(temporary_root.resolve()))
            data = BytesIO()
            Image.new("RGB", (32, 24), "blue").save(data, "JPEG")
            image = get_image_model().objects.create(title="Choir", file=SimpleUploadedFile("choir-test.jpg", data.getvalue(), content_type="image/jpeg"))
            ministries = self.home.add_child(instance=MinistryIndexPage(title="Departments", slug="departments"))
            ministries.add_child(instance=MinistryPage(title="Choir", slug="choir", body=f'<p><a linktype="page" id="{self.events.pk}">Gatherings</a></p>', photos=[("photo", {"image": image, "alt": "Choir in worship", "caption": "Sunday worship"})]))
            department = self.snapshot()["departments"][0]
            self.assertIn("http://127.0.0.1:3000/events", department["body"])
            self.assertEqual(department["photos"][0]["caption"], "Sunday worship")
            self.assertEqual(department["photos"][0]["alt"], "Choir in worship")
            self.assertTrue(department["photos"][0]["src"].endswith(".webp"))
            self.assertEqual(department["photos"][0]["width"], 32)
            image.file.close()

    def test_draft_revision_does_not_replace_published_content(self):
        page = self.events.add_child(instance=EventPage(title="Original", slug="original", summary="Public copy"))
        page.save_revision().publish()
        page.summary = "Draft changes"
        page.save_revision()
        self.assertEqual(self.snapshot()["events"][0]["summary"], "Public copy")
        page.get_latest_revision().publish()
        self.assertEqual(self.snapshot()["events"][0]["summary"], "Draft changes")

    def test_api_is_read_only_and_scoped_to_configured_root(self):
        self.assertEqual(self.client.post("/api/church/", {}).status_code, 405)
        Page.get_first_root_node().add_child(instance=EventPage(title="Different site", slug="elsewhere"))
        self.assertEqual(self.snapshot()["events"], [])

    def test_headless_urls_and_editor_preview(self):
        page = self.home.add_child(instance=InformationPage(title="About", slug="about", heading="Our church", intro="Preview copy", live=False, sections=[("section", {"heading": "Our story", "body": "<p>Draft story.</p>"})]))
        self.assertEqual(page.full_url, "http://127.0.0.1:3000/about")
        self.assertEqual(page.url, "http://127.0.0.1:3000/about")
        request = RequestFactory().get("/cms/preview/")
        response = page.serve_preview(request, "")
        response.render()
        self.assertContains(response, "Draft story.")
        self.assertEqual(self.snapshot()["pages"], [])
        self.assertEqual(self.client.get(f"/cms/pages/{page.pk}/preview/").status_code, 302)


class SetupChurchTests(TestCase):
    def test_setup_is_repeatable_preserves_edits_and_creates_reviewer_roles(self):
        with patch("content.management.commands.setup_church.Command.photo", return_value=None):
            call_command("setup_church", stdout=StringIO())
            choir = MinistryPage.objects.get(slug="choir")
            choir.summary = "Church-approved edit"
            choir.save()
            call_command("setup_church", stdout=StringIO())
        self.assertEqual(MinistryPage.objects.count(), 12)
        self.assertFalse(MinistryPage.objects.filter(live=True).exists())
        self.assertEqual(MinistryPage.objects.get(slug="choir").summary, "Church-approved edit")
        editor = Group.objects.get(name="Church Editors")
        publisher = Group.objects.get(name="Church Publishers")
        self.assertFalse(GroupPagePermission.objects.filter(group=editor, permission__codename="publish_page").exists())
        self.assertTrue(GroupPagePermission.objects.filter(group=publisher, permission__codename="publish_page").exists())
        self.assertTrue(editor.permissions.filter(codename="access_admin").exists())
        self.assertEqual(WorkflowPage.objects.filter(page__in=HomePage.objects.all()).count(), 1)
        editor_user = get_user_model().objects.create_user(username="editor")
        editor_user.groups.add(editor)
        publisher_user = get_user_model().objects.create_user(username="publisher")
        publisher_user.groups.add(publisher)
        home = HomePage.objects.first()
        self.assertFalse(home.permissions_for_user(editor_user).can_publish())
        self.assertTrue(home.permissions_for_user(publisher_user).can_publish())
        self.assertTrue(policy_registry.get_by_type(get_image_model()).user_has_permission(editor_user, "add"))
        self.assertFalse(editor_user.has_perm("content.change_churchsettings"))
