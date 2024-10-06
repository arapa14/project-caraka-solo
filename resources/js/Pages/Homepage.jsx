import React from "react";
import { Head } from '@inertiajs/react';
import Navbar from "@/Components/Navbar";
import LaporanList from "@/Components/Homepage/LaporanList";
import Paginator from "@/Components/Homepage/Paginator";

export default function Homepage(props) {
    console.log('props di homepage', props);
    console.log('props.laporan', props.laporan);
    
    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={props.title} />
            <Navbar user={props.auth.user} />

            {/* Main Content Section */}
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-center mb-6"> Laporan</h1>
                <div className="flex flex-col lg:flex-row lg:flex-wrap justify-center gap-6">
                    <LaporanList laporan={props.laporan} />
                </div>
                
                <div className="flex justify-center mt-6">
                    <Paginator meta={props.laporan} /> {/* Kirim meta pagination */}
                </div>
            </div>
        </div>
    );
}
