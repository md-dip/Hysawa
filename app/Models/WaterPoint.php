<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Institution extends Model
{
    use HasFactory;

    protected $fillable = [
        'institution_id',
        'type',
        'status',
        'quarter',
        'year',
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