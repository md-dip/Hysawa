<?php

namespace App\Http\Controllers;

use App\Models\WaterPoint;
use App\Http\Requests\StoreWaterPointRequest;
use App\Http\Requests\UpdateWaterPointRequest;
use Illuminate\Http\Request;

class WaterPointController extends Controller
{
    public function index()
    {
        return response()->json(
            WaterPoint::with('institution')
                ->orderByDesc('id')
                ->take(500)
                ->get(['id', 'institution_id', 'type', 'status', 'quarter', 'year'])
        );
    }

    public function create() {}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'institution_id' => 'required|exists:institutions,id',
            'type'           => 'required|string',
            'status'         => 'required|string',
            'quarter'        => 'required|integer|between:1,4',
            'year'           => 'required|integer|min:2000|max:2030',
        ]);

        $wp = WaterPoint::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Water point added successfully!',
            'data'    => $wp,
        ], 201);
    }

    public function show(WaterPoint $waterPoint)
    {
        return response()->json($waterPoint);
    }

    public function edit(WaterPoint $waterPoint) {}

    public function update(UpdateWaterPointRequest $request, WaterPoint $waterPoint) {}

    public function destroy(WaterPoint $waterPoint) {}
}