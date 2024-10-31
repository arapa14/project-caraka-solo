import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react';

export default function Riwayat(props) {
    return (
        <AuthenticatedLayout>
            <Head title="Riwayat" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-blue-700 mb-6">Riwayat Laporan</h2>

                    {props.riwayat && props.riwayat.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {props.riwayat.map((laporan, index) => (
                                <div key={index} className="bg-white shadow-md rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-blue-600">
                                        {laporan.name}
                                    </h3>
                                    <p className="text-gray-500">{laporan.description}</p>
                                    <p className="text-gray-500">Lokasi: {laporan.location}</p>
                                    <p className="text-gray-400 text-sm">{laporan.created_at}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Belum ada riwayat laporan.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
