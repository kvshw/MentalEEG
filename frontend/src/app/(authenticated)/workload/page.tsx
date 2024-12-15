'use client';

import { WorkloadUpdate } from '@/components/workload/WorkloadUpdate';

export default function WorkloadPage() {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Workload Management</h1>
            <WorkloadUpdate />
        </div>
    );
} 