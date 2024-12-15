'use client';

import { useEffect, useState } from 'react';
import ResourceForm from '@/components/resources/ResourceForm';
import { resourceService } from '@/services/resourceService';
import { Resource } from '@/types/resource';
import { toast } from '@/components/ui/use-toast';

interface EditResourcePageProps {
    params: {
        id: string;
    };
}

export default function EditResourcePage({ params }: EditResourcePageProps) {
    const [resource, setResource] = useState<Resource | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResource = async () => {
            try {
                const response = await resourceService.getResource(parseInt(params.id));
                setResource(response.data);
            } catch (error) {
                console.error('Error fetching resource:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load resource',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchResource();
    }, [params.id]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>;
    }

    if (!resource) {
        return <div className="text-center py-8">Resource not found</div>;
    }

    return <ResourceForm initialData={resource} />;
} 