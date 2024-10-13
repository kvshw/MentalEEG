import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

// Import both normal and clicked versions of icons
import homeIcon from '../assets/icons/home.png';
import homeClickedIcon from '../assets/icons/home_clicked.png';
import employeeIcon from '../assets/icons/document.png';
import employeeClickedIcon from '../assets/icons/document_clicked.png';
import departmentIcon from '../assets/icons/dep.png';
import departmentClickedIcon from '../assets/icons/dep_clicked.png';
import resourcesIcon from '../assets/icons/sup.png';
import resourcesClickedIcon from '../assets/icons/sup_clicked.png';
import settingsIcon from '../assets/icons/setting.png';
import settingsClickedIcon from '../assets/icons/setting_clicked.png';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);

  const navItems = [
    { name: 'Company Overview', path: '/dashboard', icon: homeIcon, clickedIcon: homeClickedIcon },
    { name: 'Employee Well-being', path: '/employee-wellbeing', icon: employeeIcon, clickedIcon: employeeClickedIcon },
    { name: 'Department Overview', path: '/department-overview', icon: departmentIcon, clickedIcon: departmentClickedIcon },
    { name: 'Support Resources', path: '/support-resources', icon: resourcesIcon, clickedIcon: resourcesClickedIcon },
    { name: 'Settings', path: '/settings', icon: settingsIcon, clickedIcon: settingsClickedIcon },
  ];

  return (
    <div className="bg-white w-72 min-h-screen shadow-lg flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link to="/dashboard" className="text-2xl font-bold">
          <span className="text-orange-500">MENTAL</span>
          <span className="text-gray-700">EEG</span>
        </Link>
      </div>
      <div className="p-4 flex-grow">
        <div className="flex items-center mb-6">
          <img src={user?.photoURL || '/default-avatar.png'} alt="Profile" className="w-12 h-12 rounded-full mr-3 object-cover" />
          <div>
            <h2 className="text-lg font-semibold">{user?.displayName || 'User'}</h2>
            <p className="text-sm text-gray-500">Quality Manager</p>
          </div>
        </div>
        <nav>
          <p className="text-xs font-semibold text-gray-400 mb-2">NAVIGATION</p>
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center py-2 px-3 rounded-lg mb-1 text-sm ${
                location.pathname === item.path
                  ? 'bg-orange-100 text-orange-500'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <img 
                src={location.pathname === item.path ? item.clickedIcon : item.icon} 
                alt={item.name} 
                className="w-5 h-5 mr-3" 
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;