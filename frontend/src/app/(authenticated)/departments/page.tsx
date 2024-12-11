'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data - replace with API call later
const mockDepartments = [
  { id: 'EISU', name: 'EISU', totalEmployees: 47, highWorkload: 9, activeProjects: 4 },
  { id: 'IBU', name: 'IBU', totalEmployees: 38, highWorkload: 7, activeProjects: 3 },
  { id: 'PMO', name: 'PMO', totalEmployees: 15, highWorkload: 4, activeProjects: 8 },
  { id: 'QSG', name: 'QSG', totalEmployees: 25, highWorkload: 3, activeProjects: 2 },
];

const mockWorkloadHistory = {
  EISU: [
    { month: 'Jan', workload: 1 },
    { month: 'Feb', workload: 3 },
    { month: 'Mar', workload: 2 },
    { month: 'Apr', workload: 3 },
    { month: 'May', workload: 3 },
    { month: 'Jun', workload: 4 },
    { month: 'Jul', workload: 2.5 },
    { month: 'Aug', workload: 2.8 },
    { month: 'Sep', workload: 2.5 },
    { month: 'Oct', workload: 3 },
    { month: 'Nov', workload: 2.8 },
    { month: 'Dec', workload: 3 },
  ],
  IBU: [...Array(12)].map((_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    workload: 2 + Math.random() * 2,
  })),
  PMO: [...Array(12)].map((_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    workload: 2 + Math.random() * 2,
  })),
  QSG: [...Array(12)].map((_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    workload: 2 + Math.random() * 2,
  })),
};

const mockDepartmentEmployees = {
  EISU: [
    {
      id: '11953',
      name: 'Elias Laine',
      role: 'Senior Software Developer',
      project: '-',
      workloadLevel: 4,
      status: 'Available',
    },
    {
      id: '11852',
      name: 'Helmi Korhonen',
      role: 'Software Developer',
      project: 'SurveyMax',
      workloadLevel: 4,
      status: 'Active',
    },
    {
      id: '11855',
      name: 'Karttu Mäkinen',
      role: 'Quality Assurance',
      project: '-',
      workloadLevel: 4,
      status: 'Available',
    },
  ],
  IBU: [
    {
      id: '11932',
      name: 'Johanna Saartaala',
      role: 'Software Developer',
      project: 'SurveyMax',
      workloadLevel: 4,
      status: 'Active',
    },
    {
      id: '11945',
      name: 'Aino Virtanen',
      role: 'Software Developer',
      project: '-',
      workloadLevel: 3,
      status: 'Available',
    },
  ],
  PMO: [
    {
      id: '11634',
      name: 'Onni Salo',
      role: 'Project Manager',
      project: '-',
      workloadLevel: 5,
      status: 'Available',
    },
  ],
  QSG: [],
};

const mockDepartmentProjects = {
  EISU: [
    {
      id: 'EISU-001',
      name: 'SurveyMax',
      teamSize: 4,
      averageWorkload: 3.8,
      status: 'In Progress',
    },
    {
      id: 'EISU-002',
      name: 'DataSync Pro',
      teamSize: 3,
      averageWorkload: 3.2,
      status: 'Planning',
    },
  ],
  IBU: [
    {
      id: 'IBU-001',
      name: 'ClientHub',
      teamSize: 5,
      averageWorkload: 3.5,
      status: 'In Progress',
    },
  ],
  PMO: [
    {
      id: 'PMO-001',
      name: 'Process Optimization',
      teamSize: 3,
      averageWorkload: 4.0,
      status: 'In Progress',
    },
  ],
  QSG: [],
};

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, className = '' }) => {
  return (
    <div className={`p-6 rounded-lg shadow ${className}`}>
      <div className="flex items-center">
        <div className="text-2xl mr-4">{icon}</div>
        <div>
          <div className="text-sm font-medium text-gray-600">{title}</div>
          <div className="text-2xl font-semibold text-gray-900">{value}</div>
        </div>
      </div>
    </div>
  );
};

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

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'available':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

export default function DepartmentsPage() {
  const [selectedDepartment, setSelectedDepartment] = useState(mockDepartments[0].id);
  const currentDepartment = mockDepartments.find(dept => dept.id === selectedDepartment)!;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Department Overview</h1>
        <div className="flex space-x-2">
          {mockDepartments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDepartment(dept.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedDepartment === dept.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {dept.name}
            </button>
          ))}
        </div>
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={currentDepartment.totalEmployees}
          icon="👥"
          className="bg-blue-50"
        />
        <StatCard
          title="Employees 3+ Workload"
          value={38}
          icon="📈"
          className="bg-green-50"
        />
        <StatCard
          title="Total Projects"
          value={currentDepartment.activeProjects}
          icon="📊"
          className="bg-purple-50"
        />
        <StatCard
          title="Employees 3- Workload"
          value={9}
          icon="⚠️"
          className="bg-red-50"
        />
      </div>

      {/* Workload Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {currentDepartment.name} Department Employee Mental Workload Overview
        </h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockWorkloadHistory[selectedDepartment as keyof typeof mockWorkloadHistory]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="workload"
                stroke="#FF8A00"
                strokeWidth={2}
                dot={{ fill: '#FF8A00' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Employees Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Department Employees</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Project
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Workload Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockDepartmentEmployees[selectedDepartment as keyof typeof mockDepartmentEmployees].map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.project}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <WorkloadLevel level={employee.workloadLevel} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={employee.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Projects */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Active Projects</h2>
          <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
            Add Project
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Size
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average Workload
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockDepartmentProjects[selectedDepartment as keyof typeof mockDepartmentProjects].map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.name}</div>
                    <div className="text-sm text-gray-500">{project.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.teamSize} members
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <WorkloadLevel level={Math.round(project.averageWorkload)} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={project.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 