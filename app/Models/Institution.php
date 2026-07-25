<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Institution extends Model
{
    use HasFactory;

    protected $fillable = [
        'district_id',
        'upazila_id',
        'union_id',
        'name',
        'type',
        'status',
        'has_infrastructure',
        'needs_repair',
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