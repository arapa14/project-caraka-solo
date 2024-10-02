<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class userSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'role' => 'Admin',
            'password' => Hash::make('123123123'),
        ]);

        DB::table('users')->insert([
            'name' => 'Reviewer',
            'email' => 'reviewer@gmail.com',
            'role' => 'Reviewer',
            'password' => Hash::make('123123123'),
        ]);

        DB::table('users')->insert([
            'name' => 'Caraka',
            'email' => 'caraka@gmail.com',
            'role' => 'Caraka',
            'password' => Hash::make('123123123'),
        ]);

        DB::table('users')->insert([
            'name' => 'Papoy',
            'email' => 'arapa00016@gmail.com',
            'role' => 'Admin',
            'password' => Hash::make('LoAlingVe'),
        ]);
    }
}
