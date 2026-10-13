from django.db import models
from wagtail.admin.panels import FieldPanel
from wagtail.api import APIField
from wagtail.fields import RichTextField
from wagtail.models import Page


class HomePage(Page):
    intro = models.TextField(blank=True)
    content_panels = Page.content_panels + [FieldPanel("intro")]
    subpage_types = [
        "content.EventIndexPage",
        "content.ServiceIndexPage",
        "content.PeopleIndexPage",
        "content.MinistryIndexPage",
        "content.MessageIndexPage",
        "content.NewsIndexPage",
    ]


class EventIndexPage(Page):
    intro = models.TextField(blank=True)
    content_panels = Page.content_panels + [FieldPanel("intro")]
    parent_page_types = ["content.HomePage"]
    subpage_types = ["content.EventPage"]


class EventPage(Page):
    event_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    location = models.CharField(max_length=240, blank=True)
    summary = models.CharField(max_length=320, blank=True)
    body = RichTextField(blank=True)
    registration_state = models.CharField(
        max_length=20,
        choices=[("coming_soon", "Coming soon"), ("open", "Open"), ("closed", "Closed")],
        default="coming_soon",
    )
    content_panels = Page.content_panels + [
        FieldPanel("event_date"), FieldPanel("start_time"), FieldPanel("end_time"),
        FieldPanel("location"), FieldPanel("summary"), FieldPanel("body"),
        FieldPanel("registration_state"),
    ]
    api_fields = [
        APIField("event_date"), APIField("start_time"), APIField("end_time"),
        APIField("location"), APIField("summary"), APIField("registration_state"),
    ]
    parent_page_types = ["content.EventIndexPage"]
    subpage_types = []


class ServiceIndexPage(Page):
    intro = models.TextField(blank=True)
    content_panels = Page.content_panels + [FieldPanel("intro")]
    parent_page_types = ["content.HomePage"]
    subpage_types = ["content.ServicePage"]


class ServicePage(Page):
    schedule = models.CharField(max_length=160, blank=True)
    location = models.CharField(max_length=240, blank=True)
    summary = models.CharField(max_length=320, blank=True)
    content_panels = Page.content_panels + [FieldPanel("schedule"), FieldPanel("location"), FieldPanel("summary")]
    api_fields = [APIField("schedule"), APIField("location"), APIField("summary")]
    parent_page_types = ["content.ServiceIndexPage"]
    subpage_types = []


class PeopleIndexPage(Page):
    intro = models.TextField(blank=True)
    content_panels = Page.content_panels + [FieldPanel("intro")]
    parent_page_types = ["content.HomePage"]
    subpage_types = ["content.PersonPage"]


class PersonPage(Page):
    role = models.CharField(max_length=120, blank=True)
    biography = RichTextField(blank=True)
    content_panels = Page.content_panels + [FieldPanel("role"), FieldPanel("biography")]
    api_fields = [APIField("role"), APIField("biography")]
    parent_page_types = ["content.PeopleIndexPage"]
    subpage_types = []


class MinistryIndexPage(Page):
    intro = models.TextField(blank=True)
    content_panels = Page.content_panels + [FieldPanel("intro")]
    parent_page_types = ["content.HomePage"]
    subpage_types = ["content.MinistryPage"]


class MinistryPage(Page):
    summary = models.CharField(max_length=320, blank=True)
    body = RichTextField(blank=True)
    leader_name = models.CharField(max_length=160, blank=True)
    meeting_details = models.CharField(max_length=240, blank=True)
    content_panels = Page.content_panels + [
        FieldPanel("summary"), FieldPanel("body"), FieldPanel("leader_name"), FieldPanel("meeting_details"),
    ]
    api_fields = [APIField("summary"), APIField("body"), APIField("leader_name"), APIField("meeting_details")]
    parent_page_types = ["content.MinistryIndexPage"]
    subpage_types = []


class MessageIndexPage(Page):
    intro = models.TextField(blank=True)
    content_panels = Page.content_panels + [FieldPanel("intro")]
    parent_page_types = ["content.HomePage"]
    subpage_types = ["content.MessagePage"]


class MessagePage(Page):
    speaker = models.CharField(max_length=160, blank=True)
    message_date = models.DateField(null=True, blank=True)
    series = models.CharField(max_length=160, blank=True)
    media_url = models.URLField(blank=True)
    transcript = RichTextField(blank=True)
    content_panels = Page.content_panels + [
        FieldPanel("speaker"), FieldPanel("message_date"), FieldPanel("series"),
        FieldPanel("media_url"), FieldPanel("transcript"),
    ]
    api_fields = [APIField("speaker"), APIField("message_date"), APIField("series"), APIField("media_url")]
    parent_page_types = ["content.MessageIndexPage"]
    subpage_types = []


class NewsIndexPage(Page):
    intro = models.TextField(blank=True)
    content_panels = Page.content_panels + [FieldPanel("intro")]
    parent_page_types = ["content.HomePage"]
    subpage_types = ["content.NewsPage"]


class NewsPage(Page):
    publish_date = models.DateField(null=True, blank=True)
    summary = models.CharField(max_length=320, blank=True)
    body = RichTextField(blank=True)
    content_panels = Page.content_panels + [FieldPanel("publish_date"), FieldPanel("summary"), FieldPanel("body")]
    api_fields = [APIField("publish_date"), APIField("summary"), APIField("body")]
    parent_page_types = ["content.NewsIndexPage"]
    subpage_types = []
