import Paginator from "@/Components/Homepage/Paginator";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

export default function Dashboard(props) {
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [presence, setPresence] = useState("");
    const [image, setImage] = useState("");
    const [isNotif, setIsNotif] = useState(false);
    const [showTimeRestrictionModal, setShowTimeRestrictionModal] =
        useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [alreadyModal, setAlreadyModal] = useState(false);
    const [currentTime, setCurrentTime] = useState("");
    const [greeting, setGreeting] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedPresence, setSelectedPresence] = useState("");
    const [showValidationModal, setShowValidationModal] = useState(false);
    const [validationMessage, setValidationMessage] = useState("");
    const [showPresenceModal, setShowPresenceModal] = useState(false);
    const [presenceMessage, setPresenceMessage] = useState("");


    //nanti ini diupdate jadi dinamis di admin
    //masih hardcode
    const ENABLE_TIME_RESTRICTION = true;

    const handleLocationChange = (e) => {
        setSelectedLocation(e.target.value);
        setLocation(e.target.value);
    };
    const handlePresenceChange = (e) => {
        setSelectedPresence(e.target.value);
        setPresence(e.target.value);
    };

    useEffect(() => {
        const serverTime = new Date(props.serverTime);

        const updateTime = () => {
            serverTime.setSeconds(serverTime.getSeconds() + 1);

            const dayOptions = { weekday: "long" };
            const dateOptions = {
                year: "numeric",
                month: "long",
                day: "numeric",
            };

            const day = serverTime.toLocaleDateString("id-ID", dayOptions);
            const date = serverTime.toLocaleDateString("id-ID", dateOptions);
            const time = serverTime.toLocaleTimeString("id-ID");

            const currentHour = serverTime.getHours();
            let greetingText = "";

            if (currentHour >= 6 && currentHour < 12) {
                greetingText = "Pagi";
            } else if (currentHour >= 12 && currentHour < 15) {
                greetingText = "Siang";
            } else if (currentHour >= 15 && currentHour < 18) {
                greetingText = "Sore";
            } else {
                greetingText = "Malam";
            }

            setCurrentTime(`${day}, ${date} - ${time}`);
            setGreeting(greetingText);
        };

        updateTime();
        const intervalId = setInterval(updateTime, 1000);

        return () => clearInterval(intervalId);
    }, [props.serverTime]);

    

    const handleSubmit = () => {
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");

        if (!selectedLocation) {
            setShowLocationModal(true);
            return;
        }

        // Validasi deskripsi dan foto
        if (!description || !image) {
            setValidationMessage(
                "Deskripsi dan foto wajib diisi sebelum mengirim laporan."
            );
            setShowValidationModal(true);
            return;
        }

        if (!selectedLocation) {
            setValidationMessage(
                "Anda harus memilih lokasi sebelum mengirim laporan."
            );
            setShowValidationModal(true);
            return;
        }

        if (!selectedPresence) {
            setPresenceMessage(
                "Anda harus memilih status kehadiran sebelum mengirim laporan."
            );
            setShowPresenceModal(true);
            return;
        }

        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDate();
        const previousUpload = localStorage.getItem("lastUpload");

        // Define waktu based on time windows
        let waktu = "";
        if (currentHour >= 6 && currentHour < 12) {
            waktu = "Pagi";
        } else if (currentHour >= 12 && currentHour < 15) {
            waktu = "Siang";
        } else if (currentHour >= 15 && currentHour < 18) {
            waktu = "Sore";
        } else {
            waktu = "Invalid";
        }

        // Check if the user already submitted for this time window
        if (ENABLE_TIME_RESTRICTION) {
            if (
                previousUpload &&
                new Date(previousUpload).getDate() === currentDay &&
                localStorage.getItem("waktu") === waktu
            ) {
                setAlreadyModal(true); // Show modal instead of alert
                return;
            }
        }

        // Proceed with submission
        const data = {
            user_id: props.auth.user.id,
            description,
            location,
            waktu, // Use the current waktu
            image,
            presence,
        };

        router.post("/laporan", data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "X-CSRF-Token": csrfToken,
            },
            onSuccess: () => {
                setDescription("");
                setLocation("");
                setIsNotif(true);
                setImage("");
                localStorage.setItem("lastUpload", now);
                localStorage.setItem("waktu", waktu); // Store the waktu in localStorage

                setTimeout(() => {
                    setIsNotif(false);
                    router.get("/laporan");
                }, 5000);
            },
            onError: () => {
                setIsNotif(false);
            },
        });
    };

    useEffect(() => {
        if (!props.laporan) {
            router.get("/laporan");
        }
    }, [props.laporan]);

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day for accurate comparison

    // Check if there are reports for today
    const reportsForToday = props.laporan?.data.some((laporan) => {
        const laporanDate = new Date(laporan.created_at);
        laporanDate.setHours(0, 0, 0, 0);
        return laporanDate.getTime() === today.getTime();
    });

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white shadow-lg rounded-lg">
                    <h2 className="text-2xl sm:text-4xl font-bold text-blue-700 mb-2 sm:mb-0">
                        selamat datang {props.auth.user.name}
                    </h2>
                    <span className="text-gray-500 text-right">
                        {greeting} - {currentTime}
                    </span>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 bg-gray-100">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-center mb-8">
                        <button
                            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-3 px-6 rounded-full text-base sm:text-lg font-semibold shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            onClick={() => router.get("/riwayat")}
                        >
                            Lihat Riwayat
                        </button>
                    </div>

                    {/* Notification for success */}
                    {isNotif && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-8">
                            <p>Laporan berhasil ditambahkan!</p>
                        </div>
                    )}

                    {showTimeRestrictionModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-lg font-bold text-red-600">
                                    Peringatan
                                </h3>
                                <p className="mt-2 text-gray-600">
                                    Laporan hanya bisa dikirim pada jam 06.00 -
                                    12.00, 12.00 - 15.00, atau 15.00 - 17.00
                                </p>
                                <div className="mt-4">
                                    <button
                                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                                        onClick={() =>
                                            setShowTimeRestrictionModal(false)
                                        }
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {alreadyModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-lg font-bold text-red-600">
                                    Peringatan
                                </h3>
                                <p className="mt-2 text-gray-600">
                                    Anda sudah mengupload laporan dalam waktu
                                    ini.
                                </p>
                                <div className="mt-4">
                                    <button
                                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                                        onClick={() => setAlreadyModal(false)}
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showLocationModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-lg font-bold text-red-600">
                                    Peringatan
                                </h3>
                                <p className="mt-2 text-gray-600">
                                    Anda harus memilih lokasi sebelum mengirim
                                    laporan.
                                </p>
                                <div className="mt-4">
                                    <button
                                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                                        onClick={() =>
                                            setShowLocationModal(false)
                                        }
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showValidationModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-lg font-bold text-red-600">
                                    Peringatan
                                </h3>
                                <p className="mt-2 text-gray-600">
                                    {validationMessage}
                                </p>
                                <div className="mt-4">
                                    <button
                                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                                        onClick={() =>
                                            setShowValidationModal(false)
                                        }
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showPresenceModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-lg font-bold text-red-600">
                                    Peringatan
                                </h3>
                                <p className="mt-2 text-gray-600">
                                    {presenceMessage}
                                </p>
                                <div className="mt-4">
                                    <button
                                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                                        onClick={() =>
                                            setShowPresenceModal(false)
                                        }
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form Section */}
                    <div className="bg-white shadow-lg rounded-lg p-8 mb-10">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-6">
                            Submit Laporan
                        </h3>

                        <input
                            type="text"
                            placeholder="Deskripsi"
                            className="input input-bordered w-full p-4 mb-4 text-lg rounded-lg bg-white border-gray-300 focus:border-blue-500 focus:outline-none text-black"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setImage("");
                                    document
                                        .querySelector('input[type="file"]')
                                        .click();
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

                        <div className="mb-4 relative">
                            <select
                                className="appearance-none input-bordered w-full p-4 text-lg rounded-lg bg-white border-gray-300 focus:border-blue-500 focus:outline-none text-black h-14"
                                style={{
                                    minHeight: "56px", // Set a minimum height consistent with other inputs
                                    width: "100%", // Full-width to match other inputs
                                    whiteSpace: "normal", // Allows wrapping of long text
                                    overflowWrap: "break-word", // Prevents words from being cut off
                                    overflow: "visible", // Makes sure all text is visible
                                    display: "block", // Ensures it fills its container
                                }}
                                value={selectedLocation}
                                onChange={handleLocationChange}
                            >
                                <option value="">Pilih lokasi</option>
                                {Array.isArray(props.location) &&
                                props.location.length > 0 ? (
                                    props.location.map((loc) => (
                                        <option
                                            key={loc.id}
                                            value={loc.location}
                                        >
                                            {loc.location}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">
                                        No locations available
                                    </option> // Fallback in case location is empty or not available
                                )}
                            </select>
                        </div>
                        <div className="mb-4 relative">
                            <select
                                className="appearance-none input-bordered w-full p-4 text-lg rounded-lg bg-white border-gray-300 focus:border-blue-500 focus:outline-none text-black h-14"
                                style={{
                                    minHeight: "56px", // Set a minimum height consistent with other inputs
                                    width: "100%", // Full-width to match other inputs
                                    whiteSpace: "normal", // Allows wrapping of long text
                                    overflowWrap: "break-word", // Prevents words from being cut off
                                    overflow: "visible", // Makes sure all text is visible
                                    display: "block", // Ensures it fills its container
                                }}
                                value={selectedPresence}
                                onChange={handlePresenceChange}
                            >
                                <option value="">Pilih status</option>
                                <option value="Hadir">Hadir</option>
                                <option value="Sakit">Sakit</option>
                                <option value="Izin">Izin</option>
                            </select>
                        </div>

                        <button
                            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>

                    {/* No Reports Notification */}
                    {!reportsForToday && (
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
                            <p className="text-gray-400 mb-6 text-xl">
                                Ayo buat laporan pertama Anda!
                            </p>
                        </div>
                    )}

                    {/* List report */}
                    {/* Render laporan list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {props.laporan?.data?.length > 0 &&
                            props.laporan.data.map((laporan, i) => {
                                const laporanDate = new Date(
                                    laporan.created_at
                                );
                                laporanDate.setHours(0, 0, 0, 0);

                                if (laporanDate.getTime() === today.getTime()) {
                                    return (
                                        <div
                                            key={i}
                                            className="card w-full lg:w-96 bg-white shadow-md rounded-lg overflow-hidden mb-6"
                                        >
                                            <figure className="h-64 w-full">
                                                <img
                                                    src={`/storage/uploads/${laporan.image}`}
                                                    alt={laporan.description}
                                                    className="w-full h-full object-contain"
                                                />
                                            </figure>
                                            <div className="p-6">
                                                <h2 className="text-2xl font-bold text-blue-600 mb-2">
                                                    {laporan.name}
                                                    <div className="inline-block ml-2 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                                                        Laporan :{" "}
                                                        {laporan.waktu}
                                                    </div>
                                                </h2>
                                                <p className="text-gray-700 mb-4">
                                                    {laporan.description}
                                                </p>
                                                <div className="flex justify-between items-center">
                                                    <div className="text-sm text-gray-500">
                                                        {laporan.location}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <div
                                                            className={`text-sm font-medium py-1 px-3 rounded ${
                                                                laporan.presence ===
                                                                "Izin"
                                                                    ? "bg-yellow-100 text-yellow-600"
                                                                    : laporan.presence ===
                                                                      "Sakit"
                                                                    ? "bg-red-100 text-red-600"
                                                                    : "bg-green-100 text-green-600"
                                                            }`}
                                                        >
                                                            {laporan.presence}
                                                        </div>
                                                        <div
                                                            className={`text-sm font-medium py-1 px-3 rounded ${
                                                                laporan.status ===
                                                                "Pending"
                                                                    ? "bg-yellow-100 text-yellow-600"
                                                                    : laporan.status ===
                                                                      "unApproved"
                                                                    ? "bg-red-100 text-red-600"
                                                                    : "bg-green-100 text-green-600"
                                                            }`}
                                                        >
                                                            {laporan.status}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                    </div>

                    

                    <Paginator meta={props.laporan} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
