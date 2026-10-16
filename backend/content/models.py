from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from modelcluster.fields import ParentalKey
from wagtail.admin.panels import FieldPanel, InlinePanel, MultiFieldPanel
from wagtail.api import APIField
from wagtail.contrib.settings.models import BaseGenericSetting, register_setting
from wagtail.fields import RichTextField, StreamField
from wagtail.models import Page, Orderable
from .blocks import EditorialBlocks, PhotoBlock, CardBlock


class ChurchPage(Page):
    """Shared headless URLs and Wagtail's authenticated draft preview."""
    class Meta:
        abstract = True

    def get_url_parts(self, request=None, *args, **kwargs):
        from .serializers import page_path
        parts = super().get_url_parts(request=request)
        return (parts[0], settings.PUBLIC_SITE_URL.rstrip("/"), page_path(self)) if parts else None

    def get_preview_template(self, request, mode_name):
        return "content/preview.html"

    def get_url(self, request=None, current_site=None):
        # The CMS and public site have different origins, including on localhost.
        return self.get_full_url(request=request)

    url = property(get_url)

    def get_context(self, request, *args, **kwargs):
        from .serializers import serialize_page
        context = super().get_context(request, *args, **kwargs)
        context["content_preview"] = serialize_page(self, request)
        return context


@register_setting
class ChurchSettings(BaseGenericSetting):
    church_name = models.CharField(max_length=160, default="Rhema Chapel Stadium Church")
    address = models.TextField(default="Stadium Second Gate, Stadium Road, Ilorin, Kwara State, Nigeria")
    phone = models.CharField(max_length=60, blank=True)
    email = models.EmailField(blank=True)
    office_hours = models.CharField(max_length=240, blank=True)
    maps_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    youtube_live_url = models.URLField(blank=True)
    facebook_url = models.URLField(blank=True)
    facebook_live_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    announcement = models.CharField(max_length=180, blank=True)
    announcement_url = models.CharField(max_length=240, blank=True, help_text="A website path starting with /, or a full https:// URL.")
    panels = [
        MultiFieldPanel([FieldPanel(field) for field in ["church_name", "address", "phone", "email", "office_hours", "maps_url"]], heading="Church & contact details"),
        MultiFieldPanel([FieldPanel(field) for field in ["youtube_url", "youtube_live_url", "facebook_url", "facebook_live_url", "instagram_url"]], heading="Official channels"),
        MultiFieldPanel([FieldPanel("announcement"), FieldPanel("announcement_url")], heading="Site announcement"),
    ]

    def clean(self):
        super().clean()
        if self.announcement_url and not (self.announcement_url.startswith("/") and not self.announcement_url.startswith("//") or self.announcement_url.startswith("https://")):
            raise ValidationError({"announcement_url": "Use a local path or an https:// URL."})

    class Meta:
        verbose_name = "Church details & links"


