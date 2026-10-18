from wagtail.models import Page, Site


def church_site_for_request(request):
    # Preview deployments have a new hostname on each build. This project has a
    # single church site, so resolve unmatched deployment aliases to its default.
    return Site.find_for_request(request) or Site.objects.filter(is_default_site=True).first()


def published_pages(root):
    pages = Page.objects.descendant_of(root, inclusive=True)
    visible = pages.live().public()
    # A published child of an unpublished section must not surface in the API.
    for path in pages.filter(live=False).values_list("path", flat=True):
        visible = visible.exclude(path__startswith=path)
    return visible
