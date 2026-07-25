<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChemicalTest;
use Illuminate\Http\Request;

class ChemicalTestController extends Controller
{
    public function index(Request $request)
    {
        $query = ChemicalTest::query()
            ->join('water_points', 'chemical_tests.water_point_id', '=', 'water_points.id')
            ->join('institutions', 'water_points.institution_id',   '=', 'institutions.id')
            ->when($request->district_id,     fn($q) => $q->where('institutions.district_id', $request->district_id))
            ->when($request->upazila_id,      fn($q) => $q->where('institutions.upazila_id',  $request->upazila_id))
            ->when($request->union_id,        fn($q) => $q->where('institutions.union_id',     $request->union_id))
            ->when($request->waterpoint_type, fn($q) => $q->where('water_points.type',         $request->waterpoint_type));

        $results = [];
        foreach (['arsenic', 'iron', 'manganese', 'salinity', 'ph'] as $param) {
            $within  = (clone $query)->where("{$param}_ok", true)->count();
            $exceeds = (clone $query)->where("{$param}_ok", false)->count();
            $results[] = [
                'parameter' => ucfirst($param),
                'within'    => $within,
                'exceeds'   => $exceeds,
            ];
        }

        return response()->json($results);
    }
}