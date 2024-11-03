<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('laporans', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // Menambahkan kolom user_id
            $table->string('name');
            $table->string('description');
            $table->string('location');
            $table->enum('waktu', ['Pagi', 'Siang', 'Sore', 'Invalid'])->default('Invalid');
            $table->string('image');
            $table->enum('status', ['Pending', 'unApproved', 'Approved'])->default('Pending');
            $table->timestamps();

            // Menambahkan foreign key constraint untuk user_id
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('laporans', function (Blueprint $table) {
            if (Schema::hasColumn('laporans', 'user_id')) {
                $table->dropForeign(['user_id']); // Menghapus foreign key jika ada
            }
        });
        Schema::dropIfExists('laporans');
    }
    
};
