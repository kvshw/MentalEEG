import React, { useState } from 'react';
import StatCard from './StatCard';
import LineChart from './LineChart';
import totalEmployeeIcon from '../assets/icons/total_employees.png';
import totalDepartmentsIcon from '../assets/icons/total_departments.png';
import totalProjectsIcon from '../assets/icons/total_projects.png';
import highWorkloadIcon from '../assets/icons/high_workload.png';

const departments = ['EISU', 'IBU', 'PMO', 'QSO'];

const departmentData = {
  EISU: {
    totalEmployees: 47,
    employeesHighWorkload: 38,
    totalProjects: 4,
    employeesLowWorkload: 9,
    chartData: [1, 3.5, 2, 3.5, 3.5, 4.5, 3, 2.8, 2.8, 2.5, 3, 3.3],
    averageWorkload: 3.44,
    workloadChange: 0.6,
  },
  IBU: {
    totalEmployees: 52,
    employeesHighWorkload: 41,
    totalProjects: 5,
    employeesLowWorkload: 11,
    chartData: [1.5, 3, 2.5, 3, 4, 4.2, 3.5, 3, 2.5, 3, 3.5, 3.8],
    averageWorkload: 3.62,
    workloadChange: 0.8,
  },
  PMO: {
    totalEmployees: 23,
    employeesHighWorkload: 18,
    totalProjects: 8,
    employeesLowWorkload: 5,
    chartData: [2, 2.5, 3, 3.5, 4, 3.5, 3, 3.5, 4, 3.5, 3, 3.5],
    averageWorkload: 3.29,
    workloadChange: -0.2,
  },
  QSO: {
    totalEmployees: 31,
    employeesHighWorkload: 24,
    totalProjects: 3,
    employeesLowWorkload: 7,
    chartData: [1.5, 2, 3, 3.5, 3, 3.5, 4, 3.5, 3, 2.5, 3, 3.5],
    averageWorkload: 3.17,
    workloadChange: 0.3,
  },
};

const DepartmentOverview = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('EISU');
  const [searchTerm, setSearchTerm] = useState('');

  const data = departmentData[selectedDepartment];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Department Overview</h2>
      
      <div className="flex space-x-2 mb-6">
        {departments.map(dept => (
          <button
            key={dept}
            className={`px-4 py-2 rounded-full ${
              selectedDepartment === dept
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setSelectedDepartment(dept)}
          >
            {dept}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Employees" value={data.totalEmployees} icon={<img src={totalEmployeeIcon} alt="Total Employees" className="w-12 h-12" />}   />
        <StatCard title="Employees 3+ Workload" value={data.employeesHighWorkload} icon={<img src={totalDepartmentsIcon} alt="Total Departments" className="w-12 h-12" />}  />
        <StatCard title="Total Projects" value={data.totalProjects} icon={<img src={totalProjectsIcon} alt="Total Projects" className="w-12 h-12" />}  />
        <StatCard title="Employees 3- Workload" value={data.employeesLowWorkload} icon={<img src={highWorkloadIcon} alt="High Mental Workload" className="w-12 h-12" />}  />
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedDepartment} Department Employee Mental Workload Overview
          </h3>
          <div className="flex items-center">
            <span className="text-2xl font-bold mr-2">{data.averageWorkload.toFixed(2)}</span>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${
              data.workloadChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {data.workloadChange >= 0 ? '+' : ''}{data.workloadChange.toFixed(1)}%
            </span>
          </div>
        </div>
        <LineChart data={data.chartData} />
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-5 h-5 text-gray-500 absolute left-3 top-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <div className="flex space-x-2">
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
            Add to Project
          </button>
          <select className="border rounded-lg px-4 py-2">
            <option>4+</option>
            <option>3+</option>
            <option>2+</option>
            <option>1+</option>
          </select>
        </div>
      </div>

      {/* Add employee table here */}
    </div>
  );
};

export default DepartmentOverview;