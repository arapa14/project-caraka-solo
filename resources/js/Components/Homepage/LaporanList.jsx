const isLaporan = (laporan) => {
    return laporan.map((data, i) => {
        return <div key={i} className="card w-full lg:w-96 bg-base-100 shadow-xl">
            <figure>
                <img
                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                    alt="Shoes" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    {data.name}
                    <div className="badge badge-secondary">{data.jumlah}</div>
                </h2>
                <p>{data.description}</p>
                <div className="card-actions justify-end">
                    <div className="badge badge-inline">{data.location}</div>
                    <div className="badge badge-outline">UnApproved</div>
                </div>
            </div>
        </div>
    })
}

const noLaporan = () => {
    return (
        <div>
            Saat ini belum ada laporan yang tersedia
        </div>
    )
}
const LaporanList = ({ laporan }) => {
    return !laporan ? noLaporan() : isLaporan(laporan)
}

export default LaporanList