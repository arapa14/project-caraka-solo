import React, { useState, useRef } from "react";
import Preview from "../Preview";

const LaporanList = ({ laporan: data }) => {
  const [dataLaporan, setDataLaporan] = useState(data.data || []);

  // Fungsi untuk mengubah status dan mengirim data ke server
  const handleStatusChange = async (id, newStatus) => {
    try {
      // Mendapatkan CSRF Token
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

      // Mengirim permintaan PUT ke backend untuk memperbarui status
      const response = await fetch(`/laporan/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      // Mengecek apakah response sukses (status 2xx)
      if (!response.ok) {
        throw new Error("Gagal memperbarui status.");
      }

      // Mendapatkan data JSON dari respons
      const data = await response.json();

      // Menangani respons jika status berhasil diperbarui
      if (data.message === 'Status updated successfully') {
        // Update state dengan data terbaru
        setDataLaporan((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
        console.log("Status berhasil diperbarui");
      } else {
        alert(data.message); // Menangani jika ada pesan error
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat memperbarui status.");
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
    <div>
      {/* Displaying Grouped Reports */}
      <Table
        laporan={groupedLaporan}
        getStatusColor={getStatusColor}
        handleStatusChange={handleStatusChange}
      />
    </div>
  );
};

const Table = ({ laporan, getStatusColor, handleStatusChange }) => {
  const modalRef = useRef(null);
  const viewPhotoRef = useRef(null);

  // Fungsi untuk mengunduh gambar
  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = `/storage/uploads/${url}`;
    link.download = url;
    link.click();
  };

  // Fungsi untuk melihat gambar dalam modal
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
          {Object.keys(laporan).map((date, index) => {
            return Object.keys(laporan[date]).map((user, userIndex) => {
              return laporan[date][user].map((laporanItem, itemIndex) => (
                <tr
                  key={itemIndex}
                  className={`border-b text-center border-gray-200 hover:brightness-95 ${itemIndex % 2 ? "bg-slate-100" : "bg-white"
                    }`}
                >
                  <td className="p-3">{laporanItem.id}</td>
                  <td className="p-3">{laporanItem.waktu}</td>
                  <td className="p-3">{laporanItem.description}</td>
                  <td className="p-3">{laporanItem.location}</td>
                  <td className="p-3">
                    <div
                      className={`m-auto text-sm w-16 font-medium py-1 px-3 rounded ${laporanItem.presence === "Izin"
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
                      <option value="unApproved">UnApproved</option>
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
              ));
            });
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LaporanList;
