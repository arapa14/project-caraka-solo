<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index() {
        $role = Auth::user()->role;

        if ($role == 'Admin') {
            return Inertia::render('Admin/Dashboard');
        } elseif ($role == 'Reviewer') {
            return Inertia::render('Reviewer/Dashboard');
        } elseif ($role == 'Caraka') {
            return Inertia::render('Dashboard');
        } 
    }
}
