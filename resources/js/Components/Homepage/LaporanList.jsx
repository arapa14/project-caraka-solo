const isLaporan = (laporan) => {
    return laporan.map((data, i) => {
        return (
            <div key={i} className="card w-full lg:w-96 bg-white shadow-md rounded-lg overflow-hidden mb-6">
                {/* Gambar dengan tampilan yang responsif dan memenuhi container */}
                <figure className="h-64 w-full"> {/* Mengatur tinggi figure secara konsisten */}
                    <img
                        src={`/storage/uploads/${data.image}`}
                        alt={data.description}
                        className="w-full h-full object-cover object-center" // object-cover untuk mengisi container secara proporsional
                    />
                </figure>
                <div className="p-6">
                    {/* Title dengan badge */}
                    <h2 className="text-2xl font-bold text-blue-600 mb-2">
                        {data.name}
                        <div className="inline-block ml-2 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                            {data.jumlah} Laporan
                        </div>
                    </h2>
                    {/* Deskripsi */}
                    <p className="text-gray-700 mb-4">
                        {data.description}
                    </p>
                    {/* Lokasi dan status */}
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            {data.location}
                        </div>
                        <div className="text-sm text-red-500">
                            UnApproved
                        </div>
                    </div>
                </div>
            </div>
        );
    });
};

const noLaporan = () => {
    return (
        <div className="text-center py-10 text-gray-500">
            Saat ini belum ada laporan yang tersedia
        </div>
    );
};

const LaporanList = ({ laporan }) => {
    return laporan.data && laporan.data.length > 0
        ? isLaporan(laporan.data)
        : noLaporan();
};

export default LaporanList;
