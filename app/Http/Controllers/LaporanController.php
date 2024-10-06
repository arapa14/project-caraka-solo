<?php

namespace App\Http\Controllers;

use App\Http\Resources\LaporanCollection;
use App\Models\Laporan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LaporanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $laporan = Laporan::orderByDesc('id')->paginate(6); // Langsung menggunakan paginate
        // dd($laporan);
        return Inertia::render('Homepage', [
            'title' => 'Reviewer',
            'laporan' => $laporan,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validasi request
        $request->validate([
            'user_id' => 'required|exists:users,id', // pastikan user_id valid
            'description' => 'required|string',
            'location' => 'required|string',
        ]);

        // Cari user berdasarkan user_id dari tabel users
        $user = User::find($request->user_id);

        // Simpan laporan dengan nama yang diambil dari tabel user
        $laporan = new Laporan();
        $laporan->name = $user->name;
        $laporan->description = $request->description;
        $laporan->location = $request->location;
        $laporan->jumlah = $request->jumlah; // Ambil count dari request dan simpan
        $laporan->save();

        // Kembali ke halaman dashboard
        return redirect('/dashboard')->with('message', 'Laporan berhasil disimpan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Laporan $laporan)
    {
        // Ambil semua laporan berdasarkan nama user yang sedang login
        $name = Auth::user()->name;
        $laporanUser = Laporan::where('name', $name)->orderByDesc('id')->paginate(6);

        // dd($laporanUser);
        return Inertia::render('Dashboard', [
            'title' => 'Reviewer',
            'laporan' => $laporanUser,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Laporan $laporan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Laporan $laporan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Laporan $laporan)
    {
        //
    }
}
