import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

const LocationList = ({ locations }) => {
    const [locationsList, setLocations] = useState(locations);
    const [editingLocation, setEditingLocation] = useState(null);
    const [formData, setFormData] = useState({ location: '' });
    const [isCreating, setIsCreating] = useState(false);
    const { props } = usePage();

    const clearMessages = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };

    const handleEditClick = (location) => {
        setEditingLocation(location.id);
        setFormData({ location: location.location });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleUpdate = async (e, id) => {
        e.preventDefault();
        Inertia.put(`/locations/${id}`, { location: formData.location });
        setEditingLocation(null);
    };

    const handleCreateLocation = async (e) => {
        e.preventDefault();
        Inertia.post('/locations', { location: formData.location });
        setFormData({ location: '' });
        setIsCreating(false);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this location?')) {
            Inertia.delete(`/locations/${id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Location List</h2>}
        >
            <Head title="Location List" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                        <div className="p-6 bg-gray-100 border-b border-gray-200">
                            <button
                                onClick={() => setIsCreating(!isCreating)}
                                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                {isCreating ? 'Cancel' : 'Create New Location'}
                            </button>

                            {isCreating && (
                                <form onSubmit={handleCreateLocation} className="mb-4">
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="Location"
                                        className="border border-gray-300 rounded px-2 py-1 mr-2"
                                        required
                                    />
                                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                                        Create Location
                                    </button>
                                </form>
                            )}

                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {locationsList.map(location => (
                                            <tr key={location.id} className="hover:bg-gray-100">
                                                <td className="px-6 py-4 whitespace-nowrap">{location.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingLocation === location.id ? (
                                                        <input
                                                            type="text"
                                                            name="location"
                                                            value={formData.location}
                                                            onChange={handleInputChange}
                                                            className="border border-gray-300 rounded px-2 py-1"
                                                        />
                                                    ) : (
                                                        location.location
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingLocation === location.id ? (
                                                        <>
                                                            <button onClick={(e) => handleUpdate(e, location.id)} className="bg-yellow-500 text-white px-4 py-1 rounded mr-2">Save</button>
                                                            <button onClick={() => setEditingLocation(null)} className="bg-gray-300 text-black px-4 py-1 rounded">Cancel</button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button onClick={() => handleEditClick(location)} className="bg-blue-500 text-white px-4 py-1 rounded mr-2">Edit</button>
                                                            <button onClick={() => handleDelete(location.id)} className="bg-red-500 text-white px-4 py-1 rounded">Delete</button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default LocationList;
