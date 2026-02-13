# urls.py


"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""







from django.contrib import admin
from django.urls import path, include

# added for media files
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('api/', include('myapp.urls')),
]

# 🖼️ SERVING MEDIA FILES (Development Only)
# By default, Django does NOT serve media files (like user-uploaded images).
# We must manually add this route so that when you access 'http://localhost:8000/media/...',
# Django knows to look in the MEDIA_ROOT folder and send the file back.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
