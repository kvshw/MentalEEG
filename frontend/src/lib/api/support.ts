import api from './index';

export interface ChatMessage {
    id?: string;
    message: string;
    response?: string;
    timestamp?: string;
}

export interface GenerateSupportActionRequest {
    employeeId: string;
    currentWorkloadLevel?: number;
    previousWorkloadLevel?: number;
    isCurrentPositive?: boolean;
    isPreviousPositive?: boolean;
    method?: 'GET';
}

export interface SupportActionResponse {
    immediate_action: string;
    long_term_strategy: string;
    resources: string[];
    priority_level: 'high' | 'medium' | 'low';
    created_at: string;
    current_workload_level: number;
    previous_workload_level: number;
}

export const supportApi = {
    sendMessage: async (message: string) => {
        const response = await api.post('/support/chat/', {
            message
        });
        return response.data;
    },

    getChatHistory: async () => {
        const response = await api.get('/support/chat-messages/');
        return response.data;
    },

    generateSupportAction: async (data: GenerateSupportActionRequest): Promise<SupportActionResponse | SupportActionResponse[]> => {
        if (data.method === 'GET') {
            const response = await api.get(`/support/generate-support-action/?employeeId=${data.employeeId}`);
            return response.data;
        }
        
        const response = await api.post('/support/generate-support-action/', data);
        return response.data;
    },
}; 