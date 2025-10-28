from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.contrib.staticfiles.urls import staticfiles_urlpatterns


def health(request):
    return JsonResponse({'status': 'ok'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health),
    path('api/v1/', include('checklists.urls')),
]

# Serve static files during development
urlpatterns += staticfiles_urlpatterns()