import React from 'react';

const StatCard = ({ title, value, icon, bgColor }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg p-5">
      <div className="flex flex-col">
        <div className="flex items-center mb-3">
          <div className={` rounded-lg ${bgColor} mr-3 flex items-center justify-center w-12 h-12`}>
            {icon}
          </div>
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        </div>
        <div className="bg-gray-100 grid h-24 rounded-md p-2 text-center items-center justify-center">
          <p className="text-5xl font-semibold text-gray-900 ">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;