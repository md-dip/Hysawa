<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\District;
use App\Models\Upazila;
use App\Models\Union;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function districts()
    {
        return response()->json(
            District::orderBy('name')->get(['id', 'name'])
        );
    }

    public function upazilas(Request $request)
    {
        $districtId = $request->query('district_id');
        return response()->json(
            Upazila::when($districtId, fn($q) => $q->where('district_id', $districtId))
                ->orderBy('name')->get(['id', 'name'])
        );
    }

    public function unions(Request $request)
    {
        $upazilaId = $request->query('upazila_id');
        return response()->json(
            Union::when($upazilaId, fn($q) => $q->where('upazila_id', $upazilaId))
                ->orderBy('name')->get(['id', 'name'])
        );
    }
}