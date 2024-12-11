from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Resource, ChatMessage, AIAssistance
from .serializers import ResourceSerializer, ChatMessageSerializer, AIAssistanceSerializer
from rest_framework import status, views
from rest_framework.response import Response
from django.conf import settings
from openai import OpenAI

class ResourceListView(generics.ListCreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = (permissions.IsAuthenticated,)

class DocumentUploadView(generics.CreateAPIView):
    serializer_class = ResourceSerializer
    permission_classes = (permissions.IsAuthenticated,)

class ChatView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        
    def get_system_prompt(self):
        # Get relevant resources to build context
        resources = Resource.objects.all().order_by('-created_at')[:5]
        context = "\n".join([f"Resource: {r.title}\nDescription: {r.description}" for r in resources])
        
        return f"""You are an AI mental health assistant for MentalEEG, a workplace mental health monitoring system. 
        Your role is to provide supportive, professional guidance based on EEG data and workplace wellness.
        
        Available Resources and Guidelines:
        {context}
        
        Important Guidelines:
        1. Always maintain a professional, empathetic tone
        2. Provide practical, actionable advice
        3. Reference company resources when relevant
        4. Encourage seeking professional help when needed
        5. Focus on workplace mental health and well-being
        6. Never provide medical diagnoses
        7. Keep responses concise and clear
        
        Format your responses in a structured way:
        1. Acknowledge the concern
        2. Provide specific advice or information
        3. Reference relevant resources if applicable
        4. End with a supportive statement or follow-up question
        """

    def post(self, request):
        try:
            # Save user message
            user_message = ChatMessage.objects.create(
                user=request.user,
                message=request.data.get('message'),
                is_ai_response=False
            )
            
            # Get chat history
            chat_history = ChatMessage.objects.filter(
                user=request.user
            ).order_by('-timestamp')[:10]  # Last 10 messages
            
            # Format messages for OpenAI
            messages = [
                {"role": "system", "content": self.get_system_prompt()},
            ]
            
            # Add chat history in reverse order
            for msg in reversed(chat_history):
                role = "assistant" if msg.is_ai_response else "user"
                messages.append({"role": role, "content": msg.message})
            
            # Get AI response
            response = self.client.chat.completions.create(
                model="gpt-4-1106-preview",
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )
            
            ai_message = response.choices[0].message.content
            
            # Save AI response
            ChatMessage.objects.create(
                user=request.user,
                message=ai_message,
                is_ai_response=True
            )
            
            return Response({
                'message': ai_message,
                'timestamp': user_message.timestamp
            })
            
        except Exception as e:
            print(f"Error in ChatView: {str(e)}")  # Add debugging
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AIAssistView(generics.CreateAPIView):
    serializer_class = AIAssistanceSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
