import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Head, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    // Function to handle "Enter" keypress and move to the next field or submit
    const handleKeyPress = (e, nextFieldId) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextFieldId) {
                document.getElementById(nextFieldId).focus();
            } else {
                submit(e); // Submit form if it's the last field
            }
        }
    };

    return (
        <div className="min-h-screen flex">
            <Head title="Login | Caraka" />
            <div className="flex-1 flex flex-col justify-center items-center bg-white p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-5xl font-bold text-blue-700">Daily Caraka</h2>
                        <p className="text-2xl text-gray-500 mt-4">Login to your account</p>
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
                                autoComplete="username"
                                placeholder="caraka@smkn1jakarta.sch.id"
                                onChange={(e) => setData('email', e.target.value)}
                                onKeyDown={(e) => handleKeyPress(e, 'password')} // Move to password on Enter
                            />
                            {errors.email && <p className="mt-2 text-lg text-red-600">{errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full p-4 text-xl border border-gray-300 rounded-md"
                                    autoComplete="current-password"
                                    placeholder="********"
                                    onChange={(e) => setData('password', e.target.value)}
                                    onKeyDown={(e) => handleKeyPress(e, null)} // Submit on Enter at the last field
                                />
                                <span
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-2xl" />
                                </span>
                            </div>
                            {errors.password && <p className="mt-2 text-lg text-red-600">{errors.password}</p>}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-lg text-gray-900">Ingat saya</label>
                            </div>
                            {canResetPassword && (
                                <a href={route('password.request')} className="text-lg text-blue-600 hover:text-blue-800">I forgot password</a>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-3 rounded-md text-xl font-medium"
                        >
                            Sign in
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
