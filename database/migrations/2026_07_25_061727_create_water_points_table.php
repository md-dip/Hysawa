<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('water_points', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->string('type'); // shallow_tubewell | piped_water | rainwater_harvesting | reverse_osmosis
            $table->string('status')->default('functional');
            $table->integer('quarter');
            $table->integer('year');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('water_points');
    }
};