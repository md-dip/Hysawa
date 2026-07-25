<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // firstOrCreate prevents duplicate error
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name'     => 'Test User',
                'password' => bcrypt('password'),
            ]
        );
    }
}