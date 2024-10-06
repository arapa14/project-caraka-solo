import Paginator from '@/Components/Homepage/Paginator';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

export default function Dashboard(props) {
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [jumlah, setJumlah] = useState(1);
    const [image, setImage] = useState('');
    const [isNotif, setIsNotif] = useState(false);
    console.log(props);

    const handleSubmit = () => {
        const data = {
            user_id: props.auth.user.id,
            description,
            location,
            jumlah,
            image,
        };

        router.post('/laporan', data, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set the appropriate header
            },
            onSuccess: () => {
                setDescription('');
                setLocation('');
                setIsNotif(true);
                setImage('');
                router.get('/laporan');
            },
            onError: () => {
                setIsNotif(false);
            }
        });
    };

    useEffect(() => {
        if (!props.laporan) {
            router.get('/laporan');
        }
        console.log('props caraka', props.data);
    }, [props.laporan]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold text-gray-800">Caraka Dashboard</h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Notification Section */}
                    {isNotif && (
                        <div role="alert" className="alert alert-info mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="h-6 w-6 inline-block mr-2 text-blue-600">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>{props.flash.message}</span>
                        </div>
                    )}
                    {/* Form Section */}
                    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4">Submit Laporan</h3>
                        <input
                            type="text"
                            placeholder="Deskripsi"
                            className="input input-bordered w-full mb-4"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                        />
                        <input
                            type="file"
                            className="file-input w-full mb-4"
                            onChange={(e) => setImage(e.target.files[0])} //Ambil gambar
                        />
                        <input
                            type="text"
                            placeholder="Lokasi"
                            className="input input-bordered w-full mb-4"
                            onChange={(e) => setLocation(e.target.value)}
                            value={location}
                        />
                        <button
                            className="btn btn-primary w-full"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>

                    {/* Laporan List Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {props.laporan && props.laporan.data.length > 0 ? (
                            props.laporan.data.map((laporan, i) => (
                                <div key={i} className="card bg-base-100 shadow-xl">
                                    <figure>
                                        <img
                                            src={`/storage/uploads/${laporan.image}`} // Mengambil gambar dari storage
                                            alt={laporan.description}
                                            className="object-cover h-48 w-full"
                                        />
                                    </figure>
                                    <div className="card-body">
                                        <h2 className="card-title flex justify-between items-center">
                                            {laporan.name}
                                            <div className="badge badge-secondary">{laporan.jumlah}</div>
                                        </h2>
                                        <p>{laporan.description}</p>
                                        <div className="card-actions justify-end">
                                            <div className="badge badge-inline">{laporan.location}</div>
                                            <div className="badge badge-outline">Unapproved</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Belum Membuat Laporan</p>
                        )}
                    </div>

                    {/* Paginator */}
                    <Paginator meta={props.laporan} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
