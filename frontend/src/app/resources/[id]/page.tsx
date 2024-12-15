import ResourceDetail from '@/components/resources/ResourceDetail';

export const metadata = {
    title: 'Resource Details | MentalEEG',
    description: 'View and manage resource details',
};

interface ResourcePageProps {
    params: {
        id: string;
    };
}

export default function ResourcePage({ params }: ResourcePageProps) {
    return <ResourceDetail resourceId={parseInt(params.id)} />;
} 