class HomePage(ChurchPage):
    intro = models.TextField(blank=True)
    heading = models.CharField(max_length=80, default="WELCOME")
    accent = models.CharField(max_length=80, default="home.")
    hero_image = models.ForeignKey("wagtailimages.Image", null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    hero_alt = models.CharField(max_length=240, blank=True)
    featured_event = models.ForeignKey("content.EventPage", null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    featured_message = models.ForeignKey("content.MessagePage", null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    featured_news = models.ForeignKey("content.NewsPage", null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    photo_stories = StreamField([("photo", PhotoBlock())], blank=True)
    content_panels = Page.content_panels + [FieldPanel(field) for field in ["heading", "accent", "intro", "hero_image", "hero_alt", "featured_event", "featured_message", "featured_news", "photo_stories"]]
    max_count = 1
    subpage_types = [
        "content.EventIndexPage",
        "content.ServiceIndexPage",
        "content.PeopleIndexPage",
        "content.MinistryIndexPage",
        "content.MessageIndexPage",
        "content.NewsIndexPage",
        "content.InformationPage",
    ]


class InformationPage(ChurchPage):
    heading = models.CharField(max_length=120)
    accent = models.CharField(max_length=120, blank=True)
    intro = models.TextField(blank=True)
    cover = models.ForeignKey("wagtailimages.Image", null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    cover_alt = models.CharField(max_length=240, blank=True)
    sections = StreamField(EditorialBlocks(), blank=True)
    content_panels = Page.content_panels + [FieldPanel(field) for field in ["heading", "accent", "intro", "cover", "cover_alt", "sections"]]
    parent_page_types = ["content.HomePage"]
    subpage_types = []

    def clean(self):
        super().clean()
        if self.slug not in {"about", "children", "get-involved", "visit", "contact"}:
            raise ValidationError({"slug": "Choose about, children, get-involved, visit, or contact to match a website page."})


class EventIndexPage(ChurchPage):
    max_count_per_parent = 1
    intro = models.TextField(blank=True)
    content_panels = Page.content_panels + [FieldPanel("intro")]
    parent_page_types = ["content.HomePage"]
    subpage_types = ["content.EventPage"]


class EventPage(ChurchPage):
    event_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    location = models.CharField(max_length=240, blank=True)
    summary = models.CharField(max_length=320, blank=True)
    body = RichTextField(blank=True)
    cover = models.ForeignKey("wagtailimages.Image", null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    cover_alt = models.CharField(max_length=240, blank=True)
    registration_url = models.URLField(blank=True, help_text="An approved external registration form; no attendee data is collected here.")
    sections = StreamField(EditorialBlocks(), blank=True)
    registration_state = models.CharField(
        max_length=20,
        choices=[("coming_soon", "Coming soon"), ("open", "Open"), ("closed", "Closed")],
        default="coming_soon",
    )
    content_panels = Page.content_panels + [
        FieldPanel("event_date"), FieldPanel("start_time"), FieldPanel("end_time"),
        FieldPanel("location"), FieldPanel("summary"), FieldPanel("body"),
        FieldPanel("registration_state"),
        FieldPanel("registration_url"), FieldPanel("cover"), FieldPanel("cover_alt"), FieldPanel("sections"),
    ]
    api_fields = [
        APIField("event_date"), APIField("start_time"), APIField("end_time"),
        APIField("location"), APIField("summary"), APIField("registration_state"),
    ]
    parent_page_types = ["content.EventIndexPage"]
    subpage_types = []


class ServiceIndexPage(ChurchPage):
    max_count_per_parent = 1
    intro = models.TextField(blank=True)
    content_panels = Page.content_panels + [FieldPanel("intro")]
    parent_page_types = ["content.HomePage"]
    subpage_types = ["content.ServicePage"]


class ServicePage(ChurchPage):
    schedule = models.CharField(max_length=160, blank=True)
    location = models.CharField(max_length=240, blank=True)
    summary = models.CharField(max_length=320, blank=True)
    content_panels = Page.content_panels + [FieldPanel("schedule"), FieldPanel("location"), FieldPanel("summary")]
    api_fields = [APIField("schedule"), APIField("location"), APIField("summary")]
    parent_page_types = ["content.ServiceIndexPage"]
    subpage_types = []


class PeopleIndexPage(ChurchPage):
    max_count_per_parent = 1
    intro = models.TextField(blank=True)
    content_panels = Page.content_panels + [FieldPanel("intro")]
    parent_page_types = ["content.HomePage"]
    subpage_types = ["content.PersonPage"]


class PersonPage(ChurchPage):
    role = models.CharField(max_length=120, blank=True)
    biography = RichTextField(blank=True)
    category = models.CharField(max_length=30, choices=[("pastor", "Pastor"), ("minister", "Minister"), ("deacon", "Deacon"), ("department-head", "Department head"), ("other", "Other")], default="other")
    portrait = models.ForeignKey("wagtailimages.Image", null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    portrait_alt = models.CharField(max_length=240, blank=True)
    publication_approved = models.BooleanField(default=False, help_text="Confirm permission and church approval before publishing this profile.")
    content_panels = Page.content_panels + [FieldPanel(field) for field in ["role", "category", "biography", "portrait", "portrait_alt", "publication_approved"]]
    api_fields = [APIField("role"), APIField("biography")]
    parent_page_types = ["content.PeopleIndexPage"]
    subpage_types = []


class MinistryIndexPage(ChurchPage):
    max_count_per_parent = 1
    intro = models.TextField(blank=True)
    content_panels = Page.content_panels + [FieldPanel("intro")]
    parent_page_types = ["content.HomePage"]
    subpage_types = ["content.MinistryPage"]


class MinistryPage(ChurchPage):
    summary = models.CharField(max_length=320, blank=True)
    body = RichTextField(blank=True)
    leader_name = models.CharField(max_length=160, blank=True)
    meeting_details = models.CharField(max_length=240, blank=True)
    joining_information = models.TextField(blank=True)
    head = models.ForeignKey("content.PersonPage", null=True, blank=True, on_delete=models.SET_NULL, related_name="headed_departments")
    activities = StreamField([("activity", CardBlock())], blank=True)
    photos = StreamField([("photo", PhotoBlock())], blank=True)
    content_panels = Page.content_panels + [
        FieldPanel("summary"), FieldPanel("body"), FieldPanel("meeting_details"),
        FieldPanel("joining_information"), FieldPanel("head"), InlinePanel("assistants", label="Assistant HODs"), FieldPanel("activities"), FieldPanel("photos"),
    ]
    api_fields = [APIField("summary"), APIField("body"), APIField("meeting_details")]
    parent_page_types = ["content.MinistryIndexPage"]
    subpage_types = []

    class Meta:
        verbose_name = "Department"


class DepartmentAssistant(Orderable):
    department = ParentalKey(MinistryPage, on_delete=models.CASCADE, related_name="assistants")
    person = models.ForeignKey(PersonPage, on_delete=models.CASCADE, related_name="+")
    panels = [FieldPanel("person")]


class MessageIndexPage(ChurchPage):
    max_count_per_parent = 1
    intro = models.TextField(blank=True)
    content_panels = Page.content_panels + [FieldPanel("intro")]
    parent_page_types = ["content.HomePage"]
    subpage_types = ["content.MessagePage"]


class MessagePage(ChurchPage):
    speaker = models.CharField(max_length=160, blank=True)
    message_date = models.DateField(null=True, blank=True)
    series = models.CharField(max_length=160, blank=True)
    media_url = models.URLField(blank=True)
    transcript = RichTextField(blank=True)
    summary = models.CharField(max_length=320, blank=True)
    topic = models.CharField(max_length=160, blank=True)
    audio_url = models.URLField(blank=True)
    cover = models.ForeignKey("wagtailimages.Image", null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    cover_alt = models.CharField(max_length=240, blank=True)
    content_panels = Page.content_panels + [
        FieldPanel("speaker"), FieldPanel("message_date"), FieldPanel("series"),
        FieldPanel("media_url"), FieldPanel("transcript"),
        FieldPanel("summary"), FieldPanel("topic"), FieldPanel("audio_url"), FieldPanel("cover"), FieldPanel("cover_alt"),
    ]
    api_fields = [APIField("speaker"), APIField("message_date"), APIField("series"), APIField("media_url")]
    parent_page_types = ["content.MessageIndexPage"]
    subpage_types = []


class NewsIndexPage(ChurchPage):
    max_count_per_parent = 1
    intro = models.TextField(blank=True)
    content_panels = Page.content_panels + [FieldPanel("intro")]
    parent_page_types = ["content.HomePage"]
    subpage_types = ["content.NewsPage"]


class NewsPage(ChurchPage):
    publish_date = models.DateField(null=True, blank=True)
    summary = models.CharField(max_length=320, blank=True)
    body = RichTextField(blank=True)
    category = models.CharField(max_length=100, default="Church update")
    cover = models.ForeignKey("wagtailimages.Image", null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    cover_alt = models.CharField(max_length=240, blank=True)
    sections = StreamField(EditorialBlocks(), blank=True)
    content_panels = Page.content_panels + [FieldPanel(field) for field in ["publish_date", "category", "summary", "body", "cover", "cover_alt", "sections"]]
    api_fields = [APIField("publish_date"), APIField("summary"), APIField("body")]
    parent_page_types = ["content.NewsIndexPage"]
    subpage_types = []
