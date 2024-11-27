<?php

namespace App\Http\Controllers;

use App\Http\Resources\LaporanCollection;
use App\Models\Laporan;
use App\Models\User;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Carbon\Carbon;
use Intervention\Image\Facades\Image;

class LaporanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $laporan = Laporan::orderByDesc('id')->paginate(5); // Langsung menggunakan paginate
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

    // Function to handle image processing and compression
    private function processImage($imageFile, $imageNamePrefix, $directory, $watermarkText, $fontPath, $sizeLimit = 1024)
    {
        $imageName = time() . "_{$imageNamePrefix}." . $imageFile->getClientOriginalExtension();
        $imagePath = storage_path("app/public/{$directory}/{$imageName}");

        // Buka gambar
        $image = Image::make($imageFile->getRealPath());

        // Resize gambar
        $image->resize(800, 800, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });

        // Ukuran teks dan padding
        $textPadding = 20;
        $fontSize = 18;

        // Hitung dimensi teks
        $lines = explode("\n", $watermarkText);
        $maxLineWidth = max(array_map('strlen', $lines));
        $textBoxWidth = $maxLineWidth * $fontSize * 0.6; // Estimasi lebar teks
        $textBoxHeight = count($lines) * ($fontSize + 5); // Tinggi berdasarkan jumlah baris

        // Hitung posisi latar belakang
        $backgroundX = $image->width() - $textBoxWidth - $textPadding * 2;
        $backgroundY = $image->height() - $textBoxHeight - $textPadding * 2;

        // Tambahkan latar belakang
        $image->rectangle(
            $backgroundX - $textPadding,
            $backgroundY - $textPadding,
            $image->width() - $textPadding,
            $image->height() - $textPadding,
            function ($draw) {
                $draw->background('rgba(0, 0, 0, 0.5)'); // Warna semi-transparan
                $draw->border(1, 'rgba(255, 255, 255, 0.5)'); // Garis tepi (opsional)
            }
        );

        // Tambahkan teks watermark di atas latar belakang
        $image->text($watermarkText, $image->width() - $textPadding - 10, $image->height() - $textPadding - $textBoxHeight / 2, function ($font) use ($fontPath, $fontSize) {
            $font->file($fontPath);
            $font->size($fontSize);
            $font->color('rgba(255, 255, 255, 0.9)');
            $font->align('right');
            $font->valign('bottom');
        });

        // Simpan gambar
        $image->save($imagePath, 80); // Kualitas 80

        // Pastikan ukuran file di bawah batas
        while (filesize($imagePath) > $sizeLimit * 1024) {
            $currentQuality = $image->quality();
            if ($currentQuality <= 10) {
                break;
            }
            $image->save($imagePath, $currentQuality - 10);
        }

        return "storage/{$directory}/{$imageName}";
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        // Validasi request
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'description' => 'required|string',
            'location' => 'required',
            'waktu' => 'required|in:Pagi,Siang,Sore,Invalid',
            'presence' => 'required|in:Hadir,Sakit,Izin',
        ]);

        // Generate watermark text
        $watermarkText = now()->format('Y-m-d H:i:s') . "\nUser Input: " . Auth::user()->name;
        $fontPath = public_path('dist/fonts/Poppins-Regular.otf');

        // Process image
        $imagePath = $this->processImage($request->file('image'), 'watermarked', 'uploads', $watermarkText, $fontPath);

        // Save report data
        $laporan = new Laporan();
        $laporan->user_id = Auth::id();
        $laporan->name = Auth::user()->name;
        $laporan->description = $request->description;
        $laporan->location = $request->location;
        $laporan->waktu = $request->waktu;
        $laporan->image = basename($imagePath);
        $laporan->presence = $request->presence;
        $laporan->save();

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
        $serverTime = Carbon::now()->toDateTimeString(); // Mengambil waktu server
        $location = Location::all();

        // dd($laporanUser);
        // dd($serverTime);
        return Inertia::render('Dashboard', [
            'laporan' => $laporanUser,
            'serverTime' => $serverTime,
            'location' => $location,
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
    public function update(Request $request, $id)
    {
        try {
            // Cari laporan berdasarkan ID
            $laporan = Laporan::find($id);
            if (!$laporan) {
                return response()->json(['message' => 'Laporan not found'], 404);
            }

            // Validasi status
            $validatedData = $request->validate([
                'status' => 'required|string|in:Pending,unApproved,Approved',
            ]);

            // Update status
            $laporan->status = $validatedData['status'];
            $laporan->save();

            // Refresh untuk memastikan data diperbarui
            $laporan->refresh();

            return response()->json([
                'message' => 'Status updated successfully',
                'laporan' => $laporan,
            ]);
        } catch (\Exception $e) {
            // Tangani error dan kembalikan respons
            return response()->json([
                'message' => 'An error occurred while updating the status',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function riwayat()
    {
        $allReports = Laporan::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // dd(Auth::id()); 

        return Inertia::render('Riwayat', [
            'laporan' => $allReports
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Laporan $laporan)
    {
        //
    }
}
