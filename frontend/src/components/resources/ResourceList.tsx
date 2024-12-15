'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, FileText, Video, Link as LinkIcon, FileQuestion, Plus } from 'lucide-react';
import { Resource, ResourceCategory, ResourceType } from '@/types/resource';
import { resourceService } from '@/services/resourceService';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

const ResourceTypeIcons: Record<ResourceType, React.ReactNode> = {
    DOCUMENT: <FileText className="w-4 h-4" />,
    VIDEO: <Video className="w-4 h-4" />,
    LINK: <LinkIcon className="w-4 h-4" />,
    ARTICLE: <FileQuestion className="w-4 h-4" />,
};

export default function ResourceList() {
    const router = useRouter();
    const [resources, setResources] = useState<Resource[]>([]);
    const [categories, setCategories] = useState<ResourceCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const response = await resourceService.getCategories();
                console.log('Categories response:', response);
                if (Array.isArray(response.data)) {
                    setCategories(response.data);
                } else if (response.data && Array.isArray(response.data.results)) {
                    setCategories(response.data.results);
                } else {
                    console.error('Categories response is not an array:', response.data);
                    toast({
                        title: 'Warning',
                        description: 'Failed to load categories properly',
                        variant: 'destructive',
                    });
                }
            } catch (error: any) {
                console.error('Error fetching categories:', error);
                toast({
                    title: 'Error',
                    description: error.message || 'Failed to load categories',
                    variant: 'destructive',
                });
            } finally {
                setLoadingCategories(false);
            }
        };

        const fetchResources = async () => {
            try {
                setLoading(true);
                const response = await resourceService.getResources({
                    search: searchTerm,
                    category: selectedCategory ? Number(selectedCategory) : undefined,
                    type: selectedType || undefined,
                });
                
                if (Array.isArray(response.data)) {
                    setResources(response.data);
                } else if (response.data && Array.isArray(response.data.results)) {
                    setResources(response.data.results);
                } else {
                    console.error('Resources response is not an array:', response.data);
                    setResources([]);
                }
            } catch (error: any) {
                console.error('Error fetching resources:', error);
                toast({
                    title: 'Error',
                    description: error.message || 'Failed to load resources',
                    variant: 'destructive',
                });
                setResources([]);
            } finally {
                setLoading(false);
            }
        };

        // Fetch categories only once when component mounts
        if (categories.length === 0) {
            fetchCategories();
        }

        // Fetch resources when filters change
        fetchResources();
    }, [searchTerm, selectedCategory, selectedType]);

    const handleResourceClick = (resource: Resource) => {
        resourceService.incrementViews(resource.id);
        router.push(`/resources/${resource.id}`);
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Resources</h1>
                <Button onClick={() => router.push('/resources/new')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Resource
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {categories.map((category) => (
                            category && category.id ? (
                                <SelectItem 
                                    key={category.id} 
                                    value={category.id.toString()}
                                >
                                    {category.name}
                                </SelectItem>
                            ) : null
                        ))}
                    </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Types</SelectItem>
                        <SelectItem value="DOCUMENT">Documents</SelectItem>
                        <SelectItem value="VIDEO">Videos</SelectItem>
                        <SelectItem value="LINK">Links</SelectItem>
                        <SelectItem value="ARTICLE">Articles</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                    <Card
                        key={resource.id}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => handleResourceClick(resource)}
                    >
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                {ResourceTypeIcons[resource.resource_type]}
                                <Badge variant="secondary">{resource.category_name}</Badge>
                                {resource.is_featured && (
                                    <Badge variant="default" className="bg-yellow-500">
                                        Featured
                                    </Badge>
                                )}
                            </div>
                            <CardTitle className="mt-2">{resource.title}</CardTitle>
                            <CardDescription>
                                By {resource.created_by_name} on{' '}
                                {format(new Date(resource.created_at), 'MMM d, yyyy')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {resource.description}
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>
                                    {resource.average_rating?.toFixed(1) || 'No ratings'} ({resource.ratings_count})
                                </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {resource.views_count} views
                            </span>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {resources.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    No resources found. Try adjusting your filters or create a new resource.
                </div>
            )}
        </div>
    );
} 