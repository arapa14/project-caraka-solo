import React, { useState, useRef } from "react";
import Preview from "../Preview";

const LaporanList = ({ laporan: data }) => {
    const [dataLaporan, setDataLaporan] = useState(data.data || []);

    // Fungsi untuk mengubah status dan mengirim data ke server
    const handleStatusChange = async (id, newStatus) => {
        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content");

            const response = await fetch(`/laporan/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error("Gagal memperbarui status.");
            }

            setDataLaporan((prevData) =>
                prevData.map((item) =>
                    item.id === id ? { ...item, status: newStatus } : item
                )
            );

            console.log("Status berhasil diperbarui");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Fungsi untuk mengelompokkan laporan berdasarkan tanggal dan nama user
    const groupReportsByDateAndUser = (data) => {
        return data.reduce((acc, laporanItem) => {
            const date = new Date(laporanItem.created_at).toLocaleDateString(
                "id-ID",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }
            );
            const user = laporanItem.name;

            if (!acc[date]) acc[date] = {};
            if (!acc[date][user]) acc[date][user] = [];

            acc[date][user].push(laporanItem);
            return acc;
        }, {});
    };

    // Mengelompokkan laporan berdasarkan tanggal dan user
    const groupedLaporan = groupReportsByDateAndUser(dataLaporan);

    // Fungsi untuk menentukan kelas berdasarkan status
    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-700";
            case "unApproved":
                return "bg-red-100 text-red-700";
            case "Approved":
                return "bg-green-100 text-green-700";
            default:
                return "";
        }
    };

    return (
        // <div className="container mx-auto p-6">
        //     {Object.keys(groupedLaporan).map((date) => (
        //         <div key={date} className="mb-8">
        //             <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 pb-2 border-gray-200">
        //                 {date}
        //             </h2>
        //             {Object.keys(groupedLaporan[date]).map((user) => (
        //                 <div key={user} className="mb-6">
        //                     <h3 className="text-xl font-semibold text-blue-600 mb-4">
        //                         {user}
        //                     </h3>
        //                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        //                         {groupedLaporan[date][user].map((data, i) => (
        //                             <div
        //                                 key={i}
        //                                 className="bg-white shadow-lg rounded-lg overflow-hidden"
        //                             >
        //                                 <figure className="h-48 w-full">
        //                                     <img
        //                                         src={`/storage/uploads/${data.image}`}
        //                                         alt={data.description}
        //                                         className="w-full h-full object-contain"
        //                                     />
        //                                 </figure>
        //                                 <div className="p-5">
        //                                     <h4 className="text-lg font-bold text-blue-600 mb-2">
        //                                         Laporan {data.waktu}
        //                                     </h4>
        //                                     <p className="text-gray-700 mb-4">
        //                                         {data.description}
        //                                     </p>
        //                                     <div className="flex justify-between items-center">
        //                                         <div className="text-sm text-gray-500">
        //                                             {data.location}
        //                                         </div>
        //                                         <div className="flex items-center gap-2">
        //                                             <div
        //                                                 className={`text-sm font-medium py-1 px-3 rounded ${
        //                                                     data.presence ===
        //                                                     "Izin"
        //                                                         ? "bg-yellow-100 text-yellow-600"
        //                                                         : data.presence ===
        //                                                           "Sakit"
        //                                                         ? "bg-red-100 text-red-600"
        //                                                         : "bg-green-100 text-green-600"
        //                                                 }`}
        //                                             >
        //                                                 {data.presence}
        //                                             </div>
        //                                             <select
        //                                                 className={`border border-gray-300 rounded p-1 ${getStatusColor(
        //                                                     data.status
        //                                                 )} transition duration-200 ease-in-out focus:outline-none`}
        //                                                 value={data.status}
        //                                                 onChange={(e) =>
        //                                                     handleStatusChange(
        //                                                         data.id,
        //                                                         e.target.value
        //                                                     )
        //                                                 }
        //                                             >
        //                                                 <option value="Pending">
        //                                                     Pending
        //                                                 </option>
        //                                                 <option value="unApproved">
        //                                                     UnApproved
        //                                                 </option>
        //                                                 <option value="Approved">
        //                                                     Approved
        //                                                 </option>
        //                                             </select>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         ))}
        //                     </div>
        //                 </div>
        //             ))}
        //         </div>
        //     ))}
        // </div>

        <Table
            laporan={data}
            getStatusColor={getStatusColor}
            handleStatusChange={handleStatusChange}
        />
    );
};
const Table = ({ laporan, getStatusColor, handleStatusChange }) => {
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
        <div div className="overflow-x-scroll">
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
                                <select
                                    className={`border border-gray-300 rounded p-1 ${getStatusColor(
                                        laporanItem.status
                                    )} transition duration-200 ease-in-out focus:outline-none`}
                                    value={laporanItem.status}
                                    onChange={(e) =>
                                        handleStatusChange(
                                            laporanItem.id,
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="unApproved">
                                        UnApproved
                                    </option>
                                    <option value="Approved">Approved</option>
                                </select>
                            </td>
                            <td className="w-8">
                                <i
                                    className="fi fi-rr-eye hover:brightness-90 p-2 mr-2 rounded cursor-pointer bg-sky-500"
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
export default LaporanList;
