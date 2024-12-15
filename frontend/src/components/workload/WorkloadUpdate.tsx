import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { employeeApi } from '@/lib/api/employee';

interface WorkloadData {
    employeeId: string;
    workloadLevel: number;
    timestamp: string;
}

export function WorkloadUpdate() {
    const [isUploading, setIsUploading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleManualUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsUpdating(true);
        const formData = new FormData(event.currentTarget);
        const employeeId = formData.get('employeeId') as string;
        const workloadLevel = Number(formData.get('workloadLevel'));

        if (!employeeId || !workloadLevel || workloadLevel < 1 || workloadLevel > 5) {
            toast({
                title: "Invalid Input",
                description: "Please provide valid employee ID and workload level (1-5)",
                variant: "destructive"
            });
            setIsUpdating(false);
            return;
        }

        try {
            console.log('Submitting workload update:', {
                employeeId,
                workloadLevel,
                timestamp: new Date().toISOString()
            });

            const result = await employeeApi.updateWorkload({
                employeeId,
                workloadLevel,
                timestamp: new Date().toISOString()
            });

            console.log('Update result:', result);

            toast({
                title: "Success",
                description: `Updated workload level to ${workloadLevel} for employee ${employeeId}`,
                variant: "default"
            });
            (event.target as HTMLFormElement).reset();
        } catch (error: any) {
            console.error('Workload update error:', error);
            toast({
                title: "Error",
                description: error.response?.data?.error || "Failed to update workload. Please check the employee ID and try again.",
                variant: "destructive"
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setFile(file);
    };

    const processBatchUpload = async () => {
        if (!file) return;
        setIsUploading(true);

        try {
            const text = await file.text();
            const rows = text.split('\n').filter(row => row.trim());
            const workloadData: WorkloadData[] = [];

            // Skip header row
            for (let i = 1; i < rows.length; i++) {
                const [employeeId, workloadLevel, timestamp] = rows[i].split(',').map(cell => cell.trim());
                if (employeeId && workloadLevel) {
                    workloadData.push({
                        employeeId,
                        workloadLevel: Number(workloadLevel),
                        timestamp: timestamp || new Date().toISOString()
                    });
                }
            }

            console.log('Processing batch upload:', workloadData);

            // Process each workload update
            const results = await Promise.allSettled(
                workloadData.map(data => employeeApi.updateWorkload(data))
            );

            const successful = results.filter(result => result.status === 'fulfilled').length;
            const failed = results.filter(result => result.status === 'rejected').length;

            console.log('Batch upload results:', { successful, failed, results });

            toast({
                title: "Batch Update Complete",
                description: `Successfully updated ${successful} records. ${failed} records failed.`,
                variant: failed > 0 ? "destructive" : "default"
            });

            setFile(null);
            // Reset file input
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } catch (error) {
            console.error('Batch upload error:', error);
            toast({
                title: "Error",
                description: "Failed to process batch upload. Please check the file format and try again.",
                variant: "destructive"
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="border-orange-100">
                <CardHeader className="bg-orange-50 border-b border-orange-100">
                    <CardTitle className='text-orange-500'>Manual Workload Update</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleManualUpdate} className="space-y-4">
                        <div>
                            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                                Employee ID
                            </label>
                            <Input
                                id="employeeId"
                                name="employeeId"
                                type="text"
                                required
                                className="mt-1"
                                disabled={isUpdating}
                            />
                        </div>
                        <div>
                            <label htmlFor="workloadLevel" className="block text-sm font-medium text-gray-700">
                                Workload Level (1-5)
                            </label>
                            <Input
                                id="workloadLevel"
                                name="workloadLevel"
                                type="number"
                                min="1"
                                max="5"
                                required
                                className="mt-1"
                                disabled={isUpdating}
                            />
                        </div>
                        <Button 
                            type="submit" 
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Updating...
                                </div>
                            ) : (
                                'Update Workload'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-orange-100">
                <CardHeader className="bg-orange-50 border-b border-orange-100">
                    <CardTitle>Batch Upload</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Upload CSV File (Format: employeeId,workloadLevel,timestamp)
                            </label>
                            <Input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="mt-1"
                                disabled={isUploading}
                            />
                        </div>
                        <Button
                            onClick={processBatchUpload}
                            disabled={!file || isUploading}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        >
                            {isUploading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Processing...
                                </div>
                            ) : (
                                'Upload and Process'
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 