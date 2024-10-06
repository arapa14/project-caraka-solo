import { useForm, Head } from '@inertiajs/react';
import { useState } from 'react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen flex">
            <Head title="Forgot Password" />
            <div className="flex-1 flex flex-col justify-center items-center bg-white p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-4xl font-bold text-blue-700">Caraka</h2>
                        <p className="text-2xl text-gray-500 mt-4">Lupa Password?</p>
                    </div>
                    {status && (
                        <div className="mb-4 text-lg font-medium text-green-600">{status}</div>
                    )}
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-lg font-medium text-gray-700">Alamat Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full p-4 text-xl border border-gray-300 rounded-md"
                                placeholder="caraka@smkn1jakarta.sch.id"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="mt-2 text-lg text-red-600">{errors.email}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-3 rounded-md text-xl font-medium"
                        >
                            Kirim Tautan Reset Password
                        </button>
                    </form>

                    <div className="mt-6 flex justify-center">
                        <a
                            href={route('login')}
                            className="text-lg text-blue-600 hover:text-blue-800"
                        >
                            Back to Login
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
