import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import React, { useRef } from "react";
import Paginator from "@/Components/Homepage/Paginator";
import Preview from "@/Components/Preview";
import PageNavigation from "@/Components/PageNavigation";

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
    console.log(laporan);

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

                        <div className="border-t border-gray-200 p-4">
                            {laporan.data.length === 0 ? (
                                <p className="p-6 text-center text-gray-500">
                                    Belum ada laporan yang tersimpan.
                                </p>
                            ) : (
                                <>
                                    <Table laporan={laporan} />
                                    <PageNavigation laporan={laporan} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
const Table = ({ laporan }) => {
    const modalRef = useRef(null);
    const viewPhotoRef = useRef(null);
    const handleDownload = (url) => {
        const link = document.createElement("a");
        link.href = `/storage/uploads/${url}`;
        link.download = url;
        link.click();
    };

    const handleView = (url) => {
        viewPhotoRef.current.src = `/storage/uploads/${url}`;
        modalRef.current.showModal();
    };
    return (
        <div className="overflow-x-scroll">
            <Preview modalRef={modalRef} viewPhotoRef={viewPhotoRef} />
            <table className="bg-white w-full mb-4 min-w-[530px] max-w-[1080px] m-auto text-sm tex-left rounded text-black">
                <thead className="text-white text-xs uppercase bg-gradient-to-r from-blue-500 to-blue-700 border-b-2 rounded-t border-gray-200 overflow-hidden">
                    <tr className="text-nowrap">
                        <th className="p-3 w-8">ID</th>
                        <th className="p-3">Waktu</th>
                        <th className="p-3">Deskripsi</th>
                        <th className="p-3">Lokasi</th>
                        <th className="p-3">Kehadiran</th>
                        <th className="p-3">Status</th>
                        <th className="w-20"></th>
                    </tr>
                </thead>
                <tbody className="overflow-hidden">
                    {laporan.data.map((laporanItem, index) => (
                        <tr
                            key={index}
                            className={`border-b text-center border-gray-200 hover:brightness-95 ${
                                index % 2 ? "bg-slate-100" : "bg-white"
                            }`}
                        >
                            <td className="p-3">{laporanItem.id}</td>
                            <td className="p-3">{laporanItem.waktu}</td>
                            <td className="p-3">{laporanItem.description}</td>
                            <td className="p-3">{laporanItem.location}</td>
                            <td className="p-3">
                                <div
                                    className={`m-auto text-sm w-16 font-medium py-1 px-3 rounded ${
                                        laporanItem.presence === "Izin"
                                            ? "bg-yellow-100 text-yellow-600"
                                            : laporanItem.presence === "Sakit"
                                            ? "bg-red-100 text-red-600"
                                            : "bg-green-100 text-green-600"
                                    }`}
                                >
                                    {laporanItem.presence}
                                </div>
                            </td>
                            <td className="p-3">
                                <div
                                    className={`w-fit m-auto text-sm font-medium py-1 px-3 rounded ${
                                        laporanItem.status === "Pending"
                                            ? "bg-yellow-100 text-yellow-600"
                                            : laporanItem.status ===
                                              "unApproved"
                                            ? "bg-red-100 text-red-600"
                                            : "bg-green-100 text-green-600"
                                    }`}
                                >
                                    {laporanItem.status}
                                </div>
                            </td>
                            <td className="w-8">
                                <i
                                    className="fi fi-rr-eye hover:brightness-90 p-2 mr-2 rounded cursor-pointer bg-blue-500"
                                    onClick={() =>
                                        handleView(laporanItem.image)
                                    }
                                ></i>

                                <i
                                    className="fi fi-rr-download hover:brightness-90 p-2 rounded cursor-pointer bg-green-500"
                                    onClick={() =>
                                        handleDownload(laporanItem.image)
                                    }
                                ></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

