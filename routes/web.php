<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SwitchAccountController;
use App\Http\Controllers\userController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Auth/Login');
});

//Pengaturan Multi Auth Dashboard
Route::middleware('auth')->get('dashboard', [DashboardController::class, 'index'])->name('dashboard');


Route::middleware(['auth', 'isAdmin'])->group(function () {
    //Url yang hanya bisa diakses Admin
    Route::get('/test', function () {
        return "Haii Admin";
    });
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::delete('/uploads', [LaporanController::class, 'deleteAllUploads']);

    Route::get('/admin/users', [UserController::class, 'index'])->name('user.index');
    Route::post('/admin/users', [UserController::class, 'store'])->name('user.store');
    Route::put('/admin/users/{id}', [UserController::class, 'update'])->name('user.update');
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy'])->name('user.destroy');

    Route::get('/locations', [LocationController::class, 'index'])->name('locations.index');
    Route::post('/locations', [LocationController::class, 'store'])->name('locations.store');
    Route::put('/locations/{location}', [LocationController::class, 'update'])->name('locations.update');
    Route::delete('/locations/{location}', [LocationController::class, 'destroy'])->name('locations.destroy');
});

Route::middleware(['auth', 'isReviewer'])->group(function() {
        //Url yang hanya bisa diakses Reviewer
    Route::get('homepage', [LaporanController::class, 'index']);


    Route::get('/test1', function() {
        return "Haii Reviewer";
    });
    Route::put('/laporan/{id}', [LaporanController::class, 'update']);
});

Route::middleware(['auth', 'isCaraka'])->group(function() {
        //Url yang hanya bisa diakses Caraka
    Route::get('/test', function() {
        return "Haii Caraka";
    });
    Route::get('/laporan', [LaporanController::class, 'show']);
    Route::post('/laporan', [LaporanController::class, 'store']);
    Route::get('/riwayat', [LaporanController::class, 'riwayat'])->name('riwayat');
});


//Switch Account
Route::get('/switch/{id}', [SwitchAccountController::class, 'switchAccount'])->name('switch-account');
Route::put('/laporan/{id}', [LaporanController::class, 'update']);


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('switch-back', [SwitchAccountController::class, 'switchBack'])->name('switch-back');
});

require __DIR__ . '/auth.php';
