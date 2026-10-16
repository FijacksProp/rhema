from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from wagtail.api.v2.views import PagesAPIViewSet
from wagtail.api.v2.router import WagtailAPIRouter
from content.views import public_content
from content.public import published_pages
from content.models import PersonPage
from wagtail.models import Site


class ChurchPagesAPIViewSet(PagesAPIViewSet):
    def get_queryset(self):
        queryset = super().get_queryset()
        site = Site.find_for_request(self.request)
        if not site:
            return queryset.none()
        return queryset.filter(pk__in=published_pages(site.root_page).values("pk")).exclude(pk__in=PersonPage.objects.filter(publication_approved=False).values("pk"))

api_router = WagtailAPIRouter("wagtailapi")
api_router.register_endpoint("pages", ChurchPagesAPIViewSet)

urlpatterns = [
    path("django-admin/", admin.site.urls),
    path("cms/", include("wagtail.admin.urls")),
    path("documents/", include("wagtail.documents.urls")),
    path("api/v2/", api_router.urls),
    path("api/church/", public_content, name="church-content"),
]

# The public site is rendered by Next.js. Wagtail is headless here and serves
# editorial pages through its read-only API plus the staff CMS interface.

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
