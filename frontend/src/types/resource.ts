export type ResourceType = 'DOCUMENT' | 'VIDEO' | 'LINK' | 'ARTICLE';
export type AccessLevel = 'ALL' | 'MANAGER' | 'HR' | 'ADMIN';

export interface ResourceCategory {
    id: number;
    name: string;
    description: string;
    icon: string;
    created_at: string;
    updated_at: string;
}

export interface Resource {
    id: number;
    title: string;
    description: string;
    category: number;
    category_name: string;
    resource_type: ResourceType;
    access_level: AccessLevel;
    file?: string;
    external_link?: string;
    content?: string;
    tags: string;
    views_count: number;
    created_by: number;
    created_by_name: string;
    created_at: string;
    updated_at: string;
    is_featured: boolean;
    is_published: boolean;
    average_rating?: number;
    ratings_count: number;
}

export interface ResourceRating {
    id: number;
    resource: number;
    user: number;
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
} 