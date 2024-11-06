import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard(props) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold text-blue-600">
                    Selamat Datang {props.auth.user.name}
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white rounded-lg shadow-lg">
                        <div className="p-8 text-center">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                Welcome to Your Dashboard!
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Silahkan lihat Caraka yang sudah membuat laporan hari ini!
                            </p>
                            <Link href="homepage">
                                <button className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow-md transition-transform transform hover:scale-105">
                                    Show Laporan
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
