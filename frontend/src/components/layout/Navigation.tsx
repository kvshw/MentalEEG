import {
    HomeIcon,
    UsersIcon,
    FolderIcon,
    HeartIcon,
    ChartBarIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';

export const navigation = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: HomeIcon,
    },
    {
        name: 'Employees',
        href: '/employees',
        icon: UsersIcon,
    },
    {
        name: 'Projects',
        href: '/projects',
        icon: FolderIcon,
    },
    {
        name: 'Support',
        href: '/support',
        icon: HeartIcon,
    },
    {
        name: 'Workload Management',
        href: '/workload',
        icon: ChartBarIcon,
    },
    {
        name: 'Settings',
        href: '/settings',
        icon: Cog6ToothIcon,
    },
]; 