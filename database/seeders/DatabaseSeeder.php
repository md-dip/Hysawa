<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\District;
use App\Models\Upazila;
use App\Models\Union;
use App\Models\Institution;
use App\Models\WaterPoint;
use App\Models\Student;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')]
        );

        $district = District::create(['name' => 'Khulna']);

        $upazilas = [
            ['name' => 'Dumuria',    'count' => 263],
            ['name' => 'Dacope',     'count' => 188],
            ['name' => 'Paikgacha', 'count' => 180],
            ['name' => 'Koyra',     'count' => 165],
            ['name' => 'Batiaghata','count' => 117],
            ['name' => 'Terokhada', 'count' => 111],
        ];

        $wpTypes = [
            'shallow_tubewell',
            'piped_water',
            'rainwater_harvesting',
            'reverse_osmosis'
        ];

        $statuses = ['active', 'active', 'active', 'active', 'inactive', 'under_construction'];

        foreach ($upazilas as $upazilaData) {
            $upazila = Upazila::create([
                'district_id' => $district->id,
                'name'        => $upazilaData['name'],
            ]);

            $union = Union::create([
                'upazila_id' => $upazila->id,
                'name'       => $upazilaData['name'] . ' Union 1',
            ]);

            for ($j = 0; $j < $upazilaData['count']; $j++) {
                $status = $statuses[array_rand($statuses)];

                $institution = Institution::create([
                    'district_id'       => $district->id,
                    'upazila_id'        => $upazila->id,
                    'union_id'          => $union->id,
                    'name'              => $upazilaData['name'] . ' School ' . ($j + 1),
                    'type'              => 'school',
                    'status'            => $status,
                    'has_infrastructure'=> rand(0, 10) > 1,
                    'needs_repair'      => rand(0, 10) < 2,
                ]);

                $waterPoint = WaterPoint::create([
                    'institution_id' => $institution->id,
                    'type'           => $wpTypes[array_rand($wpTypes)],
                    'status'         => 'functional',
                    'quarter'        => rand(1, 4),
                    'year'           => rand(2022, 2026),
                ]);

                Student::create([
                    'institution_id' => $institution->id,
                    'girls_count'    => rand(50, 300),
                    'boys_count'     => rand(50, 300),
                    'year'           => 2026,
                ]);
            }
        }
    }
}