import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';

const UserList = ({ users }) => {
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Caraka' });
    const [isCreating, setIsCreating] = useState(false); // State to toggle new user form

    const handleEditClick = (user) => {
        setEditingUser(user.id);
        setFormData({ name: user.name, email: user.email, role: user.role, password: '' }); // Clear password on edit
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
                body: JSON.stringify({ name: formData.name, email: formData.email, role: formData.role }), // Exclude password for updates
            });

            if (response.ok) {
                // Refresh the user list after update
                const updatedUser = await response.json();
                setEditingUser(null); // Exit editing mode
                setFormData({ name: '', email: '', password: '', role: 'Caraka' }); // Reset form data
                // Optionally refresh user list from API
            } else {
                const errorData = await response.json();
                alert('Failed to update user: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('An error occurred while updating the user.');
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
                    // Remove the deleted user from the user list
                    alert('User deleted successfully!');
                    // Optionally refresh user list from API
                } else {
                    const errorText = await response.text();
                    alert('Failed to delete user. Status: ' + response.status);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('An error occurred while deleting the user.');
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
            alert('User created successfully!');
            // Optionally refresh the user list or add the new user to the state
            // users.push(newUser); // Update users state or refresh the user list
        } else {
            const errorData = await response.json();
            alert('Failed to create user: ' + errorData.message);
        }
    } catch (error) {
        console.error('Error creating user:', error);
        alert('An error occurred while creating the user.');
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
                                    {users.map(user => (
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
                                                    <button
                                                        onClick={(e) => handleUpdate(e, user.id)}
                                                        className="text-green-600 hover:text-green-800"
                                                    >
                                                        Save
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEditClick(user)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="text-red-600 hover:text-red-800 ml-2"
                                                >
                                                    Delete
                                                </button>
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
