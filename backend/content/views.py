from django.http import JsonResponse
from django.db.models import Q
from django.views.decorators.cache import cache_control
from django.views.decorators.http import require_GET
from wagtail.models import Page, Site
from .models import ChurchSettings, HomePage, InformationPage, EventPage, ServicePage, PersonPage, MinistryPage, MessagePage, NewsPage, EventIndexPage, ServiceIndexPage, PeopleIndexPage, MinistryIndexPage, MessageIndexPage, NewsIndexPage
from .serializers import serialize_page
from .public import published_pages


@require_GET
@cache_control(public=True, max_age=60)
def public_content(request):
    """One public contract for Next.js. Drafts and restricted ancestors are excluded."""
    site = Site.find_for_request(request)
    if not site:
        return JsonResponse({"error": "No Wagtail site is configured."}, status=503)
    pages = published_pages(site.root_page)
    public_ids = set(pages.values_list("pk", flat=True))
    home = HomePage.objects.filter(pk__in=public_ids).first()
    if not home:
        return JsonResponse({"error": "The church site is not currently published."}, status=503)
    site_settings = ChurchSettings.load(request)
    fields = ["church_name", "address", "phone", "email", "office_hours", "maps_url", "youtube_url", "youtube_live_url", "facebook_url", "facebook_live_url", "instagram_url", "announcement", "announcement_url"]
    result = {"version": 1, "settings": {field: getattr(site_settings, field) for field in fields}, "home": serialize_page(home, request, public_ids) if home else None}
    sections = Page.objects.descendant_of(site.root_page).filter(Q(live=True) | Q(first_published_at__isnull=False))
    # Once adopted, an unpublished section stays empty instead of resurrecting
    # the old local preview content. Initial, never-published drafts use the UI.
    result["managed"] = {key: sections.filter(content_type__model=model).exists() for key, model in [("events", "eventindexpage"), ("services", "serviceindexpage"), ("people", "peopleindexpage"), ("departments", "ministryindexpage"), ("messages", "messageindexpage"), ("news", "newsindexpage")]}
    result["indexes"] = {}
    for key, model in [("events", EventIndexPage), ("services", ServiceIndexPage), ("people", PeopleIndexPage), ("departments", MinistryIndexPage), ("messages", MessageIndexPage), ("news", NewsIndexPage)]:
        index = model.objects.filter(pk__in=public_ids).first()
        if index:
            result["indexes"][key] = serialize_page(index, request, public_ids)
    for key, model in [("pages", InformationPage), ("events", EventPage), ("services", ServicePage), ("people", PersonPage), ("departments", MinistryPage), ("messages", MessagePage), ("news", NewsPage)]:
        queryset = model.objects.filter(pk__in=public_ids).order_by("path")
        if model is PersonPage:
            queryset = queryset.filter(publication_approved=True)
        result[key] = [serialize_page(page, request, public_ids) for page in queryset]
    return JsonResponse(result)
