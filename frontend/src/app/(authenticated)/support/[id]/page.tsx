'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supportApi } from '@/lib/api/support';
import { employeeApi } from '@/lib/api/employee';
import { useEmployeeStore } from '@/lib/stores/employee';

interface SupportAction {
    immediate_action: string;
    long_term_strategy: string;
    resources: string[];
    priority_level: string;
    created_at: string;
    current_workload_level: number;
    previous_workload_level: number;
}

interface EmployeeWithSupport extends Employee {
    supportHistory: SupportAction[];
}

export default function EmployeeProfilePage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [employee, setEmployee] = useState<EmployeeWithSupport | null>(null);

    const fetchSupportHistory = async (employeeId: string) => {
        try {
            const history = await supportApi.generateSupportAction({
                employeeId,
                method: 'GET'
            });
            return history;
        } catch (err) {
            console.error('Failed to fetch support history:', err);
            return [];
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const [employeeData, supportHistory] = await Promise.all([
                    employeeApi.getEmployee(params.id),
                    fetchSupportHistory(params.id)
                ]);
                
                setEmployee({
                    ...employeeData,
                    supportHistory
                });
            } catch (err) {
                setError('Failed to fetch employee data');
                toast({
                    title: "Error",
                    description: "Failed to fetch employee data. Please try again.",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    const getWorkloadBadge = (level: number) => {
        const getBadgeColor = (level: number) => {
            if (level <= 2) return 'bg-red-500 hover:bg-red-600';
            if (level === 3) return 'bg-yellow-500 hover:bg-yellow-600';
            return 'bg-emerald-500 hover:bg-emerald-600';
        };

        return (
            <Badge className={`${getBadgeColor(level)} text-white`}>
                Level {level}
            </Badge>
        );
    };

    const handleGenerateSupportAction = async () => {
        if (!employee) return;
        
        setIsGenerating(true);
        try {
            const response = await supportApi.generateSupportAction({
                employeeId: employee.id,
                currentWorkloadLevel: employee.currentWorkloadLevel,
                previousWorkloadLevel: employee.previousWorkloadLevel,
                isCurrentPositive: employee.currentWorkloadLevel >= 3,
                isPreviousPositive: employee.previousWorkloadLevel >= 3
            });
            
            // Add the recommendation to support history with proper structure
            const newAction: SupportAction = {
                immediate_action: response.immediate_action,
                long_term_strategy: response.long_term_strategy,
                resources: response.resources || [],
                priority_level: response.priority_level,
                created_at: new Date().toISOString(),
                current_workload_level: employee.currentWorkloadLevel,
                previous_workload_level: employee.previousWorkloadLevel
            };
            
            setEmployee(prev => prev ? {
                ...prev,
                supportHistory: [newAction, ...prev.supportHistory]
            } : null);

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
                duration: 10000,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to generate support action. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Invalid date';
            }
            return format(date, 'dd.MM.yyyy HH:mm');
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 flex justify-center items-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !employee) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center py-8 text-red-500">
                    {error || 'Employee not found'}. Please try again.
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.back()}
                        className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
                </div>
                <Button
                    onClick={handleGenerateSupportAction}
                    disabled={isGenerating}
                    className={cn(
                        "relative",
                        employee.currentWorkloadLevel <= 2 
                            ? "bg-red-500 hover:bg-red-600 text-white" 
                            : employee.currentWorkloadLevel === 3
                                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                : "bg-emerald-500 hover:bg-emerald-600 text-white"
                    )}
                >
                    {isGenerating ? (
                        <>
                            <span className="opacity-0">Generate Support Action</span>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                        </>
                    ) : (
                        <>
                            Generate Support Action
                            {employee.currentWorkloadLevel <= 2 && (
                                <Badge variant="destructive" className="ml-2 bg-red-600">
                                    High Priority
                                </Badge>
                            )}
                        </>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-orange-100 shadow-sm">
                    <CardHeader className="bg-orange-50 border-b border-orange-100">
                        <CardTitle className="text-gray-900">Employee Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Employee ID</p>
                                <p className="font-medium text-gray-900">{employee.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Department</p>
                                <p className="font-medium text-gray-900">{employee.department}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Current Project</p>
                                <p className="font-medium text-gray-900">{employee.currentProject || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium text-gray-900">{employee.email}</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500">Current Workload Level</p>
                                    {getWorkloadBadge(employee.currentWorkloadLevel)}
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500">Previous Workload Level</p>
                                    {getWorkloadBadge(employee.previousWorkloadLevel)}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-orange-100 shadow-sm">
                    <CardHeader className="bg-orange-50 border-b border-orange-100">
                        <CardTitle className="text-gray-900">Support History</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="text-gray-600">Date</TableHead>
                                    <TableHead className="text-gray-600">Immediate Action</TableHead>
                                    <TableHead className="text-gray-600">Workload Level</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!employee.supportHistory?.length ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-gray-500">
                                            No support actions recorded yet
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    employee.supportHistory.map((action, index) => (
                                        <TableRow 
                                            key={index}
                                            className="hover:bg-orange-50 transition-colors cursor-pointer"
                                            onClick={() => {
                                                toast({
                                                    title: "Support Action Details",
                                                    description: (
                                                        <div className="space-y-2">
                                                            <div>
                                                                <p className="font-semibold">Immediate Action:</p>
                                                                <p className="text-sm">{action.immediate_action}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold">Long-term Strategy:</p>
                                                                <p className="text-sm">{action.long_term_strategy}</p>
                                                            </div>
                                                            {action.resources?.length > 0 && (
                                                                <div>
                                                                    <p className="font-semibold">Resources:</p>
                                                                    <ul className="text-sm list-disc list-inside">
                                                                        {action.resources.map((resource, idx) => (
                                                                            <li key={idx}>{resource}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center space-x-2">
                                                                <p className="font-semibold">Workload Levels:</p>
                                                                <span className="text-sm">
                                                                    {action.current_workload_level} → {action.previous_workload_level}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ),
                                                    duration: 10000,
                                                });
                                            }}
                                        >
                                            <TableCell className="text-gray-900">
                                                {formatDate(action.created_at)}
                                            </TableCell>
                                            <TableCell className="text-gray-900">{action.immediate_action}</TableCell>
                                            <TableCell>
                                                {getWorkloadBadge(action.current_workload_level)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 