from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ResourceViewSet, ResourceCategoryViewSet, ResourceRatingViewSet,
    ChatMessageViewSet, GuidelineDocumentViewSet, GenerateSupportActionView,
    ChatView
)

router = DefaultRouter()
router.register(r'resources', ResourceViewSet, basename='resource')
router.register(r'categories', ResourceCategoryViewSet, basename='category')
router.register(r'ratings', ResourceRatingViewSet, basename='rating')
router.register(r'chat-messages', ChatMessageViewSet, basename='chat-message')
router.register(r'guidelines', GuidelineDocumentViewSet, basename='guideline')

urlpatterns = [
    path('', include(router.urls)),
    path('chat/', ChatView.as_view(), name='chat'),
    path('generate-support-action/', GenerateSupportActionView.as_view(), name='generate-support-action'),
] 