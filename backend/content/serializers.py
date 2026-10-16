from django.conf import settings
from wagtail.rich_text import expand_db_html


def page_path(page):
    name = page.specific_class.__name__
    prefixes = {"EventPage": "events", "PersonPage": "leadership", "MinistryPage": "departments", "MessagePage": "messages", "NewsPage": "news"}
    indexes = {"EventIndexPage": "events", "PeopleIndexPage": "leadership", "MinistryIndexPage": "departments", "MessageIndexPage": "messages", "NewsIndexPage": "news", "ServiceIndexPage": "services"}
    if name == "HomePage":
        return "/"
    if name == "MinistryPage" and page.slug == "children-department":
        return "/children"
    if name == "ServicePage":
        return "/services"
    if name in indexes:
        return f"/{indexes[name]}"
    if name in prefixes:
        return f"/{prefixes[name]}/{page.slug}"
    return f"/{page.slug}"


def photo(image, alt, request):
    if not image:
        return None
    rendition = image.get_rendition("max-1600x1200|format-webp")
    media_base = getattr(settings, "PUBLIC_MEDIA_BASE_URL", "")
    url = rendition.url if rendition.url.startswith(("https://", "http://")) else f"{media_base.rstrip('/')}{rendition.url}" if media_base else request.build_absolute_uri(rendition.url)
    return {"src": url, "alt": alt or image.title, "width": rendition.width, "height": rendition.height}


def rich(value):
    return str(expand_db_html(str(value))) if value else ""


def serialize_blocks(stream, request):
    result = []
    for block in stream:
        value = block.value
        if block.block_type == "section":
            data = {"heading": value["heading"], "body": rich(value["body"])}
        elif block.block_type == "photo":
            if not value["image"]:
                continue
            data = {"photo": photo(value["image"], value["alt"], request), "caption": value["caption"]}
        elif block.block_type == "cards":
            data = [{"title": item["title"], "description": item["description"]} for item in value]
        elif block.block_type == "questions":
            data = [{"question": item["question"], "answer": rich(item["answer"])} for item in value]
        else:
            continue
        result.append({"type": block.block_type, "value": data, "id": block.id})
    return result


def person_data(person, request, public_ids=None):
    if not person or (public_ids is not None and (person.pk not in public_ids or not person.publication_approved)):
        return None
    return {"id": person.pk, "slug": person.slug, "title": person.title, "name": person.title, "path": page_path(person), "role": person.role, "category": person.category, "biography": rich(person.biography), "portrait": photo(person.portrait, person.portrait_alt, request)}


def serialize_page(page, request, public_ids=None):
    from .models import HomePage, InformationPage, EventPage, ServicePage, PersonPage, MinistryPage, MessagePage, NewsPage
    data = {"id": page.pk, "slug": page.slug, "title": page.title, "path": page_path(page), "seo_title": page.seo_title or page.title, "search_description": page.search_description}
    if isinstance(page, HomePage):
        data.update(heading=page.heading, accent=page.accent, intro=page.intro, hero=photo(page.hero_image, page.hero_alt, request), photo_stories=serialize_blocks(page.photo_stories, request))
        for key in ("featured_event", "featured_message", "featured_news"):
            target = getattr(page, key)
            data[key] = target.pk if target and (public_ids is None or target.pk in public_ids) else None
    elif isinstance(page, InformationPage):
        data.update(heading=page.heading, accent=page.accent, intro=page.intro, cover=photo(page.cover, page.cover_alt, request), sections=serialize_blocks(page.sections, request))
    elif isinstance(page, EventPage):
        data.update(event_date=page.event_date.isoformat() if page.event_date else None, start_time=page.start_time.isoformat() if page.start_time else None, end_time=page.end_time.isoformat() if page.end_time else None, location=page.location, summary=page.summary, body=rich(page.body), registration_state=page.registration_state, registration_url=page.registration_url, cover=photo(page.cover, page.cover_alt, request), sections=serialize_blocks(page.sections, request))
    elif isinstance(page, ServicePage):
        data.update(schedule=page.schedule, location=page.location, summary=page.summary)
    elif isinstance(page, PersonPage):
        data.update(person_data(page, request) or {})
    elif isinstance(page, MinistryPage):
        data.update(summary=page.summary, body=rich(page.body), meeting_details=page.meeting_details, joining_information=page.joining_information,
            head=person_data(page.head, request, public_ids), assistants=[person for assistant in page.assistants.select_related("person") if (person := person_data(assistant.person, request, public_ids))],
            activities=[{"title": block.value["title"], "description": block.value["description"]} for block in page.activities], photos=[{**entry["value"]["photo"], "caption": entry["value"]["caption"]} for entry in serialize_blocks(page.photos, request)])
    elif isinstance(page, MessagePage):
        data.update(speaker=page.speaker, message_date=page.message_date.isoformat() if page.message_date else None, series=page.series, topic=page.topic, summary=page.summary, media_url=page.media_url, audio_url=page.audio_url, transcript=rich(page.transcript), cover=photo(page.cover, page.cover_alt, request))
    elif isinstance(page, NewsPage):
        data.update(publish_date=page.publish_date.isoformat() if page.publish_date else None, category=page.category, summary=page.summary, body=rich(page.body), cover=photo(page.cover, page.cover_alt, request), sections=serialize_blocks(page.sections, request))
    elif hasattr(page, "intro"):
        data["intro"] = page.intro
    return data
