import api from '@/lib/api';
import { Resource, ResourceCategory, ResourceRating } from '../types/resource';

export const resourceService = {
    // Resource Categories
    getCategories: () => api.get<ResourceCategory[]>('/support/categories/'),
    createCategory: (data: Partial<ResourceCategory>) => api.post<ResourceCategory>('/support/categories/', data),
    updateCategory: (id: number, data: Partial<ResourceCategory>) => api.patch<ResourceCategory>(`/support/categories/${id}/`, data),
    deleteCategory: (id: number) => api.delete(`/support/categories/${id}/`),

    // Resources
    getResources: (params?: {
        search?: string;
        category?: number;
        type?: string;
    }) => api.get<Resource[]>('/support/resources/', { params }),
    
    getResource: (id: number) => api.get<Resource>(`/support/resources/${id}/`),
    
    createResource: (data: FormData) => api.post<Resource>('/support/resources/', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    
    updateResource: (id: number, data: FormData) => api.patch<Resource>(`/support/resources/${id}/`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    
    deleteResource: (id: number) => api.delete(`/support/resources/${id}/`),
    
    incrementViews: (id: number) => api.post(`/support/resources/${id}/increment_views/`),

    // Ratings
    getRatings: (resourceId: number) => api.get<ResourceRating[]>(`/support/ratings/?resource=${resourceId}`),
    
    createRating: (data: {
        resource: number;
        rating: number;
        comment?: string;
    }) => api.post<ResourceRating>('/support/ratings/', data),
    
    updateRating: (id: number, data: {
        rating: number;
        comment?: string;
    }) => api.patch<ResourceRating>(`/support/ratings/${id}/`, data),
    
    deleteRating: (id: number) => api.delete(`/support/ratings/${id}/`),
}; 