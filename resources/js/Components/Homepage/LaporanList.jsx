import { useState, useEffect } from "react";

const LaporanList = ({ laporan }) => {
    const [dataLaporan, setDataLaporan] = useState(laporan.data || []);

    // Fungsi untuk mengubah status dan mengirim data ke server
    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await fetch(`/api/laporan/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.head.querySelector('meta[name="csrf-token"]').content, // Menyertakan token CSRF
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error("Gagal memperbarui status.");
            }

            // Memperbarui status di state secara langsung
            setDataLaporan(prevData =>
                prevData.map(item =>
                    item.id === id ? { ...item, status: newStatus } : item
                )
            );

            console.log("Status berhasil diperbarui");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Mengambil data saat komponen pertama kali dimuat
    useEffect(() => {
        // Jika Anda ingin mengambil data awal dari server, bisa panggil fetchLaporan di sini
    }, []);

    // Fungsi untuk menentukan kelas berdasarkan status
    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-700";
            case "unApproved":
                return "bg-red-100 text-red-700";
            case "Approved":
                return "bg-blue-100 text-blue-700";
            default:
                return "";
        }
    };

    return dataLaporan.length > 0 ? (
        dataLaporan.map((data, i) => (
            <div key={i} className="card w-full lg:w-96 bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <figure className="h-64 w-full">
                    <img
                        src={`/storage/uploads/${data.image}`}
                        alt={data.description}
                        className="w-full h-full object-cover object-center"
                    />
                </figure>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-blue-600 mb-2">
                        {data.name}
                        <div className="inline-block ml-2 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                            {data.jumlah} Laporan
                        </div>
                    </h2>
                    <p className="text-gray-700 mb-4">{data.description}</p>
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">{data.location}</div>
                        <div className="text-sm cursor-pointer">
                            <select
                                className={`border border-gray-300 rounded p-1 ${getStatusColor(data.status)} transition duration-200 ease-in-out focus:outline-none`}
                                value={data.status}
                                onChange={(e) => handleStatusChange(data.id, e.target.value)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="unApproved">UnApproved</option>
                                <option value="Approved">Approved</option>
                            </select>

                        </div>
                    </div>
                </div>
            </div>
        ))
    ) : (
        <div className="text-center py-10 text-gray-500">
            Saat ini belum ada laporan yang tersedia
        </div>
    );
};

export default LaporanList;
