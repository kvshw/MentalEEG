'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data - replace with actual API data later
const mockData = {
  totalEmployees: 193,
  totalDepartments: 4,
  totalProjects: 12,
  highWorkload: 23,
  workloadHistory: [
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

const DashboardPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Company Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={mockData.totalEmployees}
          icon="👥"
          className="bg-blue-50"
        />
        <StatCard
          title="Total Departments"
          value={mockData.totalDepartments}
          icon="🏢"
          className="bg-green-50"
        />
        <StatCard
          title="Total Projects"
          value={mockData.totalProjects}
          icon="📊"
          className="bg-purple-50"
        />
        <StatCard
          title="High Mental Workload"
          value={mockData.highWorkload}
          icon="⚠️"
          className="bg-red-50"
        />
      </div>

      {/* Workload Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Company Employee Mental Workload Overview
        </h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData.workloadHistory}>
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

      {/* Project Overview */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Project Overview</h2>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
            Add Project
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Add project rows here */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 