<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $locations = Location::all(); // Ambil semua data location dari database
        return Inertia::render('Admin/LocationList', [
            'locations' => $locations,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    /*************  ✨ Codeium Command ⭐  *************/
    /**
     * Show the form for creating a new location.
     */
    /******  08546540-13a4-4658-91fe-3109ad79946d  *******/
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'location' => 'required|string|max:255',
        ]);

        Location::create($request->only('location'));

        return redirect()->back()->with('message', 'Location created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Location $location)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Location $location)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Location $location)
    {
        $request->validate([
            'location' => 'required|string|max:255',
        ]);

        $location->update($request->only('location'));

        return redirect()->back()->with('message', 'Location updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Location $location)
    {
        $location->delete();
        return redirect()->back()->with('message', 'Location deleted successfully');
    }
}
