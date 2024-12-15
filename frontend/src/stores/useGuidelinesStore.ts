import { create } from 'zustand';
import { supportApi, GuidelineDocument } from '@/lib/api/support';

type Status = 'idle' | 'loading' | 'error' | 'success';

interface GuidelinesState {
    guidelines: GuidelineDocument[];
    status: Status;
    error: string | null;
}

interface GuidelinesActions {
    fetchGuidelines: () => Promise<void>;
    uploadGuideline: (file: File, workloadLevels: number[]) => Promise<void>;
    deleteGuideline: (id: string) => Promise<void>;
    reset: () => void;
}

const initialState: GuidelinesState = {
    guidelines: [],
    status: 'idle',
    error: null,
};

export const useGuidelinesStore = create<GuidelinesState & GuidelinesActions>((set) => ({
    ...initialState,

    fetchGuidelines: async () => {
        set({ status: 'loading', error: null });
        try {
            const guidelines = await supportApi.getGuidelines();
            set({ guidelines, status: 'success' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch guidelines';
            set({ error: errorMessage, status: 'error' });
            throw error;
        }
    },

    uploadGuideline: async (file: File, workloadLevels: number[]) => {
        set({ status: 'loading', error: null });
        try {
            const newGuideline = await supportApi.uploadGuideline(file, workloadLevels);
            set((state) => ({
                guidelines: [...state.guidelines, newGuideline],
                status: 'success'
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to upload guideline';
            set({ error: errorMessage, status: 'error' });
            throw error;
        }
    },

    deleteGuideline: async (id: string) => {
        set({ status: 'loading', error: null });
        try {
            await supportApi.deleteGuideline(id);
            set((state) => ({
                guidelines: state.guidelines.filter((g) => g.id !== id),
                status: 'success'
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete guideline';
            set({ error: errorMessage, status: 'error' });
            throw error;
        }
    },

    reset: () => {
        set(initialState);
    },
})); 