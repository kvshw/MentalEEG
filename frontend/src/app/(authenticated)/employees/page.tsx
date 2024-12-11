'use client';

import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import AddToProjectModal from '@/components/employees/AddToProjectModal';

// Mock data - replace with API call later
const mockEmployees = [
  {
    id: '11932',
    name: 'Johanna Saartaala',
    role: 'Software Developer',
    department: 'IBU',
    project: 'SurveyMax',
    workloadLevel: 4,
  },
  {
    id: '11945',
    name: 'Aino Virtanen',
    role: 'Software Developer',
    department: 'IBU',
    project: '-',
    workloadLevel: 3,
  },
  {
    id: '11953',
    name: 'Elias Laine',
    role: 'Senior Software Developer',
    department: 'EISU',
    project: '-',
    workloadLevel: 4,
  },
  {
    id: '11852',
    name: 'Helmi Korhonen',
    role: 'Software Developer',
    department: 'EISU',
    project: 'SurveyMax',
    workloadLevel: 4,
  },
  {
    id: '11634',
    name: 'Onni Salo',
    role: 'Project Manager',
    department: 'PMO',
    project: '-',
    workloadLevel: 5,
  },
];

const WorkloadLevel: React.FC<{ level: number }> = ({ level }) => {
  const getWorkloadColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-red-100 text-red-800';
      case 2:
        return 'bg-orange-100 text-orange-800';
      case 3:
        return 'bg-yellow-100 text-yellow-800';
      case 4:
        return 'bg-green-100 text-green-800';
      case 5:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getWorkloadColor(level)}`}>
      Level {level}
    </span>
  );
};

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredEmployees = mockEmployees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.id.includes(searchQuery) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleAddToProject = () => {
    setIsModalOpen(true);
  };

  const handleCreateProject = (projectName: string) => {
    // TODO: Implement project creation with API
    console.log('Creating project:', projectName, 'with employees:', selectedEmployees);
    setSelectedEmployees([]);
  };

  const selectedEmployeeDetails = mockEmployees.filter(emp => selectedEmployees.includes(emp.id));

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Employee Well-being</h1>
        <button
          onClick={handleAddToProject}
          disabled={selectedEmployees.length === 0}
          className={`px-4 py-2 rounded-md text-white ${
            selectedEmployees.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-orange-500 hover:bg-orange-600'
          }`}
        >
          Add to Project
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name, ID, or department..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Employee Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  checked={selectedEmployees.length === filteredEmployees.length}
                  onChange={() => {
                    if (selectedEmployees.length === filteredEmployees.length) {
                      setSelectedEmployees([]);
                    } else {
                      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
                    }
                  }}
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Workload Level
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={() => handleSelectEmployee(employee.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.role}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.project}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <WorkloadLevel level={employee.workloadLevel} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddToProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedEmployees={selectedEmployeeDetails}
        onSubmit={handleCreateProject}
      />
    </div>
  );
} 