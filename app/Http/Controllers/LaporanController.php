<?php

namespace App\Http\Controllers;

use App\Http\Resources\LaporanCollection;
use App\Models\Laporan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Imagick;
use ImagickDraw;
use ImagickPixel;

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
        // dd($request->all());
        // Validasi request
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Added max size validation
            'description' => 'required|string',
            'location' => 'required|string',
            'jumlah' => 'nullable|integer', // Ensure jumlah is validated
        ]);

        // Mengunggah gambar
        $imageName = time() . '.' . $request->file('image')->getClientOriginalExtension();
        $request->file('image')->storeAs('uploads', $imageName, 'public');

        // Simpan laporan dengan nama yang diambil dari pengguna yang sedang login
        $laporan = new Laporan();
        $laporan->name = Auth::user()->name; // Ambil nama pengguna yang sedang login
        $laporan->description = $request->description;
        $laporan->location = $request->location;
        $laporan->jumlah = $request->jumlah; // Ambil jumlah dari request
        // dd($laporan->jumlah);

        // Watermarking logic
        if ($request->hasFile('image')) {
            // Initialize Imagick with the uploaded image
            $imagick = new Imagick(storage_path("app/public/uploads/{$imageName}"));

            // Mendapatkan dimensi gambar
            $height = $imagick->getImageHeight();

            // Menghitung ukuran font (misalnya, 5% dari tinggi gambar)
            $fontSize = max(10, intval($height * 0.05)); // Minimal font size adalah 10

            // Membuat watermark text
            $watermarkText = now()->format('Y-m-d H:i:s') . "\nUser Input: " . Auth::user()->name;

            // Membuat gambar teks untuk watermark
            $draw = new ImagickDraw();
            $draw->setFont(public_path('dist/fonts/Poppins-Regular.otf')); // Pastikan path font benar
            $draw->setFontSize($fontSize);
            $draw->setFillColor(new ImagickPixel('white')); // Warna putih

            // Mengukur ukuran teks untuk membuat background
            $textMetrics = $imagick->queryFontMetrics($draw, $watermarkText);
            $textWidth = $textMetrics['textWidth'];
            $textHeight = $textMetrics['textHeight'];

            // Membuat background hitam transparan
            $bgWidth = $textWidth + 20; // Tambah padding
            $bgHeight = $textHeight + 10; // Tambah padding
            $background = new Imagick();
            $background->newImage($bgWidth, $bgHeight, new ImagickPixel('rgba(0, 0, 0, 0.43)')); // Hitam transparan
            $background->setImageFormat('png');

            // Menggabungkan background dan teks
            $background->annotateImage($draw, 10, $fontSize + 5, 0, $watermarkText);

            // Menyimpan gambar dengan watermark
            $imagick->compositeImage($background, Imagick::COMPOSITE_OVER, 0, 0);
            $watermarkedImagePath = storage_path("app/public/uploads/watermarked_{$imageName}");
            $imagick->writeImage($watermarkedImagePath);
            $imagick->destroy(); // Bebaskan memori

            // Set image path pada model
            $laporan->image = 'watermarked_' . $imageName; // Path untuk image yang ter-watermark
        }

        // Simpan laporan ke database
        $laporan->save();

        // Kembali ke halaman dashboard
        return redirect('/dashboard')->with('message', 'Laporan berhasil disimpan');
    }

    public function deleteAllUploads()
    {
        try {
            $files = Storage::files('public/uploads');
            if (empty($files)) {
                return response()->json(['message' => 'No uploads found to delete.'], 404);
            }

            foreach ($files as $file) {
                if (!Storage::delete($file)) {
                    throw new \Exception("Failed to delete file: {$file}");
                }
            }

            return response()->json(['message' => 'All uploads deleted successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete uploads: ' . $e->getMessage()], 500);
        }
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
