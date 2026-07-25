<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Institution extends Model
{
    use HasFactory;

    protected $fillable = [
        'water_point_id', 'arsenic', 'iron', 'manganese',
    'salinity', 'ph', 'arsenic_ok', 'iron_ok',
    'manganese_ok', 'salinity_ok', 'ph_ok', 'test_date'
    ];

    protected $casts = [
        'has_infrastructure' => 'boolean',
        'needs_repair'       => 'boolean',
    ];

    public function district()    { return $this->belongsTo(District::class); }
    public function upazila()     { return $this->belongsTo(Upazila::class); }
    public function union()       { return $this->belongsTo(Union::class); }
    public function waterPoints() { return $this->hasMany(WaterPoint::class); }
    public function students()    { return $this->hasMany(Student::class); }
}