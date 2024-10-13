import React from 'react';
import StatCard from './StatCard';
import { FaUsers, FaBuilding, FaProjectDiagram, FaExclamationTriangle } from 'react-icons/fa';
import LineChart from './LineChart';
import ProjectOverview from './ProjectOverview';
import EmployeeOverview from './EmployeeOverview';
import GeneralEmployeeOverview from './GeneralEmployeeOverview';
import totalEmployeeIcon from '../assets/icons/total_employees.png';
import totalDepartmentsIcon from '../assets/icons/total_departments.png';
import totalProjectsIcon from '../assets/icons/total_projects.png';
import highWorkloadIcon from '../assets/icons/high_workload.png';

const chartData = [1, 3.5, 2, 3.5, 3.5, 4.5, 3, 2.8, 2.8, 2.5, 3, 3.3];

const Dashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Company Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Employees" 
          value="193" 
          icon={<img src={totalEmployeeIcon} alt="Total Employees" className="w-12 h-12" />} 
          bgColor="bg-orange-100"
        />
        <StatCard 
          title="Total Departments" 
          value="4" 
          icon={<img src={totalDepartmentsIcon} alt="Total Departments" className="w-12 h-12" />} 
          bgColor="bg-yellow-100"
        />
        <StatCard 
          title="Total Projects" 
          value="12" 
          icon={<img src={totalProjectsIcon} alt="Total Projects" className="w-12 h-12" />} 
          bgColor="bg-blue-100"
        />
        <StatCard 
          title="High Mental Workload" 
          value="23" 
          icon={<img src={highWorkloadIcon} alt="High Mental Workload" className="w-12 h-12" />} 
          bgColor="bg-red-100"
        />
      </div>
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Company Employee Mental Workload Overview</h3>
          <div className="flex items-center">
            <span className="text-2xl font-bold mr-2">5.44%</span>
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">+2.4%</span>
          </div>
        </div>
        <LineChart data={chartData} />
      </div>
      <div className="mb-8">
        <ProjectOverview />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Overview</h3>
          <EmployeeOverview />
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">General Employee Overview</h3>
          <GeneralEmployeeOverview />
        </div>
      </div>
      <div className="text-center text-sm text-gray-500 mt-8">
        © 2024 MentalEEG. All Rights Reserved.
      </div>
    </div>
  );
};

export default Dashboard;