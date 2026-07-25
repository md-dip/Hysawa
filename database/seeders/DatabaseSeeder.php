<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{User, District, Upazila, Union, Institution, WaterPoint, Student};

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')]
        );

        $district = District::create(['name' => 'Khulna']);

        $upazilaData = [
            ['name' => 'Dumuria',    'count' => 263],
            ['name' => 'Dacope',     'count' => 188],
            ['name' => 'Paikgacha', 'count' => 180],
            ['name' => 'Koyra',     'count' => 165],
            ['name' => 'Batiaghata','count' => 117],
            ['name' => 'Terokhada', 'count' => 111],
        ];

        // Weighted institution types (matching reference percentages)
        $schoolTypes = [
            'primary_school', 'primary_school', 'primary_school',
            'primary_school', 'secondary_school', 'secondary_school', 'madrasa'
        ];
        $hcfTypes = [
            'community_clinic', 'community_clinic', 'community_clinic',
            'health_family_planning'
        ];
        // Weighted waterpoint types (matching reference)
        $wpTypes = [
            'deep_tubewell', 'deep_tubewell', 'deep_tubewell',
            'rainwater_harvesting', 'rainwater_harvesting',
            'shallow_tubewell', 'reverse_osmosis', 'piped_water'
        ];
        $statuses = ['active','active','active','active','inactive','under_construction'];

        foreach ($upazilaData as $upData) {
            $upazila = Upazila::create(['district_id' => $district->id, 'name' => $upData['name']]);
            $union   = Union::create(['upazila_id' => $upazila->id, 'name' => $upData['name'].' Union 1']);

            // ~88% schools, ~10% healthcare, ~2% community
            $schoolCount = (int)($upData['count'] * 0.88);
            $hcfCount    = (int)($upData['count'] * 0.10);
            $commCount   = $upData['count'] - $schoolCount - $hcfCount;

            // Schools
            for ($j = 0; $j < $schoolCount; $j++) {
                $inst = Institution::create([
                    'district_id'        => $district->id,
                    'upazila_id'         => $upazila->id,
                    'union_id'           => $union->id,
                    'name'               => $upData['name'].' School '.($j+1),
                    'type'               => $schoolTypes[array_rand($schoolTypes)],
                    'status'             => $statuses[array_rand($statuses)],
                    'has_infrastructure' => rand(0,10) > 1,
                    'needs_repair'       => rand(0,10) < 2,
                ]);
                WaterPoint::create([
                    'institution_id' => $inst->id,
                    'type'    => $wpTypes[array_rand($wpTypes)],
                    'status'  => 'functional',
                    'quarter' => rand(1,4),
                    'year'    => rand(2022,2026),
                ]);
                Student::create([
                    'institution_id' => $inst->id,
                    'girls_count'    => rand(50,300),
                    'boys_count'     => rand(50,300),
                    'year'           => 2026,
                ]);
            }

            // Healthcare
            for ($j = 0; $j < $hcfCount; $j++) {
                $inst = Institution::create([
                    'district_id'        => $district->id,
                    'upazila_id'         => $upazila->id,
                    'union_id'           => $union->id,
                    'name'               => $upData['name'].' HCF '.($j+1),
                    'type'               => $hcfTypes[array_rand($hcfTypes)],
                    'status'             => 'active',
                    'has_infrastructure' => true,
                    'needs_repair'       => false,
                ]);
                WaterPoint::create([
                    'institution_id' => $inst->id,
                    'type'    => $wpTypes[array_rand($wpTypes)],
                    'status'  => 'functional',
                    'quarter' => rand(1,4),
                    'year'    => rand(2022,2026),
                ]);
            }

            // Community
            for ($j = 0; $j < $commCount; $j++) {
                $inst = Institution::create([
                    'district_id'        => $district->id,
                    'upazila_id'         => $upazila->id,
                    'union_id'           => $union->id,
                    'name'               => $upData['name'].' Community '.($j+1),
                    'type'               => 'community',
                    'status'             => 'active',
                    'has_infrastructure' => true,
                    'needs_repair'       => false,
                ]);
                WaterPoint::create([
                    'institution_id' => $inst->id,
                    'type'    => $wpTypes[array_rand($wpTypes)],
                    'status'  => 'functional',
                    'quarter' => rand(1,4),
                    'year'    => rand(2022,2026),
                ]);
            }
        }
    }
}