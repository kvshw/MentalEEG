'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Resource, ResourceCategory } from '@/types/resource';
import { resourceService } from '@/services/resourceService';
import { toast } from '@/components/ui/use-toast';

const resourceSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    category: z.string().min(1, 'Category is required'),
    resource_type: z.enum(['DOCUMENT', 'VIDEO', 'LINK', 'ARTICLE']),
    access_level: z.enum(['ALL', 'MANAGER', 'HR', 'ADMIN']),
    file: z.any().optional(),
    external_link: z.string().url().optional().or(z.literal('')),
    content: z.string().optional(),
    tags: z.string(),
    is_featured: z.boolean(),
    is_published: z.boolean(),
});

type ResourceFormValues = z.infer<typeof resourceSchema>;

interface ResourceFormProps {
    initialData?: Resource;
}

const RESOURCE_TYPES = [
    { value: 'DOCUMENT', label: 'Document' },
    { value: 'VIDEO', label: 'Video' },
    { value: 'LINK', label: 'External Link' },
    { value: 'ARTICLE', label: 'Article' },
];

const ACCESS_LEVELS = [
    { value: 'ALL', label: 'All Employees' },
    { value: 'MANAGER', label: 'Managers Only' },
    { value: 'HR', label: 'HR Only' },
    { value: 'ADMIN', label: 'Administrators Only' },
];

export default function ResourceForm({ initialData }: ResourceFormProps) {
    const router = useRouter();
    const [categories, setCategories] = useState<ResourceCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const form = useForm<ResourceFormValues>({
        resolver: zodResolver(resourceSchema),
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            category: initialData?.category.toString() || '',
            resource_type: initialData?.resource_type || 'DOCUMENT',
            access_level: initialData?.access_level || 'ALL',
            external_link: initialData?.external_link || '',
            content: initialData?.content || '',
            tags: initialData?.tags || '',
            is_featured: initialData?.is_featured || false,
            is_published: initialData?.is_published || true,
        },
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                console.log('Fetching categories...');
                const response = await resourceService.getCategories();
                console.log('Categories response:', response);
                if (Array.isArray(response.data)) {
                    setCategories(response.data);
                } else if (response.data && Array.isArray(response.data.results)) {
                    setCategories(response.data.results);
                } else {
                    throw new Error('Invalid response format from categories endpoint');
                }
            } catch (error: any) {
                console.error('Error fetching categories:', error);
                console.error('Error details:', {
                    message: error.message,
                    response: error.response,
                    status: error.response?.status,
                    data: error.response?.data,
                });
                toast({
                    title: 'Error',
                    description: error.message || 'Failed to load categories',
                    variant: 'destructive',
                });
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const onSubmit = async (values: ResourceFormValues) => {
        try {
            setLoading(true);
            const formData = new FormData();

            // Append all form fields to FormData
            Object.entries(values).forEach(([key, value]) => {
                if (key === 'file') {
                    if (value && value[0]) {
                        formData.append('file', value[0]);
                    }
                } else if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });

            if (initialData) {
                await resourceService.updateResource(initialData.id, formData);
                toast({
                    title: 'Success',
                    description: 'Resource updated successfully',
                });
            } else {
                await resourceService.createResource(formData);
                toast({
                    title: 'Success',
                    description: 'Resource created successfully',
                });
            }

            router.push('/resources');
            router.refresh();
        } catch (error) {
            console.error('Error saving resource:', error);
            toast({
                title: 'Error',
                description: 'Failed to save resource',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{initialData ? 'Edit Resource' : 'Create Resource'}</CardTitle>
                <CardDescription>
                    {initialData
                        ? 'Update the details of an existing resource'
                        : 'Add a new resource to the library'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={loadingCategories}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={loadingCategories ? "Loading..." : "Select a category"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.length > 0 ? (
                                                    categories.map((category) => (
                                                        category.id && (
                                                            <SelectItem
                                                                key={category.id}
                                                                value={category.id.toString()}
                                                            >
                                                                {category.name}
                                                            </SelectItem>
                                                        )
                                                    ))
                                                ) : (
                                                    <SelectItem value="no-categories" disabled>
                                                        {loadingCategories ? "Loading categories..." : "No categories available"}
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="resource_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {RESOURCE_TYPES.map(({ value, label }) => (
                                                    <SelectItem key={value} value={value}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="access_level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Access Level</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select access level" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {ACCESS_LEVELS.map(({ value, label }) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="external_link"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>External Link</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="url" placeholder="https://" />
                                    </FormControl>
                                    <FormDescription>
                                        Optional: Add a link to external content
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Optional: Add text content for articles
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter comma-separated tags" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex space-x-4">
                            <FormField
                                control={form.control}
                                name="is_featured"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Featured Resource
                                            </FormLabel>
                                            <FormDescription>
                                                Display this resource prominently
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="is_published"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Published
                                            </FormLabel>
                                            <FormDescription>
                                                Make this resource visible to users
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
} 