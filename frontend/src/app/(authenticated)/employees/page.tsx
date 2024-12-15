'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useEmployeeStore } from '@/lib/stores/employee';
import { Employee, CreateEmployeeDto } from '@/lib/api/employee';

export default function EmployeesPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Employee>>({});

    const { 
        employees, 
        isLoading, 
        error,
        selectedEmployee,
        fetchEmployees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        setSelectedEmployee
    } = useEmployeeStore();

    useEffect(() => {
        fetchEmployees().catch(error => {
            console.error('Error fetching employees:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch employees',
                variant: 'destructive',
            });
        });
    }, [fetchEmployees]);

    const handleAddEmployee = async () => {
        try {
            await addEmployee(editForm as CreateEmployeeDto);
            setIsAddDialogOpen(false);
            setEditForm({});
            toast({
                title: 'Success',
                description: 'Employee added successfully',
            });
        } catch (error) {
            console.error('Error adding employee:', error);
            toast({
                title: 'Error',
                description: 'Failed to add employee',
                variant: 'destructive',
            });
        }
    };

    const handleEditEmployee = async () => {
        if (!selectedEmployee) return;
        
        try {
            await updateEmployee(selectedEmployee.id, editForm);
            setIsEditDialogOpen(false);
            setSelectedEmployee(null);
            setEditForm({});
            toast({
                title: 'Success',
                description: 'Employee updated successfully',
            });
        } catch (error) {
            console.error('Error updating employee:', error);
            toast({
                title: 'Error',
                description: 'Failed to update employee',
                variant: 'destructive',
            });
        }
    };

    const handleDeleteEmployee = async () => {
        if (!selectedEmployee) return;
        
        try {
            await deleteEmployee(selectedEmployee.id);
            setIsDeleteDialogOpen(false);
            setSelectedEmployee(null);
            toast({
                title: 'Success',
                description: 'Employee deleted successfully',
            });
        } catch (error) {
            console.error('Error deleting employee:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete employee',
                variant: 'destructive',
            });
        }
    };

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

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center py-8 text-red-500">
                    {error}. Please try refreshing the page.
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search employees..."
                            className="pl-8 bg-white text-gray-900 border-gray-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button 
                        onClick={() => {
                            setEditForm({});
                            setIsAddDialogOpen(true);
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Employee
                    </Button>
                </div>
            </div>

            <Card className="border-orange-100 shadow-sm">
                <CardHeader className="bg-orange-50 border-b border-orange-100">
                    <CardTitle className="text-gray-900">Employees Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex justify-center items-center p-8">
                            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : employees.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No employees found. Add one to get started.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="text-gray-600">Employee ID</TableHead>
                                    <TableHead className="text-gray-600">Name</TableHead>
                                    <TableHead className="text-gray-600">Email</TableHead>
                                    <TableHead className="text-gray-600">Department</TableHead>
                                    <TableHead className="text-gray-600">Current Project</TableHead>
                                    <TableHead className="text-gray-600">Current Workload</TableHead>
                                    <TableHead className="text-gray-600">Previous Workload</TableHead>
                                    <TableHead className="text-right text-gray-600">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEmployees.map((employee) => (
                                    <TableRow 
                                        key={employee.id}
                                        className="hover:bg-orange-50 transition-colors"
                                    >
                                        <TableCell className="font-medium text-gray-900">{employee.id}</TableCell>
                                        <TableCell className="text-gray-900">{employee.name}</TableCell>
                                        <TableCell className="text-gray-900">{employee.email}</TableCell>
                                        <TableCell className="text-gray-900">{employee.department}</TableCell>
                                        <TableCell className="text-gray-900">{employee.currentProject || 'N/A'}</TableCell>
                                        <TableCell>{getWorkloadBadge(employee.currentWorkloadLevel)}</TableCell>
                                        <TableCell>{getWorkloadBadge(employee.previousWorkloadLevel)}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedEmployee(employee);
                                                    setEditForm(employee);
                                                    setIsEditDialogOpen(true);
                                                }}
                                                className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedEmployee(employee);
                                                    setIsDeleteDialogOpen(true);
                                                }}
                                                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => router.push(`/support/${employee.id}`)}
                                                className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Add Employee Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Employee</DialogTitle>
                        <DialogDescription>
                            Enter the details of the new employee below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Name</label>
                                <Input
                                    value={editForm.name || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <Input
                                    value={editForm.email || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Department</label>
                                <Input
                                    value={editForm.department || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Current Project</label>
                                <Input
                                    value={editForm.currentProject || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, currentProject: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Current Workload Level (1-5)</label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={5}
                                    value={editForm.currentWorkloadLevel || ''}
                                    onChange={(e) => setEditForm(prev => ({ 
                                        ...prev, 
                                        currentWorkloadLevel: parseInt(e.target.value) 
                                    }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Previous Workload Level (1-5)</label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={5}
                                    value={editForm.previousWorkloadLevel || ''}
                                    onChange={(e) => setEditForm(prev => ({ 
                                        ...prev, 
                                        previousWorkloadLevel: parseInt(e.target.value) 
                                    }))}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddEmployee} className="bg-orange-500 hover:bg-orange-600 text-white">
                            Add Employee
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Employee Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Employee</DialogTitle>
                        <DialogDescription>
                            Update the employee's information below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Name</label>
                                <Input
                                    value={editForm.name || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <Input
                                    value={editForm.email || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Department</label>
                                <Input
                                    value={editForm.department || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Current Project</label>
                                <Input
                                    value={editForm.currentProject || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, currentProject: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Current Workload Level (1-5)</label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={5}
                                    value={editForm.currentWorkloadLevel || ''}
                                    onChange={(e) => setEditForm(prev => ({ 
                                        ...prev, 
                                        currentWorkloadLevel: parseInt(e.target.value) 
                                    }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Previous Workload Level (1-5)</label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={5}
                                    value={editForm.previousWorkloadLevel || ''}
                                    onChange={(e) => setEditForm(prev => ({ 
                                        ...prev, 
                                        previousWorkloadLevel: parseInt(e.target.value) 
                                    }))}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditEmployee} className="bg-orange-500 hover:bg-orange-600 text-white">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Employee</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedEmployee?.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleDeleteEmployee}
                            variant="destructive"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 