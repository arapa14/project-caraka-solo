import React from "react";
import { Head } from '@inertiajs/react';
import Navbar from "@/Components/Navbar";
import LaporanList from "@/Components/Homepage/LaporanList";
import Paginator from "@/Components/Homepage/Paginator";

export default function Homepage(props) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={props.title} />
            <Navbar />
            <div className="flex justify-center flex-col lg:flex-row lg:flex-wrap lg:items-stretch items-center gap-4 p-4">
                <LaporanList laporan={props.laporan.data}/>
            </div>
            <div className="flex justify-center items-center">
                <Paginator meta={props.laporan.meta}/>
            </div>
        </div>
    );
}
