<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Factory as Faker;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Laporan>
 */
class LaporanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $faker = Faker::create(); // Initialize Faker instance
        return [
            'name' => $faker->name(),
            'description' => implode("\n", $faker->paragraphs(1)), // Convert array to string
            'location' => $faker->text(10),
            'jumlah' => $faker->numberBetween(1, 3), 
        ];
    }
}
