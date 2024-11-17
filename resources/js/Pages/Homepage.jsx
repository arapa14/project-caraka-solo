import React from "react";
import { Link, Head } from "@inertiajs/react";
import LaporanList from "@/Components/Homepage/LaporanList";
import Paginator from "@/Components/Homepage/Paginator";
import PageNavigation from "@/Components/PageNavigation";

export default function Homepage(props) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <Head title={props.title} />

            {/* Navbar */}
            <div className="navbar bg-white shadow-md px-6 py-4">
                <div className="flex-1">
                    <Link href={route('dashboard')} className="text-2xl font-bold text-blue-600">
                        Laporan
                    </Link>
                </div>
                <div className="flex-none gap-4">
                    <Link href={route('logout')} method="post" as="button" className="btn btn-ghost text-blue-600 font-semibold hover:bg-gray-200">
                        Logout
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-10">
                    Laporan
                </h1>
                <div className="flex flex-col lg:flex-row lg:flex-wrap justify-center gap-8">
                    <LaporanList laporan={props.laporan} />
                </div>
                <div className="flex justify-center mt-12">
                    <PageNavigation laporan={props.laporan}/> {/* Send pagination metadata */}
                </div>
            </div>
        </div>
    );
}
