import React from 'react';

const employees = [
  { initials: 'JM', name: 'Joni Mäntälä', role: 'Software Engineer', level: 1, change: -10.4 },
  { initials: 'MY', name: 'Marjo Ylitalo', role: 'Business Director', level: 1, change: 13.3 },
  { initials: 'RL', name: 'Riikka Lintukangas', role: 'Talent Acquisition Partner', level: 2, change: -21.7 },
  { initials: 'SR', name: 'Sara Röslund', role: 'Sales Manager', level: 1, change: 2.3 },
  { initials: 'ON', name: 'Ola Neon', role: 'Project Manager', level: 1, change: 15.3 },
];

const EmployeeOverview = () => {
  return (
    <div>
      <div className="flex justify-between mb-4">
        {['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'].map((level) => (
          <span key={level} className="text-sm font-medium text-gray-500">{level}</span>
        ))}
      </div>
      {employees.map((employee) => (
        <div key={employee.name} className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-800 font-semibold mr-3">
              {employee.initials}
            </div>
            <div>
              <p className="font-medium">{employee.name}</p>
              <p className="text-sm text-gray-500">{employee.role}</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="mr-2">Level {employee.level}</span>
            <span className={`text-sm ${employee.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {employee.change >= 0 ? '+' : ''}{employee.change.toFixed(1)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeOverview;