import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
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
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                        <div className="p-6 bg-gray-100 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-700">Admin Menu</h3>
                            <div className="grid grid-cols-3 gap-6 mt-4">
                                {/* CRUD User */}
                                <Link
                                    href="/admin/users"
                                    className="p-4 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Manage Users
                                </Link>

                                {/* CRUD Tempat */}
                                <Link
                                    href="/admin/places"
                                    className="p-4 text-center bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Manage Places
                                </Link>

                                {/* Other Admin Feature */}
                                <button
                                    className="p-4 text-center bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    onClick={handleDeleteAllUploads}
                                >
                                    Delete All Uploads
                                </button>
                            </div>
                        </div>

                        <div className="p-6 text-gray-900">
                            <p>Welcome to the Admin Dashboard! Use the menu above to manage users, places, and other features.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
