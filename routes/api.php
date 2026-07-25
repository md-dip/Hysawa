<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\WaterSourceController;
use App\Http\Controllers\Api\ChemicalTestController;
use App\Http\Controllers\Api\LocationController;

Route::prefix('v1')->group(function () {

    // Dashboard
    Route::get('/dashboard/summary',          [DashboardController::class,   'summary']);
    Route::get('/dashboard/quarterly-growth', [DashboardController::class,   'quarterlyGrowth']);

    // Water Sources
    Route::get('/water-sources/upazila-wise', [WaterSourceController::class, 'upazilaWise']);

    // Chemical Testing
    Route::get('/chemical-tests',             [ChemicalTestController::class,'index']);

    // Location Dropdowns
    Route::get('/locations/districts',        [LocationController::class,    'districts']);
    Route::get('/locations/upazilas',         [LocationController::class,    'upazilas']);
    Route::get('/locations/unions',           [LocationController::class,    'unions']);
    Route::get('/charts/institution-types', [DashboardController::class, 'institutionTypes']);
    Route::get('/charts/waterpoint-types',  [DashboardController::class, 'waterpointTypes']);
});