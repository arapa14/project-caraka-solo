import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import Paginator from '@/Components/Homepage/Paginator';

export default function Riwayat({ laporan }) {
    return (
        <AuthenticatedLayout>
            <Head title="Riwayat Laporan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        {/* Back to Dashboard Button */}
                        <div className="mb-4 px-4 pt-4">
                            <Link href="/dashboard" className="inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">
                                Kembali ke Dashboard
                            </Link>
                        </div>
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-2xl font-semibold text-gray-800">Riwayat Laporan</h3>
                        </div>
                        <div className="border-t border-gray-200">
                            {laporan.data.length === 0 ? (
                                <p className="p-6 text-center text-gray-500">Belum ada laporan yang tersimpan.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                                    {laporan.data.map((laporanItem) => (
                                        <div key={laporanItem.id} className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
                                            {laporanItem.image && (
                                                <img
                                                    src={`/storage/uploads/${laporanItem.image}`}
                                                    alt="Laporan"
                                                    className="w-full h-48 object-cover rounded-md mb-4"
                                                    style={{ aspectRatio: '4 / 3' }}
                                                />
                                            )}
                                            <div className="flex flex-col">
                                                <p className="text-xl font-semibold text-gray-800 mb-2">{laporanItem.description}</p>
                                                <p className="text-gray-600">{laporanItem.location}</p>
                                                <p className="text-gray-500 text-sm mt-2">
                                                    {new Date(laporanItem.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Paginator links={laporan.links} />
        </AuthenticatedLayout>
    );
}
