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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed', // Make sure password_confirmation is sent
            'role' => 'required|in:Admin,Reviewer,Caraka',
        ]);
    
        // Save the new user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);
    
        return response()->json($user, 201);  // Returning the user with a 201 status code
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Validate the request
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'role' => 'required|string',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        // Find the user by ID
        $user = User::findOrFail($id);

        // Update user data
        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->role = $request->role;
        $user->save();

        // Flash the success message to the session
        session()->flash('message', 'User updated successfully!');

        // Redirect to the user list page with Inertia
        return Inertia::location(route('user.index'));
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
