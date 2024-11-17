import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { FaUsers, FaMapMarkerAlt, FaCog } from 'react-icons/fa';
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
                                {/* Manage Users */}
                                <Link
                                    href="/admin/users"
                                    className="flex items-center justify-center p-6 bg-blue-100 text-blue-700 rounded-lg shadow-md hover:bg-blue-200 transform transition duration-200 hover:scale-105"
                                >
                                    <FaUsers className="text-2xl mr-3" />
                                    <span>Manage Users</span>
                                </Link>

                                {/* Manage Locations */}
                                <Link
                                    href="/locations"
                                    className="flex items-center justify-center p-6 bg-green-100 text-green-700 rounded-lg shadow-md hover:bg-green-200 transform transition duration-200 hover:scale-105"
                                >
                                    <FaMapMarkerAlt className="text-2xl mr-3" />
                                    <span>Manage Locations</span>
                                </Link>

                                {/* Settings */}
                                <Link
                                    href="/settings"
                                    className="flex items-center justify-center p-6 bg-purple-100 text-purple-700 rounded-lg shadow-md hover:bg-purple-200 transform transition duration-200 hover:scale-105"
                                >
                                    <FaCog className="text-2xl mr-3" />
                                    <span>Settings</span>
                                </Link>
                            </div>
                        </div>

                        <div className="p-6 text-gray-900">
                            <p>
                                Welcome to the Admin Dashboard! Use the menu above to manage users, locations, and other features.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
