import Paginator from '@/Components/Homepage/Paginator';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

export default function Dashboard(props) {
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState('');
    const [isNotif, setIsNotif] = useState(false);
    const [showModal, setShowModal] = useState(false); // Modal visibility state
    const [alreadyModal, setAleadyModal] = useState(false);
    const [reportCount, setReportCount] = useState(1); // To track the count of reports
    const [currentTime, setCurrentTime] = useState('');
    const [greeting, setGreeting] = useState('');

    const ENABLE_TIME_RESTRICTION = false;

    useEffect(() => {
        const serverTime = new Date(props.serverTime);

        const updateTime = () => {
            serverTime.setSeconds(serverTime.getSeconds() + 1);

            const dayOptions = { weekday: 'long' };
            const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

            const day = serverTime.toLocaleDateString('id-ID', dayOptions);
            const date = serverTime.toLocaleDateString('id-ID', dateOptions);
            const time = serverTime.toLocaleTimeString('id-ID');

            const currentHour = serverTime.getHours();
            let greetingText = '';

            if (currentHour >= 6 && currentHour < 12) {
                greetingText = 'Pagi';
            } else if (currentHour >= 12 && currentHour < 15) {
                greetingText = 'Siang';
            } else if (currentHour >= 15 && currentHour < 18) {
                greetingText = 'Sore';
            } else {
                greetingText = 'Malam';
            }

            setCurrentTime(`${day}, ${date} - ${time}`);
            setGreeting(greetingText);
        };

        updateTime();
        const intervalId = setInterval(updateTime, 1000);

        return () => clearInterval(intervalId);
    }, [props.serverTime]);


    useEffect(() => {
        // Retrieve the reportCount from localStorage when the component mounts
        const storedCount = localStorage.getItem('reportCount');
        if (storedCount) {
            setReportCount(parseInt(storedCount, 10)); // Parse stored value and set it as reportCount
        }
    }, []);

    const handleSubmit = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDate();
        const previousUpload = localStorage.getItem('lastUpload');

        // Define time windows
        const morningWindow = currentHour >= 6 && currentHour < 8;
        const afternoonWindow = currentHour >= 11 && currentHour < 14;
        const eveningWindow = currentHour >= 15 && currentHour < 17;

        // If time restriction is enabled, check the allowed time windows
        if (ENABLE_TIME_RESTRICTION) {
            if (!(morningWindow || afternoonWindow || eveningWindow)) {
                setShowModal(true); // Show modal instead of alert
                return;
            }

            // Prevent multiple uploads in the same time window
            if (previousUpload && new Date(previousUpload).getDate() === currentDay) {
                setAleadyModal(true); // Show modal instead of alert
                return;
            }
        }

        // Proceed with submission
        const data = {
            user_id: props.auth.user.id,
            description,
            location,
            jumlah: reportCount, // Use the current report count
            image,
        };

        router.post('/laporan', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onSuccess: () => {
                setDescription('');
                setLocation('');
                setIsNotif(true);
                setImage('');
                localStorage.setItem('lastUpload', now);

                // Update report count: increment, but reset to 1 if greater than 3
                const newCount = reportCount >= 3 ? 1 : reportCount + 1;
                setReportCount(newCount);
                localStorage.setItem('reportCount', newCount);  // Store the updated count in localStorage


                // Keep notification visible for 10 seconds
                setTimeout(() => {
                    setIsNotif(false);
                    router.get('/laporan');
                }, 5000);

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
    }, [props.laporan]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white shadow-lg rounded-lg">
                    <h2 className="text-2xl sm:text-4xl font-bold text-blue-700 mb-2 sm:mb-0">
                        Caraka Dashboard
                    </h2>
                    <span className="text-gray-500 text-right">{greeting} - {currentTime}</span>
                </div>}

        >
            <Head title="Dashboard" />

            <div className="py-12 bg-gray-100">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Notification for success */}
                    {isNotif && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-8">
                            <p>Laporan berhasil ditambahkan!</p>
                        </div>
                    )}

                    {/* Time Restriction Modal */}
                    {showModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-lg font-bold text-red-600">Peringatan</h3>
                                <p className="mt-2 text-gray-600">Laporan hanya bisa dikirim pada jam 06.00 - 12.00, 12.00 - 15.00, atau 15.00 - 17.00</p>
                                <div className="mt-4">
                                    <button
                                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Already Uploaded Modal */}
                    {alreadyModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-lg font-bold text-red-600">Peringatan</h3>
                                <p className="mt-2 text-gray-600">Anda sudah mengupload laporan dalam waktu ini.</p>
                                <div className="mt-4">
                                    <button
                                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                                        onClick={() => setAleadyModal(false)}
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form Section */}
                    <div className="bg-white shadow-lg rounded-lg p-8 mb-10">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-6">Submit Laporan</h3>

                        <input
                            type="text"
                            placeholder="Deskripsi"
                            className="input input-bordered w-full p-4 mb-4 text-lg rounded-lg bg-white border-gray-300 focus:border-blue-500 focus:outline-none text-black"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setImage('');
                                    document.querySelector('input[type="file"]').click();
                                    e.preventDefault();
                                }
                            }}
                        />

                        <div className="mb-4">
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                className="w-full p-4 text-lg rounded-lg bg-white border border-gray-300 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Lokasi"
                            className="input input-bordered w-full p-4 mb-4 text-lg rounded-lg bg-white border-gray-300 focus:border-blue-500 focus:outline-none text-black"
                            onChange={(e) => setLocation(e.target.value)}
                            value={location}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit();
                                    e.preventDefault();
                                }
                            }}
                        />

                        <button
                            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>

                    {/* No Reports Notification */}
                    {(!props.laporan || props.laporan.data.length === 0) && (
                        <div className="text-center py-12 bg-white shadow-lg rounded-lg mb-10">
                            <div className="text-3xl font-semibold text-gray-500 mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 text-blue-400 inline-block mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12h6m-6 4h6m-6-8h6m2 0a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V8z"
                                    />
                                </svg>
                                Belum Ada Laporan
                            </div>
                            <p className="text-gray-400 mb-6 text-xl">Ayo buat laporan pertama Anda!</p>
                        </div>
                    )}

                    {/* List report */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {props.laporan && props.laporan.data.length > 0 &&
                            props.laporan.data.map((laporan, i) => (
                                <div key={i} className="card w-full lg:w-96 bg-white shadow-md rounded-lg overflow-hidden mb-6">
                                    {/* Gambar dengan tampilan yang responsif dan memenuhi container */}
                                    <figure className="h-64 w-full"> {/* Mengatur tinggi figure secara konsisten */}
                                        <img
                                            src={`/storage/uploads/${laporan.image}`}
                                            alt={laporan.description}
                                            className="w-full h-full object-cover object-center" // object-cover untuk mengisi container secara proporsional
                                        />
                                    </figure>
                                    <div className="p-6">
                                        {/* Title dengan badge */}
                                        <h2 className="text-2xl font-bold text-blue-600 mb-2">
                                            {laporan.name}
                                            <div className="inline-block ml-2 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                                                Laporan : {laporan.jumlah}
                                            </div>
                                        </h2>
                                        {/* Deskripsi */}
                                        <p className="text-gray-700 mb-4">
                                            {laporan.description}
                                        </p>
                                        {/* Lokasi dan status */}
                                        <div className="flex justify-between items-center">
                                            <div className="text-sm text-gray-500">
                                                {laporan.location}
                                            </div>
                                            <div className="text-sm text-red-500">
                                                {laporan.status}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>



                    {/* Pagination */}
                    <Paginator meta={props.laporan} />

                </div>
            </div>
        </AuthenticatedLayout >
    );
}
