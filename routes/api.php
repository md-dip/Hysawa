<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\WaterSourceController;
use App\Http\Controllers\Api\ChemicalTestController as ApiChemicalTestController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\InstitutionController;
use App\Http\Controllers\WaterPointController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\ChemicalTestController;

Route::prefix('v1')->group(function () {

    // ── Dashboard Charts ──
    Route::get('/dashboard/summary',          [DashboardController::class,       'summary']);
    Route::get('/dashboard/quarterly-growth', [DashboardController::class,       'quarterlyGrowth']);
    Route::get('/charts/institution-types',   [DashboardController::class,       'institutionTypes']);
    Route::get('/charts/waterpoint-types',    [DashboardController::class,       'waterpointTypes']);

    // ── Water Sources ──
    Route::get('/water-sources/upazila-wise', [WaterSourceController::class,     'upazilaWise']);

    // ── Chemical Testing (Charts) ──
    Route::get('/chemical-tests',             [ApiChemicalTestController::class, 'index']);

    // ── Location Dropdowns ──
    Route::get('/locations/districts',        [LocationController::class,        'districts']);
    Route::get('/locations/upazilas',         [LocationController::class,        'upazilas']);
    Route::get('/locations/unions',           [LocationController::class,        'unions']);

    // ── Data Entry — GET (for dropdowns) ──
    Route::get('/institutions-list',          [InstitutionController::class,     'index']);
    Route::get('/water-points-list',          [WaterPointController::class,      'index']);

    // ── Data Entry — POST (save to DB) ──
    Route::post('/institutions',              [InstitutionController::class,     'store']);
    Route::post('/water-points',              [WaterPointController::class,      'store']);
    Route::post('/students',                  [StudentController::class,         'store']);
    Route::post('/chemical-tests-add',        [ChemicalTestController::class,    'store']);
});