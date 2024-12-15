'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGuidelinesStore } from '@/stores/useGuidelinesStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { GuidelineDocument } from '@/lib/api/support';

export default function SettingsPage() {
    const { token } = useAuth();
    const { guidelines, status, error, fetchGuidelines, uploadGuideline, deleteGuideline } = useGuidelinesStore();
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        fetchGuidelines();
    }, [fetchGuidelines]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || selectedLevels.length === 0) {
            toast({
                title: 'Error',
                description: 'Please select a file and workload levels',
                variant: 'destructive',
            });
            return;
        }

        try {
            await uploadGuideline(selectedFile, selectedLevels.map(Number));
            toast({
                title: 'Success',
                description: 'Guideline uploaded successfully',
            });
            setSelectedFile(null);
            setSelectedLevels([]);
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to upload guideline',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteGuideline(id);
            toast({
                title: 'Success',
                description: 'Guideline deleted successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to delete guideline',
                variant: 'destructive',
            });
        }
    };

    if (status === 'loading') {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (error) {
        return (
            <div className="p-4">
                <Card className="bg-destructive/10">
                    <CardContent className="pt-6">
                        <p className="text-destructive">{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const guidelinesList = Array.isArray(guidelines) ? guidelines : [];

    return (
        <div className="p-4 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Guidelines Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                                className="mb-2"
                            />
                            <div className="flex gap-2 flex-wrap">
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <Button
                                        key={level}
                                        type="button"
                                        variant={selectedLevels.includes(level.toString()) ? 'default' : 'outline'}
                                        onClick={() => {
                                            setSelectedLevels((prev) =>
                                                prev.includes(level.toString())
                                                    ? prev.filter((l) => l !== level.toString())
                                                    : [...prev, level.toString()]
                                            );
                                        }}
                                    >
                                        Level {level.toString()}
                                    </Button>
                                ))}
                            </div>
                            <Button
                                type="button"
                                onClick={handleUpload}
                                disabled={!selectedFile || selectedLevels.length === 0 || status === 'loading'}
                                className="mt-2"
                            >
                                Upload Guideline
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {guidelinesList.map((guideline: GuidelineDocument) => (
                                <Card key={guideline.id}>
                                    <CardContent className="flex justify-between items-center p-4">
                                        <div>
                                            <h3 className="font-medium">{guideline.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Workload Levels: {guideline.workloadLevels.join(', ')}
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => handleDelete(guideline.id)}
                                            disabled={status === 'loading'}
                                        >
                                            Delete
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 