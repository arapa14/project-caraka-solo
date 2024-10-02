<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;


class laporanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create(); // Initialize Faker instance

        for ($i=1; $i<12; $i++) {

            DB::table('laporans')->insert([
                'name' => $faker->name(),
                'description' => implode("\n", $faker->paragraphs(1)), // Convert array to string
                'location' => $faker->sentence(),
                'jumlah' => $faker->numberBetween(1, 3),
            ]);
        }
    }
}
