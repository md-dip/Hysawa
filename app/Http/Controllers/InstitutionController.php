<?php

namespace App\Http\Controllers;

use App\Models\Institution;
use App\Http\Requests\StoreInstitutionRequest;
use App\Http\Requests\UpdateInstitutionRequest;
use Illuminate\Http\Request;

class InstitutionController extends Controller
{
    public function index()
    {
        return response()->json(
            Institution::with(['district', 'upazila'])
                ->orderBy('name')
                ->get(['id', 'name', 'type', 'district_id', 'upazila_id'])
        );
    }

    public function create() {}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'district_id'        => 'required|exists:districts,id',
            'upazila_id'         => 'required|exists:upazilas,id',
            'union_id'           => 'nullable|exists:unions,id',
            'name'               => 'required|string|max:255',
            'type'               => 'required|string',
            'status'             => 'required|string',
            'has_infrastructure' => 'boolean',
            'needs_repair'       => 'boolean',
        ]);

        $institution = Institution::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Institution added successfully!',
            'data'    => $institution,
        ], 201);
    }

    public function show(Institution $institution)
    {
        return response()->json($institution);
    }

    public function edit(Institution $institution) {}

    public function update(UpdateInstitutionRequest $request, Institution $institution) {}

    public function destroy(Institution $institution) {}
}