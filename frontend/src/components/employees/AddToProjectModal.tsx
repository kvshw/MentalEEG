'use client';

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  workloadLevel: number;
}

interface AddToProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployees: Employee[];
  onSubmit: (projectName: string) => void;
}

export default function AddToProjectModal({
  isOpen,
  onClose,
  selectedEmployees,
  onSubmit,
}: AddToProjectModalProps) {
  const [projectName, setProjectName] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that all employees have workload level >= 3
    const hasLowWorkload = selectedEmployees.some(emp => emp.workloadLevel < 3);
    if (hasLowWorkload) {
      setError('Cannot add employees with workload level below 3 to a project');
      return;
    }

    if (!projectName.trim()) {
      setError('Project name is required');
      return;
    }

    onSubmit(projectName);
    setProjectName('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Create a New Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="project-name" className="block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              id="project-name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Team Members</h3>
            <div className="bg-gray-50 rounded-md p-4 space-y-2">
              {selectedEmployees.map((employee) => (
                <div key={employee.id} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium text-gray-900">{employee.name}</span>
                    <span className="text-gray-500"> - {employee.role}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    employee.workloadLevel < 3 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    Level {employee.workloadLevel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 