import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

export default function Dashboard(props) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Selamat datang Admin {props.auth.user.name}
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                        <div className="p-6 bg-gray-100 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-700 mb-6">Admin Menu</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* CRUD User */}
                                <Link
                                    href="/admin/users"
                                    className="p-6 text-center bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transform transition duration-200 hover:scale-105"
                                >
                                    Manage Users
                                </Link>

                                {/* CRUD Tempat */}
                                <Link
                                    href="/locations"
                                    className="p-6 text-center bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transform transition duration-200 hover:scale-105"
                                >
                                    Manage Location
                                </Link>

                                {/* You can add more menu items here */}
                            </div>
                        </div>

                        <div className="p-6 text-gray-900">
                            <p>Welcome to the Admin Dashboard! Use the menu above to manage users, locations, and other features.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
