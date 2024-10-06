import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react';

export default function Dashboard() {
    const handleDeleteAllUploads = async () => {
        if (window.confirm("Are you sure you want to delete all uploads? This action cannot be undone.")) {
            try {
                const response = await fetch('/uploads', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                });
    
                const contentType = response.headers.get('content-type');
    
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    if (response.ok) {
                        alert(data.message); // Success
                    } else {
                        console.error('Error:', data.message);
                        alert('Failed to delete uploads: ' + data.message);
                    }
                } else {
                    // Handle non-JSON response (e.g., HTML error page)
                    const text = await response.text();
                    console.error('Unexpected response:', text);
                    alert('An error occurred while trying to delete uploads. Please check the logs.');
                }
            } catch (error) {
                console.error('Error deleting uploads:', error);
                alert('An error occurred while trying to delete uploads.');
            }
        }
    };
    
    

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                        <div className="p-6">
                            <button
                                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                                onClick={handleDeleteAllUploads}
                            >
                                Delete All Uploads
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
