import React from "react";
import { Link, Head } from '@inertiajs/react';

export default function Homepage(props) {
    console.log(props)
    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={props.title} />
            <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8 text-center">Homepage: Disini semua data akan ditampilkan</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {props.laporan ? props.laporan.map((data, i) => {
                        return (
                            <div key={i} className="bg-white shadow-lg rounded-lg p-6">
                                <h2 className="text-xl font-semibold mb-4">{data.name}</h2>
                                <p className="text-gray-700 mb-2"><strong>Deskripsi:</strong> {data.description}</p>
                                <p className="text-gray-700 mb-2"><strong>Lokasi:</strong> {data.location}</p>
                                <p className="text-gray-700"><strong>Jumlah:</strong> {data.jumlah}</p>
                            </div>
                        )
                    }) : (
                        <p className="text-center text-gray-500">Belum ada laporan</p>
                    )}
                </div>
            </div>
        </div>
    );
}
