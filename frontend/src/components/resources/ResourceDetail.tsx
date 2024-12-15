'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, FileText, Video, Link as LinkIcon, FileQuestion, Edit, Trash2, ExternalLink, ArrowLeft } from 'lucide-react';
import { Resource, ResourceRating, ResourceType } from '@/types/resource';
import { resourceService } from '@/services/resourceService';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const ResourceTypeIcons: Record<ResourceType, React.ReactNode> = {
    DOCUMENT: <FileText className="w-4 h-4" />,
    VIDEO: <Video className="w-4 h-4" />,
    LINK: <LinkIcon className="w-4 h-4" />,
    ARTICLE: <FileQuestion className="w-4 h-4" />,
};

interface ResourceDetailProps {
    resourceId: number;
}

export default function ResourceDetail({ resourceId }: ResourceDetailProps) {
    const router = useRouter();
    const [resource, setResource] = useState<Resource | null>(null);
    const [ratings, setRatings] = useState<ResourceRating[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showRatingDialog, setShowRatingDialog] = useState(false);
    const [ratingValue, setRatingValue] = useState<number>(0);
    const [ratingComment, setRatingComment] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resourceData, ratingsData] = await Promise.all([
                    resourceService.getResource(resourceId),
                    resourceService.getRatings(resourceId),
                ]);
                setResource(resourceData.data);
                setRatings(ratingsData.data);
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

        fetchData();
    }, [resourceId]);

    const handleDelete = async () => {
        try {
            await resourceService.deleteResource(resourceId);
            toast({
                title: 'Success',
                description: 'Resource deleted successfully',
            });
            router.push('/resources');
        } catch (error) {
            console.error('Error deleting resource:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete resource',
                variant: 'destructive',
            });
        }
    };

    const handleRate = async () => {
        try {
            await resourceService.createRating({
                resource: resourceId,
                rating: ratingValue,
                comment: ratingComment,
            });
            
            // Refresh ratings
            const ratingsData = await resourceService.getRatings(resourceId);
            setRatings(ratingsData.data);
            
            setShowRatingDialog(false);
            setRatingValue(0);
            setRatingComment('');
            
            toast({
                title: 'Success',
                description: 'Rating submitted successfully',
            });
        } catch (error) {
            console.error('Error submitting rating:', error);
            toast({
                title: 'Error',
                description: 'Failed to submit rating',
                variant: 'destructive',
            });
        }
    };

    if (loading || !resource) {
        return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex items-center space-x-4 mb-6">
                <Button 
                    variant="outline" 
                    onClick={() => router.push('/resources')}
                    className="flex items-center"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Resources
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                {ResourceTypeIcons[resource.resource_type]}
                                <Badge variant="secondary">{resource.category_name}</Badge>
                                {resource.is_featured && (
                                    <Badge variant="default" className="bg-yellow-500">
                                        Featured
                                    </Badge>
                                )}
                            </div>
                            <CardTitle>{resource.title}</CardTitle>
                            <CardDescription>
                                By {resource.created_by_name} on{' '}
                                {format(new Date(resource.created_at), 'MMM d, yyyy')}
                            </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => router.push(`/resources/${resourceId}/edit`)}
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="prose max-w-none">
                        <p>{resource.description}</p>
                    </div>

                    {resource.content && (
                        <div className="prose max-w-none">
                            <h3>Content</h3>
                            <div className="whitespace-pre-wrap">{resource.content}</div>
                        </div>
                    )}

                    {resource.external_link && (
                        <Button
                            variant="outline"
                            onClick={() => window.open(resource.external_link, '_blank')}
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open External Link
                        </Button>
                    )}

                    {resource.file && (
                        <Button
                            variant="outline"
                            onClick={() => window.open(resource.file, '_blank')}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Download File
                        </Button>
                    )}

                    <div className="flex flex-wrap gap-2">
                        {resource.tags.split(',').map((tag, index) => (
                            <Badge key={index} variant="outline">
                                {tag.trim()}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>
                                {resource.average_rating?.toFixed(1) || 'No ratings'} ({resource.ratings_count})
                            </span>
                        </div>
                        <Button variant="outline" onClick={() => setShowRatingDialog(true)}>
                            Rate Resource
                        </Button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                        {resource.views_count} views
                    </span>
                </CardFooter>
            </Card>

            {ratings.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Ratings & Reviews</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {ratings.map((rating) => (
                            <div key={rating.id} className="border-b last:border-0 pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-medium">{rating.user_name}</div>
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            <span>{rating.rating}</span>
                                        </div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {format(new Date(rating.created_at), 'MMM d, yyyy')}
                                    </span>
                                </div>
                                {rating.comment && (
                                    <p className="mt-2 text-muted-foreground">{rating.comment}</p>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Resource</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this resource? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rate Resource</DialogTitle>
                        <DialogDescription>
                            Share your thoughts about this resource
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex justify-center space-x-2">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <Button
                                    key={value}
                                    variant={value <= ratingValue ? 'default' : 'outline'}
                                    size="icon"
                                    onClick={() => setRatingValue(value)}
                                >
                                    <Star
                                        className={`w-4 h-4 ${
                                            value <= ratingValue ? 'text-yellow-500' : ''
                                        }`}
                                    />
                                </Button>
                            ))}
                        </div>
                        <Textarea
                            placeholder="Write your review (optional)"
                            value={ratingComment}
                            onChange={(e) => setRatingComment(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRatingDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleRate} disabled={ratingValue === 0}>
                            Submit Rating
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 