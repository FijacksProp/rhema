from wagtail.models import Page


def published_pages(root):
    pages = Page.objects.descendant_of(root, inclusive=True)
    visible = pages.live().public()
    # A published child of an unpublished section must not surface in the API.
    for path in pages.filter(live=False).values_list("path", flat=True):
        visible = visible.exclude(path__startswith=path)
    return visible
