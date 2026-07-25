<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WaterPoint;
use App\Models\ChemicalTest;

class ChemicalTestSeeder extends Seeder
{
    public function run(): void
    {
        $waterPoints = WaterPoint::all();

        foreach ($waterPoints as $wp) {
            $arsenic   = rand(1, 120)  / 1000; // mg/L
            $iron      = rand(10, 600) / 1000;
            $manganese = rand(1, 200)  / 1000;
            $salinity  = rand(1, 900)  / 1000;
            $ph        = rand(55, 95)  / 10;

            ChemicalTest::create([
                'water_point_id' => $wp->id,
                'arsenic'        => $arsenic,
                'iron'           => $iron,
                'manganese'      => $manganese,
                'salinity'       => $salinity,
                'ph'             => $ph,
                // WHO Standards
                'arsenic_ok'    => $arsenic   <= 0.05,
                'iron_ok'       => $iron      <= 0.3,
                'manganese_ok'  => $manganese <= 0.1,
                'salinity_ok'   => $salinity  <= 0.6,
                'ph_ok'         => $ph >= 6.5 && $ph <= 8.5,
                'test_date'     => now()->subDays(rand(1, 365))->toDateString(),
            ]);
        }
    }
}