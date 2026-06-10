from django.contrib import admin
from django.urls import path,include
from django.conf import settings

urlpatterns = [
    #path('admin/', admin.site.urls),
    path(settings.ADMIN_URL, admin.site.urls),
    path('api/', include('App.urls')),
]
