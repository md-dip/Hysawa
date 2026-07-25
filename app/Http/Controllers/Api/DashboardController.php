<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Institution;
use App\Models\WaterPoint;
use App\Models\Student;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function summary(Request $request)
    {
        $districtId = $request->query('district_id');

        $totalInstitutions = Institution::query()
            ->when($districtId, fn($q) => $q->where('district_id', $districtId))
            ->count();

        $students = Student::query()
            ->when($districtId, fn($q) => $q->whereHas('institution',
                fn($q2) => $q2->where('district_id', $districtId)
            ))
            ->selectRaw('SUM(girls_count) as girls, SUM(boys_count) as boys')
            ->first();

        $totalWaterPoints = WaterPoint::query()
            ->when($districtId, fn($q) => $q->whereHas('institution',
                fn($q2) => $q2->where('district_id', $districtId)
            ))
            ->count();

        $waterPointTypes = WaterPoint::query()
            ->when($districtId, fn($q) => $q->whereHas('institution',
                fn($q2) => $q2->where('district_id', $districtId)
            ))
            ->selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
            ->get()
            ->keyBy('type');

        return response()->json([
            'total_institutions' => $totalInstitutions,
            'students' => [
                'total' => ($students->girls ?? 0) + ($students->boys ?? 0),
                'girls' => $students->girls ?? 0,
                'boys'  => $students->boys  ?? 0,
            ],
            'water_points' => [
                'total'                => $totalWaterPoints,
                'shallow_tubewell'     => $waterPointTypes['shallow_tubewell']->count ?? 0,
                'piped_water'          => $waterPointTypes['piped_water']->count ?? 0,
                'rainwater_harvesting' => $waterPointTypes['rainwater_harvesting']->count ?? 0,
                'reverse_osmosis'      => $waterPointTypes['reverse_osmosis']->count ?? 0,
            ],
            'alerts' => [
                'inactive_institutions' => Institution::where('status', 'inactive')
                    ->when($districtId, fn($q) => $q->where('district_id', $districtId))->count(),
                'no_infrastructure'     => Institution::where('has_infrastructure', false)
                    ->when($districtId, fn($q) => $q->where('district_id', $districtId))->count(),
                'no_functional_source'  => WaterPoint::where('status', 'non_functional')
                    ->when($districtId, fn($q) => $q->whereHas('institution',
                        fn($q2) => $q2->where('district_id', $districtId)))->count(),
                'no_drinking_source'    => WaterPoint::where('status', 'no_drinking_source')
                    ->when($districtId, fn($q) => $q->whereHas('institution',
                        fn($q2) => $q2->where('district_id', $districtId)))->count(),
                'under_construction'    => Institution::where('status', 'under_construction')
                    ->when($districtId, fn($q) => $q->where('district_id', $districtId))->count(),
                'needs_repair'          => Institution::where('needs_repair', true)
                    ->when($districtId, fn($q) => $q->where('district_id', $districtId))->count(),
            ],
        ]);
    }

    public function quarterlyGrowth(Request $request)
    {
        $institutionType = $request->query('institution_type');

        $data = WaterPoint::query()
            ->when($institutionType, fn($q) => $q->whereHas('institution',
                fn($q2) => $q2->where('type', $institutionType)
            ))
            ->selectRaw('year, quarter, COUNT(*) as total')
            ->groupBy('year', 'quarter')
            ->orderBy('year')->orderBy('quarter')
            ->get()
            ->map(fn($row) => [
                'label' => "Q{$row->quarter}-{$row->year}",
                'total' => $row->total,
            ]);

        return response()->json($data);
    }
    public function institutionTypes(Request $request)
{
    $districtId = $request->query('district_id');
    $upazilaId  = $request->query('upazila_id');
    $unionId    = $request->query('union_id');

    $data = Institution::query()
        ->when($districtId, fn($q) => $q->where('district_id', $districtId))
        ->when($upazilaId,  fn($q) => $q->where('upazila_id',  $upazilaId))
        ->when($unionId,    fn($q) => $q->where('union_id',    $unionId))
        ->selectRaw('type, COUNT(*) as count')
        ->groupBy('type')
        ->orderByDesc('count')
        ->get();

    return response()->json([
        'total'     => $data->sum('count'),
        'breakdown' => $data,
    ]);
}

    public function waterpointTypes(Request $request)
    {
        $districtId = $request->query('district_id');
        $upazilaId  = $request->query('upazila_id');
        $unionId    = $request->query('union_id');

        $data = WaterPoint::query()
            ->join('institutions','water_points.institution_id','=','institutions.id')
            ->when($districtId, fn($q) => $q->where('institutions.district_id', $districtId))
            ->when($upazilaId,  fn($q) => $q->where('institutions.upazila_id',  $upazilaId))
            ->when($unionId,    fn($q) => $q->where('institutions.union_id',    $unionId))
            ->selectRaw('water_points.type, COUNT(*) as count')
            ->groupBy('water_points.type')
            ->orderByDesc('count')
            ->get();

        return response()->json([
            'total'     => $data->sum('count'),
            'breakdown' => $data,
        ]);
    }
}