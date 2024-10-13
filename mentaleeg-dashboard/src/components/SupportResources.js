import React, { useState } from 'react';
import LineChart from './LineChart';

const employeeData = {
  id: 11932,
  name: 'Johanna Saartoala',
  department: 'EISU',
  project: 'SurveyMax',
  workloadLevel: 4,
  previousWorkloadLevel: 1,
  recentSupport: 'Reduced Workload by 25%',
  image: 'https://randomuser.me/api/portraits/women/65.jpg', // Dummy rounded women image
};

const chartData = [1, 2, 3, 3.5, 3, 3.5, 4, 3.5, 3, 2.5, 3, 4];

const SupportResources = () => {
  const [activeTab, setActiveTab] = useState('Support Action History');

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Support Resources</h2>
      
      <div className="flex space-x-2 mb-6">
        {['Support Action History', 'MentalEEG Chatbot'].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full ${
              activeTab === tab
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-3xl font-semibold">{employeeData.name}</h3>
        <div className="space-x-2">
          <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
            Download Report
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Delete Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="col-span-1 flex justify-center items-center">
          <img src={employeeData.image} alt={employeeData.name} className="w-48 h-48 rounded-full object-cover" />
        </div>
        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(employeeData).map(([key, value]) => {
              if (key !== 'image') {
                return (
                  <div key={key} className="mb-4">
                    <p className="text-sm text-gray-500">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-lg font-semibold">
                      {key === 'workloadLevel' || key === 'previousWorkloadLevel' ? (
                        <span className={`px-2 py-1 rounded ${
                          value >= 4 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {value}
                        </span>
                      ) : value}
                    </p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mental Workload Overview</h3>
        <LineChart data={chartData} />
      </div>
    </div>
  );
};

export default SupportResources;