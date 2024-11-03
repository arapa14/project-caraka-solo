<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // Pastikan ini ada
use Inertia\Inertia; // Pastikan ini ditulis dengan benar

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();

        return Inertia::render('Admin/UserList', [
            'users' => $users
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed', // Pastikan konfirmasi password
            'role' => 'required|string',
        ]);

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password), // Hash password
                'role' => $request->role,
            ]);
    
            return response()->json(['user' => $user, 'message' => 'User created successfully'], 201); // Respons lebih informatif
        } catch (\Exception $e) {
            return response()->json(['error' => 'User creation failed', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id, // Pastikan email unik, kecuali untuk pengguna itu sendiri
            'role' => 'required|string',
            // Validasi password jika diubah
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $user = User::findOrFail($id);

        $user->name = $request->name;
        $user->email = $request->email;
        if ($request->filled('password')) { // Hanya hash password jika diisi
            $user->password = Hash::make($request->password);
        }
        $user->role = $request->role;

        $user->save();

        return response()->json(['user' => $user, 'message' => 'User updated successfully']); // Respons yang lebih informatif
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']); // Respons yang lebih informatif
    }
}