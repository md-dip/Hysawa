<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->integer('girls_count')->default(0);
            $table->integer('boys_count')->default(0);
            $table->integer('year');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('students');
    }
};