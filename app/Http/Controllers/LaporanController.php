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

    // Function to handle image processing and compression
    private function processImage($imageFile, $imageNamePrefix, $directory, $watermarkText, $fontPath, $sizeLimit = 1024)
    {
        $imageName = time() . "_{$imageNamePrefix}." . $imageFile->getClientOriginalExtension();
        $imagePath = $imageFile->storeAs($directory, $imageName, 'public');

        $imagick = new Imagick(storage_path("app/public/{$directory}/{$imageName}"));

        // Compress and resize
        $imagick->setImageCompressionQuality(30);
        $imagick->resizeImage(800, 800, Imagick::FILTER_LANCZOS, 1, true);

        $isPortrait = $imagick->getImageHeight() > $imagick->getImageWidth();

        $height = $imagick->getImageHeight();
        $fontSize = max(10, intval($height * 0.05));

        // Watermark setup
        $draw = new ImagickDraw();
        $draw->setFont($fontPath);
        $draw->setFontSize($fontSize);
        $draw->setFillColor(new ImagickPixel('white'));

        $textMetrics = $imagick->queryFontMetrics($draw, $watermarkText);
        $textWidth = $textMetrics['textWidth'];
        $textHeight = $textMetrics['textHeight'];

        $bgWidth = $textWidth + 20;
        $bgHeight = $textHeight + 10;
        $background = new Imagick();
        $background->newImage($bgWidth, $bgHeight, new ImagickPixel('rgba(0, 0, 0, 0.43)'));
        $background->setImageFormat('png');

        $background->annotateImage($draw, 10, $fontSize + 5, 0, $watermarkText);

        // Positioning watermark
        if ($isPortrait) {
            $xPosition = 0;
            $yPosition = 0;
        } else {
            $xPosition = $imagick->getImageWidth() - $bgWidth - 10;
            $yPosition = $imagick->getImageHeight() - $bgHeight - 10;
        }

        $imagick->compositeImage($background, Imagick::COMPOSITE_OVER, $xPosition, $yPosition);

        while ($imagick->getImageLength() > $sizeLimit) {
            $imagick->setImageCompressionQuality($imagick->getImageCompressionQuality() - 5);
            if ($imagick->getImageCompressionQuality() <= 5) break;
        }

        $imagick->writeImage(storage_path("app/public/{$directory}/{$imageName}"));
        $imagick->destroy();

        return $imagePath;
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

        return response()->json(['message' => 'Status updated successfully']);
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
