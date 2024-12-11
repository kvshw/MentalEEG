'use client';

import React, { useState, useEffect } from 'react';
import { PaperClipIcon, ArrowUpIcon, FolderIcon } from '@heroicons/react/24/outline';
import DocumentUploadModal from '@/components/support/DocumentUploadModal';
import { supportApi, ChatMessage as ApiChatMessage } from '@/lib/api/support';
import { useAuth } from '@/hooks/useAuth';

interface Message extends ApiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface SupportAction {
  id: string;
  date: string;
  action: string;
  employeeName: string;
  employeeId: string;
  previousWorkload: number;
  currentWorkload: number;
}

// Mock data for support history - will be replaced with API data later
const mockSupportHistory: SupportAction[] = [
  {
    id: '1',
    date: '2024-01-17',
    action: 'Reduced Workload by 25%',
    employeeName: 'Johanna Saartaala',
    employeeId: '11932',
    previousWorkload: 4,
    currentWorkload: 3,
  },
  {
    id: '2',
    date: '2024-01-15',
    action: 'Assign to Psychiatrist',
    employeeName: 'Aino Virtanen',
    employeeId: '11945',
    previousWorkload: 5,
    currentWorkload: 4,
  },
];

const formatTimestamp = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const WorkloadLevel: React.FC<{ level: number }> = ({ level }) => {
  const getWorkloadColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-red-100 text-red-800';
      case 2: return 'bg-orange-100 text-orange-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 4: return 'bg-green-100 text-green-800';
      case 5: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getWorkloadColor(level)}`}>
      Level {level}
    </span>
  );
};

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const history = await supportApi.getChatHistory(token);
        const formattedHistory = history.map((msg): Message => ({
          id: msg.id || Date.now().toString(),
          role: msg.is_ai_response ? 'assistant' : 'user',
          content: msg.message,
          timestamp: msg.timestamp || formatTimestamp(new Date()),
          message: msg.message,
          is_ai_response: msg.is_ai_response,
        }));

        setMessages(formattedHistory);
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    };

    loadChatHistory();
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No access token found');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: formatTimestamp(new Date()),
      message: input,
      is_ai_response: false,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await supportApi.sendMessage(input, token);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: response.timestamp || formatTimestamp(new Date()),
        message: response.message,
        is_ai_response: true,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: formatTimestamp(new Date()),
        message: 'Sorry, I encountered an error. Please try again later.',
        is_ai_response: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      for (const file of files) {
        await supportApi.uploadDocument(file, token);
      }
      
      // Add success message to chat
      const successMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Documents uploaded successfully! I\'ll analyze them and use them to provide better assistance.',
        timestamp: formatTimestamp(new Date()),
        message: 'Documents uploaded successfully!',
        is_ai_response: true,
      };
      setMessages(prev => [...prev, successMessage]);
    } catch (error) {
      console.error('Failed to upload files:', error);
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while uploading the documents. Please try again later.',
        timestamp: formatTimestamp(new Date()),
        message: 'Error uploading documents.',
        is_ai_response: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex h-full">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col h-full">
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Support Resources</h1>
              <p className="mt-1 text-sm text-gray-500">
                Get AI-powered suggestions for managing employee mental workload
              </p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <FolderIcon className="h-5 w-5 mr-2" />
              Upload Guidelines
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-lg rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <PaperClipIcon className="w-5 h-5" />
            </button>
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className={`p-2 rounded-md ${
                input.trim() && !isLoading
                  ? 'text-orange-500 hover:bg-orange-50'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <ArrowUpIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Support History Sidebar */}
      <div className="w-96 border-l border-gray-200 bg-white overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Support History</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {mockSupportHistory.map((action) => (
            <div key={action.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{action.action}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {action.employeeName} ({action.employeeId})
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{action.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <WorkloadLevel level={action.previousWorkload} />
                  <span className="text-gray-400">→</span>
                  <WorkloadLevel level={action.currentWorkload} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />
    </div>
  );
} 