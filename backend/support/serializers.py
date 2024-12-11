from rest_framework import serializers
from .models import Resource, ChatMessage, AIAssistance

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = '__all__'

class ChatMessageSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = ChatMessage
        fields = ('id', 'user', 'user_name', 'message', 'is_ai_response', 'timestamp')
        read_only_fields = ('user', 'is_ai_response')

class AIAssistanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIAssistance
        fields = ('id', 'query', 'response', 'created_at')
        read_only_fields = ('user', 'response') 