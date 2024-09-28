<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SwitchAccountController extends Controller
{
    public function switchAccount(Request $request, $id) {
        $user = Auth::user();
        $role = Auth::user()->role;
        if ($user && $role == 'Admin') {
            //SImpan ID pengguna asli di session sebelum switch
            session (['original_user_id' => $user->id]);

            //Login sebagai user lain dengan id yang dimasukkan
            auth()->guard('web')->loginUsingId($id);

            //Redirect ke halaman dashboard atau halaman lainnya
            return redirect()->route('dashboard');
        } 

        //Jika bukan admin, tampilkan error 403
        abort(403);
    }

    public function switchBack() {
        if (session()->has('original_user_id')) {
            //Ambil ID user asli dari session dan login kembali sebagai admin
            $originalUserId = session('original_user_id');
            auth()->guard('web')->loginUsingId($originalUserId);

            //Hapus ID user asli dari session
            session()->forget('original_user_id');

            //Redirect kembali ke halaman dashboard atau halaman lainnya
            return redirect()->route('dashboard');
        }

        //jika tidak ada ID asli di session, tampilkan error 403
        abort(403);
    }
};
