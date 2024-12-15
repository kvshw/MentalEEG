from rest_framework import serializers
from .models import (
    Resource, ResourceCategory, ResourceRating,
    ChatMessage, AIAssistance, GuidelineDocument,
    SupportActionHistory
)
import json

class ResourceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceCategory
        fields = '__all__'

class ResourceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Resource
        fields = '__all__'

class ResourceRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceRating
        fields = '__all__'

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = '__all__'

class AIAssistanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIAssistance
        fields = '__all__'

class GuidelineDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuidelineDocument
        fields = '__all__'

class SupportActionHistorySerializer(serializers.ModelSerializer):
    resources = serializers.JSONField()
    
    class Meta:
        model = SupportActionHistory
        fields = '__all__'