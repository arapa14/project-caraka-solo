import React from "react";
import { Head } from '@inertiajs/react';
import Navbar from "@/Components/Navbar";
import LaporanList from "@/Components/Homepage/LaporanList";
import Paginator from "@/Components/Homepage/Paginator";

export default function Homepage(props) {
    console.log('props di homepage', props)
    console.log('props.laporan', props.laporan);
    
    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={props.title} />
            <Navbar user={props.auth.user} />
            <div className="flex justify-center flex-col lg:flex-row lg:flex-wrap lg:items-stretch items-center gap-4 p-4">
                <LaporanList laporan={props.laporan} />
            </div>
            <div className="flex justify-center items-center">
                <Paginator meta={props.laporan} /> {/* Kirim meta pagination */}
            </div>
        </div>
    );
}
