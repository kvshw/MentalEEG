import { create } from 'zustand';
import { supportApi, ChatMessage } from '@/lib/api/support';

type Status = 'idle' | 'loading' | 'error' | 'success';

interface ChatState {
    messages: ChatMessage[];
    status: Status;
    error: string | null;
}

interface ChatActions {
    fetchChatHistory: (token: string) => Promise<void>;
    sendMessage: (message: string, workloadLevel: number, token: string) => Promise<void>;
    clearMessages: () => void;
    reset: () => void;
}

const initialState: ChatState = {
    messages: [],
    status: 'idle',
    error: null,
};

export const useChatStore = create<ChatState & ChatActions>((set) => ({
    ...initialState,

    fetchChatHistory: async (token: string) => {
        set({ status: 'loading', error: null });
        try {
            const messages = await supportApi.getChatHistory(token);
            set({ messages, status: 'success' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch chat history';
            set({ error: errorMessage, status: 'error' });
            throw error;
        }
    },

    sendMessage: async (message: string, workloadLevel: number, token: string) => {
        set({ status: 'loading', error: null });
        try {
            const response = await supportApi.sendMessage(message, workloadLevel, token);
            set((state) => ({
                messages: [...state.messages, {
                    message,
                    response: response.response,
                    timestamp: new Date().toISOString(),
                    workload_level: workloadLevel
                }],
                status: 'success'
            }));
            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
            set({ error: errorMessage, status: 'error' });
            throw error;
        }
    },

    clearMessages: () => {
        set((state) => ({ ...state, messages: [], error: null }));
    },

    reset: () => {
        set(initialState);
    },
})); 