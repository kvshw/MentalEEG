import React from 'react';

const ProjectOverview = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Project overview</h3>
        <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
          + Add Project
        </button>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Total Projects</p>
          <p className="text-2xl font-semibold">12</p>
        </div>
        <div className="h-8 w-px bg-gray-300 mx-4"></div>
        <div>
          <p className="text-sm text-gray-500">Assigned Employees</p>
          <p className="text-2xl font-semibold">178</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;