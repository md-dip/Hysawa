<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WaterPoint;
use Illuminate\Http\Request;

class WaterSourceController extends Controller
{
    public function upazilaWise(Request $request)
    {
        $data = WaterPoint::query()
            ->join('institutions', 'water_points.institution_id', '=', 'institutions.id')
            ->join('upazilas', 'institutions.upazila_id', '=', 'upazilas.id')
            ->when($request->district_id,      fn($q) => $q->where('institutions.district_id', $request->district_id))
            ->when($request->upazila_id,       fn($q) => $q->where('institutions.upazila_id',  $request->upazila_id))
            ->when($request->union_id,         fn($q) => $q->where('institutions.union_id',     $request->union_id))
            ->when($request->institution_type, fn($q) => $q->where('institutions.type',         $request->institution_type))
            ->when($request->waterpoint_type,  fn($q) => $q->where('water_points.type',         $request->waterpoint_type))
            ->selectRaw('upazilas.name as upazila, COUNT(water_points.id) as total')
            ->groupBy('upazilas.id', 'upazilas.name')
            ->orderByDesc('total')
            ->get();

        return response()->json($data);
    }
}