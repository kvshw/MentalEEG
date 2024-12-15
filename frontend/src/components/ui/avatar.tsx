import { ReactNode } from 'react';

interface AvatarProps {
    children: ReactNode;
    className?: string;
}

export function Avatar({ children, className = '' }: AvatarProps) {
    return (
        <div className={`flex items-center justify-center rounded-full ${className}`}>
            {children}
        </div>
    );
} 