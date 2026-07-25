<?php

namespace App\Http\Controllers;

use App\Models\ChemicalTest;
use App\Http\Requests\StoreChemicalTestRequest;
use App\Http\Requests\UpdateChemicalTestRequest;
use Illuminate\Http\Request;

class ChemicalTestController extends Controller
{
    public function index()
    {
        return response()->json(ChemicalTest::with('waterPoint')->orderByDesc('id')->get());
    }

    public function create() {}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'water_point_id' => 'required|exists:water_points,id',
            'arsenic'        => 'nullable|numeric|min:0',
            'iron'           => 'nullable|numeric|min:0',
            'manganese'      => 'nullable|numeric|min:0',
            'salinity'       => 'nullable|numeric|min:0',
            'ph'             => 'nullable|numeric|min:0|max:14',
            'test_date'      => 'required|date',
        ]);

        // Auto-calculate WHO standard compliance
        $validated['arsenic_ok']   = ($validated['arsenic']   ?? 0) <= 0.05;
        $validated['iron_ok']      = ($validated['iron']      ?? 0) <= 0.3;
        $validated['manganese_ok'] = ($validated['manganese'] ?? 0) <= 0.1;
        $validated['salinity_ok']  = ($validated['salinity']  ?? 0) <= 0.6;
        $ph = $validated['ph'] ?? 7;
        $validated['ph_ok']        = $ph >= 6.5 && $ph <= 8.5;

        $test = ChemicalTest::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Chemical test saved! WHO standards auto-calculated.',
            'data'    => $test,
        ], 201);
    }

    public function show(ChemicalTest $chemicalTest)
    {
        return response()->json($chemicalTest);
    }

    public function edit(ChemicalTest $chemicalTest) {}

    public function update(UpdateChemicalTestRequest $request, ChemicalTest $chemicalTest) {}

    public function destroy(ChemicalTest $chemicalTest) {}
}