'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { supportApi, SupportActionResponse } from '@/lib/api/support';
import { Employee } from '@/lib/api/employee';

interface SupportRecommendationProps {
    employee: Employee;
    onSubmit?: (action: string) => void;
    onCancel?: () => void;
}

export default function SupportRecommendation({ 
    employee, 
    onSubmit,
    onCancel 
}: SupportRecommendationProps) {
    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] = useState<SupportActionResponse | null>(null);

    const handleGenerateAction = async () => {
        try {
            setLoading(true);
            const response = await supportApi.generateSupportAction({
                employeeId: employee.id,
                currentWorkloadLevel: employee.currentWorkloadLevel,
                previousWorkloadLevel: employee.previousWorkloadLevel,
                isCurrentPositive: employee.currentWorkloadLevel >= 3,
                isPreviousPositive: employee.previousWorkloadLevel >= 3
            });
            setRecommendation(response);

            // Show detailed recommendation in toast
            toast({
                title: "Support Action Generated",
                description: (
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Badge variant={response.priority_level === 'high' ? 'destructive' : 
                                         response.priority_level === 'medium' ? 'default' : 
                                         'outline'}>
                                {response.priority_level.toUpperCase()} Priority
                            </Badge>
                        </div>
                        <div>
                            <p className="font-semibold">Immediate Action:</p>
                            <p className="text-sm">{response.immediate_action}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Long-term Strategy:</p>
                            <p className="text-sm">{response.long_term_strategy}</p>
                        </div>
                        {response.resources && response.resources.length > 0 && (
                            <div>
                                <p className="font-semibold">Recommended Resources:</p>
                                <ul className="text-sm list-disc list-inside">
                                    {response.resources.map((resource: string, index: number) => (
                                        <li key={index}>{resource}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ),
                duration: 10000, // Show for 10 seconds due to more content
            });
        } catch (error) {
            console.error('Error generating support action:', error);
            toast({
                title: 'Error',
                description: 'Failed to generate support action',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (recommendation && onSubmit) {
            onSubmit(recommendation.immediate_action);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Generate Support Action</h3>
                    <p className="text-sm text-gray-500">
                        Generate a personalized support action based on the employee's current and previous workload levels.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-700">Current Workload Level</div>
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-900">{employee.currentWorkloadLevel}</span>
                                <Badge 
                                    variant={employee.currentWorkloadLevel >= 3 ? "default" : "destructive"}
                                    className={employee.currentWorkloadLevel >= 3 ? "bg-orange-500 hover:bg-orange-600" : ""}
                                >
                                    {employee.currentWorkloadLevel >= 3 ? "Positive" : "Negative"}
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-700">Previous Workload Level</div>
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-900">{employee.previousWorkloadLevel}</span>
                                <Badge 
                                    variant={employee.previousWorkloadLevel >= 3 ? "default" : "destructive"}
                                    className={employee.previousWorkloadLevel >= 3 ? "bg-orange-500 hover:bg-orange-600" : ""}
                                >
                                    {employee.previousWorkloadLevel >= 3 ? "Positive" : "Negative"}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {recommendation ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-gray-900">Recommended Action</h4>
                                    <Badge variant={recommendation.priority_level === 'high' ? 'destructive' : 
                                                  recommendation.priority_level === 'medium' ? 'default' : 
                                                  'outline'}>
                                        {recommendation.priority_level.toUpperCase()} Priority
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-700">{recommendation.immediate_action}</p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-gray-900">Long-term Strategy</h4>
                                <p className="text-sm text-gray-700">{recommendation.long_term_strategy}</p>
                            </div>

                            {recommendation.resources && recommendation.resources.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-900">Recommended Resources</h4>
                                    <ul className="text-sm text-gray-700 list-disc list-inside">
                                        {recommendation.resources.map((resource, index) => (
                                            <li key={index}>{resource}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={onCancel}>
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleSubmit}
                                    className="bg-orange-500 hover:bg-orange-600 text-white"
                                >
                                    Save Recommendation
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button 
                            onClick={handleGenerateAction} 
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                            disabled={loading}
                        >
                            {loading ? "Generating..." : "Generate Support Action"}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 