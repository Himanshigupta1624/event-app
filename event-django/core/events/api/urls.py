from rest_framework.routers import DefaultRouter
from .views import EventViewSet
from django.urls import path,include

router=DefaultRouter()

router.register(r'events',EventViewSet)


urlpatterns = [
    path('',include(router.urls))
]
