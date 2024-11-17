import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import React from "react";
import Paginator from "@/Components/Homepage/Paginator";

export default function Riwayat({ laporan }) {
    const laporanByDate = laporan.data.reduce((acc, laporanItem) => {
        const date = new Date(laporanItem.created_at).toLocaleDateString(
            "id-ID",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        );
        if (!acc[date]) acc[date] = [];
        acc[date].push(laporanItem);
        return acc;
    }, {});

    return (
        <AuthenticatedLayout>
            <Head title="Riwayat Laporan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="mb-4 px-4 pt-4">
                            <Link
                                href="/dashboard"
                                className="inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                            >
                                Kembali ke Dashboard
                            </Link>
                        </div>
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-2xl font-semibold text-gray-800">
                                Riwayat Laporan
                            </h3>
                        </div>
                        <div className="border-t border-gray-200">
                            {laporan.data.length === 0 ? (
                                <p className="p-6 text-center text-gray-500">
                                    Belum ada laporan yang tersimpan.
                                </p>
                            ) : (
                                Object.entries(laporanByDate).map(
                                    ([date, items]) => (
                                        <div key={date} className="mb-6">
                                            <h4 className="text-lg font-semibold text-gray-700 mb-4 ml-5">
                                                {date}
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-5">
                                                {items.map((laporanItem) => (
                                                    <div
                                                        key={laporanItem.id}
                                                        className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden"
                                                    >
                                                        <figure className="h-64 w-full">
                                                            <img
                                                                src={`/storage/uploads/${laporanItem.image}`}
                                                                alt={
                                                                    laporanItem.description
                                                                }
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </figure>
                                                        <div className="p-6">
                                                            <h2 className="text-2xl font-bold text-blue-600 mb-2">
                                                                {
                                                                    laporanItem.name
                                                                }
                                                                <div className="inline-block ml-2 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                                                                    Laporan :{" "}
                                                                    {
                                                                        laporanItem.waktu
                                                                    }
                                                                </div>
                                                            </h2>
                                                            <p className="text-gray-700 mb-4">
                                                                {
                                                                    laporanItem.description
                                                                }
                                                            </p>
                                                            <div className="flex justify-between items-center">
                                                                <div className="text-sm text-gray-500">
                                                                    {
                                                                        laporanItem.location
                                                                    }
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <div
                                                                        className={`text-sm font-medium py-1 px-3 rounded ${
                                                                            laporanItem.presence ===
                                                                            "Izin"
                                                                                ? "bg-yellow-100 text-yellow-600"
                                                                                : laporanItem.presence ===
                                                                                  "Sakit"
                                                                                ? "bg-red-100 text-red-600"
                                                                                : "bg-green-100 text-green-600"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            laporanItem.presence
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        className={`text-sm font-medium py-1 px-3 rounded ${
                                                                            laporanItem.status ===
                                                                            "Pending"
                                                                                ? "bg-yellow-100 text-yellow-600"
                                                                                : laporanItem.status ===
                                                                                  "unApproved"
                                                                                ? "bg-red-100 text-red-600"
                                                                                : "bg-green-100 text-green-600"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            laporanItem.status
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Paginator links={laporan.links} />
        </AuthenticatedLayout>
    );
}
