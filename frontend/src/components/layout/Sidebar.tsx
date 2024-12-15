'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { deleteCookie } from 'cookies-next';

const navigation = [
  { name: 'Company Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'Employee Well-being', href: '/employees', icon: UserGroupIcon },
  { name: 'Department Overview', href: '/departments', icon: BuildingOfficeIcon },
  { name: 'Support Resources', href: '/support', icon: QuestionMarkCircleIcon },
  { name: 'Workload Management', href: '/workload', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie('isAuthenticated');
    router.push('/login');
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64">
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">
          <span className="text-orange-500">MENTAL</span>
          <span className="text-gray-900">EEG</span>
        </h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-2 py-2 text-sm font-medium rounded-md group
                ${isActive
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon
                className={`
                  mr-3 h-5 w-5
                  ${isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'}
                `}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 group"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3 text-red-500" />
          Logout
        </button>
      </div>
    </div>
  );
} 