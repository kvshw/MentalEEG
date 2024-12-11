from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Resource, ChatMessage, AIAssistance
from .serializers import ResourceSerializer, ChatMessageSerializer, AIAssistanceSerializer

class ResourceListView(generics.ListCreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = (permissions.IsAuthenticated,)

class DocumentUploadView(generics.CreateAPIView):
    serializer_class = ResourceSerializer
    permission_classes = (permissions.IsAuthenticated,)

class ChatView(generics.ListCreateAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return ChatMessage.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AIAssistView(generics.CreateAPIView):
    serializer_class = AIAssistanceSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
