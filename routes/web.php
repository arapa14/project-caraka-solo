<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SwitchAccountController;
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
});

Route::middleware(['auth', 'isReviewer'])->group(function() {
        //Url yang hanya bisa diakses Reviewer
    Route::get('homepage', [LaporanController::class, 'index']);


    Route::get('/test1', function() {
        return "Haii Reviewer";
    });
});

Route::middleware(['auth', 'isCaraka'])->group(function() {
        //Url yang hanya bisa diakses Caraka
    Route::get('/test', function() {
        return "Haii Caraka";
    });
    Route::post('/laporan', [LaporanController::class, 'store']);
    Route::get('/laporan', [LaporanController::class, 'show']);
    Route::get('/riwayat', [LaporanController::class, 'riwayat'])->name('laporan.riwayat');
});


//Switch Account
Route::get('/switch/{id}', [SwitchAccountController::class, 'switchAccount'])->name('switch-account');
Route::put('/api/laporan/{id}', [LaporanController::class, 'update']);


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('switch-back', [SwitchAccountController::class, 'switchBack'])->name('switch-back');
});

require __DIR__ . '/auth.php';
