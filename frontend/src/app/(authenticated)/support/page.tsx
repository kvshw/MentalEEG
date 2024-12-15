'use client';

import ResourceChatbot from '@/components/support/ResourceChatbot';

export default function SupportPage() {
    return (
        <div className="container mx-auto p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Mental Health Support Assistant</h1>
                <ResourceChatbot />
            </div>
        </div>
    );
} 