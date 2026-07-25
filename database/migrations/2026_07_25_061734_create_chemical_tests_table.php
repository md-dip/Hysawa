<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('chemical_tests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('water_point_id')->constrained()->onDelete('cascade');
            $table->float('arsenic')->nullable();
            $table->float('iron')->nullable();
            $table->float('manganese')->nullable();
            $table->float('salinity')->nullable();
            $table->float('ph')->nullable();
            $table->boolean('arsenic_ok')->default(true);
            $table->boolean('iron_ok')->default(true);
            $table->boolean('manganese_ok')->default(true);
            $table->boolean('salinity_ok')->default(true);
            $table->boolean('ph_ok')->default(true);
            $table->date('test_date');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('chemical_tests');
    }
};