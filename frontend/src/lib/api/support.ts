import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ChatMessage {
  id?: string;
  message: string;
  timestamp?: string;
  is_ai_response?: boolean;
}

export const supportApi = {
  sendMessage: async (message: string, token: string): Promise<ChatMessage> => {
    const response = await axios.post(
      `${API_URL}/support/chat/`,
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getChatHistory: async (token: string): Promise<ChatMessage[]> => {
    const response = await axios.get(`${API_URL}/support/chat/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  uploadDocument: async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_URL}/support/documents/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
}; 