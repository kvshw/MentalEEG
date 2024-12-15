from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Resource, ResourceCategory, ResourceRating, ChatMessage, AIAssistance, GuidelineDocument, SupportActionHistory
from .serializers import (
    ResourceSerializer, ResourceCategorySerializer, ResourceRatingSerializer,
    ChatMessageSerializer, AIAssistanceSerializer, GuidelineDocumentSerializer
)
from rest_framework import viewsets
from openai import OpenAI
from django.conf import settings
from rest_framework.views import APIView
import json
from rest_framework.parsers import MultiPartParser, FormParser
import os

# LangChain imports
from langchain_community.document_loaders import TextLoader, PyPDFLoader, Docx2txtLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.chat_models import ChatOpenAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate

class ResourceCategoryViewSet(viewsets.ModelViewSet):
    queryset = ResourceCategory.objects.all()
    serializer_class = ResourceCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer

    def get_queryset(self):
        user = self.request.user
        base_query = Resource.objects.all()

        # Filter based on access level
        if not user.is_superuser:
            access_query = Q(access_level='ALL')
            if user.is_staff:
                access_query |= Q(access_level='MANAGER')
            if hasattr(user, 'is_hr') and user.is_hr:
                access_query |= Q(access_level='HR')
            base_query = base_query.filter(access_query)

        # Apply search if provided
        search = self.request.query_params.get('search', '')
        if search:
            base_query = base_query.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(tags__icontains=search)
            )

        # Filter by category if provided
        category = self.request.query_params.get('category')
        if category:
            base_query = base_query.filter(category_id=category)

        # Filter by type if provided
        resource_type = self.request.query_params.get('type')
        if resource_type:
            base_query = base_query.filter(resource_type=resource_type)

        return base_query

    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        resource = self.get_object()
        user = request.user
        
        rating_value = request.data.get('rating')
        comment = request.data.get('comment', '')
        
        if not rating_value:
            return Response(
                {'error': 'Rating is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        rating, created = ResourceRating.objects.update_or_create(
            resource=resource,
            user=user,
            defaults={'rating': rating_value, 'comment': comment}
        )
        
        serializer = ResourceRatingSerializer(rating)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        resource = self.get_object()
        resource.increment_views()
        return Response({'status': 'success'})

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class ResourceRatingViewSet(viewsets.ModelViewSet):
    queryset = ResourceRating.objects.all()
    serializer_class = ResourceRatingSerializer

    def get_queryset(self):
        return ResourceRating.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer

    @action(detail=False, methods=['post'])
    def chat(self, request):
        try:
            message = request.data.get('message')
            workload_level = request.data.get('workload_level')

            # Get relevant documents for the current workload level
            documents = GuidelineDocument.objects.filter(
                status='ready'
            )
            
            # Filter documents by workload level
            relevant_docs = [
                doc for doc in documents
                if workload_level in doc.get_workload_levels()
            ]

            if not relevant_docs:
                response = "I don't have any guidelines for this workload level yet."
                chat_message = ChatMessage.objects.create(
                    user=request.user,
                    message=message,
                    response=response,
                    workload_level=workload_level
                )
                return Response({'response': response}, status=status.HTTP_200_OK)

            # Load the vector store for each document
            vectorstores = []
            for doc in relevant_docs:
                if doc.vector_store_path:
                    embeddings = OpenAIEmbeddings()
                    vectorstore = FAISS.load_local(doc.vector_store_path, embeddings)
                    vectorstores.append(vectorstore)

            if not vectorstores:
                response = "I'm still processing the guidelines. Please try again later."
                chat_message = ChatMessage.objects.create(
                    user=request.user,
                    message=message,
                    response=response,
                    workload_level=workload_level
                )
                return Response({'response': response}, status=status.HTTP_200_OK)

            # Merge vector stores if multiple exist
            if len(vectorstores) > 1:
                main_vectorstore = vectorstores[0]
                for vs in vectorstores[1:]:
                    main_vectorstore.merge_from(vs)
            else:
                main_vectorstore = vectorstores[0]

            # Create prompt template
            prompt_template = """You are an AI assistant helping with employee mental workload management. 
            Use the following pieces of context to answer the question at the end. 
            If you don't know the answer, just say that you don't know, don't try to make up an answer.

            Context: {context}

            Question: {question}

            Answer:"""

            PROMPT = PromptTemplate(
                template=prompt_template,
                input_variables=["context", "question"]
            )

            # Create QA chain
            chain = load_qa_chain(
                llm=ChatOpenAI(temperature=0),
                chain_type="stuff",
                prompt=PROMPT
            )

            # Get relevant documents
            docs = main_vectorstore.similarity_search(message)

            # Get response
            result = chain({"input_documents": docs, "question": message})

            # Save the message and response
            chat_message = ChatMessage.objects.create(
                user=request.user,
                message=message,
                response=result["output_text"],
                workload_level=workload_level
            )

            return Response({'response': result["output_text"]}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AIAssistanceViewSet(viewsets.ModelViewSet):
    serializer_class = AIAssistanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AIAssistance.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ChatView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            user_message = request.data.get('message', '')
            if not user_message:
                return Response(
                    {'error': 'Message is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            print(f"Processing chat message from user {request.user.id}: {user_message}")

            if not settings.OPENAI_API_KEY:
                print("Error: OPENAI_API_KEY is not set")
                return Response(
                    {'error': 'OpenAI API key is not configured'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Get OpenAI response
            try:
                client = OpenAI(api_key=settings.OPENAI_API_KEY)
                print("Making request to OpenAI API...")
                
                response = client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": """You are a specialized mental health support assistant focused on helping employees manage their mental workload and stress levels. Your expertise includes:

1. Analyzing and providing solutions for:
   - High workload situations
   - Work-related stress
   - Time management
   - Work-life balance
   - Mental fatigue

2. Offering practical strategies for:
   - Reducing mental workload
   - Setting boundaries
   - Prioritizing tasks
   - Taking effective breaks
   - Improving focus and productivity

3. Suggesting immediate actions for:
   - Stress reduction
   - Workload management
   - Mental health maintenance
   - Energy level optimization

Keep responses practical, actionable, and focused on workplace mental health. If asked about specific medical conditions, remind users to consult healthcare professionals."""},
                        {"role": "user", "content": user_message}
                    ],
                    temperature=0.7,
                    max_tokens=500
                )

                ai_response = response.choices[0].message.content
                print("Received response from OpenAI")

            except Exception as openai_error:
                print(f"OpenAI API error: {str(openai_error)}")
                return Response(
                    {'error': f'Error communicating with OpenAI: {str(openai_error)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            try:
                # Save the conversation
                ChatMessage.objects.create(
                    user=request.user,
                    message=user_message,
                    is_ai_response=False
                )

                ChatMessage.objects.create(
                    user=request.user,
                    message=ai_response,
                    is_ai_response=True
                )
                print("Chat messages saved to database")

            except Exception as db_error:
                print(f"Database error: {str(db_error)}")
                # Even if saving fails, still return the AI response
                return Response({
                    'response': ai_response,
                    'warning': 'Failed to save chat history'
                })

            return Response({
                'response': ai_response
            })

        except Exception as e:
            print(f"Unexpected error in ChatView: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class GenerateSupportActionView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            employee_id = request.data.get('employeeId')
            current_level = request.data.get('currentWorkloadLevel')
            previous_level = request.data.get('previousWorkloadLevel')
            is_current_positive = request.data.get('isCurrentPositive')
            is_previous_positive = request.data.get('isPreviousPositive')
            
            # Validate input
            if not all([employee_id, current_level, previous_level]):
                return Response(
                    {'error': 'Missing required fields'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create OpenAI client
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            
            # Construct the prompt
            prompt = f"""As an AI mental health support assistant, generate a specific support action recommendation for an employee based on their mental workload level (1-5):

Current Workload Level: {current_level} ({'Positive' if is_current_positive else 'Negative'})
Previous Workload Level: {previous_level} ({'Positive' if is_previous_positive else 'Negative'})

Workload Level Guide:
- Level 1-2: High stress, immediate intervention needed
- Level 3: Moderate stress, preventive measures recommended
- Level 4-5: Low stress, maintenance and optimization focus

Consider the following when making recommendations:
1. For Levels 1-2:
   - Immediate workload reduction strategies
   - Mental health support resources
   - Consider temporary work adjustments
2. For Level 3:
   - Stress management techniques
   - Work-life balance improvements
   - Preventive mental health practices
3. For Levels 4-5:
   - Performance optimization
   - Career development opportunities
   - Maintaining positive mental health

Provide a specific, actionable recommendation that includes:
1. Immediate action steps
2. Long-term support strategy
3. Resources or tools needed

Format the response as a JSON object with:
- 'immediate_action': Short-term step (1-2 sentences)
- 'long_term_strategy': Ongoing support plan (1-2 sentences)
- 'resources': List of specific resources or tools
- 'priority_level': 'high' | 'medium' | 'low'"""

            # Get completion from OpenAI
            completion = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a mental health support specialist focused on workplace mental health and employee wellbeing."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=300
            )
            
            # Parse the response
            try:
                response_text = completion.choices[0].message.content.strip()
                response_data = json.loads(response_text)
                
                # Save the support action history
                SupportActionHistory.objects.create(
                    employee_id=employee_id,
                    current_workload_level=current_level,
                    previous_workload_level=previous_level,
                    immediate_action=response_data['immediate_action'],
                    long_term_strategy=response_data['long_term_strategy'],
                    resources=json.dumps(response_data['resources']),
                    priority_level=response_data['priority_level'],
                    created_by=request.user
                )
                
            except json.JSONDecodeError:
                # Fallback if response is not valid JSON
                response_data = {
                    "action": completion.choices[0].message.content.strip(),
                    "confidence": 0.8
                }
            
            return Response(response_data)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get(self, request):
        try:
            employee_id = request.query_params.get('employeeId')
            if not employee_id:
                return Response(
                    {'error': 'Employee ID is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get support action history for the employee
            history = SupportActionHistory.objects.filter(
                employee_id=employee_id
            ).values(
                'immediate_action',
                'long_term_strategy',
                'resources',
                'priority_level',
                'created_at',
                'current_workload_level',
                'previous_workload_level'
            ).order_by('-created_at')

            # Process the history to parse JSON resources
            processed_history = []
            for item in history:
                try:
                    item['resources'] = json.loads(item['resources'])
                except:
                    item['resources'] = []
                processed_history.append(item)

            return Response(processed_history)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class GuidelineDocumentViewSet(viewsets.ModelViewSet):
    queryset = GuidelineDocument.objects.all()
    serializer_class = GuidelineDocumentSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        try:
            file_obj = request.FILES['file']
            workload_levels = json.loads(request.data.get('workloadLevels', '[]'))
            
            # Save the document
            document = GuidelineDocument.objects.create(
                name=file_obj.name,
                file=file_obj,
                status='processing'
            )
            document.set_workload_levels(workload_levels)
            document.save()

            # Process the document with LangChain
            self.process_document(document.id)

            serializer = self.get_serializer(document)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def process_document(self, document_id):
        try:
            document = GuidelineDocument.objects.get(id=document_id)
            file_path = document.file.path
            
            # Load document based on file type
            if file_path.endswith('.pdf'):
                loader = PyPDFLoader(file_path)
            elif file_path.endswith('.docx'):
                loader = Docx2txtLoader(file_path)
            else:
                loader = TextLoader(file_path)

            # Split text into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                length_function=len,
            )
            texts = loader.load_and_split(text_splitter)

            # Create embeddings and store in vector database
            embeddings = OpenAIEmbeddings()
            vectorstore = FAISS.from_documents(texts, embeddings)

            # Save the vector store
            vector_store_path = os.path.join(settings.MEDIA_ROOT, 'vectorstores', f'doc_{document.id}')
            os.makedirs(os.path.dirname(vector_store_path), exist_ok=True)
            vectorstore.save_local(vector_store_path)

            # Update document status
            document.status = 'ready'
            document.vector_store_path = vector_store_path
            document.save()

        except Exception as e:
            document.status = 'error'
            document.save()
            raise e
