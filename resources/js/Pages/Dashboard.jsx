import Paginator from '@/Components/Homepage/Paginator';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
export default function Dashboard(props) {
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [jumlah, setJumlah] = useState(1);
    const [isNotif, setIsNotif] = useState(false);
    console.log(props)



    const handleSubmit = () => {
        const data = {
            user_id: props.auth.user.id, // Kirim user_id dari props
            description,
            location,
            jumlah // Kirim jumlah tanpa penambahan
        };

        router.post('/laporan', data, {
            onSuccess: () => {
                // Notifikasi berhasil disimpan, kemudian redirect akan terjadi dari server
                setDescription(''); // Reset field setelah berhasil
                setLocation('');
                setIsNotif(true); // Jika Anda ingin menampilkan notifikasi
                router.get('/laporan'); // Ambil data terbaru setelah pengiriman berhasil
            },
            onError: () => {
                setIsNotif(false); // Menangani error jika diperlukan
            }
        });
    };

    // useEffect is now properly placed outside the handleSubmit function
    useEffect(() => {
        if (!props.laporan) {
            router.get('/laporan');
        }
        console.log('props caraka', props.data);
    }, [props.laporan]); // Ensure that the effect runs when props.laporan changes

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Caraka Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-white-900">
                            {isNotif &&
                                <div role="alert" className="alert alert-info">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        className="h-6 w-6 shrink-0 strokeCurrent">
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span>{props.flash.message}</span>
                                </div>
                            }
                            <input type="text" placeholder="Deskripsi" className="m-2 input input-bordered w-full " onChange={(description) => setDescription(description.target.value)} value={description} />
                            <input type="file" className="m-2 file-input w-full " />
                            <input type="text" placeholder="Lokasi" className="m-2 input input-bordered w-full " onChange={(location) => setLocation(location.target.value)} value={location} />
                            <button className='m-2 btn btn-primary' onClick={() => handleSubmit()}>Submit</button>
                        </div>
                    </div>
                    <div>
                        {props.laporan ? props.laporan.data.map((laporan, i) => {
                            return (

                                <div key={i} className="card w-full lg:w-96 bg-base-100 shadow-xl">
                                    <figure>
                                        <img
                                            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                            alt="Shoes" />
                                    </figure>
                                    <div className="card-body">
                                        <h2 className="card-title">
                                            {laporan.name}
                                            <div className="badge badge-secondary">{laporan.jumlah}</div>
                                        </h2>
                                        <p>{laporan.description}</p>
                                        <div className="card-actions justify-end">
                                            <div className="badge badge-inline">{laporan.location}</div>
                                            <div className="badge badge-outline">UnApproved</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : <p>Belum Membuat Laporan</p>}
                    </div>
                    <Paginator meta={props.laporan}/>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
