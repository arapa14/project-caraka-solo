import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';

const UserList = ({ users }) => {
    const [usersList, setUsers] = useState(users); // Initialize with props
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Caraka' });
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');

    const handleEditClick = (user) => {
        setEditingUser(user.id);
        setFormData({ name: user.name, email: user.email, role: user.role, password: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleUpdate = async (e, id) => {
        e.preventDefault();
        try {
            const response = await fetch(`/admin/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({ name: formData.name, email: formData.email, role: formData.role }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUsers((prev) => prev.map(user => user.id === id ? updatedUser : user)); // Update user in state
                setEditingUser(null);
                setFormData({ name: '', email: '', password: '', role: 'Caraka' });
            } else {
                const errorData = await response.json();
                setError('Failed to update user: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            setError('An error occurred while updating the user.');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`/admin/users/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                });

                if (response.ok) {
                    setUsers((prev) => prev.filter(user => user.id !== id)); // Remove user from state
                    alert('User deleted successfully!');
                } else {
                    const errorText = await response.text();
                    setError('Failed to delete user. Status: ' + response.status);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                setError('An error occurred while deleting the user.');
            }
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const newUser = await response.json();
                setUsers((prevUsers) => [...prevUsers, newUser]);
                alert('User created successfully!');
                setFormData({ name: '', email: '', password: '', role: 'Caraka' });
                setIsCreating(false);
            } else {
                const errorData = await response.json();
                setError('Failed to create user: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error creating user:', error);
            setError('An error occurred while creating the user.');
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    User List
                </h2>
            }
        >
            <Head title="User List" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                        <div className="p-6 bg-gray-100 border-b border-gray-200">
                            {error && <div className="text-red-500">{error}</div>}
                            <button
                                onClick={() => setIsCreating(!isCreating)}
                                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                {isCreating ? 'Cancel' : 'Create New User'}
                            </button>

                            {isCreating && (
                                <form onSubmit={handleCreateUser} className="mb-4">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Name"
                                        className="border border-gray-300 rounded px-2 py-1 mr-2"
                                        required
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Email"
                                        className="border border-gray-300 rounded px-2 py-1 mr-2"
                                        required
                                    />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Password"
                                        className="border border-gray-300 rounded px-2 py-1 mr-2"
                                        required
                                    />
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded px-2 py-1 mr-2"
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Reviewer">Reviewer</option>
                                        <option value="Caraka">Caraka</option>
                                    </select>
                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white px-4 py-2 rounded"
                                    >
                                        Create User
                                    </button>
                                </form>
                            )}

                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {usersList.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-100">
                                            <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editingUser === user.id ? (
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        className="border border-gray-300 rounded px-2 py-1"
                                                    />
                                                ) : (
                                                    user.name
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editingUser === user.id ? (
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className="border border-gray-300 rounded px-2 py-1"
                                                    />
                                                ) : (
                                                    user.email
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editingUser === user.id ? (
                                                    <select
                                                        name="role"
                                                        value={formData.role}
                                                        onChange={handleInputChange}
                                                        className="border border-gray-300 rounded px-2 py-1"
                                                    >
                                                        <option value="Admin">Admin</option>
                                                        <option value="Reviewer">Reviewer</option>
                                                        <option value="Caraka">Caraka</option>
                                                    </select>
                                                ) : (
                                                    user.role
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editingUser === user.id ? (
                                                    <>
                                                        <button
                                                            onClick={(e) => handleUpdate(e, user.id)}
                                                            className="bg-yellow-500 text-white px-4 py-1 rounded mr-2"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingUser(null)}
                                                            className="bg-gray-300 text-black px-4 py-1 rounded"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleEditClick(user)}
                                                            className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="bg-red-500 text-white px-4 py-1 rounded"
                                                        >
                                                            Delete
                                                        </button>
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
        </AuthenticatedLayout>
    );
};

export default UserList;
